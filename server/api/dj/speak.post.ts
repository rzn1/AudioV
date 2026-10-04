import { defineEventHandler, readBody, createError, setResponseHeader } from 'h3';
import { buildDeepgramTts, deepgramHeaders } from '../../utils/deepgram';
import { deepgramBase, deepgramKey, requireKey, limit, cloudPost, failure } from '../../utils/cloud';
import { isWav, pcmToWav } from '../../utils/http';

// Speaks one announcement with a Deepgram Aura-2 voice and returns it as a WAV file.
export default defineEventHandler(async (event) => {
    requireKey(deepgramKey(), 'DEEPGRAM_API_KEY');
    limit('speak', 40);

    const body = await readBody<{ text?: string, voice?: string }>(event);
    const text = String(body?.text ?? '').trim();
    if (!text || text.length > 600) throw createError({ statusCode: 400, statusMessage: 'Bad text' });

    const req = buildDeepgramTts(deepgramBase(), String(body?.voice ?? ''), text);
    const r = await cloudPost(req.url, deepgramHeaders(deepgramKey()), req.body, 30_000);
    if (!r.ok || !r.bytes) throw failure(r, 'Voice', [deepgramKey()]);

    setResponseHeader(event, 'content-type', 'audio/wav');
    setResponseHeader(event, 'cache-control', 'no-store');
    return Buffer.from(isWav(r.bytes) ? r.bytes : pcmToWav(r.bytes, 24000));
});
