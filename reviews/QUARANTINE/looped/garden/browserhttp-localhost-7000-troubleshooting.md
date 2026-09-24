---
title: "browserhttp://localhost:7000/ /troubleshooting"
description: "Troubleshooting steps to connect Ollama model running on Tank Pro 3 to Odysseus"
date: "2026-07-04"
tags: ["troubleshooting","odysseus","ollama","android","ai"]
source: "antigravity://a38447ef-2a2f-4b65-9627-8ab3a9e20ab4"
draft: false
vault: false
---

/browserhttp://localhost:7000/ /troubleshooting https://github.com/pewdiepie-archdaemon/odysseus try to finish setting this up and need steps after logging in and changing the username and password. I need steps to connect the model. Which is running on a Tank Pro 3 with internal: RAM:16/18GB ROM:512GB OS: Android 15

## odysseus model setup

## Odysseus — Connect Model from Tank Pro 3

**Current state confirmed live at `http://localhost:7000`:**
- ✅ Logged in as **dickman**
- ✅ Ollama endpoint exists (`host.docker.internal:11434`) but has **no models pulled**
- ❌ "Select model" dropdown is empty — nothing to chat with yet

![Main dashboard — logged in, no model selected](/home/jd/.gemini/antigravity/brain/a38447ef-2a2f-4b65-9627-8ab3a9e20ab4/07_main_dashboard.png)

---

## What You Need to Do

Your Tank Pro 3 will run Ollama over Wi-Fi. Odysseus (in Docker on your PC) connects to it via LAN IP. Here's every step.

---

## 📱 Part 1: Set Up Ollama on the Tank Pro 3

