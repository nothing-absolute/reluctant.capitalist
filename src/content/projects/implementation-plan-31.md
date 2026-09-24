---
title: "Implementation Plan: Video Graphic FX & Multi-Channel OBS-Style Routing Engine"
description: "Detailed plan for implementing video graphic effects and multi-channel routing."
date: "2026-09-05"
tags: ["video","fx","routing","obs","implementation"]
source: "antigravity://7e8d74f9-5e41-4a79-816e-ebfc01860752/implementation_plan.md"
draft: false
clarity: 4
quality: 4
status: "seed"
stage: "idea"
---

## Implementation Plan: Video Graphic FX & Multi-Channel OBS-Style Routing Engine

### User Review Required

> [!IMPORTANT]
> - **MPC Audio Disabled by Default**: MPC drum pads will trigger visual modulation and pad index/velocity events for visual nodes, but will NOT trigger audio synth playback unless audio synthesis is explicitly enabled.
> - **Expanded Video Node API**: Processing code signatures will be expanded from `function(ctx, w, h, time, mod, padIdx, padVel)` to `function(ctx, w, h, time, mod, padIdx, padVel, inVideoA, inVideoB)` so Processing sketches can directly read, transform, mask, and blend incoming video streams.

### Proposed Changes

#### Core Engine & Routing Architecture

[MODIFY] [App.jsx](file:///home/jd/.gemini/antigravity-ide/scratch/patchbay/src/App.jsx)

- **Audio Defaults**:
  - Update initial state and pad trigger logic so MPC pads do not output audio by default.
  - Set initial default patch to focus on Video Source -> Processing FX -> Video Blend/Mask -> Destination Monitor.

- **OBS-Style Video Source Capabilities**:
  - Extend `video-src` node to support:
    - **Webcam**: Live camera stream via `getUserMedia`
    - **Screen Capture**: Live display/window capture via `getDisplayMedia`
    - **Video File**: Uploaded video files with play/pause/loop controls
    - **Stream**: HLS / Direct MP4 URL / Media Stream
    - **Test Card**: High-definition SMPTE test pattern / geometry generator

- **New Video Processing & Routing Nodes**:
  - `video-blend`: Blends two video channels (`videoA`, `videoB`) using standard and advanced composite modes (Alpha, Multiply, Screen, Overlay, Add, Difference, Color Dodge).
  - `video-mask`: Uses channel `mask` (luminance or alpha from another video stream or Processing sketch) to cut out and filter channel `video`.
  - `video-keyer`: OBS-style Chroma Keyer (Green Screen / Blue Screen removal) with adjustable tolerance, smoothness, and spill suppression.
  - `video-bus`: Multi-channel A/B crossfader and matrix switcher.

- **Processing Code Engine (`vis-custom`)**:
  - Upgrade `getNodeFrame` for `vis-custom` to pass input video textures (`inVideoA`, `inVideoB`) to the compiled Processing render function.
  - Update `SYS_VISUALS` prompt to instruct Gemini on creating live video graphic filters, pixel displacement masks, ASCII generators, edge detectors, and blend shaders.
  - Include interactive Processing preset generator buttons in the terminal drawer (e.g. *Pixel Glitch Filter*, *Edge Detection Mask*, *CRT Scanlines*, *Liquid Ripple Displacer*, *Chroma Mask*).

- **UI & Workspace Enhancements**:
  - Add quick action buttons for adding OBS-style sources, blend/mask nodes, and keyer nodes.
  - Update node canvas styles and port color coding (Video Channels: Teal `#12A5A5`, Mask/Alpha: Purple `#9B7FE8`, Control/Mod: Amber `#D9A000`).

#### Verification Plan

##### Manual Verification
1. **MPC Pad Audio Check**: Press keys (1–4, Q–R, A–F, Z–V) and verify pads light up and send trigger signals to visual nodes, but produce **no sound** by default.
2. **Video Sources**: Test Webcam, Screen Share (`getDisplayMedia`), uploaded video file playback, and test pattern generator.
3. **Multi-Channel Blend & Mask**: Wire two video sources into a `video-blend` node and `video-mask` node, adjusting crossfade and mask threshold.
4. **Processing Sketch Video Filter**: Generate or apply a Processing code sketch that receives `inVideoA` and renders a live graphic filter (e.g., pixelation, edge detection, color thresholding).
5. **Program Monitor**: Confirm live preview on the main output canvas at 60 FPS.

## Related

- [Implementation Plan — COMMONS Landing Page & Kickstarter Refinement]
- [Implementation Plan: Undertone Project Recovery, Pitch Deck & User Acquisition Strategy](/projects/implementation-plan/)
