<script setup lang="ts">
import { Color, AudioListener, AudioAnalyser, PerspectiveCamera, Audio, Clock, SRGBColorSpace, AudioLoader } from 'three';

const isStarted = ref(false);

const audioPlayer = ref<HTMLAudioElement>();
const camera = new PerspectiveCamera(20, 1, 0.1, 1000);
const clock = new Clock();

const uniforms = {
      u_time: {
        value: 0.0
      },
      u_speed: {
        value: 0.9
      },
      u_intensity: {
        value: 0.15
      },
      u_partical_size: {
        value: 265.0
      },
      u_color_a: {
        value: new Color("#3f3089")
      },
      u_color_b: {
        value: new Color("#00bcff")
      }
    }

const bloomIntensity = ref(0);

onMounted(() => {
  setTimeout(() => {
    if (process.client && camera && audioPlayer.value) {
      const listener = new AudioListener();
      camera.add(listener);

      const sound = new Audio(listener);
      const audioElement = audioPlayer.value;
      const audioContext = listener.context;

      const mediaElementSource = audioContext.createMediaElementSource(audioElement);
      mediaElementSource.connect(sound.gain);

      const analyser = new AudioAnalyser(sound, 256);

      camera.aspect = window.innerWidth / window.innerHeight;
      camera.position.set(0, 0, 40);
      camera.updateProjectionMatrix();

      function animate() {
        uniforms.u_time.value = clock.getElapsedTime();
        uniforms.u_intensity.value = scaleValue(analyser.getAverageFrequency(), 0, 100, 0, 0.8);
        requestAnimationFrame(animate);

        bloomIntensity.value = analyser.getFrequencyData()[0];
      };

      animate();
    }
  }, 2000);
});

function startPlayer() {
  if (audioPlayer.value) {
    isStarted.value = true;
    audioPlayer.value.volume = 0.08;
    audioPlayer.value.play();
  }
}

function scaleValue(value, minInput, maxInput, minOutput, maxOutput) {
    // Ensure the value is within the input range
    value = Math.min(Math.max(value, minInput), maxInput);

    // Calculate the normalized value within the input range
    const normalizedValue = (value - minInput) / (maxInput - minInput);

    // Scale the normalized value to the output range
    const scaledValue = normalizedValue * (maxOutput - minOutput) + minOutput;

    return scaledValue;
}

//        <Environment :background="true" files="/test6.hdr"></Environment>
</script>

<template>
  <Start v-if="!isStarted">
    <p @click="startPlayer()">%^*!@#(*^%!@)</p>
  </Start>

  <audio ref="audioPlayer" :autoplay="false" crossorigin="anonymous"
    src="https://streaming.exclusive.radio/er/onedirection/icecast.audio" />

  <TresCanvas window-size :antialias="true" :alpha="true" :output-encoding="SRGBColorSpace">

    <primitive :object="camera" />

    <OrbitControls :autoRotate="true" :autoRotateSpeed="0.03" :enableZoom="false" :enablePan="false"
      :minPolarAngle="Math.PI / 2" :maxPolarAngle="Math.PI / 2" />

    <Sphere :uniforms="uniforms" />

    <Plane :intensity="scaleValue(bloomIntensity, 0, 250, 0, 4)"/>
  </TresCanvas>
</template>
