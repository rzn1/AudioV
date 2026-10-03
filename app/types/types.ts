export interface Vibe {
    name: string,
    colorA: string, // Base color
    colorB: string, // Highlight color
    speed: number,  // Simulation speed
    intensity?: number
}

export interface KeyInfo {
    root: number,            // 0 = C ... 11 = B
    mode: 'major' | 'minor',
    confidence: number,      // 0..1, below ~0.35 the key is treated as unknown
    camelot: string,         // e.g. "8A"
    name: string             // e.g. "A minor"
}

/** Piecewise playback-rate model of one scheduled track (constant rate, then a linear ramp back to 1). */
export interface Timeline {
    t0: number,        // AudioContext time at which buffer position p0 is reached
    p0: number,        // buffer position (s) at t0
    rate: number,      // playback rate during the transition
    holdUntil: number, // AudioContext time at which the rate starts ramping back to 1
    rampDur: number    // duration (ctx s) of the ramp back to 1
}

export interface CurrentTrack {
    index: number,
    startTime: number,
    duration: number,   // playable segment length (mixOut - mixIn), buffer seconds
    bufferStart: number, // mixIn
    startPoint: number,
    endPoint: number,
    fileDuration?: number,
    bpm: number,
    tempo?: number,
    tempoIn?: number,
    tempoOut?: number,
    beatOffset: number,
    key?: KeyInfo,
    vibe?: Vibe,
    rmsData: number[],
    timeline?: Timeline
}

/** Everything the analysis produces for a track (what gets persisted). */
export type AnalysisData = Omit<Tracks, 'buffer' | 'id'>;

export interface Tracks {
    id: string,             // stable id, used to persist the queue
    buffer: AudioBuffer,
    bpm: number,            // rounded, for display
    tempo: number,          // precise (fitted) global BPM
    tempoIn: number,        // BPM measured at mixIn (tempo of many tracks wanders, so mixes are matched on these)
    tempoOut: number,       // BPM measured at mixOut
    beatOffset: number,     // time (s) of the first beat in the file
    firstDownbeat: number,  // time (s) of the first bar start in the file
    downbeatConfidence?: number,
    rmsValues: number[],
    startPoint: number,     // == mixIn
    endPoint: number,       // == mixOut
    mixIn: number,          // phrase-aligned point where this track enters (buffer s)
    mixOut: number,         // phrase-aligned point where this track leaves (buffer s)
    introEnergy: number,
    outroEnergy: number,
    key?: KeyInfo,
    energy?: number,
    brightness?: number,
    vibe?: Vibe
}
