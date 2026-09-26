# Walkthrough: Dual-workspace Testbeds for BYO Sim Boat Monitor

We have set up two separate workspaces in `[local path redacted]` containing both the end-user application layout and the developer verification layout. Both compile successfully under Vite and run in the background concurrently.

---

## 1. Workspace 1: End-User Application Setup
* **Path**: [`[local path redacted]`](file://[local path redacted])
* **Local Port**: **`http://localhost:5174/`**
* **Concept**: Designed for the final yacht owner mobile app UI.
* **Layout**:
  * **Simulation Cockpit (Left)**: Inputs, raw sliders, GPS lock, Wi-Fi toggles, presets.
  * **Physical ESP32 Twin (Left)**: Renders the Heltec board with the monochrome OLED.
  * **Smartphone Bezel Mockup (Center/Right)**: Encloses the mobile app UI.
    * **Tab 1 (Dashboard)**: Features a water intrusion red header, battery Dial gauge, Victron solar charges, environmental metrics, and fuel/water tanks with **CSS fluid wave animations**.
    * **Tab 2 (Chart Map)**: Click-to-move Leaflet map and auto-sailing coordinates tracker.
    * **Tab 3 (Terminal)**: Developer logs, live NMEA feed, and mock `/json` REST responses.

---

## 2. Workspace 2: Developer Diagnostics Setup (Original Layout)
* **Path**: [`[local path redacted]`](file://[local path redacted])
* **Local Port**: **`http://localhost:5175/`**
* **Concept**: Full-screen developer diagnostic cockpit.
* **Layout**:
  * **Cockpit controls (Left Column)**: Sliders for battery, tanks, weather, and a canvas map inside tabs.
  * **Diagnostics & Dials (Center Column)**: Large battery SVG gauge, solar chargers, and a full-size NMEA log feed console card.
  * **Hardware Twin (Right Column)**: Page-cycling monochrome OLED physical board simulation, LEDs, and calibration settings panel.

---

## Scroll Jump Bug Fix (Applied to both layouts)
* **Issue**: Changing inputs triggered new NMEA log entries, causing the terminal's `scrollIntoView()` function to execute. This was shifting the browser window scroll position and jumping the entire page viewport.
* **Solution**: Replaced `scrollIntoView()` on a hidden div with a **local container scroll offset**. The console body elements now run a local ref effect:
  ```javascript
  useEffect(() => {
    if (consoleBodyRef.current) {
      consoleBodyRef.current.scrollTop = consoleBodyRef.current.scrollHeight;
    }
  }, [logs]);
  ```
  This scrolls only the console viewport locally, leaving the main browser window scroll position completely stable during slider actions and scenario changes.

---

## Simulated Digital Twin Calculations

Both workspaces run checksum-accurate calibration mathematical formulas in JavaScript matching the C++ firmware:
* **Calibrated Battery Voltage**:
  $$\text{Voltage} = (a_2 \times a_2 \times \text{ADC}) + (a_1 \times \text{ADC}) + \text{offset}$$
* **Battery Capacity**:
  $$\text{Capacity} = \left(\text{Voltage} \times \frac{100}{2.2}\right) - 477.27 \quad (\text{Clamped } 0\% - 100\%)$$
* **Tank resistive conversions (0–180Ω standard senders)**:
  $$\text{Voltage} = 3.3 \times \frac{R_{\text{tank}}}{240 + R_{\text{tank}}}$$
  $$\text{Percentage} = (\text{Voltage} \times a_2^2) + (\text{Voltage} \times a_1) + \text{offset} \quad (\text{If } \text{Voltage} < 1.0\text{V})$$
* **Binary LoRaWAN Payload Packing**:
  Matches the 27-byte array format expected by the TTN V3 decoder in `Payload_Formats_TTN_V3.h`.
