---
title: "reload localhost:3005"
description: "Implementation plan for 4-track loop pedal with onboard display screen"
date: "2026-08-01"
tags: ["project-update","hardware-redesign","kickstarter-launch"]
source: "antigravity://ceabce17-c09c-4849-83bd-4247d600ee3c"
draft: false
---

reload localhost:3005

## implementation plan

## Implementation Plan - 4-Track Loop Pedal with Screen (OpenLooper)

We will adapt the existing **OpenLooper** project to transition from a 6-track wireless-only looper into a **4-track loop pedal with an onboard display screen**, making it ready for a successful open-hardware Kickstarter launch.

This plan covers updates across:
1. **Virtual Hardware & App Simulator** (Backend & Frontend public HTML/CSS/JS)
2. **Pico Controller Firmware** (Arduino code)
3. **Hardware Documentation** (BOM & Design Notes)
4. **Kickstarter Campaign Blueprint** (Project pitch, reward tiers, roadmap)

---

## User Review Required

> [!IMPORTANT]
> **Key Architecture Decisions:**
> 1. **Track Redirection**: We are downsizing the tracks from 6 to 4 to align with physical pedal layout form factors (Hammond 1590DD size fits a 2x2 stomp grid plus a screen perfectly).
> 2. **Screen Protocol**: The physical screen will be a **1.3" ST7789 IPS LCD (SPI, 240x240)**. The screen can be driven directly by the host processor (Raspberry Pi/SBC) via SPI for rich GUI graphics, or by the RP2040 Pico for a low-level status display. To maintain the SBC-agnostic nature of the project, we will design the screen to run off the host Raspberry Pi/SBC via direct Linux SPI, keeping the Pico as a pure controller hub.
> 3. **License Strategy**: Standardizing on **CERN OHL-1.2** for hardware schematics/PCBs and **GPL-3.0** for software, which matches existing guidelines and builds trust in the Kickstarter maker community.

---

## Proposed Changes

### 1. Web & WebSocket Backend

#### [MODIFY] [server.js](file://[local path redacted])
* Change `looperState.tracks` array length from 6 to 4.
* Adjust serial / OSC message bindings to restrict to 4 tracks.

---

### 2. Frontend Simulator UI

#### [MODIFY] [index.html](file://[local path redacted])
* Reduce the physical footswitch simulation buttons from 6 to 4.
* Add an HTML container `#hardware-screen` representing the physical IPS screen on the pedal case.
* Change setlist presets text to refer to 4 tracks.

#### [MODIFY] [style.css](file://[local path redacted])
* Update `.footswitches-grid` to a 2x2 grid layout (perfect balance for 4 tracks).
* Add styling for the `.pedal-screen` representing the on-device ST7789 display (glow effect, monospace font, responsive grid for 4 tracks, visual progress bars).

#### [MODIFY] [app.js](file://[local path redacted])
* Limit track elements queries and click listeners to 4.
* Implement UI logic to update the on-device screen elements:
  * Track states (REC, PLAY, DUB, PAUSED, EMPTY) with state-specific colors.
  * Active loop playhead progress bars synchronised to the audio/playhead state.
  * BPM and Master Volume readings.

---

### 3. Controller MCU Firmware

#### [MODIFY] [pico-control.ino](file://[local path redacted])
* Change `NUM_TRACKS` to 4.
* Update `FOOTSWITCH_PINS` to include only 4 GPIO pins (`2, 3, 4, 5`).
* Update LED pixel mapping (4 LED rings instead of 6, totaling 96 addressable LEDs).

---

### 4. Hardware Documentation & Bill of Materials

#### [MODIFY] [bom.csv](file://[local path redacted])
* Remove 2x footswitches and 2x LED rings from the count.
* Add the **ST7789 240x240 SPI TFT Screen** to the list of parts.
* Recalculate single unit and bulk cost estimates.

