<script setup lang="ts">
import { ref, onMounted, computed } from "vue";
import { Clock, SRGBColorSpace, Vector3 } from "three";
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

const cameraPosition = new Vector3(0, 0, 40);
// --- Animation loop ---
onMounted(async () => {
  player.init();

  function animate() {
    if (audioCtx.value && player.analyser) {
      player.updateCurrentTime(audioCtx.value.currentTime);
      uniforms.value.u_time.value = clock.getElapsedTime();
      uniforms.value.u_intensity.value = scaleValue(player.analyser.getAverageFrequency(), 0, 100, 0, 0.8);
    }

    requestAnimationFrame(animate);
  }
  animate();
});
</script>

<template>
  <UApp>
    <Overflow />

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
