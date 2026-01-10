import MusicTempo from 'music-tempo';

self.onmessage = (e) => {
    const { id, channelData, sampleRate } = e.data;

    try {
        // 1. BPM Detection
        // music-tempo expects one channel info
        // We assume channelData is Float32Array
        let bpm = 0;
        try {
            // MusicTempo might need a regular array or Float32Array, usually checks constructor
            // It seems to expect an array-like. 
            // We'll pass it directly.
            const mt = new MusicTempo(channelData);
            bpm = parseFloat(mt.tempo);
        } catch (err) {
            console.error("Worker BPM Error:", err);
        }

        // 2. RMS Calculation
        const rmsValues = getRMSCurve(channelData);
        const avgEnergy = rmsValues.reduce((a, b) => a + b, 0) / (rmsValues.length || 1);

        // 3. Brightness (Zero Crossing Rate) represents higher frequencies
        const brightness = getZeroCrossingRate(channelData);

        // 4. Find Points (Simple threshold logic)
        // We can duplicate the logic here to save main thread
        const { startPoint, endPoint } = findPoints(rmsValues, sampleRate, channelData.length);

        self.postMessage({
            id,
            success: true,
            bpm: Math.round(bpm),
            rmsValues,
            energy: avgEnergy,
            brightness: brightness,
            startPoint,
            endPoint
        });
    } catch (error) {
        self.postMessage({ id, success: false, error: error.message });
    }
};

function getRMSCurve(channelData: Float32Array, hopSize = 2048): number[] {
    const frameSize = 1024;
    const rmsValues: number[] = [];
    const dataLength = channelData.length;

    for (let i = 0; i < dataLength; i += hopSize) {
        const end = Math.min(i + frameSize, dataLength);
        let sum = 0;
        let count = 0;
        for (let j = i; j < end; j++) {
            const val = channelData[j];
            sum += val * val;
            count++;
        }
        rmsValues.push(count > 0 ? Math.sqrt(sum / count) : 0);
    }
    return rmsValues;
}

function getZeroCrossingRate(channelData: Float32Array): number {
    let crossings = 0;
    const len = channelData.length;
    // Inspect every Nth sample to save time, or full? Full is fine for 10MB iteration in a worker.
    // It's fast.
    for (let i = 1; i < len; i++) {
        if (channelData[i] * channelData[i - 1] < 0) {
            crossings++;
        }
    }
    return crossings / len;
}

function findPoints(rmsValues: number[], sampleRate: number, totalSamples: number) {
    const threshold = 0.3;
    const maxRMS = Math.max(...rmsValues);
    const hopSize = Math.floor(totalSamples / rmsValues.length);

    let startPoint = 0;
    for (let i = 0; i < rmsValues.length; i++) {
        if (rmsValues[i] > threshold * maxRMS) {
            startPoint = (i * hopSize) / sampleRate;
            break;
        }
    }

    let endPoint = totalSamples / sampleRate; // default to duration
    for (let i = rmsValues.length - 1; i >= 0; i--) {
        if (rmsValues[i] > threshold * maxRMS) {
            endPoint = (i * hopSize) / sampleRate;
            break;
        }
    }

    return { startPoint, endPoint };
}
