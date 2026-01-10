// @ts-ignore
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
    } catch (error: any) {
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
    // 1. Smooth the RMS data (Moving Average)
    // hopSize ~2048/44100 = 0.046s. Window 50 = ~2.3 seconds.
    const smoothWindow = 50;
    const smoothRMS = rmsValues.map((val, idx, arr) => {
        const start = Math.max(0, idx - smoothWindow);
        const end = Math.min(arr.length, idx + smoothWindow);
        let sum = 0;
        for (let k = start; k < end; k++) sum += arr[k];
        return sum / (end - start);
    });

    // 2. Calculate High Energy Baseline (Average of top 30% loudest frames)
    const sorted = [...smoothRMS].sort((a, b) => b - a);
    const top30Count = Math.floor(sorted.length * 0.3);
    const highEnergyBaseline = sorted.slice(0, top30Count).reduce((a, b) => a + b, 0) / (top30Count || 1);

    const hopSize = Math.floor(totalSamples / rmsValues.length);
    const secPerStep = hopSize / sampleRate;

    // 3. Find Start Point (Drop/Body Entry)
    const startThreshold = highEnergyBaseline * 0.5;
    let startIndex = 0;

    // Scan forward to find where energy kicks in
    for (let i = 0; i < smoothRMS.length; i++) {
        if (smoothRMS[i] > startThreshold) {
            startIndex = i;
            break;
        }
    }

    // Rewind logic: Find the silence/buildup before the drop
    // Search backwards for the valley
    const silenceThreshold = highEnergyBaseline * 0.15;
    for (let i = startIndex; i >= 0; i--) {
        if (smoothRMS[i] < silenceThreshold) {
            startIndex = i;
            break;
        }
    }

    // 4. Find End Point (Outro)
    const endThreshold = highEnergyBaseline * 0.4;
    let endIndex = smoothRMS.length - 1;

    // Scan backwards: Find the LAST point where energy was High
    for (let i = smoothRMS.length - 1; i >= 0; i--) {
        if (smoothRMS[i] > endThreshold) {
            endIndex = i;
            break;
        }
    }

    // Add a natural fade-out tail (e.g. 10 seconds of "outro" allowed)
    // This prevents cutting the song abruptly when the energy drops.
    const tailSeconds = 10;
    const tailSteps = Math.ceil(tailSeconds / secPerStep);
    endIndex = Math.min(smoothRMS.length - 1, endIndex + tailSteps);

    return {
        startPoint: (startIndex * hopSize) / sampleRate,
        endPoint: (endIndex * hopSize) / sampleRate
    };
}
