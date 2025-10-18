<template>
    <div class="absolute inset-0 h-fit z-10 p-5">
        <UDrawer handle-only title="Player controller" description="Lorem ipsum dolor sit amet, consectetur adipiscing elit." inset>
            <UButton label="Open" color="neutral" variant="subtle" trailing-icon="i-lucide-chevron-up" />

            <template #body>
                <div class="w-1/2">
                    <div class="grid grid-cols-2 gap-10">
                        <div>
                            <div class="space-x-2">
                                <UBadge color="success" variant="soft">Start time: {{ currentTrack.startPoint }}
                                </UBadge>
                                <UBadge color="error" variant="soft">End time: {{ currentTrack.endPoint }}
                                </UBadge>
                                <UBadge color="warning" variant="soft">BPM: {{ currentTrack.bpm }}</UBadge>
                            </div>
                            <p>Current time: {{ player.currentTime.toFixed(1) }}</p>
                            <p>Progress: {{ (trackProgress).toFixed(4) }}</p>
                            <p>Tracks: {{ player.trackList.length }}</p>

                            <UFormField label="Adjust volume">
                                <USlider :min="0" :max="1" :step="0.01" v-model="volume" />
                            </UFormField>
                        </div>

                        <div>
                            <p class="font-bold text-md mb-3">Mixer settings</p>

                            <UFormField label="Fade in (sec)" name="email">
                                <UInputNumber v-model="player.fadeDuration" />
                            </UFormField>

                            <UFormField label="Fade out (sec)" name="email">
                                <UInputNumber v-model="player.fadeOutDuration" />
                            </UFormField>
                        </div>

                        <div>
                            <p class="font-bold text-md mb-3">Upload tracks</p>

                            <UForm class="space-y-4 w-96" @submit="onSubmit">
                                <UFormField>
                                    <UFileUpload v-model="trackList" accept="audio/mp3" position="inside" layout="list"
                                        multiple label="Drop your tracks here" description="MP3" color="success"
                                        highlight :ui="{ base: 'max-h-48', files: 'overflow-y-auto' }" />
                                </UFormField>

                                <div class="flex gap-1">
                                    <UButton :loading="uploadState" type="submit" label="Upload tracklist"
                                        color="success" />
                                    <UButton @click="player.startPlayer()" :disabled="player.trackList.length == 0"
                                        label="Start Player" color="primary" />
                                    <UButton type="submit" label="Reset tracklist" color="error" />
                                    <UButton @click="player.pausePlayer()" icon="i-lucide-search" size="md"
                                        color="primary" variant="solid" />
                                </div>
                            </UForm>
                        </div>

                        <div>
                            <p class="font-bold text-md mb-3">Sphere settings</p>

                            <div class="space-y-3">
                                <UFormField label="Sphere speed">
                                    <USlider :min="0" :max="2" :step="0.1" v-model="uniforms.u_speed.value" />
                                </UFormField>

                                <UFormField label="Particle size">
                                    <USlider :min="5" :max="300" :step="1" v-model="uniforms.u_partical_size.value" />
                                </UFormField>

                                <UPopover>
                                    <UButton label="Sphere colors" color="neutral" variant="outline">
                                        <template #leading>
                                            <span :style="primaryChip" class="size-3 rounded-full" />
                                            <span :style="secondaryChip" class="size-3 rounded-full" />
                                        </template>
                                    </UButton>

                                    <template #content>
                                        <div class="flex gap-3">
                                            <UColorPicker v-model="uniforms.u_color_a.value" class="p-2" />
                                            <UColorPicker v-model="uniforms.u_color_b.value" class="p-2" />
                                        </div>
                                    </template>
                                </UPopover>
                            </div>
                        </div>
                    </div>

                    <div>
                        <div class="h-19">
                            <Waveform />
                        </div>
                        <UProgress v-model="trackProgress" status :max="1" size="sm" />
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
const trackProgress = computed(() => player.getProgress());
const trackList = ref<File[]>([]);
const uploadState = ref(false);
const volume = ref(player.audioVolume);

watch(volume, (newVolume) => {
    player.setAudioVolume(newVolume);
});

const primaryChip = computed(() => ({ backgroundColor: uniforms.value.u_color_a.value }))
const secondaryChip = computed(() => ({ backgroundColor: uniforms.value.u_color_b.value }))

async function onSubmit() {
    uploadState.value = true;
    await player.initTracks(trackList.value);
    uploadState.value = false;

    toast.add({
        title: 'Tracks Updated',
        description: `Selected tracks were successfully uploaded.`,
        icon: 'i-lucide-calendar-days'
    })
}
</script>

<style scoped></style>