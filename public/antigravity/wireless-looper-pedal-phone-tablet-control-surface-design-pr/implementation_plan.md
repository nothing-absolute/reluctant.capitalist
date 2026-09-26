# Wireless Looper Pedal: Control Surface & Simulator Prototype Plan

This plan outlines the design and implementation of a fully interactive simulation prototype for the **OpenLooper** wireless pedal. It includes a Node.js/WebSocket backend serving a high-fidelity, premium dark-mode web application. The frontend showcases both the **Phone/Tablet Control Surface** and a **Virtual Pedal Hardware Interface** side-by-side, enabling real-time visual feedback and protocol validation.

## Proposed Project Structure

We will initialize the project at `[local path redacted]`.

```
wireless-looper/
├── README.md
├── LICENSE (GPL-3.0)
├── package.json
├── backend/
│   ├── server.js (Express + WebSockets Server + Mock Looper Engine)
│   ├── package.json
│   └── public/ (Static PWA Files)
│       ├── index.html (Responsive Split-Pane Simulator UI)
│       ├── style.css (Premium Dark Mode, Glassmorphic Styling)
│       ├── app.js (WebSocket Sync & UI Component Logic)
│       └── manifest.json (PWA App manifest)
├── hardware/
│   └── bom.csv (Full hardware Bill of Materials)
└── scripts/
    └── setup.sh (Mock setup script for Pi provisioning)
```

## UI/UX & Design Philosophy
To deliver a premium, modern experience (violating the basic layout rules is not allowed), the web interface will adopt:
- **Palette**: Deep charcoal background (`#0d0e12`), neon accent indicators (glowing red `#ff3860` for recording, vibrant green `#23d160` for play, amber `#ffdd57` for pause, electric blue `#209cee` for sync).
- **Typography**: Modern sans-serif (Inter/Outfit via Google Fonts) with precise scale hierarchy.
- **Glassmorphism**: Translucent panels (`backdrop-filter: blur(16px)`) with thin borders (`1px solid rgba(255,255,255,0.08)`) and soft drop-shadows.
- **Micro-animations**: Transition animations for track state shifts, glowing breath/pulse effects on LED rings during recording, and spring-like active button press animations.
- **Interactive VU Meters**: Simulated sound waveforms that respond dynamically to recording/playback states on each track.

## Proposed Changes

### 1. Root Configurations & Documentation
#### [NEW] [README.md](file://[local path redacted])
Contains documentation of the project structure, API specifications, and instructions for running the simulator.

#### [NEW] [LICENSE](file://[local path redacted])
Standard GPL-3.0 License text as requested by the spec.

### 2. Backend Simulation Server
#### [NEW] [server.js](file://[local path redacted])
A Node.js server using `express` and `ws` (WebSockets) that:
- Runs a mock looper engine managing state for 6 audio tracks.
- Translates WebSocket commands to track state updates (e.g. Rec -> Play -> Overdub).
- Handles simulated time progression, BPM tempo, and master output level.
- Multi-client broadcast: If multiple devices connect, they all sync in real-time.

### 3. Responsive Web UI (Frontend)
#### [NEW] [index.html](file://[local path redacted])
A responsive split-screen viewport containing:
- **Virtual Pedal Controller** (Left pane / Top pane on mobile): Recreates the physical 6-switch looper pedal with interactable footswitches and glowing WS2812B LED status rings.
- **Mobile Control Surface App** (Right pane / Main view): Recreates the phone/tablet web UI with master volume sliders, track detail cards (controls for individual Track volume, Pan, Feedback decay, Undo), connection health status, and live simulated VU meter animations.
- Google Fonts and Boxicons integrations.

#### [NEW] [style.css](file://[local path redacted])
Sleek dark-mode styling utilizing CSS grid/flexbox, custom variables, glassmorphic card stylings, and pulse animations.

#### [NEW] [app.js](file://[local path redacted])
Frontend logic that manages WebSocket state sync, renders track status transitions, computes virtual waveforms, and connects interactions on both the virtual pedal and control surface.

### 4. Bill of Materials & Scripts
#### [NEW] [bom.csv](file://[local path redacted])
A structured spreadsheet of all hardware components, costs, part numbers, and suppliers.

## Verification Plan

### Automated Verification
- Create a test script `[local path redacted]` that mimics a client connection, sends commands, and verifies that the server handles and broadcasts state correctly.

### Manual Verification
1. Run `node backend/server.js` using the terminal tool.
2. Launch a browser session via the `browser_subagent` tool.
3. Open `http://localhost:3000`.
4. Verify that:
   - Clicking a Virtual Pedal footswitch starts recording (LED pulsing red, track state updates to REC).
   - Tapping it again changes the track state to PLAY (LED solid green, VU meter starts animating).
   - Adjusting volume/pan/feedback on the phone interface modifies the track state in real-time.
   - Long-holding a footswitch clears the track (resets to Off).
   - The interface is responsive and fits both mobile-sized and desktop screens.
