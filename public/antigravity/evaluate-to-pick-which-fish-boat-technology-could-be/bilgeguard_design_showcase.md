# BilgeGuard PCB Design Showcase

This document presents the 3D CAD render of the custom PCB designed for the **BilgeGuard Subscription-Free Boat Monitor**.

---

## 3D CAD Render

![BilgeGuard Custom PCB 3D Render]([local path redacted])

---

## Board Layout & Component Highlights

The 3D render represents a physical layout mapping of the schematic nets detailed in [BilgeGuard.net](file://[local path redacted]):

* **Solder Mask & Finish:** Matte dark blue solder mask with gold ENIG (Electroless Nickel Immersion Gold) contact pads and edge routing to combat salt-air corrosion.
* **Microcontroller:** Center-mounted **ESP32-S3-WROOM-1** module, carrying integrated Wi-Fi and Bluetooth antennas.
* **Cellular Interface:** SMT-mounted **SIM7080G** module with dual gold SMA/coaxial connector outputs for LTE-M and GNSS external antennas.
* **SIM Card:** An onboard gold-plated **Nano SIM card slot** mounted at the top-center edge.
* **Screw Terminals:** Green screw terminal blocks positioned on the lower edges for power lines (`PWR (9-16V)`), bilge sensor inputs (`SENSOR INPUTS`), and switching controls (`RELAY OUT`).
* **Debugging/Power:** Bottom-left mounted **USB-C interface** for direct serial logging and firmware updates.
* **Relay Switch:** A black **Panasonic/Sanyou SPDT relay** positioned next to the USB port to safely switch high-current boat loads (bilge alarm horns, strobes, or battery chargers).
