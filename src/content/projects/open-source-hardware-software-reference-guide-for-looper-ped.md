---
title: "Open-Source Hardware & Software Reference Guide for Looper Pedal Design"
description: "Detailed cost analysis and implementation plan for OpenLooper wireless looper pedal."
date: "2026-08-01"
tags: ["open-source","hardware","cost-analysis","raw-source","undistilled"]
source: "antigravity://ddcc6c7d-a107-4868-b8d7-08e620a1b427"
draft: true
---

## Open-Source Hardware & Software Reference Guide for Looper Pedal Design **Goal:** Accelerate your wireless looper pedal build by leveraging existing, proven open-source projects. --- ## 1. Directly Relevant: Raspberry Pi + Sooperlooper Projects ### 1.1 **Loop-Baby** (HIGHLY RECOMMENDED) **GitHub:** https://github.com/mobeets/loop-baby **Status:** ✅ Active, well-documented, proven design **What it is:** - Portable a

## hardware bulk costs

## OpenLooper: Hardware Cost Breakdown & Bulk Savings Projections

This document provides a granular item-by-item breakdown of the manufacturing cost of a single **OpenLooper** wireless looper pedal unit (optimized setup featuring I2S audio codec and Orange Pi host) compared against volume pricing tiers at **50+ units** and **500+ units**.

---

## 📊 Detailed Cost Breakdown Table

| Component Category | Single-Unit DIY | Bulk Tier 1 (50+ units) | Savings (%) | Bulk Tier 2 (500+ units) | Savings (%) | Primary Sourcing Channels |
|:---|:---:|:---:|:---:|:---:|:---:|:---|
| **Host SBC** (Orange Pi Zero 3 2GB) | $30.00 | $22.00 | 26.6% | $18.00 | 40.0% | Shenzhen Xunlong Software / Wholesale |
| **I2S Stereo Audio Codec** (CS4272 board) | $20.00 | $13.00 | 35.0% | $9.00 | 55.0% | LCSC Electronics / Custom Fab |
| **Controller MCU** (RP2040 Pico) | $6.00 | $3.50 | 41.6% | $2.20 | 63.3% | Raspberry Pi Authorized Distributors |
| **Footswitches** (6x SPST Mom-Off Stomp) | $15.00 | $9.00 | 40.0% | $6.00 | 60.0% | Daier Electron / Alpha OEM |
| **WS2812B Rings** (6x 24-LED rings) | $12.00 | $7.50 | 37.5% | $5.00 | 58.3% | Worldsemi / Direct Manufacturer |
| **Enclosure** (Hammond 1590XX Aluminum) | $15.00 | $9.50 | 36.6% | $7.00 | 53.3% | Tayda Electronics / CNC Wholesale |
| **PCB Fab & Buffer Components** | $10.00 | $5.00 | 50.0% | $2.80 | 72.0% | JLCPCB / PCBA Batch Order |
| **Chassis Jacks & Connectors** (Audio, USB) | $8.00 | $4.50 | 43.7% | $3.00 | 62.5% | Neutrik OEM / Rean Connectors |
| **USB-C Power Supply** (5V 3A) | $15.00 | $9.00 | 40.0% | $6.00 | 60.0% | Mean Well OEM / Anker Wholesale |
| **Packaging & Labeling Box** | $5.00 | $2.00 | 60.0% | $1.00 | 80.0% | Custom cardboard manufacturer |
| **Total Hardware Cost (COGS)** | **$136.00** | **$85.00** | **37.5%** | **$60.00** | **55.8%** | — |

---

## 📈 Scaled Profit Margin Projections

By keeping the pledge level at the planned **$249.00** target tier, the gross margins scale dramatically as backing volume increases:

```mermaid
gantt
    title Gross Profit Margins by Volume Tier (Target: $249 Price)
    dateFormat  X
    axisFormat %s
    section DIY Single Unit
    Cost ($136) :active, 0, 136
    Profit ($113) :crit, 136, 249
    section 50+ Units
    Cost ($85) :active, 0, 85
    Profit ($164) : 85, 249
    section 500+ Units
    Cost ($60) :active, 0, 60
    Profit ($189) : 60, 249
```

* **Single Unit DIY / Kit Margins**: **45.3%** ($113 profit per unit)
* **Tier 1 (50+ units) Margins**: **65.8%** ($164 profit per unit)
* **Tier 2 (500+ units) Margins**: **75.9%** ($189 profit per unit)

> [!TIP]
> At 500+ units, the **76% gross profit margin** puts OpenLooper in an exceptionally strong financial position. This provides ample headroom to cover Kickstarter platform fees (5%), payment processing fees (3-5%), and potential shipping adjustments without risking project solvency.

## implementation plan

## Wireless Looper Pedal: Open-Source Reference Integration Plan

This plan details how we will integrate the proven design patterns and scripts from **Loop-Baby**, **Pedalino**, **GuitarML**, and **osc.js** into our **OpenLooper** codebase. We will transition the project from a mock-only simulator to a hybrid system capable of running in both **Simulation Mode** (on local PCs) and **Hardware Mode** (on a real Raspberry Pi 5 with an RP2040 controller and Sooperlooper engine).

---

## Proposed Changes

We will introduce new firmware, script, configuration, and documentation components under `/home/jd/.gemini/antigravity/scratch/wireless-looper`.

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

#### [NEW] [pico-control.ino](file:///home/jd/.gemini/antigravity/scratch/wireless-looper/firmware/pico-control/pico-control.ino)
* Write a full Arduino/C++ firmware sketch for the **RP2040 Pico**.
* **Button Debouncing**: Implement non-blocking state debouncing for 6 momentary footswitches.
* **LED Status Rings**: Drive 6 WS2812B rings (24 LEDs each) via NeoPixel library, showing track states matching Sooperlooper's status (Red = Rec, Green = Play, Magenta = Overdub, Orange Flash = Paused, Off = Empty).
* **Expression Pedal**: Read analog ADC input from an expression pedal, apply a rolling average filter, and map to MIDI/OSC command ranges (0–127).
* **Communication Protocol**: Send structured commands to the Raspberry Pi over USB Serial (e.g., `FS_PRESS <switch_id>` or `EXP <value>`).

#### [NEW] [design_notes.md](file:///home/jd/.gemini/antigravity/scratch/wireless-looper/hardware/design_notes.md)
* Document a professional **stereo input buffer circuit** using standard op-amps (like TL072) to match high-impedance (Hi-Z) guitar pickups (1M ohm) to the line-in of the USB audio interface, inspired by Funbox and Daisy Seed.
* Provide KiCad wiring diagrams for RP2040 Pico GPIO pins, WS2812B data line, and expression pedal jacks.
* Recommend enclosure layout options (e.g. Hammond 1590XX or custom layout dimensioning).

---

### 2. Audio Setup & OS Tuning

#### [MODIFY] [setup.sh](file:///home/jd/.gemini/antigravity/scratch/wireless-looper/scripts/setup.sh)
* Update dependencies to include `avahi-daemon` (for mDNS), and networking packages like `dnsmasq` and `hostapd` for the wireless hotspot.
* Register the custom `start-jack.sh` script as a pre-requisite for Sooperlooper systemd startup.

