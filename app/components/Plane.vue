<script setup lang="ts">
import { SphereGeometry, TextureLoader, Mesh, SRGBColorSpace, Vector3, MeshStandardMaterial } from 'three'
import { Reflector, Stars } from '@tresjs/cientos'

import { BlendFunction } from 'postprocessing';
import { EffectComposer, Bloom, Noise } from '@tresjs/post-processing';

const props = defineProps({
  intensity: {
    type: Number,
    default: 0
  }
});


</script>

<template>
  <TresAmbientLight />

  <Reflector :rotation="[-Math.PI * 0.5, 0, 0]" :position="[0, -4.5, 0]" :clipBias="0.003" :textureWidth="1000"
    :textureHeight="1000" color="#333333">
    <TresCircleGeometry :args="[17, 1024]" />
  </Reflector>

  <EffectComposer :depth-buffer="true">
    <Noise premultiply />
    <Bloom :intensity="props.intensity" :luminance-threshold="0.4" :luminance-smoothing="0.5" :mipmap-blur="true"
      :blend-function="BlendFunction.ADD" />
  </EffectComposer>
</template>
