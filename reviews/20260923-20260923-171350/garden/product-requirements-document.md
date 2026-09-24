---
title: "Product_Requirements_Document"
description: "This document outlines the architecture and market strategy for a dual-platform ecosystem designed to monitor and intercept sub-harmonic (infrasonic) frequencies in consumer…"
date: "2026-09-05"
vault: false
tags: ["antigravity","artifact"]
source: "antigravity://39a111a2-ccbd-402d-8470-db9a6c8faca4/Product_Requirements_Document.md"
---
## Product Requirements Document (PRD): Sub-Harmonic Audio Monitoring Ecosystem

### 1. Executive Summary

This document outlines the architecture and market strategy for a dual-platform ecosystem designed to monitor and intercept sub-harmonic (infrasonic) frequencies in consumer audio. What begins as a specialized health and audio-monitoring tool expands into a highly versatile hardware platform with applications in the maker/hacker space, digital minimalism, and parental controls.

The product is split into two primary builds sharing a unified backend:

1. **Software (SaaS/VST)**: A system-level audio interceptor for desktop/workstations.
2. **Hardware (SBC-based)**: A physical pass-through device available in multiple form factors, featuring low-power displays (E-ink/LCD).

### 2. Product Line 1: Software / SaaS Application

A desktop-focused application that analyzes audio *before* it reaches the system's Digital-to-Analog Converter (DAC).

- **Core Technology**: Implemented as a Virtual Studio Technology (VST) plugin or system-level virtual audio driver.
- **Functionality**:
  - Intercepts the main audio bus of the OS (Windows/macOS).
  - Performs real-time Fast Fourier Transform (FFT) focused on the 0Hz - 20Hz spectrum.
  - Visualizes the presence of sub-harmonics and can optionally apply high-pass filters to neutralize them.
- **Backend**: The digital signal processing (DSP) logic written in C++ (standard for VSTs) or Rust, designed to be highly portable so it can be shared with the hardware build.

### 3. Product Line 2: Hardware Ecosystem

A physical device running an embedded Linux OS on a Single Board Computer (SBC), utilizing the same DSP backend as the SaaS application.

#### 3.1 Core Hardware Specifications

- **Compute**: SBC running a lightweight, customized Linux distribution.
- **Audio I/O**: High-fidelity ADC (Analog-to-Digital) and DAC (Digital-to-Analog) for pass-through. Supports standard analog (3.5mm, RCA) and digital (USB, Optical/TOSLINK) inputs/outputs.
- **Interface**: Touch-enabled display. Options for either standard LCD or E-ink (for low power and low-stimulus environments).

#### 3.2 Form Factors

The hardware will be modular, allowing the core SBC and audio board to be housed in different chassis:

1. **Desktop / Home Stereo**: A premium, rack-mountable or desk-sitting unit designed to sit between a media receiver and speakers/amplifiers.
2. **Portable**: A small, battery-powered "dongle" or pocket-sized device for on-the-go headphone use.
3. **Phone Case**: A slim form factor designed to snap onto the back of a smartphone, connecting via USB-C for audio interception and power.

### 4. Market Strategy & Alternative Use Cases

The "Phone Case" form factor, coupled with an E-ink display, unlocks several massive secondary markets beyond audio monitoring.

#### 4.1 The "Hacker / Maker" Market

- **Feature**: The device acts as a secondary, hackable screen attached to the back of an Android phone.
- **Use Case**: Users can write custom scripts to display notifications, weather, crypto tickers, or custom interfaces on the E-ink display via the USB-C connection, turning it into an open-source hardware playground.

#### 4.2 The "Digital Minimalism" Market

- **Feature**: A minimalist phone alternative.
- **Use Case**: Users trying to reduce screen time can flip their phone over and interact solely with the E-ink display on the case for essential tasks (calls, texts, audio control), avoiding the highly stimulating, dopamine-driven main color display of the smartphone.

#### 4.3 The "Parental Control" Market (The Trojan Horse)

- **Feature**: Deep OS integration for low-stimulation lockdown.
- **Use Case**: Parents install a custom Open Source Android ROM (e.g., a modified AOSP build) on the child's phone. Through the parent's companion app, they can trigger a "Lockdown Mode."
- **Execution**:
  - The main, highly stimulating color OLED screen of the phone is completely disabled or locked.
  - The OS forces all UI routing to the E-ink display on the phone case.
  - The E-ink display provides a low-stimulation, slow-refresh UI that only allows access to parent-approved apps (e.g., Phone, Calculator, Maps).
  - **Psychological Benefit**: Instead of just taking the phone away, the phone remains functional for safety/communication, but the frustratingly slow and colorless E-ink display naturally disincentivizes doom-scrolling or recreational use during study or sleep hours.

### 5. Technical Feasibility & Next Steps

#### 5.1 Engineering Challenges to Address

1. **VST System-Wide Routing**: Standard VSTs run inside a Digital Audio Workstation (DAW). To monitor *all* system audio (Spotify, Netflix, Games), you need a Virtual Audio Driver (like Voicemeeter or BlackHole) to route system audio through your VST host before hitting the DAC.
2. **E-ink Refresh Rates vs. Audio Visualization**: E-ink displays have notoriously slow refresh rates. If the device needs to show a real-time moving audio equalizer, LCD is required. If E-ink is used, the audio visualization must be simplified to static threshold warnings (e.g., a slowly blinking icon if infrasound is detected).
3. **Android OS Modification**: The parental control feature requires deep AOSP (Android Open Source Project) modification to seamlessly switch primary display outputs and lock the main screen at a hardware/kernel level. Alternatively, it could be implemented via a strict Mobile Device Management (MDM) profile.

#### 5.2 Recommended Development Phases

- **Phase 1: The DSP Core**: Develop the underlying algorithm to detect sub-harmonics accurately. Test this as a standalone Python or C++ script.
- **Phase 2: SaaS / Desktop MVP**: Wrap the DSP core in a VST3 plugin and create the desktop user interface.
- **Phase 3: SBC Hardware Prototype**: Port the backend to a Raspberry Pi or similar SBC. Connect a USB audio interface and a small touchscreen to prove the hardware pass-through concept.
- **Phase 4: The Phone Case & Android App**: Develop the physical case form factor, the USB-C communication protocol between the phone and the case, and the Android companion app/ROM for the secondary screen features.
