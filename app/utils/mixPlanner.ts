// Pure transition-planning logic (no Web Audio). Decides *how* two tracks should be mixed and what order suits them.
import type { KeyInfo, Timeline } from '../types/types';

export interface MixMeta {
    tempoIn: number,   // tempo at the mix-in point (used when the track is the incoming one)
    tempoOut: number,  // tempo at the mix-out point (used when the track is the outgoing one)
    mixIn: number,
    mixOut: number,
    key?: KeyInfo,
    energy?: number,
    introEnergy: number,
    outroEnergy: number
}

/**
 * blend / swap: beat-matched overlap with a bass swap on the bar in the middle.
 * echo: tempos too far apart to beat-match: the outgoing track is filtered out into an echo tail and the incoming one
 *       enters on a bar half way through, at its own tempo.
 * cut: only used as the last resort when there is no room left for anything else.
 */
export type TransitionStyle = 'blend' | 'swap' | 'echo' | 'cut';

export interface TransitionPlan {
    style: TransitionStyle,
    beats: number,       // transition length in beats of the OUTGOING track (multiple of 8; 0 for a last-resort cut)
    rate: number,        // playback rate of the incoming track during the transition (beat matches the outgoing one)
    semitones: number,   // pitch shift caused by `rate`
    gain: number,        // level trim for the incoming track during the blend (matches its intro to the outgoing outro)
    score: number,       // overall compatibility 0..1
    parts: { bpm: number, key: number, energy: number }
}

// ---------------------------------------------------------------------------
// Rate timeline: maps between AudioContext time and buffer position for a track that plays at a constant rate
// during its transition and then glides back to 1.
// ---------------------------------------------------------------------------

export function posAt(tl: Timeline, t: number): number {
    if (t <= tl.t0) return tl.p0;
    const hold = Math.max(0, Math.min(t, tl.holdUntil) - tl.t0);
    let pos = tl.p0 + hold * tl.rate;
    if (t <= tl.holdUntil) return pos;
    const s = t - tl.holdUntil;
    if (tl.rampDur > 0) {
        const ramp = Math.min(s, tl.rampDur);
        pos += tl.rate * ramp + ((1 - tl.rate) * ramp * ramp) / (2 * tl.rampDur);
        if (s <= tl.rampDur) return pos;
        return pos + (s - tl.rampDur);
    }
    return pos + s;
}

export function timeAt(tl: Timeline, p: number): number {
    if (p <= tl.p0) return tl.t0;
    const holdLen = Math.max(0, tl.holdUntil - tl.t0);
    const holdPos = holdLen * tl.rate;
    if (p - tl.p0 <= holdPos) return tl.t0 + (p - tl.p0) / tl.rate;
    const pH = tl.p0 + holdPos;
    const q = p - pH;
    if (tl.rampDur > 0) {
        const rampPos = (tl.rate * tl.rampDur + (1 - tl.rate) * tl.rampDur / 2);
        if (q <= rampPos) {
            const a = (1 - tl.rate) / (2 * tl.rampDur);
            // solve a*s^2 + rate*s = q (numerically stable form)
            const s = (2 * q) / (tl.rate + Math.sqrt(tl.rate * tl.rate + 4 * a * q));
            return tl.holdUntil + s;
        }
        return tl.holdUntil + tl.rampDur + (q - rampPos);
    }
    return tl.holdUntil + q;
}

// ---------------------------------------------------------------------------
// Compatibility
// ---------------------------------------------------------------------------

const KEY_MIN_CONFIDENCE = 0.35;

function camelotParts(c: string) {
    return { n: parseInt(c, 10), letter: c.slice(-1) };
}

export function keyScore(a?: KeyInfo, b?: KeyInfo, semitones = 0): number {
    if (!a || !b || a.confidence < KEY_MIN_CONFIDENCE || b.confidence < KEY_MIN_CONFIDENCE) return 0.5; // unknown -> neutral
    // Playing B faster/slower transposes it
    const shifted = ((b.root + semitones) % 12 + 12) % 12;
    const majorRoot = b.mode === 'major' ? shifted : (shifted + 3) % 12;
    const num = ((majorRoot * 7) % 12 + 7) % 12 + 1;
    const pb = { n: num, letter: b.mode === 'major' ? 'B' : 'A' };
    const pa = camelotParts(a.camelot);
    let d = Math.abs(pa.n - pb.n);
    d = Math.min(d, 12 - d);
    if (pa.letter === pb.letter) {
        return [1.0, 0.9, 0.55, 0.3][d] ?? 0.1;
    }
    // Different mode: same number = relative major/minor
    return [0.9, 0.45][d] ?? 0.15;
}

