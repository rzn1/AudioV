// Run with: npm test   (Node >= 22.6, uses --experimental-strip-types; no framework needed)
import assert from 'node:assert/strict';
import {
    computeOnsetEnvelope, fitBeatGrid, detectDownbeatPhase, detectKey, describeKey, fitLocalGrid, chooseMixPoints, snapMixPoints
} from '../app/utils/audioAnalysis.ts';
import { posAt, timeAt, planTransition, fitTransition, orderTracks, keyScore, effectiveMixOut } from '../app/utils/mixPlanner.ts';

const sr = 22050;
let passed = 0;
const test = (name: string, fn: () => void) => {
    fn();
    passed++;
    console.log('ok  -', name);
};
const mod = (x: number, m: number) => ((x % m) + m) % m;
const circ = (d: number, m: number) => { d = mod(d, m); return d > m / 2 ? d - m : d; };

/** Kick drum track; `beatTimes` gives each beat, every 4th starting at `downbeat` is accented. */
function kicks(beatTimes: number[], secs: number, downbeat: number) {
    const x = new Float32Array(Math.floor(sr * secs));
    beatTimes.forEach((bt, k) => {
        const t0 = Math.floor(bt * sr);
        const amp = k % 4 === downbeat ? 1.0 : 0.6;
        for (let i = 0; i < 0.15 * sr && t0 + i < x.length; i++) {
            const t = i / sr;
            x[t0 + i] += amp * Math.sin(2 * Math.PI * (50 + 100 * Math.exp(-t * 30)) * t) * Math.exp(-t * 18);
        }
    });
    return x;
}
const constantBeats = (bpm: number, offset: number, secs: number) => {
    const out: number[] = [];
    for (let t = offset; t < secs - 0.3; t += 60 / bpm) out.push(t);
    return out;
};

test('beat grid: fitted tempo/offset beat the integer-BPM guess, downbeat found', () => {
    for (const [bpm, off, db] of [[127.6, 0.31, 2], [93.4, 0.12, 0], [140.0, 0.4, 3]] as const) {
        const x = kicks(constantBeats(bpm, off, 90), 90, db);
        const env = computeOnsetEnvelope(x, sr);
        for (const guess of [Math.round(bpm), 0]) { // with the library's rounded guess, and without any guess
            const g = fitBeatGrid(env.onset, env.rate, guess);
            assert.ok(Math.abs(g.tempo - bpm) < 0.03, `tempo ${g.tempo} vs ${bpm}`);
            assert.ok(Math.abs(circ(g.offset - off, 60 / bpm)) < 0.012, `offset ${g.offset} vs ${off}`);
            assert.equal(detectDownbeatPhase(env, g.tempo, g.offset).phase, db);
        }
    }
});

test('local grid follows a drifting tempo where the global grid cannot', () => {
    // tempo ramps 120 -> 128 BPM over 120 s
    const beats: number[] = [];
    for (let t = 0.2; t < 119.7; t += 60 / (120 + 8 * (t / 120))) beats.push(t);
    const x = kicks(beats, 120, 0);
    const env = computeOnsetEnvelope(x, sr);
    const global = fitBeatGrid(env.onset, env.rate, 124);
    const from = 90;
    const to = 118;
    const local = fitLocalGrid(x, sr, from, to, global.tempo, global.offset)!;
    assert.ok(local, 'local fit exists');
    const trueTempo = 120 + 8 * (104 / 120);
    assert.ok(Math.abs(local.tempo - trueTempo) < 1.0, `local tempo ${local.tempo} vs ${trueTempo}`);
    // the beat nearest the middle of the window must sit on an actual kick
    const mid = (from + to) / 2;
    const beatLen = 60 / local.tempo;
    const tb = local.firstBeat + Math.round((mid - local.firstBeat) / beatLen) * beatLen;
    const nearest = beats.reduce((m, b) => (Math.abs(b - tb) < Math.abs(m - tb) ? b : m), beats[0]!);
    assert.ok(Math.abs(nearest - tb) < 0.025, `local beat ${tb} is ${(nearest - tb) * 1000}ms from a real kick`);
});

