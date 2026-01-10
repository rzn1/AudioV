<template>
    <div class="absolute inset-0 h-fit z-10 p-5">
        <UDrawer handle-only title="Player controller" description="Lorem ipsum dolor sit amet, consectetur adipiscing elit." inset>
            <UButton label="Open" color="neutral" variant="subtle" trailing-icon="i-lucide-chevron-up" />

            <template #body>
                <div class="w-full flex gap-10">
                    <!-- LEFT COLUMN: Controls & Settings -->
                    <div class="w-full h-full flex flex-col gap-4">
                        
                        <!-- CARD 1: Now Playing & Volume -->
                        <div class="bg-gray-900/40 border border-white/5 rounded-xl p-4 backdrop-blur-sm">
                            <div class="flex justify-between items-start mb-4">
                                <div class="flex flex-col gap-1 min-w-0">
                                    <Transition name="fade" mode="out-in">
                                        <span v-if="player.transitionState.active" class="text-[10px] uppercase tracking-wider font-bold text-primary-400 animate-pulse truncate block" key="mixing">
                                            Mixing from {{ player.transitionState.fromName }}
                                        </span>
                                        <span v-else class="text-[10px] uppercase tracking-wider font-bold text-gray-500 block" key="default">
                                            Now Playing
                                        </span>
                                    </Transition>
                                    <h3 class="text-white font-medium truncate max-w-[200px]" :title="player.trackList[player.currentTrack.index]?.name">
                                        {{ player.currentTrack.index !== -1 && player.trackList[player.currentTrack.index] ? player.trackList[player.currentTrack.index].name.replace(/\.[^/.]+$/, "") : 'No Track Selected' }}
                                    </h3>
                                </div>
                                <div class="flex gap-2">
                                     <UBadge color="neutral" variant="soft" size="xs" class="font-mono">{{ currentTrack.bpm }} BPM</UBadge>
                                     <UBadge :color="currentTrack.duration > 0 ? 'primary' : 'neutral'" variant="soft" size="xs" class="font-mono">
                                        {{ formatTime(currentTrack.duration) }}
                                     </UBadge>
                                </div>
                            </div>

                            <div class="grid grid-cols-[1fr_auto] gap-4 items-center">
                                <UFormField label="Volume" class="w-full">
                                    <USlider :min="0" :max="1" :step="0.01" v-model="volume" size="sm" />
                                </UFormField>
                                <UPopover :ui="{ content: 'w-auto' }">
                                    <UButton icon="i-heroicons-adjustments-horizontal" color="neutral" variant="ghost" size="sm" />
                                    <template #content>
                                        <!-- Mini EQ -->
                                        <div class="p-4 flex gap-3">
                                            <div v-for="(freq, index) in [60, 400, 2400, 15000]" :key="freq" class="flex flex-col items-center gap-1">
                                                <span class="text-[8px] uppercase font-bold text-gray-500 mb-1">{{ ['Bass', 'Lo-Mid', 'Hi-Mid', 'Air'][index] }}</span>
                                                <div class="h-24 flex items-center justify-center">
                                                    <USlider orientation="vertical" :min="-12" :max="12" :step="0.1" 
                                                        :model-value="player.eqNodes[[0, 2, 4, 6][index]]?.gain.value || 0"
                                                        @update:model-value="(val) => player.setEqGain([0, 2, 4, 6][index], val)" size="xs" color="neutral" />
                                                </div>
                                                <span class="text-[9px] text-gray-500 font-mono">{{ freq >= 1000 ? (freq/1000) + 'k' : freq }}</span>
                                            </div>
                                        </div>
                                    </template>
                                </UPopover>
                            </div>
                        </div>

                        <!-- CARD 2: Visuals & Mixer -->
                        <div class="grid grid-cols-2 gap-4">
                            <!-- Mixer -->
                            <div class="bg-gray-900/40 border border-white/5 rounded-xl p-4 backdrop-blur-sm flex flex-col gap-3">
                                <span class="text-[10px] uppercase tracking-wider font-bold text-gray-500">Automix</span>
                                <div class="space-y-3">
                                    <UFormField label="Fade In (s)">
                                        <UInputNumber v-model="player.fadeDuration" size="xs" :min="0" :max="30" />
                                    </UFormField>
                                    <UFormField label="Fade Out (s)">
                                        <UInputNumber v-model="player.fadeOutDuration" size="xs" :min="0" :max="30" />
                                    </UFormField>
                                </div>
                            </div>

                            <!-- Sphere -->
                            <div class="bg-gray-900/40 border border-white/5 rounded-xl p-4 backdrop-blur-sm flex flex-col gap-3">
                                <div class="flex justify-between items-center">
                                    <span class="text-[10px] uppercase tracking-wider font-bold text-gray-500">Visuals</span>
                                    <USwitch v-model="player.isVibeAuto" color="primary" size="xs" />
                                </div>
                                <div class="space-y-2">
                                    <!-- Speed Control -->
                                     <div class="flex items-center gap-2 text-xs text-gray-400">
                                        <span class="i-heroicons-bolt-20-solid"></span>
                                        <USlider :min="0" :max="2" :step="0.1" v-model="uniforms.u_speed.value" size="xs" class="flex-1" />
                                     </div>
                                     
                                     <!-- Color Picker -->
                                     <UPopover>
                                        <UButton label="Colors" color="neutral" variant="soft" size="xs" block>
                                            <template #trailing>
                                                <div class="flex -space-x-1">
                                                    <span :style="primaryChip" class="size-2 rounded-full ring-1 ring-gray-900" />
                                                    <span :style="secondaryChip" class="size-2 rounded-full ring-1 ring-gray-900" />
                                                </div>
                                            </template>
                                        </UButton>
                                        <template #content>
                                            <div class="flex gap-2 p-2 bg-gray-900">
                                                <UColorPicker v-model="uniforms.u_color_a.value" class="p-1" />
                                                <UColorPicker v-model="uniforms.u_color_b.value" class="p-1" />
                                            </div>
                                        </template>
                                    </UPopover>
                                </div>
                            </div>
                        </div>

                        <!-- CARD 3: Waveform -->
                        <div class="flex-1 bg-gray-900/40 border border-white/5 rounded-xl p-4 backdrop-blur-sm flex flex-col min-h-0">
                            <div class="flex justify-between items-center mb-2">
                                <span class="text-[10px] uppercase tracking-wider font-bold text-gray-500">Waveform Analysis</span>
                                 <UPopover :ui="{ content: 'w-auto' }">
                                    <UButton icon="i-heroicons-chart-bar" color="neutral" variant="ghost" size="sm" />
                                    <template #content>
                                        <div class="p-4 w-56 bg-gray-900 text-[10px] font-mono text-gray-400">
                                            <div class="grid grid-cols-2 gap-y-1">
                                                <span>VIBE:</span> <span class="text-white">{{ player.currentTrack.vibe?.name || '--' }}</span>
                                                <span>ENERGY:</span> <span class="text-white">{{ player.currentTrack.vibe?.intensity?.toFixed(2) || '0.00' }}</span>
                                                <div class="col-span-2 h-px bg-gray-800 my-1"></div>
                                                <span>BASS:</span> <span class="text-yellow-400">{{ player.getLowEnergy().toFixed(0) }}</span>
                                            </div>
                                        </div>
                                    </template>
                                </UPopover>
                            </div>
                            
                            <div class="w-full h-24 flex items-center justify-center relative">
                                <div class="absolute inset-0">
                                     <Waveform />
                                </div>
                            </div>
                            
                            <!-- Seek Bar Below -->
                            <div class="mt-2">
                                <URange v-if="player.currentTrack.duration > 0" v-model="seekProgress" :min="0" :max="100" :step="0.1" size="xs" color="primary" />
                                <UProgress v-else :value="0" size="xs" />
                            </div>
                        </div>
                    </div>

                    <!-- RIGHT COLUMN: Queue -->
                    <div class="w-full border-l border-gray-800 pl-6 flex flex-col h-full">
                        <p class="font-bold text-md mb-3">Queue</p>
                        
                        <div class="flex-1 flex flex-col space-y-4">
                            <!-- Custom Upload Area -->
                            <div class="relative group">
                                <label class="flex flex-col items-center justify-center w-full h-24 border-2 border-gray-700 border-dashed rounded-lg cursor-pointer bg-gray-900/50 hover:bg-gray-800 transition-colors">
                                    <div class="flex flex-col items-center justify-center pt-5 pb-6">
                                        <span class="i-heroicons-cloud-arrow-up-20-solid text-gray-400 mb-2 text-2xl"></span>
                                        <p class="mb-1 text-sm text-gray-400"><span class="font-semibold">Click to upload</span> or drag and drop</p>
                                        <p class="text-xs text-gray-500">MP3, WAV, OGG (Max 100MB)</p>
                                    </div>
                                    <input type="file" class="hidden" multiple accept="audio/*" @change="onNativeFileChange" />
                                </label>
                                
                                <!-- Progress Overlay -->
                                <div v-if="player.processingState.isProcessing" class="absolute inset-0 bg-gray-900/90 backdrop-blur-sm rounded-lg flex flex-col items-center justify-center z-10 transition-all">
                                    <div class="text-blue-400 font-mono text-xs flex items-center gap-2 mb-2">
                                        <span class="i-heroicons-sparkles-20-solid animate-pulse"></span>
                                        Analyzing Vibe Data...
                                    </div>
                                    <div class="w-3/4">
                                         <UProgress :value="(player.processingState.current / player.processingState.total) * 100" size="sm" color="primary" indicator />
                                         <div class="text-center text-[10px] text-gray-500 mt-1">{{ player.processingState.current }} / {{ player.processingState.total }}</div>
                                    </div>
                                </div>
                            </div>

                            <!-- Track List -->
                            <div class="flex-1 overflow-y-auto min-h-[300px] pr-1 mt-4 custom-scrollbar relative">
                                <!-- Empty State -->
                                <div v-if="player.trackList.length === 0" class="absolute inset-0 flex flex-col items-center justify-center text-gray-600 space-y-2 opacity-50">
                                    <span class="i-heroicons-musical-note-20-solid text-4xl"></span>
                                    <span class="text-sm font-medium">Queue is empty</span>
                                    <span class="text-xs">Upload tracks to get started</span>
                                </div>

                                <!-- List -->
                                <div v-else v-for="(file, index) in player.trackList" :key="file.name + index"
                                    draggable="true" 
                                    @dragstart="onDragStart($event, index)"
                                    @drop="onDrop($event, index)" 
                                    @dragover.prevent 
                                    @click="onTrackClick(index)"
                                    class="group relative flex items-center gap-3 p-3 mb-1 rounded-lg cursor-pointer select-none transition-all border border-transparent"
                                    :class="[
                                        player.currentTrack.index === index
                                            ? 'bg-primary-900/40 border-primary-500/50 border-l-4 shadow-[0_0_15px_rgba(var(--color-primary-500),0.1)]'
                                            : 'hover:bg-gray-800/50 hover:border-gray-700'
                                    ]">
                                    
                                    <!-- Play/Index Icon with Equalizer -->
                                    <div class="w-6 flex justify-center text-gray-500 group-hover:text-white">
                                         <div v-if="player.currentTrack.index === index" class="flex items-end gap-[2px] h-4 pb-1">
                                            <!-- CSS Equalizer Bars -->
                                            <div class="w-1 bg-primary-400 rounded-sm animate-[audio-eq_0.6s_ease-in-out_infinite] h-2"></div>
                                            <div class="w-1 bg-primary-400 rounded-sm animate-[audio-eq_0.8s_ease-in-out_infinite_0.1s] h-3"></div>
                                            <div class="w-1 bg-primary-400 rounded-sm animate-[audio-eq_0.5s_ease-in-out_infinite_0.2s] h-1.5"></div>
                                         </div>
                                         <template v-else>
                                            <span class="text-xs font-mono">{{ index + 1 }}</span>
                                            <span class="hidden group-hover:block i-heroicons-play-20-solid text-xs"></span>
                                         </template>
                                    </div>

                                    <!-- Meta -->
                                    <div class="flex-1 min-w-0">
                                        <div class="flex justify-between items-center">
                                            <p class="truncate text-sm font-medium" :class="player.currentTrack.index === index ? 'text-primary-100' : 'text-gray-300'">
                                                {{ file.name.replace(/\.[^/.]+$/, "") }}
                                            </p>
                                            <!-- Next Up Badge -->
                                            <UBadge v-if="index === player.currentTrack.index + 1" color="primary" variant="subtle" size="xs" class="ml-2 font-mono text-[9px] px-1 h-4">
                                                NEXT UP
                                            </UBadge>
                                        </div>
                                        
                                        <!-- Sub-meta (BPM / Vibe) -->
                                        <div class="flex gap-2 text-[10px] items-center mt-0.5" v-if="player.audioBuffers[index]?.vibe">
                                            <span class="text-gray-500 font-mono bg-gray-900/50 px-1 rounded">{{ player.audioBuffers[index].bpm }} BPM</span>
                                            <span class="font-bold" :style="{ color: player.audioBuffers[index].vibe.colorA }">{{ player.audioBuffers[index].vibe.name.toUpperCase() }}</span>
                                        </div>
                                        <div v-else class="h-3 w-20 bg-gray-800 rounded animate-pulse mt-1"></div>
                                    </div>

                                    <!-- Duration -->
                                    <div class="text-xs font-mono text-gray-500">
                                        <span v-if="player.audioBuffers[index]">{{ formatTime(player.audioBuffers[index].buffer.duration) }}</span>
                                        <span v-else class="i-lucide-loader-2 animate-spin"></span>
                                    </div>

                                    <!-- Drag Handle -->
                                    <div class="opacity-0 group-hover:opacity-100 transition-opacity text-gray-600 cursor-move">
                                        <span class="i-heroicons-bars-2-20-solid"></span>
                                    </div>
                                </div>
                            </div>

                            <div class="flex gap-2 mt-auto pt-4 border-t border-gray-800">
                                <UButton @click="player.startPlayer()" :disabled="player.trackList.length == 0"
                                    label="Start" icon="i-heroicons-play-20-solid" color="primary" variant="solid" block class="flex-1" />
                                <UButton @click="player.pausePlayer()" icon="i-heroicons-pause-20-solid" color="neutral" variant="ghost" />
                                <UButton @click="player.stop()" icon="i-heroicons-stop-20-solid" color="neutral" variant="ghost" />
                            </div>
                        </div>
                    </div>
                </div>
            </template>
        </UDrawer>
    </div>
