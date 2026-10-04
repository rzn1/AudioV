import { defineStore } from "pinia";
import type { Tracks } from "@/types/types";
import { usePlayerStore } from "~/stores/player";
import { mixHooks } from "~/utils/mixHooks";
import type { TransitionInfo } from "~/utils/mixHooks";
import { hashString } from "~/utils/palette";
import {
  parseTrackName, buildMessages, cleanLine, isValidSkeleton, isValidCloudSkeleton, isSameLine, pickSkeleton,
  fillSkeleton, pickSpeechStart, shouldSpeak, SKELETONS
} from "~/utils/djScript";
import type { DjFacts } from "~/utils/djScript";

// The AI DJ: a language model words a short announcement, a text-to-speech model says it, and the player plays it over
// the transition (ducking the music). Two engines:
//   local - small open models running in workers in the browser: free, offline, no limits, but flat-sounding and slow
//   cloud - Deepgram Aura-2 voice through our own server routes (/api/dj/*): natural voice, a few seconds per line;
//           needs a free Deepgram key ($200 credit, no card) in the server's environment. Optional wording model
//           (any OpenAI-compatible endpoint, Groq by default). Falls back to local when the cloud is unavailable.
// Lines are generated in the background while the previous track plays, long before they're needed.

interface Clip {
  text: string,
  buffer: AudioBuffer,
  source: 'ai' | 'template',
  engine: 'local' | 'cloud',
  llmSeconds: number,   // time the language model took (0 when it was not used)
  ttsSeconds: number    // time the voice model took
}

const SETTINGS_KEY = 'audiov.dj';
const CODE_KEY = 'audiov.dj.code';
const LOCAL_OK_KEY = 'audiov.dj.localOk'; // set once the local models have been set up (so falling back needs no new download)

// Not reactive on purpose: a worker, promises and audio buffers must not be wrapped in proxies
const workers: Record<'tts' | 'llm', Worker | null> = { tts: null, llm: null };
let nextJob = 1;
const jobs = new Map<number, { resolve: (v: any) => void, reject: (e: Error) => void }>();
const loads = new Map<string, { resolve: () => void, reject: (e: Error) => void }>();
const fileProgress = new Map<string, { loaded: number, total: number }>();
const clips = new Map<string, Clip>();
// Each time a pair's line has been spoken, the next one for that pair uses a different seed (so it reads differently)
const variants = new Map<string, number>();
const pending = new Map<string, Promise<Clip | null>>();
let readyPromise: Promise<void> | null = null;
let transitionCount = 0;
let cloudBackoffUntil = 0;       // ms timestamp: the cloud voice is not used before this (after a rate limit / error)
let wordingBackoffUntil = 0;     // same for the wording model; it never blocks the voice
const recentLines: string[] = []; // the last few cloud lines, so the next one is worded differently
const POOL_KEY = 'audiov.dj.pool';
// Reworded announcements with {prev}/{next} placeholders, ready to use for any pair (kept across reloads)
const wordingPool: string[] = (() => {
  try { const p = JSON.parse(localStorage.getItem(POOL_KEY) || '[]'); return Array.isArray(p) ? p.filter(x => typeof x === 'string').slice(-12) : []; } catch (e) { return []; }
})();

/** How much of the broadcast-style voice processing to apply: the cloud voice is already produced, so only a little. */
const polishFor = (c: Clip) => (c.engine === 'cloud' ? 0.35 : 1);

// Download weight of each model for the combined progress bar (voice ~90 MB, language model ~490 MB)
const WEIGHT = { tts: 0.15, llm: 0.85 } as const;

export const DJ_VOICES = [
  { value: 'af_heart', label: 'Heart (US, female)' },
  { value: 'af_bella', label: 'Bella (US, female)' },
  { value: 'bf_emma', label: 'Emma (UK, female)' },
  { value: 'am_michael', label: 'Michael (US, male)' },
  { value: 'bm_george', label: 'George (UK, male)' }
];

