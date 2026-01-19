<template>
    <div class="absolute inset-0 h-fit z-10 p-4 sm:p-6 pointer-events-none">
        <UDrawer handle-only title="AUDIO CONTROL" description="Manage playback, visuals and queue." inset :ui="{
            content: 'bg-gray-950/80 backdrop-blur-xl border-t border-white/10 ring-1 ring-white/5',
            header: 'hidden',
            body: 'p-0 sm:p-0',
            handle: 'bg-white/20 hover:bg-white/40 w-16 h-1.5 mt-2'
        }" class="pointer-events-auto">
            <div class="flex justify-center w-full pb-2 pt-1">
                <UButton label="CONTROLS" color="neutral" variant="ghost" size="xs"
                    class="font-mono tracking-widest text-gray-500 hover:text-white"
                    trailing-icon="i-lucide-chevron-up" />
            </div>

            <template #body>
                <div
                    class="w-full h-[85vh] sm:h-auto overflow-y-auto sm:overflow-visible bg-gray-950/90 sm:bg-transparent">
                    <div class="max-w-7xl mx-auto p-4 sm:p-6 lg:p-8">
                        <div class="grid grid-cols-1 lg:grid-cols-12 grid-rows-1 gap-6 lg:gap-8 h-full">

                            <!-- LEFT COLUMN: Main Controls -->
                            <div
                                class="lg:col-span-7 xl:col-span-8 flex flex-col gap-6 h-full lg:overflow-y-auto custom-scrollbar pr-1">

                                <!-- NOW PLAYING CARD -->
                                <div
                                    class="relative overflow-hidden rounded-2xl bg-gradient-to-br from-gray-900 to-gray-950 border border-white/10 p-6 shadow-2xl">
                                    <!-- Background Glow -->
                                    <div
                                        class="absolute top-0 right-0 w-64 h-64 bg-primary-500/10 blur-[100px] rounded-full pointer-events-none -translate-y-1/2 translate-x-1/2">
                                    </div>

                                    <div
                                        class="relative z-10 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 mb-6">
                                        <div class="min-w-0 flex-1">
                                            <Transition name="fade" mode="out-in">
                                                <div v-if="player.transitionState.active"
                                                    class="flex items-center gap-2 text-primary-400 mb-1">
                                                    <span class="relative flex h-2 w-2">
                                                        <span
                                                            class="animate-ping absolute inline-flex h-full w-full rounded-full bg-primary-400 opacity-75"></span>
                                                        <span
                                                            class="relative inline-flex rounded-full h-2 w-2 bg-primary-500"></span>
                                                    </span>
                                                    <span class="text-[10px] uppercase tracking-widest font-bold">Mixing
                                                        from {{ player.transitionState.fromName }}</span>
                                                </div>
                                                <div v-else class="flex items-center gap-2 text-gray-500 mb-1">
                                                    <span class="w-1.5 h-1.5 rounded-full bg-green-500"></span>
                                                    <span class="text-[10px] uppercase tracking-widest font-bold">Now
                                                        Playing</span>
                                                </div>
                                            </Transition>

                                            <h2 class="text-2xl sm:text-3xl font-bold text-white truncate tracking-tight"
                                                :title="player.trackList[player.currentTrack.index]?.name">
                                                {{ player.currentTrack.index !== -1 &&
                                                    player.trackList[player.currentTrack.index] ?
                                                    player.trackList[player.currentTrack.index].name.replace(/\.[^/.]+$/,
                                                        "") : 'No Track Selected' }}
                                            </h2>
                                        </div>

                                        <div class="flex flex-wrap gap-2">
                                            <div
                                                class="px-3 py-1 rounded-full bg-white/5 border border-white/10 text-xs font-mono text-gray-300 flex items-center gap-1.5">
                                                <UIcon name="i-heroicons-musical-note" class="w-3 h-3 text-gray-500" />
                                                {{ currentTrack.bpm }} BPM
                                            </div>
                                            <div class="px-3 py-1 rounded-full bg-white/5 border border-white/10 text-xs font-mono flex items-center gap-1.5"
                                                :class="currentTrack.duration > 0 ? 'text-primary-400 border-primary-500/20 bg-primary-500/5' : 'text-gray-300'">
                                                <UIcon name="i-heroicons-clock" class="w-3 h-3"
                                                    :class="currentTrack.duration > 0 ? 'text-primary-500' : 'text-gray-500'" />
                                                {{ formatTime(currentTrack.duration) }}
                                            </div>
                                        </div>
                                    </div>

                                    <!-- WAVEFORM & SEEK -->
                                    <div class="bg-black/40 rounded-xl border border-white/5 p-4 mb-6 relative group">
                                        <div class="flex justify-between items-center mb-3">
                                            <span
                                                class="text-[10px] uppercase tracking-wider font-bold text-gray-500 flex items-center gap-1.5">
                                                <UIcon name="i-heroicons-chart-bar" class="w-3 h-3" />
                                                Analysis
                                            </span>

                                            <!-- Stats Popover -->
                                            <UPopover
                                                :ui="{ content: 'w-64 bg-gray-900 border border-white/10 p-0 overflow-hidden rounded-lg shadow-xl' }">
                                                <button
                                                    class="text-[10px] font-bold text-gray-500 hover:text-white transition-colors flex items-center gap-1">
                                                    VIEW STATS
                                                    <UIcon name="i-heroicons-chevron-down" class="w-3 h-3" />
                                                </button>
                                                <template #content>
                                                    <div class="p-3 bg-gray-950">
                                                        <div
                                                            class="grid grid-cols-2 gap-x-4 gap-y-2 text-[10px] font-mono">
                                                            <div class="text-gray-500">VIBE</div>
                                                            <div class="text-right text-white font-bold">{{
                                                                player.currentTrack.vibe?.name || '--' }}</div>

                                                            <div class="text-gray-500">ENERGY</div>
                                                            <div class="text-right text-primary-400 font-bold">{{
                                                                player.currentTrack.vibe?.intensity?.toFixed(2) ||
                                                                '0.00' }}</div>

                                                            <div class="col-span-2 h-px bg-white/10 my-1"></div>

                                                            <div class="text-gray-500">BASS ENERGY</div>
                                                            <div class="text-right text-yellow-500 font-bold">{{
                                                                player.getLowEnergy().toFixed(0) }}</div>
                                                        </div>
                                                    </div>
                                                </template>
                                            </UPopover>
                                        </div>

                                        <div
                                            class="h-28 w-full relative flex items-center justify-center rounded-lg overflow-hidden bg-gray-900/50 mb-4 ring-1 ring-white/5">
                                            <Waveform
                                                class="opacity-80 group-hover:opacity-100 transition-opacity duration-500" />
                                        </div>

                                        <div class="relative h-4 group/seek">
                                            <URange v-if="player.currentTrack.duration > 0" v-model="seekProgress"
                                                :min="0" :max="100" :step="0.1" size="xs" color="primary" :ui="{
                                                    base: 'cursor-pointer',
                                                    track: { base: 'h-1.5 group-hover/seek:h-2 transition-all bg-gray-700' },
                                                    thumb: { base: 'w-3 h-3 group-hover/seek:w-4 group-hover/seek:h-4 transition-all' }
                                                }" />
                                            <UProgress v-else :value="0" size="xs" color="gray" class="h-1.5" />
                                        </div>
                                    </div>

                                    <!-- VOLUME & EQ -->
                                    <div
                                        class="flex items-center gap-4 bg-black/20 rounded-lg p-3 border border-white/5">
                                        <div class="flex items-center gap-3 flex-1">
                                            <button @click="volume === 0 ? volume = 0.5 : volume = 0"
                                                class="text-gray-400 hover:text-white transition-colors">
                                                <UIcon
                                                    :name="volume === 0 ? 'i-heroicons-speaker-x-mark' : 'i-heroicons-speaker-wave'"
                                                    class="w-5 h-5" />
                                            </button>
                                            <USlider :min="0" :max="1" :step="0.01" v-model="volume" size="sm"
                                                color="white" class="flex-1" />
                                        </div>

                                        <div class="h-6 w-px bg-white/10 mx-1"></div>

                                        <UPopover
                                            :ui="{ content: 'w-auto bg-gray-900 border border-white/10 rounded-xl shadow-2xl p-0' }">
                                            <UButton label="EQ" color="neutral" variant="ghost" size="xs"
                                                class="font-mono font-bold"
                                                trailing-icon="i-heroicons-adjustments-vertical" />
                                            <template #content>
                                                <div class="p-5 flex gap-4 bg-gray-950/95 backdrop-blur rounded-xl">
                                                    <div v-for="(freq, index) in [60, 400, 2400, 15000]" :key="freq"
                                                        class="flex flex-col items-center gap-2 group">
                                                        <div
                                                            class="h-32 flex items-center justify-center bg-gray-900/50 rounded-full p-1 ring-1 ring-white/5 group-hover:ring-primary-500/30 transition-all">
                                                            <USlider orientation="vertical" :min="-12" :max="12"
                                                                :step="0.1"
                                                                :model-value="player.eqNodes[[0, 2, 4, 6][index]]?.gain.value || 0"
                                                                @update:model-value="(val) => player.setEqGain([0, 2, 4, 6][index], val)"
                                                                size="xs" color="primary"
                                                                :ui="{ track: { background: 'bg-gray-800' } }" />
                                                        </div>
                                                        <div class="text-center">
                                                            <div
                                                                class="text-[9px] uppercase font-bold text-gray-500 mb-0.5">
                                                                {{ ['Bass', 'Lo-Mid', 'Hi-Mid', 'Air'][index] }}</div>
                                                            <div class="text-[9px] text-gray-600 font-mono">{{ freq >=
                                                                1000 ? (freq / 1000) + 'k' : freq }}Hz</div>
                                                        </div>
                                                    </div>
                                                </div>
                                            </template>
                                        </UPopover>
                                    </div>
                                </div>

                                <!-- SECONDARY CONTROLS GRID -->
                                <div class="grid grid-cols-1 sm:grid-cols-2 gap-4">

                                    <!-- AUTOMIX SETTINGS -->
                                    <div
                                        class="bg-gray-900/60 border border-white/5 rounded-xl p-5 hover:border-white/10 transition-colors">
                                        <div class="flex items-center gap-2 mb-4 text-gray-400">
                                            <UIcon name="i-heroicons-arrow-path-rounded-square" class="w-4 h-4" />
                                            <span class="text-xs uppercase tracking-widest font-bold">Automix</span>
                                        </div>
                                        <div class="grid grid-cols-2 gap-4">
                                            <UFormField label="Fade In (s)"
                                                :ui="{ label: 'text-[10px] uppercase font-bold text-gray-500' }">
                                                <UInputNumber v-model="player.fadeDuration" size="sm" :min="0" :max="30"
                                                    class="font-mono" />
                                            </UFormField>
                                            <UFormField label="Fade Out (s)"
                                                :ui="{ label: 'text-[10px] uppercase font-bold text-gray-500' }">
                                                <UInputNumber v-model="player.fadeOutDuration" size="sm" :min="0"
                                                    :max="30" class="font-mono" />
                                            </UFormField>
                                        </div>
                                    </div>

                                    <!-- VISUALS SETTINGS -->
                                    <div
                                        class="bg-gray-900/60 border border-white/5 rounded-xl p-5 hover:border-white/10 transition-colors">
                                        <div class="flex justify-between items-center mb-4">
                                            <div class="flex items-center gap-2 text-gray-400">
                                                <UIcon name="i-heroicons-eye" class="w-4 h-4" />
                                                <span class="text-xs uppercase tracking-widest font-bold">Visuals</span>
                                            </div>
                                            <div class="flex items-center gap-2">
                                                <span
                                                    class="text-[9px] font-bold text-primary-500/80 uppercase">Auto-Vibe</span>
                                                <USwitch v-model="player.isVibeAuto" color="primary" size="xs" />
                                            </div>
                                        </div>

                                        <div class="space-y-4">
                                            <div class="grid grid-cols-2 gap-3">
                                                <div class="space-y-1">
                                                    <label
                                                        class="text-[9px] uppercase font-bold text-gray-500">Speed</label>
                                                    <USlider :min="0" :max="2" :step="0.1"
                                                        v-model="uniforms.u_speed.value" size="xs" color="gray" />
                                                </div>
                                                <div class="space-y-1">
                                                    <label
                                                        class="text-[9px] uppercase font-bold text-gray-500">Density</label>
                                                    <USlider :min="50" :max="500" :step="10"
                                                        v-model="uniforms.u_partical_size.value" size="xs"
                                                        color="gray" />
                                                </div>
                                            </div>

                                            <div class="flex items-center justify-between pt-2 border-t border-white/5">
                                                <div class="flex items-center gap-2">
                                                    <USwitch v-model="player.isFlashEnabled" color="primary"
                                                        size="xs" />
                                                    <span class="text-[10px] font-bold text-gray-500 uppercase">Flash
                                                        FX</span>
                                                </div>

                                                <UPopover>
                                                    <button
                                                        class="flex items-center gap-2 px-2 py-1 rounded hover:bg-white/5 transition-colors">
                                                        <span
                                                            class="text-[10px] font-bold text-gray-400 uppercase">Theme</span>
                                                        <div class="flex -space-x-1.5">
                                                            <span :style="primaryChip"
                                                                class="size-2.5 rounded-full ring-2 ring-gray-900 shadow-sm" />
                                                            <span :style="secondaryChip"
                                                                class="size-2.5 rounded-full ring-2 ring-gray-900 shadow-sm" />
                                                        </div>
                                                    </button>
                                                    <template #content>
                                                        <div
                                                            class="flex gap-3 p-3 bg-gray-950 border border-white/10 rounded-xl">
                                                            <div class="text-center space-y-1">
                                                                <div
                                                                    class="text-[8px] uppercase text-gray-500 font-bold">
                                                                    Primary</div>
                                                                <UColorPicker v-model="uniforms.u_color_a.value"
                                                                    class="p-0" />
                                                            </div>
                                                            <div class="text-center space-y-1">
                                                                <div
                                                                    class="text-[8px] uppercase text-gray-500 font-bold">
                                                                    Secondary</div>
                                                                <UColorPicker v-model="uniforms.u_color_b.value"
                                                                    class="p-0" />
                                                            </div>
                                                        </div>
                                                    </template>
                                                </UPopover>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            </div>

                            <!-- RIGHT COLUMN: Queue & Playlist -->
                            <div
                                class="lg:col-span-5 xl:col-span-4 flex flex-col h-[500px] lg:h-0 lg:min-h-full bg-gray-900/40 border border-white/5 rounded-2xl overflow-hidden backdrop-blur-sm">

                                <!-- Queue Header -->
                                <div
                                    class="p-4 border-b border-white/5 bg-gray-900/50 flex justify-between items-center">
                                    <div class="flex items-center gap-2">
                                        <UIcon name="i-heroicons-queue-list" class="w-4 h-4 text-primary-400" />
                                        <span class="font-bold text-sm text-white">QUEUE</span>
                                        <UBadge color="neutral" variant="soft" size="xs" class="font-mono ml-1">{{
                                            player.trackList.length }}
                                        </UBadge>
                                    </div>
                                    <UButton icon="i-heroicons-trash" color="neutral" variant="ghost" size="xs"
                                        v-if="player.trackList.length > 0" @click="player.clearQueue()" />
                                </div>

                                <!-- Track List -->
                                <div class="flex-1 overflow-y-auto custom-scrollbar p-2 space-y-1 relative">

                                    <!-- Empty State -->
                                    <div v-if="player.trackList.length === 0"
                                        class="absolute inset-0 flex flex-col items-center justify-center text-gray-600 p-6 text-center border-2 border-dashed border-gray-800 m-4 rounded-xl">
                                        <UIcon name="i-heroicons-musical-note" class="text-4xl mb-3 text-gray-800" />
                                        <span class="text-sm font-medium text-gray-500">Your queue is empty</span>
                                        <span class="text-xs text-gray-600 mt-1">Upload tracks below to start the
                                            party</span>
                                    </div>

                                    <!-- Tracks -->
                                    <div v-for="(file, index) in player.trackList" :key="file.name + index"
                                        draggable="true" @dragstart="onDragStart($event, index)"
                                        @drop="onDrop($event, index)" @dragover.prevent @click="onTrackClick(index)"
                                        class="group relative flex items-center gap-3 p-2.5 rounded-lg cursor-pointer select-none transition-all border border-transparent"
                                        :class="[
                                            player.currentTrack.index === index
                                                ? 'bg-primary-500/10 border-primary-500/20 shadow-[0_0_20px_rgba(var(--color-primary-500),0.05)]'
                                                : 'hover:bg-white/5 hover:border-white/5'
                                        ]">

                                        <!-- Index / Status -->
                                        <div
                                            class="w-8 flex justify-center items-center text-gray-500 font-mono text-xs">
                                            <div v-if="player.currentTrack.index === index"
                                                class="flex items-end gap-[2px] h-3">
                                                <div
                                                    class="w-0.5 bg-primary-400 animate-[audio-eq_0.6s_ease-in-out_infinite] h-full">
                                                </div>
                                                <div
                                                    class="w-0.5 bg-primary-400 animate-[audio-eq_0.8s_ease-in-out_infinite_0.1s] h-full">
                                                </div>
                                                <div
                                                    class="w-0.5 bg-primary-400 animate-[audio-eq_0.5s_ease-in-out_infinite_0.2s] h-full">
                                                </div>
                                            </div>
                                            <span v-else class="group-hover:hidden">{{ index + 1 }}</span>
                                            <UIcon name="i-heroicons-play-solid"
                                                class="hidden group-hover:block w-3 h-3 text-white"
                                                v-if="player.currentTrack.index !== index" />
                                        </div>

                                        <!-- Info -->
                                        <div class="flex-1 min-w-0">
                                            <div class="flex justify-between items-start">
                                                <p class="truncate text-sm font-medium mb-0.5"
                                                    :class="player.currentTrack.index === index ? 'text-primary-100' : 'text-gray-300'">
                                                    {{ file.name.replace(/\.[^/.]+$/, "") }}
                                                </p>
                                            </div>

                                            <div class="flex items-center gap-2">
                                                <UBadge v-if="index === player.currentTrack.index + 1" color="primary"
                                                    variant="solid" size="xs"
                                                    class="text-[8px] px-1 py-0 h-3.5 leading-none">NEXT</UBadge>

                                                <div class="flex gap-2 text-[9px] items-center text-gray-500 font-mono"
                                                    v-if="player.audioBuffers[index]?.vibe">
                                                    <span>{{ player.audioBuffers[index].bpm }} BPM</span>
                                                    <span class="w-0.5 h-0.5 rounded-full bg-gray-600"></span>
                                                    <span class="font-bold tracking-wider"
                                                        :style="{ color: player.audioBuffers[index].vibe.colorA }">
                                                        {{ player.audioBuffers[index].vibe.name.toUpperCase() }}
                                                    </span>
                                                </div>
                                                <div v-else class="h-2 w-16 bg-white/5 rounded animate-pulse"></div>
                                            </div>
                                        </div>

                                        <!-- Duration & Delete -->
                                        <div class="flex items-center gap-2">
                                            <div class="text-xs font-mono text-gray-600 group-hover:text-gray-400">
                                                <span v-if="player.audioBuffers[index]">{{
                                                    formatTime(player.audioBuffers[index].buffer.duration)
                                                }}</span>
                                                <UIcon v-else name="i-lucide-loader-2" class="animate-spin w-3 h-3" />
                                            </div>
                                            <UButton icon="i-heroicons-x-mark" color="red" variant="ghost" size="2xs"
                                                class="opacity-0 group-hover:opacity-100 transition-opacity"
                                                @click.stop="player.removeTrack(index)" />
                                        </div>
                                    </div>
                                </div>

                                <!-- Playback Actions -->
                                <div class="p-4 bg-gray-900/80 border-t border-white/5 flex gap-2">
                                    <UButton @click="player.startPlayer()" :disabled="player.trackList.length == 0"
                                        :label="player.isPlaying ? 'Restart' : 'Start Playback'"
                                        :icon="player.isPlaying ? 'i-heroicons-arrow-path' : 'i-heroicons-play-20-solid'"
                                        color="primary" variant="solid" size="md" block
                                        class="flex-1 font-bold shadow-lg shadow-primary-500/20" />
                                    <UButton @click="player.pausePlayer()" icon="i-heroicons-pause-20-solid"
                                        color="neutral" variant="soft" size="md" />
                                    <UButton @click="player.stop()" icon="i-heroicons-stop-20-solid" color="neutral"
                                        variant="soft" size="md" />
                                </div>

                                <!-- Upload Area -->
                                <div class="p-3 bg-gray-950 border-t border-white/5 space-y-3">

                                    <!-- URL Input (YouTube & SoundCloud) -->
                                    <div class="flex gap-2">
                                        <UInput v-model="streamUrl" placeholder="Paste YouTube or SoundCloud URL..."
                                            size="xs" color="gray" variant="outline"
                                            class="flex-1 font-mono text-[10px]"
                                            :ui="{ icon: { trailing: { pointer: '' } } }" @keyup.enter="addStreamTrack">
                                            <template #trailing>
                                                <UButton v-if="streamUrl" :loading="isDownloading"
                                                    @click="addStreamTrack" color="primary" variant="ghost" size="2xs"
                                                    icon="i-heroicons-arrow-right-20-solid" />
                                            </template>
                                        </UInput>
                                    </div>

                                    <div class="relative group">
                                        <label
                                            class="flex flex-col items-center justify-center w-full h-12 border border-gray-800 border-dashed rounded-lg cursor-pointer bg-gray-900/30 hover:bg-gray-800 hover:border-gray-600 transition-all">
                                            <div
                                                class="flex items-center gap-2 text-gray-500 group-hover:text-gray-300">
                                                <UIcon name="i-heroicons-arrow-up-tray" class="w-4 h-4" />
                                                <span class="text-[10px] font-medium uppercase tracking-wider">Drop /
                                                    Click to Upload</span>
                                            </div>
                                            <input type="file" class="hidden" multiple accept="audio/*"
                                                @change="onNativeFileChange" />
                                        </label>

                                        <!-- Progress Overlay -->
                                        <Transition name="fade">
                                            <div v-if="player.processingState.isProcessing"
                                                class="absolute inset-0 bg-gray-900 rounded-lg flex items-center justify-between px-4 z-10 border border-primary-500/30">
                                                <div class="flex items-center gap-3">
                                                    <UIcon name="i-lucide-loader-2"
                                                        class="w-4 h-4 text-primary-400 animate-spin" />
                                                    <div class="flex flex-col">
                                                        <span
                                                            class="text-[10px] font-bold text-primary-400 uppercase tracking-wide">Analyzing
                                                            Vibes</span>
                                                        <span class="text-[9px] text-gray-500 font-mono">{{
                                                            player.processingState.current }} / {{
                                                                player.processingState.total }} tracks</span>
                                                    </div>
                                                </div>
                                                <div class="w-20">
                                                    <UProgress
                                                        :value="(player.processingState.current / player.processingState.total) * 100"
                                                        size="xs" color="primary" />
                                                </div>
                                            </div>
                                        </Transition>
                                    </div>
                                </div>
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
const streamUrl = ref('');
const isDownloading = ref(false);

