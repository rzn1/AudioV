// Deepgram Aura-2 text-to-speech (pure helpers: no network, unit-testable). Official API with $200 of free credit that
// does not expire and needs no card; one announcement is ~100 characters, i.e. a fraction of a cent.

export const DEEPGRAM_VOICES = [
    { value: 'aura-2-aries-en', label: 'Aries (warm, male)' },
    { value: 'aura-2-cora-en', label: 'Cora (smooth, female)' },
    { value: 'aura-2-minerva-en', label: 'Minerva (friendly, female)' },
    { value: 'aura-2-vesta-en', label: 'Vesta (expressive, female)' },
    { value: 'aura-2-pluto-en', label: 'Pluto (calm baritone, male)' },
    { value: 'aura-2-draco-en', label: 'Draco (British baritone, male)' },
    { value: 'aura-2-thalia-en', label: 'Thalia (clear, female)' }
];

export const DEFAULT_DEEPGRAM_VOICE = 'aura-2-aries-en';

/** Plain WAV output (16-bit PCM, 24 kHz), which the browser decodes directly. */
export function buildDeepgramTts(base: string, voice: string, text: string) {
    const model = DEEPGRAM_VOICES.some(v => v.value === voice) ? voice : DEFAULT_DEEPGRAM_VOICE;
    return {
        url: `${base}/v1/speak?model=${encodeURIComponent(model)}&encoding=linear16&container=wav&sample_rate=24000`,
        body: { text }
    };
}

export const deepgramHeaders = (key: string) => ({ authorization: `Token ${key}` });
