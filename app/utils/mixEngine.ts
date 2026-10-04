// Web Audio side of the auto-DJ: builds one "voice" per scheduled track and automates the transition between two
// voices. Works with any BaseAudioContext, so the same code drives live playback and offline previews.
import type { Tracks, Timeline } from '../types/types';
import type { TransitionPlan } from './mixPlanner';
import { timeAt } from './mixPlanner';

export interface Voice {
    meta: Tracks,
    source: AudioBufferSourceNode,
    gain: GainNode,
    bass: BiquadFilterNode,  // low-shelf used as a "bass kill" for the bass swap
    hpf: BiquadFilterNode,
    lpf: BiquadFilterNode,
    trim: GainNode,          // level compensation, kept separate from the fade automation on `gain`
    timeline: Timeline,
    endPos: number,          // file position at which the playable segment ends (the lead-adjusted mix-out)
    endTime: number,         // ctx time at which the playable segment ends
    dest: AudioNode
}

const BASS_KILL_DB = -40;
const CURVE_POINTS = 64;
const FADE_IN = Float32Array.from({ length: CURVE_POINTS }, (_, i) => Math.sin((i / (CURVE_POINTS - 1)) * Math.PI / 2));
const FADE_OUT = Float32Array.from({ length: CURVE_POINTS }, (_, i) => Math.cos((i / (CURVE_POINTS - 1)) * Math.PI / 2));

export interface VoiceOptions {
    rate?: number,     // playback rate while the transition runs (beat-matches the outgoing track)
    holdFor?: number,  // how long (ctx s) that rate is held
    rampDur?: number,  // then glide back to rate 1 over this long
    silent?: boolean,  // start with gain 0 (incoming track)
    endPos?: number    // where to stop playing (default: the track's analysed mix-out)
}

export function createVoice(ctx: BaseAudioContext, dest: AudioNode, meta: Tracks, when: number, pos: number, opts: VoiceOptions = {}): Voice {
    const rate = opts.rate ?? 1;
    const holdFor = rate !== 1 ? (opts.holdFor ?? 0) : 0;
    const rampDur = rate !== 1 ? (opts.rampDur ?? 2) : 0;
    const timeline: Timeline = { t0: when, p0: pos, rate, holdUntil: when + holdFor, rampDur };

    const source = ctx.createBufferSource();
    source.buffer = meta.buffer;
    source.playbackRate.setValueAtTime(rate, when);
    if (rate !== 1) {
        source.playbackRate.setValueAtTime(rate, when + holdFor);
        source.playbackRate.linearRampToValueAtTime(1, when + holdFor + rampDur);
    }

    const bass = ctx.createBiquadFilter();
    bass.type = 'lowshelf';
    bass.frequency.value = 250;
    bass.gain.value = 0;

    const hpf = ctx.createBiquadFilter();
    hpf.type = 'highpass';
    hpf.frequency.value = 10;

    const lpf = ctx.createBiquadFilter();
    lpf.type = 'lowpass';
    lpf.frequency.value = 22000;

    const trim = ctx.createGain();
    const gain = ctx.createGain();
    gain.gain.value = opts.silent ? 0 : 1;

    source.connect(bass);
    bass.connect(hpf);
    hpf.connect(lpf);
    lpf.connect(trim);
    trim.connect(gain);
    gain.connect(dest);

    const endPos = opts.endPos ?? meta.mixOut;
    const endTime = timeAt(timeline, endPos);
    source.start(when, pos);
    source.stop(Math.max(endTime, when));

    return { meta, source, gain, bass, hpf, lpf, trim, timeline, endPos, endTime, dest };
}

/**
 * Automates the hand-over from `a` to `b`. `T0` is when b starts (on a downbeat of both tracks), `L` the length in
 * ctx seconds. Blend/swap: b comes in without bass, the bass swaps on the bar in the middle, then a fades out.
 * Echo (tempos too far apart to match): a is low-passed and fed into a feedback delay, loses its bass and fades out; b
 * enters at `bStart` (a bar boundary half way through) at its own tempo, so the two never fight rhythmically.
 * Cut: last resort, hard cut with a quick low-pass fade of a.
 */