const MAX_BLEND_STRETCH = 0.06;  // ~1 semitone
const MAX_SWAP_STRETCH = 0.08;

/** Picks the beat-matching factor (1:1, double, half time) that needs the smallest rate change. */
export function bestRate(tempoA: number, tempoB: number) {
    let best = { rate: tempoA / tempoB, dev: Infinity };
    for (const f of [1, 2, 0.5]) {
        const rate = (f * tempoA) / tempoB;
        const dev = Math.abs(rate - 1);
        if (dev < best.dev) best = { rate, dev };
    }
    return best;
}

export function planTransition(a: MixMeta, b: MixMeta, opts: { maxBeats?: number } = {}): TransitionPlan {
    const maxBeats = Math.max(8, Math.floor((opts.maxBeats ?? 64) / 8) * 8);
    const { rate: matchRate, dev } = bestRate(a.tempoOut, b.tempoIn);

    const semitonesMatched = Math.round(12 * Math.log2(matchRate)) || 0; // `|| 0` avoids -0
    const keyS = keyScore(a.key, b.key, dev > MAX_SWAP_STRETCH ? 0 : semitonesMatched);

    const bpmS = dev <= 0.02 ? 1 : Math.max(0, 1 - (dev - 0.02) / (MAX_SWAP_STRETCH - 0.02));
    // Track-level energy: prefer a smooth energy progression. (A loud outro into a quiet intro is normal DJ practice,
    // so outro/intro levels are deliberately not compared.)
    const lo = Math.min(a.energy ?? 0, b.energy ?? 0);
    const hi = Math.max(a.energy ?? 0, b.energy ?? 0);
    const energyS = hi > 1e-6 ? lo / hi : 1;
    const score = 0.5 * bpmS + 0.3 * keyS + 0.2 * energyS;
    const parts = { bpm: bpmS, key: keyS, energy: energyS };
    // Level match: a quiet intro under a loud outro would otherwise leave a hole in the mix
    const gain = a.outroEnergy > 1e-6 && b.introEnergy > 1e-6
        ? Math.min(2, Math.max(0.6, a.outroEnergy / b.introEnergy))
        : 1;

    // Tempo gap too large to beat-match without audible pitch change: filter the outgoing track out into an echo tail
    // and bring the incoming one in on a bar, each at its own tempo (no clashing drums, no stretching).
    if (dev > MAX_SWAP_STRETCH) {
        return { style: 'echo', beats: Math.min(32, maxBeats), rate: 1, semitones: 0, gain, score, parts };
    }

    let beats: number;
    if (score >= 0.85) beats = 64;
    else if (score >= 0.7) beats = 32;
    else beats = 16; // never shorter: a beat-matched pair needs at least 8 bars to feel like a mix
    if (keyS < 0.35) beats = Math.min(beats, 16); // melodic clash: keep the overlap shorter
    beats = Math.min(beats, maxBeats);

    const style: TransitionStyle = dev <= MAX_BLEND_STRETCH && keyS >= 0.8 ? 'blend' : 'swap';
    return { style, beats, rate: matchRate, semitones: semitonesMatched, gain, score, parts };
}

// ---------------------------------------------------------------------------
// Fitting a plan onto the actual clock
// ---------------------------------------------------------------------------

export interface FittedTransition {
    plan: TransitionPlan,
    beats: number,
    T0: number,       // ctx time at which the transition starts
    bStart: number,   // ctx time at which the incoming track starts (T0, or later for `echo`)
    length: number,   // ctx seconds the transition lasts
    endTime: number   // ctx time at which the outgoing track's playable segment ends
}

/** How far into an `echo` transition the incoming track enters (always a bar boundary of the outgoing track). */
export const echoEntryBeats = (beats: number) => beats / 2;

/**
 * The mix-out point actually used: `lead` seconds before the analysed one, snapped back by whole phrases so it stays
 * on the beat grid. Leaving a track earlier (instead of at the very end of the file) gives the transition room to be
 * long. Capped so the playable part keeps at least 8 phrases.
 */
export function effectiveMixOut(m: { mixIn: number, mixOut: number, tempoOut: number }, lead: number): number {
    const phrase = (8 * 60) / m.tempoOut;
    let k = lead > 0 ? Math.ceil(lead / phrase) : 0;
    while (k > 0 && m.mixOut - k * phrase < m.mixIn + 8 * phrase) k--;
    return m.mixOut - k * phrase;
}

