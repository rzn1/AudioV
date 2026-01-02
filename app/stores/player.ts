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

    // Moved to state for reactivity
    currentTrack: {
      index: -1,
      startTime: 0,
      duration: 0,
      bufferStart: 0,
      startPoint: 0,
      endPoint: 0,
      bpm: 0,
      rmsData: []
    } as CurrentTrack,

    fadeDuration: 4,
    fadeOutDuration: 15,
    trackStartTime: 0,
    audioVolume: 0.1,

    currentTime: 0,
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

      this.analyser = new THREE.AudioAnalyser(new THREE.Audio(listener), 256);
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
      //if (!this.currentTrack.index) return 0;
      const elapsed = this.currentTime - this.currentTrack.startTime;
      return Math.min(Math.max(elapsed / this.currentTrack.duration, 0), 1);
    },

    async initTracks(tracks: File[]) {
      if (!audioCtx) return;

      for (const res of tracks) {
        const arrayBuffer = await res.arrayBuffer();

        const buffer = await audioCtx.decodeAudioData(arrayBuffer);
        const bpm = await this.detectBPM(buffer);

        this.audioBuffers.push({ buffer, bpm });
      }

      this.trackList = tracks;
    },

    async detectBPM(buffer: AudioBuffer): Promise<number> {
      try {
        let audioData = [];
        if (buffer.numberOfChannels == 2) {
          const channel1 = buffer.getChannelData(0);
          const channel2 = buffer.getChannelData(1);
          for (var i = 0; i < channel1.length; i++) {
            audioData[i] = (channel1[i] + channel2[i]) / 2;
          }
        } else {
          audioData = Array.from(buffer.getChannelData(0));
        }

        const mt = new MusicTempo(audioData);
        // console.log("BPM", mt.tempo);
        // console.log("Beats", mt.beats);
        return Math.round(parseFloat(mt.tempo));
      } catch (err) {
        console.error('BPM detection failed:', err);
        return 0;
      }
    },

    getRMSCurve(audioBuffer: AudioBuffer, hopSize = 512): number[] {
      const channelData = audioBuffer.getChannelData(0);
      const frameSize = 1024;
      const rmsValues: number[] = [];

      for (let i = 0; i < channelData.length; i += hopSize) {
        const frame = channelData.slice(i, i + frameSize);
        if (frame.length < frameSize) break;

        const features = Meyda.extract(["rms"], frame);
        rmsValues.push(features?.rms ?? 0);
      }

      return rmsValues;
    },

    findStartPoint(audioBuffer: AudioBuffer, rmsValues: number[], threshold = 0.3): number {
      const sr = audioBuffer.sampleRate;
      const hopSize = Math.floor(audioBuffer.length / rmsValues.length);
      const maxRMS = Math.max(...rmsValues);

      for (let i = 0; i < rmsValues.length; i++) {
        if (rmsValues[i] > threshold * maxRMS) {
          return (i * hopSize) / sr; // seconds
        }
      }
      return 0;
    },

    findEndPoint(audioBuffer: AudioBuffer, rmsValues: number[], threshold = 0.3): number {
      const sr = audioBuffer.sampleRate;
      const hopSize = Math.floor(audioBuffer.length / rmsValues.length);
      const maxRMS = Math.max(...rmsValues);

      for (let i = rmsValues.length - 1; i >= 0; i--) {
        if (rmsValues[i] > threshold * maxRMS) {
          return (i * hopSize) / sr; // seconds
        }
      }
      return audioBuffer.duration;
    },

    scheduleTrack(index: number, when: number) {
      if (!audioCtx || !masterGain) {
        throw new Error('Audio context not initialized');
      }

      console.log(`Scheduling track ${index} at ${when.toFixed(2)}s`);

      const buffer = this.audioBuffers[index];

      if (!buffer) throw new Error(`Buffer at index ${index} is undefined`);

      const allRmsValues = this.getRMSCurve(buffer.buffer);

      const startPoint = this.findStartPoint(buffer.buffer, allRmsValues);
      const endPoint = this.findEndPoint(buffer.buffer, allRmsValues);
      let playDuration = endPoint - startPoint;

      const currentBPM = buffer.bpm;

      const sr = buffer.buffer.sampleRate;
      const hopSize = Math.floor(buffer.buffer.length / allRmsValues.length);
      const startIndex = Math.floor(startPoint * sr / hopSize);
      const endIndex = Math.floor(endPoint * sr / hopSize);
      const rmsValues = allRmsValues.slice(startIndex, endIndex);

      const source = audioCtx.createBufferSource();
      source.buffer = buffer.buffer;

      const gain = audioCtx.createGain();
      source.connect(gain);
      gain.connect(masterGain);

      source.start(when, startPoint);
      source.stop(when + playDuration);

      console.log(`Scheduled track ${index} to start at ${when.toFixed(2)}s (startPoint: ${startPoint.toFixed(2)}s, endPoint: ${endPoint.toFixed(2)}s, duration: ${playDuration.toFixed(2)}s)`);

      return { source, gain, startPoint, endPoint, playDuration, rmsValues, startTime: when, bpm: currentBPM };
    },

    queueNext(index: number, trackData: any) {
      console.log("Scheduling next track...");
      const nextIndex = index + 1;
      if (nextIndex >= this.audioBuffers.length) return;

      this.setCurrentTrack({
        index: index,
        startTime: trackData.startTime,
        duration: trackData.playDuration,
        bufferStart: trackData.startPoint,
        bpm: trackData.bpm,
        startPoint: trackData.startPoint,
        endPoint: trackData.endPoint,
        rmsData: markRaw(trackData.rmsValues)
      });

      const nextStartTime = trackData.startTime + (trackData.playDuration - this.fadeOutDuration);

      const nextTrack = this.scheduleTrack(nextIndex, nextStartTime);

      // crossfade
      nextTrack.gain.gain.linearRampToValueAtTime(0, nextStartTime); // ensure silence until start
      nextTrack.gain.gain.linearRampToValueAtTime(1, nextStartTime + this.fadeDuration);

      trackData.gain.gain.setValueAtTime(1, nextStartTime); // hold volume until next starts
      trackData.gain.gain.linearRampToValueAtTime(0, nextStartTime + this.fadeOutDuration);

      let playbackRate = 1;
      // Calculate ratio: Target (Next) / Current
      // If Next is 128 and Current is 120, ratio is 1.06. Current needs to speed up to 1.06x.
      playbackRate = nextTrack.bpm / trackData.bpm;

      console.log(`Adjusting Outgoing Track (index ${index}) rate from 1.0 to ${playbackRate.toFixed(3)} to match Incoming Track (index ${nextIndex}, BPM ${nextTrack.bpm})`);

      // Ramp the CURRENT track's rate to match the NEXT track's BPM
      trackData.source.playbackRate.setValueAtTime(1, nextStartTime);
      trackData.source.playbackRate.linearRampToValueAtTime(playbackRate, nextStartTime + this.fadeOutDuration);

      // Incoming track plays at its native speed (1.0)
      nextTrack.source.playbackRate.setValueAtTime(1, nextStartTime);

      const msUntilNextQueue = (trackData.playDuration - this.fadeOutDuration) * 1000;

      setTimeout(() => {
        this.queueNext(nextIndex, nextTrack);
      }, msUntilNextQueue);
    },

    startPlayer() {
      if (this.audioBuffers.length === 0 || !audioCtx) return;
      this.isStarted = true;
      const firstTrack = this.scheduleTrack(0, audioCtx.currentTime);
      this.queueNext(0, firstTrack);
      console.log(this.trackList);
      console.log(this.audioBuffers);
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
