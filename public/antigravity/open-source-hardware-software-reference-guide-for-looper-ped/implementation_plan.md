# Wireless Looper Pedal: Open-Source Reference Integration Plan

This plan details how we will integrate the proven design patterns and scripts from **Loop-Baby**, **Pedalino**, **GuitarML**, and **osc.js** into our **OpenLooper** codebase. We will transition the project from a mock-only simulator to a hybrid system capable of running in both **Simulation Mode** (on local PCs) and **Hardware Mode** (on a real Raspberry Pi 5 with an RP2040 controller and Sooperlooper engine).

---

## Proposed Changes

We will introduce new firmware, script, configuration, and documentation components under `[local path redacted]`.

```
wireless-looper/
├── firmware/
│   └── pico-control/
│       └── pico-control.ino             # [NEW] RP2040 C++ code for footswitches (debounce) & WS2812B status rings
├── hardware/
│   ├── bom.csv                         # [MODIFY] Update with specific PCB/enclosure specs from Daisy/GuitarML
│   └── design_notes.md                 # [NEW] Detailed guitar impedance match buffer, schematic, and enclosure specs
├── scripts/
│   ├── setup.sh                        # [MODIFY] Install hostapd, dnsmasq, avahi, node-osc dependencies
│   ├── start-jack.sh                   # [NEW] Low-latency JACK startup with CPU governor & Sooperlooper connections
│   └── setup-hotspot.sh                # [NEW] Script to configure RPi5 WiFi as a headless Access Point
└── backend/
    ├── package.json                    # [MODIFY] Add osc-js dependency
    └── server.js                       # [MODIFY] Implement hybrid OSC bridge & Serial reader with mock fallback
```

---

### 1. Firmware & Hardware Layer

#### [NEW] [pico-control.ino](file://[local path redacted])
* Write a full Arduino/C++ firmware sketch for the **RP2040 Pico**.
* **Button Debouncing**: Implement non-blocking state debouncing for 6 momentary footswitches.
* **LED Status Rings**: Drive 6 WS2812B rings (24 LEDs each) via NeoPixel library, showing track states matching Sooperlooper's status (Red = Rec, Green = Play, Magenta = Overdub, Orange Flash = Paused, Off = Empty).
* **Expression Pedal**: Read analog ADC input from an expression pedal, apply a rolling average filter, and map to MIDI/OSC command ranges (0–127).
* **Communication Protocol**: Send structured commands to the Raspberry Pi over USB Serial (e.g., `FS_PRESS <switch_id>` or `EXP <value>`).

#### [NEW] [design_notes.md](file://[local path redacted])
* Document a professional **stereo input buffer circuit** using standard op-amps (like TL072) to match high-impedance (Hi-Z) guitar pickups (1M ohm) to the line-in of the USB audio interface, inspired by Funbox and Daisy Seed.
* Provide KiCad wiring diagrams for RP2040 Pico GPIO pins, WS2812B data line, and expression pedal jacks.
* Recommend enclosure layout options (e.g. Hammond 1590XX or custom layout dimensioning).

---

### 2. Audio Setup & OS Tuning

#### [MODIFY] [setup.sh](file://[local path redacted])
* Update dependencies to include `avahi-daemon` (for mDNS), and networking packages like `dnsmasq` and `hostapd` for the wireless hotspot.
* Register the custom `start-jack.sh` script as a pre-requisite for Sooperlooper systemd startup.

#### [NEW] [start-jack.sh](file://[local path redacted])
* Set CPU governor to `performance` to prevent latency spikes on CPU core throttling.
* Increase shared memory size (`/dev/shm`) to 256M for JACK's internal memory buffer.
* Start `jackd` in real-time mode (`-R -P 80`) optimized for low latency with the Behringer interface (`48000Hz`, `64` buffer size, `2` periods).
* Automate routing connections using `jack_connect` to link USB audio inputs to Sooperlooper and Sooperlooper outputs to USB audio playback.

#### [NEW] [setup-hotspot.sh](file://[local path redacted])
* Configure an Access Point (`openlooper-XXXX`) using `NetworkManager` or `hostapd/dnsmasq` so a phone or tablet can connect directly to the pedal.
* Configure `avahi-daemon` to broadcast `openlooper.local` so users do not need to memorize IP addresses to open the web app.

---

### 3. Backend OSC Bridge

#### [MODIFY] [server.js](file://[local path redacted])
* **Hybrid Mode Execution**: Add a check for environment variables (e.g., `HARDWARE_MODE=true`).
  - **In Simulation Mode (default)**: The server continues using its in-memory clock-accurate loop state machine for local web-testing.
  - **In Hardware Mode**: It opens a WebSocket client/server and bridges commands to/from **Sooperlooper** via the `osc-js` UDP port (`9951`).
* **Serial Port Integration**: Use `serialport` library (or native `/dev/ttyACM0` streams) to read footswitch/expression pedal events from the RP2040 Pico, converting them directly to Sooperlooper OSC inputs.
* Translate WebSocket commands:
  - `record_track` -> `/sl/<track>/hit record` (or play/overdub depending on current state)
  - `clear_track` -> `/sl/<track>/hit clear`
  - `set_volume` -> `/sl/<track>/set volume <val>`
  - `set_pan` -> `/sl/<track>/set pan <val>`
  - `set_feedback` -> `/sl/<track>/set feedback <val>`

---

## Verification Plan

### Automated Verification
* Run the backend tests using `node test-client.js` in simulation mode.
* Validate Javascript file syntax using a node-linter or basic compilation checks.

### Manual Verification
* Run `node server.js` locally. Open the UI at `http://localhost:3000` to verify simulation mode remains fully functional and visual feedback responds accurately.
* Inspect configuration files and shell scripts visually to ensure there are no syntax bugs.
