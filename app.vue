<script setup lang="ts">
import { AudioListener, AudioAnalyser, PerspectiveCamera, Audio, Clock, SRGBColorSpace } from 'three';

const isStarted = ref(false);

const audioPlayer = ref<HTMLAudioElement>();
const camera = new PerspectiveCamera(20, 1, 0.1, 1000);
const clock = new Clock();

const uniforms = {
  u_time: { type: 'f', value: 0.0 },
  u_frequency: { type: 'f', value: 0.0 },
  u_red: { type: 'f', value: 0.2 },
  u_green: { type: 'f', value: 0.2 },
  u_blue: { type: 'f', value: 0.8 }
}

onMounted(() => {
  setTimeout(() => {
    if (process.client && camera && audioPlayer.value) {
      const listener = new AudioListener();
      camera.add(listener);

      const sound = new Audio(listener);
      const audioElement = audioPlayer.value;
      const audioContext = listener.context;

      const mediaElementSource = audioContext.createMediaElementSource(audioElement);
      sound.setNodeSource(mediaElementSource);

      const analyser = new AudioAnalyser(sound, 256);

      camera.aspect = window.innerWidth / window.innerHeight;
      camera.position.set(0, 0, 40);
      camera.updateProjectionMatrix();

      function animate() {
        uniforms.u_time.value = clock.getElapsedTime();
        uniforms.u_frequency.value = analyser.getAverageFrequency();
        analyzeAudio();
        requestAnimationFrame(animate);
      };

      animate();


      function analyzeAudio() {
        const bufferLength = analyser.analyser.frequencyBinCount;
        const dataArray = new Uint8Array(bufferLength);
        analyser.analyser.getByteFrequencyData(dataArray);

        const averageVolume = dataArray.reduce((acc, val) => acc + val, 0) / bufferLength;

        const threshold = 100;

        if (averageVolume > threshold) {
          console.log('Big audio drop detected!');
        }
      };
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
//    
</script>

<template>
  <Start v-if="!isStarted" >
    <p @click="startPlayer()">%^*!@#(*^%!@)</p>
  </Start>

  <audio ref="audioPlayer" :autoplay="false" crossorigin="anonymous" src="https://streaming.exclusive.radio/er/onedirection/icecast.audio" />

  <TresCanvas window-size :antialias="true" :output-encoding="SRGBColorSpace">

    <Environment :background="true" files="/test6.hdr"></Environment>

    <primitive :object="camera" />

    <OrbitControls :autoRotate="true" :autoRotateSpeed="0.03" :enableZoom="false" :enablePan="false"
      :minPolarAngle="Math.PI / 2" :maxPolarAngle="Math.PI / 2" />

    <Sphere :uniforms="uniforms" />

    <Plane />
  </TresCanvas>
</template>
