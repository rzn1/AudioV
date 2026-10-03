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

`app/app.vue` runs a `requestAnimationFrame` loop that pushes `currentTime`, FFT-derived bass/mid/high (`getFrequencyData`), beat phase (`getBeatPhase`, derived from file position so it follows tempo matching) and lerped vibe colors into `player.uniforms`. `Sphere.vue` (GLSL shaders as strings inside the component) consumes those uniforms; `Plane.vue` is the reflector floor plus post-processing (bloom/noise). `Overflow.vue` is the main UI drawer (queue with drag-and-drop reorder and Auto-order, EQ, volume, max blend length, next-mix plan, URL import); `Waveform.vue` and `TrackTitle.vue` are overlays.

### Server routes (URL import)

`Overflow.vue` calls `/api/youtube` or `/api/soundcloud` with `?url=`, receives an audio stream, wraps it in a `File`, and feeds it to `player.addTracks`. `server/api/youtube.ts` proxies through a hard-coded list of public Invidious instances (falls through on failure — these instances are flaky); `server/api/soundcloud.ts` uses `soundcloud-downloader`. Local audio is also loaded by drag/drop/file picker; `public/audio/` holds sample mp3s.

## Notes

- Transition quality can only be judged by ear; the numeric checks (grid/phase tests, `previewTransition` loudness dip/bump) catch regressions but not taste.
- Not implemented: time-stretching (tempo matching uses `playbackRate`, so it also shifts pitch; hence the ±8% cap), stem separation, and any ML/LLM planning layer.
- `.nuxtignore` and `.gitignore` exclude `.nuxt`, `.output`, `*.exe`, `bin/`.
- `worker_status.txt` is a stray UTF-16 file, not part of the app.
