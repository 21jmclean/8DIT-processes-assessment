import { PitchDetector } from "https://esm.sh/pitchy@4?";
var note = "?";
var accuracy = 0;

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

        let [pitch, clarity] = detector.findPitch(buffer, audio.sampleRate);
        if (clarity > 0.4 && pitch > 0) {
            if (pitch > 81.5 && pitch < 82.5) {
                note = "E"
                accuracy = pitch-82
            }

            if (pitch > 109.5 && pitch < 110.5) {
                note = "A"
                accuracy = pitch-110
            }

            if (pitch > 146.5 && pitch < 147.5) {
                note = "D"
                accuracy = pitch-147
            }

            if (pitch > 195.5 && pitch < 196.5) {
                note = "G"
                accuracy = pitch-196
            }

            if (pitch > 246.5 && pitch < 247.5) {
                note = "B"
                accuracy = pitch-247
            }

            if (pitch > 329.5 && pitch < 330.5) {
                note = "E"
                accuracy = pitch-330
            }
            accuracy = Math.round(accuracy * 100)/100
            document.getElementById("note").textContent = `${note} ${accuracy}`;
        }

        requestAnimationFrame(detectPitch);
    }
    detectPitch();
}
startPitchDetection()