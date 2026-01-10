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
    vibe?: Vibe,
    rmsData: number[]
}

export interface Tracks {
    buffer: AudioBuffer,
    bpm: number,
    rmsValues: number[],
    startPoint: number,
    endPoint: number,
    energy?: number,
    brightness?: number,
    vibe?: Vibe
}