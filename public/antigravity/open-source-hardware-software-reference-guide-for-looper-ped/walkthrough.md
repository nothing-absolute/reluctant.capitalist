# OpenLooper: Kickstarter-Ready & Multi-SBC Setup Walkthrough

We have integrated proven design patterns and structures from **Loop-Baby**, **Pedalino**, and **osc.js** to deliver a fully functional, platform-portable, and Kickstarter-ready wireless looper pedal setup.

The implementation is highly modular, separating input controller hardware from the audio processing engine. This ensures the pedal can be run on **any Linux single-board computer (SBC)** (including Raspberry Pi 4/5, Orange Pi 5, or Radxa ROCK 5) or any standard Linux PC.

---

## 🛠️ Integrated Deliverables & Structure

All files reside in your workspace at `[local path redacted]`.

### 1. RP2040 Controller Firmware
* **Location**: [pico-control.ino](file://[local path redacted])
* **What it does**: Handles non-blocking debouncing of 6 momentary footswitches (with hold/clear threshold), drives 6 addressable WS2812B LED status rings (visualizing track status: Rec=Red, Play=Green, Overdub=Magenta, Pause=Blinking Orange), and filters expression pedal ADC input (exponential smoothing).
* **Communication**: Communicates with the host board using standard USB CDC Serial protocols, making it instantly compatible with any OS or host architecture out-of-the-box.

### 2. Hardware Design Notes (Guitar Impedance matching & Pinout)
* **Location**: [design_notes.md](file://[local path redacted])
* **What it does**: Explains the generic controller pinout and documents a high-quality stereo JFET impedance-matching buffer circuit (essential to prevent "tone sucking" from high-impedance guitar pickups).
* **Location**: [bom.csv](file://[local path redacted]) updated to be SBC-agnostic and include the active buffer parts.

### 3. SBC-Agnostic Setup & OS Provisioning Scripts
* **Location**: [setup.sh](file://[local path redacted])
* **What it does**: A portable shell script that auto-detects Debian-based (`apt-get`) or Arch-based (`pacman`) package managers. It installs audio (JACK, Sooperlooper) and server tools, and dynamically configures systemd daemon units for the logged-in user (resolving hardcoded home directories).
* **Location**: [start-jack.sh](file://[local path redacted])
* **What it does**: Optimizes the system for low latency (CPU performance frequency governor, remounts `/dev/shm` to 256M), automatically scans for the class-compliant USB audio interface (falling back gracefully if not found), and launches `jackd` with low-latency parameters (`-p 64 -n 2`) before linking audio routes.
* **Location**: [setup-hotspot.sh](file://[local path redacted])
* **What it does**: Uses NetworkManager (`nmcli`) to create a headless Wi-Fi Access Point (`OpenLooper-XXXX`) and configures `avahi-daemon` to broadcast `openlooper.local` for simple network auto-discovery.

### 4. Hybrid OSC Bridge Server
* **Location**: [server.js](file://[local path redacted])
* **What it does**: Run in **Simulation Mode** by default (runs in-memory loops for quick PC web testing) or in **Hardware Mode** (using `--hardware` or `HARDWARE_MODE=true` env var).
* **OSC Mapping**: Bridges commands to/from Sooperlooper using `osc-js` over UDP 9951 (e.g. `/sl/<track>/hit record`).
* **Serial Port Mapping**: Dynamically finds and binds to the RP2040 Pico USB serial port, reading footswitches/expression inputs and writing back status updates to update the LED rings in real-time.

---

## 🧪 Verification & Testing Results

* **Dependency Installation**: Successfully installed the required backend libraries (`osc-js` and `serialport`) in the backend project directory.
* **Automated Integration Tests**: Ran [test-client.js](file://[local path redacted]) against the running server. The client connected via WebSockets, successfully tested Track 0 recording duration accumulation, switched track state to playing, cleared back to empty, and verified all communication packets.
* **Result**: **All WebSocket integration tests passed successfully.**

---

## 🚀 How to Run the Setup

### Local Simulation Mode (for PC Testing)
1. Start the server:
   ```bash
   cd backend && node server.js
   ```
2. Open your browser and navigate to `http://localhost:3000`. You can interact with the virtual metal buttons and sliders to test the state machine visually.

### Production Hardware Mode (on real pedal)
1. Run the system setup:
   ```bash
   sudo ./scripts/setup.sh
   ```
2. Run the AP setup to spin up the WiFi network:
   ```bash
   ./scripts/setup-hotspot.sh
   ```
3. Run the audio engine startup:
   ```bash
   ./scripts/start-jack.sh
   ```
4. Start the Node.js server in hardware bridge mode:
   ```bash
   cd backend && node server.js --hardware
   ```
5. Backers can connect their mobile devices to the `OpenLooper` WiFi network and open `http://openlooper.local:3000` to control the pedal wirelessly.
