// Visual palette helpers (pure). Colours come from the track's key so the Camelot wheel is visible: keys that mix well
// are neighbours on the wheel and therefore neighbours in hue, while a key clash shows up as a big colour jump.
import type { KeyInfo } from '../types/types';

export type HSL = [number, number, number];

export interface KeyPalette {
    a: HSL,  // base
    b: HSL,  // highlight
    c: HSL   // accent (spectrum tips, shockwaves)
}

export const KEY_MIN_CONFIDENCE = 0.35;

/** Hue (0..1) for a Camelot number 1..12: adjacent numbers are 30 degrees apart. */
export function keyHue(camelotNumber: number): number {
    return ((((camelotNumber - 1) / 12) + 0.55) % 1 + 1) % 1;
}

/** Palette for a detected key, or null when the key is unknown / unsure. */
export function keyPalette(key?: KeyInfo | null): KeyPalette | null {
    if (!key || key.confidence < KEY_MIN_CONFIDENCE) return null;
    const n = parseInt(key.camelot, 10);
    if (!(n >= 1 && n <= 12)) return null;
    const minor = key.camelot.endsWith('A');
    const h = keyHue(n);
    return {
        a: [h, minor ? 0.72 : 0.85, minor ? 0.4 : 0.52],
        b: [(h + 0.09) % 1, 0.9, minor ? 0.56 : 0.62],
        c: [(h + 0.4) % 1, 0.85, 0.62]
    };
}

/** Stable pseudo-random number in [0,1) from a string (per-track pattern seed). */
export function hashString(s: string): number {
    let h = 2166136261;
    for (let i = 0; i < s.length; i++) {
        h ^= s.charCodeAt(i);
        h = Math.imul(h, 16777619);
    }
    return ((h >>> 0) % 100000) / 100000;
}

/** Shortest-path hue distance, 0..0.5 */
export function hueDistance(a: number, b: number): number {
    const d = Math.abs(a - b) % 1;
    return Math.min(d, 1 - d);
}