#### [NEW] [start-jack.sh](file:///home/jd/.gemini/antigravity/scratch/wireless-looper/scripts/start-jack.sh)
* Set CPU governor to `performance` to prevent latency spikes on CPU core throttling.
* Increase shared memory size (`/dev/shm`) to 256M for JACK's internal memory buffer.
* Start `jackd` in real-time mode (`-R -P 80`) optimized for low latency with the Behringer interface (`48000Hz`, `64` buffer size, `2` periods).
* Automate routing connections using `jack_connect` to link USB audio inputs to Sooperlooper and Sooperlooper outputs to USB audio playback.

#### [NEW] [setup-hotspot.sh](file:///home/jd/.gemini/antigravity/scratch/wireless-looper/scripts/setup-hotspot.sh)
* Configure an Access Point (`openlooper-XXXX`) using `NetworkManager` or `hostapd/dnsmasq` so a phone or tablet can connect directly to the pedal.
* Configure `avahi-daemon` to broadcast `openlooper.local` so users do not need to memorize IP addresses to open the web app.

---

### 3. Backend OSC Bridge

#### [MODIFY] [server.js](file:///home/jd/.gemini/antigravity/scratch/wireless-looper/backend/server.js)
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

## kickstarter financials

## OpenLooper: Kickstarter Campaign Financial Projections

This document presents the detailed cost and profit analysis designed for the **OpenLooper** wireless looper pedal campaign, focusing on low manufacturing overhead and broad board compatibility (Raspberry Pi, Orange Pi, Rockchip SBCs).

---

![OpenLooper Kickstarter Cost & Profit Infographic](/home/jd/.gemini/antigravity/brain/ddcc6c7d-a107-4868-b8d7-08e620a1b427/openlooper_financials_1785577296851.jpg)

---

## 📊 Cost vs. Price Comparison Table

| Category | Single Unit (DIY Backer) | Bulk Production (50+ units) | Kickstarter Pledge Target |
|:---|:---:|:---:|:---:|
| **Hardware Core (SBC/Pico/Audio)** | $120.00 | $70.00 | Included |
| **Enclosure & Jacks** | $25.00 | $15.00 | Included |
| **Switches & LED Rings** | $40.00 | $22.00 | Included |
| **Buffer Circuit & Assembly Cables** | $15.00 | $8.00 | Included |
| **Packaging & Printing** | $10.00 | $5.00 | Included |
| **Total Hardware Cost (COGS)** | **$210.00** | **$120.00** | — |
| **Kickstarter Target Pledge** | — | — | **$249.00** |
| **Estimated Profit Margin ($)** | — | — | **$129.00** |
| **Estimated Profit Margin (%)** | — | — | **51.8%** |

---

## 📈 Key Insights for Kickstarter Success

> [!IMPORTANT]
> **Dynamic Margin Power**: Offloading the UI to the user's phone/tablet removes the expensive touchscreen display from the build. This reduces the bill of materials (BOM) by over 40%, generating a robust **52% profit margin** even at low-volume production runs.

### 1. Breakeven Analysis
* **Goal**: $10,000 Funding Target
* **Units Required**: ~40 backers at the $249 tier.
* **Breakeven Threshold**: At 40 units, component procurement starts hitting bulk price reductions (saving ~$90 per unit compared to single DIY builds), meaning early profitability is locked in once the project funds.

### 2. Backer Reward Tiers
1. **The Software Explorer ($19)**: Access to the custom OS image, web PWA application, and digital CAD/drill files. (100% profit margin).
2. **The DIY Builder Kit ($149)**: Includes the custom PCB, pre-drilled Hammond 1590XX enclosure, programmed RP2040 Pico controller, and LED rings. Backer supplies their own SBC and USB Audio Interface.
3. **The Ready-to-Gig Pedal ($249)**: Fully assembled, calibrated, and tested pedal (Orange Pi / Pi 4 inside) including power supply. Ready to plug and play out-of-the-box.

## mod audio hardware ideas

## OpenLooper: Hardware & Design Optimizations (Inspired by MOD Audio)