test('mix points are phrase-aligned downbeats on the local grids', () => {
    const x = kicks(constantBeats(128, 0.25, 150), 150, 1);
    const env = computeOnsetEnvelope(x, sr);
    const g = fitBeatGrid(env.onset, env.rate, 128);
    const d = detectDownbeatPhase(env, g.tempo, g.offset);
    const firstDownbeat = g.offset + (d.phase * 60) / g.tempo;
    const m = chooseMixPoints(x, sr, { tempo: g.tempo, offset: g.offset, phase: d.phase, firstDownbeat }, { start: 10, end: 130 }, 150);
    const phrase = (8 * 60) / g.tempo;
    assert.ok(Math.abs(circ(m.mixIn - firstDownbeat, phrase)) < 0.03, 'mixIn on a phrase boundary');
    assert.ok(Math.abs(circ(m.mixOut - firstDownbeat, phrase)) < 0.03, 'mixOut on a phrase boundary');
    assert.ok(m.mixOut <= 150 && m.mixOut - m.mixIn > 60);
    const s = snapMixPoints({ firstDownbeat: 1.1, tempo: 128, rawStart: 14, rawEnd: 200, duration: 205 });
    assert.ok(s.mixOut <= 205 && s.mixIn >= 1.1);
});

test('key detection + camelot', () => {
    const tone = (chord: number[]) => {
        const x = new Float32Array(sr * 40);
        for (let i = 0; i < x.length; i++) for (const f of chord) x[i] += 0.1 * Math.sin((2 * Math.PI * f * i) / sr);
        return x;
    };
    const am = detectKey(tone([110.0, 130.81, 164.81, 220.0, 261.63, 329.63]), sr);
    assert.deepEqual([describeKey(am).camelot, am.confidence > 0.35], ['8A', true]);
    const c = detectKey(tone([130.81, 164.81, 196.0, 261.63, 329.63, 392.0]), sr);
    assert.equal(describeKey(c).camelot, '8B');
});

test('timeline: posAt / timeAt are inverse and continuous', () => {
    for (const tl of [
        { t0: 10, p0: 5, rate: 1.04, holdUntil: 25, rampDur: 2 },
        { t0: 10, p0: 5, rate: 0.93, holdUntil: 25, rampDur: 3 },
        { t0: 10, p0: 5, rate: 1, holdUntil: 10, rampDur: 0 }
    ]) {
        for (let p = 5; p < 120; p += 0.37) assert.ok(Math.abs(posAt(tl, timeAt(tl, p)) - p) < 1e-9);
        assert.ok(Math.abs(posAt(tl, tl.holdUntil + 1e-6) - posAt(tl, tl.holdUntil - 1e-6)) < 1e-5);
    }
});

const key = (root: number, mode: 'major' | 'minor', confidence = 0.8) => ({ root, mode, confidence, ...describeKey({ root, mode }) });
const mk = (tempo: number, k?: ReturnType<typeof key>, e = 0.1) =>
    ({ tempoIn: tempo, tempoOut: tempo, mixIn: 8, mixOut: 200, key: k, introEnergy: e, outroEnergy: e, energy: e });

