export interface CurrentTrack {
    index: number,
    startTime: number,
    duration: number,
    bufferStart: number,
    startPoint: number,
    endPoint: number,
    bpm: number,
    rmsData: number[]
}

export interface Tracks{
    buffer: AudioBuffer,
    bpm: number
}