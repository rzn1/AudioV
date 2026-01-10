import { defineStore } from "pinia";
import { markRaw } from "vue";
// @ts-ignore
import MusicTempo from 'music-tempo';
import Meyda from "meyda";
import type { CurrentTrack, Tracks } from "@/types/types";
import { Audio, AudioAnalyser, AudioListener, AudioContext } from "three";
import * as THREE from "three";

var audioCtx: AudioContext | null = null;
var masterGain: GainNode | null = null;
var listener: AudioListener | null = null;

export const usePlayerStore = defineStore("player", {
  state: () => ({
    analyser: null as AudioAnalyser | null,
    trackList: [] as File[],
    audioBuffers: [] as Tracks[],
    isStarted: false,
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
      rmsData: []
    } as CurrentTrack,

    fadeDuration: 4,
    fadeOutDuration: 15,
    trackStartTime: 0,
    audioVolume: 0.1,

    currentTime: 0,
    isVibeAuto: true,
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
      u_color_b: { value: "#00bcff" }
    }
  }),

  actions: {
    init() {
      audioCtx = THREE.AudioContext.getContext();
      listener = new AudioListener();
      masterGain = audioCtx.createGain();
      masterGain.connect(listener.getInput());

      // Create Analyser but ignore the dummy input
      this.analyser = new THREE.AudioAnalyser(new THREE.Audio(listener), 256);

      // Explicitly connect our master bus to the analyser node
      masterGain.connect(this.analyser.analyser);

      this.initEqualizer();
    },

    initEqualizer() {
      if (!audioCtx || !masterGain) return;

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

      // Connect last filter to masterGain
      previousNode.connect(masterGain);
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
      if (!this.analyser) return 0;
      const data = this.analyser.getFrequencyData();
      // data has 128 bins (for 256 fftSize). 44100Hz / 256 ~= 172Hz per bin.
      // wait, bin width = sampleRate / fftSize. 44100 / 256 = 172Hz.
      // So bin 0 is 0-172Hz. That's basically all the bass.
      // Let's use getData() which returns Uint8Array. 
      // 128 bins.

      // Let's check init: new AudioAnalyser(..., 256) -> fftSize 256. frequencyBinCount = 128.
      // Bin size = 44100/256 = 172 Hz.
      // Lower bins focus on bass.
      // Let's average the first 3 bins (~0-500Hz) for "Punch".

      let sum = 0;
      // Looking at first 3 bins
      for (let i = 0; i < 3; i++) {
        sum += data[i];
      }
      return sum / 3; // 0-255 range
    },

    async initTracks(tracks: File[]) {
      if (!audioCtx) return;

      this.processingState.isProcessing = true;
      this.processingState.total = tracks.length;
      this.processingState.current = 0;

      // Instantiate worker
      // @ts-ignore
      const WorkerClass = await import('@/workers/audio.worker?worker');
      const worker = new WorkerClass.default();

      for (const res of tracks) {
        this.processingState.current++;
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

        this.audioBuffers.push({
          buffer,
          bpm: analysis.bpm,
          rmsValues: analysis.rmsValues,
          startPoint: analysis.startPoint,
          endPoint: analysis.endPoint,
          vibe: this.determineVibe(analysis.bpm, analysis.energy, analysis.brightness)
        });

        // Give the UI a breather to render the progress bar and prevent freezing
        await new Promise(resolve => setTimeout(resolve, 50));
      }

      this.processingState.isProcessing = false;
      this.trackList = tracks;
    },

    determineVibe(bpm: number, energy: number, brightness: number): any {
      console.log(`[VibeCheck] BPM: ${bpm}, Energy: ${energy?.toFixed(3)}, Brightness: ${brightness?.toFixed(3)}`);

      // 1. RAGE: High BPM + High Energy
      if (bpm > 135 && energy > 0.3) {
        return { name: 'Rage', colorA: '#ff2929', colorB: '#ffaa00', speed: 2.5, intensity: 0.25 };
      }

      // 2. CHILL: Low BPM + Low Energy
      if (bpm < 100 && energy < 0.15) {
        return { name: 'Chill', colorA: '#00d2ff', colorB: '#3a7bd5', speed: 0.5, intensity: 0.1 };
      }

      // 3. DARK/DEEP: Low Brightness (Bass heavy)
      if (brightness < 0.05) {
        return { name: 'Deep', colorA: '#0f0c29', colorB: '#302b63', speed: 0.8, intensity: 0.2 };
      }

      // 4. POP/HAPPY: High Brightness
      if (brightness > 0.15) {
        return { name: 'Pop', colorA: '#FF0099', colorB: '#493240', speed: 1.2, intensity: 0.18 };
      }

      // Default
      return { name: 'Neutral', colorA: '#3f3089', colorB: '#00bcff', speed: 1.0, intensity: 0.15 };
    },



    reorderTracks(from: number, to: number) {
      if (from === to) return;

      const track = this.trackList.splice(from, 1)[0];
      this.trackList.splice(to, 0, track);

      const buffer = this.audioBuffers.splice(from, 1)[0];
      this.audioBuffers.splice(to, 0, buffer);

      // Update current track index if needed
      if (this.currentTrack.index === from) {
        this.currentTrack.index = to;
      } else if (this.currentTrack.index > from && this.currentTrack.index <= to) {
        this.currentTrack.index--;
      } else if (this.currentTrack.index < from && this.currentTrack.index >= to) {
        this.currentTrack.index++;
      }
    },

    stop() {
      if (this.timerId) clearTimeout(this.timerId);

      this.activeSources.forEach(source => {
        try { source.stop(); } catch (e) { }
      });
      this.activeSources = [];
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
      source.buffer = buffer.buffer;

      const gain = audioCtx.createGain();
      source.connect(gain);
      gain.connect(this.eqInput || masterGain);

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
        startPoint: trackData.bufferStart,
        endPoint: trackData.endPoint,
        playDuration: trackData.duration,
        rmsValues: trackData.rmsData,
        startTime: this.currentTrack.startTime, // Should be this updated time
        bpm: trackData.bpm,
        fileDuration: trackData.fileDuration,
        vibe: trackData.vibe
      };

      // Queue next tracks
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
      source.connect(gain);
      gain.connect(this.eqInput || masterGain);

      source.start(when, startPoint);
      source.stop(when + playDuration);

      console.log(`Scheduled track ${index} to start at ${when.toFixed(2)}s (startPoint: ${startPoint.toFixed(2)}s, endPoint: ${endPoint.toFixed(2)}s, duration: ${playDuration.toFixed(2)}s)`);

      const fileDuration = buffer.duration;
      const vibe = bufferData.vibe;

      return { source, gain, startPoint, endPoint, playDuration, rmsValues: allRmsValues, startTime: when, bpm: currentBPM, fileDuration, vibe };
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
        startPoint: trackData.startPoint,
        endPoint: trackData.endPoint,
        fileDuration: trackData.fileDuration,
        rmsData: markRaw(trackData.rmsValues),
        vibe: vibe
      });

      const nextStartTime = trackData.startTime + (trackData.playDuration - this.fadeOutDuration);

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
        const fromName = this.trackList[activeIndex].name?.replace(/\.[^/.]+$/, "") || "Track";
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

        // Output old track mix
        try {
          trackData.gain.gain.setValueAtTime(1, nextStartTime);
          trackData.gain.gain.linearRampToValueAtTime(0, nextStartTime + this.fadeOutDuration);
        } catch (e) { console.warn("Gain auto error", e); }

        // Input new track mix
        nextTrack.gain.gain.linearRampToValueAtTime(0, nextStartTime);
        nextTrack.gain.gain.linearRampToValueAtTime(1, nextStartTime + this.fadeDuration);

        // Pitch match
        let playbackRate = 1;
        try {
          if (trackData.bpm > 0 && nextTrack.bpm > 0) {
            playbackRate = nextTrack.bpm / trackData.bpm;
          }
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
      this.isStarted = true;
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
