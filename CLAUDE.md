# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Commands

```bash
npm install
npm run dev       # Nuxt dev server on http://localhost:3000
npm run build     # production build
npm run generate  # static generation
npm run preview   # preview production build
npm test          # unit tests for the mixing logic (plain Node, no framework)
```

`npm test` runs `tests/mixing.test.mts` with `node --experimental-strip-types` (Node >= 22.6). It covers only the pure modules in `app/utils/` (`audioAnalysis.ts`, `mixPlanner.ts`) using synthetic signals. There is no linter, and no type-check beyond what Nuxt/Vite does at build time.

## Architecture

Nuxt 4 + Vue 3 + TypeScript app (client-rendered audio/3D; `@nuxt/ui`, `@pinia/nuxt`, `@tresjs/nuxt` modules). It is an **auto-DJ**: a queue player that beat-matches and blends consecutive tracks, with a shader-driven 3D visualizer. Source lives under `app/` (Nuxt 4 layout) and `server/`.

Playback is raw Web Audio via Three's shared `AudioContext` (Howler is a dependency but unused; `architecture.json`/`GEMINI.md`/README are partly stale, e.g. they mention `Start.vue`, `spotify.ts`, Howler).

### Mixing pipeline (the core of the project)

Split deliberately into pure logic, Web Audio glue, and the store:

- **`app/workers/audio.worker.ts` + `app/utils/audioAnalysis.ts`** (pure DSP, per track, run once in `addTracks`):
  - `web-audio-beat-detector`'s `guess()` is only a *seed*: it returns an integer BPM and an offset computed from that rounded BPM, which drifts ~0.5 s over a track. The worker re-fits an exact grid (`fitBeatGrid`) on a low-band onset envelope.
  - `detectDownbeatPhase` (assumes 4/4) finds bar starts; `detectKey` is chroma + Krumhansl-Schmuckler → Camelot code.
  - Many tracks have a non-constant tempo, so the global grid is only trusted for bar/phrase counting. `chooseMixPoints` re-fits the grid *locally* (`fitLocalGrid`, constrained to ±3% tempo / ±0.4 beat phase around the global grid so it cannot lock onto off-beat hats) at the mix-in and mix-out regions and snaps `mixIn`/`mixOut` to 8-beat phrase boundaries. It also returns `tempoIn`/`tempoOut`, the tempo measured at those two spots. Mix-out is the end of the loud body, not the fade-out tail.
- **`app/utils/mixPlanner.ts`** (pure): `planTransition(a, b)` scores the pair (tempo 0.4, key 0.4, track energy 0.2), picks the beat-matching factor (1:1, double or half time), and chooses a style: `blend`/`swap` (64/32/16 beats by score, capped at 16 when keys clash) or, when the tempo gap needs more than ±8% stretch, `echo` (32 beats: outgoing track is low-passed into a feedback-delay tail, the incoming one enters on the bar half way through at its own tempo). `cut` exists only as a last resort when there is no room left. The outgoing track is left `mixLead` seconds (default 20) before its analysed `mixOut`, snapped back by whole phrases (`effectiveMixOut`), so transitions start well before the end of the file; always use `effectiveMixOut`/`voice.endPos`, not `meta.mixOut`, for where a track actually ends. `fitTransition` places the transition so it ends exactly on that point, shortening it if there is no room. `orderTracks` re-orders the queue (greedy + 2-opt on pair cost). `Timeline`/`posAt`/`timeAt` map between AudioContext time and file position for a track that runs at a matched rate and then glides back to 1 — all beat maths goes through these, never through `startTime + elapsed`.
- **`app/utils/mixEngine.ts`** (Web Audio, works on any `BaseAudioContext`, so live and offline preview share it): `createVoice` builds source → bass low-shelf → HPF → LPF → trim → gain; `applyTransition` automates the bass swap on the bar at the transition midpoint, equal-power fades, filter sweeps for `swap`, loudness trim of the incoming track, or the `cut`. `analyzeTransition` measures dip/bump on a rendered transition.
- **`app/stores/player.ts`** (Pinia): owns the graph (voices → EQ → `mixBus` → limiter → `masterGain`; the `AnalyserNode` taps `mixBus`). Everything is scheduled on the audio clock through a polled event queue (`at()`), **not** `setTimeout`, so pausing (`audioCtx.suspend()`) cannot fire transitions early. `queueNext(voice)` arms `prepareTransition` ~2.5 s before the longest possible transition; it looks up the next track at that moment, so reordering or appending while playing works. Audio buffers and `AudioContext` live outside reactive state; `trackList` and `audioBuffers` are parallel arrays that must stay in sync (`reorderTracks`, `removeTrack`, `autoOrder`). `previewTransition(i)` renders a transition offline and `playBuffer` auditions it (UI: "Preview next mix").

