export interface Vibe {
    name: string,
    colorA: string, // Base color
    colorB: string, // Highlight color
    speed: number  // Simulation speed
}

export interface CurrentTrack {
    index: number,
    startTime: number,
    duration: number,
    bufferStart: number,
    startPoint: number,
    endPoint: number,
    fileDuration?: number,
    bpm: number,
    beatOffset: number,
    key?: string,
    vibe?: Vibe,
    rmsData: number[]
}

export interface Tracks {
    buffer: AudioBuffer,
    bpm: number,
    rmsValues: number[],
    startPoint: number,
    endPoint: number,
    beatOffset: number,
    key?: string,
    energy?: number,
    brightness?: number,
    vibe?: Vibe
}