#### [MODIFY] [design_notes.md](file://[local path redacted])
* Update architecture diagram showing the host SBC driving the ST7789 LCD over SPI, while the RP2040 Pico continues managing the footswitches/LEDs over USB Serial.
* Document the wiring pinout between the Raspberry Pi / SBC and the ST7789 SPI screen.
* Adjust Pico GPIO pinout table to reflect 4 tracks.

---

### 5. Kickstarter Campaign Asset

#### [NEW] [kickstarter_campaign.md](file://[local path redacted])
* Write a rich Kickstarter campaign page blueprint, detailing the product value proposition, hardware/software specifications, pledge tiers (PCB-only, DIY maker kits, fully built pedals), funding goals, and manufacturing plan.

---

## Verification Plan

### Automated Tests
* Run `npm test` in the backend directory to check websocket command communication with the new 4-track schema.

### Manual Verification
1. Open the virtual pedal dashboard in a browser at `http://localhost:3000`.
2. Verify the physical simulator contains exactly 4 footswitches in a 2x2 grid.
3. Verify that pressing physical footswitches triggers loop states (REC ➔ PLAY ➔ OVERDUB) and that the simulated on-device LCD screen updates its status and progress bars in real-time.
4. Verify that the mobile control surface side-by-side matches the 4-track layout.
5. Review the new `kickstarter_campaign.md` to ensure all marketing copy, specs, and reward tiers are correct.

## tablet looper setup

## Setup Guide: Linux Tablet Live Looper with Sooperlooper & MIDI

This architecture blueprint details how to build a highly portable, touch-optimized, low-latency live looping station using a **Linux-capable tablet**, a **USB MIDI Foot Controller**, and the headless **Sooperlooper** audio engine.

---

## 1. Hardware Architecture

```
┌────────────────────────────────────────────────────────────────────────┐
│                        TOUCH TABLET (PineTab 2 / Linux)                │
│                                                                        │
│   ┌────────────────────────────────────────────────────────────────┐   │
│   │              Touch Web App GUI (localhost:3000)                │   │
│   │   [ Track 1 ]   [ Track 2 ]   [ Track 3 ]   [ Track 4 ]        │   │
│   │    Rec/Play      Rec/Play      Rec/Play      Rec/Play          │   │
│   └───────────────────────────────┬────────────────────────────────┘   │
│                                   │ WebSockets                         │
│                                   ▼                                    │
│   ┌────────────────────────────────────────────────────────────────┐   │
│   │              OpenLooper Node.js Server & OSC Bridge            │   │
│   └───────────────────────────────┬────────────────────────────────┘   │
│                                   │ OSC (UDP 9951)                     │
│                                   ▼                                    │
│   ┌────────────────────────────────────────────────────────────────┐   │
│   │              Sooperlooper Daemon (Headless Audio Engine)       │   │
│   └────────────────────────────────────────────────────────────────┘   │
└───────────────────────────────────▲────────────────────────────────────┘
                                    │ USB OTG Connections
            ┌───────────────────────┴───────────────────────┐
            │                                               │
            │ USB MIDI                                      │ USB Audio
  ┌─────────┴─────────┐                           ┌─────────┴─────────┐
  │  MIDI Foot Pedal  │                           │   Audio Interface │
  │ (MeloAudio / Soft)│                           │ (Focusrite Solo)  │
  └───────────────────┘                           └─────────┬─────────┘
                                                            │ Stereo Out
                                                            ▼  To PA/Amp
```

### Component Selection
1. **The Tablet (PineTab 2 or PostmarketOS Tablet)**:
   * **Recommended**: **PineTab 2** (Natively runs Linux, quad-core ARM, with standard Arch Linux ARM / DanctNIX).
   * **Alternative**: A high-end Android tablet (e.g., Samsung Galaxy Tab S9) running Linux via a rooted environment. Note that non-rooted Android virtual environments (PRoot/Termux) add significant audio latency.
   * **Touch UI Desktop Environment**: **Phosh** (Phone Shell based on GNOME) or **KDE Plasma Mobile**. Both offer large touch targets, on-screen keyboards, and fluid gesture navigation.
