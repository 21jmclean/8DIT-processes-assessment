import { PitchDetector } from "https://esm.sh/pitchy@4?";
var note = "?";
var accuracy = 0;

const container = document.querySelector(".tuning_metre")
const indicator = document.querySelector("#indicator")
const dropdown = document.getElementById("auto_or_manual");
const note_selector = document.getElementById("note_selector")


let low_e_frequencey = 82;
let a_frequencey = 110;
let d_frequencey = 147;
let g_frequencey = 196;
let b_frequencey = 247;
let high_e_frequencey = 330;

function moveIndicator(barIndex) {
    let barWidth = container.offsetWidth / 5
    let indicatorWidth = indicator.offsetWidth;

    //The position is calculated by this:
    let leftPosition = barIndex * barWidth + barWidth / 2 - indicatorWidth / 2
    // This centres the line in the middle of each bar.

    indicator.style.left = `${leftPosition}px`;
};

function dropdownSelect() {
    if (!dropdown) return;
    let saved = sessionStorage.getItem("selectedValue");

    if (saved !== null) {
        dropdown.value = saved == "0" ? "0" : "1";
    }

    dropdown.addEventListener("change", () => {
        if (dropdown.value == 0) {
            sessionStorage.setItem("selectedValue", 0)
        } else {
            sessionStorage.setItem("selectedValue", 1)
        }

    });
};

// This function is used for turning on the pitch detection. It uses the pitchy library
async function startPitchDetection() {
    const stream = await navigator.mediaDevices.getUserMedia({ audio: true })
    const audio = new (window.AudioContext || window.webkitAudioContext)();
    const source = audio.createMediaStreamSource(stream);
    const analyser = audio.createAnalyser();

    analyser.fftSize = 4096;
    const bufferSize = analyser.fftSize;
    const buffer = new Float32Array(bufferSize);

    const detector = PitchDetector.forFloat32Array(analyser.fftSize);

    source.connect(analyser);


    function detectPitch() {
        let last_update = 0;

        analyser.getFloatTimeDomainData(buffer)
        let [pitch, clarity] = detector.findPitch(buffer, audio.sampleRate);

        dropdownSelect();
        let selected_value = sessionStorage.getItem("selectedValue")
        if (selected_value == 1) {
            document.getElementById("note_selector").hidden = false
            if (clarity > 0.6 && pitch > 0) {
                if (note_selector.value == "E") {
                    accuracy = pitch - low_e_frequencey
                }

                if (note_selector.value == "A") {
                    accuracy = pitch - a_frequencey
                }

                if (note_selector.value == "D") {
                    accuracy = pitch - d_frequencey
                }

                if (note_selector.value == "G") {
                    accuracy = pitch - g_frequencey
                }

                if (note_selector.value == "B") {
                    accuracy = pitch - b_frequencey
                }

                if (note_selector.value == "E2") {
                    accuracy = pitch - high_e_frequencey
                }
            }

        } else {
            if (clarity > 0.6 && pitch > 0) {
                if (pitch > 78 && pitch < 86) {
                    note = "E"
                    accuracy = pitch - low_e_frequencey
                    // The accuracy variable indicates how close to the target note the detected pitch is. The closer to 0, then the better tuned.
                };

                if (pitch > 106 && pitch < 114) {
                    note = "A"
                    accuracy = pitch - a_frequencey
                };

                if (pitch > 143 && pitch < 151) {
                    note = "D"
                    accuracy = pitch - d_frequencey
                };

                if (pitch > 192 && pitch < 200) {
                    note = "G"
                    accuracy = pitch - g_frequencey
                };

                if (pitch > 243 && pitch < 251) {
                    note = "B"
                    accuracy = pitch - b_frequencey
                };

                if (pitch > 326 && pitch < 334) {
                    note = "E"
                    accuracy = pitch - high_e_frequencey
                };
            }
        }
        accuracy = Math.round(accuracy * 100) / 100;
        document.getElementById("note").textContent = note;
        document.getElementById("accuracy").textContent = accuracy;

        if (accuracy <= 1 && accuracy >= 0.5) {
            moveIndicator(4)
        };

        if (accuracy < 0.5 && accuracy > 0.2) {
            moveIndicator(3)
        };

        if (accuracy <= 0.2 && accuracy >= -0.2) {
            moveIndicator(2)
        };

        if (accuracy < -0.2 && accuracy > -0.5) {
            moveIndicator(1)
        };

        if (accuracy <= -0.5 && accuracy >= -1) {
            moveIndicator(0)
        };

        if (accuracy > 1) {
            moveIndicator(4)
        };

        if (accuracy < -1) {
            moveIndicator(0)
        };

        if (Date.now() - last_update > 200) {
            requestAnimationFrame(detectPitch)
            last_update = Date.now()
        }
    }
    detectPitch();
}



startPitchDetection()