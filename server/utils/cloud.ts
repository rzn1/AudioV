// Shared plumbing for the /api/dj/* routes: keys come from the server's environment (never sent to the browser), a
// sliding-window limiter stops a runaway client from burning through a quota, and upstream errors are sanitised.
import { createError } from 'h3';
import { retryAfterSeconds, sanitizeMessage } from './http';
import { DEFAULT_WORDING_BASE, DEFAULT_WORDING_MODEL } from './wording';

export const deepgramBase = () => (process.env.DEEPGRAM_BASE_URL || 'https://api.deepgram.com').replace(/\/$/, '');
export const deepgramKey = () => process.env.DEEPGRAM_API_KEY || '';

export const wordingBase = () => (process.env.WORDING_BASE_URL || DEFAULT_WORDING_BASE).replace(/\/$/, '');
export const wordingKey = () => process.env.WORDING_API_KEY || process.env.GROQ_API_KEY || '';
export const wordingModel = () => process.env.WORDING_MODEL || DEFAULT_WORDING_MODEL;

const hits = new Map<string, number[]>();

/** Allows at most `max` calls per `windowMs` for `bucket`; throws a 429 (with a retry hint) otherwise. */
export function limit(bucket: string, max: number, windowMs = 60_000) {
    const now = Date.now();
    const recent = (hits.get(bucket) ?? []).filter(t => now - t < windowMs);
    if (recent.length >= max) {
        const wait = Math.ceil((windowMs - (now - recent[0]!)) / 1000);
        throw createError({ statusCode: 429, statusMessage: 'Too many requests', data: { message: 'Local rate limit reached', retryAfter: wait } });
    }
    recent.push(now);
    hits.set(bucket, recent);
}

export function requireKey(key: string, name: string) {
    if (!key) throw createError({ statusCode: 503, statusMessage: 'No API key', data: { message: `${name} is not set on the server` } });
}

export interface CloudResult { status: number, ok: boolean, json: any, bytes: Uint8Array | null, retryAfter: number }

/** POSTs JSON; returns either the audio bytes (when the answer is audio) or the parsed JSON. Never throws on HTTP errors. */
export async function cloudPost(url: string, headers: Record<string, string>, body: unknown, timeoutMs = 45_000): Promise<CloudResult> {
    const res = await fetch(url, {
        method: 'POST',
        headers: { 'content-type': 'application/json', ...headers },
        body: JSON.stringify(body),
        signal: AbortSignal.timeout(timeoutMs)
    });
    const retryAfter = retryAfterSeconds(res.status, res.headers);
    if (res.ok && /^audio\//.test(res.headers.get('content-type') ?? '')) {
        return { status: res.status, ok: true, json: null, bytes: new Uint8Array(await res.arrayBuffer()), retryAfter };
    }
    const json = await res.json().catch(() => ({}));
    return { status: res.status, ok: res.ok, json, bytes: null, retryAfter };
}

/** A failed upstream call as an error for the client: short message, retry hint, no secrets. */
export function failure(r: CloudResult, what: string, secrets: string[] = []) {
    const raw = r.json?.err_msg ?? r.json?.error?.message ?? r.json?.message ?? r.json?.error ?? '';
    return createError({
        statusCode: r.status >= 400 && r.status < 600 ? r.status : 502,
        statusMessage: `${what} failed`,
        data: { message: sanitizeMessage(typeof raw === 'string' ? raw : JSON.stringify(raw), secrets) || `${what} failed (${r.status})`, retryAfter: r.retryAfter }
    });
}
