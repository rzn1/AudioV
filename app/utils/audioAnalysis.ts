// Pure DSP helpers used by the analysis worker (no DOM / Web Audio dependencies, so they can run in Node too).

export interface OnsetEnvelope {
    rate: number,         // frames per second
    onset: Float32Array,  // combined (low + full band) onset strength, mean-normalised
    low: Float32Array     // low-band (kick) onset strength, mean-normalised
}

export interface BeatGrid {
    tempo: number,   // BPM, fitted to ~0.005
    offset: number,  // time (s) of the first beat, 0 <= offset < 60/tempo
    score: number
}

export interface KeyResult {
    root: number,
    mode: 'major' | 'minor',
    confidence: number
}

// ---------------------------------------------------------------------------
// Onset envelope
// ---------------------------------------------------------------------------

export function computeOnsetEnvelope(x: Float32Array, sr: number, envRate = 200): OnsetEnvelope {
    const hop = Math.max(1, Math.round(sr / envRate));
    const rate = sr / hop;
    const n = Math.floor(x.length / hop);
    const full = new Float32Array(n);
    const low = new Float32Array(n);

    // Two cascaded one-pole low-pass filters (~200 Hz) isolate the kick
    const a = 1 - Math.exp((-2 * Math.PI * 200) / sr);
    let y1 = 0;
    let y2 = 0;
    for (let f = 0; f < n; f++) {
        let sf = 0;
        let sl = 0;
        const end = (f + 1) * hop;
        for (let i = f * hop; i < end; i++) {
            const s = x[i]!;
            y1 += a * (s - y1);
            y2 += a * (y1 - y2);
            sf += s * s;
            sl += y2 * y2;
        }
        full[f] = Math.sqrt(sf / hop);
        low[f] = Math.sqrt(sl / hop);
    }

    const flux = (m: Float32Array) => {
        let mean = 0;
        for (let i = 0; i < m.length; i++) mean += m[i]!;
        mean = mean / (m.length || 1) + 1e-9;
        const out = new Float32Array(m.length);
        for (let i = 2; i < m.length; i++) {
            const d = m[i]! - m[i - 2]!;
            out[i] = d > 0 ? d / mean : 0;
        }
        return out;
    };

    const fluxFull = flux(full);
    const fluxLow = flux(low);
    const onset = new Float32Array(n);
    let mean = 0;
    for (let i = 0; i < n; i++) {
        onset[i] = fluxLow[i]! + 0.5 * fluxFull[i]!;
        mean += onset[i]!;
    }
    mean = mean / (n || 1) + 1e-9;
    for (let i = 0; i < n; i++) {
        onset[i] = onset[i]! / mean;
        fluxLow[i] = fluxLow[i]! / mean;
    }
    return { rate, onset, low: fluxLow };
}

// ---------------------------------------------------------------------------
// Beat grid fit
// ---------------------------------------------------------------------------

function maxFilter3(env: Float32Array): Float32Array {
    const out = new Float32Array(env.length);
    for (let i = 0; i < env.length; i++) {
        const a = env[i - 1] ?? 0;
        const b = env[i]!;
        const c = env[i + 1] ?? 0;
        out[i] = Math.max(a, b, c);
    }
    return out;
}

function gridMean(env3: Float32Array, interval: number, offset: number): number {
    let sum = 0;
    let count = 0;
    for (let k = 0; ; k++) {
        const i = Math.round(offset + k * interval);
        if (i >= env3.length) break;
        sum += env3[i]!;
        count++;
    }
    return count > 0 ? sum / count : 0;
}

/** Restricts the offsets considered: only those within `maxDev` (fraction of a beat) of `predicted` (seconds). */
interface OffsetPrior {
    predicted: number,
    maxDev: number
}

function searchGrid(env3: Float32Array, rate: number, lo: number, hi: number, step: number, prior?: OffsetPrior): BeatGrid {
    let best: BeatGrid = { tempo: (lo + hi) / 2, offset: 0, score: -1 };
    for (let tempo = lo; tempo <= hi + 1e-9; tempo += step) {
        const interval = (60 / tempo) * rate;
        const maxOff = Math.ceil(interval);
        for (let o = 0; o < maxOff; o++) {
            if (prior) {
                let d = (o - prior.predicted * rate) % interval;
                if (d < 0) d += interval;
                if (Math.min(d, interval - d) > prior.maxDev * interval) continue;
            }
            const s = gridMean(env3, interval, o);
            if (s > best.score) best = { tempo, offset: o / rate, score: s };
        }
    }
    return best;
}

