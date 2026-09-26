# Walkthrough: Pivot to 4-Track Display-Driven Loop Pedal (OpenLooper)

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
