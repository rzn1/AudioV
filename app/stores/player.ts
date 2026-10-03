import { defineStore } from "pinia";
import { markRaw } from "vue";
import { guess } from "web-audio-beat-detector";
import type { AnalysisData, CurrentTrack, Tracks } from "@/types/types";
import { ANALYSIS_VERSION, loadSaved, saveTrack, deleteTrack, saveOrder, clearAll, newTrackId } from "~/utils/trackStore";
import { Audio, AudioAnalyser, AudioListener, AudioContext } from "three";
import * as THREE from "three";
import { planTransition, fitTransition, orderTracks, posAt, toMixMeta, effectiveMixOut, echoEntryBeats } from "~/utils/mixPlanner";
import { createVoice, applyTransition, analyzeTransition } from "~/utils/mixEngine";
import type { Voice, VoiceOptions } from "~/utils/mixEngine";

var audioCtx: AudioContext | null = null;
var masterGain: GainNode | null = null;
var mixBus: GainNode | null = null;
var listener: AudioListener | null = null;

// Everything time-critical is scheduled on the audio clock. This small event queue is polled instead of using
// setTimeout, so it also behaves correctly while the AudioContext is suspended (pause).
var events: { at: number, fn: () => void }[] = [];
var pollId: ReturnType<typeof setInterval> | null = null;

// The next track is scheduled this long (ctx seconds) before its transition starts.
const SCHEDULE_LOOKAHEAD = 2.5;

function emptyTrack(): CurrentTrack {
  return {
    index: -1,
    startTime: 0,
    duration: 0,
    bufferStart: 0,
    startPoint: 0,
    endPoint: 0,
    fileDuration: 0,
    bpm: 0,
    beatOffset: 0,
    rmsData: [] as number[]
  };
}

