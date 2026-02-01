import { defineStore } from "pinia";
import { markRaw } from "vue";
import { analyze, guess } from "web-audio-beat-detector";
import Meyda from "meyda";
import type { CurrentTrack, Tracks } from "@/types/types";
import { Audio, AudioAnalyser, AudioListener, AudioContext } from "three";
import * as THREE from "three";

var audioCtx: AudioContext | null = null;
var masterGain: GainNode | null = null;
var mixBus: GainNode | null = null;
var listener: AudioListener | null = null;

export const usePlayerStore = defineStore("player", {
  state: () => ({
    analyser: null as AudioAnalyser | null,
    trackList: [] as File[],
    audioBuffers: [] as Tracks[],
    isPlaying: false,
    timerId: null as any,
    activeSources: [] as AudioBufferSourceNode[],
    eqNodes: [] as BiquadFilterNode[],
    eqInput: null as GainNode | null,

    currentTrack: {
      index: -1,
      startTime: 0,
      duration: 0,
      bufferStart: 0,
      startPoint: 0,
      endPoint: 0,
      fileDuration: 0,
      bpm: 0,
      beatOffset: 0,
      key: "",
      rmsData: [] as number[]
    } as CurrentTrack,

    fadeDuration: 4,
    fadeOutDuration: 15,
    trackStartTime: 0,
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

  actions: {
    init() {
      audioCtx = THREE.AudioContext.getContext();
      listener = new AudioListener();
      masterGain = audioCtx.createGain();
      masterGain.connect(listener.getInput());

      // Create MixBus (Pre-Fader)
      mixBus = audioCtx.createGain();

      // Route MixBus to MasterGain (Volume Control)
      mixBus.connect(masterGain);

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

    getProgress() {
      // Relative to playable segment (0 to 1)
      //if (!this.currentTrack.index) return 0;
      const elapsed = this.currentTime - this.currentTrack.startTime;
      return Math.min(Math.max(elapsed / this.currentTrack.duration, 0), 1);
    },

    getFileProgress() {
      // Relative to full file (0 to 1)
      if (!this.currentTrack.fileDuration || this.currentTrack.fileDuration === 0) return 0;

      // Elapsed time since track started playing
      const playedTime = Math.max(0, this.currentTime - this.currentTrack.startTime);

      // Absolute position in file = startPoint + elapsed
      // (Note: this assumes we play linearly from startPoint)
      const currentFilePos = this.currentTrack.startPoint + playedTime;

      return Math.min(Math.max(currentFilePos / this.currentTrack.fileDuration, 0), 1);
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

    async addTracks(newTracks: File[]) {
      if (!audioCtx) return;

      this.processingState.isProcessing = true;
      this.processingState.total = newTracks.length;
      this.processingState.current = 0;

      if (!process.client) return;

      // Instantiate worker using standard Vite syntax
      const worker = new Worker(new URL('../workers/audio.worker.ts', import.meta.url), {
        type: 'module'
      });

      for (const res of newTracks) {
        this.processingState.current++;
        try {
          const arrayBuffer = await res.arrayBuffer();
          const buffer = await audioCtx.decodeAudioData(arrayBuffer);

          // Prepare data for worker
          const channelData = buffer.getChannelData(0);

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
              channelData: channelData, // Cloned
              sampleRate: buffer.sampleRate
            });
          });

          // BPM & Beat Offset Detection using web-audio-beat-detector (more accurate)
          let bpm = 0;
          let beatOffset = 0;
          try {
            const result = await guess(buffer);
            bpm = result.bpm;
            beatOffset = result.offset;
          } catch (bpmErr) {
            console.warn("BPM Detection failed, falling back to worker or 0", bpmErr);
            bpm = analysis.bpm || 0;
          }

          this.audioBuffers.push({
            buffer,
            bpm: Math.round(bpm),
            beatOffset: beatOffset,
            rmsValues: analysis.rmsValues,
            startPoint: analysis.startPoint,
            endPoint: analysis.endPoint,
            vibe: this.determineVibe(bpm, analysis.energy, analysis.brightness)
          });

          // Add to track list only after successful processing
          this.trackList.push(res);
        } catch (e) {
          console.error("Error adding track:", res.name, e);
        }

        // Give the UI a breather to render the progress bar and prevent freezing
        await new Promise(resolve => setTimeout(resolve, 50));
      }

      this.processingState.isProcessing = false;
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
    },

    clearQueue() {
      this.stop();
      this.trackList = [];
      this.audioBuffers = [];
      this.currentTrack = {
        index: -1,
        startTime: 0,
        duration: 0,
        bufferStart: 0,
        startPoint: 0,
        endPoint: 0,
        fileDuration: 0,
        bpm: 0,
        beatOffset: 0,
        key: "",
        rmsData: [] as number[]
      } as CurrentTrack;
    },

    removeTrack(index: number) {
      if (index === this.currentTrack.index) {
        this.stop();
        this.currentTrack = {
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
      } else if (index < this.currentTrack.index) {
        this.currentTrack.index--;
      }

      this.trackList.splice(index, 1);
      this.audioBuffers.splice(index, 1);
    },

    stop() {
      if (this.timerId) clearTimeout(this.timerId);

      this.activeSources.forEach(source => {
        try { source.stop(); } catch (e) { }
      });
      this.activeSources = [];
      this.isPlaying = false;
    },

    seek(progress: number) {
      if (!audioCtx || this.currentTrack.index === -1) return;
      this.stop(); // Stops potentially multiple sources

      const trackData = this.currentTrack;
      const buffer = this.audioBuffers[trackData.index];
      const startPoint = trackData.bufferStart;
      const playDuration = trackData.duration;

      const offset = startPoint + (playDuration * progress);
      const remainingDuration = playDuration * (1 - progress);
      const when = audioCtx.currentTime;

      // Reschedule current track
      const source = audioCtx.createBufferSource();
      if (buffer) source.buffer = buffer.buffer;

      const gain = audioCtx.createGain();
      source.connect(gain);
      gain.connect(this.eqInput || masterGain!);

      source.start(when, offset);
      source.stop(when + remainingDuration);

      // Track source
      this.activeSources.push(source);
      source.onended = () => {
        const idx = this.activeSources.indexOf(source);
        if (idx > -1) this.activeSources.splice(idx, 1);
      };

      // Update displayed time
      this.setCurrentTrack({
        ...trackData,
        startTime: when - (playDuration * progress)
      });

      // Reconstitute trackData for queueNext
      const reconstructedTrackData = {
        source,
        gain,
        hpf: null, // Seeked track won't have the transition sweep but shouldn't crash
        lpf: null,
        startPoint: trackData.bufferStart,
        endPoint: trackData.endPoint,
        playDuration: trackData.duration,
        rmsValues: trackData.rmsData,
        startTime: this.currentTrack.startTime,
        bpm: trackData.bpm,
        beatOffset: trackData.beatOffset,
        key: trackData.key,
        fileDuration: trackData.fileDuration,
        vibe: trackData.vibe
      };

      // Queue next tracks
      this.isPlaying = true;
      this.queueNext(trackData.index, reconstructedTrackData);
    },

    playTrack(index: number) {
      if (!audioCtx) return;
      // Stop ANY existing scheduling/playback
      this.stop();

      // Schedule new track NOW
      const track = this.scheduleTrack(index, audioCtx.currentTime);
      // activeSources handling is inside scheduleTrack now

      // Kick off the chain
      this.isPlaying = true;
      this.queueNext(index, track);
    },

    scheduleTrack(index: number, when: number) {
      if (!audioCtx || !masterGain) {
        throw new Error('Audio context not initialized');
      }

      console.log(`Scheduling track ${index} at ${when.toFixed(2)}s`);

      const bufferData = this.audioBuffers[index];
      if (!bufferData) throw new Error(`Buffer at index ${index} is undefined`);

      const buffer = bufferData.buffer;
      const allRmsValues = bufferData.rmsValues;
      const startPoint = bufferData.startPoint;
      const endPoint = bufferData.endPoint;
      let playDuration = endPoint - startPoint;

      const currentBPM = bufferData.bpm;

      const sr = buffer.sampleRate;
      const hopSize = Math.floor(buffer.length / allRmsValues.length);
      const startIndex = Math.floor(startPoint * sr / hopSize);
      const endIndex = Math.floor(endPoint * sr / hopSize);
      const rmsValues = allRmsValues.slice(startIndex, endIndex);

      const source = audioCtx.createBufferSource();
      source.buffer = buffer;

      // Track this source for potential cancellation
      this.activeSources.push(source);
      source.onended = () => {
        const idx = this.activeSources.indexOf(source);
        if (idx > -1) this.activeSources.splice(idx, 1);
      };

      const gain = audioCtx.createGain();

      // Individual filters for transitions
      const hpf = audioCtx.createBiquadFilter();
      hpf.type = 'highpass';
      hpf.frequency.value = 10; // Start subsonic

      const lpf = audioCtx.createBiquadFilter();
      lpf.type = 'lowpass';
      lpf.frequency.value = 22000; // Start ultrasonic

      source.connect(hpf);
      hpf.connect(lpf);
      lpf.connect(gain);
      gain.connect(this.eqInput || masterGain);

      source.start(when, startPoint);
      source.stop(when + playDuration);

      console.log(`Scheduled track ${index} to start at ${when.toFixed(2)}s (startPoint: ${startPoint.toFixed(2)}s, endPoint: ${endPoint.toFixed(2)}s, duration: ${playDuration.toFixed(2)}s)`);

      const fileDuration = buffer.duration;
      const vibe = bufferData.vibe;
      const beatOffset = bufferData.beatOffset;

      return { source, gain, hpf, lpf, startPoint, endPoint, playDuration, rmsValues: allRmsValues, startTime: when, bpm: currentBPM, beatOffset, fileDuration, vibe };
    },

    queueNext(index: number, trackData: any) {
      console.log("Scheduling next track...");

      // Update UI immediately (REMOVED to allow smooth lerp in app.vue)
      const vibe = trackData.vibe || { name: 'Neutral', colorA: '#3f3089', colorB: '#00bcff', speed: 1.0 };

      // Reset manual override so Vibe AI takes over for the new track
      //this.isVibeOverride = false; // Property deleted from state, removing here to fix lint

      this.setCurrentTrack({
        index: index,
        startTime: trackData.startTime,
        duration: trackData.playDuration,
        bufferStart: trackData.startPoint,
        bpm: trackData.bpm,
        beatOffset: trackData.beatOffset,
        key: trackData.key,
        startPoint: trackData.startPoint,
        endPoint: trackData.endPoint,
        fileDuration: trackData.fileDuration,
        rmsData: markRaw(trackData.rmsValues),
        vibe: vibe
      });

      // --- Beat Aligned Start Time ---
      const bpmA = trackData.bpm;
      const beatIntervalA = 60 / (bpmA || 120);
      const targetNextStartTime = trackData.startTime + (trackData.playDuration - this.fadeOutDuration);

      // Calculate beats from start of track A
      const elapsedSinceFirstBeatA = targetNextStartTime - (trackData.startTime + trackData.beatOffset);
      const beatCountA = Math.round(elapsedSinceFirstBeatA / beatIntervalA);

      // The moment where a beat occurs in track A
      const alignedBeatTimeA = trackData.startTime + trackData.beatOffset + (beatCountA * beatIntervalA);

      // We want the NEXT track's first beat (beatOffsetB) to align with this beat of A
      // Wait, let's look at the next track data
      const nextIndex = index + 1;
      const bufferDataB = this.audioBuffers[nextIndex];
      const beatOffsetB = bufferDataB?.beatOffset || 0;

      // Adjust nextStartTime so beatOffsetB lands on alignedBeatTimeA
      const nextStartTime = alignedBeatTimeA - beatOffsetB;

      const now = audioCtx!.currentTime;
      let delay = nextStartTime - now;
      if (delay < 0) delay = 0;

      const msUntilNextQueue = delay * 1000;

      this.timerId = setTimeout(() => {
        // Calculate nextIndex dynamically based on CURRENT position (handling reorders)
        const activeIndex = this.currentTrack.index;
        const nextIndex = activeIndex + 1;

        if (nextIndex >= this.audioBuffers.length) {
          console.log("Reached end of playlist.");
          return;
        }

        // Start Transition State
        const nextTrackFile = this.trackList[nextIndex];
        const fromName = this.trackList[activeIndex]?.name?.replace(/\.[^/.]+$/, "") || "Track";
        this.transitionState = { active: true, fromName };

        // Clear transition state after fade
        setTimeout(() => {
          this.transitionState = { active: false, fromName: "" };
        }, this.fadeDuration * 1000); // fadeDuration is in seconds

        const nextTrack = this.scheduleTrack(nextIndex, nextStartTime);

        console.log(`[QueueNext] Switching to Track ${nextIndex}.`);
        console.log(`[QueueNext] Scheduled StartTime: ${nextStartTime.toFixed(3)}`);
        console.log(`[QueueNext] Actual AudioCtx Time: ${audioCtx!.currentTime.toFixed(3)}`);
        console.log(`[QueueNext] Diff (Delay): ${(audioCtx!.currentTime - nextStartTime).toFixed(3)}s`);

        // Output old track mix (Fading Out)
        try {
          trackData.gain.gain.setValueAtTime(1, nextStartTime);
          trackData.gain.gain.linearRampToValueAtTime(0, nextStartTime + this.fadeOutDuration);

          // Smoother Transition: High-Pass sweep on outgoing track
          if (trackData.hpf) {
            trackData.hpf.frequency.setValueAtTime(10, nextStartTime);
            trackData.hpf.frequency.exponentialRampToValueAtTime(1000, nextStartTime + this.fadeOutDuration);
          }

        } catch (e) { console.warn("Gain auto error", e); }

        // Input new track mix (Fading In)
        nextTrack.gain.gain.setValueAtTime(0, nextStartTime);
        nextTrack.gain.gain.linearRampToValueAtTime(1, nextStartTime + this.fadeDuration);

        // Bass Swap: Incoming track starts without bass, then kicks in
        nextTrack.hpf.frequency.setValueAtTime(400, nextStartTime);
        nextTrack.hpf.frequency.exponentialRampToValueAtTime(10, nextStartTime + this.fadeDuration);

        // Pitch match
        let playbackRate = 1;
        try {
          if (trackData.bpm > 0 && nextTrack.bpm > 0) {
            playbackRate = nextTrack.bpm / trackData.bpm;
          }
          // Slide old track to match new track's BPM during fade
          trackData.source.playbackRate.setValueAtTime(1, nextStartTime);
          trackData.source.playbackRate.linearRampToValueAtTime(playbackRate, nextStartTime + this.fadeOutDuration);
        } catch (e) { }

        nextTrack.source.playbackRate.setValueAtTime(1, nextStartTime);

        this.queueNext(nextIndex, nextTrack);
      }, msUntilNextQueue);
    },

    startPlayer() {
      if (this.audioBuffers.length === 0 || !audioCtx) return;
      this.stop();
      this.isPlaying = true;
      const firstTrack = this.scheduleTrack(0, audioCtx.currentTime);
      // activeSource tracked in scheduleTrack
      this.queueNext(0, firstTrack);
    },

    pausePlayer() {
      if (!audioCtx) return;
      if (audioCtx.state === 'running') {
        audioCtx.suspend();
      } else if (audioCtx.state === 'suspended') {
        audioCtx.resume();
      }
    },

    getTrackData(): CurrentTrack {
      return this.currentTrack;
    },

    getAudioContext(): AudioContext | null {
      return audioCtx;
    }
  }
});
