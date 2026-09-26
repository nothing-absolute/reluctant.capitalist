# Project: OpenDoor (Open-Source Video Doorbell)

An open-source, privacy-first hardware replacement for Ring and other cloud-tethered video doorbells. This project leverages community-driven designs to create a completely local, customizable, and subscription-free smart doorbell ecosystem.

## 🎯 The Kickstarter Pitch

**Headline:** Take back your front porch. The 100% open-source, cloud-free video doorbell you control.
**Problem:** Commercial video doorbells act as nodes in mass surveillance systems, charge monthly fees for basic features (like saving video), and become expensive bricks if the manufacturer goes out of business or changes their policies.
**Solution:** A fully assembled, consumer-ready video doorbell based on open-source hardware (ESP32). You own the hardware, you own the data, and core features are entirely subscription-free.

---

## 🛠️ Technical Architecture & Product Ecosystem

Based on our finalized design decisions, here is the complete hardware and software stack:

### 1. The Video Doorbell Unit (Outside)
*   **Target Audience:** Consumer-focused. The unit ships fully assembled and ready to mount out-of-the-box, though all PCB schematics and STL files remain fully open-source for makers.
*   **Aesthetic & Build:** **Rugged and Industrial.** The enclosure features a matte metal/plastic finish, exposed security screws, and a modular design that emphasizes durability and repairability. This signals to backers that it's built to last and meant to be opened/repaired, unlike glued-together commercial counterparts.
*   **Power:** **100% Wire-Free Battery Powered.** It utilizes a high-capacity internal lithium-ion battery.
    *   *Solar Option:* An optional solar panel accessory plugs into the back to trickle-charge the battery, eliminating the need to ever take it down for charging.
*   **Hardware Core:** ESP32-S3 with PSRAM for optimized video processing and deep-sleep battery management. A built-in PIR (Passive Infrared) sensor ensures the camera only wakes up when a physical heat signature approaches, saving massive amounts of battery.
*   **Onboard Storage:** Includes a MicroSD card slot directly on the doorbell for basic, standalone local recording.

### 2. The Smart Chime (Inside)
*   **Hardware:** A dedicated Wi-Fi Smart Chime. 
*   **Function:** It plugs into any standard indoor wall outlet. When the outdoor doorbell is pressed, it triggers this indoor chime over the local network. This bypasses the need for complex mechanical doorbell wiring in the home.

### 3. The "OpenBase" Station (Optional Local Server)
*   **Function:** For users who want robust, multi-camera local storage without setting up their own complex Home Assistant server, we offer a pre-configured Base Station hub.
*   **Hardware:** A small, low-power box that plugs directly into the user's internet router. It contains an internal SSD or large SD card. 
*   **Advantage:** It handles all video archiving, advanced motion detection, and serves the mobile app locally. 100% plug-and-play local cloud replacement.

### 4. Software & Remote Access
*   **The App:** A custom, polished "OpenDoor" mobile app for iOS and Android. This provides a familiar, consumer-friendly "Ring-like" experience for setup, viewing, and notifications.
*   **Remote Viewing (Away from Home):** To view the camera when not on the home Wi-Fi network, the system uses an **End-to-End Encrypted (E2EE) Cloud Relay**. 
    *   **Business Model:** Local network access is always 100% free. The E2EE relay service (which incurs server bandwidth costs) will be offered as a hybrid: either subsidized by the hardware margins for a set period, or available for a tiny, optional subscription (e.g., $1.99/month) purely to keep the relay servers running. The relay has zero ability to decrypt the video stream.

---

## 📦 Kickstarter Reward Tiers

> [!TIP]
> **Campaign Strategy:** Since we are focusing on consumer-ready hardware, the tiers are structured around the ecosystem add-ons rather than bare DIY kits.

1.  **The Digital Maker ($15):** 
    *   Access to all optimized STL files for 3D printing the enclosure and Gerber files to order your own PCBs.
2.  **The Standalone Doorbell ($99):** 
    *   Fully assembled OpenDoor Video Doorbell.
    *   Includes 1x Indoor Wi-Fi Chime.
    *   (Records to onboard MicroSD card).
3.  **The Solar Bundle ($129):**
    *   Fully assembled OpenDoor Video Doorbell + Wi-Fi Chime.
    *   Includes the custom-fit Solar Panel mounting bracket.
4.  **The "Local Cloud" Ecosystem ($199):**
    *   Fully assembled OpenDoor Video Doorbell + Wi-Fi Chime.
    *   The **OpenBase Station** for robust, centralized local video storage and processing.

---

## ⚠️ Key Engineering Challenges

> [!WARNING]
> **Battery Optimization:** Video streaming on the ESP32-S3 consumes significant power. Perfecting the firmware to transition from deep sleep (PIR trigger) to active video streaming in under 1.5 seconds is the biggest technical hurdle to ensuring a seamless user experience while maintaining a 3-6 month battery life.
>
> **Relay Infrastructure:** Building the E2EE WebRTC signaling server infrastructure that scales reliably without introducing massive latency will require significant backend engineering expertise.
