import { defineEventHandler, readBody, createError } from 'h3';
import { buildWordingRequest, parseWordingResponse } from '../../utils/wording';
import { wordingBase, wordingKey, wordingModel, requireKey, limit, cloudPost, failure } from '../../utils/cloud';

// Rewords an announcement skeleton ("That was {prev}. Up next, {next}.") in natural radio language through any
// OpenAI-compatible model. The song names are never sent: only the placeholders, which are filled in on the client.
export default defineEventHandler(async (event) => {
    requireKey(wordingKey(), 'WORDING_API_KEY');
    limit('script', 30);

    const body = await readBody<{ skeleton?: string, avoid?: string[] }>(event);
    const skeleton = String(body?.skeleton ?? '');
    if (!skeleton.includes('{next}') || skeleton.length > 200) {
        throw createError({ statusCode: 400, statusMessage: 'Bad skeleton' });
    }
    const avoid = (Array.isArray(body?.avoid) ? body!.avoid! : []).slice(0, 3).map(s => String(s).slice(0, 160));

    const req = buildWordingRequest(wordingBase(), wordingModel(), skeleton, avoid);
    const r = await cloudPost(req.url, { authorization: `Bearer ${wordingKey()}` }, req.body);
    if (!r.ok) throw failure(r, 'Wording', [wordingKey()]);

    const texts = parseWordingResponse(r.json);
    if (!texts.length) throw createError({ statusCode: 502, statusMessage: 'Empty answer' });
    return { texts };
});
