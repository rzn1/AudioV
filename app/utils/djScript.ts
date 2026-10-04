// What the AI DJ says and when (pure, no model / Web Audio dependencies).
//
// Design: a small local model can vary the *wording* of a radio link, but it cannot be trusted with the song and artist
// names (it garbles them: "Lutherto", "Dead Ft. DaBaby by Red") or with facts (it invents things). So announcements
// are written with placeholders:  "That was {prev}. Up next, {next}."  The model only rewrites that sentence, the
// result is validated, and the exact names are substituted by code afterwards.

export interface DjTrack {
    artist?: string,
    title: string
}

export interface DjFacts {
    prev: DjTrack,
    next: DjTrack
}

export interface ChatMessage {
    role: 'system' | 'user' | 'assistant',
    content: string
}

// ---------------------------------------------------------------------------
// Track names: files are usually called "Artist - Title.mp3", often with download noise attached
// ---------------------------------------------------------------------------

const NOISE = [
    /\((?:official|lyric|lyrics|audio|video|music|visuali[sz]er|hd|hq|explicit|remaster(?:ed)?)[^)]*\)/gi,
    /\[(?:official|lyric|lyrics|audio|video|music|visuali[sz]er|hd|hq|explicit|remaster(?:ed)?)[^\]]*\]/gi,
    /\b(?:official\s+(?:music\s+)?(?:video|audio)|lyrics?(?:\s+video)?|audio|hd|hq|4k)\s*$/gi
];

