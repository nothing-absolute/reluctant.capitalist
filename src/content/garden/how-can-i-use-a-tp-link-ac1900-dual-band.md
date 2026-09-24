---
title: "how can i use a tp-link ac1900 dual band router and motorola model sbg6580 along with a rasberry pi 3 b+ for a"
description: "guide on setting up a homelab with specified networking devices"
date: "2026-08-03"
tags: ["homelab","networking","raspberry-pi","router-setup"]
source: "antigravity://1a5fc988-2736-4f5f-ab4d-2e78334918fe"
draft: false
vault: false
---

how can i use a tp-link ac1900 dual band router and motorola model SBG6580 along with a Rasberry Pi 3 b+ for a homelab set up

<details>
<summary>Chat transcript — 6 messages, 2026-08-03 → 2026-08-03</summary>

**You** · 2026-08-03 03:48

how can i use a tp-link ac1900 dual band router and motorola model SBG6580 along with a Rasberry Pi 3 b+ for a homelab set up

---

**Antigravity** · 2026-08-03 03:49

This is a great starting setup for a homelab! You have all the necessary components to build a robust, secure, and functional network architecture. 

Here is the ideal way to configure these three devices to work together, avoiding common networking headaches like "Double NAT."

### The Network Topology
Your goal is to have the Motorola device handle the internet connection, the TP-Link handle the routing and Wi-Fi, and the Raspberry Pi act as your server.

**ISP Coax Cable** ➔ **Motorola SBG6580** ➔ **TP-Link AC1900** ➔ **Raspberry Pi 3 B+**

---

### Step 1: Configure the Modem (Motorola SBG6580)
The SBG6580 is a "gateway" (a modem and router combo). If you just plug the TP-Link into it, you will create a "Double NAT" (two routers trying to route traffic), which causes issues with port forwarding, gaming, and homelab services. We need to turn it into a "dumb modem."

1. Connect your coax cable to the Motorola and plug a computer directly into one of its LAN ports via Ethernet.
2. Log into its admin panel (usually `192.168.0.1`).
3. Turn off its Wi-Fi completely. 
4. Look for a setting called **"Bridge Mode"**, **"Primary Network Only"**, or an option to **disable "NAPT Mode"**. Enable this.
5. Save and reboot the Motorola. It will now pass your public internet IP directly through port 1.

### Step 2: Configure the Main Router (TP-Link AC1900)
This will be the brain of your network.

1. Connect an Ethernet cable from **Port 1 on the Motorola** to the **WAN (Internet) port on the TP-Link**.
2. Log into the TP-Link admin panel (usually `192.168.0.1` or `tplinkwifi.net`).
3. Set your Internet Connection Type to **Dynamic IP** (unless your ISP requires otherwise).
4. Set up your Wi-Fi networks (2.4GHz and 5GHz).
5. Plug your Raspberry Pi into one of the **LAN ports** on the TP-Link router.

### Step 3: Prepare the Raspberry Pi 3 B+
The Pi 3 B+ has 1GB of RAM and a quad-core CPU. It's not a powerhouse, but it is incredibly capable for running essential network services.

1. **Install an OS:** Use the Raspberry Pi Imager to flash **Raspberry Pi OS Lite (64-bit)** to a microSD card. *Use the "Lite" version because it doesn't install a desktop environment, saving precious RAM for your server applications.*
2. **Assign a Static IP:** Once the Pi boots and connects to the network, go into your TP-Link router's settings -> **DHCP Server** -> **Address Reservation**. Assign a permanent, static local IP address to your Pi (e.g., `192.168.0.100`). This ensures your router always knows where your server is.
3. **Install Docker:** The modern way to run a homelab is using Docker containers. SSH into your Pi and install Docker (`curl -sSL https://get.docker.com | sh`).

---

### What should you run on the Pi 3 B+?
Given the hardware limitations (1GB RAM, USB 2.0 shared with Ethernet), here are the absolute best starter projects for this specific Pi:

**1. Pi-hole or AdGuard Home (Highly Recommended)**
These are network-wide ad blockers. You install one of them on the Pi, and then go into your TP-Link router and change the DHCP DNS server to point to the Pi's static IP. Now, every device in your house (phones, smart TVs, PCs) will have ads and trackers blocked at the network level without needing browser extensions.

**2. PiVPN (WireGuard)**
This allows you to securely "dial in" to your home network from anywhere in the world using an app on your phone. If you are at a coffee shop, you can connect to your PiVPN, encrypting your traffic and allowing you to access your home files or local apps securely.

**3. A Dashboard (Heimdall or Homepage)**
Since you are building a lab, you'll want a nice webpage to access all your services. These lightweight containers give you a beautiful "start page" for your home network.

**4. Uptime Kuma**
A self-hosted monitoring tool. It can constantly ping your TP-Link router, your internet connection, or your favorite websites and alert you if anything goes offline.