/** MixMeta view of a track with the lead-adjusted mix-out. */
export function toMixMeta<T extends MixMeta>(m: T, lead: number): MixMeta {
    return {
        tempoIn: m.tempoIn, tempoOut: m.tempoOut, mixIn: m.mixIn, mixOut: effectiveMixOut(m, lead),
        key: m.key, energy: m.energy, introEnergy: m.introEnergy, outroEnergy: m.outroEnergy
    };
}

/**
 * Places the transition so that it ends exactly at the outgoing track's phrase-aligned mix-out point. If that is too
 * late for the chosen length (e.g. after a seek close to the end), the transition is shortened, and ultimately
 * degraded to an unaligned cut.
 */
export function fitTransition(plan: TransitionPlan, a: MixMeta, aTimeline: Timeline, now: number, lead = 0.25): FittedTransition {
    const endTime = timeAt(aTimeline, a.mixOut);
    const beatLen = 60 / a.tempoOut;
    const settled = aTimeline.holdUntil + aTimeline.rampDur; // outgoing track must be back at rate 1

    const options = [64, 32, 16, 8].filter(b => b <= plan.beats);
    if (!options.includes(plan.beats)) options.unshift(plan.beats);
    for (const beats of options) {
        const length = beats * beatLen;
        const T0 = endTime - length;
        if (T0 >= now + lead && T0 >= settled) {
            const p = beats === plan.beats ? plan : { ...plan, beats, style: plan.style === 'blend' && beats < 16 ? 'swap' as const : plan.style };
            const bStart = p.style === 'echo' ? T0 + echoEntryBeats(beats) * beatLen : T0;
            return { plan: p, beats, T0, bStart, length, endTime };
        }
    }
    // Not enough room: cut as late as possible
    const T0 = Math.max(now + lead, settled);
    const length = Math.max(0.5, endTime - T0);
    return { plan: { ...plan, style: 'cut', rate: 1, semitones: 0 }, beats: 0, T0, bStart: T0, length, endTime: T0 + length };
}

// ---------------------------------------------------------------------------
// Queue ordering
// ---------------------------------------------------------------------------

export function pairCost(a: MixMeta, b: MixMeta): number {
    return 1 - planTransition(a, b).score;
}

/**
 * Returns a permutation of track indices. The first `fixedCount` tracks (already played / playing) stay in place; the
 * rest are re-ordered to minimise the total transition cost (greedy nearest-neighbour followed by 2-opt).
 */
export function orderTracks(metas: MixMeta[], fixedCount: number): number[] {
    const n = metas.length;
    const head = Array.from({ length: Math.min(fixedCount, n) }, (_, i) => i);
    const rest = Array.from({ length: n }, (_, i) => i).filter(i => i >= head.length);
    if (rest.length < 2) return [...head, ...rest];

    const cost: number[][] = metas.map((a) => metas.map((b) => pairCost(a, b)));
    const last = head.length ? head[head.length - 1]! : -1;

    // Greedy: with no fixed head, start from the calmest track so the set can build
    const remaining = new Set(rest);
    const path: number[] = [];
    let current = last;
    if (current === -1) {
        current = rest.reduce((m, i) => ((metas[i]!.energy ?? 0) < (metas[m]!.energy ?? 0) ? i : m), rest[0]!);
        path.push(current);
        remaining.delete(current);
    }
    while (remaining.size) {
        let bestJ = -1;
        let bestC = Infinity;
        for (const j of remaining) {
            const c = cost[current]![j]!;
            if (c < bestC) {
                bestC = c;
                bestJ = j;
            }
        }
        path.push(bestJ);
        remaining.delete(bestJ);
        current = bestJ;
    }

    const total = (p: number[]) => {
        let s = last >= 0 ? cost[last]![p[0]!]! : 0;
        for (let i = 0; i + 1 < p.length; i++) s += cost[p[i]!]![p[i + 1]!]!;
        return s;
    };

    // 2-opt (segment reversal) with full recomputation; costs are asymmetric
    let best = total(path);
    let improved = true;
    let guard = 0;
    while (improved && guard++ < 50) {
        improved = false;
        for (let i = 0; i < path.length - 1; i++) {
            for (let j = i + 1; j < path.length; j++) {
                const cand = [...path.slice(0, i), ...path.slice(i, j + 1).reverse(), ...path.slice(j + 1)];
                const c = total(cand);
                if (c < best - 1e-9) {
                    best = c;
                    path.splice(0, path.length, ...cand);
                    improved = true;
                }
            }
        }
    }
    return [...head, ...path];
}
