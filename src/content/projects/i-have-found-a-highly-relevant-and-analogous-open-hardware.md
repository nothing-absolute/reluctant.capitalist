---
title: "I have found a highly relevant and analogous open-hardware and open-source project that serves as a direct jum"
description: "Adapting open-boat-projects.org's LoRa Boat Monitor into Project Sentinel for LTE-M, GPS, and MQTT-based bilge and battery monitoring"
date: "2026-08-01"
tags: ["open-source","iot","boat-monitoring","hardware-adaptation"]
source: "antigravity://89468503-5d2e-41f7-9538-2ba62a789a13"
draft: false
---

## firmware structure

## ESP32 Firmware Structure (Project Sentinel)

To ensure the device is completely reliable while bouncing around on a boat with spotty cellular coverage, the firmware must be resilient. If the cellular connection drops, it shouldn't crash; it should gracefully reconnect. 

We will build the firmware using **PlatformIO** (C++) and structure it around a **Finite State Machine (FSM)**.

## 1. Development Environment & Libraries
*   **Platform:** PlatformIO (much better dependency management than Arduino IDE).
*   **Board Target:** `esp32dev` (specifically configured for the LilyGO T-SIM7000G).
*   **Core Libraries:*
    *   `vshymanskyy/TinyGSM`: The industry standard for handling AT commands for the SIM7000G LTE-M modem.
    *   `knolleary/PubSubClient`: For lightweight MQTT communication to HiveMQ.
    *   `bblanchon/ArduinoJson`: To format the sensor data into a clean JSON string before sending.

## 2. The Core State Machine
The main `loop()` will run a state machine. This ensures that if the cellular network is lost, the device simply falls back to the `NETWORK_CONNECT` state without freezing.

1.  **`STATE_INIT`**: 
    *   Reads the ESP32's baked-in MAC address (used as the unique Device ID).
    *   Configures GPIO 36 for Analog Voltage Reading.
    *   Configures GPIO 39 (Input Pullup) for the Bilge Float Switch.
2.  **`STATE_MODEM_ON`**:
    *   Triggers the specific power-key sequence for the SIM7000G to boot up the modem.
3.  **`STATE_NETWORK_CONNECT`**:
    *   Uses TinyGSM to attach to the LTE-M network (using the 1NCE APN: `iot.1nce.net`).
4.  **`STATE_MQTT_CONNECT`**:
    *   Connects to the cloud MQTT broker (e.g., HiveMQ).
5.  **`STATE_READ_SENSORS`**:
    *   Reads battery voltage using the calibration logic (adapted from Open Boat Projects).
    *   Reads the bilge float switch state.
    *   Requests a GPS fix from the SIM7000G.
6.  **`STATE_PUBLISH`**:
    *   Packages the data and sends it over MQTT.
7.  **`STATE_DEEP_SLEEP`** *(Optional but recommended)*:
    *   To prevent draining the boat's 12V battery over winter, the ESP32 can go into a deep sleep for 15 minutes, wake up, run the state machine, and go back to sleep. *However, we can configure the Bilge GPIO pin to immediately wake the ESP32 if the float switch is triggered.*

## 3. The MQTT Data Payload
When the ESP32 publishes data to the cloud, it will send a highly compressed JSON payload to the MQTT topic: `sentinel/telemetry/<DEVICE_ID>`

```json
{
  "device_id": "A1B2C3D4E5F6",
  "v": 12.6,                // Battery Voltage
  "b": 0,                   // Bilge Alarm (0 = dry, 1 = wet)
  "lat": 34.0522,           // GPS Latitude
  "lon": -118.2437          // GPS Longitude
}
```
*(Notice the keys are kept short like "v" and "b" to save bytes on the cellular data plan).*

## Open Questions
> [!NOTE]
> 1. **Data Frequency:** How often do you want the device to report in when everything is normal? (e.g., every 15 minutes, once an hour?). *Note: If the bilge goes off, it will report instantly via hardware interrupt.*
> 2. **Execution:** Shall I go ahead and initialize the PlatformIO project in our workspace and write the actual C++ code for this state machine?

## implementation plan