2. **MIDI Foot Controller**:
   * **MeloAudio MIDI Commander** or **Keith McMillen SoftStep 2**: Rugged, USB class-compliant, compact footprint.
3. **USB Audio Interface**:
   * **Focusrite Scarlett Solo / 2i2** or **Behringer UMC202HD**: Class-compliant USB interfaces that work out of the box in Linux.
4. **USB-C OTG Hub**:
   * A multi-port hub with power delivery (PD) to connect the MIDI pedal, audio interface, and charge the tablet simultaneously.

---

## 2. Low-Latency Linux Audio Setup (PipeWire & JACK)

To make live looping usable, audio latency must be below **10ms** (ideally 5ms). This requires bypassing the standard desktop audio stack in favor of **PipeWire** (acting as the JACK server) with low-latency settings.

### Step 1: Install Audio Packages
On Arch-based systems (like PineTab 2), run:
```bash
sudo pacman -S pipewire pipewire-alsa pipewire-jack pipewire-pulse helvum sooperlooper
```

### Step 2: Configure PipeWire for Low Latency
Force PipeWire to run at a small buffer size (64 or 128 samples) and 48kHz sampling rate. Create/edit `~/.config/pipewire/pipewire.conf.d/latency.conf`:
```ini
context.properties = {
    default.clock.rate          = 48000
    default.clock.allowed-rates = [ 48000 ]
    default.clock.quantum       = 64
    default.clock.min-quantum   = 64
    default.clock.max-quantum   = 256
}
```
*At 48kHz and 64 samples, round-trip audio latency is approx. **2.7 milliseconds**.*

---

## 3. Configuring Headless Sooperlooper & MIDI

Instead of using Sooperlooper's old, non-touch-friendly desktop interface (`slgui`), we run the engine headlessly and map physical MIDI commands directly to it.

### Step 1: Start the Headless Engine
Run the `sooperlooper` daemon, configuring it for 4 loops:
```bash
sooperlooper -p 9951 -l 4 -j
```
* `-p 9951`: Binds the engine to OSC port 9951.
* `-l 4`: Allocates 4 tracks.
* `-j`: Automatically registers ports with the JACK (PipeWire) sound server.

### Step 2: MIDI Device Binding Mappings
Connect the MIDI Pedal via USB. It will appear as an ALSA MIDI port.
To check connected MIDI devices:
```bash
aconnect -l
```

Map the MIDI events to Sooperlooper. You can configure Sooperlooper MIDI bindings in a settings file (`~/.sooperlooper/default_bindings.slb`):

```xml
<?xml version="1.0"?>
<sooperlooper_bindings version="1.0">
  <!-- Track 1: Record / Play / Overdub Toggle -->
  <binding control_type="midi_cc" midi_channel="1" cc_number="1" command="hit" argument="record" target="loop0" />
  
  <!-- Track 2: Record / Play / Overdub Toggle -->
  <binding control_type="midi_cc" midi_channel="1" cc_number="2" command="hit" argument="record" target="loop1" />
  
  <!-- Track 3: Record / Play / Overdub Toggle -->
  <binding control_type="midi_cc" midi_channel="1" cc_number="3" command="hit" argument="record" target="loop2" />
  
  <!-- Track 4: Record / Play / Overdub Toggle -->
  <binding control_type="midi_cc" midi_channel="1" cc_number="4" command="hit" argument="record" target="loop3" />
  
  <!-- Global Undo (Button 5) -->
  <binding control_type="midi_cc" midi_channel="1" cc_number="5" command="hit" argument="undo" target="selected" />
  
  <!-- Global Clear (Button 6) -->
  <binding control_type="midi_cc" midi_channel="1" cc_number="6" command="hit" argument="clear" target="all" />
</sooperlooper_bindings>
```

