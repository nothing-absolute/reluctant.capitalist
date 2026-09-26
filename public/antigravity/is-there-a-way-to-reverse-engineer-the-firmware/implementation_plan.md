# Hybrid DIY OP-1 Synth Build Plan: "OP-XY"

This document outlines the conceptual design and implementation plan for a new DIY hardware synthesizer ("OP-XY") that merges the stable, production-ready **hardware architecture of the LMN-3** with the **UI/UX philosophy and aesthetic styling of OTTO** (inspired directly by the Teenage Engineering OP-1).

## User Review Required

> [!IMPORTANT]
> This plan proposes a hybrid architecture using **Raspberry Pi + Teensy** for hardware (derived from LMN-3) running a custom **JUCE-based application** that implements **OTTO's vector graphic UI and workflow**. 
> Please review the hardware components, the choice of the programming stack, and the software structure.

---

## Proposed System Architecture

### 1. Hardware Specs (LMN-3 Foundation)
*   **Main Processor**: Raspberry Pi 4 (or Pi 5) hosting the main Linux OS, rendering the UI, and running the primary DSP engine.
*   **Keyboard Controller**: Teensy 4.1 handling mechanical keyboard scans (grid format) and passing latency-free MIDI to the Pi over USB.
*   **Display**: Hyperpixel 4.0 (800x480 resolution, high refresh rate IPS display) connected to the Pi's DPI interface.
*   **Audio Interface**: PCM5102a or SGTL5000 based low-latency stereo I2S DAC board.
*   **Controls**: 4x Endless Rotary Encoders (mapped to Blue, Green, White, Orange) plus system command buttons.

### 2. Software Architecture (Hybrid LMN-3 & OTTO)
We will create a codebase template structured to build a standalone audio application:
*   **GUI Framework**: JUCE (C++) or Raylib (C/C++) for rendering smooth vector graphics similar to OTTO's vector engine.
*   **Audio Engine**: JUCE Audio Engine or Tracktion Engine (combining samplers, syntheis engines, and a virtual 4-track tape).
*   **DSP Integration**: A plug-and-play modular architecture allowing custom C++ DSP engines or embedded `libpd` (Pure Data) patches.

---

## Proposed Changes / Project Structure

We will initialize a new workspace directory for this project at:
`[local path redacted]/`

Within this directory, we will structure:
*   `hardware/`: 3D printing STL files, PCB schematics (KiCad), and wiring diagrams.
*   `firmware-teensy/`: Arduino/Teensy C++ code for keyboard scan matrix and MIDI-over-USB encoder handlers.
*   `software-pi/`: The C++/JUCE application structure, containing:
    *   `src/gui/`: Vector renderings of synths, envelopes, and tape.
    *   `src/dsp/`: Synthesizer modules (FM, Subtractive, Sampler) and virtual tape recorder.
*   `docs/`: Build guide, setup instructions, and pin mappings.

---

## Verification Plan

### Automated/Simulation Verification
- Build and run the software interface locally in a windowed desktop simulator environment to test encoder inputs, key mappings, and screen rendering without requiring physical hardware.
- Unit tests for the virtual 4-track tape recorder and the FM synthesis engine.

### Manual Hardware Verification
- Deploying the compiled Teensy firmware and checking serial MIDI data.
- Running the GUI on a Raspberry Pi with a Hyperpixel screen.
