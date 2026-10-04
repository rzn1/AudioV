// Model cache for transformers.js that works on plain http://.
//
// transformers.js normally keeps downloaded models in the browser's Cache Storage, but `caches` only exists in a secure
// context (https or localhost). Opening the dev server from another PC (http://192.168.x.x:3000) is not one, and the
// library then refuses to start ("Browser cache is not available in this environment"). IndexedDB is available there,
// and it stores Blobs on disk, so even the ~490 MB language model does not have to live in memory.
//
// Implements the two methods of the Web Cache API that transformers.js uses: `match` and `put`.

const DB_NAME = 'audiov-models';
const STORE = 'files';

let dbPromise: Promise<IDBDatabase> | null = null;

function openDb(): Promise<IDBDatabase> {
    if (!dbPromise) {
        dbPromise = new Promise((resolve, reject) => {
            const req = indexedDB.open(DB_NAME, 1);
            req.onupgradeneeded = () => req.result.createObjectStore(STORE);
            req.onsuccess = () => resolve(req.result);
            req.onerror = () => reject(req.error);
        });
    }
    return dbPromise;
}

const keyOf = (r: RequestInfo | URL) => (typeof r === 'string' ? r : r instanceof URL ? r.href : (r as Request).url);

interface Stored {
    blob: Blob,
    headers: [string, string][]
}

export const idbModelCache = {
    async match(request: RequestInfo | URL): Promise<Response | undefined> {
        try {
            const db = await openDb();
            const stored = await new Promise<Stored | undefined>((resolve, reject) => {
                const req = db.transaction(STORE, 'readonly').objectStore(STORE).get(keyOf(request));
                req.onsuccess = () => resolve(req.result);
                req.onerror = () => reject(req.error);
            });
            return stored ? new Response(stored.blob, { headers: stored.headers }) : undefined;
        } catch (e) {
            console.warn('[dj] model cache unavailable, downloading instead', e);
            return undefined;
        }
    },

    async put(request: RequestInfo | URL, response: Response): Promise<void> {
        const blob = await response.blob();
        const headers = [...response.headers.entries()];
        const db = await openDb();
        await new Promise<void>((resolve, reject) => {
            const tx = db.transaction(STORE, 'readwrite');
            tx.objectStore(STORE).put({ blob, headers } satisfies Stored, keyOf(request));
            tx.oncomplete = () => resolve();
            tx.onerror = () => reject(tx.error);
            tx.onabort = () => reject(tx.error);
        });
    }
};
