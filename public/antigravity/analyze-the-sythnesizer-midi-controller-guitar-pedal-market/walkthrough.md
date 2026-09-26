# Project Walkthrough: Voxel Stomp Design Alignment

We have completed the initial alignment and technical specification phase for the **Voxel Stomp** project. The target architecture, hardware design constraints, and looper workflow are now fully defined and approved.

## Summary of Accomplishments

1. **Market Landscape & Feasibility Review:** Evaluated the music tech Kickstarter market. Validated the success of devices like CHOMPI and Tembo, and confirmed the feasibility of running RTNeural/NAM models on embedded hardware (Daisy Seed).
2. **Product Specification & System Architecture:** Created the complete system spec for **Voxel Stomp** in [voxel_stomp_product_spec.md](file://[local path redacted]).
3. **Project Development Repository Setup:** Initialized the scratch development folder in [voxel_stomp/](file://[local path redacted]) to hold future code, schematic, and layout designs.

## Approved Product Configuration

*   **Form Factor:** Premium wedge-shaped anodized aluminum case with solid walnut wood cheeks. Two footswitches + 1-octave mechanical key layout on the face.
*   **Architecture:** Dual-MCU (RP2040 for UI, keys, and display; Daisy Seed dedicated to RTNeural modeling and looper DSP).
*   **Workflow:** Guitar input -> Neural Amp Model -> Sound-on-sound Tape Looper. The mechanical keys act as performance controls to manipulate the loop buffer in real-time (half-speed, reverse, tape-stop, granular freeze).
*   **Interface:** WebUSB/WebMIDI browser utility over USB-C for drag-and-drop model loading to an onboard MicroSD card.
*   **Target Pricing:** $299 Early Bird / $399 Retail (BOM target $75.00).

## Design Render

![Voxel Stomp Product Design Render]([local path redacted])


## Repository Files Created

*   [voxel_stomp_product_spec.md](file://[local path redacted]) - Full technical specifications, hardware block diagram, and keyboard mapping.
*   [voxel_stomp/README.md](file://[local path redacted]) - Workspace repository layout and hardware list.

## Next Steps

1. **Active Workspace Setup:** Set `[local path redacted]` as the active workspace in your editor.
2. **Schematic Design:** Establish the KiCad schematic for the RP2040 and Daisy Seed interconnects (UART pins, SPI SD card, power regulation).
3. **Firmware Prototyping:** Begin drafting the C++ code for the Daisy Seed audio callback, importing the RTNeural library, and structuring the tape-delay circular buffer.
