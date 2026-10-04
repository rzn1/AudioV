// Who may use the paid / metered /api/dj/* endpoints.
//
// Locally nobody else can reach the dev server, so it is open. A public deployment (Vercel) is different: anyone who
// finds the URL could call the voice endpoint and burn through the Deepgram credit. So in production the endpoints are
// LOCKED unless DJ_ACCESS_CODE is set, and then every call must carry that code (header `x-dj-code`). The code is
// compared in constant time and wrong guesses are rate-limited per client.
import { createError, getHeader, getRequestIP } from 'h3';
import type { H3Event } from 'h3';
import { timingSafeEqual } from 'node:crypto';

export const isProd = () => process.env.NODE_ENV === 'production';
export const accessCode = () => process.env.DJ_ACCESS_CODE || '';
/** The YouTube / SoundCloud downloader routes only run locally unless explicitly enabled (they do not work on Vercel). */
export const importEnabled = () => !isProd() || process.env.ENABLE_URL_IMPORT === '1';

export type AccessMode = 'open' | 'code' | 'locked';

export function accessMode(): AccessMode {
    if (accessCode()) return 'code';
    return isProd() && process.env.DJ_ALLOW_OPEN !== '1' ? 'locked' : 'open';
}

/** Constant-time comparison, so response timing does not leak how much of a guess was right. */
export function codesMatch(given: string, expected: string): boolean {
    if (!expected) return false;
    const a = Buffer.from(given);
    const b = Buffer.from(expected);
    if (a.length !== b.length) {
        timingSafeEqual(b, b); // keep the work comparable
        return false;
    }
    return timingSafeEqual(a, b);
}

export const clientId = (event: H3Event) => getRequestIP(event, { xForwardedFor: true }) ?? 'unknown';

// Wrong-code attempts per client (best effort: serverless instances do not share memory, so add a Vercel firewall rule too)
const failures = new Map<string, number[]>();
const MAX_FAILURES = 10;
const FAILURE_WINDOW_MS = 10 * 60_000;

function noteFailure(id: string) {
    const now = Date.now();
    const recent = (failures.get(id) ?? []).filter(t => now - t < FAILURE_WINDOW_MS);
    if (recent.length >= MAX_FAILURES) {
        throw createError({ statusCode: 429, statusMessage: 'Too many attempts', data: { message: 'Too many wrong codes, try again later', retryAfter: 600 } });
    }
    recent.push(now);
    failures.set(id, recent);
}

/** True when this request may use the endpoints. A wrong code counts against the client's attempt limit. */
export function isAuthorized(event: H3Event, countFailure = true): boolean {
    const mode = accessMode();
    if (mode === 'open') return true;
    if (mode === 'locked') return false;
    const given = String(getHeader(event, 'x-dj-code') ?? '');
    const ok = codesMatch(given, accessCode());
    if (!ok && given && countFailure) noteFailure(clientId(event));
    return ok;
}

export function requireAccess(event: H3Event) {
    if (isAuthorized(event)) return;
    throw createError({
        statusCode: 401,
        statusMessage: 'Access code required',
        data: {
            message: accessMode() === 'locked'
                ? 'The cloud DJ is locked: set DJ_ACCESS_CODE on the server'
                : 'Wrong or missing access code'
        }
    });
}
