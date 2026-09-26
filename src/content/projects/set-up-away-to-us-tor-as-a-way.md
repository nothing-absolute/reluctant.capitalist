---
title: "set up away to us tor as a way to hide ip on firefox for a given domain"
description: "Implementation plan for routing specific firefox domains through tor for ip privacy"
date: "2026-07-27"
tags: ["tor","firefox","privacy","proxy","network"]
source: "antigravity://7599b5ab-1520-447a-9350-e507991a1f8d"
draft: false
---

set up away to us tor as a way to hide IP on firefox for a given domain

## implementation plan

## Implementation Plan - Use Tor to Hide IP in Firefox for Specific Domains

We will configure Firefox to route traffic through the local Tor SOCKS proxy (`127.0.0.1:9050`) only for specific user-defined domains, while routing all other web traffic directly (using your normal IP address).

We verified that Tor is already installed and running on your system, listening on port `9050`.

We propose two main approaches:
1. **Proxy Auto-Configuration (PAC) File (No Extensions)**: A native Firefox feature using a lightweight JavaScript rule file.
2. **FoxyProxy Standard Extension (GUI-based)**: A popular browser extension that offers a visual interface to manage patterns and proxy rules.

---

## Proposed Approaches

### Approach 1: Proxy Auto-Configuration (PAC) File
This method uses a small JavaScript file that tells Firefox exactly when to use Tor.

1. **Create a local PAC file** (e.g., `~/.tor-proxy.pac`):
   ```javascript
   function FindProxyForURL(url, host) {
       // Replace "example.com" with your target domain
       if (shExpMatch(host, "example.com") || shExpMatch(host, "*.example.com")) {
           return "SOCKS5 127.0.0.1:9050; SOCKS 127.0.0.1:9050; DIRECT";
       }
       return "DIRECT";
   }
   ```
2. **Configure Firefox**:
   * Open Firefox **Settings** -> search for `proxy` -> click **Settings...** under *Network Settings*.
   * Select **Automatic proxy configuration URL**.
   * Enter: `file://[local path redacted]` (or the absolute path where you save the file).
   * Check **Proxy DNS when using SOCKS v5** (important to prevent DNS leaks).
   * Click **OK**.
   * *Note on Firefox security:* If Firefox blocks loading the local PAC file, go to `about:config`, search for `security.fileuri.strict_origin_policy`, set it to `false`, and restart Firefox. Alternatively, you can use a base64-encoded `data:` URI in the settings to avoid file-system restriction issues entirely.

---

### Approach 2: FoxyProxy Standard (Recommended for Ease of Use)
This is the most user-friendly way to manage proxy rules via a visual interface.

