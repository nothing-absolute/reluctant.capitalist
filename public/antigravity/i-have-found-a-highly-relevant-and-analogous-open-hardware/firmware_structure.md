# ESP32 Firmware Structure (Project Sentinel)

To ensure the device is completely reliable while bouncing around on a boat with spotty cellular coverage, the firmware must be resilient. If the cellular connection drops, it shouldn't crash; it should gracefully reconnect. 

We will build the firmware using **PlatformIO** (C++) and structure it around a **Finite State Machine (FSM)**.

## 1. Development Environment & Libraries
*   **Platform:** PlatformIO (much better dependency management than Arduino IDE).
*   **Board Target:** `esp32dev` (specifically configured for the LilyGO T-SIM7000G).
*   **Core Libraries:**
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
