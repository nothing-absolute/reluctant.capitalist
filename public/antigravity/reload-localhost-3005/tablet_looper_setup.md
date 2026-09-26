# Setup Guide: Linux Tablet Live Looper with Sooperlooper & MIDI

This architecture blueprint details how to build a highly portable, touch-optimized, low-latency live looping station using a **Linux-capable tablet**, a **USB MIDI Foot Controller**, and the headless **Sooperlooper** audio engine.

---

## 1. Hardware Architecture

```
┌────────────────────────────────────────────────────────────────────────┐
│                        TOUCH TABLET (PineTab 2 / Linux)                │
│                                                                        │
│   ┌────────────────────────────────────────────────────────────────┐   │
│   │              Touch Web App GUI (localhost:3000)                │   │
│   │   [ Track 1 ]   [ Track 2 ]   [ Track 3 ]   [ Track 4 ]        │   │
│   │    Rec/Play      Rec/Play      Rec/Play      Rec/Play          │   │
│   └───────────────────────────────┬────────────────────────────────┘   │
│                                   │ WebSockets                         │
│                                   ▼                                    │
│   ┌────────────────────────────────────────────────────────────────┐   │
│   │              OpenLooper Node.js Server & OSC Bridge            │   │
│   └───────────────────────────────┬────────────────────────────────┘   │
│                                   │ OSC (UDP 9951)                     │
│                                   ▼                                    │
│   ┌────────────────────────────────────────────────────────────────┐   │
│   │              Sooperlooper Daemon (Headless Audio Engine)       │   │
│   └────────────────────────────────────────────────────────────────┘   │
└───────────────────────────────────▲────────────────────────────────────┘
                                    │ USB OTG Connections
            ┌───────────────────────┴───────────────────────┐
            │                                               │
            │ USB MIDI                                      │ USB Audio
  ┌─────────┴─────────┐                           ┌─────────┴─────────┐
  │  MIDI Foot Pedal  │                           │   Audio Interface │
  │ (MeloAudio / Soft)│                           │ (Focusrite Solo)  │
  └───────────────────┘                           └─────────┬─────────┘
                                                            │ Stereo Out
                                                            ▼  To PA/Amp
```

### Component Selection
1. **The Tablet (PineTab 2 or PostmarketOS Tablet)**:
   * **Recommended**: **PineTab 2** (Natively runs Linux, quad-core ARM, with standard Arch Linux ARM / DanctNIX).
   * **Alternative**: A high-end Android tablet (e.g., Samsung Galaxy Tab S9) running Linux via a rooted environment. Note that non-rooted Android virtual environments (PRoot/Termux) add significant audio latency.
   * **Touch UI Desktop Environment**: **Phosh** (Phone Shell based on GNOME) or **KDE Plasma Mobile**. Both offer large touch targets, on-screen keyboards, and fluid gesture navigation.
2. **MIDI Foot Controller**:
   * **MeloAudio MIDI Commander** or **Keith McMillen SoftStep 2**: Rugged, USB class-compliant, compact footprint.
3. **USB Audio Interface**:
   * **Focusrite Scarlett Solo / 2i2** or **Behringer UMC202HD**: Class-compliant USB interfaces that work out of the box in Linux.
4. **USB-C OTG Hub**:
   * A multi-port hub with power delivery (PD) to connect the MIDI pedal, audio interface, and charge the tablet simultaneously.

---

## 2. Low-Latency Linux Audio Setup (PipeWire & JACK)

To make live looping usable, audio latency must be below **10ms** (ideally 5ms). This requires bypassing the standard desktop audio stack in favor of **PipeWire** (acting as the JACK server) with low-latency settings.

### Step 1: Install Audio Packages
On Arch-based systems (like PineTab 2), run:
```bash
sudo pacman -S pipewire pipewire-alsa pipewire-jack pipewire-pulse helvum sooperlooper
```

### Step 2: Configure PipeWire for Low Latency
Force PipeWire to run at a small buffer size (64 or 128 samples) and 48kHz sampling rate. Create/edit `~/.config/pipewire/pipewire.conf.d/latency.conf`:
```ini
context.properties = {
    default.clock.rate          = 48000
    default.clock.allowed-rates = [ 48000 ]
    default.clock.quantum       = 64
    default.clock.min-quantum   = 64
    default.clock.max-quantum   = 256
}
```
*At 48kHz and 64 samples, round-trip audio latency is approx. **2.7 milliseconds**.*

---

## 3. Configuring Headless Sooperlooper & MIDI

Instead of using Sooperlooper's old, non-touch-friendly desktop interface (`slgui`), we run the engine headlessly and map physical MIDI commands directly to it.

### Step 1: Start the Headless Engine
Run the `sooperlooper` daemon, configuring it for 4 loops:
```bash
sooperlooper -p 9951 -l 4 -j
```
* `-p 9951`: Binds the engine to OSC port 9951.
* `-l 4`: Allocates 4 tracks.
* `-j`: Automatically registers ports with the JACK (PipeWire) sound server.

### Step 2: MIDI Device Binding Mappings
Connect the MIDI Pedal via USB. It will appear as an ALSA MIDI port.
To check connected MIDI devices:
```bash
aconnect -l
```

Map the MIDI events to Sooperlooper. You can configure Sooperlooper MIDI bindings in a settings file (`~/.sooperlooper/default_bindings.slb`):

```xml
<?xml version="1.0"?>
<sooperlooper_bindings version="1.0">
  <!-- Track 1: Record / Play / Overdub Toggle -->
  <binding control_type="midi_cc" midi_channel="1" cc_number="1" command="hit" argument="record" target="loop0" />
  
  <!-- Track 2: Record / Play / Overdub Toggle -->
  <binding control_type="midi_cc" midi_channel="1" cc_number="2" command="hit" argument="record" target="loop1" />
  
  <!-- Track 3: Record / Play / Overdub Toggle -->
  <binding control_type="midi_cc" midi_channel="1" cc_number="3" command="hit" argument="record" target="loop2" />
  
  <!-- Track 4: Record / Play / Overdub Toggle -->
  <binding control_type="midi_cc" midi_channel="1" cc_number="4" command="hit" argument="record" target="loop3" />
  
  <!-- Global Undo (Button 5) -->
  <binding control_type="midi_cc" midi_channel="1" cc_number="5" command="hit" argument="undo" target="selected" />
  
  <!-- Global Clear (Button 6) -->
  <binding control_type="midi_cc" midi_channel="1" cc_number="6" command="hit" argument="clear" target="all" />
</sooperlooper_bindings>
```

Launch the daemon referencing your MIDI bindings configuration:
```bash
sooperlooper -p 9951 -l 4 -j -b ~/.sooperlooper/default_bindings.slb
```

---

## 4. Touch-Friendly UI: The Hybrid Web Interface

To get a gorgeous, touch-friendly visual feedback screen, run the **OpenLooper Node.js Server** locally on the tablet:

1. Launch the backend server in the background:
   ```bash
   node /path/to/wireless-looper/backend/server.js --hardware
   ```
2. The server connects to the headless `sooperlooper` daemon over OSC (UDP 9951) and hosts the Web GUI on port `3000`.
3. Open a browser on the tablet (e.g. Chromium) and navigate to:
   ```
   http://localhost:3000
   ```
4. Set the browser to **Full Screen** or "Add to Home Screen" as a Progressive Web App (PWA).

This provides a beautiful glassmorphic touch mixer showing live waveforms and playhead progress bars on the tablet screen, while the heavy-duty stomp controls are triggered in low-latency by the MIDI pedal on the floor.