/** Coarse tempo (80-180 BPM, +-1%) from the autocorrelation of the onset envelope. Used when no guess is available. */
export function estimateTempoAutocorr(env: Float32Array, rate: number): number {
    const minLag = Math.floor((60 / 180) * rate);
    const maxLag = Math.ceil((60 / 80) * rate);
    const ac = (lag: number) => {
        let s = 0;
        for (let i = lag; i < env.length; i++) s += env[i]! * env[i - lag]!;
        return s / (env.length - lag || 1);
    };
    let bestLag = minLag;
    let bestScore = -1;
    for (let lag = minLag; lag <= maxLag; lag++) {
        const score = ac(lag) + 0.5 * ac(lag * 2);
        if (score > bestScore) {
            bestScore = score;
            bestLag = lag;
        }
    }
    return (60 * rate) / bestLag;
}

/**
 * Fits a constant-tempo beat grid to the onset envelope. `tempoGuess` (e.g. from web-audio-beat-detector) narrows the
 * search; without it a wide scan (80-180 BPM) is done first.
 */
export function fitBeatGrid(env: Float32Array, rate: number, tempoGuess = 0): BeatGrid {
    const env3 = maxFilter3(env);
    let center = tempoGuess;
    if (!(center > 0)) center = estimateTempoAutocorr(env, rate);
    const coarse = searchGrid(env3, rate, center - 1.5, center + 1.5, 0.03);
    const fine = searchGrid(env3, rate, coarse.tempo - 0.03, coarse.tempo + 0.03, 0.005);
    const interval = 60 / fine.tempo;
    let offset = fine.offset % interval;
    if (offset < 0) offset += interval;
    return { tempo: fine.tempo, offset, score: fine.score };
}

/**
 * Fits the grid on a short window of the signal. Many tracks do not keep a perfectly constant tempo, so a single
 * global grid drifts by 100+ ms far from where it was anchored. The local fit is constrained to stay within 3% of the
 * global tempo and within 0.4 beat of the global phase, which stops it from locking onto off-beat hats in kick-less
 * intros/outros. Returns the file time of the first beat inside the window plus the local tempo.
 */
export function fitLocalGrid(x: Float32Array, sr: number, from: number, to: number, tempo: number, offset: number):
    { tempo: number, firstBeat: number, score: number } | null {
    from = Math.max(0, from);
    to = Math.min(x.length / sr, to);
    if (to - from < 8) return null;
    const seg = x.subarray(Math.floor(from * sr), Math.floor(to * sr));
    const env = computeOnsetEnvelope(seg, sr);
    const env3 = maxFilter3(env.onset);

    const beat = 60 / tempo;
    let predicted = (offset - from) % beat;
    if (predicted < 0) predicted += beat;
    const prior: OffsetPrior = { predicted, maxDev: 0.4 };

    const coarse = searchGrid(env3, env.rate, tempo * 0.97, tempo * 1.03, 0.03, prior);
    const fine = searchGrid(env3, env.rate, coarse.tempo - 0.03, coarse.tempo + 0.03, 0.005, prior);
    if (fine.score <= 0) return null;
    return { tempo: fine.tempo, firstBeat: from + fine.offset, score: fine.score };
}

/**
 * Finds the phrase boundary (every 8th beat counted from the global downbeat) closest to `target`, located on the
 * locally fitted grid of the window `[from, to]`. Falls back to null if the local fit fails.
 */
export function localPhraseBoundary(x: Float32Array, sr: number, g: { tempo: number, offset: number, phase: number },
    from: number, to: number, target: number, min: number, max: number): { time: number, tempo: number } | null {
    const fit = fitLocalGrid(x, sr, from, to, g.tempo, g.offset);
    if (!fit) return null;
    const beatLocal = 60 / fit.tempo;
    const beatGlobal = 60 / g.tempo;
    let best: { time: number, d: number } | null = null;
    for (let k = 0; ; k++) {
        const t = fit.firstBeat + k * beatLocal;
        if (t > to) break;
        if (t < min || t > max) continue;
        // Beat index on the global grid keeps the bar / phrase counting consistent with the downbeat detection
        const n = Math.round((t - g.offset) / beatGlobal);
        if ((((n - g.phase) % PHRASE_BEATS) + PHRASE_BEATS) % PHRASE_BEATS !== 0) continue;
        const d = Math.abs(t - target);
        if (!best || d < best.d) best = { time: t, d };
    }
    return best ? { time: best.time, tempo: fit.tempo } : null;
}

// ---------------------------------------------------------------------------
// Downbeat (bar start) detection
// ---------------------------------------------------------------------------

/**
 * Assumes 4/4. Returns which of the 4 beats of the grid (beat index k mod 4) carries the strongest low-end attack on
 * average; the first downbeat is then `offset + phase * beatInterval`.
 */