test('planner: style / length / rate per kind of pair', () => {
    const same = planTransition(mk(128, key(9, 'minor')), mk(128, key(9, 'minor')));
    assert.deepEqual([same.style, same.beats, same.rate], ['blend', 64, 1]);
    assert.equal(planTransition(mk(128, key(9, 'minor')), mk(128, key(9, 'minor')), { maxBeats: 32 }).beats, 32);

    const clash = planTransition(mk(128, key(9, 'minor')), mk(126, key(6, 'minor')));
    assert.deepEqual([clash.style, clash.beats], ['swap', 16]); // melodic clash -> shorter overlap

    const half = planTransition(mk(140, key(9, 'minor')), mk(70, key(9, 'minor')));
    assert.ok(half.style !== 'cut' && Math.abs(half.rate - 1) < 0.001, 'half-time is matched without stretching');

    const gap = planTransition(mk(100, key(9, 'minor')), mk(170, key(9, 'minor')));
    assert.deepEqual([gap.style, gap.beats, gap.rate], ['echo', 32, 1]); // too far apart to beat-match: never a hard cut

    const near = planTransition(mk(128), mk(124));
    assert.ok(Math.abs(near.rate - 128 / 124) < 1e-9 && near.rate - 1 < 0.08);

    assert.ok(keyScore(key(9, 'minor'), key(9, 'minor')) > keyScore(key(9, 'minor'), key(6, 'minor')));
    // a quiet intro under a loud outro is boosted, a louder one is pulled down
    assert.ok(planTransition({ ...mk(128), outroEnergy: 0.2 }, { ...mk(128), introEnergy: 0.1 }).gain > 1);
    assert.ok(planTransition({ ...mk(128), outroEnergy: 0.1 }, { ...mk(128), introEnergy: 0.2 }).gain < 1);
});

test('planner: transition is fitted to the available time', () => {
    const tl = { t0: 100, p0: 8, rate: 1, holdUntil: 100, rampDur: 0 };
    const a = mk(128, key(9, 'minor'));
    const plan = planTransition(a, mk(128, key(9, 'minor')));
    const end = 100 + (200 - 8);
    const full = fitTransition(plan, a, tl, 110);
    assert.equal(full.beats, 64);
    assert.ok(Math.abs(full.T0 + full.length - end) < 1e-9, 'ends exactly on the mix-out point');
    assert.equal(full.bStart, full.T0);
    assert.equal(fitTransition(plan, a, tl, end - 12).beats, 16); // shortened
    const cut = fitTransition(plan, a, tl, end - 1); // no room left -> unaligned cut
    assert.deepEqual([cut.beats, cut.plan.style], [0, 'cut']);

    // echo: the incoming track enters half way through, on a bar of the outgoing track
    const echo = fitTransition(planTransition(a, mk(170, key(9, 'minor'))), a, tl, 110);
    assert.equal(echo.plan.style, 'echo');
    assert.ok(Math.abs(echo.bStart - (echo.T0 + echo.length / 2)) < 1e-9);
    assert.ok(Math.abs(((echo.bStart - echo.T0) / (4 * 60 / 128)) % 1) < 1e-9, 'entry is on a bar');
});

test('mix-out lead: moves the exit back by whole phrases and keeps enough material', () => {
    const m = { mixIn: 10, mixOut: 200, tempoOut: 128 };
    const phrase = (8 * 60) / 128;
    assert.equal(effectiveMixOut(m, 0), 200);
    const e = effectiveMixOut(m, 20);
    assert.ok(e < 200 && e >= 200 - 20 - phrase, `lead ${200 - e}`);
    assert.ok(Math.abs(((200 - e) / phrase) % 1) < 1e-9, 'whole phrases');
    assert.ok(effectiveMixOut({ mixIn: 10, mixOut: 60, tempoOut: 128 }, 24) >= 10 + 8 * phrase, 'short tracks keep 8 phrases');
});

test('ordering: lowers total cost, keeps the played head, is a permutation', () => {
    let seed = 7;
    const rnd = () => (seed = (seed * 16807) % 2147483647) / 2147483647;
    const metas = Array.from({ length: 12 }, () =>
        mk(Math.round(80 + rnd() * 90), key(Math.floor(rnd() * 12), rnd() < 0.5 ? 'minor' : 'major'), 0.05 + rnd() * 0.2));
    const cost = (o: number[]) => o.slice(1).reduce((s, i, k) => s + 1 - planTransition(metas[o[k]!]!, metas[i]!).score, 0);
    const ident = metas.map((_, i) => i);
    const ordered = orderTracks(metas, 0);
    assert.equal(new Set(ordered).size, 12);
    assert.ok(cost(ordered) < cost(ident));
    assert.deepEqual(orderTracks(metas, 3).slice(0, 3), [0, 1, 2]);
});

console.log(`\n${passed} tests passed`);
