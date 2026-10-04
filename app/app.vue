<script setup lang="ts">
import { onMounted, onBeforeUnmount, computed } from "vue";
import { SRGBColorSpace } from "three";
import { usePlayerStore } from "~/stores/player";
import { useDjStore } from "~/stores/dj";

const player = usePlayerStore();
const audioCtx = computed(() => player.getAudioContext());

let raf = 0;
onMounted(() => {
  player.init();
  player.restoreQueue(); // bring back the queue saved by the previous session
  useDjStore().init();   // AI DJ: loads its settings and hooks into playback

  // The visuals (Resonance.vue) run their own loop; this one only keeps the store's clock current
  const tick = () => {
    if (audioCtx.value) player.updateCurrentTime(audioCtx.value.currentTime);
    raf = requestAnimationFrame(tick);
  };
  tick();
});
onBeforeUnmount(() => cancelAnimationFrame(raf));
</script>

<template>
  <UApp>

    <Overflow />

    <TrackTitle :key="`${player.trackList[player.currentTrack.index]?.name || 'empty'}-${player.currentTrack.index}`"
      :text="(player.trackList[player.currentTrack.index]?.name?.replace(/\.[^/.]+$/, '') || '').toUpperCase()"
      :visible="(player.currentTime - player.currentTrack.startTime) < 8" />

    <TresCanvas window-size :antialias="false" clearColor="#000000" :output-encoding="SRGBColorSpace">
      <TresPerspectiveCamera :position="[0, 0, 5]" />
      <Resonance />
    </TresCanvas>
  </UApp>
</template>
