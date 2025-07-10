import { PitchDetector } from "https://esm.sh/pitchy@4?";

async function  startPitchDetection() {
    const stream = await navigator.mediaDevices.getUserMedia({ audio: true})
    const audio = new (window.AudioContext || window .webkitAudioContext)();
    const source = audio.createMediaStreamSource(stream);
    const analyser = audio.createAnalyser();

    analyser.fftSize = 2048;
    const bufferSize = analyser.fftSize;
    const buffer = new Float32Array(bufferSize);

    const detector = PitchDetector.forFloat32Array(analyser.fftSize);

    source.connect(analyser);

    function detectPitch() {
        analyser.getFloatTimeDomainData(buffer)

        const [pitch, clarity] = detector.findPitch(buffer, audio.sampleRate);
        if (clarity > 0.95 && pitch > 0) {
            console.log(pitch);
        }
        requestAnimationFrame(detectPitch);
    }
    detectPitch();
}
startPitchDetection()