## Project Sentinel: Adapting Open Boat Projects LoRa Monitor

The goal is to adapt the existing open-source "LoRa Boat Monitor" (which uses ESP32 + LoRa) into "Project Sentinel" (ESP32 + LTE-M + GPS + MQTT) for cellular-based, subscription-free bilge and battery monitoring.

## User Review Required
> [!IMPORTANT]
> The original project uses a Heltec WiFi LoRa 32 V2 board which has an integrated LoRa radio. Since we are moving to LTE-M, we will either need a different ESP32 dev board without LoRa (e.g., standard ESP32-WROOM-32 dev kit) connected to an external LTE-M module, or a combined ESP32 + LTE board (like the LilyGO T-SIM7000G). Please confirm which hardware path you prefer. Using a pre-integrated T-SIM7000G board might simplify the PCB design significantly.

## Open Questions
> [!NOTE]
> 1. Which LTE-M/GPS module do you want to use? (e.g., SIM7000G, SIM7600G, or a Nordic nRF9160 module)
> 2. What MQTT broker are you planning to use? (e.g., Self-hosted Mosquitto on Home Assistant, HiveMQ, AWS IoT)
> 3. Do you want to keep the local WiFi web server configuration portal from the original project?

## Proposed Changes

We will fork the `LoRa-Boat-Monitor` repository and make the following architectural adaptations:

---

### Hardware Edge Layer (Schematics & PCB)
We will adapt the Eagle CAD schematics located in `project/cad/Eagle/`.
- Keep the 3.1V–35V DC-DC power conversion circuits for marine battery compatibility.
- Keep the voltage divider circuit (connected to `GPIO 36`) for calibratable battery voltage reading.
- Keep the opto-isolated alarm contact circuit (connected to `GPIO 39`) for the bilge float switch.
- **[MODIFY]** `project/cad/Eagle/LoRa-Bootsmonitor_3.sch`: Remove the integrated LoRa module/connections and replace them with UART headers (TX/RX) and power lines for the chosen LTE-M cellular modem.

---

### Firmware Communication Stack
We will modify the PlatformIO/Arduino C++ source in `src/`.
- **[DELETE]** `src/Payload_Formats_TTN_V3.h`, `src/Payload_Formats_Ubidots.h` and LoRa WAN logic.
- **[NEW]** `src/LTE_Modem.cpp`: Integrate the `TinyGSM` library to manage AT commands with the LTE-M modem, handle network registration, and fetch GPS coordinates.
- **[NEW]** `src/MQTT_Client.cpp`: Integrate `PubSubClient` to publish JSON payloads (Voltage, Bilge Status, GPS) directly to your MQTT broker over the LTE connection.
- **[MODIFY]** `src/Functions.h` / `src/Definitions.h`: Swap the data transmission pipeline from LoRa TX events to MQTT publish events. Maintain the existing ADC calibration (`actconf.a2vslope`, etc.) and pin read logic (`digitalRead(alarmPin)`).

---

### Alerting Logic Customization (Home Assistant)
- **[NEW]** `home_assistant/sentinel_templates.yaml`: Create MQTT Sensor and Binary Sensor configurations for Home Assistant.
- **[NEW]** `home_assistant/automations.yaml`: Implement the "Silent Sinking" rule chain:
  - Trigger: Bilge binary sensor (`alarm1 == 1`) changes to ON.
  - Action: Send critical push notification/SMS to the user's mobile device via Home Assistant integrations.
  - Secondary Trigger: Battery voltage (`voltage < 11.5V`) drops below critical threshold.

## Verification Plan

### Automated Tests
- Compile the adapted ESP32 firmware using PlatformIO.
- Run unit tests on the JSON payload generator to ensure MQTT messages match the expected schema.

### Manual Verification
- Test the voltage divider calibration logic using a variable bench power supply simulating a 12V marine battery.
- Trigger the bilge input pin (GPIO 39) to verify immediate MQTT transmission and Home Assistant automation triggering.
- Confirm successful LTE-M network attachment and GPS fix parsing through serial logs.

## product architecture

## Project Sentinel: System Architecture & Onboarding Design

