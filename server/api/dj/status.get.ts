import { defineEventHandler } from 'h3';
import { deepgramKey, wordingKey, wordingModel } from '../../utils/cloud';
import { DEEPGRAM_VOICES, DEFAULT_DEEPGRAM_VOICE } from '../../utils/deepgram';
import { accessMode, isAuthorized, importEnabled } from '../../utils/access';

// Tells the client what the cloud engine can do. The keys themselves never leave the server. If the client sends its
// access code (x-dj-code) the answer also says whether it is accepted, so the UI can ask for it.
export default defineEventHandler((event) => ({
    voice: !!deepgramKey(),          // the cloud voice (Deepgram) is configured
    wording: !!wordingKey(),         // optional: livelier wording through an OpenAI-compatible model
    wordingModel: wordingModel(),
    voices: DEEPGRAM_VOICES,
    defaultVoice: DEFAULT_DEEPGRAM_VOICE,
    access: accessMode(),            // 'open' (local) | 'code' (a code is required) | 'locked' (production without a code)
    authorized: isAuthorized(event),
    importEnabled: importEnabled()   // the YouTube / SoundCloud downloaders are available
}));
