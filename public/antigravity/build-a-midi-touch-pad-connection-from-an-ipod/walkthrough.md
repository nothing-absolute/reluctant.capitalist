# Walkthrough: iPod Touch MIDI/OSC Touchpad Connection

We have successfully built a real-time WebSocket-to-OSC bridge server and an iPod Touch-friendly web interface that operates smoothly on legacy 32-bit iOS browsers (iOS 9 and earlier).

## Changes Made

### 1. Created Project Directory
- Project directory established at [[local path redacted]](file://[local path redacted]).
- Installed necessary dependencies: `ws` (WebSockets) and `osc` (UDP/OSC packets).

### 2. Implemented Bridge Server ([server.js](file://[local path redacted]))
- Serves static assets from `public/` directory without heavy routing library overhead.
- Hosts a WebSocket server that receives JSON packets representing touch/controller values.
- Translates WebSocket payloads to standard binary OSC UDP packets and broadcasts them to a configured destination (default: `127.0.0.1:10000`).

### 3. Developed Optimized Legacy Web App (`public/`)
- **[index.html](file://[local path redacted])**: Set up standard iOS fullscreen viewport tags and UI elements (8 grid pads, 2 faders, and a 2D X/Y pad).
- **[style.css](file://[local path redacted])**: Clean Flexbox structure using `-webkit-` prefixes to ensure vintage Safari engines render elements correctly. Added a glowing glassmorphism aesthetic suitable for live audio performances.
- **[app.js](file://[local path redacted])**: 100% pure ES5 scripting using legacy Touch Events. Features touch velocity approximation (based on relative touch coordinates inside the pad) and automatic WebSocket reconnection.

---

## Validation & Testing

We verified the pipeline end-to-end using an integration test script:
1. Launched an OSC receiver on UDP port `10000`.
2. Started the bridge server.
3. Connected a mock client over WebSocket and simulated pad touch events and fader updates.
4. Confirmed that the correct OSC packets (e.g. `/pad/3` and `/fader/1` with floating-point arguments) were received on the UDP interface.

### Running the Application

To run the bridge server:
```bash
cd [local path redacted]
npm start
```
Then, connect your iPod Touch to the server IP and port `8080` (displayed in the console logs on startup).

### TouchDesigner Configuration

To receive the controller values in TouchDesigner:
1. Open TouchDesigner.
2. Create an **OSC In CHOP**.
3. Set the **Network Port** parameter to `10000`.
4. Touch the pads or faders on your iPod touch. You will see channels like `/pad/1`, `/fader/1`, `/xy/1` (with two components) animate in real-time.