export function applyTransition(ctx: BaseAudioContext, plan: TransitionPlan, a: Voice, b: Voice, T0: number, L: number, bStart = T0) {
    const half = T0 + L / 2;
    const swapRamp = 0.03;

    // Level-match the incoming track for the blend, then ease back to unity over 16 beats
    if (Math.abs(plan.gain - 1) > 0.05) {
        const release = (16 * 60) / b.meta.tempo;
        b.trim.gain.setValueAtTime(plan.gain, bStart);
        b.trim.gain.setValueAtTime(plan.gain, T0 + L);
        b.trim.gain.linearRampToValueAtTime(1, T0 + L + release);
    }

    if (plan.style === 'echo') {
        const entry = bStart - T0;
        const beat = L / plan.beats;

        a.lpf.frequency.setValueAtTime(22000, T0);
        a.lpf.frequency.exponentialRampToValueAtTime(1600, T0 + entry);
        a.bass.gain.setValueAtTime(0, bStart);
        a.bass.gain.linearRampToValueAtTime(BASS_KILL_DB, bStart + swapRamp);
        a.gain.gain.setValueCurveAtTime(FADE_OUT, T0 + entry * 0.5, L - entry * 0.5);

        // Dotted-eighth feedback echo fed from the (already filtered) outgoing track; it keeps ringing after a stops
        const send = ctx.createGain();
        const delay = ctx.createDelay(2);
        const tone = ctx.createBiquadFilter();
        const feedback = ctx.createGain();
        const wet = ctx.createGain();
        send.gain.value = 0;
        delay.delayTime.value = Math.min(1.9, 0.75 * beat);
        tone.type = 'lowpass';
        tone.frequency.value = 2500;
        feedback.gain.value = 0.55;
        wet.gain.value = 1.0;
        a.lpf.connect(send);
        send.connect(delay);
        delay.connect(tone);
        tone.connect(feedback);
        feedback.connect(delay);
        tone.connect(wet);
        wet.connect(a.dest);
        send.gain.setValueAtTime(0, T0 + entry * 0.5);
        send.gain.linearRampToValueAtTime(0.8, bStart);
        send.gain.linearRampToValueAtTime(0, T0 + L);

        b.gain.gain.setValueCurveAtTime(FADE_IN, bStart, entry * 0.5);
        return;
    }

    if (plan.style === 'cut') {
        a.bass.gain.setValueAtTime(0, T0);
        a.bass.gain.linearRampToValueAtTime(BASS_KILL_DB, T0 + 0.02);
        a.lpf.frequency.setValueAtTime(22000, T0);
        a.lpf.frequency.exponentialRampToValueAtTime(500, T0 + L);
        a.gain.gain.setValueCurveAtTime(FADE_OUT, T0, L);

        b.gain.gain.setValueAtTime(0, bStart);
        b.gain.gain.linearRampToValueAtTime(1, bStart + 0.02);
        return;
    }

    // Incoming track: fade in over the first half, bass held back until the swap
    b.gain.gain.setValueCurveAtTime(FADE_IN, T0, L / 2); // b starts silent (see createVoice)
    b.bass.gain.setValueAtTime(BASS_KILL_DB, T0);
    b.bass.gain.setValueAtTime(BASS_KILL_DB, half);
    b.bass.gain.linearRampToValueAtTime(0, half + swapRamp);

    // Outgoing track: loses its bass at the swap and fades out over the last three quarters
    a.bass.gain.setValueAtTime(0, half);
    a.bass.gain.linearRampToValueAtTime(BASS_KILL_DB, half + swapRamp);
    a.gain.gain.setValueCurveAtTime(FADE_OUT, T0 + L * 0.25, L * 0.75);

    if (plan.style === 'swap') {
        // Also clear the mid-range of the outgoing track and open up the incoming one
        a.hpf.frequency.setValueAtTime(10, half);
        a.hpf.frequency.exponentialRampToValueAtTime(800, T0 + L);
        b.lpf.frequency.setValueAtTime(3000, T0);
        b.lpf.frequency.exponentialRampToValueAtTime(22000, half);
    }
}

/**
 * A short decaying-noise "room": ~1 s, brighter at the start, with a few ms of pre-delay. Cheap and good enough for the
 * subtle ambience a radio voice has.
 */
function roomImpulse(ctx: BaseAudioContext, seconds = 1.0, preDelay = 0.015) {
    const rate = ctx.sampleRate;
    const length = Math.floor(rate * seconds);
    const ir = ctx.createBuffer(2, length, rate);
    for (let c = 0; c < 2; c++) {
        const d = ir.getChannelData(c);
        let smooth = 0;
        for (let i = 0; i < length; i++) {
            const t = i / rate;
            if (t < preDelay) continue;
            const decay = Math.pow(1 - (t - preDelay) / (seconds - preDelay), 2.6);
            const lp = 0.35 + 0.55 * (1 - t / seconds); // darker as it decays
            smooth += lp * ((Math.random() * 2 - 1) - smooth);
            d[i] = smooth * decay * 0.5;
        }
    }
    return ir;
}