### 1-A. Install Termux
> **Important:** Get Termux from [F-Droid](https://f-droid.org/packages/com.termux/) — the Play Store version is outdated and missing key features.

### 1-B. Open Termux and prepare environment
```bash
pkg update && pkg upgrade -y
pkg install tmux termux-tools
```

### 1-C. Install Ollama
```bash
pkg install ollama
```
> If that fails (not in repo yet for your version):
> ```bash
> pkg install golang git
> git clone https://github.com/ollama/ollama
> cd ollama && go build . && mv ollama $PREFIX/bin/
> ```

### 1-D. Keep Termux awake (critical — prevents Android from killing it)
```bash
termux-wake-lock
```
Also do this in Android Settings:
> **Settings → Battery → Battery Optimization → Termux → Don't optimize**

### 1-E. Start Ollama listening on the LAN (inside a tmux session)
```bash
tmux new -s ollama
OLLAMA_HOST=0.0.0.0:11434 ollama serve
```
Then press **Ctrl+B, then D** to detach (Ollama keeps running in background).

### 1-F. Pull a model suited for your 16–18 GB RAM

| Model | Size | Good for |
|---|---|---|
| `qwen2.5:7b` | ~4.7 GB | General purpose, fast |
| `phi4-mini` | ~2.5 GB | Lightweight, very fast |
| `llama3.2:3b` | ~2.0 GB | Ultra-light, snappy |
| `mistral:7b-instruct` | ~4.1 GB | Instruction tasks |
| `qwen2.5:14b` | ~9.0 GB | Bigger, better quality |

```bash
# Run in a second tmux window (Ctrl+B, C for new window):
ollama pull qwen2.5:7b
```

### 1-G. Find your Tank Pro 3's LAN IP
In Termux:
```bash
ip addr show wlan0 | grep 'inet '
```
Or: **Android Settings → About Phone → Status → IP address**

Note it down — e.g. `192.168.1.47`

### 1-H. Verify Ollama is serving (test from Termux)
```bash
curl http://localhost:11434/v1/models
```
Should return JSON with your model listed.

---

## 🖥️ Part 2: Add the Endpoint in Odysseus

### 2-A. Open Settings

At `http://localhost:7000`, click the **⚙️ gear icon** in the bottom-left sidebar.

![Settings — Added Models (shows existing empty Ollama entry)](/home/jd/.gemini/antigravity/brain/a38447ef-2a2f-4b65-9627-8ab3a9e20ab4/03_added_models.png)

> **Note:** There's already an entry for `host.docker.internal:11434` — that points to Ollama on your local PC. Since you want to use the **Tank Pro 3 over Wi-Fi**, you'll add a **new** endpoint for it.

### 2-B. Click the "Add Models" tab

![Add Models tab — paste your endpoint URL here](/home/jd/.gemini/antigravity/brain/a38447ef-2a2f-4b65-9627-8ab3a9e20ab4/09_add_models_full.png)

### 2-C. Add the Tank Pro 3 as a Local Endpoint

In the **"Add Local Models (Endpoint)"** section:
1. Confirm type is set to **LLM** (not Image)
2. Paste into the URL field:
   ```
   http://192.168.1.47:11434/v1
   ```
   *(Replace `192.168.1.47` with your actual Tank Pro 3 IP)*
3. Click **Test** first — you should see a success indicator
4. Click **Add**

### 2-D. Set as Default Model

Go to the **"AI Defaults"** tab:

![AI Defaults tab — set your default model here](/home/jd/.gemini/antigravity/brain/a38447ef-2a2f-4b65-9627-8ab3a9e20ab4/04_ai_defaults.png)

1. Under **Default Chat Model**, click the endpoint dropdown
2. Select your Tank Pro 3 endpoint (`192.168.1.47:11434`)
3. Select the model (e.g. `qwen2.5:7b`)
4. Click **Save**

---

## ✅ Part 3: Verify It Works

1. Close Settings
2. Back on the main chat page, click the **"Select model"** dropdown (bottom-right of input box)
3. Your Tank Pro 3 models should appear
4. Type a test message and hit send
5. You should get a response from your local model!

---

## 🔧 Troubleshooting Quick Reference

| Symptom | Fix |
|---|---|
| Test fails in Odysseus | Check both devices are on same Wi-Fi; confirm `OLLAMA_HOST=0.0.0.0` |
| Models list empty | Run `ollama pull <model>` in Termux first |
| Ollama stops randomly | `termux-wake-lock` + disable battery optimization for Termux |
| Can't reach from Docker | Use LAN IP (not `localhost`) — Docker can't reach the phone's localhost |
| Slow responses | Start with smaller models (3b/7b Q4); Dimensity 8200 is CPU-only, no GPU offload in Termux |

### Test connectivity from your PC terminal:
```bash
# Should return JSON list of your models
curl http://192.168.1.47:11434/v1/models
```

### From inside the Odysseus Docker container:
```bash
docker compose exec odysseus curl http://192.168.1.47:11434/v1/models
```

---

## 📝 Hardware Context (Tank Pro 3)

- **Chip:** MediaTek Dimensity 8200 (ARM64, 8-core, 3.1GHz)
- **RAM:** 16–18 GB (comfortable for 7B Q4, possible 13B Q4)
- **Note:** No GPU offload in Termux/Ollama on Android — runs on CPU cores only
- **Tip:** For better throughput, consider quantized GGUF models optimized for ARM (Q4_K_M or Q5_K_M)

## Assets
![03_added_models](/antigravity/browserhttp-localhost-7000-troubleshooting/03_added_models.png)
- [03_added_models.png](/antigravity/browserhttp-localhost-7000-troubleshooting/03_added_models.png) — PNG, 130 KB
![04_ai_defaults](/antigravity/browserhttp-localhost-7000-troubleshooting/04_ai_defaults.png)
- [04_ai_defaults.png](/antigravity/browserhttp-localhost-7000-troubleshooting/04_ai_defaults.png) — PNG, 129 KB
![07_main_dashboard](/antigravity/browserhttp-localhost-7000-troubleshooting/07_main_dashboard.png)
- [07_main_dashboard.png](/antigravity/browserhttp-localhost-7000-troubleshooting/07_main_dashboard.png) — PNG, 87 KB
![09_add_models_full](/antigravity/browserhttp-localhost-7000-troubleshooting/09_add_models_full.png)
- [09_add_models_full.png](/antigravity/browserhttp-localhost-7000-troubleshooting/09_add_models_full.png) — PNG, 134 KB
![add_models_tab_live](/antigravity/browserhttp-localhost-7000-troubleshooting/add_models_tab_live.png)
- [add_models_tab_live.png](/antigravity/browserhttp-localhost-7000-troubleshooting/add_models_tab_live.png) — PNG, 99 KB
![added_models_after_restart](/antigravity/browserhttp-localhost-7000-troubleshooting/added_models_after_restart.png)
- [added_models_after_restart.png](/antigravity/browserhttp-localhost-7000-troubleshooting/added_models_after_restart.png) — PNG, 109 KB
![added_models_tab_new](/antigravity/browserhttp-localhost-7000-troubleshooting/added_models_tab_new.png)
- [added_models_tab_new.png](/antigravity/browserhttp-localhost-7000-troubleshooting/added_models_tab_new.png) — PNG, 96 KB
![live_dashboard_screenshot](/antigravity/browserhttp-localhost-7000-troubleshooting/live_dashboard_screenshot.png)
- [live_dashboard_screenshot.png](/antigravity/browserhttp-localhost-7000-troubleshooting/live_dashboard_screenshot.png) — PNG, 67 KB
- [odysseus_model_setup.md](/antigravity/browserhttp-localhost-7000-troubleshooting/odysseus_model_setup.md) — MD, 5 KB

<details>
<summary>Chat transcript — 28 messages, 2026-07-04 → 2026-07-27</summary>

**You** · 2026-07-04 14:59

/browserhttp://localhost:7000/ /troubleshooting https://github.com/pewdiepie-archdaemon/odysseus try to finish setting this up and need steps after logging in and changing the username and password. I need steps to connect the model. Which is running on a Tank Pro 3 with internal: RAM:16/18GB ROM:512GB  OS: Android 15

---

**Antigravity** · 2026-07-04 14:59

Let me start by reading the troubleshooting skill and researching the GitHub repository simultaneously.

---

**Antigravity** · 2026-07-04 14:59

Now I have a good understanding of the project. Let me read the setup guide docs and also launch the browser subagent simultaneously.

---

**Antigravity** · 2026-07-04 14:59

Good, I now have the setup guide. The browser subagent is running. Let me wait for its response while I also search for information about connecting an Android-hosted Ollama model to Odysseus.

---

**Antigravity** · 2026-07-04 15:00

Now let me wait for the browser subagent response to see the current state of the app at localhost:7000.

The browser subagent is still running. Let me also look for how Ollama or LM Studio can be run on Android specifically, since the user mentioned the Tank Pro 3 has 16-18GB RAM and they want to run models from it.

---

**Antigravity** · 2026-07-04 15:00

I now have a comprehensive picture. Let me wait for the browser subagent to report back on the current state of the Odysseus UI.

The browser agent is still working. While I wait, I have enough information to start preparing a thorough response. Let me check if the browser agent has responded yet.

---

**Antigravity** · 2026-07-04 15:00

The browser subagent is still working. Let me set a timer and proceed to compile the information I have.

---

**Antigravity** · 2026-07-04 15:00

Good. Now I have enough information to give you a comprehensive guide while the browser agent finishes checking the live UI. Here's what I've found:

---

## Odysseus Setup: After Login — Connecting Your Model

Based on the [Odysseus repo](https://github.com/pewdiepie-archdaemon/odysseus) and setup docs, here's your complete flow.

---

### 🔐 Step 1: First Login (You've Done This)
- Default admin user: `admin` (unless `ODYSSEUS_ADMIN_USER` was set in `.env`)
- Temp password: printed in `docker compose logs odysseus`
- Change username/password in **Settings** after logging in ✅

---

### 📱 Your Setup: Tank Pro 3 as the Model Server

**Hardware confirmed:**
- Chip: MediaTek Dimensity 8200 (octa-core, 3.1GHz, ARM64)
- RAM: 16–18 GB
- OS: Android 15
- Storage: 512 GB

This is capable of running small-to-mid size quantized models (7B Q4/Q5 fits in ~6–8 GB, leaving headroom).

---

### 🤖 Step 2: Set Up Ollama on the Tank Pro 3

**On the Tank Pro 3 (Android):**

1. **Install Termux** from [F-Droid](https://f-droid.org/packages/com.termux/) (NOT the Play Store version — it's outdated)

2. **Open Termux and install Ollama:**
   ```bash
   pkg update && pkg upgrade -y
   pkg install ollama
   ```
   > If `pkg install ollama` fails, use the community method:
   > ```bash
   > pkg install golang git
   > git clone https://github.com/ollama/ollama
   > cd ollama && go build .
   > ```

3. **Keep Termux awake (critical):**
   ```bash
   termux-wake-lock
   ```

4. **Start Ollama listening on your LAN (not just localhost):**
   ```bash
   OLLAMA_HOST=0.0.0.0:11434 ollama serve
   ```
   > Use `tmux` to keep it running in the background:
   > ```bash
   > pkg install tmux
   > tmux new -s ollama
   > OLLAMA_HOST=0.0.0.0:11434 ollama serve
   > # Ctrl+B then D to detach
   > ```

5. **Pull a model suited for your RAM (pick one):**
   ```bash
   ollama pull qwen2.5:7b          # Good general purpose, ~4.7GB
   ollama pull phi4-mini            # Fast/light, ~2.5GB
   ollama pull llama3.2:3b          # Lightweight, ~2GB
   ollama pull mistral:7b-instruct  # Good instruction following
   ```
   > With 16–18GB RAM, you can comfortably run 7B Q4 models and likely 13B Q4 with some tuning.

6. **Find the Tank Pro 3's IP address:**
   - Go to Android **Settings → About Phone → Status → IP address**, or:
   ```bash
   ip addr show wlan0
   ```
   - Note the IP, e.g. `192.168.1.47`

---

### 🔌 Step 3: Connect the Model in Odysseus

**On your PC (at http://localhost:7000), after logging in:**

#### Method A — Settings → Connections (Recommended)

1. Click the **gear icon ⚙️** (Settings) in the bottom-left sidebar
2. Go to **Connections** (or **Models / Providers**)
3. Find the **OpenAI-compatible API** or **Ollama** section
4. Set the **Base URL** to:
   ```
   http://192.168.1.47:11434/v1
   ```
   *(replace with your Tank Pro 3's actual IP)*
5. Set **API Key** to any placeholder (Ollama doesn't need a real key):
   ```
   ollama
   ```
6. Click **Save / Test Connection**

#### Method B — Cookbook (Odysseus-native model manager)

1. Click **Cookbook** in the left sidebar
2. Go to **Cookbook → Settings → Servers**
3. Add your Tank Pro 3 as a remote server (SSH or direct endpoint)
4. Point it to `http://192.168.1.47:11434`

---

### 🔥 Important: Android Firewall/Network Notes

| Issue | Fix |
|---|---|
| Connection refused | Make sure `OLLAMA_HOST=0.0.0.0` is set (not `localhost`) |
| Intermittent drops | Use `termux-wake-lock` to prevent Android killing the process |
| Can't reach from PC | Both devices must be on the **same Wi-Fi network** |
| Android kills Ollama | Add Termux to battery optimization exceptions in Android Settings |

**To exclude Termux from Android battery optimization:**
> Android Settings → Battery → Battery Optimization → Find Termux → Set to "Don't optimize"

---

### ✅ Step 4: Test It

In Odysseus:
1. Start a new **Chat**
2. Click the model selector (top of chat)
3. Your Ollama models from the Tank Pro 3 should appear (e.g., `qwen2.5:7b`)
4. Send a test message — confirm it responds

---

### 🔧 Quick Troubleshooting

```bash
# On the Tank Pro 3 — verify Ollama API is reachable:
curl http://localhost:11434/v1/models

# From your PC — verify it's reachable over the network:
curl http://192.168.1.47:11434/v1/models
```
Expected response: a JSON list of your pulled models.

---

I'm waiting for the browser agent to finish inspecting your live UI at `localhost:7000` to give you screen-specific steps. I'll update you with the exact button names and navigation path as soon as it reports back.

---

**Antigravity** · 2026-07-04 15:02

Message sent — waiting for the browser agent to respond with a screenshot of your live Odysseus UI. I'll update you with the exact navigation steps as soon as it reports back.

---

**Antigravity** · 2026-07-04 15:04

The browser agent is back with a full picture. Let me copy the screenshots and write you a targeted guide based on what's actually in your UI.

---

**Antigravity** · 2026-07-04 15:18

Here's the full picture based on your **live UI**:

---

## What I Found in Your Odysseus

✅ **Already logged in as "dickman"** — username/password change is done  
✅ **Ollama endpoint already configured** at `host.docker.internal:11434`  
❌ **No models are pulled** — that endpoint shows "no models," which is why the model picker is empty

---

## The Exact Steps to Connect Your Tank Pro 3

### On the Tank Pro 3 (Termux):
1. Install Termux from **F-Droid** (not Play Store)
2. `pkg install ollama` then `termux-wake-lock`
3. Start with: `OLLAMA_HOST=0.0.0.0:11434 ollama serve` (inside tmux)
4. Pull a model: `ollama pull qwen2.5:7b` (fits in ~4.7GB, leaves plenty of headroom on your 16GB)
5. Find your LAN IP: `ip addr show wlan0`

### In Odysseus (`localhost:7000`):
1. **⚙️ Settings → "Add Models" tab**
2. In the **Add Local Models** section, paste:
   ```
   http://192.168.1.47:11434/v1
   ```
   *(your actual Tank Pro 3 IP)*
3. Click **Test** → then **Add**
4. Go to **"AI Defaults" tab** → set that endpoint + model as default
5. Back in chat — click "Select model" → your models appear → start chatting!

> **Note on the existing `host.docker.internal:11434` entry:** That points to Ollama *on your PC*, not the phone. You're adding the Tank Pro 3 as a **separate new endpoint** via its LAN IP.

The full guide with screenshots is in the artifact above. Let me know if you hit any snag during setup!

---

**You** · 2026-07-04 22:02

/browser http://localhost:7000/

---

**Antigravity** · 2026-07-04 22:02

Opening `http://localhost:7000/` in the browser now — I'll report back as soon as I can see the current state of the UI.

---

**You** · 2026-07-04 22:05

/browser http://localhost:7000/

---

**Antigravity** · 2026-07-04 22:05

I've launched the browser subagent again to inspect `http://localhost:7000/`. Let's wait for it to report back what it sees. I'll let you know as soon as it provides the screenshots and details of the current UI state.

---

**Antigravity** · 2026-07-04 22:08

The browser subagent has successfully loaded the page, and we have a fresh look at your Odysseus instance:

![Live Dashboard Screenshot](/home/jd/.gemini/antigravity/brain/a38447ef-2a2f-4b65-9627-8ab3a9e20ab4/live_dashboard_screenshot.png)

As you can see right in the center of the screen, the system is explicitly prompting you to add a model:
> **"Add an AI endpoint from Settings in the sidebar, or paste an endpoint/API key into the chat."**

This lines up perfectly with the steps I outlined earlier. To connect the models running on your Android Tank Pro 3, you'll need to use the `Settings` menu located in the bottom-left corner (represented by the gear icon next to your name).

### Quick Recap of Next Steps to Connect Your Tank Pro 3:

1. **On your Tank Pro 3 (Android 15):**
   - Ensure Ollama is running inside Termux.
   - Start the server bound to all IPs: `OLLAMA_HOST=0.0.0.0:11434 ollama serve`
   - Note down the IP address of your phone on the Wi-Fi network (e.g., `192.168.1.XX`).

2. **In Odysseus (`localhost:7000`):**
   - Click the **Settings** (⚙️) icon in the bottom-left corner.
   - Select the **Add Models** tab.
   - Under the "Add Local Models" section, select "LLM" and paste your phone's IP address with the port and API version, like this: `http://192.168.1.XX:11434/v1` (replace the X's with your actual IP).
   - Click **Test** and then **Add**.

Once that's done, you can click the "Select model" dropdown (in the message input box at the bottom right) to pick the model you pulled on your phone and start chatting!

You can check out the full detailed artifact [Odysseus Setup Guide](file:///home/jd/.gemini/antigravity/brain/a38447ef-2a2f-4b65-9627-8ab3a9e20ab4/odysseus_model_setup.md) for more in-depth troubleshooting if you run into any network issues between your PC and the phone. Let me know if you need help getting Ollama running properly in Termux!

---

**You** · 2026-07-04 22:13

/browser can you input thge settings in your browser

---

**Antigravity** · 2026-07-04 22:13

I've instructed the browser subagent to open the **Settings** menu and navigate to the **Add Models** tab so it's ready.

To input the correct endpoint, **what is the IP address of your Tank Pro 3?** (Or if you want to connect to a different endpoint/API key, please let me know the details and I'll have the browser subagent input them for you).

---

**Antigravity** · 2026-07-04 22:14

The browser subagent has successfully navigated to the **Add Models** tab:

![Add Models Tab Live](/home/jd/.gemini/antigravity/brain/a38447ef-2a2f-4b65-9627-8ab3a9e20ab4/add_models_tab_live.png)

It's ready to input the URL under **Add Local Models (Endpoint)**.

Please let me know the **IP address** of your Tank Pro 3 (e.g., `192.168.1.47` or whatever was reported by `ip addr show wlan0` in Termux), and I'll have the subagent type it in, test it, and save it for you!

---

**You** · 2026-07-04 22:16

10.218.143.108

---

**Antigravity** · 2026-07-04 22:16

I've instructed the subagent to input `http://10.218.143.108:11434/v1` under the local models endpoint, test/add it, and show us the status of the added endpoint. I will share the results and screenshot as soon as it completes.

---

**Antigravity** · 2026-07-04 22:18

The browser subagent has successfully added the endpoint `http://10.218.143.108:11434/v1`! 

Here is the updated **Added Models** tab showing the configuration:

![Added Models Tab New](/home/jd/.gemini/antigravity/brain/a38447ef-2a2f-4b65-9627-8ab3a9e20ab4/added_models_tab_new.png)

### ⚠️ Status: "no models"
As shown in the screenshot, the connection itself is active and responding, but it currently reports **no models** are loaded/downloaded on your Ollama server on the Tank Pro 3. Because of this, Odysseus doesn't have any models to show in your chat interface yet.

### How to fix this:
You need to pull (download) a model on your Tank Pro 3. 

1. On your **Tank Pro 3**, open the Termux terminal.
2. If `ollama serve` is currently taking up your screen, open a new Termux session (swipe in from the left edge of your screen and select **New Session**).
3. Type the following command to pull a highly-optimized model that will run smoothly on your hardware (7B parameter size is a great match for your 16/18GB RAM):
   ```bash
   ollama pull qwen2.5:7b
   ```
   *(Or if you prefer a smaller/faster model, you can run `ollama pull llama3.2:3b` or `ollama pull phi4-mini`).*

Once the download finishes, let me know, and I will have the browser subagent trigger a probe/refresh to detect the model and select it as your default model!

---

**You** · 2026-07-08 01:21

No model servers found. Make sure vLLM, llama.cpp, SGLang, or Ollama is running. Docker users may need Ollama bound to a trusted reachable interface.

---

**Antigravity** · 2026-07-08 01:21

I've started a browser subagent to check the settings and model connection state on Odysseus at `http://localhost:7000/`. Let's wait for it to inspect the current state and report back. 

In the meantime, the error message **"No model servers found"** usually indicates that Odysseus on your PC can no longer connect to the Ollama server on your Tank Pro 3. This typically happens for one of these reasons:

1. **The phone's IP address changed:** Mobile devices on Wi-Fi frequently get assigned new IP addresses by the router (DHCP). Your phone's IP might no longer be `10.218.143.108`.
2. **Ollama stopped running on your phone:** Android may have killed the Termux background process to save battery.
3. **Wi-Fi Connection:** Make sure both your PC and your phone are still connected to the exact same Wi-Fi network.
4. **Ollama listening interface:** Ollama might have restarted without the `OLLAMA_HOST=0.0.0.0:11434` environment variable, restricting it to local-only connections.

Let's wait for the browser agent's report, and then we will troubleshoot this.

---

**Antigravity** · 2026-07-08 01:22

I see that because of the server restart, Odysseus lost the settings we input last time. The only endpoint configured right now is `host.docker.internal:11434` (Ollama on your PC), which has no models pulled, causing the "No model servers found" error message.

I have just instructed the browser subagent to re-add `http://10.218.143.108:11434/v1` to see if your Tank Pro 3 is still listening on that IP address. 

Let's wait a moment to see if the connection test succeeds. If it fails, we will need to confirm if your phone's IP has changed or if Ollama is still running on it.

---

**You** · 2026-07-08 10:05

k

---

**You** · 2026-07-27 11:21

set up odysseus on my computer to be set up with opencode

---

**Antigravity** · 2026-07-27 11:24

Good, now I have a clear picture. Here's what's going on and exactly how to set it up:

---

## Setting Up Odysseus with OpenCode

**OpenCode** has two tiers, both natively supported in Odysseus' "Add API Models" dropdown:

| Plan | Type | Base URL |
|---|---|---|
| **OpenCode Zen** | Pay-as-you-go | `https://opencode.ai/zen/v1` |
| **OpenCode Go** | Subscription | `https://opencode.ai/zen/go/v1` |

Both use the standard OpenAI-compatible chat format.

---

### Step 1: Get Your OpenCode API Key

1. Go to **[opencode.ai](https://opencode.ai)** and sign in / create an account
2. Navigate to your **account settings / API keys** section
3. Generate a new API key — it will look like `sk-...`
4. Copy it

---

### Step 2: Add OpenCode in Odysseus Settings

1. Open **`http://localhost:7000`** in your browser
2. Click the **⚙️ Settings** gear icon (bottom-left sidebar)
3. Go to the **"Add Models"** tab
4. Scroll to the **"Add API Models"** section
5. In the **provider dropdown**, select:
   - **"OpenCode Zen"** (pay-as-you-go) — OR
   - **"OpenCode Go"** (if you have a subscription)
6. The **Base URL** should auto-fill — if it doesn't, set it to:
   - Zen: `https://opencode.ai/zen/v1`
   - Go: `https://opencode.ai/zen/go/v1`
7. Paste your **API key** into the API Key field
8. Click **Test** → then **Add**

---

### Step 3: Set as Default

1. Go to the **"AI Defaults"** tab in Settings
2. Under **Default Chat Model**, select your OpenCode endpoint and a model (e.g. `claude-sonnet-4-5`, `gpt-4o`, etc. — OpenCode Zen routes to various top models)
3. Click **Save**
4. Close Settings — you should now see OpenCode models available in the model picker in the chat input bar

---

> **Do you want me to open the browser and fill this in for you?** Just share your OpenCode API key (or paste it directly into the Odysseus chat box — it supports pasting API keys directly!) and I can have the browser subagent do it automatically. Note: the `/browser` subagent quota resets in a couple of days, so manual steps above should work in the meantime.

</details>

---

*Imported from Antigravity conversation `a38447ef-2a2f-4b65-9627-8ab3a9e20ab4` — 105 recorded steps, 33 tool actions, 2 context checkpoints (earlier turns were truncated by Antigravity). Source: `antigravity`.*
