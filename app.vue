<script setup lang="ts">
import { AudioListener, AudioAnalyser, PerspectiveCamera, Audio, Clock, SRGBColorSpace, AudioLoader } from 'three';

const isStarted = ref(false);

const audioPlayer = ref<HTMLAudioElement>();
const camera = new PerspectiveCamera(20, 1, 0.1, 1000);
const clock = new Clock();

const uniforms = {
  u_time: { type: 'f', value: 0.0 },
  u_frequency: { type: 'f', value: 0.0 },
  u_red: { type: 'f', value: 0.2 },
  u_green: { type: 'f', value: 1 },
  u_blue: { type: 'f', value: 0.8 }
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
        uniforms.u_frequency.value = analyser.getAverageFrequency();
        requestAnimationFrame(animate);

        bloomIntensity.value = getBassFrequency(analyser.getFrequencyData(), 256, audioContext.sampleRate);
        if (bloomIntensity.value > 200) {
          //onHighBassDetected(bassFrequency);
        }
      };

      animate();


      function getBassFrequency(data, fftSize, sampleRate) {
        const nyquist = sampleRate / 2;
        const bassFrequencyRange = [200, 250]; // Define the bass frequency range
        const bassFrequencyIndexRange = [
          Math.floor(bassFrequencyRange[0] / nyquist * (fftSize / 2)),
          Math.floor(bassFrequencyRange[1] / nyquist * (fftSize / 2))
        ];

        let maxBass = 0;

        for (let i = bassFrequencyIndexRange[0]; i <= bassFrequencyIndexRange[1]; i++) {
          if (data[i] > maxBass) {
            maxBass = data[i];
          }
        }

        return maxBass;
      }

      function onHighBassDetected(bassFrequency) {
        console.log('High bass detected:', bassFrequency);
        const { red, blue, green } = getRandomColor();
        uniforms.u_red.value = red;
        uniforms.u_green.value = green;
        uniforms.u_blue.value = blue;
        // Perform any other actions needed
      }
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

function getRandomColor() {
  const red = Math.random();
  const blue = Math.random();
  const green = Math.random();
  return { red, blue, green };
}

function scaleValue(input: number, inputMin: number, inputMax: number) {
    // Assuming the output range is from 0 to 5
    const outputMin = 0;
    const outputMax = 5;

    // Calculate the ratio of the input value relative to the input range
    const ratio = (input - inputMin) / (inputMax - inputMin);
    
    // Scale the ratio to the output range
    return ratio * (outputMax - outputMin) + outputMin;
}

//        <Environment :background="true" files="/test6.hdr"></Environment>
</script>

<template>
  <Start v-if="!isStarted">
    <p @click="startPlayer()">%^*!@#(*^%!@)</p>
  </Start>

  <audio ref="audioPlayer" :autoplay="false" crossorigin="anonymous"
    src="https://streaming.exclusive.radio/er/onedirection/icecast.audio" />

  <TresCanvas window-size :antialias="true" :output-encoding="SRGBColorSpace">

    <primitive :object="camera" />

    <OrbitControls :autoRotate="true" :autoRotateSpeed="speed" :enableZoom="false" :enablePan="false"
      :minPolarAngle="Math.PI / 2" :maxPolarAngle="Math.PI / 2" />

    <Sphere :uniforms="uniforms" />

    <Plane :intensity="scaleValue(bloomIntensity, 0, 250)"/>
  </TresCanvas>
</template>