/**
 * "On air" processing for the DJ voice: the synthesised voice is dry, flat and a little thin, which is a big part of why
 * it sounds read-out. High-pass to remove rumble, a touch of low warmth, presence and air on top, gentle compression so
 * words sit evenly, a hint of room, and a limiter. Returns the node to feed; the result goes to `dest`.
 */
export function buildVoiceChain(ctx: BaseAudioContext, dest: AudioNode): { input: GainNode, setPolish: (level: number) => void } {
    const input = ctx.createGain();

    const hp = ctx.createBiquadFilter();
    hp.type = 'highpass';
    hp.frequency.value = 85;
    hp.Q.value = 0.7;

    const warmth = ctx.createBiquadFilter();
    warmth.type = 'lowshelf';
    warmth.frequency.value = 220;
    warmth.gain.value = 2.5;

    const presence = ctx.createBiquadFilter();
    presence.type = 'peaking';
    presence.frequency.value = 3200;
    presence.Q.value = 0.9;
    presence.gain.value = 3;

    const air = ctx.createBiquadFilter();
    air.type = 'highshelf';
    air.frequency.value = 9000;
    air.gain.value = 2;

    const comp = ctx.createDynamicsCompressor();
    comp.threshold.value = -26;
    comp.knee.value = 10;
    comp.ratio.value = 3.5;
    comp.attack.value = 0.006;
    comp.release.value = 0.14;

    const makeup = ctx.createGain();
    makeup.gain.value = 1.15; // ~ +1.2 dB: the compressor + EQ already lift the voice by ~5 dB (measured on real clips)

    const room = ctx.createConvolver();
    room.buffer = roomImpulse(ctx);
    const wet = ctx.createGain();
    wet.gain.value = 0.12;

    const limiter = ctx.createDynamicsCompressor();
    limiter.threshold.value = -5;
    limiter.knee.value = 0;
    limiter.ratio.value = 20;
    limiter.attack.value = 0.002;
    limiter.release.value = 0.08;

    input.connect(hp);
    hp.connect(warmth);
    warmth.connect(presence);
    presence.connect(air);
    air.connect(comp);
    comp.connect(makeup);
    makeup.connect(limiter);     // dry path
    makeup.connect(room);        // room send
    room.connect(wet);
    wet.connect(limiter);
    limiter.connect(dest);

    /** 1 = full processing (flat local voice); lower for voices that are already produced (the cloud voice). */
    const setPolish = (level: number) => {
        const p = Math.min(1, Math.max(0, level));
        warmth.gain.value = 2.5 * p;
        presence.gain.value = 3 * p;
        air.gain.value = 2 * p;
        wet.gain.value = 0.12 * p;
    };
    return { input, setPolish };
}

export interface TransitionMetrics {
    dipDb: number,   // quietest moment inside the transition relative to the surrounding loudness
    bumpDb: number,  // loudest moment inside the transition relative to the surrounding loudness
    peak: number     // absolute sample peak of the whole preview (>1 = clipping)
}

/** Loudness continuity check on a rendered transition (0.5 s windows). */
export function analyzeTransition(buf: AudioBuffer, T0: number, L: number): TransitionMetrics {
    const sr = buf.sampleRate;
    const chans = Array.from({ length: buf.numberOfChannels }, (_, c) => buf.getChannelData(c));
    const win = Math.floor(0.5 * sr);
    const hop = Math.floor(0.25 * sr);
    const wins: { t0: number, t1: number, rms: number }[] = [];
    let peak = 0;
    for (const ch of chans) for (let i = 0; i < ch.length; i++) peak = Math.max(peak, Math.abs(ch[i]!));
    for (let s = 0; s + win <= buf.length; s += hop) {
        let sum = 0;
        for (const ch of chans) for (let i = s; i < s + win; i++) sum += ch[i]! * ch[i]!;
        wins.push({ t0: s / sr, t1: (s + win) / sr, rms: Math.sqrt(sum / (win * chans.length)) });
    }
    const median = (v: number[]) => v.sort((x, y) => x - y)[Math.floor(v.length / 2)] || 1e-9;
    const before = median(wins.filter(w => w.t1 <= T0 - 0.5).map(w => w.rms));
    const after = median(wins.filter(w => w.t0 >= T0 + L + 0.5).map(w => w.rms));
    const inside = wins.filter(w => w.t1 > T0 && w.t0 < T0 + L).map(w => w.rms);
    const db = (v: number, base: number) => 20 * Math.log10(Math.max(v, 1e-9) / base);
    // A hole is judged against the quieter side, a bump against the louder side, so a level change between the two
    // tracks is not reported as a problem.
    return {
        dipDb: db(Math.min(...inside), Math.min(before, after)),
        bumpDb: db(Math.max(...inside), Math.max(before, after)),
        peak
    };
}
