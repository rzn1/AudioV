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
  top: 50%;
  left: 50%;
  transform: translate(-50%, -50%);
  z-index: 100;
  pointer-events: none;
  text-align: center;
}

.track-title-text {
  font-size: 4rem;
  font-weight: 900;
  color: white;
  text-transform: uppercase;
  letter-spacing: 0.1em;
  text-shadow: 
    0 0 20px rgba(255, 255, 255, 0.8),
    0 0 40px rgba(255, 255, 255, 0.6),
    0 0 60px rgba(255, 255, 255, 0.4);
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
  transform: translate(-50%, -150%);
}
.title-drop-leave-to {
  opacity: 0;
  transform: translate(-50%, 50%);
}
</style>
