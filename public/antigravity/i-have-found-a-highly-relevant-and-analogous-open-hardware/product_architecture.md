# Project Sentinel: System Architecture & Onboarding Design

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