To achieve an "Apple-like," out-of-the-box experience where a user simply inserts a SIM, scans a QR code, and has a working app, we cannot rely on DIY solutions like Home Assistant. We must own the backend and the app. 

Here is the system architecture designed specifically to support that seamless onboarding flow while keeping your development costs and server maintenance as low as possible.

## 1. The Onboarding Flow (User Experience)
This is exactly what the user will experience:
1. **Unbox & Power:** User opens the box, inserts an IoT SIM card, connects the device to the 12V boat battery, and connects the bilge float wires.
2. **Scan QR Code:** User scans a QR code sticker printed on the device (e.g., `https://sentinel.app/setup?id=ESP32_A1B2C3`).
3. **Install & Link:** 
   - If they don't have the app, the QR code redirects them to the Google Play Store to download the "Sentinel" app.
   - Upon opening the app and creating a quick account, the app reads the `id=ESP32_A1B2C3` from the deep link.
   - The app securely links that specific hardware device to their user account.
4. **Ready to Go:** The app instantly displays the live battery voltage, GPS location, and bilge status.

---

## 2. System Architecture

To make this happen effortlessly, the system is broken into three layers:

### A. The Hardware (Edge Layer)
*   **Hardware:** LilyGO T-SIM7000G (ESP32 + LTE-M modem integrated). 
*   **Firmware:** Written in C++ (PlatformIO). 
*   **Logic:** Upon power-up, the ESP32 reads its permanent, burned-in MAC address (this becomes its unique `Device ID`). It connects to the cellular network and begins sending lightweight JSON payloads every few minutes (or instantly if the bilge alarm is triggered).
*   **Protocol:** Because cellular data needs to be highly efficient, we will use **MQTT** to transmit data, as it uses vastly less data than HTTP requests, saving the user money on their SIM data plan.

### B. The Cloud Backend (Server Layer)
We will use a "Serverless" architecture. This means you don't pay for servers running 24/7; you only pay micro-cents when data actually moves. It is infinitely scalable and virtually free to start.
*   **MQTT Broker:** **HiveMQ Cloud** (Serverless). This acts as the receiving dish for the millions of tiny MQTT messages coming from the boats over the cellular network.
*   **Data Pipeline:** A **Firebase Cloud Function** (Node.js) listens to the HiveMQ broker. When a message arrives from a boat, it grabs the data and saves it.
*   **Database:** **Firebase Firestore**. A highly scalable real-time database. It stores the boat's data under the specific `Device ID`. It also securely manages user accounts (Firebase Authentication) and stores the linking table (which User owns which Device ID).

### C. The Mobile App (Frontend Layer)
*   **Framework:** **Flutter** (by Google). Flutter allows you to write the code *once* and compile it into a native Android App and a native iOS App simultaneously. 
*   **Integration:** The Flutter app connects directly to Firebase Firestore. Because Firestore is a real-time database, if the boat takes on water and the ESP32 updates the database, the Flutter app UI updates instantly on the user's screen without them having to refresh.
*   **Push Notifications:** We will use **Firebase Cloud Messaging (FCM)**. If the Cloud Function detects a bilge alarm or a critical voltage drop, it instantly pushes a notification to the user's Android phone.

---

## 3. How the "Scan and Go" Magic Works Internally
When you manufacture/assemble a Sentinel device:
1. You flash the firmware.
2. The firmware spits out its unique MAC address via a serial cable (e.g., `A1:B2:C3:D4:E5:F6`).
3. You run a quick script that prints a QR code sticker containing a deep link: `https://sentinel.app/setup?id=A1B2C3D4E5F6`.
4. You stick it on the box. 

When the user scans that QR code and signs into the app, the app simply writes a record in the Firebase Database: `User: John Doe, Owned_Devices: [A1B2C3D4E5F6]`. From that moment on, John Doe's app is authorized to read the telemetry data streaming in from that specific ESP32.

## Open Questions & Review
> [!NOTE]
> 1. **App Development:** Does building a cross-platform mobile app using Flutter sound like the right approach for your team/budget?
> 2. **SIM Strategy:** Are you going to recommend a specific SIM card to the user (e.g., Hologram, 1NCE), or let them use any carrier? *Note: If they use any carrier, they may need to type their carrier's APN settings into the app, which slightly complicates the "zero setup" flow, though we can automate APN selection for major carriers.*