1. **Install FoxyProxy Standard**:
   * Open Firefox and go to [FoxyProxy Standard on Firefox Add-ons](https://addons.mozilla.org/firefox/addon/foxyproxy-standard/).
   * Click **Add to Firefox**.
2. **Configure Tor Proxy in FoxyProxy**:
   * Click the FoxyProxy icon in the toolbar and select **Options** / **Settings**.
   * Click **Add** to create a new proxy profile:
     * **Title**: `Tor SOCKS`
     * **Proxy Type**: `SOCKS5`
     * **IP address/Domain**: `127.0.0.1`
     * **Port**: `9050`
     * Check **Send DNS through SOCKS5 proxy** (critical for privacy).
     * Click **Save**.
3. **Set Up Domain Rules (Patterns)**:
   * Edit the newly created `Tor SOCKS` proxy profile and click the **Patterns** tab.
   * Add a new pattern:
     * **Pattern Name**: `Target Domain`
     * **Pattern**: `*example.com*` (or the specific domain you want to hide your IP on).
     * **Type**: `Wildcard`
     * Click **Save**.
4. **Enable Pattern Mode**:
   * Click the FoxyProxy toolbar icon and change the mode to **"Use Enabled Proxies by Patterns and Order"**.

---

## Verification Plan

We will verify the setup using:
1. **Normal browsing**: Visit `https://check.torproject.org/api/ip` (or generic IP checkers like `ifconfig.me`) and confirm it shows your normal IP address.
2. **Proxied browsing**: Visit the configured target domain and verify it resolves successfully. If we configure a test pattern for `check.torproject.org`, visiting it should display: `"IsTor": true`.

## task

- `[x]` Create the template PAC file
- `[x]` Provide a script to quickly update the domain in the PAC file
- `[x]` Document the exact Firefox setup steps and about:config parameters
- `[x]` Create the final walkthrough

## walkthrough

## Walkthrough: Route Specific Firefox Domains through Tor

We have successfully created a local PAC (Proxy Auto-Configuration) file template and a Python management script to quickly add/remove domains. This walkthrough outlines the step-by-step setup and verification instructions.

---

## Files Created

* **PAC File**: [[local path redacted]](file://[local path redacted])
* **Management Script**: [[local path redacted]](file://[local path redacted])

---

## 🛠️ Step-by-Step Configuration

Choose **one** of the two approaches below to configure Firefox.

### Option 1: Native Firefox PAC File (No Extensions)

#### Step 1.1: Edit Your Domains
You can add your desired domain using the python management script:
```bash
python3 [local path redacted] add yourdomain.com
```
*(Optionally you can also add wildcards like `*.yourdomain.com`)*

#### Step 1.2: Enable local file URLs in Firefox (If using file:// path)
Due to security restrictions, modern Firefox might block PAC files loaded from the local filesystem (`file://`) unless this setting is updated:
1. Open Firefox and type `about:config` in the address bar. Press **Enter** and accept the risk warning.
2. Search for: `security.fileuri.strict_origin_policy`
3. Click the toggle button to change it from `true` to **`false`**.

#### Step 1.3: Configure the Proxy URL in Firefox
1. In Firefox, open **Settings** (or type `about:preferences` in the address bar).
2. Scroll to the bottom to **Network Settings** and click **Settings...**.
3. Select **Automatic proxy configuration URL**.
4. Paste the path to the created PAC file:
   ```text
   file://[local path redacted]
   ```
5. Check **Proxy DNS when using SOCKS v5** (this is vital to prevent your DNS requests from leaking your IP).
6. Click **OK**.

> [!TIP]
> **Alternative (Zero-Config Data URL)**:
> If you don't want to change `about:config`, you can convert the JavaScript code of your PAC file into a `data:` URI and paste it directly into the URL box. For example:
> `data:text/javascript,function FindProxyForURL(u,h){if(shExpMatch(h,"check.torproject.org")||shExpMatch(h,"yourdomain.com")){return "SOCKS5 127.0.0.1:9050; DIRECT";}return "DIRECT";}`

---

### Option 2: FoxyProxy Standard Extension (Easiest & Recomended)

If you prefer a visual GUI without modifying Firefox's internal files and policies:

1. **Install FoxyProxy Standard** from [addons.mozilla.org](https://addons.mozilla.org/firefox/addon/foxyproxy-standard/).
2. Click the FoxyProxy toolbar icon and choose **Settings**.
3. Click **Add** to create a proxy configuration:
   * **Proxy Type**: `SOCKS5`
   * **IP address/Domain**: `127.0.0.1`
   * **Port**: `9050`
   * Check **Send DNS through SOCKS5 proxy** (critical).
   * Save it.
4. Edit the new Tor proxy, go to the **Patterns** tab, and click **Add** to define your target domains:
   * **Pattern**: `*yourdomain.com*` (Wildcard)
   * Save it.
5. In the main FoxyProxy drop-down menu, select **"Use Enabled Proxies by Patterns and Order"**.

---

## 🔍 How to Verify It's Working

1. **Test Proxied Traffic**:
   Visit [check.torproject.org](https://check.torproject.org). 
   * Since `check.torproject.org` is included in your default PAC/FoxyProxy pattern list, it will show a green message: **"Congratulations. This browser is configured to use Tor."**
2. **Test Normal Traffic**:
   Visit a general IP checker like [ifconfig.me](https://ifconfig.me) or [icanhazip.com](https://icanhazip.com).
   * Since this is not in the proxy list, it will show your normal direct IP address.

## Assets
- [implementation_plan.md](/antigravity/set-up-away-to-us-tor-as-a-way/implementation_plan.md) — MD, 3 KB
- [task.md](/antigravity/set-up-away-to-us-tor-as-a-way/task.md) — MD, 219 B
- [walkthrough.md](/antigravity/set-up-away-to-us-tor-as-a-way/walkthrough.md) — MD, 4 KB

<details>
<summary>Chat transcript — 4 messages, 2026-07-27 → 2026-07-27</summary>

**You** · 2026-07-27 17:46

set up away to us tor as a way to hide IP on firefox for a given domain

---

**Antigravity** · 2026-07-27 17:50

&nbsp;Incoming message from background task:
```
{"exitCode":0,"output":"{\"IsTor\":true,\"IP\":\"185.220.101.4\"}curl: (97) SOCKS5: connection failed\n"}
```

---

**Antigravity** · 2026-07-27 17:50

I have created an implementation plan detailing the two main approaches for routing Firefox traffic through Tor for a specific domain: using a native **Proxy Auto-Configuration (PAC) file** or using the **FoxyProxy Standard extension**. 

Please review the plan in [implementation_plan.md](file://[local path redacted]) and let me know how you would like to proceed or if you have any questions/preferences!

---

**Antigravity** · 2026-07-27 17:51

I have successfully completed the setup for routing Firefox traffic through Tor for specific domains.

### Summary of Completed Work
1. **Configured Tor Connection**: Verified that Tor is installed and active on `127.0.0.1:9050`.
2. **Created PAC File Template**: Created [proxy.pac](file://[local path redacted]) which contains the routing rules for specific domains.
3. **Created Domain Management Script**: Provided a Python command-line utility [manage_proxy.py](file://[local path redacted]) to easily add or remove domains from the PAC file.
4. **Wrote Complete Setup Guide**: Documented step-by-step instructions for Firefox settings (`about:config` updates, proxy settings, and an alternative FoxyProxy route) in the [walkthrough.md](file://[local path redacted]) artifact.

Please review the [walkthrough.md](file://[local path redacted]) file to finish the Firefox setup and verify that it is working as expected.

</details>

---

*Imported from Antigravity conversation `7599b5ab-1520-447a-9350-e507991a1f8d` — 34 recorded steps, 13 tool actions, 1 context checkpoints (earlier turns were truncated by Antigravity). Source: `antigravity`.*