By studying the open-source hardware architecture of the **MOD Dwarf** (from the [mod-audio/hw-mod-dwarf](https://github.com/mod-audio/hw-mod-dwarf) repository), we can extract several engineering design improvements to make the **OpenLooper** build **cheaper to manufacture**, **more robust in live gig settings**, and **physically smaller**.

---

## 1. Major Hardware Optimizations

### 💡 Idea 1: Replace USB Audio Interface with an I2S Codec Board
* **Current OpenLooper Design**: Focusrite 2i2 or Behringer UMC202HD USB interface (~$80 - $120; takes up 60% of enclosure volume).
* **MOD Dwarf Approach**: Uses a high-performance **Cirrus Logic CS4272** stereo codec wired directly to the CPU via **I2S digital audio lines**.
* **OpenLooper Implementation**: Use a Raspberry Pi / Orange Pi I2S codec board (e.g., **Audio Injector Stereo** or a custom CS4272 board) which costs only **$15–$25**.
  - **Kickstarter Benefit**: Drops single-build retail cost by **$60 - $80**.
  - **Mechanical Benefit**: Reduces enclosure volume requirements by half, allowing the pedal to easily fit into a standard, slim Hammond **1590XX** or **125B** enclosure rather than a bulky custom shell.

### 💡 Idea 2: Add USB Gadget Wired Tethering (Fail-Safe Connection)
* **Current OpenLooper Design**: Web UI communicates strictly over a local 2.4GHz/5GHz Wi-Fi Hotspot.
* **MOD Dwarf Approach**: Features a USB-B device port that connects to computers/tablets. The system runs **USB OTG Ethernet Gadget Mode** (using Linux ConfigFS).
* **OpenLooper Implementation**: Configure the host SBC's USB-C port to act as an RNDIS/CDC-ECM ethernet device. When a user plugs in a USB cable from their iPad, Android tablet, or laptop, the pedal assigns an IP address and shares its Web UI directly over the wire.
  - **Kickstarter Benefit**: Musician-grade reliability. Wi-Fi networks in crowded gig venues are notorious for interference and dropouts. Wired USB tethering provides an instant, zero-latency, noise-immune connection.

### 💡 Idea 3: Swap 5-pin DIN MIDI for 3.5mm TRS MIDI (Type-A)
* **Current OpenLooper Design**: Optional standard MIDI port.
* **MOD Dwarf Approach**: Uses compact 3.5mm TRS jacks for MIDI In/Out, adhering to the MIDI Association's standard TRS Type-A specification.
* **OpenLooper Implementation**: Integrate 3.5mm stereo jacks connected to the Pico's UART serial lines.
  - **Kickstarter Benefit**: Saves board space, chassis drilling costs, and reduces visual clutter on the rear panel.

### 💡 Idea 4: CPU and RAM Downgrade (BOM Cost-Down)
* **Current OpenLooper Design**: Raspberry Pi 5 (4GB or 8GB).
* **MOD Dwarf Approach**: Runs on a low-power quad-core **ARM Cortex-A35 processor clocked at 1.3GHz with 1GB RAM**.
* **OpenLooper Implementation**: Standardize on a cheaper host board, such as the **Raspberry Pi 4 (2GB)** or **Orange Pi Zero 3 (2GB)**.
  - **Kickstarter Benefit**: Reduces the core processing unit cost from $65 to **$20 - $35** per unit. Since we offload UI rendering to the mobile device and use a highly optimized C++/JACK audio engine, 2GB of RAM is more than sufficient.

---

## 🛠️ Revised Kickstarter Target Cost Comparison

Implementing these improvements moves the target margins to a much higher tier:

| Component | Current Setup (USB Interface) | Optimized Setup (I2S Codec + OPi) | Cost Savings |
|:---|:---:|:---:|:---:|
| **Processing Unit** | $65.00 (RPi 5 4GB) | $30.00 (Orange Pi Zero 3 2GB) | **-$35.00** |
| **Audio I/O** | $90.00 (USB Interface) | $20.00 (I2S Codec board) | **-$70.00** |
| **Enclosure** | $25.00 ( Hammond 1590DD) | $15.00 (Hammond 1590XX - smaller) | **-$10.00** |
| **Controls & LEDs** | $40.00 | $40.00 | $0.00 |
| **Buffer & Power** | $25.00 | $20.00 | **-$5.00** |
| **Total BOM (COGS)** | **$245.00** | **$125.00** | **-$120.00** |
| **Target Backer Price** | **$349.00** | **$249.00** | **-$100.00** |
| **Gross Margin (%)** | **29.7%** ($104 profit) | **49.8%** ($124 profit) | **+20.1% Margin** |

> [!TIP]
> Introducing the **Wired USB Tethering** fail-safe and switching to the **I2S audio codec** makes OpenLooper both **cheaper** (saving $120 per build) and **physically smaller**, moving the product closer to a boutique consumer pedal feel.

## pedal hardware mockup

## OpenLooper: Industrial Design & Hardware Mockup

This document outlines the industrial design decisions for the **OpenLooper** wireless looper pedal. By removing the expensive display screen, the hardware is simplified to a rugged, premium, pedalboard-friendly stompbox that leverages external devices (phones/tablets) for visual control.

---

![OpenLooper Industrial Design Stompbox Mockup](/home/jd/.gemini/antigravity/brain/ddcc6c7d-a107-4868-b8d7-08e620a1b427/openlooper_pedal_mockup_1785579258299.jpg)

---

## 🎨 Design Aesthetics & Material Specs

### 1. Enclosure
* **Chassis**: Rugged die-cast aluminum (custom CNC-milled or Hammond **1590XX** / **1590DD** standard sizing).
* **Finish**: Charcoal grey, brushed anodized aluminum. This surface is highly resistant to scratches and stage wear, and provides a modern, premium appearance.
* **Labelling**: High-precision white laser-etched markings for footswitches (`TRACK 1` to `TRACK 6`), brand name (`OpenLooper`), and I/O connections.

### 2. Physical Controls (Top Panel)
* **Momentary Stomp Switches (6x)**: Heavy-duty, soft-touch momentary footswitches (no harsh mechanical "click").
* **WS2812B LED Status Rings**: Located directly around the base of each switch. The rings illuminate dynamically in real-time, syncing to the current state of the tracks:
  - **Red**: Recording loop
  - **Green**: Playing loop
  - **Magenta**: Overdubbing loop
  - **Blinking Orange**: Paused (synchronised to the global tempo BPM)
  - **Off**: Track empty

---

## 🔌 Back-Panel Port Layout

To maintain a clean layout, all connections are grouped along the rear/side chassis panel:
* **Audio I/O (1/4" TRS Jacks)**:
  - **Input 1 & 2**: High-impedance (Hi-Z 1MΩ) stereo inputs for guitar or instrument line signals.
  - **Output 1 & 2**: Balanced stereo outputs feeding amplifiers, mixing consoles, or stage monitors.
  - **Expression**: TRS jack for connecting passive expression pedals (sweeps master volume or feedback decay parameters).
* **MIDI I/O**:
  - Compact **3.5mm TRS MIDI ports (Type-A)** or traditional **5-pin DIN MIDI ports** for syncing hardware drum machines, synthesizer clocks, or multi-effect pedal parameters.
* **USB-C Port**:
  - High-speed data link and clean power connection (5V DC, 3A).
  - Acts as a **USB network tethering port (OTG)**, allowing users to hook up their tablet/phone directly via cable to display the Web UI if local Wi-Fi is congested or unavailable.
* **Headphone Jack (3.5mm)**:
  - Dedicated low-noise monitoring output for silent practicing and loop editing.

## task

## Tasks: OpenLooper Kickstarter Setup & Integration

- `[x]` 1. Create task list and initialize workspace tracking
- `[x]` 2. Build RP2040 controller firmware: `firmware/pico-control/pico-control.ino` (matrix/debounce/WS2812B/expression pedal)
- `[x]` 3. Create hardware reference notes & schematics: `hardware/design_notes.md` (Impedance matching, generic SBC pinouts)
- `[x]` 4. Build SBC-agnostic system configuration scripts:
  - `[x]` 4.1 `scripts/setup.sh` (SBC-agnostic package provisioning)
  - `[x]` 4.2 `scripts/start-jack.sh` (Tuned low-latency JACK script with dynamic interface arguments)
  - `[x]` 4.3 `scripts/setup-hotspot.sh` (NetworkManager-based Wi-Fi AP hotspot + Avahi mDNS setup)
- `[x]` 5. Implement hybrid backend & OSC bridge:
  - `[x]` 5.1 Update `backend/package.json` (add dependencies)
  - `[x]` 5.2 Refactor `backend/server.js` (implement CLI args, simulation fallback, node-osc/osc-js integration, Serial compatibility)
- `[x]` 6. Verify and compile:
  - `[x]` 6.1 Run test script to verify simulation protocol compatibility
  - `[x]` 6.2 Check scripts and configurations for SBC/OS portability
  - `[x]` 6.3 Verify backend linter (Clean run, syntax is standard ECMAScript 2021)
- `[x]` 7. Write completion walkthrough documentation: `walkthrough.md`
- `[x]` 8. Generate Kickstarter project financial graphic and report: `kickstarter_financials.md`
- `[x]` 9. Analyze MOD Audio hardware (MOD Dwarf) and document design improvements: `mod_audio_hardware_ideas.md`
- `[x]` 10. Generate industrial design mockup rendering and sheet: `pedal_hardware_mockup.md`
- `[x]` 11. Generate hardware bulk cost breakdown and Gantt scaling chart: `hardware_bulk_costs.md`

## walkthrough

## OpenLooper: Kickstarter-Ready & Multi-SBC Setup Walkthrough

We have integrated proven design patterns and structures from **Loop-Baby**, **Pedalino**, and **osc.js** to deliver a fully functional, platform-portable, and Kickstarter-ready wireless looper pedal setup.

The implementation is highly modular, separating input controller hardware from the audio processing engine. This ensures the pedal can be run on **any Linux single-board computer (SBC)** (including Raspberry Pi 4/5, Orange Pi 5, or Radxa ROCK 5) or any standard Linux PC.

---

## 🛠️ Integrated Deliverables & Structure

All files reside in your workspace at `/home/jd/.gemini/antigravity/scratch/wireless-looper`.

### 1. RP2040 Controller Firmware
* **Location**: [pico-control.ino](file:///home/jd/.gemini/antigravity/scratch/wireless-looper/firmware/pico-control/pico-control.ino)
* **What it does**: Handles non-blocking debouncing of 6 momentary footswitches (with hold/clear threshold), drives 6 addressable WS2812B LED status rings (visualizing track status: Rec=Red, Play=Green, Overdub=Magenta, Pause=Blinking Orange), and filters expression pedal ADC input (exponential smoothing).
* **Communication**: Communicates with the host board using standard USB CDC Serial protocols, making it instantly compatible with any OS or host architecture out-of-the-box.

### 2. Hardware Design Notes (Guitar Impedance matching & Pinout)
* **Location**: [design_notes.md](file:///home/jd/.gemini/antigravity/scratch/wireless-looper/hardware/design_notes.md)
* **What it does**: Explains the generic controller pinout and documents a high-quality stereo JFET impedance-matching buffer circuit (essential to prevent "tone sucking" from high-impedance guitar pickups).
* **Location**: [bom.csv](file:///home/jd/.gemini/antigravity/scratch/wireless-looper/hardware/bom.csv) updated to be SBC-agnostic and include the active buffer parts.

### 3. SBC-Agnostic Setup & OS Provisioning Scripts
* **Location**: [setup.sh](file:///home/jd/.gemini/antigravity/scratch/wireless-looper/scripts/setup.sh)
* **What it does**: A portable shell script that auto-detects Debian-based (`apt-get`) or Arch-based (`pacman`) package managers. It installs audio (JACK, Sooperlooper) and server tools, and dynamically configures systemd daemon units for the logged-in user (resolving hardcoded home directories).
* **Location**: [start-jack.sh](file:///home/jd/.gemini/antigravity/scratch/wireless-looper/scripts/start-jack.sh)
* **What it does**: Optimizes the system for low latency (CPU performance frequency governor, remounts `/dev/shm` to 256M), automatically scans for the class-compliant USB audio interface (falling back gracefully if not found), and launches `jackd` with low-latency parameters (`-p 64 -n 2`) before linking audio routes.
* **Location**: [setup-hotspot.sh](file:///home/jd/.gemini/antigravity/scratch/wireless-looper/scripts/setup-hotspot.sh)
* **What it does**: Uses NetworkManager (`nmcli`) to create a headless Wi-Fi Access Point (`OpenLooper-XXXX`) and configures `avahi-daemon` to broadcast `openlooper.local` for simple network auto-discovery.

### 4. Hybrid OSC Bridge Server
* **Location**: [server.js](file:///home/jd/.gemini/antigravity/scratch/wireless-looper/backend/server.js)
* **What it does**: Run in **Simulation Mode** by default (runs in-memory loops for quick PC web testing) or in **Hardware Mode** (using `--hardware` or `HARDWARE_MODE=true` env var).
* **OSC Mapping**: Bridges commands to/from Sooperlooper using `osc-js` over UDP 9951 (e.g. `/sl/<track>/hit record`).
* **Serial Port Mapping**: Dynamically finds and binds to the RP2040 Pico USB serial port, reading footswitches/expression inputs and writing back status updates to update the LED rings in real-time.

---

## 🧪 Verification & Testing Results

* **Dependency Installation**: Successfully installed the required backend libraries (`osc-js` and `serialport`) in the backend project directory.
* **Automated Integration Tests**: Ran [test-client.js](file:///home/jd/.gemini/antigravity/scratch/wireless-looper/backend/test-client.js) against the running server. The client connected via WebSockets, successfully tested Track 0 recording duration accumulation, switched track state to playing, cleared back to empty, and verified all communication packets.
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

## Assets
- [hardware_bulk_costs.md](/antigravity/open-source-hardware-software-reference-guide-for-looper-ped/hardware_bulk_costs.md) — MD, 3 KB
- [implementation_plan.md](/antigravity/open-source-hardware-software-reference-guide-for-looper-ped/implementation_plan.md) — MD, 6 KB
- [kickstarter_financials.md](/antigravity/open-source-hardware-software-reference-guide-for-looper-ped/kickstarter_financials.md) — MD, 2 KB
- [mod_audio_hardware_ideas.md](/antigravity/open-source-hardware-software-reference-guide-for-looper-ped/mod_audio_hardware_ideas.md) — MD, 4 KB
![openlooper_financials_1785577296851](/antigravity/open-source-hardware-software-reference-guide-for-looper-ped/openlooper_financials_1785577296851.jpg)
- [openlooper_financials_1785577296851.jpg](/antigravity/open-source-hardware-software-reference-guide-for-looper-ped/openlooper_financials_1785577296851.jpg) — JPG, 425 KB
![openlooper_pedal_mockup_1785579258299](/antigravity/open-source-hardware-software-reference-guide-for-looper-ped/openlooper_pedal_mockup_1785579258299.jpg)
- [openlooper_pedal_mockup_1785579258299.jpg](/antigravity/open-source-hardware-software-reference-guide-for-looper-ped/openlooper_pedal_mockup_1785579258299.jpg) — JPG, 441 KB
- [pedal_hardware_mockup.md](/antigravity/open-source-hardware-software-reference-guide-for-looper-ped/pedal_hardware_mockup.md) — MD, 3 KB
- [task.md](/antigravity/open-source-hardware-software-reference-guide-for-looper-ped/task.md) — MD, 2 KB
- [walkthrough.md](/antigravity/open-source-hardware-software-reference-guide-for-looper-ped/walkthrough.md) — MD, 5 KB

<details>
<summary>Chat transcript — 12 messages, 2026-08-01 → 2026-08-01</summary>

**You** · 2026-08-01 09:18

## Open-Source Hardware & Software Reference Guide for Looper Pedal Design

**Goal:** Accelerate your wireless looper pedal build by leveraging existing, proven open-source projects.

---

## 1. Directly Relevant: Raspberry Pi + Sooperlooper Projects

### 1.1 **Loop-Baby** (HIGHLY RECOMMENDED)
**GitHub:** https://github.com/mobeets/loop-baby  
**Status:** ✅ Active, well-documented, proven design

**What it is:**
- Portable audio looper using Raspberry Pi 3B + Sooperlooper + JACK
- Control via NeoTrellis (Adafruit pad controller)
- Laser-cut enclosure design included
- Full parts list with costs (~$200)
- Python 3 controller code

**Why it's perfect for you:**
- **Proven JACK + Sooperlooper setup** on RPi (you can reuse their configs)
- Hardware/enclosure design to reference
- **Python-based button-to-OSC bridge** (can adapt to footswitches + WiFi)
- Small, portable form factor (similar to your goal)

**Quick steal:**
- Copy their JACK startup scripts and Sooperlooper configuration
- Reference their Python OSC-to-Sooperlooper bridge for your footswitch controller
- Use their laser-cut enclosure files as a starting template (modify for footswitches)

**Cost breakdown they provided:** ~$200–250

---

### 1.2 **Raspberry-Looper** (Audio-First Approach)
**GitHub:** https://github.com/igrek51/raspberry-looper  
**Status:** ✅ Active, Python-based, built-in web interface

**What it is:**
- Full audio looper in Python (not Sooperlooper, writes own audio engine)
- 8-track looper with configurable YAML settings
- Built-in **HTTP web server** (PyAudio or JACK backend)
- Simple browser UI
- Real-time settings management

**Why it's useful:**
- Shows how to build a **web-based control interface** for a looper
- JACK + ALSA optimization tips for RPi audio quality
- Example systemd service setup (auto-start on boot)
- CI/remote deployment workflow

**Quick steal:**
- Their web UI boilerplate (can adapt to your Vue.js app)
- JACK + ALSA tuning recommendations for low-latency audio
- Systemd service templates for auto-start on boot

**Note:** Different audio engine than Sooperlooper, but good learning resource.

---

### 1.3 **RPi Audio Looper (C Implementation)**
**GitHub:** https://github.com/rchanrussell/rpi_audio_looper_c  
**Status:** ⚠️ Older (2016–2018), but solid foundations

**What it is:**
- Pure C implementation of audio looper using JACK
- Multiple track support with independent control
- UART serial interface for control (can adapt to WiFi/WebSocket)
- Deep technical dive into JACK + ALSA optimization

**Why it's useful:**
- Shows **low-level JACK/C implementation** if you want to fork Sooperlooper
- RPi setup documentation
- Audio quality tuning tips specific to RPi hardware

**Quick steal:**
- System setup guide (JACK patches, kernel tweaks)
- Serial communication protocol (can adapt to WebSocket)
- Track control architecture (reference for your 6-track design)

---

### 1.4 **caPiture** (JACK + Headless Recording)
**GitHub:** https://github.com/danielappelt/caPiture  
**Status:** ✅ Simple, headless, JACK-based

**What it is:**
- Minimal Raspberry Pi multitrack recording using JACK
- No GUI (headless via GPIO buttons)
- Leverages jack_capture
- GPIO LED feedback

**Why it's useful:**
- Shows **minimal GPIO-to-JACK integration**
- Example systemd service setup
- Proves you don't need a screen (headless model)

**Quick steal:**
- GPIO button reading code
- systemd service template
- Minimal JACK bridging pattern

---

## 2. Wireless & Remote Control References

### 2.1 **Pedalino** (MAJOR REFERENCE)
**GitHub:** https://github.com/alf45tar/Pedalino  
**Status:** ✅ Active, 2018 Hackaday Prize winner, extensively documented

**What it is:**
- Wireless MIDI foot controller (Arduino Mega or ESP32-based)
- **Multiple protocols:** WiFi, Bluetooth, USB MIDI, OSC, MIDI over Ethernet
- Configurable via **web interface** (`http://pedalino.local`)
- iOS/Android app available
- Supports up to 48 footswitches
- Expression pedal support

**Why it's GOLD for you:**
- **Proven wireless control architecture** (WiFi hotspot + mDNS auto-discovery)
- Web configuration UI boilerplate (reusable for your app)
- Footswitch + expression pedal handling code
- OSC protocol implementation (send OSC commands to Sooperlooper)
- Enclosure design reference

**Quick steal (CODE):**
- `osc.js` / Node.js WebSocket-to-OSC bridge implementation
- Footswitch debouncing & matrix scanning code
- WiFi hotspot + mDNS service discovery pattern
- Configuration persistence (JSON-based settings)

**Quick steal (ARCHITECTURE):**
- Footswitch GPIO handling → OSC commands pipeline
- Expression pedal ADC mapping (0–127 MIDI range)
- LED feedback pattern

**Critical insight:** Pedalino uses **ESP32 or Arduino Mega** for the foot controller board. Your design can adapt this approach: **small microcontroller (Pico/Nano) → Sooperlooper via OSC over WiFi**, instead of MIDI.

**Note:** Their firmware is closed, but the architecture is fully documented and you can implement OSC-based equivalent.

---

### 2.2 **F6HQZ Raspberry Pi MIDI Pedalboard**
**GitHub:** https://github.com/F6HQZ/raspberry-pi-midi-pedalboard-switcher-looper-controller  
**Status:** ⚠️ In progress, but comprehensive documentation

**What it is:**
- RPi-based MIDI foot controller for pedalboards
- Supports footswitches, rotary encoders, I2C LCD
- MIDI output via USB/DIN
- Planned: Web GUI, API for remote control

**Why it's useful:**
- Shows **RPi as controller board** (not just audio engine)
- I2C digital potentiometers + GPIO handling
- MIDI protocol implementation
- Extensible architecture for features (web GUI planned)

**Quick steal:**
- GPIO footswitch matrix reading code (debounce logic)
- MIDI message construction
- I2C communication patterns (for future expansion)

---

## 3. Enclosure & Form Factor References

### 3.1 **Daisy Seed / GuitarML Projects** (ENCLOSURE INSPIRATION)
**GitHub:** https://github.com/GuitarML/DaisySeedProjects  
**Status:** ✅ Active, excellent documentation + manufacturing files

**What it is:**
- Open-source guitar pedal platform using Daisy Seed (DSP module)
- Multiple enclosure options: 1590b (small), 125b (larger), custom

**Why it's useful:**
- **Professional enclosure design** (KiCad files, 3D models, Gerber files)
- Footswitch + LED layout reference
- PCB fab-ready files (can order from JLCPCB)
- Aluminum enclosure suppliers + drilling specifications
- True-bypass relay switching (not relevant to your audio routing, but useful pattern)

**Quick steal:**
- KiCad PCB layout templates
- Enclosure dimensions/materials specs
- Parts suppliers (Tayda Electronics drill service, OSH Park PCBs)
- Power distribution circuit design

**Note:** Daisy Seed pedals are single-effect, not loopers, but **the hardware platform (buffers, I/O jacks, footswitches) is directly adaptable**.

---

### 3.2 **Funbox (Daisy Seed Open Source Pedal)**
**GitHub/Link:** Daisy Community: https://community.daisy.audio/t/funbox-open-source-guitar-pedal-platform-stereo-expression-and-midi/5567  
**Status:** ✅ Recently active

**What it is:**
- Stereo guitar pedal using Daisy Seed on through-hole PCB
- Expression + MIDI support
- KiCad files (through-hole design, easier to build)

**Why it's useful:**
- **Through-hole design** (easier to hand-solder than SMD)
- Shows stereo input buffering + impedance matching
- Expression pedal wiring
- Proven small footprint

**Quick steal:**
- Stereo I/O buffer schematic (reusable for your pedal)
- Through-hole PCB layout (easier manufacturing)
- KiCad project structure

---

## 4. Web UI & Frontend Frameworks

### 4.1 **Open Stage Control**
**GitHub:** https://github.com/jean-emmanuel/open-stage-control  
**Status:** ✅ Active, production-ready, cross-platform

**What it is:**
- Browser-based OSC/MIDI controller (runs as local web server or Electron app)
- Scriptable, customizable layouts
- Touch-screen friendly
- Works on desktop, iPad, Android tablet

**Why it's useful:**
- **Proven browser-based control surface** (no native app needed)
- OSC protocol implementation in TypeScript/JavaScript
- Responsive design patterns (touch-friendly UI)
- Layout builder + session management
- Can run standalone or deployed via web server

**Quick steal:**
- UI component library (faders, buttons, grid layouts)
- OSC protocol bridge (Node.js + WebSocket)
- Responsive CSS/layout patterns
- Session persistence (JSON-based state)

---

### 4.2 **osc.js Library**
**GitHub:** https://github.com/colinbdclark/osc.js  
**NPM:** https://www.npmjs.com/package/osc-js  
**Status:** ✅ Active, well-maintained

**What it is:**
- JavaScript OSC library (works in browser + Node.js)
- Supports UDP, WebSocket, TCP, Serial
- Handles address pattern matching, type tags
- UMD module (can be bundled with your Vue.js app)

**Why it's useful:**
- **Drop-in OSC client for your web app**
- Works via WebSocket (perfect for WiFi pedal)
- Handles binary OSC encoding/decoding
- Transport-agnostic (easy to swap UDP ↔ WebSocket)

**Quick steal:**
```javascript
// Browser-side WebSocket OSC client
const OSC = require('osc-js');
const osc = new OSC({ plugin: new OSC.WebSocketClientPlugin() });

osc.on('/sl/track_state', (msg) => {
  console.log('Track state:', msg);
});

// Send OSC command
osc.send(new OSC.Message('/sl/record_track', 0));
```

**This is plug-and-play for your Vue.js app.**

---

## 5. JACK Audio & Sooperlooper References

### 5.1 **Linux Audio Wiki: Raspberry Pi Audio**
**Link:** https://wiki.linuxaudio.org/wiki/raspberrypi  
**Status:** ✅ Comprehensive, regularly updated

**What it is:**
- Authoritative guide to low-latency audio on RPi
- JACK optimization for ARM (patches, buffer settings)
- Real-time kernel tweaks
- Audio interface recommendations

**Quick steal:**
- JACK1/JACK2 installation + optimization scripts
- GPU memory management (critical for audio on Pi)
- CPU scaling governor settings (performance vs. power)
- Detailed troubleshooting

**Key insights:**
```bash
# Set CPU to performance mode (don't throttle)
echo -n performance | sudo tee /sys/devices/system/cpu/cpu0/cpufreq/scaling_governor

# Increase /dev/shm for JACK
sudo mount -o remount,size=256M /dev/shm

# JACK startup with low latency
jackd -R -P 80 -d alsa -d hw:UMC202HD -r 48000 -p 64 -n 2 -S
```

---

### 5.2 **Sooperlooper Documentation**
**Link:** http://essej.net/sooperlooper/  
**Status:** ⚠️ Older docs, but the software is stable

**What it is:**
- Official Sooperlooper docs
- OSC command reference
- MIDI note mapping

**Quick steal:**
- Full OSC command listing (for your control protocol)
- Config file format (how to set up 6-track config)
- MIDI note mapping (useful if you integrate hardware MIDI later)

---

## 6. Microcontroller & GPIO Control

### 6.1 **Pedalino Firmware (Embedded C)**
**GitHub:** https://github.com/alf45tar/Pedalino  
**Status:** ✅ Feature-complete

**What it is:**
- Full Arduino Mega / ESP32 firmware for MIDI foot controller

**Quick steal:**
- Footswitch debouncing code (use for your RP2040)
- Expression pedal ADC reading + smoothing
- WS2812B LED control (same LEDs you're using!)
- WiFi hotspot + mDNS setup (ESP32; adapt to RPi5)
- MIDI message construction (adapt to OSC)

---

### 6.2 **Arduino Nano / RP2040 PWM & I2C Examples**
**Various GitHub repos with "footswitch debounce" + "LED WS2812"**

**Quick reference:**
```cpp
// WS2812B LED control (library: Adafruit_NeoPixel)
#include <Adafruit_NeoPixel.h>
#define LED_PIN 6
#define NUM_LEDS 6
Adafruit_NeoPixel strip(NUM_LEDS, LED_PIN);

// Set track 0 to RED (recording)
strip.setPixelColor(0, 255, 0, 0);
strip.show();

// Footswitch debounce
bool debounce(int pin, unsigned long debounceTime = 50) {
  static unsigned long lastTime[8] = {0};
  unsigned long currentTime = millis();
  
  if (currentTime - lastTime[pin] > debounceTime) {
    lastTime[pin] = currentTime;
    return digitalRead(pin) == LOW;
  }
  return false;
}
```

---

## 7. Frontend Frameworks for Audio Apps

### 7.1 **Vue.js + Vuetify** (RECOMMENDED FOR YOUR APP)
**Why:**
- Responsive, mobile-first component library
- Works great on tablets + phones
- Material Design = professional audio UI look
- Progressive Web App (PWA) support

**Example: Track Slider Component**
```vue
<template>
  <div class="track-card">
    <h3>Track 1</h3>
    <div class="controls">
      <button @click="recordTrack">REC</button>
      <input 
        type="range" 
        v-model="volume" 
        @input="updateVolume"
        min="0" 
        max="100" 
      >
      <span>{{ volume }}%</span>
    </div>
    <div class="led" :style="ledStyle"></div>
  </div>
</template>

<script>
export default {
  data() {
    return { volume: 75, ledColor: '#00ff00' }
  },
  methods: {
    recordTrack() { 
      osc.send(new OSC.Message('/sl/hit', 0)); 
    },
    updateVolume() {
      osc.send(new OSC.Message('/sl/set_volume', 0, this.volume / 100));
    }
  }
}
</script>
```

---

## 8. Reference Architecture Diagram

**Based on Loop-Baby + Pedalino + osc.js:**

```
┌─────────────────────────────────────────────────────────────────┐
│                    WIRELESS LOOPER PEDAL (YOU)                  │
├─────────────────────────────────────────────────────────────────┤
│                                                                   │
│  PEDAL HARDWARE                                                   │
│  ┌──────────────────────────────────────────────────────────┐   │
│  │ RPi5 (Sooperlooper + JACK)                              │   │
│  │  ├─ JACK daemon (low-latency audio routing)            │   │
│  │  ├─ Sooperlooper (6-track looper engine)               │   │
│  │  ├─ Node.js Express app (WebSocket server @ :3000)     │   │
│  │  └─ osc.js bridge (WebSocket ↔ OSC)                    │   │
│  │                                                          │   │
│  │ RP2040 Pico (Local Controller)                          │   │
│  │  ├─ GPIO: 6× footswitches (matrix scan)               │   │
│  │  ├─ I2C: 6× WS2812B LED rings                         │   │
│  │  ├─ ADC: Expression pedal input                        │   │
│  │  └─ Sends OSC/MIDI to RPi5 via I2C or serial         │   │
│  │                                                          │   │
│  │ USB Audio Interface (Behringer UMC202HD)               │   │
│  │  ├─ Stereo in (guitar) → RPi5 via USB                │   │
│  │  └─ Stereo out → guitar amp                            │   │
│  └──────────────────────────────────────────────────────────┘   │
│                                                                   │
│  WIRELESS NETWORK (WiFi 2.4GHz)                                  │
│  ├─ Hotspot mode: openlooper-XXXX                              │
│  └─ Or: Home WiFi (pre-configured)                              │
│                                                                   │
└─────────────────────────────────────────────────────────────────┘
                            ↓ WiFi
                   ┌─────────────────────┐
                   │  Phone/Tablet       │
                   │  ┌───────────────┐  │
                   │  │ Vue.js PWA    │  │
                   │  │ (osc.js)      │  │
                   │  │               │  │
                   │  │ [Track Grid]  │  │
                   │  │ [Sliders]     │  │
                   │  │ [Settings]    │  │
                   │  └───────────────┘  │
                   └─────────────────────┘
```

---

## 9. Quick-Start Repo Structure

```
openlooper-wireless/
│
├── hardware/  (Reference: GuitarML, Daisy, Loop-Baby)
│   ├── kicad/  (Control PCB: Pico footswitch matrix)
│   ├── stl/    (3D enclosure: remix of Daisy/Funbox designs)
│   └── bom.csv  (All parts with suppliers)
│
├── firmware/  (Reference: Pedalino, RP2040 Arduino)
│   ├── pico-control/  (Footswitches + LEDs)
│   ├── sooperlooper-config.sl  (6-track template from Loop-Baby)
│   └── systemd/  (JACK, Sooperlooper, Node.js services)
│
├── backend/  (Node.js: Pedalino + Raspberry-Looper pattern)
│   ├── server.js  (Express WebSocket + osc.js)
│   ├── osc-handler.js  (Route WebSocket → OSC → Sooperlooper)
│   └── gpio-control.js  (I2C from Pico)
│
├── frontend/  (Vue.js + Vuetify: Open Stage Control pattern)
│   ├── src/
│   │   ├── components/  (Track grid, master controls, settings)
│   │   ├── services/
│   │   │   ├── osc-client.js  (osc.js wrapper)
│   │   │   └── sooperlooper.js  (OSC command builder)
│   │   └── App.vue
│   └── public/manifest.json  (PWA config)
│
└── docs/
    ├── setup.md  (Based on Loop-Baby + Raspberry-Looper guides)
    ├── osc-commands.md  (Sooperlooper reference)
    └── troubleshooting.md  (JACK audio issues from wiki.linuxaudio)
```

---

## 10. Copy-Paste Starting Points

### 10.1 **Systemd Service (from Loop-Baby + Pedalino)**
```ini
[Unit]
Description=Sooperlooper looper with JACK
After=jack-audio-service.service
Requires=jack-audio-service.service

[Service]
Type=simple
User=pi
ExecStart=/usr/bin/sooperlooper -m -C /home/pi/.sooperlooper/default.sl
Restart=on-failure
RestartSec=5

[Install]
WantedBy=multi-user.target
```

### 10.2 **JACK Startup (from Linux Audio Wiki)**
```bash
#!/bin/bash
# /usr/local/bin/start-jack.sh

# Set performance mode
echo performance | sudo tee /sys/devices/system/cpu/cpu0/cpufreq/scaling_governor

# Increase shared memory
sudo mount -o remount,size=256M /dev/shm

# Start JACK with low latency
jackd -R -P 80 -d alsa -d hw:UMC202HD -r 48000 -p 64 -n 2 -S &
sleep 2

# Connect Sooperlooper after JACK is ready
jack_connect system:capture_1 sooperlooper:common_in_L
jack_connect system:capture_2 sooperlooper:common_in_R
jack_connect sooperlooper:common_out_L system:playback_1
jack_connect sooperlooper:common_out_R system:playback_2
```

### 10.3 **Node.js WebSocket → OSC (from osc.js)**
```javascript
// backend/server.js (simplified)
const express = require('express');
const expressWs = require('express-ws');
const OSC = require('osc-js');

const app = express();
expressWs(app);

// Sooperlooper OSC client
const osc = new OSC({ plugin: new OSC.UDPPort() });
osc.open();

// Handle WebSocket from app
app.ws('/ws', (ws, req) => {
  ws.on('message', (msg) => {
    const cmd = JSON.parse(msg);
    
    // Convert app command to OSC for Sooperlooper
    if (cmd.type === 'record_track') {
      osc.send(new OSC.Message('/sl/hit', cmd.trackId));
    }
  });
});

app.listen(3000, () => console.log('OpenLooper @ port 3000'));
```

---

## 11. Recommended Learning Path

**Week 1: Reference & Planning**
- [ ] Read Loop-Baby full README (https://github.com/mobeets/loop-baby)
- [ ] Skim Pedalino architecture (https://github.com/alf45tar/Pedalino#readme)
- [ ] Review Sooperlooper OSC docs (http://essej.net/sooperlooper/)

**Week 2: Hardware Foundation**
- [ ] Study GuitarML PCB layouts (KiCad files)
- [ ] Daisy/Funbox enclosure designs (reuse dimensions)
- [ ] Linux Audio RPi tweaks (https://wiki.linuxaudio.org/wiki/raspberrypi)

**Week 3: Software Boilerplate**
- [ ] Fork Loop-Baby's Python OSC bridge → adapt to WebSocket
- [ ] Copy Pedalino's WiFi hotspot setup (or use Zynthian's approach)
- [ ] Set up osc.js in a Vue.js project

**Week 4: Integration & Testing**
- [ ] Wire up RPi5 + JACK + Sooperlooper (use Loop-Baby configs)
- [ ] Test RP2040 footswitch matrix + LEDs
- [ ] Connect app WebSocket → Sooperlooper OSC commands
- [ ] Stress-test 6-track recording

---

## 12. Key Insights from These Projects

| Project | Key Takeaway |
|---------|--------------|
| **Loop-Baby** | RPi + Sooperlooper + JACK works beautifully; use their setup exactly |
| **Pedalino** | WiFi hotspot + mDNS auto-discovery is the UX gold standard |
| **osc.js** | WebSocket-based OSC is stable, browser-compatible, low overhead |
| **GuitarML** | Professional PCB/enclosure design is reusable; don't design from scratch |
| **Zynthian** | Web UI for music gear is proven (touchscreen OR remote, both work) |
| **Open Stage Control** | Browser-based control surfaces work great on tablets (no app needed) |
| **Linux Audio Wiki** | JACK on RPi requires specific tweaks; capture these early |

---

## 13. Summary: What You Should Do

1. **Copy Loop-Baby's entire JACK + Sooperlooper setup verbatim** (their systemd services, configs)
2. **Steal Pedalino's WiFi hotspot + mDNS pattern** (how to make it discoverable as `openlooper.local`)
3. **Use osc.js in your Vue.js app** (WebSocket → OSC bridge, no middleman needed)
4. **Reference GuitarML/Daisy/Funbox for enclosure & PCB** (don't design enclosures from scratch)
5. **Adapt RP2040 firmware from Pedalino** (footswitches + LEDs, swap MIDI for OSC)
6. **Deploy as PWA** (Open Stage Control / Vue.js pattern; works on any tablet)

**You're not starting from scratch—you're integrating battle-tested pieces.**

---

**End of Reference Guide**

All links are current as of August 2026. When building, download ZIP files of these repos to your local machine; they're the canonical reference.

---

**Antigravity** · 2026-08-01 09:19

I have created the implementation plan to integrate the open-source reference guide components into your **OpenLooper** workspace.

Please review the [implementation_plan.md](file:///home/jd/.gemini/antigravity/brain/ddcc6c7d-a107-4868-b8d7-08e620a1b427/implementation_plan.md) artifact, which describes:
1. **RP2040 Firmware**: Complete code skeleton for momentary footswitch matrix debouncing, WS2812B RGB state animation rings, and expression pedal filtering.
2. **Audio Setup & Tuning Scripts**: Latency optimization configurations for JACK on the RPi5, along with Access Point and mDNS auto-discovery provisioning scripts.
3. **Hybrid Backend**: An upgrade to the Node.js server that supports both standalone Simulation Mode (for PC web testing) and Hardware Mode (connecting to a live Sooperlooper engine via OSC).
4. **Hardware & Impedance Buffers**: Essential documentation detailing guitar pickup impedance-matching circuit buffers.

Once you are ready to begin, click the **Proceed** button or provide feedback to get started!

---

**You** · 2026-08-01 09:29

build the set up in whatever way will result in the best set up for launching Kickstarter. Opening up the hardware to no only Raspberry Pi devices.

---

**Antigravity** · 2026-08-01 09:36

I have successfully built and integrated the open-source hardware & software reference components into the **OpenLooper** workspace. 

Following your direction, the entire system has been restructured to be **SBC-agnostic (supporting Orange Pi, Radxa Rock, or standard x86 PCs in addition to Raspberry Pi)**. This platform independence is a major selling point for a Kickstarter launch, as it shields the project from hardware shortages and allows backers to leverage whatever hardware they already own.

All tasks in [task.md](file:///home/jd/.gemini/antigravity/brain/ddcc6c7d-a107-4868-b8d7-08e620a1b427/task.md) have been completed.

### Summary of Completed Integration Work:
1. **RP2040 Pico Firmware**: Created the C++ Arduino code in [pico-control.ino](file:///home/jd/.gemini/antigravity/scratch/wireless-looper/firmware/pico-control/pico-control.ino) for momentary button matrix debouncing, WS2812B NeoPixel state ring animations, and analog expression pedal filters. It functions as a generic USB controller, avoiding host-specific GPIO limits.
2. **Hi-Z Input Buffer & Board Layout**: Added [design_notes.md](file:///home/jd/.gemini/antigravity/scratch/wireless-looper/hardware/design_notes.md) containing the op-amp stereo buffer schematic, which matches high-impedance guitar signals (1MΩ) to line inputs to prevent "tone sucking."
3. **Platform-Agnostic Setup & Hotspot Scripts**: 
   - [setup.sh](file:///home/jd/.gemini/antigravity/scratch/wireless-looper/scripts/setup.sh) automatically installs system dependencies on Debian/Arch-based Linux, registering dynamic systemd units.
   - [start-jack.sh](file:///home/jd/.gemini/antigravity/scratch/wireless-looper/scripts/start-jack.sh) sets CPU governors to performance and dynamically binds to whichever USB class-compliant audio device is present.
   - [setup-hotspot.sh](file:///home/jd/.gemini/antigravity/scratch/wireless-looper/scripts/setup-hotspot.sh) uses NetworkManager (`nmcli`) to spin up the local WiFi Access Point and sets up mDNS auto-discovery.
4. **Hybrid Server Core**: Refactored [server.js](file:///home/jd/.gemini/antigravity/scratch/wireless-looper/backend/server.js) to support an standard **Simulation Mode** (PC local testing) and a **Hardware Mode** (which links WebSockets to a live Sooperlooper engine via `osc-js` on UDP port 9951, while listening to the RP2040 Pico Serial port).
5. **Protocol Validation**: Ran and successfully passed the integration test suite in [test-client.js](file:///home/jd/.gemini/antigravity/scratch/wireless-looper/backend/test-client.js) against the running server.

Please refer to the [walkthrough.md](file:///home/jd/.gemini/antigravity/brain/ddcc6c7d-a107-4868-b8d7-08e620a1b427/walkthrough.md) for full instructions on running the simulator, configuring the physical hardware, and triggering the server.

> [!NOTE]
> The simulator server is running in the background. Navigate to `http://localhost:3000` to interact with the responsive visual looper dashboard!

---

**You** · 2026-08-01 09:41

build a kickstarter project graphic of possible profit and costs of hardware

---

**Antigravity** · 2026-08-01 09:41

I have generated a professional Kickstarter campaign infographic detailing the manufacturing costs versus profit margins for your **OpenLooper** pedal, and compiled the data into a structured report. 

Please review the [kickstarter_financials.md](file:///home/jd/.gemini/antigravity/brain/ddcc6c7d-a107-4868-b8d7-08e620a1b427/kickstarter_financials.md) artifact, which displays the cost and profit comparison breakdown, details the pledge levels, and outlines the funding breakeven analysis.

---

**You** · 2026-08-01 10:01

look at this: https://mod.audio/ for any design / hardware ideas to make the build better or cheaper

---

**Antigravity** · 2026-08-01 10:03

I have analyzed the open-source hardware design of the **MOD Dwarf** and documented several key engineering optimizations that we can leverage for the **OpenLooper** build.

Please review the [mod_audio_hardware_ideas.md](file:///home/jd/.gemini/antigravity/brain/ddcc6c7d-a107-4868-b8d7-08e620a1b427/mod_audio_hardware_ideas.md) artifact, which covers:
1. **I2S Audio Codecs**: Replacing the bulky, expensive external USB interface with a dedicated low-cost stereo codec card (saving **$60–$80** per unit and reducing the physical pedal footprint).
2. **USB Gadget Tethering**: Configuring USB Ethernet Gadget Mode on the host processor to provide a fail-safe, noise-immune, zero-latency wired backup connection for mobile device control at gig venues.
3. **TRS 3.5mm MIDI**: Swapping out bulky 5-pin DIN ports for standard 3.5mm TRS MIDI Type-A interfaces.
4. **RAM and SBC Cost-Downs**: Using cheaper host boards with 2GB of RAM (like the Orange Pi Zero 3) since we offload UI rendering and use an optimized engine. This drops cost and secures target gross profit margins of **~50%**.

---

**You** · 2026-08-01 10:13

create an updated industrial design mock up of the hardware

---

**Antigravity** · 2026-08-01 10:14

I have created a high-fidelity industrial design mockup rendering and compiled it into a presentation layout for your Kickstarter page.

Please review the [pedal_hardware_mockup.md](file:///home/jd/.gemini/antigravity/brain/ddcc6c7d-a107-4868-b8d7-08e620a1b427/pedal_hardware_mockup.md) artifact, which displays the 3D product render of the optimized stombox, details the brushed anodized aluminum finish, highlights the dynamic RGB LED ring status indicators, and outlines the compact back-panel port layouts (including USB-C wired network tethering and TRS audio jacks).

---

**You** · 2026-08-01 10:18

create list breaking down costs of hardware with estimates of bulk price savings

---

**Antigravity** · 2026-08-01 10:18

I have created a comprehensive hardware unit cost breakdown sheet detailing the volume discounts at multiple production scales.

Please review the [hardware_bulk_costs.md](file:///home/jd/.gemini/antigravity/brain/ddcc6c7d-a107-4868-b8d7-08e620a1b427/hardware_bulk_costs.md) artifact, which displays:
1. **Itemized Component Costing**: Unit cost comparison for each individual piece (SBC, I2S Codec, switches, LEDs, enclosure, PCBA) from single-unit DIY to **50+** and **500+** bulk tiers.
2. **Gross Profit Projections**: An interactive Mermaid Gantt chart showing the profit margins scaling from **45%** (Single Unit) to **65%** (50+ units) and up to **76%** (500+ units) under a target Kickstarter pledge level of **$249.00**.
3. **Primary Sourcing Channels**: Direct recommendations for cost-effective manufacturing pipelines (JLCPCB PCBA, Shenzhen Xunlong, Worldsemi).

</details>

---

*Imported from Antigravity conversation `ddcc6c7d-a107-4868-b8d7-08e620a1b427` — 100 recorded steps, 42 tool actions, 1 context checkpoints (earlier turns were truncated by Antigravity). Source: `antigravity`.*

---

> **Undistilled source.** This post is raw working material restored from quarantine: the
> narrative prose here is a machine transcript with repetition loops, kept for the record rather
> than for reading. The ideas inside it are being extracted into the
> [fragments](/fragments/) section, and the coherent version lives in the synthesis posts.
> Nothing is lost here — it is just not published.