Please review this architecture. If this aligns with your product vision, we can begin executing the firmware and cloud architecture!

## Assets
- [firmware_structure.md](/antigravity/i-have-found-a-highly-relevant-and-analogous-open-hardware/firmware_structure.md) — MD, 3 KB
- [implementation_plan.md](/antigravity/i-have-found-a-highly-relevant-and-analogous-open-hardware/implementation_plan.md) — MD, 4 KB
- [product_architecture.md](/antigravity/i-have-found-a-highly-relevant-and-analogous-open-hardware/product_architecture.md) — MD, 5 KB

<details>
<summary>Chat transcript — 10 messages, 2026-08-01 → 2026-08-01</summary>

**You** · 2026-08-01 05:01

I have found a highly relevant and analogous open-hardware and open-source project that serves as a direct jump-off point for your design.

Instead of reinventing the entire ecosystem, you can utilize the tested designs and logic from the "open-boat-projects.org" initiative, specifically their LoRa Boat Monitor (and its ESP32-based variations).

⚓ The Jump-Off Point: Open Boat Projects LoRa Monitor

This project represents the classic open-source engineering approach: rather than building infrastructure from scratch, you specialize existing, tested platforms for your niche.

This project is a perfect architectural and functional match for Project Sentinel. It is designed to run on a central microcontroller (often an ESP32 or ESP32-S3) at the edge, collecting boat telemetry and pushing it via MQTT.

Why it is the Ideal Analog:

    Direct Hardware Analogs:

        Sentinel Concept: ESP32 + LTE-M + GPS.

        Open Boat Project: Pre-designed schematics that integrate an ESP32 MCU with communication layers (LoRa and NB-IoT). They have validated power conversion circuits (3.1V–35V input range), similar to your buck converter requirement.

    Validated Bilge & Battery Logic:

        Sentinel Concept: Monitors battery voltage (12V/24V), bilge float switch, and location.

        Open Boat Project: The project documentation includes tested rule chains for "Battery Voltage Sensing" (using ADC calibration logic on the ESP32) and "Alarm Contacts" for bilge level sensors. They have already solved the "I need to isolate 12V inputs" problem with confirmed optocoupler or level-shifting reference designs.

    Ready-Made Ecosystem Integration:

        Sentinel Concept: Use standard MQTT, perhaps integrating with Home Assistant.

        Open Boat Project: This project is part of a wider ecosystem that natively supports MQTT, SignalK, and Home Assistant. Using their existing templates moves you from infrastructure coding to value-add customization.

📋 How to Use it as a Jump-Off Point

The most efficient strategy is to adapt their tested edge layer (hardware/firmware) and combine it with your specialized cellular connectivity and anti-subscription marketing strategy.

    Step 1: Leverage Edge Firmware & Circuits: Download their firmware and PCB designs. Do not start with a blank canvas for the ESP32 power regulation, voltage divider calculation, or bilge float switch opto-isolation. They have already calibrated these inputs for marine environments. Specializing their schematic is safer and faster.

    Step 2: Swap the Communication Stack: The Open Boat Project focuses heavily on LoRa for marina-wide low-power networks. This is where you specialize. Adapt their schematic to substitute the LoRa radio for your chosen LTE-M/GPS module (e.g., SIM7000G/SIM7600). Your value proposition is nationwide coverage without reliance on specific marina LoRa gateways.

    Step 3: Customize alerting logic: Use their Rule Engine and Home Assistant templates as a baseline. Customize them specifically to address the core "Silent Sinking" problem: create rules that send immediate alerts (via your MQTT/SMS stack) when the bilge digital GPIO pin is triggered.

    Next Step: Visit the Community Forum

    You

[source truncated]

## Related

- [AI Task Concierge Concept](/projects/ai-task-concierge/)
- [Music Hardware Market Analysis & Kickstarter Blueprint](/projects/analyze-the-sythnesizer-midi-controller-guitar-pedal-market/)
- [Community Data Center / Third-Space Cooperative — Vision]
