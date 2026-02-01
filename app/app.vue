<script setup lang="ts">
import { ref, onMounted, computed } from "vue";
import { Clock, SRGBColorSpace, Vector3, Color } from "three";
import { usePlayerStore } from "~/stores/player";

const player = usePlayerStore();
const uniforms = computed(() => player.uniforms);
const audioCtx = computed(() => player.getAudioContext());
const clock = new Clock();
const bloomIntensity = ref(50);


// --- Utility ---
function scaleValue(value: number, minInput: number, maxInput: number, minOutput: number, maxOutput: number) {
  value = Math.min(Math.max(value, minInput), maxInput);
  const normalizedValue = (value - minInput) / (maxInput - minInput);
  return normalizedValue * (maxOutput - minOutput) + minOutput;
}

function lerp(start: number, end: number, amt: number) {
  return (1 - amt) * start + amt * end;
}

const cameraPosition = new Vector3(0, 0, 40);
// --- Animation loop ---
onMounted(async () => {
  player.init();

  // Persistent Color Objects (Avoids re-parsing strings every frame)
  const currentColorA = new Color(uniforms.value.u_color_a.value);
  const currentColorB = new Color(uniforms.value.u_color_b.value);
  const targetColorA = new Color();
  const targetColorB = new Color();

  function animate() {
    if (audioCtx.value && player.analyser) {
      player.updateCurrentTime(audioCtx.value.currentTime);

      // Vibe Targets
      const vibe = player.currentTrack.vibe || { colorA: '#3f3089', colorB: '#00bcff', speed: 1.0 };

      // Dynamic Transition Speed based on Crossfade setting
      // If fade is 10s, we want slow lerp.
      // Formula: 0.05 / (duration || 1) -> 5s fade = 0.01 lerp.
      const fadeTime = player.fadeDuration || 3;
      const lerpSpeed = 0.06 / (fadeTime + 1); // +1 prevents div by zero and smoothing

      if (player.isVibeAuto) {
        // Colors
        targetColorA.set(vibe.colorA);
        targetColorB.set(vibe.colorB);

        currentColorA.lerp(targetColorA, lerpSpeed);
        currentColorB.lerp(targetColorB, lerpSpeed);

        // Apply to uniforms
        uniforms.value.u_color_a.value = '#' + currentColorA.getHexString();
        uniforms.value.u_color_b.value = '#' + currentColorB.getHexString();

        // Smoothly transition speed
        uniforms.value.u_speed.value = lerp(uniforms.value.u_speed.value, vibe.speed, lerpSpeed);
      }



      // Get Bounded Frequency Data
      const { bass, high } = player.getFrequencyData();
      const avg = player.analyser.getAverageFrequency();


      // Drive Uniforms
      // Squared bass for punch, scaled for new shader math
      uniforms.value.u_bass.value = bass * bass;
      uniforms.value.u_high.value = player.isFlashEnabled ? high : 0; // Flash toggle

      // Use Average Frequency multiplied by Vibe intensity for dynamic scaling
      uniforms.value.u_intensity.value = (avg / 255) * (vibe.intensity || 0.15) * 4.0;

      // --- Beat Sync ---
      const bpm = player.currentTrack.bpm || 120;
      const beatInterval = 60 / bpm;
      const startTime = player.currentTrack.startTime;
      const beatOffset = player.currentTrack.beatOffset || 0;

      const elapsed = audioCtx.value.currentTime - (startTime + beatOffset);
      if (elapsed > 0) {
        // Sawtooth wave: 0.0 to 1.0 within the BEAT
        uniforms.value.u_beat.value = (elapsed % beatInterval) / beatInterval;
      } else {
        uniforms.value.u_beat.value = 0;
      }

      uniforms.value.u_time.value = clock.getElapsedTime();
    }

    requestAnimationFrame(animate);
  }
  animate();
});
</script>

<template>
  <UApp>

    <Overflow />

    <TrackTitle :key="`${player.trackList[player.currentTrack.index]?.name || 'empty'}-${player.currentTrack.index}`"
      :text="(player.trackList[player.currentTrack.index]?.name?.replace(/\.[^/.]+$/, '') || '').toUpperCase()"
      :visible="(player.currentTime - player.currentTrack.startTime) < 8" />

    <TresCanvas window-size :antialias="true" :alpha="true" :transparent="false" clearColor="#000000"
      :output-encoding="SRGBColorSpace">
      <TresPerspectiveCamera :position="cameraPosition" :fov="20" />
      <OrbitControls :autoRotate="true" :autoRotateSpeed="0.03" :enableZoom="false" :enablePan="false"
        :minPolarAngle="Math.PI / 2" :maxPolarAngle="Math.PI / 2" />
      <Sphere :uniforms="uniforms" />
      <Plane :intensity="scaleValue(bloomIntensity, 0, 250, 0, 4)" />
    </TresCanvas>
  </UApp>
</template>
