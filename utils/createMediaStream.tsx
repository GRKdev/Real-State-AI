// Function to calculate the peak level from the analyzer data
const getPeakLevel = (analyzer: AnalyserNode) => {
    // Create a Uint8Array to store the audio data
    const array = new Uint8Array(analyzer.fftSize);

    // Get the time domain data from the analyzer and store it in the array
    analyzer.getByteTimeDomainData(array);

    // Calculate the peak level by finding the maximum absolute deviation from 127
    return (
        array.reduce((max, current) => Math.max(max, Math.abs(current - 127)), 0) /
        128
    );
};

const createMediaStream = (stream: MediaStream, isRecording: undefined, callback: ((arg0: number) => void) | undefined) => {
    // Create a new AudioContext
    const context = new AudioContext();

    // Create a media stream source node from the input stream
    const source = context.createMediaStreamSource(stream);

    // Create an analyzer node for audio analysis
    const analyzer = context.createAnalyser();

    // Connect the source node to the analyzer node
    source.connect(analyzer);

    // Function to continuously analyze audio data and invoke the callback
    const tick = () => {
        // Calculate the peak level using the getPeakLevel function
        const peak = getPeakLevel(analyzer);
        if (isRecording && callback) {
            callback(peak);
        }
        // Always request the next animation frame for continuous analysis
        requestAnimationFrame(tick);
    };

    // Start the continuous analysis loop
    tick();
};

export { createMediaStream };