export const usePlayerStore = defineStore("player", {
  state: () => ({
    analyser: null as AudioAnalyser | null,
    trackList: [] as File[],
    audioBuffers: [] as Tracks[],
    isPlaying: false,
    activeSources: [] as AudioBufferSourceNode[],
    eqNodes: [] as BiquadFilterNode[],
    eqInput: null as GainNode | null,

    currentTrack: emptyTrack(),

    // Longest blend the auto-DJ may use (beats of the outgoing track). The actual length is chosen per pair.
    maxTransitionBeats: 64,
    // A track is left this many seconds before its analysed mix-out (snapped back to a phrase), so the transition
    // starts well before the end of the file instead of squeezing into the last seconds.
    mixLead: 20,
    // Length (s) of the transition that is currently running; drives the colour lerp speed in app.vue
    fadeDuration: 4,
    audioVolume: 0.1,

    currentTime: 0,
    isVibeAuto: true,
    isFlashEnabled: true,
    transitionState: {
      active: false,
      fromName: "" as string
    },
    processingState: {
      isProcessing: false,
      current: 0,
      total: 0
    },
    uniforms: {
      u_time: { value: 0 },
      u_speed: { value: 1 },
      u_intensity: { value: 0.15 },
      u_partical_size: { value: 265 },
      u_color_a: { value: "#3f3089" },
      u_color_b: { value: "#00bcff" },
      u_bass: { value: 0.0 },
      u_high: { value: 0.0 },
      u_beat: { value: 0.0 }
    }
  }),

  getters: {
    /** Plan for the transition from the current track into the next queued one (for the UI). */
    upcomingTransition(state) {
      const a = state.audioBuffers[state.currentTrack.index];
      const b = state.audioBuffers[state.currentTrack.index + 1];
      if (!a || !b) return null;
      const aMeta = toMixMeta(a, state.mixLead);
      const plan = planTransition(aMeta, toMixMeta(b, state.mixLead), { maxBeats: state.maxTransitionBeats });
      const length = (plan.beats * 60) / a.tempoOut;
      return { ...plan, length, startPos: aMeta.mixOut - length };
    }
  },

  actions: {
    init() {
      audioCtx = THREE.AudioContext.getContext();
      listener = new AudioListener();
      masterGain = audioCtx.createGain();
      masterGain.connect(listener.getInput());

      // Create MixBus (Pre-Fader)
      mixBus = audioCtx.createGain();

      // Safety limiter: two loud, beat-aligned tracks add up to well over 0 dBFS during a blend
      const limiter = audioCtx.createDynamicsCompressor();
      limiter.threshold.value = -1.5;
      limiter.knee.value = 0;
      limiter.ratio.value = 20;
      limiter.attack.value = 0.003;
      limiter.release.value = 0.1;

      // Route MixBus -> limiter -> MasterGain (Volume Control)
      mixBus.connect(limiter);
      limiter.connect(masterGain);

      // Create Analyser
      this.analyser = new THREE.AudioAnalyser(new THREE.Audio(listener), 256);

      // Connect MixBus to Analyser (Visuals independent of Volume)
      mixBus.connect(this.analyser.analyser);

      this.initEqualizer();
    },

    initEqualizer() {
      if (!audioCtx || !mixBus) return;

      // 7-band EQ: 60, 150, 400, 1k, 2.4k, 6k, 15k
      const frequencies = [60, 150, 400, 1000, 2400, 6000, 15000];
      this.eqInput = audioCtx.createGain();

      let previousNode: AudioNode = this.eqInput;

      frequencies.forEach((freq, index) => {
        const filter = audioCtx!.createBiquadFilter();

        if (index === 0) filter.type = 'lowshelf';
        else if (index === frequencies.length - 1) filter.type = 'highshelf';
        else filter.type = 'peaking';

        filter.frequency.value = freq;
        filter.gain.value = 0;
        filter.Q.value = 1;

        previousNode.connect(filter);
        previousNode = filter;

        this.eqNodes.push(filter);
      });

      // Connect last filter to MixBus (Pre-Fader)
      previousNode.connect(mixBus);
    },

    setEqGain(index: number, val: number) {
      if (this.eqNodes[index]) {
        this.eqNodes[index].gain.value = val;
      }
    },

    setFadeDuration(val: number) {
      this.fadeDuration = val;
    },

    setAudioVolume(volume: number) {
      this.audioVolume = volume;
      if (masterGain) {
        masterGain.gain.setValueAtTime(volume, masterGain.context.currentTime);
      }
    },

    updateCurrentTime(ctxTime: number) {
      this.currentTime = ctxTime;
    },

    setCurrentTrack(data: CurrentTrack) {
      this.currentTrack = data;
    },

    /** Position (s) in the current track's file right now, accounting for the tempo-matching rate. */
    getFilePosition() {
      const tl = this.currentTrack.timeline;
      if (!tl) return 0;
      return posAt(tl, this.currentTime);
    },

    getProgress() {
      // Relative to playable segment (0 to 1)
      if (!this.currentTrack.duration) return 0;
      const elapsed = this.getFilePosition() - this.currentTrack.bufferStart;
      return Math.min(Math.max(elapsed / this.currentTrack.duration, 0), 1);
    },

    getFileProgress() {
      // Relative to full file (0 to 1)
      if (!this.currentTrack.fileDuration) return 0;
      return Math.min(Math.max(this.getFilePosition() / this.currentTrack.fileDuration, 0), 1);
    },

    /**
     * Phase (0..1) within the current beat, derived from the file position so it follows rate changes. Uses the beat
     * grid measured at the nearer of the two mix points (mixIn / mixOut are both downbeats), since the tempo of many
     * tracks drifts over the file.
     */
    getBeatPhase() {
      const tr = this.currentTrack;
      if (!tr.timeline || !tr.tempoIn || !tr.tempoOut) return 0;
      const pos = this.getFilePosition();
      const x = pos < (tr.startPoint + tr.endPoint) / 2
        ? (pos - tr.startPoint) / (60 / tr.tempoIn)
        : (pos - tr.endPoint) / (60 / tr.tempoOut);
      return ((x % 1) + 1) % 1;
    },

    getLowEnergy() {
      // Deprecated, use getFrequencyData().bass instead
      const data = this.getFrequencyData();
      return data.bass * 255;
    },

    getFrequencyData() {
      if (!this.analyser) return { bass: 0, mid: 0, high: 0 };
      const data = this.analyser.getFrequencyData();

      // FFT Size 256 -> 128 bins. SampleRate 44100.
      // Bin width ~172 Hz.

      let bass = 0;
      let mid = 0;
      let high = 0;

      // Bass: Focus on sub/kick (Bins 0-2 ~0-500Hz)
      // We want the average of the loudest parts
      for (let i = 0; i < 3; i++) {
        if (data[i] !== undefined) bass += data[i]!;
      }
      bass /= 3;

      // Mid: Vocals/Snare (Bins 3-20 ~500-3.5k)
      for (let i = 3; i < 20; i++) {
        if (data[i] !== undefined) mid += data[i]!;
      }
      mid /= 17;

      // High: Hats/Air (Bins 20-100)
      for (let i = 20; i < 100; i++) {
        if (data[i] !== undefined) high += data[i]!;
      }
      high /= 80;

      return {
        // Normalize 0-255 to 0-1
        bass: bass / 255,
        mid: mid / 255,
        high: high / 255
      };
    },

    newAnalysisWorker() {
      // Standard Vite syntax; must stay an inline `new Worker(new URL(...))` for the bundler to pick it up
      return new Worker(new URL('../workers/audio.worker.ts', import.meta.url), { type: 'module' });
    },

    /** Beat grid / key / mix-point analysis of one decoded track (runs in the worker). */
    async analyzeBuffer(buffer: AudioBuffer, worker: Worker): Promise<AnalysisData> {
      // Rough tempo from web-audio-beat-detector. Its result is only an integer BPM (and its offset is derived
      // from that rounded value), so the worker re-fits an exact beat grid around it.
      let tempoGuess = 0;
      try {
        const result: any = await guess(buffer);
        tempoGuess = result.tempo || result.bpm || 0;
      } catch (bpmErr) {
        console.warn("BPM guess failed, worker will estimate the tempo itself", bpmErr);
      }

      // Promisify worker response
      const analysis = await new Promise<any>((resolve, reject) => {
        const id = Math.random().toString(36).substring(7);
        const handler = (e: MessageEvent) => {
          if (e.data.id === id) {
            worker.removeEventListener('message', handler);
            if (e.data.success) resolve(e.data);
            else reject(e.data.error);
          }
        };
        worker.addEventListener('message', handler);
        worker.postMessage({
          id,
          channelData: buffer.getChannelData(0), // Cloned
          sampleRate: buffer.sampleRate,
          tempoGuess
        });
      });

      return {
        bpm: Math.round(analysis.tempo),
        tempo: analysis.tempo,
        tempoIn: analysis.tempoIn,
        tempoOut: analysis.tempoOut,
        beatOffset: analysis.beatOffset,
        firstDownbeat: analysis.firstDownbeat,
        downbeatConfidence: analysis.downbeatConfidence,
        rmsValues: analysis.rmsValues,
        startPoint: analysis.mixIn,
        endPoint: analysis.mixOut,
        mixIn: analysis.mixIn,
        mixOut: analysis.mixOut,
        introEnergy: analysis.introEnergy,
        outroEnergy: analysis.outroEnergy,
        key: analysis.key,
        energy: analysis.energy,
        brightness: analysis.brightness,
        vibe: this.determineVibe(analysis.tempo, analysis.energy, analysis.brightness)
      };
    },

    async addTracks(newTracks: File[]) {
      if (!audioCtx || !process.client) return;

      this.processingState.isProcessing = true;
      this.processingState.total = newTracks.length;
      this.processingState.current = 0;

      const worker = this.newAnalysisWorker();

      for (const file of newTracks) {
        this.processingState.current++;
        try {
          const buffer = await audioCtx.decodeAudioData(await file.arrayBuffer());
          const data = await this.analyzeBuffer(buffer, worker);
          const id = newTrackId();

          this.audioBuffers.push({ ...data, id, buffer, rmsValues: markRaw(data.rmsValues) });
          // Add to track list only after successful processing
          this.trackList.push(file);

          // Persist so the queue survives a reload (data is the plain, structured-clonable analysis)
          await saveTrack({ id, file, version: ANALYSIS_VERSION, analysis: data });
          this.persistOrder();
        } catch (e) {
          console.error("Error adding track:", file.name, e);
        }

        // Give the UI a breather to render the progress bar and prevent freezing
        await new Promise(resolve => setTimeout(resolve, 50));
      }

      worker.terminate();
      this.processingState.isProcessing = false;
    },

    /**
     * Reloads the queue saved by a previous session. Tracks only need decoding again; they are re-analysed only if the
     * analysis changed since they were saved (ANALYSIS_VERSION).
     */
    async restoreQueue() {
      if (!audioCtx || !process.client || this.audioBuffers.length || this.processingState.isProcessing) return;
      const saved = await loadSaved();
      if (!saved.length) return;
      // Ask the browser not to evict the stored audio under storage pressure (best effort)
      navigator.storage?.persist?.().catch(() => { });

      this.processingState.isProcessing = true;
      this.processingState.total = saved.length;
      this.processingState.current = 0;

      let worker: Worker | null = null;
      for (const rec of saved) {
        this.processingState.current++;
        try {
          const buffer = await audioCtx.decodeAudioData(await rec.file.arrayBuffer());
          let data = rec.analysis;
          if (rec.version !== ANALYSIS_VERSION) {
            worker ??= this.newAnalysisWorker();
            data = await this.analyzeBuffer(buffer, worker);
            await saveTrack({ ...rec, version: ANALYSIS_VERSION, analysis: data });
          }
          this.audioBuffers.push({ ...data, id: rec.id, buffer, rmsValues: markRaw(data.rmsValues) });
          this.trackList.push(rec.file);
        } catch (e) {
          console.error("Could not restore track:", rec.file?.name, e);
        }
        await new Promise(resolve => setTimeout(resolve, 0)); // let the progress bar paint
      }

      worker?.terminate();
      this.persistOrder();
      this.processingState.isProcessing = false;
    },

    persistOrder() {
      saveOrder(this.audioBuffers.map(t => t.id));
    },

    determineVibe(bpm: number, energy: number, brightness: number): any {
      console.log(`[VibeCheck] BPM: ${bpm}, Energy: ${energy?.toFixed(3)}, Brightness: ${brightness?.toFixed(3)}`);

      // 1. RAGE (Hardcore, Metal, High-Energy EDM) - Adjusted to be less dizzying
      if (bpm > 145 && energy > 0.3) {
        return { name: 'Rage', colorA: '#FF0000', colorB: '#FFA500', speed: 2.0, intensity: 0.32 };
      }

      // 2. TECHNO (Fast, rhythmic, darker tones)
      if (bpm > 125 && energy > 0.18 && brightness < 0.12) {
        return { name: 'Techno', colorA: '#00ff41', colorB: '#000000', speed: 1.6, intensity: 0.22 };
      }

      // 3. CYBERPUNK / NEON (Synthwave, Hyperpop)
      if (brightness > 0.25) {
        return { name: 'Neon', colorA: '#FF00FF', colorB: '#00FFFF', speed: 1.4, intensity: 0.2 };
      }

      // 4. PHONK / GRIM (Dark, bass heavy, aggressive)
      if (energy > 0.22 && brightness < 0.08) {
        return { name: 'Grim', colorA: '#4b0082', colorB: '#ff0000', speed: 1.2, intensity: 0.28 };
      }

      // 5. DEEP / ATMOSPHERIC (Deep House, Dark Ambient)
      if (brightness < 0.05) {
        return { name: 'Deep', colorA: '#0f0c29', colorB: '#302b63', speed: 0.8, intensity: 0.18 };
      }

      // 6. TROPICAL / SUNSET (Reggae, Summer Vibes)
      if (bpm > 90 && bpm < 115 && energy > 0.15) {
        return { name: 'Sunset', colorA: '#f83600', colorB: '#f9d423', speed: 1.0, intensity: 0.15 };
      }

      // 7. LO-FI / CHILL (Acoustic, Study Beats) - Sped up from 0.4
      if (bpm < 95 && energy < 0.15) {
        return { name: 'Chill', colorA: '#74EBD5', colorB: '#9FACE6', speed: 0.7, intensity: 0.1 };
      }

      // 8. POP / GLOSS (High energy, bright pop)
      if (brightness > 0.15) {
        return { name: 'Gloss', colorA: '#FF0099', colorB: '#493240', speed: 1.3, intensity: 0.18 };
      }

      // 9. MINIMAL (Clean, low activity) - Sped up from 0.3
      if (energy < 0.08) {
        return { name: 'Minimal', colorA: '#bdc3c7', colorB: '#2c3e50', speed: 0.6, intensity: 0.1 };
      }

      // Default: NEUTRAL
      return { name: 'Neutral', colorA: '#3f3089', colorB: '#00bcff', speed: 1.0, intensity: 0.15 };
    },

    reorderTracks(from: number, to: number) {
      if (from === to) return;

      const track = this.trackList.splice(from, 1)[0];
      if (track) this.trackList.splice(to, 0, track);

      const buffer = this.audioBuffers.splice(from, 1)[0];
      if (buffer) this.audioBuffers.splice(to, 0, buffer);

      // Update current track index if needed
      if (this.currentTrack.index === from) {
        this.currentTrack.index = to;
      } else if (this.currentTrack.index > from && this.currentTrack.index <= to) {
        this.currentTrack.index--;
      } else if (this.currentTrack.index < from && this.currentTrack.index >= to) {
        this.currentTrack.index++;
      }
      this.persistOrder();
    },

    /**
     * Re-orders the queue so consecutive tracks mix well (tempo, key, energy). Tracks that are already
     * playing / played stay where they are.
     */
    autoOrder() {
      if (this.audioBuffers.length < 3) return;
      const fixed = this.isPlaying && this.currentTrack.index >= 0 ? this.currentTrack.index + 1 : 0;
      const order = orderTracks(this.audioBuffers, fixed);

      const current = this.audioBuffers[this.currentTrack.index];
      const files = order.map(i => this.trackList[i]!);
      const metas = order.map(i => this.audioBuffers[i]!);
      this.trackList = files;
      this.audioBuffers = metas;
      if (current) this.currentTrack.index = this.audioBuffers.indexOf(current);
      this.persistOrder();
    },

    clearQueue() {
      this.stop();
      this.trackList = [];
      this.audioBuffers = [];
      this.currentTrack = emptyTrack();
      clearAll();
    },

    removeTrack(index: number) {
      if (index === this.currentTrack.index) {
        this.stop();
        this.currentTrack = emptyTrack();
      } else if (index < this.currentTrack.index) {
        this.currentTrack.index--;
      }

      const removed = this.audioBuffers[index];
      this.trackList.splice(index, 1);
      this.audioBuffers.splice(index, 1);
      if (removed) deleteTrack(removed.id);
      this.persistOrder();
    },

    // ---------------------------------------------------------------------------------------------
    // Playback / scheduling
    // ---------------------------------------------------------------------------------------------

    /** Runs `fn` once the audio clock reaches `at`. */
    at(at: number, fn: () => void) {
      events.push({ at, fn });
      if (!pollId) {
        pollId = setInterval(() => {
          if (!audioCtx) return;
          const now = audioCtx.currentTime;
          const due = events.filter(e => e.at <= now);
          if (!due.length) return;
          events = events.filter(e => e.at > now);
          due.sort((a, b) => a.at - b.at).forEach(e => {
            try { e.fn(); } catch (err) { console.error("Scheduled mix event failed", err); }
          });
        }, 100);
      }
    },

    stop() {
      events = [];
      if (pollId) {
        clearInterval(pollId);
        pollId = null;
      }

      this.activeSources.forEach(source => {
        try { source.stop(); } catch (e) { }
      });
      this.activeSources = [];
      this.isPlaying = false;
      this.transitionState = { active: false, fromName: "" };
    },

    launchVoice(index: number, when: number, pos: number, opts: VoiceOptions = {}): Voice {
      if (!audioCtx || !masterGain) {
        throw new Error('Audio context not initialized');
      }
      const meta = this.audioBuffers[index];
      if (!meta) throw new Error(`Buffer at index ${index} is undefined`);

      const voice = createVoice(audioCtx, this.eqInput || masterGain, meta, when, pos, {
        endPos: effectiveMixOut(meta, this.mixLead),
        ...opts
      });

      // Track this source for potential cancellation
      this.activeSources.push(voice.source);
      voice.source.onended = () => {
        const idx = this.activeSources.indexOf(voice.source);
        if (idx > -1) this.activeSources.splice(idx, 1);
      };
      return voice;
    },

    /** Makes `voice` the "current track" in the UI / visualiser. */
    activate(voice: Voice) {
      const meta = voice.meta;
      this.setCurrentTrack({
        index: this.audioBuffers.indexOf(meta),
        startTime: voice.timeline.t0,
        duration: voice.endPos - meta.mixIn,
        bufferStart: meta.mixIn,
        startPoint: meta.mixIn,
        endPoint: voice.endPos,
        fileDuration: meta.buffer.duration,
        bpm: meta.bpm,
        tempo: meta.tempo,
        tempoIn: meta.tempoIn,
        tempoOut: meta.tempoOut,
        beatOffset: meta.beatOffset,
        key: meta.key,
        vibe: meta.vibe,
        rmsData: meta.rmsValues,
        timeline: { ...voice.timeline }
      });
    },

    /** Starts `index` at file position `pos` and chains the automatic transitions after it. */
    playFrom(index: number, pos: number) {
      if (!audioCtx) return;
      if (audioCtx.state === 'suspended') audioCtx.resume();
      // Stop ANY existing scheduling/playback
      this.stop();

      const voice = this.launchVoice(index, audioCtx.currentTime + 0.05, pos);
      this.isPlaying = true;
      this.activate(voice);
      this.queueNext(voice);
    },

    playTrack(index: number) {
      const meta = this.audioBuffers[index];
      if (meta) this.playFrom(index, meta.mixIn);
    },

    startPlayer() {
      if (this.audioBuffers.length === 0) return;
      this.playTrack(0);
    },

    seek(progress: number) {
      if (!audioCtx || this.currentTrack.index === -1) return;
      const track = this.currentTrack;
      this.playFrom(track.index, track.bufferStart + track.duration * progress);
    },

    /** Arms the transition out of `voice`: it is prepared shortly before it has to start. */
    queueNext(voice: Voice) {
      if (!audioCtx) return;
      const longest = (Math.min(64, this.maxTransitionBeats) * 60) / voice.meta.tempoOut;
      const fireAt = voice.endTime - longest - SCHEDULE_LOOKAHEAD;
      this.at(Math.max(fireAt, audioCtx.currentTime), () => this.prepareTransition(voice));
    },

    prepareTransition(a: Voice) {
      if (!audioCtx) return;
      const now = audioCtx.currentTime;

      // Look the next track up now (not when queued), so reorders / additions are respected
      const aIndex = this.audioBuffers.indexOf(a.meta);
      if (aIndex < 0) return; // removed from the queue
      const next = this.audioBuffers[aIndex + 1];
      if (!next) {
        // End of queue; tracks may still be added while this one is playing
        if (now < a.endTime - 6) this.at(now + 1, () => this.prepareTransition(a));
        else console.log("Reached end of playlist.");
        return;
      }

      // `a` may have been started with a different lead (or seeked), so its actual end is taken from the voice
      const aMeta = { ...toMixMeta(a.meta, 0), mixOut: a.endPos };
      const plan = planTransition(aMeta, toMixMeta(next, this.mixLead), { maxBeats: this.maxTransitionBeats });
      const fit = fitTransition(plan, aMeta, a.timeline, now);
      const { T0, bStart, length } = fit;
      // After the blend the new track glides back from the matched tempo to its own over 4 beats
      const rampDur = (4 * 60) / a.meta.tempoOut;

      console.log(`[Mix] ${aIndex} -> ${aIndex + 1}: ${fit.plan.style}, ${fit.beats} beats (${length.toFixed(1)}s), ` +
        `rate ${fit.plan.rate.toFixed(3)}, score ${fit.plan.score.toFixed(2)}`, fit.plan.parts);

      const b = this.launchVoice(aIndex + 1, bStart, next.mixIn, {
        rate: fit.plan.rate, holdFor: T0 + length - bStart, rampDur, silent: true
      });
      applyTransition(audioCtx, fit.plan, a, b, T0, length, bStart);

      this.at(T0, () => {
        const fromIndex = this.audioBuffers.indexOf(a.meta);
        const fromName = this.trackList[fromIndex]?.name?.replace(/\.[^/.]+$/, "") || "Track";
        this.fadeDuration = length;
        this.transitionState = { active: true, fromName };
      });
      this.at(bStart, () => this.activate(b));
      this.at(T0 + length, () => {
        this.transitionState = { active: false, fromName: "" };
      });

      this.queueNext(b);
    },

    pausePlayer() {
      if (!audioCtx) return;
      if (audioCtx.state === 'running') {
        audioCtx.suspend();
      } else if (audioCtx.state === 'suspended') {
        audioCtx.resume();
      }
    },

    /**
     * Renders the transition out of track `aIndex` (default: the current one) offline and returns it with loudness
     * metrics, so a mix can be judged (and listened to via `playBuffer`) without waiting for it to come up.
     */
    async previewTransition(aIndex = this.currentTrack.index) {
      const a = this.audioBuffers[aIndex];
      const b = this.audioBuffers[aIndex + 1];
      if (!a || !b) return null;

      const aMeta = toMixMeta(a, this.mixLead);
      const plan = planTransition(aMeta, toMixMeta(b, this.mixLead), { maxBeats: this.maxTransitionBeats });
      const beatLen = 60 / a.tempoOut;
      const length = plan.beats * beatLen;
      const lead = 10;
      const tail = 12;
      const sr = a.buffer.sampleRate;
      const startPos = Math.max(0, aMeta.mixOut - length - lead);
      const T0 = aMeta.mixOut - length - startPos;
      const bStart = plan.style === 'echo' ? T0 + echoEntryBeats(plan.beats) * beatLen : T0;

      const off = new OfflineAudioContext(2, Math.ceil((T0 + length + tail) * sr), sr);
      const out = off.createGain();
      out.connect(off.destination);
      const va = createVoice(off, out, a, 0, startPos, { endPos: aMeta.mixOut });
      const vb = createVoice(off, out, b, bStart, b.mixIn, {
        rate: plan.rate, holdFor: T0 + length - bStart, rampDur: (4 * 60) / a.tempoOut, silent: true
      });
      applyTransition(off, plan, va, vb, T0, length, bStart);

      const rendered = await off.startRendering();
      return { plan, rendered, T0, length, metrics: analyzeTransition(rendered, T0, length) };
    },

    playBuffer(buffer: AudioBuffer) {
      if (!audioCtx || !masterGain) return;
      if (audioCtx.state === 'suspended') audioCtx.resume();
      this.stop();
      const source = audioCtx.createBufferSource();
      source.buffer = buffer;
      source.connect(this.eqInput || masterGain);
      source.start();
      this.activeSources.push(source);
      source.onended = () => {
        const idx = this.activeSources.indexOf(source);
        if (idx > -1) this.activeSources.splice(idx, 1);
      };
    },

    getTrackData(): CurrentTrack {
      return this.currentTrack;
    },

    getAudioContext(): AudioContext | null {
      return audioCtx;
    }
  }
});
