---
title: "Tor browser and a few helium browser windows are not getting text input from keyboard"
description: "Troubleshooting keyboard input issues in Tor and Helium browsers on Linux"
date: "2026-09-19"
tags: ["linux","browser","input","troubleshooting","tor"]
source: "antigravity://8c643968-f888-46b5-b326-daf880bef6cc"
draft: false
vault: false
---

Tor browser and a few helium browser windows are not getting text input from keyboard

<details>
<summary>Chat transcript — 2 messages, 2026-09-19 → 2026-09-19</summary>

**You** · 2026-09-19 08:50

Tor browser and a few helium browser windows are not getting text input from keyboard


---

**Antigravity** · 2026-09-19 08:51

If you are running Tor Browser and Helium Browser on Linux and they are ignoring your keyboard input, this is a known issue typically caused by a conflict with your system's input method framework (like IBus) or an AppArmor security profile blocking access.

Here are the most common ways to fix it:

### 1. Force the use of XIM (X Input Method)
If you are using IBus for input, it sometimes conflicts with these browsers. You can override it to use `xim`.

If you launch Tor Browser from a terminal, try launching it like this to see if it fixes the issue temporarily:
```bash
GTK_IM_MODULE="xim" ./start-tor-browser.desktop
``` 

**To make this permanent for Tor Browser:**
1. Open the `start-tor-browser` script file located inside your Tor Browser folder using a text editor.
2. Add the following line immediately after the first line (the `#!/bin/sh` line):
   ```bash
   export GTK_IM_MODULE="xim"
   ```
3. Save the file and restart Tor Browser.

*You can do the same for Helium browser if it has a startup script, or set the environment variable globally if needed.*

### 2. AppArmor permissions (Very common on Ubuntu/Debian)
If you recently upgraded your system (e.g., to Ubuntu 24.04), AppArmor might be blocking these browsers from accessing IBus dbus sockets.

To check and fix this for Tor Browser:
1. Open the local AppArmor configuration file:
   ```bash
   sudo nano /etc/apparmor.d/local/torbrowser.Browser.firefox
   ```
2. Add the following line to the file:
   ```text
   owner @{HOME}/.cache/ibus/dbus-* rw,
   ```
3. Save and exit, then restart the AppArmor service:
   ```bash
   sudo systemctl restart apparmor.service
   ```

### 3. Display Server Check (Wayland vs. X11)
Some users encounter these keyboard focus issues specifically when running a modern Wayland session. 
- Try logging out of your desktop session.
- On the login screen, click the gear icon in the bottom right corner and select the **"X11"** or **"Xorg"** session instead of Wayland.
- Log in and see if the input works.

Let me know if any of these solutions work for you, or if you'd like me to help you apply them directly to your system!
</details>


*Imported from Antigravity conversation `8c643968-f888-46b5-b326-daf880bef6cc` — 8 recorded steps, 1 tool actions, 1 context checkpoints (earlier turns were truncated by Antigravity). Source: `antigravity`.
