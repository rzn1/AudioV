// Run with: npm test   (Node >= 22.6, uses --experimental-strip-types; no framework needed)
import assert from 'node:assert/strict';
import {
    computeOnsetEnvelope, fitBeatGrid, detectDownbeatPhase, detectKey, describeKey, fitLocalGrid, chooseMixPoints, snapMixPoints
} from '../app/utils/audioAnalysis.ts';
import { keyPalette, hueDistance, hashString } from '../app/utils/palette.ts';
import { accessMode, importEnabled, codesMatch } from '../server/utils/access.ts';
import { retryAfterSeconds, sanitizeMessage, pcmToWav, isWav } from '../server/utils/http.ts';
import { buildDeepgramTts, deepgramHeaders, DEEPGRAM_VOICES, DEFAULT_DEEPGRAM_VOICE } from '../server/utils/deepgram.ts';
import { buildWordingRequest, parseWordingResponse, splitVersions, WORDING_SYSTEM } from '../server/utils/wording.ts';
import { isValidCloudSkeleton, parseTrackName, tidyName, sayTrack, SKELETONS, rolesConsistent, isSameLine, cleanLine, isValidSkeleton, pickSkeleton, fillSkeleton, templateLine, buildMessages, pickSpeechStart, shouldSpeak } from '../app/utils/djScript.ts';
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

test('palette: compatible keys are neighbouring hues, clashes are far apart', () => {
    const k = (camelot: string, confidence = 0.8) => ({ root: 0, mode: camelot.endsWith('A') ? 'minor' as const : 'major' as const, confidence, camelot, name: camelot });
    const hue = (c: string) => keyPalette(k(c))!.a[0];
    assert.ok(Math.abs(hueDistance(hue('8A'), hue('9A')) - 1 / 12) < 1e-9, 'adjacent wheel numbers are 30 degrees apart');
    assert.equal(hue('8A'), hue('8B'), 'relative major/minor share a hue');
    assert.ok(hueDistance(hue('8A'), hue('2A')) > 0.45, 'opposite side of the wheel');
    assert.equal(keyPalette(k('8A', 0.2)), null, 'unsure keys fall back to the vibe palette');
    assert.equal(hashString('a.mp3'), hashString('a.mp3'));
    assert.notEqual(hashString('a.mp3'), hashString('b.mp3'));
});

test('dj: track names are parsed into artist / title', () => {
    assert.deepEqual(parseTrackName('Kendrick Lamar & SZA - luther.mp3'), { artist: 'Kendrick Lamar & SZA', title: 'luther' });
    assert.deepEqual(parseTrackName('Trippie Redd - Death Ft. DaBaby Lyrics.mp3'), { artist: 'Trippie Redd', title: 'Death Ft. DaBaby' });
    assert.deepEqual(parseTrackName('Artist - Song (Official Video).mp3'), { artist: 'Artist', title: 'Song' });
    assert.deepEqual(parseTrackName('fading.mp3'), { title: 'fading' });
    assert.deepEqual(parseTrackName('Lady Gaga, Bruno Mars - Die With A Smile.mp3'), { artist: 'Lady Gaga, Bruno Mars', title: 'Die With A Smile' });
});

test('dj: announcements are skeletons; names are filled in by code, never by the model', () => {
    const facts = { prev: { artist: 'The Weeknd, Playboi Carti', title: 'Timeless' }, next: { artist: 'Kendrick Lamar & SZA', title: 'luther' } };
    assert.equal(fillSkeleton('That was {prev}. Up next, {next}.', facts), 'That was Timeless by The Weeknd, Playboi Carti. Up next, luther by Kendrick Lamar and SZA.');
    assert.equal(fillSkeleton('Keeping it going with {next}.', { ...facts, next: { title: 'Open Road' } }), 'Keeping it going with Open Road.');
    assert.notEqual(pickSkeleton(0), pickSkeleton(0.5));
    for (let i = 0; i < 6; i++) assert.ok(isValidSkeleton(pickSkeleton(i / 6)), 'every built-in skeleton passes its own validation');
    assert.equal(templateLine(facts, 0), fillSkeleton(pickSkeleton(0), facts));
    const m = buildMessages('That was {prev}. Up next, {next}.');
    assert.equal(m[0]!.role, 'system');
    assert.deepEqual([m.at(-1)!.role, m.at(-1)!.content], ['user', 'That was {prev}. Up next, {next}.']);
    assert.ok(!/bpm|tempo/i.test(m.map(x => x.content).join(' ')), 'prompt never invites technical talk');
});