export function detectDownbeatPhase(env: OnsetEnvelope, tempo: number, offset: number): { phase: number, confidence: number } {
    const interval = (60 / tempo) * env.rate;
    const start = offset * env.rate;
    const sums = [0, 0, 0, 0];
    const counts = [0, 0, 0, 0];
    for (let k = 0; ; k++) {
        const i = Math.round(start + k * interval);
        if (i >= env.onset.length) break;
        let v = 0;
        for (let d = -1; d <= 1; d++) {
            const j = i + d;
            if (j < 0 || j >= env.onset.length) continue;
            v = Math.max(v, env.low[j]! + 0.5 * env.onset[j]!);
        }
        sums[k % 4]! += v;
        counts[k % 4]!++;
    }
    const means = sums.map((s, i) => s / (counts[i] || 1));
    const avg = means.reduce((a, b) => a + b, 0) / 4 || 1e-9;
    let phase = 0;
    for (let i = 1; i < 4; i++) if (means[i]! > means[phase]!) phase = i;
    return { phase, confidence: means[phase]! / avg };
}

// ---------------------------------------------------------------------------
// Key detection (chroma + Krumhansl-Schmuckler)
// ---------------------------------------------------------------------------

const MAJOR_PROFILE = [6.35, 2.23, 3.48, 2.33, 4.38, 4.09, 2.52, 5.19, 2.39, 3.66, 2.29, 2.88];
const MINOR_PROFILE = [6.33, 2.68, 3.52, 5.38, 2.60, 3.53, 2.54, 4.75, 3.98, 2.69, 3.34, 3.17];
const NOTE_NAMES = ['C', 'C#', 'D', 'D#', 'E', 'F', 'F#', 'G', 'G#', 'A', 'A#', 'B'];

function fft(re: Float64Array, im: Float64Array) {
    const n = re.length;
    for (let i = 1, j = 0; i < n; i++) {
        let bit = n >> 1;
        for (; j & bit; bit >>= 1) j ^= bit;
        j ^= bit;
        if (i < j) {
            [re[i], re[j]] = [re[j]!, re[i]!];
            [im[i], im[j]] = [im[j]!, im[i]!];
        }
    }
    for (let len = 2; len <= n; len <<= 1) {
        const ang = (-2 * Math.PI) / len;
        const wr = Math.cos(ang);
        const wi = Math.sin(ang);
        for (let i = 0; i < n; i += len) {
            let cr = 1;
            let ci = 0;
            for (let j = 0; j < len / 2; j++) {
                const ur = re[i + j]!;
                const ui = im[i + j]!;
                const vr = re[i + j + len / 2]! * cr - im[i + j + len / 2]! * ci;
                const vi = re[i + j + len / 2]! * ci + im[i + j + len / 2]! * cr;
                re[i + j] = ur + vr;
                im[i + j] = ui + vi;
                re[i + j + len / 2] = ur - vr;
                im[i + j + len / 2] = ui - vi;
                const ncr = cr * wr - ci * wi;
                ci = cr * wi + ci * wr;
                cr = ncr;
            }
        }
    }
}

function pearson(a: number[], b: number[]): number {
    const n = a.length;
    const ma = a.reduce((s, v) => s + v, 0) / n;
    const mb = b.reduce((s, v) => s + v, 0) / n;
    let num = 0;
    let da = 0;
    let db = 0;
    for (let i = 0; i < n; i++) {
        num += (a[i]! - ma) * (b[i]! - mb);
        da += (a[i]! - ma) ** 2;
        db += (b[i]! - mb) ** 2;
    }
    return num / (Math.sqrt(da * db) + 1e-12);
}

export function detectKey(x: Float32Array, sr: number): KeyResult {
    const N = 16384;
    const hop = Math.round(sr * 0.75);
    const window = new Float64Array(N);
    for (let i = 0; i < N; i++) window[i] = 0.5 - 0.5 * Math.cos((2 * Math.PI * i) / (N - 1));

    // Pre-compute bin -> (pitch class, weight) for 50 Hz - 2.5 kHz. Bins far from a semitone centre are ignored.
    const binPc: number[] = [];
    const binWeight: number[] = [];
    const binIdx: number[] = [];
    for (let b = 1; b < N / 2; b++) {
        const f = (b * sr) / N;
        if (f < 50 || f > 2500) continue;
        const midi = 69 + 12 * Math.log2(f / 440);
        const nearest = Math.round(midi);
        const w = 1 - 2 * Math.abs(midi - nearest);
        if (w <= 0) continue;
        binIdx.push(b);
        binPc.push(((nearest % 12) + 12) % 12);
        binWeight.push(w);
    }

    const chroma = new Array(12).fill(0);
    const re = new Float64Array(N);
    const im = new Float64Array(N);
    let frames = 0;
    for (let start = 0; start + N <= x.length; start += hop) {
        let energy = 0;
        for (let i = 0; i < N; i++) {
            const s = x[start + i]!;
            re[i] = s * window[i]!;
            im[i] = 0;
            energy += s * s;
        }
        if (energy / N < 1e-6) continue; // skip silence
        fft(re, im);
        const frame = new Array(12).fill(0);
        for (let k = 0; k < binIdx.length; k++) {
            const b = binIdx[k]!;
            const mag = Math.sqrt(re[b]! * re[b]! + im[b]! * im[b]!);
            frame[binPc[k]!] += Math.sqrt(mag) * binWeight[k]!;
        }
        const total = frame.reduce((s, v) => s + v, 0) || 1;
        for (let i = 0; i < 12; i++) chroma[i] += frame[i] / total;
        frames++;
    }

    if (frames === 0) return { root: 0, mode: 'major', confidence: 0 };

    const scores: { root: number, mode: 'major' | 'minor', r: number }[] = [];
    for (let root = 0; root < 12; root++) {
        const rotated = (profile: number[]) => chroma.map((_, i) => profile[(i - root + 12) % 12]!);
        scores.push({ root, mode: 'major', r: pearson(chroma, rotated(MAJOR_PROFILE)) });
        scores.push({ root, mode: 'minor', r: pearson(chroma, rotated(MINOR_PROFILE)) });
    }
    scores.sort((p, q) => q.r - p.r);
    const best = scores[0]!;
    const second = scores[1]!;
    const confidence = Math.min(1, Math.max(0, best.r * 0.6 + (best.r - second.r) * 4));
    return { root: best.root, mode: best.mode, confidence };
}

