<script setup lang="ts">
const props = defineProps<{
  text: string
  visible: boolean
}>()
</script>

<template>
  <Transition name="title-drop">
    <div v-if="props.visible && props.text" class="track-title-overlay">
      <span class="track-title-text">{{ props.text }}</span>
    </div>
  </Transition>
</template>

<style scoped>
.track-title-overlay {
  position: fixed;
  bottom: 11%;
  left: 50%;
  transform: translateX(-50%);
  z-index: 100;
  pointer-events: none;
  text-align: center;
  max-width: 86vw;
}

.track-title-text {
  display: block;
  font-size: clamp(1.1rem, 2.6vw, 2.2rem);
  font-weight: 800;
  color: white;
  text-transform: uppercase;
  letter-spacing: 0.22em;
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
  text-shadow: 0 0 18px rgba(255, 255, 255, 0.55), 0 2px 12px rgba(0, 0, 0, 0.6);
  animation: glow-pulse 2s ease-in-out infinite;
}

@keyframes glow-pulse {
  0%, 100% { opacity: 1; }
  50% { opacity: 0.85; }
}

/* Vue Transition */
.title-drop-enter-active {
  transition: all 0.4s cubic-bezier(0.22, 1, 0.36, 1);
}
.title-drop-leave-active {
  transition: all 0.6s cubic-bezier(0.22, 1, 0.36, 1);
}
.title-drop-enter-from {
  opacity: 0;
  transform: translate(-50%, 40%);
}
.title-drop-leave-to {
  opacity: 0;
  transform: translate(-50%, 40%);
}
</style>
