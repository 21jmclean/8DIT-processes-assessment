# Jed McLean - 8DIT-processes-assessment

# Guitar Tuner

A web-based guitar tuner built with **JavaScript** and the [Pitchy](https://github.com/lemoss/pitchy) library for pitch detection.

---

## Features
- Detects pitch from your microphone in real time.
- Supports **standard tuning**, **drop D**, and **double drop D**.
- Two modes:
  - **Auto mode** → detects string automatically.
  - **Manual mode** → lets you choose a string.

---

## How to Run

### Option 1: Using Live Server (recommended)
1. Install the **Live Server** extension in VS Code.
2. Open this project folder in VS Code.
3. Right-click on `index.html` → **Open with Live Server**.
4. Allow microphone access when prompted.

### Option 2: Run Locally in Browser
1. Download all project files (`index.html`, `style.css`, `script.js`).
2. Double-click `index.html` to open it in your browser.
---

## Notes
- Low E string (82 Hz) and Drop D can be tricky to detect due to harmonics and mic limitations.  
- Works best with `fftSize` set higher (e.g. 16384) for low notes.  
- Pitch detection powered by the **Pitchy** library.  