export function parseTrackName(fileName: string): DjTrack {
    let name = fileName.replace(/\.[a-z0-9]{2,5}$/i, '').replace(/[_]+/g, ' ');
    for (const re of NOISE) name = name.replace(re, ' ');
    // Emoji and stray symbols are not worth reading out
    name = name.replace(/[^\p{L}\p{N}\s&'.,()\-!?+/:]/gu, ' ').replace(/\s+/g, ' ').trim();

    const split = name.split(/\s+[-–—]\s+/);
    if (split.length >= 2) {
        const artist = split[0]!.trim();
        const title = split.slice(1).join(' - ').trim();
        if (artist && title) return { artist, title };
    }
    return { title: name || 'the next track' };
}

/**
 * Makes a title or artist read the way a person would say it. A voice model reads text literally: "&" becomes a
 * stumble, "Ft." is spelled out, and an ALL-CAPS title ("MY EYES") can be read letter by letter.
 */
export function tidyName(text: string): string {
    let t = text
        .replace(/\s*&\s*/g, ' and ')
        .replace(/\b(?:feat|ft)\.?(?=\s)/gi, 'featuring')
        .replace(/\s+/g, ' ')
        .trim();
    const letters = t.replace(/[^\p{L}]/gu, '');
    // Whole name in capitals (and longer than a typical acronym): say it as words
    const dottedAcronym = /(?:\p{Lu}\.){2,}/u.test(t); // "D.A.N.C.E." is already spelled the way it is said
    if (!dottedAcronym && letters.length > 3 && letters === letters.toUpperCase() && letters !== letters.toLowerCase()) {
        t = t.toLowerCase().replace(/(^|[\s\-(/])(\p{L})/gu, (_, sep: string, c: string) => sep + c.toUpperCase());
    }
    return t;
}

/** "Title by Artist" (or just the title when the artist is unknown), tidied for speech. */
export const sayTrack = (t: DjTrack) =>
    t.artist ? `${tidyName(t.title)} by ${tidyName(t.artist)}` : tidyName(t.title);

// ---------------------------------------------------------------------------
// Announcements with placeholders
// ---------------------------------------------------------------------------

export const PREV = '{prev}';
export const NEXT = '{next}';

/** The plain announcements; also what the model is asked to rephrase, and what is spoken if it fails. */
export const SKELETONS = [
    'That was {prev}. Up next, {next}.',
    '{prev}, and now {next}.',
    'That one was {prev}. Here is {next}.',
    'You were listening to {prev}. Coming up, {next}.',
    'That was {prev}. Next, {next}.',
    'Keeping it going with {next}.'
];

export const pickSkeleton = (seed: number) => SKELETONS[Math.floor(seed * SKELETONS.length) % SKELETONS.length]!;

/** Puts the exact song / artist names into a skeleton. */
export function fillSkeleton(skeleton: string, facts: DjFacts): string {
    return skeleton.split(PREV).join(sayTrack(facts.prev)).split(NEXT).join(sayTrack(facts.next));
}

/** The plain announcement for a pair (the fallback, and the template for variety). */
export const templateLine = (facts: DjFacts, seed: number) => fillSkeleton(pickSkeleton(seed), facts);

// ---------------------------------------------------------------------------
// Prompt for the language model
// ---------------------------------------------------------------------------

const SYSTEM = [
    'You rewrite short radio DJ announcements.',
    'Say the same thing in different, natural, relaxed words.',
    'The words {prev} and {next} stand for song names: copy them exactly as they are, never change or explain them.',
    'Do not add anything new: no opinions, no facts, no exclamation marks.',
    'Reply with only the rewritten announcement.'
].join(' ');

// Deliberately plain: small models copy the style of the examples, so they must not contain opinions or claims.
const EXAMPLES: [string, string][] = [
    ['That was {prev}. Up next, {next}.', 'You were listening to {prev}, and coming up now is {next}.'],
    ['{prev}, and now {next}.', 'Alright, that was {prev}. Moving on to {next}.'],
    ['You were listening to {prev}. Coming up, {next}.', '{prev} just finished, and here comes {next}.']
];

/** Messages asking the model to rephrase a skeleton. */
export function buildMessages(skeleton: string): ChatMessage[] {
    const msgs: ChatMessage[] = [{ role: 'system', content: SYSTEM }];
    for (const [from, to] of EXAMPLES) {
        msgs.push({ role: 'user', content: from }, { role: 'assistant', content: to });
    }
    msgs.push({ role: 'user', content: skeleton });
    return msgs;
}

// ---------------------------------------------------------------------------
// Checking what the model said
// ---------------------------------------------------------------------------

const norm = (s: string) => s.toLowerCase().normalize('NFKD').replace(/[^\p{L}\p{N}]+/gu, ' ').trim();
const tokens = (s: string) => norm(s).split(' ').filter(Boolean);

/** Tidies model output into something that can be spoken; tolerates {Prev}, [prev], <next> style placeholders. */
export function cleanLine(raw: string): string {
    return raw
        .replace(/[{[<]\s*prev\s*[}\]>]/gi, PREV)
        .replace(/[{[<]\s*next\s*[}\]>]/gi, NEXT)
        .replace(/^["'“”‘’\s]+|["'“”‘’\s]+$/g, '')
        .replace(/\s*\n+\s*/g, ' ')
        .replace(/!+/g, '.')
        .replace(/\s+/g, ' ')
        .trim();
}

/**
 * Plain radio phrasing the DJ may use around the song names. Anything outside this list is treated as the model making
 * something up, e.g. "sounds like a soulful rap track".
 */
const ALLOWED = new Set((
    'that was up next now and here is are coming comes by from on you ve been listening to with a the were one ' +
    'track song tune this it s let keep keeping going staying stay then after before for of in our mix set radio ' +
    'thanks thank nice good great enjoy enjoying hope so just some more music another back time playing played ' +
    'plays over again ll d put give bring bringing onto into new brings take takes your ' +
    'but or as at all out off right straight stick stays sticking continue continuing ' +
    'alright okay ok moving move rolling roll finished ended wrapped starting start begins begin heading head ' +
    'lined ready coming us let'
).split(' '));

/** True when the model just handed back the sentence it was given (no variety gained). */
export const isSameLine = (a: string, b: string) => norm(a) === norm(b);

const FORWARD = new Set(['next', 'up', 'coming', 'comes', 'here', 'moving', 'heading', 'begins', 'begin', 'starting', 'start', 'ready']);
const BACKWARD = new Set(['was', 'listening', 'finished', 'ended', 'wrapped', 'played']);

/**
 * The placeholders must keep their roles: "{prev} is up next" (the song that already played, announced as coming up)
 * is rejected. Within each clause, forward-looking words may not follow {prev} and past-tense words may not follow
 * {next}.
 */
export function rolesConsistent(line: string): boolean {
    for (const clause of line.split(/[.,;:?]/)) {
        let last: 'prev' | 'next' | null = null;
        for (const m of clause.toLowerCase().matchAll(/\{prev\}|\{next\}|[\p{L}\p{N}]+/gu)) {
            const w = m[0];
            if (w === PREV) last = 'prev';
            else if (w === NEXT) last = 'next';
            else if (last === 'prev' && FORWARD.has(w)) return false;
            else if (last === 'next' && BACKWARD.has(w)) return false;
        }
    }
    return true;
}

/**
 * A rewritten skeleton is only used if it is short, still contains {next} exactly once (and {prev} at most once), keeps
 * the roles of the two songs, and everything else in it is plain radio phrasing. Small models do wander, so anything
 * doubtful is rejected.
 */
export function isValidSkeleton(line: string): boolean {
    // "we're {next}" / "you're {next}" / "I'm {next}": a person-contraction directly in front of a song name is a slip
    if (/\b(?:we|you|they|i)'(?:re|m)\s*\{(?:prev|next)\}/i.test(line.replace(/[’‘]/g, "'"))) return false;
    const count = (ph: string) => line.split(ph).length - 1;
    if (count(NEXT) !== 1 || count(PREV) > 1) return false;
    if (/\p{Extended_Pictographic}/u.test(line)) return false;
    const rest = line.split(PREV).join(' ').split(NEXT).join(' ');
    const words = tokens(rest);
    if (words.length < 1 || words.length > 25) return false;
    return words.every(w => ALLOWED.has(w)) && rolesConsistent(line);
}

/**
 * Words that signal opinion, trivia or technical talk. A strong cloud model writes warmer, freer language than the tiny
 * local one, so instead of a vocabulary whitelist it is checked against what must NOT appear.
 */
const CLOUD_BLOCKED = new RegExp(
    '\\b(?:sounds?|sounding|feels?|feeling|vibes?|vibing|bangers?|hits?|classics?|legend\\w*|iconic|masterpiece|' +
    'amazing|incredible|fantastic|awesome|best|greatest|favou?rites?|released?|album|single|track record|genre|' +
    'tempo|bpm|beats?|mix(?:es|ed|ing)?|key|crossfade|transition|famous|known|popular|chart\\w*|number one|' +
    'rapper|singer|band|producer|grammy\\w*)\\b', 'i');

/** Same idea as isValidSkeleton, for the cloud model: placeholders intact, roles kept, no claims / numbers / tech talk. */
export function isValidCloudSkeleton(line: string): boolean {
    const count = (ph: string) => line.split(ph).length - 1;
    if (count(NEXT) !== 1 || count(PREV) > 1) return false;
    if (/\p{Extended_Pictographic}/u.test(line)) return false;
    if (/\b(?:we|you|they|i)'(?:re|m)\s*\{(?:prev|next)\}/i.test(line.replace(/[’‘]/g, "'"))) return false;
    const rest = line.split(PREV).join(' ').split(NEXT).join(' ');
    if (/\d/.test(rest) || CLOUD_BLOCKED.test(rest)) return false;
    const words = tokens(rest);
    if (words.length < 1 || words.length > 30) return false;
    return rolesConsistent(line);
}

// ---------------------------------------------------------------------------
// Timing: where in a transition the DJ speaks
// ---------------------------------------------------------------------------

/**
 * Speaks over the part of the transition where the incoming track is already there, a quarter of the way in after it
 * enters, and never lets the voice run on for long after the mix is over. All in AudioContext seconds.
 */
export function pickSpeechStart(o: { bStart: number, transitionEnd: number, duration: number, now: number }): number {
    let start = o.bStart + 0.25 * (o.transitionEnd - o.bStart);
    const latestEnd = o.transitionEnd + 6;
    if (start + o.duration > latestEnd) start = Math.max(o.bStart, latestEnd - o.duration);
    return Math.max(start, o.now + 0.3);
}

/** Should this transition get a spoken line? `every` = 1 → each one, 2 → every second one, … */
export function shouldSpeak(transitionCount: number, every: number): boolean {
    return every <= 1 || transitionCount % every === 0;
}
