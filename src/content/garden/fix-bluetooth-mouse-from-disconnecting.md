---
title: "Fix Bluetooth Mouse From Disconnecting"
description: "Troubleshooting steps for Bluetooth mouse disconnections on Linux"
date: "2026-08-09"
tags: ["bluetooth","linux","troubleshooting","mouse"]
source: "antigravity://a258bb94-e87d-46f0-af78-3dd512a93615"
draft: false
vault: false
---

🔍 Fix Bluetooth Mouse From Disconnecting

<details>
<summary>Chat transcript — 2 messages, 2026-08-09 → 2026-08-09</summary>

**You** · 2026-08-09 10:54

🔍 Fix Bluetooth Mouse From Disconnecting


**Antigravity** · 2026-08-09 11:00

Bluetooth mouse disconnections on Linux are usually caused by aggressive system power-saving features that put the Bluetooth receiver or the mouse itself to sleep. 

However, I've checked your system configuration and the most common culprits are **already disabled**:
* **Bluetooth Idle Timeout** is disabled in your `/etc/bluetooth/input.conf`.
* **USB Autosuspend** for your Intel Bluetooth controller is disabled at the kernel level.

Since those settings are already optimized for a stable connection, the issue is likely due to one of the following. Here are the best steps to fix it, ordered from most likely to least likely:

### 1. Clear Pairing Data & Re-pair (Highly Recommended)
Often, the Bluetooth pairing data gets corrupted, leading to constant disconnects. Re-pairing from scratch using the terminal usually creates a more stable connection than using the GUI.

Open your terminal and run these commands:
```bash
bluetoothctl
``` 
Then, inside the `[bluetooth]#` prompt, type the following (replace `MAC_ADDRESS` with your mouse's MAC address, which you can see by typing `devices`):
```text
power on
agent on
default-agent
remove <MAC_ADDRESS>
scan on 
``` 
*Put your mouse into pairing mode now, wait for it to show up, then run:*
```text
pair <MAC_ADDRESS>
trust <MAC_ADDRESS>
connect <MAC_ADDRESS>
exit
``` 
*(Note: The `trust` command is crucial here, as it allows the mouse to reconnect automatically without issues).*

### 2. Disable "FastConnectable"
Your `/etc/bluetooth/main.conf` currently has `FastConnectable = true` enabled at the bottom. While this helps some devices connect faster, it can cause older or cheaper Bluetooth mice to disconnect frequently. 

You can disable it by running this command in your terminal (it will prompt for your password):
```bash
sudo sed -i 's/^FastConnectable = true/FastConnectable = false/' /etc/bluetooth/main.conf && sudo systemctl restart bluetooth
``` 

### 3. Check for 2.4GHz Wi-Fi Interference
If your computer is connected to a 2.4GHz Wi-Fi network, the Wi-Fi card can heavily interfere with Bluetooth (since they share the same physical antenna and frequency on most laptops). 
* **The Fix**: Try connecting your computer to a **5GHz Wi-Fi network** instead, or move closer to your router if that's not possible. 

### 4. Replace the Battery
It sounds obvious, but many Bluetooth mice will silently drop the connection to save power when the battery is running low, rather than turning off completely. If you haven't replaced the battery recently, try swapping it out.

Let me know if any of these solutions work for you!
</details>


*Imported from Antigravity conversation `a258bb94-e87d-46f0-af78-3dd512a93615` — 52 recorded steps, 15 tool actions, 1 context checkpoints (earlier turns were truncated by Antigravity). Source: `antigravity`.
