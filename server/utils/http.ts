// Small pure helpers shared by the /api/dj routes (no network, no Nitro: unit-testable in plain Node).

/** Seconds to wait before retrying a 429, from the Retry-After header (default 60). 0 for any other status. */
export function retryAfterSeconds(status: number, headers: { get(n: string): string | null }): number {
    if (status !== 429) return 0;
    const h = Number(headers.get('retry-after'));
    return h > 0 ? Math.ceil(h) : 60;
}

/** Makes an upstream error message safe to show: secrets and anything that looks like a token are removed. */
export function sanitizeMessage(message: unknown, secrets: string[] = []): string {
    let s = String(message ?? '');
    for (const secret of secrets) if (secret) s = s.split(secret).join('…');
    return s
        .replace(/\b(?:Bearer|Token)\s+[A-Za-z0-9._~+/=-]{8,}/g, '$1 …')
        .replace(/\b(?:key|api[_-]?key|token)=[A-Za-z0-9._~+/-]+/gi, 'key=…')
        .slice(0, 200);
}

/** Wraps raw 16-bit mono PCM in a WAV header so the browser can decode it. */
export function pcmToWav(pcm: Uint8Array, sampleRate = 24000): Uint8Array {
    const header = new DataView(new ArrayBuffer(44));
    const w = (o: number, s: string) => { for (let i = 0; i < s.length; i++) header.setUint8(o + i, s.charCodeAt(i)); };
    w(0, 'RIFF'); header.setUint32(4, 36 + pcm.length, true); w(8, 'WAVE'); w(12, 'fmt ');
    header.setUint32(16, 16, true); header.setUint16(20, 1, true); header.setUint16(22, 1, true);
    header.setUint32(24, sampleRate, true); header.setUint32(28, sampleRate * 2, true);
    header.setUint16(32, 2, true); header.setUint16(34, 16, true);
    w(36, 'data'); header.setUint32(40, pcm.length, true);
    const out = new Uint8Array(44 + pcm.length);
    out.set(new Uint8Array(header.buffer), 0);
    out.set(pcm, 44);
    return out;
}

export const isWav = (b: Uint8Array) => b.length > 12 && String.fromCharCode(b[0]!, b[1]!, b[2]!, b[3]!) === 'RIFF';
