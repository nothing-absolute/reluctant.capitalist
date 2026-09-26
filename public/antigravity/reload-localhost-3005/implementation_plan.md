# Implementation Plan - 4-Track Loop Pedal with Screen (OpenLooper)

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