export const useDjStore = defineStore("dj", {
  state: () => ({
    enabled: false,
    every: 2,                 // speak on every n-th transition
    engine: 'local' as 'local' | 'cloud',
    cloudAvailable: false,    // the cloud voice can be used: the server has a Deepgram key and this client is allowed
    cloudConfigured: false,   // the server has a Deepgram key at all
    access: 'open' as 'open' | 'code' | 'locked', // 'code': the server wants an access code; 'locked': none is configured (production)
    authorized: true,
    accessCode: '',           // typed by the user, kept in localStorage, sent as x-dj-code
    importEnabled: true,      // the YouTube / SoundCloud downloader routes exist (they are off in production)
    cloudWording: false,      // the server also has a wording key (livelier lines; otherwise the built-in sentences)
    cloudVoices: [] as { value: string, label: string }[],
    cloudError: '',           // last cloud problem, shown in the UI
    cloudVoice: 'aura-2-aries-en',
    voice: 'af_heart',
    status: 'off' as 'off' | 'loading' | 'ready' | 'error',
    stage: '',
    progress: 0,              // 0..100 model download
    error: '',
    llmReady: false,          // false -> template lines only
    lastLine: '',
    lastSource: '' as '' | 'ai' | 'template',
    lastTiming: '',           // how long the last line took to make, e.g. "model 9s + voice 14s"
    duck: 0.15,               // music level while the DJ talks (1 = no ducking, 0.15 is about -16 dB)
    busy: false               // generating a line right now
  }),

  actions: {
    async init() {
      let savedEngine: string | undefined;
      try {
        const saved = JSON.parse(localStorage.getItem(SETTINGS_KEY) || '{}');
        if (typeof saved.enabled === 'boolean') this.enabled = saved.enabled;
        if (typeof saved.every === 'number') this.every = saved.every;
        if (DJ_VOICES.some(v => v.value === saved.voice)) this.voice = saved.voice;
        if (typeof saved.cloudVoice === 'string') this.cloudVoice = saved.cloudVoice; // validated against the server's list below
        if (typeof saved.duck === 'number' && saved.duck >= 0 && saved.duck <= 1) this.duck = saved.duck;
        savedEngine = saved.engine;
      } catch (e) { }

      mixHooks.onTrackStart = (meta) => this.onTrackStart(meta);
      mixHooks.onTransition = (info) => this.onTransition(info);

      try { this.accessCode = localStorage.getItem(CODE_KEY) || ''; } catch (e) { }
      await this.checkCloud();
      // Nothing chosen yet: use the cloud voice when a key is configured, it is the better one
      this.engine = savedEngine === 'local' || savedEngine === 'cloud'
        ? savedEngine
        : (this.cloudAvailable ? 'cloud' : 'local');
      if (this.engine === 'cloud' && !this.cloudAvailable) this.engine = 'local';

      if (this.enabled) this.ensureReady().then(() => this.warmUp()).catch(() => { });
    },

    save() {
      try {
        localStorage.setItem(SETTINGS_KEY, JSON.stringify({
          enabled: this.enabled, every: this.every, engine: this.engine, voice: this.voice,
          cloudVoice: this.cloudVoice, duck: this.duck
        }));
      } catch (e) { }
    },

    /** Asks the server what the cloud engine can do (the keys themselves never reach the browser). */
    async checkCloud() {
      try {
        const res = await fetch('/api/dj/status', { headers: this.accessCode ? { 'x-dj-code': this.accessCode } : {} });
        const j = res.ok ? await res.json() : null;
        this.cloudConfigured = !!j?.voice;
        this.access = j?.access ?? 'open';
        this.authorized = j?.authorized !== false;
        this.importEnabled = j?.importEnabled !== false;
        this.cloudAvailable = !!j?.voice && this.authorized;
        this.cloudWording = !!j?.wording && this.authorized;
        this.cloudVoices = Array.isArray(j?.voices) ? j.voices : [];
        if (this.cloudVoices.length && !this.cloudVoices.some(v => v.value === this.cloudVoice)) {
          this.cloudVoice = j?.defaultVoice ?? this.cloudVoices[0]!.value;
        }
      } catch (e) {
        this.cloudAvailable = false;
        this.cloudWording = false;
      }
    },

    /** The user typed the access code the server asked for. */
    async setAccessCode(code: string) {
      this.accessCode = code.trim();
      try { localStorage.setItem(CODE_KEY, this.accessCode); } catch (e) { }
      cloudBackoffUntil = 0;
      wordingBackoffUntil = 0;
      this.cloudError = '';
      await this.checkCloud();
      if (this.cloudAvailable) {
        this.engine = 'cloud';
        this.save();
        readyPromise = null;
        if (this.enabled) this.ensureReady().then(() => this.warmUp()).catch(() => { });
      } else if (this.access === 'code') {
        this.cloudError = 'That access code was not accepted';
      }
    },

    setEngine(engine: 'local' | 'cloud') {
      if (engine === 'cloud' && !this.cloudAvailable) return;
      this.engine = engine;
      this.cloudError = '';
      clips.clear();
      this.save();
      readyPromise = null;
      if (this.enabled) this.ensureReady().then(() => this.warmUp()).catch(() => { });
    },

    setEnabled(on: boolean) {
      this.enabled = on;
      this.save();
      if (on) this.ensureReady().then(() => this.warmUp()).catch(() => { });
    },

    setDuck(level: number) {
      this.duck = Math.min(1, Math.max(0, level));
      this.save();
    },

    setEvery(n: number) {
      this.every = n;
      this.save();
    },

    setVoice(v: string) {
      if (this.engine === 'cloud') this.cloudVoice = v;
      else this.voice = v;
      clips.clear(); // lines were spoken in the old voice
      this.save();
    },

    // -----------------------------------------------------------------------------------------
    // Worker plumbing
    // -----------------------------------------------------------------------------------------

    /**
     * One worker per model, so wording the next line (language model) and speaking the current one (voice model) run
     * at the same time on different threads instead of queueing behind each other. Each worker only ever loads the
     * model it is asked for.
     */
    getWorker(kind: 'tts' | 'llm'): Worker {
      const have = workers[kind];
      if (have) return have;
      const store = this;
      const w = new Worker(new URL('../workers/dj.worker.ts', import.meta.url), { type: 'module' });
      workers[kind] = w;
      w.onmessage = (e: MessageEvent) => {
        const m = e.data;
        if (m.type === 'progress') store.onProgress(m);
        else if (m.type === 'ready') loads.get(m.what)?.resolve();
        else if (m.type === 'error') loads.get(m.what)?.reject(new Error(m.error));
        else if (m.type === 'script' || m.type === 'speech') {
          const j = jobs.get(m.id);
          jobs.delete(m.id);
          if (m.error) j?.reject(new Error(m.error));
          else j?.resolve(m);
        }
      };
      w.onerror = (e) => {
        const err = new Error(e.message || 'DJ worker crashed');
        loads.get(kind)?.reject(err);
        jobs.forEach(j => j.reject(err));
        workers[kind] = null;
      };
      return w;
    },

    onProgress(m: any) {
      if (m.status === 'progress' && m.total) fileProgress.set(`${m.what}:${m.file}`, { loaded: m.loaded, total: m.total });
      else if (m.status === 'done') {
        const f = fileProgress.get(`${m.what}:${m.file}`);
        if (f) f.loaded = f.total;
      }
      const pct = (what: 'tts' | 'llm') => {
        let loaded = 0, total = 0;
        fileProgress.forEach((v, k) => { if (k.startsWith(what + ':')) { loaded += v.loaded; total += v.total; } });
        return total ? loaded / total : 0;
      };
      this.progress = Math.round(100 * (WEIGHT.tts * pct('tts') + WEIGHT.llm * pct('llm')));
      // (downloads on first use only; afterwards the same files just load from the browser cache)
      this.stage = m.what === 'tts' ? 'Getting the DJ voice ready' : 'Getting the DJ brain ready';
    },

    loadModel(what: 'tts' | 'llm'): Promise<void> {
      return new Promise((resolve, reject) => {
        loads.set(what, { resolve, reject });
        this.getWorker(what).postMessage({ type: 'load', what });
      });
    },

    request(type: 'script' | 'speak', payload: Record<string, unknown>, timeoutMs: number): Promise<any> {
      return new Promise((resolve, reject) => {
        const id = nextJob++;
        const timer = setTimeout(() => { jobs.delete(id); reject(new Error(`${type} timed out`)); }, timeoutMs);
        jobs.set(id, {
          resolve: (v) => { clearTimeout(timer); resolve(v); },
          reject: (e) => { clearTimeout(timer); reject(e); }
        });
        this.getWorker(type === 'script' ? 'llm' : 'tts').postMessage({ type, id, ...payload });
      });
    },

    /** Ready to make lines with the chosen engine. The cloud engine needs no downloads. */
    ensureReady(): Promise<void> {
      if (this.engine === 'cloud') {
        this.status = this.cloudAvailable ? 'ready' : 'error';
        this.error = this.cloudAvailable ? '' : 'The server has no DEEPGRAM_API_KEY';
        return this.cloudAvailable ? Promise.resolve() : Promise.reject(new Error(this.error));
      }
      return this.ensureLocalReady();
    },

    /** Downloads (first time only) and loads the local voice and language models. */
    ensureLocalReady(): Promise<void> {
      if (readyPromise) return readyPromise;
      this.status = 'loading';
      this.error = '';
      this.progress = 0;
      readyPromise = (async () => {
        // Both models load (and download) at the same time, each in its own worker
        const tts = this.loadModel('tts'); // required: without a voice there is nothing to play
        const llm = this.loadModel('llm')
          .then(() => { this.llmReady = true; })
          .catch((e) => {
            // Optional: without it the DJ still talks, using the plain lines
            console.warn('[dj] language model unavailable, using plain lines', e);
            this.llmReady = false;
          });
        await tts;
        await llm;
        try { localStorage.setItem(LOCAL_OK_KEY, '1'); } catch (e) { }
        this.status = 'ready';
        this.progress = 100;
        this.stage = '';
      })().catch((e) => {
        this.status = 'error';
        this.error = e?.message ?? String(e);
        readyPromise = null;
        throw e;
      });
      return readyPromise;
    },

    // -----------------------------------------------------------------------------------------
    // Lines
    // -----------------------------------------------------------------------------------------

    /** True when the local models have been set up before, so falling back to them costs no surprise download. */
    localFallbackAvailable(): boolean {
      try { return localStorage.getItem(LOCAL_OK_KEY) === '1'; } catch (e) { return false; }
    },

    cloudUsable(): boolean {
      return this.engine === 'cloud' && this.cloudAvailable && Date.now() >= cloudBackoffUntil;
    },

    /** Remembers a cloud problem and pauses the cloud engine for a while (longer when we were told to wait). */
    noteCloudError(e: any) {
      const retry = Number(e?.retryAfter) || 0;
      this.cloudError = e?.message ?? String(e);
      if ([401, 402, 403, 503].includes(e?.status)) {
        // missing / rejected key or no credit left: retrying will not help until the account is fixed
        cloudBackoffUntil = Date.now() + 10 * 60_000;
      } else {
        cloudBackoffUntil = Date.now() + Math.max(retry, 20) * 1000;
      }
      console.warn('[dj] cloud engine problem:', this.cloudError);
    },

    /** Calls one of our /api/dj routes; failures carry the status and the server's retry hint. */
    async cloudCall(path: string, body: unknown, timeoutMs = 45000): Promise<Response> {
      const res = await fetch(path, {
        method: 'POST',
        headers: { 'content-type': 'application/json', ...(this.accessCode ? { 'x-dj-code': this.accessCode } : {}) },
        body: JSON.stringify(body),
        signal: AbortSignal.timeout(timeoutMs)
      });
      if (!res.ok) {
        const j = await res.json().catch(() => ({}));
        const err: any = new Error(j?.data?.message || j?.statusMessage || `${path} failed (${res.status})`);
        err.status = res.status;
        if (res.status === 401) { this.authorized = false; this.cloudAvailable = false; } // the code was refused: ask again
        err.retryAfter = j?.data?.retryAfter ?? 0;
        throw err;
      }
      return res;
    },

    /** Words a line and speaks it. Cloud first when chosen; the local engine if the cloud fails and it is already set up. */
    async makeClip(key: string, facts: DjFacts): Promise<Clip> {
      if (this.cloudUsable()) {
        try {
          const clip = await this.makeCloudClip(key, facts);
          this.cloudError = '';
          return clip;
        } catch (e) {
          this.noteCloudError(e);
          if (!this.localFallbackAvailable()) throw e; // no surprise 600 MB download: just skip this announcement
        }
      } else if (this.engine === 'cloud' && !this.localFallbackAvailable()) {
        throw new Error(this.cloudError || 'The cloud voice is paused for a moment');
      }
      return this.makeLocalClip(key, facts);
    },

    /**
     * Refills the pool of reworded announcements. One request returns three versions, and a version only contains
     * {prev}/{next} placeholders, so it works for any pair of songs: the DJ needs roughly one wording request per
     * three announcements. Wording problems (rate limit, bad key) never block the voice: the built-in sentences are used.
     */
    async refillWording(skeleton: string) {
      if (!this.cloudWording || Date.now() < wordingBackoffUntil) return;
      try {
        const res = await this.cloudCall('/api/dj/script', { skeleton, avoid: recentLines.slice(-3) });
        const { texts } = await res.json();
        for (const raw of texts as string[]) {
          const line = cleanLine(raw ?? '');
          if (isValidCloudSkeleton(line) && !wordingPool.includes(line) && !SKELETONS.some(s => isSameLine(s, line))) {
            wordingPool.push(line);
          } else {
            console.log('[dj] cloud line rejected:', line);
          }
        }
        while (wordingPool.length > 12) wordingPool.shift();
        try { localStorage.setItem(POOL_KEY, JSON.stringify(wordingPool)); } catch (e) { }
      } catch (e: any) {
        wordingBackoffUntil = Date.now() + ([401, 402, 403, 503].includes(e?.status) ? 10 * 60_000 : Math.max(Number(e?.retryAfter) || 0, 60) * 1000);
        console.warn('[dj] cloud wording unavailable, using the built-in sentences for a while:', e?.message ?? e);
      }
    },

    /** The voice model speaks the announcement (Deepgram), after the wording is picked from the pool or the built-ins. */
    async makeCloudClip(key: string, facts: DjFacts): Promise<Clip> {
      const player = usePlayerStore();
      const skeleton = pickSkeleton(hashString(key + '#' + (variants.get(key) ?? 0)));

      let text = '';
      let source: Clip['source'] = 'template';
      const tLlm = performance.now();
      if (this.cloudWording && wordingPool.length === 0) await this.refillWording(skeleton);
      const fresh = wordingPool.findIndex(l => !recentLines.some(r => isSameLine(r, fillSkeleton(l, facts))));
      if (fresh >= 0) {
        const [line] = wordingPool.splice(fresh, 1);
        try { localStorage.setItem(POOL_KEY, JSON.stringify(wordingPool)); } catch (e) { }
        text = fillSkeleton(line!, facts);
        source = 'ai';
      }
      if (!text) text = fillSkeleton(skeleton, facts);
      const llmSeconds = (performance.now() - tLlm) / 1000;

      const tTts = performance.now();
      const res = await this.cloudCall('/api/dj/speak', { text, voice: this.cloudVoice }, 60000);
      const wav = await res.arrayBuffer();
      const ctx = player.getAudioContext();
      if (!ctx) throw new Error('audio not ready');
      const buffer = await ctx.decodeAudioData(wav);
      const ttsSeconds = (performance.now() - tTts) / 1000;

      recentLines.push(text);
      if (recentLines.length > 6) recentLines.shift();
      this.lastTiming = `cloud: wording ${llmSeconds.toFixed(1)}s + voice ${ttsSeconds.toFixed(1)}s`;
      console.log(`[dj] cloud ${source}: "${text}" (${buffer.duration.toFixed(1)}s of speech; ${this.lastTiming})`);
      return { text, buffer, source, engine: 'cloud', llmSeconds, ttsSeconds };
    },

    /** Words a line (model first, template if it is off-topic) and speaks it into an AudioBuffer. */
    async makeLocalClip(key: string, facts: DjFacts): Promise<Clip> {
      const player = usePlayerStore();
      await this.ensureLocalReady();

      // The announcement is a skeleton with {prev}/{next} placeholders. The model only rephrases the skeleton (it never
      // sees or copies a song name); if its answer is off, the plain skeleton is used. Names are filled in by code.
      const skeleton = pickSkeleton(hashString(key + '#' + (variants.get(key) ?? 0)));
      let text = '';
      let source: Clip['source'] = 'template';
      const tLlm = performance.now();
      if (this.llmReady) {
        // Up to two rounds of 3 candidates each (one batched model call per round); first valid one wins
        for (let round = 0; round < 2 && !text; round++) {
          try {
            const res = await this.request('script', { messages: buildMessages(skeleton), n: 3 }, 240000);
            for (const raw of (res.texts ?? [res.text])) {
              const line = cleanLine(raw ?? '');
              if (isValidSkeleton(line) && !isSameLine(line, skeleton)) { text = fillSkeleton(line, facts); source = 'ai'; break; }
              console.log('[dj] model line rejected:', line);
            }
          } catch (e) {
            console.warn('[dj] model failed, using the plain line', e);
            break;
          }
        }
      }
      if (!text) text = fillSkeleton(skeleton, facts);
      const llmSeconds = this.llmReady ? (performance.now() - tLlm) / 1000 : 0;

      const tTts = performance.now();
      // A touch slower than the default: the model's natural pace is slightly rushed and even, which reads as robotic
      const speech = await this.request('speak', { text, voice: this.voice, speed: 0.93 }, 180000);
      const ttsSeconds = (performance.now() - tTts) / 1000;
      const ctx = player.getAudioContext();
      if (!ctx) throw new Error('audio not ready');
      const buffer = ctx.createBuffer(1, speech.samples.length, speech.sampleRate);
      buffer.copyToChannel(speech.samples, 0);
      this.lastTiming = `model ${llmSeconds.toFixed(0)}s + voice ${ttsSeconds.toFixed(0)}s`;
      console.log(`[dj] ${source}: "${text}" (${buffer.duration.toFixed(1)}s of speech; ${this.lastTiming})`);
      return { text, buffer, source, engine: 'local', llmSeconds, ttsSeconds };
    },

    /** Marks a pair's line as used, so the next line for that pair is worded differently, and refills it. */
    consume(a: Tracks, b: Tracks) {
      const key = `${a.id}>${b.id}`;
      clips.delete(key);
      variants.set(key, (variants.get(key) ?? 0) + 1);
    },

    /**
     * Gets lines ready ahead of time: the pair at the current position and the one after it. The speech model is the
     * slow part, so having these done before they are asked for is what makes the DJ feel instant.
     */
    warmUp() {
      if (!this.enabled || this.status !== 'ready') return;
      const player = usePlayerStore();
      const i = Math.max(player.currentTrack.index, 0);
      for (const k of [i, i + 1]) {
        const a = player.audioBuffers[k];
        const b = player.audioBuffers[k + 1];
        if (a && b) this.prepareClip(a, b);
      }
    },

    /** The announcement between `a` and `b`; generated once, in the background, then cached. */
    prepareClip(a: Tracks, b: Tracks): Promise<Clip | null> {
      const key = `${a.id}>${b.id}`;
      const have = clips.get(key);
      if (have) return Promise.resolve(have);
      const inFlight = pending.get(key);
      if (inFlight) return inFlight;

      const player = usePlayerStore();
      const nameOf = (m: Tracks) => parseTrackName(player.trackList[player.audioBuffers.indexOf(m)]?.name ?? '');
      const facts: DjFacts = { prev: nameOf(a), next: nameOf(b) };

      this.busy = true;
      const job = this.makeClip(key, facts)
        .then((clip) => { clips.set(key, clip); return clip; })
        .catch((e) => { console.warn('[dj] could not prepare a line', e); return null; })
        .finally(() => { pending.delete(key); this.busy = pending.size > 0; });
      pending.set(key, job);
      return job;
    },

    /** A track just became current: prepare the line for the transition out of it while there is plenty of time. */
    onTrackStart(meta: Tracks) {
      if (!this.enabled) return;
      const player = usePlayerStore();
      const i = player.audioBuffers.indexOf(meta);
      const next = player.audioBuffers[i + 1];
      if (i >= 0 && next) this.prepareClip(meta, next);
      // ...and the one after that, so there is always a spare line ready (e.g. after a skip or a seek)
      const after = player.audioBuffers[i + 2];
      if (next && after) this.prepareClip(next, after);
    },

    /** A transition was just planned: speak over it (if it is this transition's turn and the line is ready in time). */
    onTransition(info: TransitionInfo) {
      transitionCount++;
      if (!this.enabled || !shouldSpeak(transitionCount, this.every)) return;
      const player = usePlayerStore();
      const ctx = player.getAudioContext();
      if (!ctx) return;

      this.prepareClip(info.a, info.b).then((clip) => {
        if (!clip || !this.enabled) return;
        const end = info.T0 + info.length;
        const start = pickSpeechStart({
          bStart: info.bStart, transitionEnd: end, duration: clip.buffer.duration, now: ctx.currentTime
        });
        if (start > end + 4) return; // the line was ready too late to make sense any more
        if (player.playVoice(clip.buffer, start, this.duck, polishFor(clip)) !== null) {
          this.lastLine = clip.text;
          this.lastSource = clip.source;
          this.consume(info.a, info.b);
        }
      });
    },

    /** Speaks a line right now (for trying out the voice / settings). Uses the real queue when there is one. */
    async testVoice() {
      const player = usePlayerStore();
      const ctx = player.getAudioContext();
      if (!ctx) return;
      if (ctx.state === 'suspended') await ctx.resume();

      const i = Math.max(player.currentTrack.index, 0);
      const a = player.audioBuffers[i];
      const b = player.audioBuffers[i + 1];

      if (a && b) {
        // The line for this pair is normally already made (see warmUp): play it at once. If it is still being made,
        // wait for that job rather than starting a second one.
        this.busy = true;
        try {
          const clip = await this.prepareClip(a, b);
          if (!clip) return;
          this.lastLine = clip.text;
          this.lastSource = clip.source;
          player.playVoice(clip.buffer, ctx.currentTime + 0.1, this.duck, polishFor(clip));
          this.consume(a, b);
          this.warmUp(); // refill a fresh line for the real transition
        } finally {
          this.busy = pending.size > 0;
        }
        return;
      }

      // No queue yet: speak a made-up pair
      const facts: DjFacts = { prev: { artist: 'Daft Punk', title: 'One More Time' }, next: { artist: 'Justice', title: 'D.A.N.C.E.' } };
      this.busy = true;
      try {
        const clip = await this.makeClip(`test-${Date.now()}`, facts);
        this.lastLine = clip.text;
        this.lastSource = clip.source;
        player.playVoice(clip.buffer, ctx.currentTime + 0.1, this.duck, polishFor(clip));
      } finally {
        this.busy = pending.size > 0;
      }
    }
  }
});
