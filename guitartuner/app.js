import { PitchDetector } from "https://esm.sh/pitchy@4?";
var note = "?";
var accuracy = 0;

const container = document.querySelector(".tuning_metre")
const indicator = document.querySelector("#indicator")

function moveIndicator(barIndex) {
    let barWidth = container.offsetWidth/5
    let indicatorWidth = indicator.offsetWidth;
    
    //The position is calculated by this:
    let leftPosition = barIndex*barWidth + barWidth/2 - indicatorWidth/2
    // This centres the line in the middle of each bar.

    indicator.style.left = `${leftPosition}px`;
};

function dropdownSelect() {
        const dropdown = document.getElementById("auto_or_manual");
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
async function  startPitchDetection() {
    const stream = await navigator.mediaDevices.getUserMedia({ audio: true})
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
        } else {
            if (clarity > 0.6 && pitch > 0) {
                if (pitch > 78 && pitch < 86) {
                    note = "E"
                    accuracy = pitch-82
                };

                if (pitch > 106 && pitch < 114) {
                    note = "A"
                    accuracy = pitch-110
                };

                if (pitch > 143 && pitch < 151) {
                    note = "D"
                    accuracy = pitch-147
                };

                if (pitch > 192 && pitch < 200) {
                    note = "G"
                    accuracy = pitch-196
                };

                if (pitch > 243 && pitch < 251) {
                    note = "B"
                    accuracy = pitch-247
                };

                if (pitch > 328 && pitch < 332) {
                    note = "E"
                    accuracy = pitch-330
                };
        }

            accuracy = Math.round(accuracy * 100)/100;
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

        }
        if (Date.now() - last_update > 200) {
            requestAnimationFrame(detectPitch)
            last_update = Date.now()
        }
    }
    detectPitch();
}



startPitchDetection()