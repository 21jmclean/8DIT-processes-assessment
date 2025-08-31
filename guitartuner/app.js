import { PitchDetector } from "https://esm.sh/pitchy@4?";
var note = "";
var accuracy = 0;

const container = document.querySelector(".tuning_metre")
const indicator = document.querySelector("#indicator")
const tuning_mode_dropdown = document.getElementById("auto_or_manual");
const note_selector = document.getElementById("note_selector")
const tuning_type_dropdown = document.getElementById("tuning_type")

// Freuqncey constants for each string (measured in Hz)
const LOW_E_FREQUENCEY = 82;
const A_FREQUENCEY = 110;
const D_FREQUENCEY = 147;
const G_FREQUENCEY = 196;
const B_FREQUENCEY = 247;
const HIGH_E_FREQUENCEY = 330;

const LOW_DROP_D_FREQUENCEY = 73
const HIGH_DROP_D_FREQUENCEY = 294

function moveIndicator(barIndex) {
    let barWidth = container.offsetWidth / 5
    let indicatorWidth = indicator.offsetWidth;

    //The position is calculated by this:
    let leftPosition = barIndex * barWidth + barWidth / 2 - indicatorWidth / 2
    // This centres the line in the middle of each bar.

    indicator.style.left = `${leftPosition}px`;
};

function tuningModeSelect() {
    if (!tuning_mode_dropdown) return;
    let saved = sessionStorage.getItem("selectedMode");
    if (saved !== null) {
        tuning_mode_dropdown.value = saved == "0" ? "0" : "1";
    }

    tuning_mode_dropdown.addEventListener("change", () => {
        if (tuning_mode_dropdown.value == 0) {
            sessionStorage.setItem("selectedMode", 0)
        } else {
            sessionStorage.setItem("selectedMode", 1)
        }
    });
};

function tuningTypeSelect() {
    if (!tuning_type_dropdown) return;
    let saved_type = sessionStorage.getItem("selectedType")

    if (saved_type !== null) {
        tuning_type_dropdown.value = saved_type
    }

    tuning_type_dropdown.addEventListener("change", () => {
        sessionStorage.setItem("selectedType", tuning_type_dropdown.value)
    })
}



// This function is used for turning on the pitch detection. It uses the pitchy library
async function startPitchDetection() {
    const stream = await navigator.mediaDevices.getUserMedia({ audio: true })
    const audio = new (window.AudioContext || window.webkitAudioContext)();
    const source = audio.createMediaStreamSource(stream);
    const analyser = audio.createAnalyser();

    analyser.fftSize = 16384;
    const bufferSize = analyser.fftSize;
    const buffer = new Float32Array(bufferSize);

    const detector = PitchDetector.forFloat32Array(analyser.fftSize);

    source.connect(analyser);


    function detectPitch() {
        let last_update = 0;

        analyser.getFloatTimeDomainData(buffer)
        let [pitch, clarity] = detector.findPitch(buffer, audio.sampleRate);

        tuningModeSelect();
        let selected_mode = sessionStorage.getItem("selectedMode")
        if (selected_mode == 1) {
            document.getElementById("note_selector").hidden = false
            if (clarity > 0.8 && pitch > 0 && pitch < 600) {

                if (note_selector.value == "E") {
                    accuracy = pitch - LOW_E_FREQUENCEY
                }

                if (note_selector.value == "A") {
                    accuracy = pitch - A_FREQUENCEY
                }

                if (note_selector.value == "D") {
                    accuracy = pitch - D_FREQUENCEY
                }

                if (note_selector.value == "G") {
                    accuracy = pitch - G_FREQUENCEY
                }

                if (note_selector.value == "B") {
                    accuracy = pitch - B_FREQUENCEY
                }

                if (note_selector.value == "E2") {
                    accuracy = pitch - HIGH_E_FREQUENCEY
                }

                if (note_selector.value == "low_drop_d") {
                    if (pitch - LOW_DROP_D_FREQUENCEY < 50 && pitch - LOW_DROP_D_FREQUENCEY > -50) {
                        accuracy = pitch - LOW_DROP_D_FREQUENCEY
                    }
                }

                if (note_selector.value == "high_drop_d") {
                    accuracy = pitch - HIGH_DROP_D_FREQUENCEY
                }
            }
        } else {
            tuningTypeSelect();
            let selected_type = sessionStorage.getItem("selectedType")
            if (clarity > 0.65 && pitch > 0) {
                if (selected_type == "standard") {
                    if (pitch > 78 && pitch < 86) {
                        note = "E"
                        accuracy = pitch - LOW_E_FREQUENCEY
                        // The accuracy variable indicates how close to the target note the detected pitch is. The closer to 0,  the more accurately tuned.
                    };
                    if (pitch > 326 && pitch < 334) {
                        note = "E"
                        accuracy = pitch - HIGH_E_FREQUENCEY
                    };
                } else if (selected_type == "drop_d" || selected_type == "double_drop_d") {
                    if (selected_type == "drop_d") {
                        if (pitch > 69 && pitch < 77) {
                            note = "Drop D"
                            accuracy = pitch - LOW_DROP_D_FREQUENCEY
                        };
                    } else {
                        if (pitch > 290 && pitch < 298) {
                            note = "High Drop D"
                            accuracy = pitch - HIGH_DROP_D_FREQUENCEY
                        };
                    }
                }

                if (pitch > 106 && pitch < 114) {
                    note = "A"
                    accuracy = pitch - A_FREQUENCEY
                };

                if (pitch > 143 && pitch < 151) {
                    note = "D"
                    accuracy = pitch - D_FREQUENCEY
                };

                if (pitch > 192 && pitch < 200) {
                    note = "G"
                    accuracy = pitch - G_FREQUENCEY
                };

                if (pitch > 243 && pitch < 251) {
                    note = "B"
                    accuracy = pitch - B_FREQUENCEY
                };
            }
        }
        accuracy = Math.round(accuracy * 100) / 100;
        document.getElementById("note").textContent = note;
        document.getElementById("accuracy").textContent = accuracy;

        if (accuracy <= 2 && accuracy >= 1) {
            moveIndicator(4)
        };

        if (accuracy < 1 && accuracy > 0.5) {
            moveIndicator(3)
        };

        if (accuracy <= 0.5 && accuracy >= -0.5) {
            moveIndicator(2)
        };

        if (accuracy < -0.5 && accuracy > -1) {
            moveIndicator(1)
        };

        if (accuracy <= -1 && accuracy >= -2) {
            moveIndicator(0)
        };

        if (accuracy > 2) {
            moveIndicator(4)
        };

        if (accuracy < -2) {
            moveIndicator(0)
        };

        if (Date.now() - last_update > 200) {
            requestAnimationFrame(detectPitch)
            last_update = Date.now()
        }
    }
    setTimeout(detectPitch(), 100);
}



startPitchDetection()