watch(volume, (newVolume) => {
    player.setAudioVolume(newVolume);
});

const primaryChip = computed(() => ({ backgroundColor: uniforms.value.u_color_a.value }))
const secondaryChip = computed(() => ({ backgroundColor: uniforms.value.u_color_b.value }))

async function addStreamTrack() {
    if (!streamUrl.value) return;

    // Detect platform
    const isSoundCloud = streamUrl.value.includes('soundcloud.com');
    const isYouTube = streamUrl.value.includes('youtube.com') || streamUrl.value.includes('youtu.be');

    if (!isSoundCloud && !isYouTube) {
        toast.add({
            title: 'Invalid URL',
            description: 'Please paste a YouTube or SoundCloud URL',
            icon: 'i-heroicons-exclamation-triangle',
            color: 'red'
        });
        return;
    }

    isDownloading.value = true;
    const platform = isSoundCloud ? 'SoundCloud' : 'YouTube';
    const apiEndpoint = isSoundCloud ? '/api/soundcloud' : '/api/youtube';
    const toastId = 'stream-download';

    toast.add({
        id: toastId,
        title: 'Downloading...',
        description: `Fetching audio from ${platform}`,
        icon: 'i-lucide-loader-2',
        color: 'primary',
        timeout: 0
    })

    try {
        const response = await fetch(`${apiEndpoint}?url=${encodeURIComponent(streamUrl.value)}`);
        if (!response.ok) {
            const errorData = await response.json().catch(() => ({}));
            throw new Error(errorData.statusMessage || response.statusText || 'Failed to fetch');
        }

        // Try to get filename from header
        const disposition = response.headers.get('Content-Disposition');
        let filename = `${platform} Track.mp3`;
        if (disposition && disposition.indexOf('filename=') !== -1) {
            const match = /filename="?([^"]+)"?/.exec(disposition);
            if (match && match[1]) {
                filename = decodeURIComponent(match[1]);
            }
        }

        const blob = await response.blob();
        const file = new File([blob], filename, { type: blob.type || 'audio/mpeg' });

        // Add to player
        await player.addTracks([file]);

        streamUrl.value = '';
        toast.remove(toastId);
        toast.add({
            title: 'Success',
            description: `${platform} track added to queue`,
            icon: 'i-heroicons-check',
            color: 'green'
        });

    } catch (e: any) {
        toast.remove(toastId);
        toast.add({
            title: 'Error',
            description: e.message || `Could not load ${platform} track`,
            icon: 'i-heroicons-exclamation-triangle',
            color: 'red'
        });
    } finally {
        isDownloading.value = false;
    }
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
        player.addTracks(files);
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


<style scoped>
@keyframes audio-eq {

    0%,
    100% {
        height: 20%;
        opacity: 0.5;
    }

    50% {
        height: 100%;
        opacity: 1;
    }
}

.fade-enter-active,
.fade-leave-active {
    transition: opacity 0.3s ease;
}

.fade-enter-from,
.fade-leave-to {
    opacity: 0;
}

/* Custom Scrollbar for the list */
.custom-scrollbar::-webkit-scrollbar {
    width: 4px;
}

.custom-scrollbar::-webkit-scrollbar-track {
    background: rgba(255, 255, 255, 0.02);
}

.custom-scrollbar::-webkit-scrollbar-thumb {
    background: rgba(255, 255, 255, 0.1);
    border-radius: 4px;
}

.custom-scrollbar::-webkit-scrollbar-thumb:hover {
    background: rgba(255, 255, 255, 0.2);
}
</style>