test('dj: names are tidied so a voice reads them like a person would', () => {
    assert.equal(tidyName('Kendrick Lamar & SZA'), 'Kendrick Lamar and SZA');
    assert.equal(tidyName('MY EYES'), 'My Eyes');
    assert.equal(tidyName('Death Ft. DaBaby'), 'Death featuring DaBaby');
    assert.equal(tidyName('SZA'), 'SZA', 'short all-caps names are acronyms and stay');
    assert.equal(tidyName('D.A.N.C.E.'), 'D.A.N.C.E.', 'dotted acronyms stay');
    assert.equal(tidyName('Die With A Smile'), 'Die With A Smile', 'normal titles are left alone');
    assert.equal(tidyName('ONE-MORE TIME'), 'One-More Time');
    assert.equal(sayTrack({ artist: 'ARTIST NAME', title: 'SOME SONG' }), 'Some Song by Artist Name');
});

test('dj: model output is cleaned and only accepted when it is plain and keeps the placeholders', () => {
    assert.equal(cleanLine('"That was [Prev]!\nUp next, <NEXT>!!"'), 'That was {prev}. Up next, {next}.');
    assert.ok(isValidSkeleton('You were listening to {prev}, and coming up now is {next}.'));
    assert.ok(isValidSkeleton('Here is {next}.'));
    assert.ok(isValidSkeleton("That was {prev}, and now it's {next}."));
    assert.ok(!isValidSkeleton('That was {prev}.'), 'must keep {next}');
    assert.ok(!isValidSkeleton('{next} and {next}.'), '{next} exactly once');
    assert.ok(!isValidSkeleton('Up next, {next} at 128 BPM.'), 'no tempo talk');
    assert.ok(!isValidSkeleton('That was {prev}, a soulful track. Up next, {next}.'), 'no claims about the music');
    assert.ok(!isValidSkeleton('{next} sounds like it has something to do with rap tracks.'), 'no invented descriptions');
    assert.ok(!isValidSkeleton('Up next, {next} 🎶'), 'no emoji');
    assert.ok(!isValidSkeleton('Up next, Lutherto.'), 'a model-written name is never accepted');
    assert.ok(isSameLine('That was {prev}.  Up next, {next}!', 'that was {prev} up next {next}'));
});

test('dj: the two songs keep their roles (what already played is never "up next")', () => {
    // real outputs of the small model
    assert.ok(!isValidSkeleton("{prev} is up next, and here's {next}."), 'previous song announced as upcoming');
    assert.ok(!isValidSkeleton('{next} was great, then {prev}.'), 'upcoming song in the past tense');
    assert.ok(!isValidSkeleton('I was listening to {prev}. Now, {next}.'), 'first person');
    assert.ok(!isValidSkeleton("Alright, that was {prev}. And now we're {next}."), "we're {next} is not a sentence");
    assert.ok(isValidSkeleton("That was {prev}, and now it's {next}."), "it's {next} is fine");
    assert.ok(isValidSkeleton('Okay, {next} is up next, after {prev}.'));
    assert.ok(isValidSkeleton('{prev} just finished, and here comes {next}.'));
    assert.ok(isValidSkeleton('Alright, that was {prev}. Moving on to {next}.'));
    assert.ok(isValidSkeleton('That was {prev}. Now, {next}.'));
    for (const s of SKELETONS) assert.ok(rolesConsistent(s), `built-in skeleton keeps roles: ${s}`);
});

test('dj: speech timing sits inside the transition and respects the clock', () => {
    const base = { bStart: 100, transitionEnd: 140, now: 50 };
    assert.equal(pickSpeechStart({ ...base, duration: 5 }), 110);
    assert.ok(pickSpeechStart({ ...base, duration: 60 }) >= 100, 'long clip starts as early as the incoming track');
    assert.equal(pickSpeechStart({ ...base, duration: 5, now: 120 }), 120.3, 'never in the past');
    assert.deepEqual([1, 2, 3, 4].map(n => shouldSpeak(n, 2)), [false, true, false, true]);
    assert.ok([1, 2, 3].every(n => shouldSpeak(n, 1)));
});

test('dj cloud: the stronger model may be warmer, but still no claims, numbers or technical talk', () => {
    assert.ok(isValidCloudSkeleton("Alright, that was {prev}. Let's keep the evening going with {next}."));
    assert.ok(isValidCloudSkeleton('That was {prev}, and next up, something a little different: {next}.'));
    assert.ok(isValidCloudSkeleton("Hope you enjoyed {prev}. Here's {next}."));
    assert.ok(!isValidCloudSkeleton('That was {prev}, a legendary track. Up next, {next}.'), 'praise');
    assert.ok(!isValidCloudSkeleton('That was {prev}. {next} was released in 2019.'), 'trivia and years');
    assert.ok(!isValidCloudSkeleton('Up next, {next}, a real banger.'), 'opinion');
    assert.ok(!isValidCloudSkeleton('Up next at 128 BPM, {next}.'), 'technical talk');
    assert.ok(!isValidCloudSkeleton('That was {prev}.'), 'must keep {next}');
    assert.ok(!isValidCloudSkeleton('{prev} is up next, then {next}.'), 'roles swapped');
    assert.ok(!isValidCloudSkeleton("And now we're {next}."), "we're {next}");
});