export function describeKey(k: { root: number, mode: 'major' | 'minor' }) {
    // Camelot wheel: 8B = C major, 8A = A minor; each fifth up adds one number.
    const majorRoot = k.mode === 'major' ? k.root : (k.root + 3) % 12;
    const number = ((majorRoot * 7) % 12 + 7) % 12 + 1;
    return {
        camelot: `${number}${k.mode === 'major' ? 'B' : 'A'}`,
        name: `${NOTE_NAMES[k.root]} ${k.mode}`
    };
}

// ---------------------------------------------------------------------------
// Phrase-aligned mix points
// ---------------------------------------------------------------------------

export const PHRASE_BEATS = 8; // 2 bars of 4/4

export function snapMixPoints(o: {
    firstDownbeat: number,
    tempo: number,
    rawStart: number,
    rawEnd: number,
    duration: number
}) {
    const beat = 60 / o.tempo;
    const phrase = PHRASE_BEATS * beat;
    const d0 = o.firstDownbeat;
    const limit = o.duration - 0.05;

    let kIn = Math.max(0, Math.round((o.rawStart - d0) / phrase));
    let kOut = Math.round((o.rawEnd - d0) / phrase);
    while (d0 + kOut * phrase > limit) kOut--;

    // Need at least 6 phrases of material; otherwise play from the first downbeat to the last full phrase.
    if (kOut - kIn < 6) {
        kIn = 0;
        kOut = Math.floor((limit - d0) / phrase);
    }
    kOut = Math.max(kOut, kIn + 1);
    return { mixIn: d0 + kIn * phrase, mixOut: d0 + kOut * phrase };
}

/**
 * Mix points on locally fitted grids. `mixIn` / `mixOut` are phrase boundaries (downbeats) and `tempoIn` / `tempoOut`
 * the tempo measured right there, which is what the two tracks have to be matched on. Falls back to the global grid.
 */
export function chooseMixPoints(x: Float32Array, sr: number,
    g: { tempo: number, offset: number, phase: number, firstDownbeat: number },
    raw: { start: number, end: number }, duration: number) {
    const global = snapMixPoints({
        firstDownbeat: g.firstDownbeat, tempo: g.tempo, rawStart: raw.start, rawEnd: raw.end, duration
    });
    const limit = duration - 0.05;
    const inB = localPhraseBoundary(x, sr, g, global.mixIn - 4, global.mixIn + 28, global.mixIn, 0, limit);
    const outB = localPhraseBoundary(x, sr, g, global.mixOut - 28, global.mixOut + 4, global.mixOut, 0, limit);

    const mixIn = inB?.time ?? global.mixIn;
    const mixOut = outB?.time ?? global.mixOut;
    if (mixOut - mixIn < 6 * PHRASE_BEATS * (60 / g.tempo)) {
        return { ...global, tempoIn: g.tempo, tempoOut: g.tempo, local: false };
    }
    return { mixIn, mixOut, tempoIn: inB?.tempo ?? g.tempo, tempoOut: outB?.tempo ?? g.tempo, local: !!(inB && outB) };
}

export function meanRms(rms: number[], hopSec: number, from: number, to: number): number {
    const a = Math.max(0, Math.floor(from / hopSec));
    const b = Math.min(rms.length, Math.ceil(to / hopSec));
    if (b <= a) return 0;
    let s = 0;
    for (let i = a; i < b; i++) s += rms[i]!;
    return s / (b - a);
}
