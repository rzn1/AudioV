<script setup lang="ts">
import { shallowRef, toRefs } from 'vue'
import { Text3D } from '@tresjs/cientos'
import { useTresContext, useRenderLoop } from '@tresjs/core'

const props = defineProps<{
  text: string
  visible: boolean
}>()

const { visible } = toRefs(props)

// Animation State
const opacity = shallowRef(0)
const yPos = shallowRef(15) // Start high
const groupRef = shallowRef()

// Use Tres context for the shared camera
const { camera: activeCamera } = useTresContext()
const { onLoop } = useRenderLoop()

onLoop(({ delta }) => {
  const targetOpacity = visible.value ? 1 : 0
  const targetY = visible.value ? 0 : 15 // Drop to center (0), fly back to 15
  
  // Lerp (Increased speed)
  opacity.value += (targetOpacity - opacity.value) * delta * 6
  yPos.value += (targetY - yPos.value) * delta * 5

  // Billboard Logic (Face Camera)
  if (groupRef.value && activeCamera.value) {
    // Copy camera orientation to the group to keep it facing the camera
    groupRef.value.quaternion.copy(activeCamera.value.quaternion)
    
    // Ensure scale is static
    groupRef.value.scale.set(1, 1, 1)
  }
})
</script>

<template>
  <TresGroup ref="groupRef" :position="[0, yPos, 0]">
    <Suspense>
      <Text3D
        v-if="props.text"
        :text="props.text"
        font="https://unpkg.com/three@0.160.0/examples/fonts/helvetiker_regular.typeface.json"
        :size="3.5"
        :height="0.2"
        center
      >
        <TresMeshBasicMaterial 
          color="white" 
          :transparent="true" 
          :opacity="opacity"
          :depth-test="false"
        />
      </Text3D>
    </Suspense>
  </TresGroup>
</template>