Launch the daemon referencing your MIDI bindings configuration:
```bash
sooperlooper -p 9951 -l 4 -j -b ~/.sooperlooper/default_bindings.slb
```

---

## 4. Touch-Friendly UI: The Hybrid Web Interface

To get a gorgeous, touch-friendly visual feedback screen, run the **OpenLooper Node.js Server** locally on the tablet:

1. Launch the backend server in the background:
   ```bash
   node /path/to/wireless-looper/backend/server.js --hardware
   ```
2. The server connects to the headless `sooperlooper` daemon over OSC (UDP 9951) and hosts the Web GUI on port `3000`.
3. Open a browser on the tablet (e.g. Chromium) and navigate to:
   ```
   http://localhost:3000
   ```
4. Set the browser to **Full Screen** or "Add to Home Screen" as a Progressive Web App (PWA).

This provides a beautiful glassmorphic touch mixer showing live waveforms and playhead progress bars on the tablet screen, while the heavy-duty stomp controls are triggered in low-latency by the MIDI pedal on the floor.

## task

- [x] Update backend/server.js to use 4 tracks instead of 6
- [x] Update index.html to reduce footswitches to 4 and add simulated screen markup
- [x] Update style.css to support a 2x2 footswitches grid and style the simulated LCD screen
- [x] Update app.js to bind to 4 tracks and refresh screen visual state/progress bars
- [x] Update pico-control.ino to use 4 tracks and pin configurations
- [x] Update design_notes.md with SPI display connections and 4-track pinouts
- [x] Update bom.csv with display component and pricing adjustments
- [x] Create kickstarter_campaign.md containing Kickstarter campaign blueprints
- [x] Verify the changes by starting the server and running simulation tests

## walkthrough

## Walkthrough: Pivot to 4-Track Display-Driven Loop Pedal (OpenLooper)

We have successfully migrated the **OpenLooper** architecture and dashboard simulation from a 6-track headless wireless system to a **4-track loop pedal featuring an onboard SPI display screen**.

Here is a summary of the achievements and changes:

---

## 🛠️ Changes Implemented

