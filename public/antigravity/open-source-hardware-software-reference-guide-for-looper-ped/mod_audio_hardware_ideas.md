# OpenLooper: Hardware & Design Optimizations (Inspired by MOD Audio)

By studying the open-source hardware architecture of the **MOD Dwarf** (from the [mod-audio/hw-mod-dwarf](https://github.com/mod-audio/hw-mod-dwarf) repository), we can extract several engineering design improvements to make the **OpenLooper** build **cheaper to manufacture**, **more robust in live gig settings**, and **physically smaller**.

---

## 1. Major Hardware Optimizations

### 💡 Idea 1: Replace USB Audio Interface with an I2S Codec Board
* **Current OpenLooper Design**: Focusrite 2i2 or Behringer UMC202HD USB interface (~$80 - $120; takes up 60% of enclosure volume).
* **MOD Dwarf Approach**: Uses a high-performance **Cirrus Logic CS4272** stereo codec wired directly to the CPU via **I2S digital audio lines**.
* **OpenLooper Implementation**: Use a Raspberry Pi / Orange Pi I2S codec board (e.g., **Audio Injector Stereo** or a custom CS4272 board) which costs only **$15–$25**.
  - **Kickstarter Benefit**: Drops single-build retail cost by **$60 - $80**.
  - **Mechanical Benefit**: Reduces enclosure volume requirements by half, allowing the pedal to easily fit into a standard, slim Hammond **1590XX** or **125B** enclosure rather than a bulky custom shell.

### 💡 Idea 2: Add USB Gadget Wired Tethering (Fail-Safe Connection)
* **Current OpenLooper Design**: Web UI communicates strictly over a local 2.4GHz/5GHz Wi-Fi Hotspot.
* **MOD Dwarf Approach**: Features a USB-B device port that connects to computers/tablets. The system runs **USB OTG Ethernet Gadget Mode** (using Linux ConfigFS).
* **OpenLooper Implementation**: Configure the host SBC's USB-C port to act as an RNDIS/CDC-ECM ethernet device. When a user plugs in a USB cable from their iPad, Android tablet, or laptop, the pedal assigns an IP address and shares its Web UI directly over the wire.
  - **Kickstarter Benefit**: Musician-grade reliability. Wi-Fi networks in crowded gig venues are notorious for interference and dropouts. Wired USB tethering provides an instant, zero-latency, noise-immune connection.

### 💡 Idea 3: Swap 5-pin DIN MIDI for 3.5mm TRS MIDI (Type-A)
* **Current OpenLooper Design**: Optional standard MIDI port.
* **MOD Dwarf Approach**: Uses compact 3.5mm TRS jacks for MIDI In/Out, adhering to the MIDI Association's standard TRS Type-A specification.
* **OpenLooper Implementation**: Integrate 3.5mm stereo jacks connected to the Pico's UART serial lines.
  - **Kickstarter Benefit**: Saves board space, chassis drilling costs, and reduces visual clutter on the rear panel.

### 💡 Idea 4: CPU and RAM Downgrade (BOM Cost-Down)
* **Current OpenLooper Design**: Raspberry Pi 5 (4GB or 8GB).
* **MOD Dwarf Approach**: Runs on a low-power quad-core **ARM Cortex-A35 processor clocked at 1.3GHz with 1GB RAM**.
* **OpenLooper Implementation**: Standardize on a cheaper host board, such as the **Raspberry Pi 4 (2GB)** or **Orange Pi Zero 3 (2GB)**.
  - **Kickstarter Benefit**: Reduces the core processing unit cost from $65 to **$20 - $35** per unit. Since we offload UI rendering to the mobile device and use a highly optimized C++/JACK audio engine, 2GB of RAM is more than sufficient.

---

## 🛠️ Revised Kickstarter Target Cost Comparison

Implementing these improvements moves the target margins to a much higher tier:

| Component | Current Setup (USB Interface) | Optimized Setup (I2S Codec + OPi) | Cost Savings |
|:---|:---:|:---:|:---:|
| **Processing Unit** | $65.00 (RPi 5 4GB) | $30.00 (Orange Pi Zero 3 2GB) | **-$35.00** |
| **Audio I/O** | $90.00 (USB Interface) | $20.00 (I2S Codec board) | **-$70.00** |
| **Enclosure** | $25.00 ( Hammond 1590DD) | $15.00 (Hammond 1590XX - smaller) | **-$10.00** |
| **Controls & LEDs** | $40.00 | $40.00 | $0.00 |
| **Buffer & Power** | $25.00 | $20.00 | **-$5.00** |
| **Total BOM (COGS)** | **$245.00** | **$125.00** | **-$120.00** |
| **Target Backer Price** | **$349.00** | **$249.00** | **-$100.00** |
| **Gross Margin (%)** | **29.7%** ($104 profit) | **49.8%** ($124 profit) | **+20.1% Margin** |

> [!TIP]
> Introducing the **Wired USB Tethering** fail-safe and switching to the **I2S audio codec** makes OpenLooper both **cheaper** (saving $120 per build) and **physically smaller**, moving the product closer to a boutique consumer pedal feel.
