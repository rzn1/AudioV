// Wording of the announcements through any OpenAI-compatible chat endpoint (Groq by default: a free tier with generous
// limits and no card; also works with OpenRouter, Cerebras, a local Ollama/LM Studio server, ...). Pure helpers.

export const DEFAULT_WORDING_BASE = 'https://api.groq.com/openai/v1';
export const DEFAULT_WORDING_MODEL = 'llama-3.1-8b-instant';

export const WORDING_SYSTEM = [
    'You rewrite short radio DJ announcements for a music app.',
    'Say the same thing in warm, natural, relaxed words, like a real radio presenter linking two songs.',
    'The words {prev} and {next} stand for song names (title and artist): copy each exactly as it is, never change, translate or explain them, and keep {next}.',
    'Keep each one to one or two short sentences, at most 25 words.',
    'Do not add facts, opinions or praise about the songs or artists, no trivia, no years, no genres, no tempo or technical talk, no emojis, no exclamation marks.',
    'Reply with exactly three different versions, one per line, with no numbering and nothing else.'
].join(' ');

export function buildWordingRequest(base: string, model: string, skeleton: string, avoid: string[]) {
    const user = avoid.length
        ? `${skeleton}\n(Do not word it like these recent ones: ${avoid.map(a => `"${a}"`).join(', ')})`
        : skeleton;
    return {
        url: `${base}/chat/completions`,
        body: {
            model,
            messages: [{ role: 'system', content: WORDING_SYSTEM }, { role: 'user', content: user }],
            temperature: 0.9,
            max_tokens: 200
        }
    };
}

/** Splits an answer into its versions: one per line, a leading "1." / "-" / bullet removed. */
export function splitVersions(text: string): string[] {
    const out: string[] = [];
    for (const raw of String(text ?? '').split(/\r?\n/)) {
        const line = raw.replace(/^\s*(?:[-*•]|\d+[.)])\s*/, '').trim();
        if (line) out.push(line);
    }
    return out;
}

export function parseWordingResponse(json: any): string[] {
    const out: string[] = [];
    for (const c of json?.choices ?? []) out.push(...splitVersions(c?.message?.content ?? c?.text ?? ''));
    return out;
}
