// Tiny event bridge so the AI DJ store can follow playback without the player store importing it (which would be a
// circular import). The player calls these; the DJ store registers itself in `init()`.
import type { Tracks } from '../types/types';

export interface TransitionInfo {
    a: Tracks,
    b: Tracks,
    T0: number,         // AudioContext time the transition starts
    bStart: number,     // AudioContext time the incoming track enters
    length: number,     // transition length (s)
    now: number         // AudioContext time when it was planned
}

export const mixHooks: {
    onTrackStart: ((meta: Tracks) => void) | null,
    onTransition: ((info: TransitionInfo) => void) | null
} = {
    onTrackStart: null,
    onTransition: null
};
