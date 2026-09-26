# OpenLooper: Industrial Design & Hardware Mockup

This document outlines the industrial design decisions for the **OpenLooper** wireless looper pedal. By removing the expensive display screen, the hardware is simplified to a rugged, premium, pedalboard-friendly stompbox that leverages external devices (phones/tablets) for visual control.

---

![OpenLooper Industrial Design Stompbox Mockup]([local path redacted])

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