- **Queue persistence** (`app/utils/trackStore.ts`, IndexedDB): each added track's `File`, its analysis and the queue order are saved; `player.restoreQueue()` (called from `app.vue`) re-decodes them on load. **Bump `ANALYSIS_VERSION` in `trackStore.ts` whenever the worker/`audioAnalysis.ts` output changes**, otherwise stale cached analysis is reused (restore re-analyses on a version mismatch). Anything that changes the queue must call `persistOrder()`.

Beat grids, `mixIn`/`mixOut`, `tempoIn`/`tempoOut` and `key` are produced only by the worker; `Tracks` in `app/types/types.ts` documents each field.

### Visualization

The scene is a single fullscreen fragment shader, `app/components/Resonance.vue` (no camera, no meshes beyond one quad; GLSL lives as a string in the component). It runs its own `requestAnimationFrame` loop and reads everything from the store: a warp tunnel whose rings step forward exactly on the beat grid (`getBeatPos()`; the downbeat of each bar gets a stronger shockwave), a circular 64-band spectrum (`getSpectrum()`, a separate 2048-point analyser tapped from `mixBus`), and a glowing core driven by the bass. **Colours come from the track's key** (`app/utils/palette.ts`, Camelot number → hue, so keys that mix well are neighbouring hues) and fall back to the vibe colours when the key is unsure; each track has its own pattern seed (hash of its file name). While a mix runs, `transitionState` (`toName`/`toKey`/`toVibe`/`start`/`length`) lets the scene morph towards the incoming track over the real transition length. The UI's Speed / Density / theme-colour controls still feed it through `player.uniforms`. `app/app.vue` only keeps the store clock current. `Overflow.vue` is the main UI drawer (queue with drag-and-drop reorder and Auto-order, EQ, volume, max blend length, mix-out lead, next-mix plan, URL import); `Waveform.vue` and `TrackTitle.vue` (a lower-third caption) are overlays. `@tresjs/post-processing`, `@tresjs/cientos` and `postprocessing` are no longer used by the scene.

### AI DJ (spoken announcements between tracks)

Two engines, chosen in the UI (`dj.engine`): **cloud** (default when a Deepgram key is configured) and **local** (below).

Cloud: the voice is **Deepgram Aura-2** (official API; $200 free credit that does not expire and needs no card; an announcement is ~100 characters ≈ a quarter of a cent). Server routes `server/api/dj/{status,script,speak}` call it with `DEEPGRAM_API_KEY` from the server environment (`.env`, see `.env.example`; keys never reach the browser, upstream errors are sanitised in `server/utils/http.ts`). `speak` requests `POST {DEEPGRAM_BASE_URL}/v1/speak?model=…&encoding=linear16&container=wav&sample_rate=24000` with `Authorization: Token …` and returns the WAV. Wording is **optional** and goes through any OpenAI-compatible chat endpoint (`WORDING_API_KEY`, default base URL Groq, whose free tier is generous; `WORDING_BASE_URL` / `WORDING_MODEL` override); without it the six built-in `SKELETONS` are used. One wording request returns three versions (one per line, `splitVersions`), and a version contains only `{prev}/{next}` placeholders, so it works for any pair: they are kept in a pool (`wordingPool`, persisted in localStorage) and one request covers about three announcements. Wording problems never block the voice (`wordingBackoffUntil`). Song names are never sent to the wording model. Answers are checked with `isValidCloudSkeleton` (blocklist of opinion/trivia/technical words instead of the local whitelist). Pure helpers (`server/utils/{http,deepgram,wording}.ts`) are unit-tested; `server/utils/cloud.ts` adds the fetch, a sliding-window limiter and error mapping.

On 429/402/auth errors the cloud voice pauses (`noteCloudError`, backoff from `Retry-After`; 10 min for 401/402/403/503) and the local engine is used if it has been set up before (`localFallbackAvailable`); otherwise that announcement is skipped, never a surprise 600 MB download. The cloud voice gets only light voice processing (`polish` 0.35). The routes and client were verified end to end against stand-in servers (success, 402, 429, bad key, no key, key never echoed); the real Deepgram endpoint itself was coded from its docs. Gemini was tried first and dropped: its free speech quota is 3 requests/min and 10/day, far too small.

**Local engine.** Fully local, free and unlimited: no API, no account. `app/workers/dj.worker.ts` hosts two open models via transformers.js: **Qwen2.5-0.5B-Instruct** (CPU/WASM, `q8`) for the wording and **Kokoro-82M** (`kokoro-js`, CPU/WASM `q8`) for the voice (~600 MB total, downloaded once). The store runs **two instances of the worker, one per model**, so wording the next line and speaking the current one overlap, and both models load at the same time. `app/stores/dj.ts` orchestrates it: `warmUp()` / `onTrackStart` (hook from the player via `app/utils/mixHooks.ts`) prefetch the lines for the current and the following transition in the background (the voice model is the slow part, ~3x slower than real time, so having them ready ahead of time is what makes it feel instant; "Try it" plays the prepared line), `onTransition` speaks it, `player.playVoice()` plays it at `bStart + 25%` of the transition (`pickSpeechStart`) and ducks the music (`duckGain`, default 0.15 ≈ -16 dB, user-adjustable via `dj.duck`). If a line is not ready in time it is skipped, never delayed.

