<script setup lang="ts">
import { ref, onMounted, computed, watch } from "vue";
import { usePlayerStore } from "~/stores/player";

const player = usePlayerStore();
const canvasRef = ref<HTMLCanvasElement | null>(null);
const waveform = ref<number[]>([]);
const trackProgress = computed(() => player.getFileProgress());

// Helper to get hex color with opacity
const hexToRgba = (hex: string, alpha: number) => {
  const r = parseInt(hex.slice(1, 3), 16);
  const g = parseInt(hex.slice(3, 5), 16);
  const b = parseInt(hex.slice(5, 7), 16);
  return `rgba(${r}, ${g}, ${b}, ${alpha})`;
};

function drawWaveform(rmsValues: number[], progress = 0) {
  const canvas = canvasRef.value;
  if (!canvas) return;

  resizeCanvas(canvas);

  const ctx = canvas.getContext("2d")!;
  const width = canvas.width;
  const height = canvas.height;
  const totalBars = rmsValues.length;
  if (totalBars === 0) return;

  // Slimmer Styling Parameters
  const spacing = 1; // Tighter spacing
  const barWidth = 2; // Fixed slim width
  // Recalculate based on fixed bar width + spacing logic, or adapt loop
  // Better: Fit to width with dynamic bar width but control totalBars via resolution

  const totalSpacing = spacing * (totalBars - 1);
  const calculatedBarWidth = (width - totalSpacing) / totalBars;

  const centerY = height / 2;
  const maxBarHeight = height * 0.7; // Slightly less tall

  // Fixed Premium Colors (Cyan/Emerald Theme)
  const primaryColor = '#06b6d4'; // Cyan-500
  const secondaryColor = '#334155'; // Slate-700 (Unplayed)

  ctx.clearRect(0, 0, width, height);

  // Gradient for Played
  const playedGradient = ctx.createLinearGradient(0, 0, 0, height);
  playedGradient.addColorStop(0, hexToRgba(primaryColor, 0.4));
  playedGradient.addColorStop(0.5, hexToRgba(primaryColor, 1));
  playedGradient.addColorStop(1, hexToRgba(primaryColor, 0.4));

  // Regular Unplayed
  const unplayedColor = hexToRgba(secondaryColor, 0.5);

  const maxRms = Math.max(...rmsValues, 0.001);

  const visualProgress = player.getFileProgress();

  for (let i = 0; i < totalBars; i++) {
    let value = rmsValues[i] || 0;
    const normalizedHeight = Math.pow(value / maxRms, 1) * maxBarHeight; // Linear again for sharper look
    const finalHeight = Math.max(normalizedHeight, 2);

    // Position
    const x = i * (calculatedBarWidth + spacing);
    const y = centerY - (finalHeight / 2);

    const barProgress = i / totalBars;
    const isPlayed = barProgress <= visualProgress;

    ctx.fillStyle = isPlayed ? playedGradient : unplayedColor;

    // Draw
    ctx.beginPath();
    ctx.roundRect(x, y, calculatedBarWidth, finalHeight, 2);
    ctx.fill();

    // Reflection (Only for loud parts)
    if (isPlayed && finalHeight > 20) {
      ctx.fillStyle = hexToRgba(primaryColor, 0.05);
      ctx.beginPath();
      // Mirror below
      ctx.roundRect(x, centerY + (finalHeight / 2) + 2, calculatedBarWidth, finalHeight * 0.4, 1);
      ctx.fill();
    }
  }

  // Draw Markers (Subtle)
  const track = player.currentTrack;
  if (track.fileDuration && track.fileDuration > 0) {
    const drawMarker = (time: number, color: string) => {
      const ratio = time / track.fileDuration;
      const x = ratio * width;

      ctx.strokeStyle = color;
      ctx.lineWidth = 1;
      ctx.beginPath();
      ctx.moveTo(x, height * 0.2);
      ctx.lineTo(x, height * 0.8);
      ctx.stroke();
    };

    if (track.startPoint) drawMarker(track.startPoint, '#bef264'); // Lime-300

    // Mix-Out Marker (Transition Start)
    const fadeOut = player.fadeOutDuration || 3;
    if (track.endPoint && track.endPoint > fadeOut) {
      const mixOutPoint = track.endPoint - fadeOut;

      const ratio = mixOutPoint / track.fileDuration;
      const x = ratio * width;

      ctx.save();
      ctx.strokeStyle = '#f87171'; // Red-400 (Same as end, indicating relation)
      ctx.lineWidth = 1;
      ctx.setLineDash([2, 2]); // Dashed
      ctx.beginPath();
      ctx.moveTo(x, height * 0.3);
      ctx.lineTo(x, height * 0.7);
      ctx.stroke();
      ctx.restore();
    }

    if (track.endPoint) drawMarker(track.endPoint, '#f87171');   // Red-400
  }
}

function handleSeek(event: MouseEvent) {
  if (!player.currentTrack.duration || !player.currentTrack.fileDuration) return;
  const canvas = canvasRef.value;
  if (!canvas) return;

  const rect = canvas.getBoundingClientRect();
  const clickX = event.clientX - rect.left;
  const clickRatio = clickX / rect.width;

  const clickTime = clickRatio * player.currentTrack.fileDuration;
  const playProgress = (clickTime - player.currentTrack.startPoint) / player.currentTrack.duration;

  const clampedProgress = Math.min(Math.max(playProgress, 0), 1);

  player.seek(clampedProgress);
}

function resizeCanvas(canvas: HTMLCanvasElement) {
  const parent = canvas.parentElement;
  if (!parent) return;
  const rect = parent.getBoundingClientRect();
  canvas.width = rect.width;
  canvas.height = rect.height;
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
  // Initial draw
  updateWaveform();

  // Resize Observer
  if (canvasRef.value && canvasRef.value.parentElement) {
    const resizeObserver = new ResizeObserver(() => {
      if (canvasRef.value) {
        resizeCanvas(canvasRef.value);
        // Redraw after resize
        drawWaveform(waveform.value, trackProgress.value);
      }
    });
    resizeObserver.observe(canvasRef.value.parentElement);
  }

  animate();

  watch(
    () => player.currentTrack.index,
    () => {
      updateWaveform();
    }
  );
});

function updateWaveform() {
  const newData = player.currentTrack.rmsData;
  // Higher resolution (200) for cleaner, slimmer look
  waveform.value = newData.length ? chunkRMSData(newData, 200) : [];
}

function animate() {
  requestAnimationFrame(animate)
  if (waveform.value.length == 0) {
    const canvas = canvasRef.value;
    if (canvas) {
      const ctx = canvas.getContext("2d");
      if (ctx) ctx.clearRect(0, 0, canvas.width, canvas.height);
    }
    return
  }
  drawWaveform(waveform.value, trackProgress.value);
}
</script>

<template>
  <canvas ref="canvasRef" class="w-full h-full cursor-pointer" @click="handleSeek"></canvas>
</template>