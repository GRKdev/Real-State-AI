const getPeakLevel = (analyzer: AnalyserNode) => {
    const array = new Uint8Array(analyzer.fftSize);

    analyzer.getByteTimeDomainData(array);

    return (
        array.reduce((max, current) => Math.max(max, Math.abs(current - 127)), 0) /
        128
    );
};

const createMediaStream = (stream: MediaStream, isRecording: undefined, callback: ((arg0: number) => void) | undefined) => {
    const context = new AudioContext();

    const source = context.createMediaStreamSource(stream);

    const analyzer = context.createAnalyser();

    source.connect(analyzer);

    const tick = () => {
        const peak = getPeakLevel(analyzer);
        if (isRecording && callback) {
            callback(peak);
        }
        requestAnimationFrame(tick);
    };

    tick();
};

export { createMediaStream };