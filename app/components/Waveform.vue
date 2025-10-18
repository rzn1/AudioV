<script setup lang="ts">
import { ref, onMounted } from "vue";
import { usePlayerStore } from "~/stores/player";

const player = usePlayerStore();
const currentTrack = computed(() => player.getTrackData());
const canvasRef = ref<HTMLCanvasElement | null>(null);
const waveform = ref<number[]>([]);
const trackProgress = computed(() => player.getProgress());

function drawWaveform(rmsValues: number[], progress = 0) {
  const {
    color = "orange",
    playedColor = "lightgreen",
    spacing = 3,
    sensitivity = 0.01
  } = { color: "orange", playedColor: "lightgreen", spacing: 1, sensitivity: 0.01 };

  const canvas = canvasRef.value;
  if (!canvas) return;

  resizeCanvas(canvas);

  const ctx = canvas.getContext("2d")!;
  const width = canvas.width;
  const height = canvas.height;
  const totalBars = rmsValues.length;

  const totalSpacing = spacing * (totalBars - 1);
  const barWidth = (width - totalSpacing) / totalBars;

  ctx.clearRect(0, 0, width, height);

  const maxRms = Math.max(...rmsValues);

  for (let i = 0; i < totalBars; i++) {
    let value = rmsValues[i] || 0;
    if (value < sensitivity) value = sensitivity + value;

    const barHeight = maxRms > 0 ? (value / maxRms) * height : 0;
    const x = i * (barWidth + spacing);
    const y = (height - barHeight) / 2;

    const barProgress = i / totalBars;
    ctx.fillStyle = barProgress <= progress ? playedColor : color;

    ctx.fillRect(x, y, barWidth, barHeight);
  }
}

function resizeCanvas(canvas: HTMLCanvasElement) {
  const parent = canvas.parentElement;

  if(!parent) return;
  
  const rect = parent.getBoundingClientRect();

  // Set the CSS size (visual)
  canvas.style.width = '100%';
  canvas.style.height = 'auto'; // or a fixed ratio/height if needed

  // Set the internal resolution to match the *displayed* size
  const displayWidth = rect.width;
  const displayHeight = rect.height; // adjust as needed
  canvas.width = displayWidth;
  canvas.height = displayHeight;
}


function chunkRMSData(rmsData: number[], chunkCount: number): number[] {
  const chunkSize = Math.ceil(rmsData.length / chunkCount)
  const chunks = []

  for (let i = 0; i < rmsData.length; i += chunkSize) {
    const chunk = rmsData.slice(i, i + chunkSize)
    const avgRMS = chunk.reduce((sum, val) => sum + val, 0) / chunk.length
    chunks.push(avgRMS)
  }

  return chunks
}

onMounted(async () => {
  waveform.value = currentTrack.value.rmsData.length ? chunkRMSData(currentTrack.value.rmsData, 300) : [];
  drawWaveform(waveform.value, trackProgress.value);
  animate();

  watch(
    () => currentTrack.value.rmsData,
    (newRmsData) => {
      console.log("RMS data changed, updating waveform");
      waveform.value = newRmsData.length
        ? chunkRMSData(currentTrack.value.rmsData, 300)
        : [];
    },
    { deep: true }
  );
});

function animate() {
  requestAnimationFrame(animate)
  if (waveform.value.length == 0) return
  drawWaveform(waveform.value, trackProgress.value);
}
</script>

<template>
  <canvas ref="canvasRef" width="1400" height="500"></canvas>
</template>