test('access: open locally, locked in production without a code, constant-time code check', () => {
    const saved = { ...process.env };
    const env = (e: Record<string, string | undefined>) => { for (const k of ['NODE_ENV', 'DJ_ACCESS_CODE', 'DJ_ALLOW_OPEN', 'ENABLE_URL_IMPORT']) delete process.env[k]; Object.assign(process.env, e); };
    try {
        env({ NODE_ENV: 'development' });
        assert.equal(accessMode(), 'open');
        assert.equal(importEnabled(), true);

        env({ NODE_ENV: 'production' });
        assert.equal(accessMode(), 'locked', 'public deployments are locked unless a code is configured');
        assert.equal(importEnabled(), false, 'the downloader routes are off in production');
        env({ NODE_ENV: 'production', ENABLE_URL_IMPORT: '1' });
        assert.equal(importEnabled(), true);
        env({ NODE_ENV: 'production', DJ_ALLOW_OPEN: '1' });
        assert.equal(accessMode(), 'open');

        env({ NODE_ENV: 'production', DJ_ACCESS_CODE: 's3cret-code' });
        assert.equal(accessMode(), 'code');
        env({ NODE_ENV: 'development', DJ_ACCESS_CODE: 's3cret-code' });
        assert.equal(accessMode(), 'code', 'a configured code is enforced even locally');
    } finally {
        for (const k of Object.keys(process.env)) if (!(k in saved)) delete process.env[k];
        Object.assign(process.env, saved);
    }
    assert.equal(codesMatch('s3cret-code', 's3cret-code'), true);
    assert.equal(codesMatch('s3cret-cod', 's3cret-code'), false);
    assert.equal(codesMatch('S3CRET-CODE', 's3cret-code'), false);
    assert.equal(codesMatch('', 's3cret-code'), false);
    assert.equal(codesMatch('anything', ''), false, 'an empty expected code never matches');
});

test('cloud helpers: Deepgram request, wording request, WAV wrapping, retry hints, secret scrubbing', () => {
    const dg = buildDeepgramTts('https://api.example.test', 'aura-2-cora-en', 'Hello there.');
    assert.equal(dg.url, 'https://api.example.test/v1/speak?model=aura-2-cora-en&encoding=linear16&container=wav&sample_rate=24000');
    assert.deepEqual(dg.body, { text: 'Hello there.' });
    assert.ok(buildDeepgramTts('https://x', 'not-a-voice', 'Hi').url.includes('model=' + DEFAULT_DEEPGRAM_VOICE), 'unknown voices fall back to the default');
    assert.deepEqual(deepgramHeaders('abc'), { authorization: 'Token abc' });
    assert.ok(DEEPGRAM_VOICES.some(v => v.value === DEFAULT_DEEPGRAM_VOICE));

    const w = buildWordingRequest('https://api.example.test/openai/v1', 'm', 'That was {prev}. Up next, {next}.', ['a recent line']);
    assert.equal(w.url, 'https://api.example.test/openai/v1/chat/completions');
    assert.equal(w.body.messages[0]!.role, 'system');
    assert.match(w.body.messages[1]!.content, /That was \{prev\}/);
    assert.match(w.body.messages[1]!.content, /recent line/);
    assert.match(WORDING_SYSTEM, /\{prev\}/);
    assert.deepEqual(splitVersions('1. First one.\n2) Second one.\n- Third one.\n\n'), ['First one.', 'Second one.', 'Third one.']);
    assert.deepEqual(parseWordingResponse({ choices: [{ message: { content: 'One.\nTwo.' } }, { message: { content: 'Three.' } }] }), ['One.', 'Two.', 'Three.']);
    assert.deepEqual(parseWordingResponse({}), []);

    const pcm = Uint8Array.from({ length: 4800 }, (_, k) => (k * 7) % 256);
    const wav = pcmToWav(pcm, 24000);
    assert.ok(isWav(wav) && !isWav(pcm));
    assert.equal(String.fromCharCode(...wav.slice(8, 12)), 'WAVE');
    assert.equal(new DataView(wav.buffer).getUint32(24, true), 24000, 'sample rate');
    assert.equal(new DataView(wav.buffer).getUint32(40, true), pcm.length, 'data length');

    const hdr = (v: string | null) => ({ get: () => v });
    assert.equal(retryAfterSeconds(200, hdr('5')), 0);
    assert.equal(retryAfterSeconds(429, hdr('12')), 12);
    assert.equal(retryAfterSeconds(429, hdr(null)), 60);

    assert.equal(sanitizeMessage('bad key sk-live-123456789 rejected', ['sk-live-123456789']), 'bad key … rejected');
    assert.ok(!sanitizeMessage('Authorization: Bearer abcdefghijklmnop1234').includes('abcdefghijklmnop1234'));
    assert.ok(!sanitizeMessage('url?api_key=SECRETSECRET&x=1').includes('SECRETSECRET'));
    assert.ok(sanitizeMessage('x'.repeat(500)).length <= 200);
});

console.log(`\n${passed} tests passed`);
