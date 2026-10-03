// Persists the queue (audio files, analysis results, order) in IndexedDB so a reload does not lose it.
// Every function fails soft: if IndexedDB is unavailable (private mode, blocked storage) the app just does not persist.
import type { AnalysisData } from '../types/types';

/** Bump whenever the analysis (worker / audioAnalysis.ts) changes: saved tracks are then re-analysed on restore. */
export const ANALYSIS_VERSION = 1;

export interface SavedTrack {
    id: string,
    file: File,
    version: number,
    analysis: AnalysisData
}

const DB_NAME = 'audiov';
const TRACKS = 'tracks';
const META = 'meta';

let dbPromise: Promise<IDBDatabase> | null = null;

function openDb(): Promise<IDBDatabase> {
    if (!dbPromise) {
        dbPromise = new Promise((resolve, reject) => {
            const req = indexedDB.open(DB_NAME, 1);
            req.onupgradeneeded = () => {
                req.result.createObjectStore(TRACKS, { keyPath: 'id' });
                req.result.createObjectStore(META);
            };
            req.onsuccess = () => resolve(req.result);
            req.onerror = () => reject(req.error);
        });
    }
    return dbPromise;
}

async function run<T>(stores: string[], mode: IDBTransactionMode, fn: (tx: IDBTransaction) => IDBRequest<T> | void): Promise<T | undefined> {
    try {
        const db = await openDb();
        return await new Promise<T | undefined>((resolve, reject) => {
            const tx = db.transaction(stores, mode);
            const req = fn(tx);
            tx.oncomplete = () => resolve(req ? req.result : undefined);
            tx.onerror = () => reject(tx.error);
            tx.onabort = () => reject(tx.error);
        });
    } catch (e) {
        console.warn('[trackStore] persistence unavailable:', e);
        return undefined;
    }
}

export const newTrackId = () => Math.random().toString(36).slice(2) + Date.now().toString(36);

/** Saved tracks in queue order. */
export async function loadSaved(): Promise<SavedTrack[]> {
    const all = (await run<SavedTrack[]>([TRACKS], 'readonly', tx => tx.objectStore(TRACKS).getAll())) ?? [];
    const order = (await run<string[]>([META], 'readonly', tx => tx.objectStore(META).get('order'))) ?? [];
    const rank = (id: string) => { const i = order.indexOf(id); return i === -1 ? Number.MAX_SAFE_INTEGER : i; };
    return all.sort((a, b) => rank(a.id) - rank(b.id));
}

export async function saveTrack(rec: SavedTrack) {
    await run([TRACKS], 'readwrite', tx => { tx.objectStore(TRACKS).put(rec); });
}

export async function deleteTrack(id: string) {
    await run([TRACKS], 'readwrite', tx => { tx.objectStore(TRACKS).delete(id); });
}

export async function saveOrder(ids: string[]) {
    await run([META], 'readwrite', tx => { tx.objectStore(META).put([...ids], 'order'); });
}

export async function clearAll() {
    await run([TRACKS, META], 'readwrite', tx => {
        tx.objectStore(TRACKS).clear();
        tx.objectStore(META).clear();
    });
}
