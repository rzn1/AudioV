// Hosts the two local models behind the AI DJ, so nothing heavy runs on the UI thread:
//   - a small instruction-tuned language model (Qwen2.5-0.5B) that words the announcements
//   - Kokoro-82M, a natural-sounding text-to-speech model
// Both are open models that run entirely in the browser: free, offline after the first download, no usage limits.
import { pipeline, env } from '@huggingface/transformers';
import { KokoroTTS } from 'kokoro-js';
import { idbModelCache } from './idbCache';

env.allowLocalModels = false;
if (typeof caches !== 'undefined') {
    env.useBrowserCache = true; // models are downloaded once and kept in the browser's Cache Storage
} else {
    // Not a secure context (e.g. http://192.168.x.x:3000 from another PC): there is no Cache Storage, so keep the models
    // in IndexedDB instead of failing or re-downloading ~600 MB on every visit.
    env.useBrowserCache = false;
    env.useCustomCache = true;
    env.customCache = idbModelCache;
}

const LLM_ID = 'onnx-community/Qwen2.5-0.5B-Instruct';
const TTS_ID = 'onnx-community/Kokoro-82M-v1.0-ONNX';

let generator: any = null;
let tts: any = null;

// One job at a time: a language model and a speech model competing for the same CPU would both be slow
let queue: Promise<unknown> = Promise.resolve();
const enqueue = <T>(fn: () => Promise<T>) => {
    const run = queue.then(fn, fn);
    queue = run.catch(() => { });
    return run;
};

const post = (msg: any, transfer: Transferable[] = []) => (self as any).postMessage(msg, transfer);

async function loadLlm(progress: (p: any) => void) {
    if (generator) return;
    // CPU (WASM) on purpose. The WebGPU build of this model produced pure gibberish on some GPU stacks (fp16
    // precision), and lines are generated minutes ahead of when they are needed, so speed does not matter here.
    generator = await pipeline('text-generation', LLM_ID, { device: 'wasm', dtype: 'q8', progress_callback: progress });
}

// CPU (WASM) on purpose. A WebGPU build of this voice is ~3x faster but, measured here, starts every clip with a burst
// of samples up to +-62000 (a loud click) and has a different level, and WebGPU only exists on https/localhost anyway.
async function loadTts(progress: (p: any) => void) {
    if (tts) return;
    tts = await KokoroTTS.from_pretrained(TTS_ID, { dtype: 'q8', device: 'wasm', progress_callback: progress });
}

self.onmessage = (e: MessageEvent) => {
    const msg = e.data;

    if (msg.type === 'load') {
        const what: 'llm' | 'tts' = msg.what;
        enqueue(async () => {
            try {
                const progress = (p: any) => post({ type: 'progress', what, ...p });
                if (what === 'llm') await loadLlm(progress);
                else await loadTts(progress);
                post({ type: 'ready', what });
            } catch (err: any) {
                post({ type: 'error', what, error: String(err?.message ?? err) });
            }
        });
    }

    if (msg.type === 'script') {
        enqueue(async () => {
            try {
                if (!generator) throw new Error('language model not loaded');
                // Several candidates in one batched call: cheaper than the same number of separate calls, and the
                // caller keeps the first one that passes validation
                const n = Math.max(1, Math.min(4, msg.n ?? 1));
                const out = await generator(msg.messages, {
                    max_new_tokens: 40, // a line is ~20 tokens; stop rambling early (it would be rejected anyway)
                    do_sample: true,
                    num_return_sequences: n,
                    temperature: 0.6, // 0.9 drifts into inventing things; the answer is validated either way
                    top_p: 0.9
                    // no repetition_penalty: it also penalises tokens from the prompt, which makes the model garble
                    // the song and artist names it is supposed to copy exactly
                });
                const list = (Array.isArray(out) ? out : [out]) as any[];
                const texts: string[] = list.map(o => o?.generated_text?.at?.(-1)?.content ?? '');
                post({ type: 'script', id: msg.id, text: texts[0] ?? '', texts });
            } catch (err: any) {
                post({ type: 'script', id: msg.id, error: String(err?.message ?? err) });
            }
        });
    }

    if (msg.type === 'speak') {
        enqueue(async () => {
            try {
                if (!tts) throw new Error('voice model not loaded');
                const audio = await tts.generate(msg.text, { voice: msg.voice, speed: msg.speed ?? 1 });
                const samples: Float32Array = audio.audio;
                post({ type: 'speech', id: msg.id, samples, sampleRate: audio.sampling_rate }, [samples.buffer]);
            } catch (err: any) {
                post({ type: 'speech', id: msg.id, error: String(err?.message ?? err) });
            }
        });
    }
};
