# Project Sentinel: Adapting Open Boat Projects LoRa Monitor

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
