# Odysseus — Connect Model from Tank Pro 3

**Current state confirmed live at `http://localhost:7000`:**
- ✅ Logged in as **dickman**
- ✅ Ollama endpoint exists (`host.docker.internal:11434`) but has **no models pulled**
- ❌ "Select model" dropdown is empty — nothing to chat with yet

![Main dashboard — logged in, no model selected]([local path redacted])

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

![Settings — Added Models (shows existing empty Ollama entry)]([local path redacted])

> **Note:** There's already an entry for `host.docker.internal:11434` — that points to Ollama on your local PC. Since you want to use the **Tank Pro 3 over Wi-Fi**, you'll add a **new** endpoint for it.

### 2-B. Click the "Add Models" tab

![Add Models tab — paste your endpoint URL here]([local path redacted])

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

![AI Defaults tab — set your default model here]([local path redacted])

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