</template>

<script setup lang="ts">
import { usePlayerStore } from "~/stores/player";
const toast = useToast()

const player = usePlayerStore();
const currentTrack = computed(() => player.getTrackData());
const uniforms = computed(() => player.uniforms);

// Seek Progress Logic
const seekProgress = computed({
    get: () => player.getProgress() * 100,
    set: (val) => {
        player.seek(val / 100);
    }
});

const trackList = ref<File[]>([]);
const uploadState = ref(false);
const volume = ref(player.audioVolume);

watch(volume, (newVolume) => {
    player.setAudioVolume(newVolume);
});

const primaryChip = computed(() => ({ backgroundColor: uniforms.value.u_color_a.value }))
const secondaryChip = computed(() => ({ backgroundColor: uniforms.value.u_color_b.value }))

// Upload Logic
async function onSubmit() {
    if (trackList.value.length === 0) return;
    uploadState.value = true;
    await player.initTracks([...player.trackList, ...trackList.value]); // Append mode? Or replace? 
    // Actually initTracks replaces usually. Let's assume replace for now or check initTracks.
    // Checking player.ts... initTracks does "this.trackList = tracks". 
    // So it replaces. The user logic in Overflow was "Upload tracks".
    // I made UFileUpload trigger onSubmit on change.
    
    // Let's keep original behavior: Upload replaces or inits. 
    // Actually, I should check if I broke appending. 
    // For now I will stick to what was there, just nicer UI.
    
    uploadState.value = false;
    trackList.value = []; // clear input

    toast.add({
        title: 'Tracks Updated',
        description: `Tracks loaded.`,
        icon: 'i-lucide-music'
    })
}