**What to avoid on the Pi 3 B+:**
*   **Heavy Media Servers (Plex/Jellyfin):** The Pi 3 B+ will struggle to transcode video. 
*   **Heavy NAS (Network Attached Storage):** Because the Ethernet and USB ports share the same internal bus on the 3 B+, file transfer speeds to an external hard drive will be quite slow (maxing out around 10-15 Megabytes per second).

---

**You** · 2026-08-03 04:06

will this work if my internet is fiber

---

**Antigravity** · 2026-08-03 04:06

If you have fiber internet, the setup actually becomes **easier**, but you will have to **completely remove the Motorola SBG6580** from the equation.

Here is why: The Motorola SBG6580 is a DOCSIS (Cable) modem designed specifically to take a signal from a coaxial cable. Fiber internet does not use coaxial cables. 

Instead, your fiber provider will install a box on your wall or inside your house called an **ONT (Optical Network Terminal)**. This box acts as your "fiber modem" and has a standard Ethernet port on it.

### Your New Fiber Topology:
**Fiber ONT** (from ISP) ➔ **TP-Link AC1900** ➔ **Raspberry Pi 3 B+**

### How to set it up with Fiber:

1. **Ditch the Motorola:** You can put the Motorola SBG6580 in storage; it is incompatible with fiber and you no longer need it.
2. **Connect the Router:** Take an Ethernet cable and plug one end into the active port on your fiber provider's **ONT**, and plug the other end directly into the **WAN (Internet) port on your TP-Link AC1900**.
3. **Configure the TP-Link:** Log into the TP-Link just like before. Most fiber providers use "Dynamic IP" for the WAN setting, so it should just work automatically. (Note: A few specific providers like CenturyLink/Quantum sometimes require PPPoE credentials or VLAN tagging, but your ISP will tell you if that's the case).
4. **Plug in the Pi:** Connect your Raspberry Pi directly to one of the LAN ports on the TP-Link, just as planned.

Everything regarding the Raspberry Pi, assigning it a static IP, and running things like Pi-hole or a VPN remains exactly the same! Fiber will actually make your homelab significantly better because fiber offers symmetrical upload speeds, meaning if you host a VPN to access your files remotely, it will be incredibly fast.

---

**You** · 2026-08-03 04:08

can i use the motorola as a network extender

---

**Antigravity** · 2026-08-03 04:09

Technically **yes**, but with a major catch: it will only work as a **wired Access Point**, not as a wireless repeater. 

This means you cannot just plug it into the wall in a dead zone and have it catch and repeat the Wi-Fi signal out of thin air. You **must** run a physical Ethernet cable from your TP-Link router all the way to wherever you place the Motorola.

If you are willing to run an Ethernet cable to it, here is exactly how you turn that old Motorola gateway into a Wi-Fi extender:

### How to turn the Motorola SBG6580 into an Access Point:

**Step 1: Prep the Motorola (Do this before connecting it to the TP-Link)**
1. Plug your computer directly into the Motorola using an Ethernet cable.
2. Log into the Motorola's admin panel (usually `192.168.0.1`).
3. **CRITICAL STEP:** Find the **DHCP Server** setting and **Disable it**. If you leave this on, it will fight your TP-Link router to hand out IP addresses and break your entire internet.
4. **Change the IP Address:** You need to change the Motorola's own IP address so it doesn't conflict with the TP-Link. If your TP-Link is `192.168.0.1`, change the Motorola's LAN IP to something like `192.168.0.2`. (Write this down; it's how you'll log into the Motorola in the future).
5. **Set up the Wi-Fi:** Go to the wireless settings. Set the Network Name (SSID) and Password to be **exactly the same** as your TP-Link router. Set the security type to the exact same as well (usually WPA2-PSK).
6. Save all settings. The Motorola might reboot.

**Step 2: Wire it together**
1. Take a long Ethernet cable.
2. Plug one end into any of the **LAN ports** on your TP-Link router.
3. Plug the other end into any of the **LAN ports** on the Motorola. 

**How it works now:**
The TP-Link acts as the main brain, handling all the routing and traffic. The Motorola acts purely as a dumb antenna. When your phone walks near the Motorola, it will see the exact same Wi-Fi name and password and seamlessly connect to it, giving you a strong signal in that area.

*Note: The SBG6580 only supports Wi-Fi 4 (802.11n), so the speeds connected to the extender will be noticeably slower than being connected directly to your newer TP-Link (which is Wi-Fi 5 / 802.11ac), but it is perfectly fine for basic browsing, smart home devices, or streaming 1080p video in a dead zone.*

</details>

---

*Imported from Antigravity conversation `1a5fc988-2736-4f5f-ab4d-2e78334918fe` — 11 recorded steps, 1 context checkpoints (earlier turns were truncated by Antigravity). Source: `antigravity`.*
