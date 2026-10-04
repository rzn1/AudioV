import { defineEventHandler } from 'h3';
import { deepgramKey, wordingKey, wordingModel } from '../../utils/cloud';
import { DEEPGRAM_VOICES, DEFAULT_DEEPGRAM_VOICE } from '../../utils/deepgram';

// Tells the client what the cloud engine can do (which keys are configured). The keys themselves never leave the server.
export default defineEventHandler(() => ({
    voice: !!deepgramKey(),          // the cloud voice (Deepgram) can be used
    wording: !!wordingKey(),         // optional: livelier wording through an OpenAI-compatible model
    wordingModel: wordingModel(),
    voices: DEEPGRAM_VOICES,
    defaultVoice: DEFAULT_DEEPGRAM_VOICE
}));