### 1. Web & WebSocket Backend
* Modified [server.js](file://[local path redacted]) to scale down track processing arrays and messages from 6 tracks to 4 tracks.

### 2. Frontend Casing Display & Footswitches Grid
* Modified [index.html](file://[local path redacted]) to:
  * Downsize the virtual physical footswitches grid from 6 stomp buttons to 4.
  * Integrate an HTML structure for the new simulated on-device screen `#hardware-screen` directly on the pedal chassis.
  * Update preset loading data descriptors.
* Updated [style.css](file://[local path redacted]) to style the display case with a glass-glare dark screen design, formatting the 4-track statuses, playhead progress bars, volume meters, and BPM reading.
* Updated [app.js](file://[local path redacted]) to bind 4-track structures and hook WebSocket messages up to dynamically update the on-device LCD screen elements (timers, states, progress widths, and global parameters).

### 3. Controller MCU Firmware
* Updated [pico-control.ino](file://[local path redacted]) to reduce the tracks constants to 4, update GPIO pin arrays, and adjust NeoPixel LED rings count to 4 (96 total addressable LEDs).

### 4. Hardware Documentation
* Updated [design_notes.md](file://[local path redacted]) to add section 3 mapping out the SPI bus wiring connections (SCK, MOSI, CS, DC, RST, Blk) between the ST7789 display and the host SBC, as well as updating the Pico GPIO layout table.
* Updated [bom.csv](file://[local path redacted]) to add the ST7789 screen item and recalculate estimated unit and bulk costs.

### 5. Kickstarter Campaign Blueprint
* Created [kickstarter_campaign.md](file://[local path redacted]) containing the complete campaign pitch copy, specifications, pledge tiers (PCB-only, DIY kits, fully built pedals), Gantt project roadmap, and project risks.

---

## 🧪 Verification & Test Results

We updated the verification suite [test-client.js](file://[local path redacted]) to resolve race conditions and check for the new 4-track schema.

Running the automated test suite against a clean looper server yields a 100% pass rate:
```
Connecting to simulation server at: ws://localhost:3005/ws
✅ Connection established.

[Received]: type="init"
✅ Received initialization payload.
Global BPM: 120
Tracks count: 4

--- Step 1: Trigger Record Command for Track 0 ---
[Received]: type="track_state"
Track 0 updated: state="recording", loop_time_ms=0
✅ Verification success: Track 0 is now in recording state.

--- Step 2: Trigger Stop Recording / Play for Track 0 ---
[Received]: type="track_state"
Track 0 updated: state="playing", loop_time_ms=1505
✅ Verification success: Track 0 is now in playing state.
Recorded Loop Time: 1505ms

--- Step 3: Trigger Clear Command for Track 0 ---
[Received]: type="track_state"
Track 0 updated: state="empty", loop_time_ms=0
✅ Verification success: Track 0 cleared back to empty.

======================================
🎉 ALL WEBSOCKET TESTS PASSED SUCCESSFULLY! 🎉
======================================
```

The looper simulation server has been restarted on the standard port `3000` so you can open your browser at `http://localhost:3000` to interact with the new display pedal simulator in real-time.

## Assets
- [implementation_plan.md](/antigravity/reload-localhost-3005/implementation_plan.md) — MD, 5 KB
- [tablet_looper_setup.md](/antigravity/reload-localhost-3005/tablet_looper_setup.md) — MD, 9 KB
- [task.md](/antigravity/reload-localhost-3005/task.md) — MD, 695 B
- [walkthrough.md](/antigravity/reload-localhost-3005/walkthrough.md) — MD, 4 KB

<details>
<summary>Chat transcript — 7 messages, 2026-08-01 → 2026-08-01</summary>

**Antigravity** · 2026-08-01 11:19

I have successfully executed the implementation plan and pivoted the OpenLooper project into a 4-track display-driven design. 

Here is a summary of the completed work:
* **Backend**: Updated [server.js](file://[local path redacted]) to support the 4-track schema.
* **Frontend**: Redesigned the physical casing simulator in [index.html](file://[local path redacted]) and [style.css](file://[local path redacted]) to feature a 2x2 footswitches grid and a live virtual LCD screen, with dynamic updates bound in [app.js](file://[local path redacted]).
* **Firmware**: Configured 4 tracks and pin mappings in [pico-control.ino](file://[local path redacted]).
* **Hardware**: Updated [design_notes.md](file://[local path redacted]) to document the ST7789 SPI LCD pinout and [bom.csv](file://[local path redacted]) with component pricing adjustments.
* **Kickstarter Asset**: Authored the campaign pitch, spec sheet, and reward roadmap in [kickstarter_campaign.md](file://[local path redacted]).

For full details of the changes and test results, please refer to the [walkthrough.md](file://[local path redacted]) and checkout the task list at [task.md](file://[local path redacted]). The local simulator is now running at http://localhost:3000 where you can see the new 2x2 physical grid and on-device screen in action!

---

**You** · 2026-08-01 11:22

reload localhost:3005

---

**Antigravity** · 2026-08-01 11:23

The `open_browser_url` tool in the browser subagent failed due to a CDN error (Playwright's driver package returned a 404 from their server), which is a system issue out of my control.

However, the looper simulator server is **successfully running on port 3005**. Since you are running in a Linux environment, you can open and reload the interface directly in your own local web browser:

👉 **[http://localhost:3005](http://localhost:3005)**

Please reload the page in your browser to see the new 4-track layout with the simulated OLED screen. How would you like to proceed?

---

**You** · 2026-08-01 11:29

how about an android tablet set up with Linux OS that best works with touch displays. then a midi pedal for controlling the looper. set up with Sooperlooper

---

**Antigravity** · 2026-08-01 11:29

An Android/Linux tablet running headless Sooperlooper combined with a USB MIDI foot controller on the floor and our local touch dashboard is an exceptional, highly portable setup. 

I have written a detailed setup blueprint in [tablet_looper_setup.md](file://[local path redacted]) covering this architecture. Here is a brief summary of how it works:

1. **Operating System & Shell**:
   * **PineTab 2** or a Linux-native mobile distro (like postmarketOS) is recommended over standard Android to bypass Android's audio drivers.
   * **Phosh** (GNOME Phone/Tablet Shell) or **KDE Plasma Mobile** are the best touch-friendly desktop interfaces.
2. **Low-Latency Audio Routing**:
   * Setup **PipeWire** (as the JACK server replacement) with a force-clock setting of **48kHz** and a **64-sample buffer** to achieve a round-trip audio latency of **~2.7ms**.
3. **MIDI Foot Control**:
   * Connect a USB class-compliant pedal (such as the **MeloAudio MIDI Commander** or **Keith McMillen SoftStep 2**) using a USB-C OTG power-delivery hub.
4. **Headless Engine & Touch UI**:
   * Run the `sooperlooper` engine headlessly in the background via command line, mapped to the pedal inputs via XML bindings.
   * Run the **OpenLooper Web App** locally on `http://localhost:3000` to act as a touch mixing surface on the tablet screen.

---

**You** · 2026-08-01 11:31

what would the costs be?

---

**Antigravity** · 2026-08-01 11:32

Here is the estimated cost breakdown for the **Tablet + MIDI Pedal Setup**, organized into **Budget** and **Pro** tiers:

### 1. Cost Breakdown Table

| Component | Budget Tier | Pro Tier (Linux Native) | Notes |
|:---|:---:|:---:|:---|
| **Tablet** | **$100 – $130** <br>*(Lenovo/Samsung Android)* | **$209** <br>*(PineTab 2 8GB/128GB)* | PineTab 2 runs Linux natively; Android requires running Linux in Termux/PRoot. |
| **MIDI Foot Switch** | **$35 – $40** <br>*(M-Vave Chocolate)* | **$125 – $150** <br>*(MeloAudio MIDI Commander)* | M-Vave is 4-buttons (ultra-compact); MIDI Commander is 10-buttons (metal stage-ready). |
| **USB Audio Interface** | **$80** <br>*(Behringer UMC22)* | **$120** <br>*(Focusrite Scarlett Solo)* | Class-compliant USB inputs/outputs (standard Linux ALSA support). |
| **USB-C OTG PD Hub** | **$20** | **$35** | Crucial for powering the tablet while connecting USB MIDI and Audio. |
| **Cables, Stands & Misc** | **$20** | **$35** <br>*(inc. Tablet Stand Mount)* | USB cables, instrument patch cables, tablet clip. |
| **Software** | **$0** | **$0** | Operating systems, PipeWire, Sooperlooper, and OpenLooper are all open-source. |
| **Total Estimated Cost** | **~$255 – $300** | **~$509 – $549** | |

---

### 2. Comparison with the Custom Hardware Pedal

* **DIY / Pre-Assembled Pedal (Pi 5 + Custom Enclosure)**: **$205 – $328** (DIY parts) or **$299** (assembled).
* **Budget Tablet Setup**: **~$250**
  * *Pros:* Very cost-effective if you already own a tablet; graphical mixer is built-in; zero soldering.
  * *Cons:* Higher audio latency on standard Android; messy cabling on stage (hub, interface, tablet stand, floor pedal).
* **Pro Linux Tablet Setup**: **~$520**
  * *Pros:* Extremely robust; native low-latency audio via PipeWire/JACK; PineTab 2 is pre-configured for Linux.
  * *Cons:* Higher price point; multiple parts to set up/tear down compared to a single all-in-one pedal board.

</details>

---

*Imported from Antigravity conversation `ceabce17-c09c-4849-83bd-4247d600ee3c` — 66 recorded steps, 26 tool actions, 1 context checkpoints (earlier turns were truncated by Antigravity). Source: `antigravity`.*