Hard-won rules in `app/utils/djScript.ts` (do not loosen without re-measuring with the real model):
- **The model never sees or writes a song name.** A 0.5B model garbled names ("Lutherto", "Dead Ft. DaBaby by Red") and invented claims even when only asked to rephrase. Announcements are skeletons with `{prev}`/`{next}` placeholders; the model rephrases the skeleton, and code substitutes the exact names afterwards.
- Every model answer is validated (`isValidSkeleton`): placeholders intact, only plain radio words from a whitelist (so no "sounds like a soulful rap track", no BPM/key talk), and roles kept (`rolesConsistent`: "{prev} is up next" is rejected). Up to 3 attempts, then the plain skeleton is spoken. Measured on the real model: roughly half of the first attempts pass.
- Model storage: normally the browser's Cache Storage, but that only exists on https/localhost. Opening the dev server over plain http from another PC (`http://192.168.x.x:3000`) has no `caches`, and transformers.js then throws "Browser cache is not available in this environment", so `app/workers/idbCache.ts` provides a drop-in IndexedDB cache (Blobs, so the 490 MB model stays on disk) that the worker switches to automatically.
- Making the voice sound less robotic (the model itself is flat; this is what helps): `tidyName()` turns "&"/"Ft."/ALL-CAPS titles into how a person says them before they reach the voice, synthesis runs at `speed: 0.93`, and `buildVoiceChain()` in `mixEngine.ts` gives the dry output a broadcast-style chain (high-pass, warmth, presence, air, compressor, a little room, limiter). It is level-calibrated on real clips (RMS ≈ -16 dBFS, peak ≈ -1 dBFS); re-measure if you change it, because the compressor + EQ lift the voice by ~5 dB on their own.
- The voice also runs on WASM on purpose: a WebGPU build is ~3x faster but starts every clip with a burst of samples up to ±62000 (a loud click) and has a different level, and WebGPU only exists on https/localhost anyway. Do not switch to it without fixing and listening to the result. The model returns 3 candidate rewordings per call (`num_return_sequences`) and the first valid one wins.
- The language model runs on WASM on purpose: the WebGPU/fp16 build produced pure gibberish on this GPU. Do not set `repetition_penalty` (it penalises copying prompt tokens) or a temperature above ~0.6 (it drifts).

### Deploying (Vercel)

Nitro picks the `vercel` preset on its own. Set `DEEPGRAM_API_KEY` (and optionally `WORDING_API_KEY`) in the project's environment variables (`.env` is git-ignored and not deployed) plus **`DJ_ACCESS_CODE`**: the paid `/api/dj/*` routes are **locked in production unless a code is set** (`server/utils/access.ts`; `accessMode()` is `open` locally, `code` when configured, `locked` in production without one). Visitors type the code once in the AI DJ card (stored in their browser, sent as `x-dj-code`, compared in constant time; 10 wrong guesses per client throttle to 429; voice/wording calls are also capped per client and globally). The in-memory limiters are per serverless instance, so also add a Vercel Firewall rate-limit rule on `/api/dj/*`. The YouTube/SoundCloud routes return 404 in production unless `ENABLE_URL_IMPORT=1` (they stream whole files and YouTube blocks datacenter IPs, so they do not work on Vercel), and the UI hides the URL box (`importEnabled` from `/api/dj/status`). Remove the copyrighted sample mp3s in `public/audio/` before deploying publicly. Everything else (analysis, mixing, visuals, queue persistence, the local DJ engine) runs in the visitor's browser; HTTPS also makes Cache Storage available. Verified against the real route code in production mode (locked/unlocked, wrong code, brute-force and per-client limits, downloader 404); not yet verified on an actual Vercel deployment.

### Server routes (URL import)

`Overflow.vue` calls `/api/youtube` or `/api/soundcloud` with `?url=`, receives an audio stream, wraps it in a `File`, and feeds it to `player.addTracks`. `server/api/youtube.ts` proxies through a hard-coded list of public Invidious instances (falls through on failure — these instances are flaky); `server/api/soundcloud.ts` uses `soundcloud-downloader`. Local audio is also loaded by drag/drop/file picker; `public/audio/` holds sample mp3s.

## Notes

- Transition quality can only be judged by ear; the numeric checks (grid/phase tests, `previewTransition` loudness dip/bump) catch regressions but not taste.
- Not implemented: time-stretching (tempo matching uses `playbackRate`, so it also shifts pitch; hence the ±8% cap), stem separation, and any ML/LLM planning layer.
- `.nuxtignore` and `.gitignore` exclude `.nuxt`, `.output`, `*.exe`, `bin/`.
- `worker_status.txt` is a stray UTF-16 file, not part of the app.
