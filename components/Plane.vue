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

const loader = new TextureLoader();

const planetData = [
  {
    Texture: "/moon.jpg",
    Position: new Vector3(100, 20, -70),
    Color: 0xadacac,
    Sphere: new Mesh()
  },
  {
    Texture: "/earth.jpg",
    Position: new Vector3(-10, 13, 160),
    Color: 0x03a1fc,
    Sphere: new Mesh()
  },
  {
    Texture: "/venus.jpg",
    Position: new Vector3(110, -8, 100),
    Color: 0xfa9107,
    Sphere: new Mesh()
  },
  {
    Texture: "/mars.jpg",
    Position: new Vector3(-110, 23, -80),
    Color: 0xfa7807,
    Sphere: new Mesh()
  },
  {
    Texture: "/neptune.jpg",
    Position: new Vector3(15, -9, -130),
    Color: 0x07adfa,
    Sphere: new Mesh()
  },
  {
    Texture: "/jupiter.jpg",
    Position: new Vector3(-120, 17, 70),
    Color: 0x737373,
    Sphere: new Mesh()
  }
];

planetData.forEach((planet) => {
  const geometry = new SphereGeometry(5, 32, 32);
  const earthTexture = loader.load(planet.Texture);
  earthTexture.colorSpace = SRGBColorSpace;
  const material = new MeshStandardMaterial({ map: earthTexture, emissive: planet.Color, emissiveIntensity: 0.5 });
  var sphere = new Mesh(geometry, material);
  sphere.position.set(planet.Position.x, planet.Position.y, planet.Position.z);
  planet.Sphere = sphere;
});

</script>

<template>
  <primitive v-for="planet in planetData" :object="planet.Sphere" />

  <TresAmbientLight />

  <Reflector :rotation="[-Math.PI * 0.5, 0, 0]" :position="[0, -4.5, 0]" :clipBias="0.003" :textureWidth="1000"
    :textureHeight="1000">
    <TresCircleGeometry :args="[15, 1024]" />
  </Reflector>

  <Stars :radius="50" :depth="100" :count="5000" :size="1" :size-attenuation="false" />

  <EffectComposer :depth-buffer="true">
    <Noise premultiply />
    <Bloom :intensity="props.intensity" :luminance-threshold="0.2" :luminance-smoothing="0.5" :mipmap-blur="true"
      :blend-function="BlendFunction.ADD" />
  </EffectComposer>
</template>