// Drag and Drop Logic
function onTrackClick(index: number) {
    if (player.currentTrack.index === index) return;
    player.playTrack(index);
}

function onDragStart(event: DragEvent, index: number) {
    if (event.dataTransfer) {
        event.dataTransfer.effectAllowed = 'move';
        event.dataTransfer.setData('text/plain', index.toString());
    }
}

function onDrop(event: DragEvent, toIndex: number) {
    if (event.dataTransfer) {
        const fromIndex = parseInt(event.dataTransfer.getData('text/plain'));
        if (!isNaN(fromIndex)) {
            player.reorderTracks(fromIndex, toIndex);
        }
    }
}

function onNativeFileChange(event: Event) {
    const input = event.target as HTMLInputElement;
    if (input.files && input.files.length > 0) {
        const files = Array.from(input.files);
        player.initTracks([...player.trackList, ...files]);
        input.value = ''; // Reset input
        
        toast.add({
            title: 'Analyzing Tracks',
            description: `Vibe AI is processing ${files.length} new tracks...`,
            icon: 'i-heroicons-sparkles-20-solid',
            color: 'primary'
        })
    }
}

function formatTime(seconds: number) {
    if (!seconds) return "0:00";
    const m = Math.floor(seconds / 60);
    const s = Math.floor(seconds % 60);
    return `${m}:${s.toString().padStart(2, '0')}`;
}
</script>


<style>
@keyframes audio-eq {
  0%, 100% { height: 4px; }
  50% { height: 12px; }
}

.fade-enter-active,
.fade-leave-active {
  transition: opacity 0.3s ease;
}

.fade-enter-from,
.fade-leave-to {
  opacity: 0;
}
</style>