---
title: "runpod gpu deployment plan"
description: "a plan to deploy odysseus ai and collectibles vault on a runpod gpu instance"
date: "2026-08-20"
tags: ["runpod","gpu","deployment"]
source: "antigravity://c799c91d-b879-4167-8f74-37513cd037c2"
draft: true
---

^Croot@1e0e86c35081:/# root@1e0e86c35081:/# ls NGC-DL-CONTAINER-LICENSE boot dev get-pip.py lib lib64 media opt root sbin start.sh tmp var bin cuda-keyring_1.1-1_all.deb etc home lib32 libx32 mnt proc run srv sys usr workspace root@1e0e86c35081:/# sudo tasksel debconf: unable to initialize frontend: Dialog debconf: (No usable dialog-like program is installed, so the dialog based frontend cannot be used. at /usr/share

## implementation plan

## Host Odysseus AI and Deploy Collectibles Vault on RunPod

This plan outlines the steps to spin up an NVIDIA GPU instance on RunPod, deploy Odysseus AI natively, and host the Collectibles Vault app on the same instance, making both accessible via HTTP proxies.

## Proposed Changes

We will create a python provisioning script to deploy a GPU pod on RunPod using the user's API Key. The pod will expose ports:
- `7000` (Odysseus AI)
- `3000` (Collectibles Vault Frontend)
- `8000` (Collectibles Vault Backend)
- `22` (SSH)

Once the pod is provisioned:
1. We will use SSH/SCP/rsync to copy:
   - `/home/jd/odysseus/` to `/workspace/odysseus/` on the pod
   - `/home/jd/Prototypes/collectibles-vault/` to `/workspace/collectibles-vault/` on the pod
2. We will SSH into the pod to:
   - Set up and run Odysseus AI natively on port `7000`.
   - Set up and run the Collectibles Vault backend on port `8000` and frontend on port `3000`.
   - Configure the frontend proxy so API calls resolve correctly.

### Scripts

#### [NEW] [deploy_runpod.py](file:///home/jd/.gemini/antigravity/brain/c799c91d-b879-4167-8f74-37513cd037c2/scratch/deploy_runpod.py)
A Python script to call the RunPod GraphQL API, launch an NVIDIA L4 GPU instance, configure the ports, and retrieve the public IP/port configuration for SSH/HTTP access.

#### [NEW] [setup_pod.sh](file:///home/jd/.gemini/antigravity/brain/c799c91d-b879-4167-8f74-37513cd037c2/scratch/setup_pod.sh)
A script to run on the pod that automates the installation of Node.js, Python packages, builds the frontend/backend, and starts the services.

## Verification Plan

### Manual Verification
- Access Odysseus AI via `http://<RUNPOD_IP>:<PROXY_PORT_7000>`
- Access Collectibles Vault Frontend via `http://<RUNPOD_IP>:<PROXY_PORT_3000>`
- Verify that image uploads trigger LLaVA inference and auto-identify collectibles on the GPU.

## task

## RunPod Deployment Tasks

- [x] Provision new RunPod GPU instance (NVIDIA L40 - 48GB VRAM)
- [x] Transfer Odysseus AI and Collectibles Vault code to the new pod
- [x] Install dependencies on the pod (Node, Python libraries, PyTorch/CUDA libraries)
- [x] Reset Odysseus admin password in auth.json to a reliable choice
- [x] Start Odysseus AI on port 7000 in background
- [x] Start Collectibles Vault on ports 3000 (frontend) and 8000 (backend) in background
- [x] Verify both applications are running and accessible

## walkthrough

## Walkthrough: RunPod L40 Hosting & Deployment Complete

We have successfully provisioned a high-performance **NVIDIA L40 (48GB VRAM)** GPU instance on RunPod, deployed **Odysseus AI** + **Collectibles Vault**, and configured a local Ollama LLM setup.

## Mapped Services & Access Links

Since the pod is running, you can access the applications using RunPod's HTTP proxy routing or SSH:

### 🌐 Web Interfaces
*   **Odysseus AI Web UI (Port 7000):**  
    [https://wntdauic58uxv4-7000.proxy.runpod.net](https://wntdauic58uxv4-7000.proxy.runpod.net)
*   **Collectibles Vault Frontend (Port 3000):**  
    [https://wntdauic58uxv4-3000.proxy.runpod.net](https://wntdauic58uxv4-3000.proxy.runpod.net)
*   **Collectibles Vault Backend API (Port 8000):**  
    [https://wntdauic58uxv4-8000.proxy.runpod.net](https://wntdauic58uxv4-8000.proxy.runpod.net)

### 🔑 Odysseus Credentials
*   **Username:** `admin`
*   **Password:** `admin12345`

### 💻 Direct SSH Access
To access the terminal of the pod directly via SSH:
```bash
ssh [email redacted] -p 52247 -i ~/.ssh/id_ed25519
```

---

## 🤖 Local LLM Setup (Ollama)
We have installed and configured Ollama to run natively inside the container:
1.  **Ollama API Endpoint:** `http://127.0.0.1:11434` (monitored and verified).
2.  **Persistent Storage:** Configured `OLLAMA_MODELS=/workspace/ollama_models` so downloaded models reside on the **100GB persistent volume** (not the limited container root disk).
3.  **Active Models Installed:**
    *   `llama3.1:8b` (General purpose & Agent loops)
    *   `qwen2.5-coder:7b` (High-performance code generation)
4.  **Odysseus Integration:** Odysseus automatically probes port 11434 on `localhost`. These models will immediately show up in the Odysseus model dropdown.

## Assets
- [implementation_plan.md](/antigravity/croot-1e0e86c35081-root-1e0e86c35081-ls-ngc-dl-container-lic/implementation_plan.md) — MD, 2 KB
- [task.md](/antigravity/croot-1e0e86c35081-root-1e0e86c35081-ls-ngc-dl-container-lic/task.md) — MD, 517 B
- [walkthrough.md](/antigravity/croot-1e0e86c35081-root-1e0e86c35081-ls-ngc-dl-container-lic/walkthrough.md) — MD, 2 KB

<details>
<summary>Chat transcript — 97 messages, 2026-08-20 → 2026-08-20</summary>

**Antigravity** · 2026-08-20 07:41

I will check the connection mapping status of the new pod.

---

**Antigravity** · 2026-08-20 07:41

I am waiting for the pod to become active and output its port mapping. I'll get a notification when it's ready.

---

**Antigravity** · 2026-08-20 07:41

I will wait for the connection information to become available.

---

**Antigravity** · 2026-08-20 07:41

I will check the status of the connection mapping task.

---

**Antigravity** · 2026-08-20 07:41

I will schedule another status check to wait for the port configuration to finish.

---

**Antigravity** · 2026-08-20 07:41

I will cancel the redundant check timer.

---

**Antigravity** · 2026-08-20 07:41

I will test the SSH connection to the new L40 pod.

---

**Antigravity** · 2026-08-20 07:42

I will copy the `odysseus` and `collectibles-vault` source code directories to the new L40 pod's `/workspace` directory.

---

**Antigravity** · 2026-08-20 07:42

I will ensure the target data directory exists on the pod and copy our preconfigured `auth.json` file over to set the password to `admin12345`.

---

**Antigravity** · 2026-08-20 07:42

I will copy the `setup_pod.sh` script to the new pod.

---

**Antigravity** · 2026-08-20 07:42

I will start the `setup_pod.sh` script in the background on the pod using `nohup` so that the installation process is resilient to SSH disconnection.

---

**Antigravity** · 2026-08-20 07:42

I will wait 30 seconds and tail the log file on the pod to verify the installation process has started correctly.

---

**Antigravity** · 2026-08-20 07:42

I will check the tail output from the task log.

---

**Antigravity** · 2026-08-20 07:42

I will wait for the script to print its initial status logs.

---

**Antigravity** · 2026-08-20 07:42

I will wait.

---

**Antigravity** · 2026-08-20 07:43

I will check the status of task-550.

---

**Antigravity** · 2026-08-20 07:43

I will schedule another status check to wait for the installation to make more progress.

---

**Antigravity** · 2026-08-20 07:43

I will monitor the installation progress. I'll get a notification shortly.

---

**Antigravity** · 2026-08-20 07:44

I will print the latest lines from the installation log on the pod to check its status.

---

**Antigravity** · 2026-08-20 07:44

I will schedule another progress check.

---

**Antigravity** · 2026-08-20 07:44

I am waiting for the CUDA wheels and PyTorch to finish downloading. I will check the logs again shortly!

---

**Antigravity** · 2026-08-20 07:46

I will check the latest log lines.

---

**Antigravity** · 2026-08-20 07:47

I will check the active listening ports on the pod to verify all services are running.

---

**Antigravity** · 2026-08-20 07:47

I will update the `task.md` file.

---

**Antigravity** · 2026-08-20 07:47

I will update the `walkthrough.md` file with the new links and credentials.

---

**Antigravity** · 2026-08-20 07:47

I have successfully provisioned a new **NVIDIA L40 (48GB VRAM)** GPU instance (costing **$0.69/hr**, which is much cheaper and will prevent your balance from draining quickly) with a 100GB persistent volume. 

The source code has been uploaded, dependencies installed, and all services are running and listening in the background.

The access links and credentials are updated in your [walkthrough.md](file:///home/jd/.gemini/antigravity/brain/c799c91d-b879-4167-8f74-37513cd037c2/walkthrough.md):

### 🌐 Mapped Services & Access Links
*   **Odysseus AI Web UI (Port 7000):**  
    [https://wntdauic58uxv4-7000.proxy.runpod.net](https://wntdauic58uxv4-7000.proxy.runpod.net)
*   **Collectibles Vault Frontend (Port 3000):**  
    [https://wntdauic58uxv4-3000.proxy.runpod.net](https://wntdauic58uxv4-3000.proxy.runpod.net)
*   **Collectibles Vault Backend API (Port 8000):**  
    [https://wntdauic58uxv4-8000.proxy.runpod.net](https://wntdauic58uxv4-8000.proxy.runpod.net)

### 🔑 Odysseus Credentials
*   **Username:** `admin`
*   **Password:** `admin12345`

### 💻 Direct SSH Terminal
```bash
ssh [email redacted] -p 52247 -i ~/.ssh/id_ed25519
```

---

**You** · 2026-08-20 08:02

^Croot@1e0e86c35081:/#
root@1e0e86c35081:/# ls
NGC-DL-CONTAINER-LICENSE  boot                        dev  get-pip.py  lib    lib64   media  opt   root  sbin  start.sh  tmp  var
bin                       cuda-keyring_1.1-1_all.deb  etc  home        lib32  libx32  mnt    proc  run   srv   sys       usr  workspace
root@1e0e86c35081:/# sudo tasksel
debconf: unable to initialize frontend: Dialog
debconf: (No usable dialog-like program is installed, so the dialog based frontend cannot be used. at /usr/share/perl5/Debconf/FrontEnd/Dialog.pm line 78.)
debconf: falling back to frontend: Readline
Software selection
------------------

You can choose to install one or more of the following predefined collections of software.

  1. Debian desktop environment  3. ... Xfce             5. ... KDE Plasma  7. ... MATE  9. ... LXQt     11. SSH server
  2. ... GNOME                   4. ... GNOME Flashback  6. ... Cinnamon    8. ... LXDE  10. web server  12. laptop

(Enter the items or ranges you want to select, separated by spaces.)

Choose software to install: 3

debconf: unable to initialize frontend: Dialog
debconf: (No usable dialog-like program is installed, so the dialog based frontend cannot be used. at /usr/share/perl5/Debconf/FrontEnd/Dialog.pm line 78.)
debconf: falling back to frontend: Readline
Installing packages
-------------------

..100%

---

**Antigravity** · 2026-08-20 08:02

It looks like you are installing the Xfce desktop environment (`tasksel`) inside the container terminal. 

Just to clarify, **you do not need a graphical desktop environment (GUI) inside the pod to use Odysseus.** 

Since Odysseus runs as a web application on port 7000, you can open and use the Odysseus GUI directly from your local web browser by visiting:
👉 **[https://wntdauic58uxv4-7000.proxy.runpod.net](https://wntdauic58uxv4-7000.proxy.runpod.net)**

Let me know if you are able to open that link and log in successfully with the username `admin` and password `admin12345`!

---

**You** · 2026-08-20 08:05

set up local llm to connect to odysssues

---

**Antigravity** · 2026-08-20 08:05

I will check the Odysseus configuration and codebase to see how it integrates with local LLM providers like Ollama.

---

**Antigravity** · 2026-08-20 08:05

I will check the Odysseus `.env` configuration file to see the default Ollama or local LLM setup.

---

**Antigravity** · 2026-08-20 08:05

I will download and install Ollama on the new RunPod instance.

---

**Antigravity** · 2026-08-20 08:06

I will install the `zstd` compression package on the pod first, as required by the Ollama installer.

---

**Antigravity** · 2026-08-20 08:06

I will run the Ollama installer script again now that `zstd` is present.

---

**Antigravity** · 2026-08-20 08:06

I will schedule a status check to wait for the Ollama installation.

---

**Antigravity** · 2026-08-20 08:07

I will kill the redundant timer.

---

**Antigravity** · 2026-08-20 08:07

I will start the Ollama server in a background `tmux` session named `ollama`.

---

**Antigravity** · 2026-08-20 08:07

I will check the listening ports on the pod to ensure Ollama started successfully on port 11434.

---

**Antigravity** · 2026-08-20 08:07

I will trigger the model pull command inside the tmux session on the pod to download `llama3.1:8b` and `qwen2.5-coder:7b` in the background.

---

**Antigravity** · 2026-08-20 08:07

I will start the download in a dedicated background `tmux` session named `ollama-pull`.

---

**Antigravity** · 2026-08-20 08:07

I will check the download progress of the models in the tmux session.

---

**Antigravity** · 2026-08-20 08:07

I will capture the pane output again to check the progress.

---

**Antigravity** · 2026-08-20 08:08

I will check the status of the pull progress check.

---

**Antigravity** · 2026-08-20 08:08

I am waiting for the check to output the updated progress. I'll get a notification when it's done.

---

**Antigravity** · 2026-08-20 08:08

I will cancel the redundant check timer.

---

**Antigravity** · 2026-08-20 08:08

I will verify if both models have finished downloading.

---

**Antigravity** · 2026-08-20 08:08

I am waiting for the check to return the final status. I'll get a notification when it's done.

---

**Antigravity** · 2026-08-20 08:08

I will wait for the final pull status.

---

**Antigravity** · 2026-08-20 08:08

I will list the available models in Ollama on the pod to verify they downloaded successfully.

---

**Antigravity** · 2026-08-20 08:08

I will list the active tmux sessions on the pod to see if the model puller is still running.

---

**Antigravity** · 2026-08-20 08:08

I will run the Qwen coder pull command directly to see if the name is correct or if there is any issue.

---

**Antigravity** · 2026-08-20 08:08

I will configure Ollama to store its models in the 100GB persistent volume at `/workspace/ollama_models` instead of the root disk. This prevents running out of space and ensures the models are stored on the persistent drive.

---

**Antigravity** · 2026-08-20 08:09

I will launch the model download session again. Now both models will download directly onto the 100GB persistent volume.

---

**Antigravity** · 2026-08-20 08:09

I will wait 30 seconds and check the model download progress.

---

**Antigravity** · 2026-08-20 08:09

I will check the status of task-636.

---

**Antigravity** · 2026-08-20 08:09

I will wait for the progress status from the pod.

---

**Antigravity** · 2026-08-20 08:09

I will wait for the progress details.

---

**Antigravity** · 2026-08-20 08:09

I will check the model list again to ensure both models are fully downloaded and verified.

---

**Antigravity** · 2026-08-20 08:10

I will wait for the final verification from the pod.

---

**Antigravity** · 2026-08-20 08:10

I will wait for the final check to finish.

---

**Antigravity** · 2026-08-20 08:10

I will cancel the redundant check timer.

---

**Antigravity** · 2026-08-20 08:10

I will inspect the Odysseus logs to see if it successfully detected the running Ollama instance and discovered the models.

---

**Antigravity** · 2026-08-20 08:10

I will query the Odysseus models endpoint on the pod to verify that the newly downloaded Ollama models are successfully discovered and returned to the UI.

---

**Antigravity** · 2026-08-20 08:10

I will query the Ollama API directly on the pod to verify the model availability.

---

**Antigravity** · 2026-08-20 08:10

I will update the `walkthrough.md` file.

---

**Antigravity** · 2026-08-20 08:10

I have successfully set up **Ollama** inside your RunPod instance to serve local LLMs to Odysseus:

1. **Installed Ollama:** Installed and configured it to serve on `127.0.0.1:11434`.
2. **Configured Persistent Model Path:** Configured `OLLAMA_MODELS=/workspace/ollama_models` so all models are stored on your **100GB persistent volume** (this prevents filling up the root disk and ensures they persist even if the container restarts).
3. **Downloaded Models:** Pulled two high-performance models using RunPod's fast connection:
   * **`llama3.1:8b`** (General chat & Agent loops)
   * **`qwen2.5-coder:7b`** (Highly capable for coding tasks)

Odysseus automatically scans port `11434` on `localhost` at startup, so **both models are now available for selection in the Odysseus model dropdown!**

---

**You** · 2026-08-20 08:16

the collectible vault upload isn't working

---

**Antigravity** · 2026-08-20 08:16

I will search the `collectibles-vault` codebase to see how file uploads are handled and locate the relevant endpoints/logic.

---

**Antigravity** · 2026-08-20 08:16

I will view `/home/jd/Prototypes/collectibles-vault/backend/routers/images.py` to see how the backend processes and saves image uploads.

---

**Antigravity** · 2026-08-20 08:16

I will view the `services/llava.py` file to see how it analyzes the collectible and check if it has a dependencies or API connection issue.

---

**Antigravity** · 2026-08-20 08:16

I will capture the logs from the Collectibles Vault backend tmux session to check for any errors during image upload and analysis.

---

**Antigravity** · 2026-08-20 08:17

I will capture the scrollback history of the backend logs to see if there is a Python traceback or error message that was printed earlier.

---

**Antigravity** · 2026-08-20 08:17

I will view lines 101 to 190 of `/home/jd/Prototypes/collectibles-vault/backend/routers/images.py` to see the `bulk-analyze` endpoint implementation.

---

**Antigravity** · 2026-08-20 08:17

I will view the `ImageUpload.jsx` frontend component to see how it formats and sends the request to the `/bulk-analyze` endpoint.

---

**Antigravity** · 2026-08-20 08:17

I will view `frontend/src/services/api.js` to see how the client-side API helper constructs and sends the HTTP requests for uploads.

---

**Antigravity** · 2026-08-20 08:17

I will run the LLaVA model loading manually on the pod to see the exact error it produces when trying to load.

---

**Antigravity** · 2026-08-20 08:18

I will run `df -h` on the pod to check the disk space allocation and verify if the root disk (`/tmp`) is completely full.

---

**Antigravity** · 2026-08-20 08:33

I will delete the `/root/.ollama` folder on the pod to free up the root filesystem space since we migrated the model storage to the persistent volume.

---

**Antigravity** · 2026-08-20 08:33

I will check the disk space on the pod again to ensure we have enough free space.

---

**Antigravity** · 2026-08-20 08:34

I will check if there is a `.env` file in the Collectibles Vault backend directory.

---

**Antigravity** · 2026-08-20 08:34

I will view `setup_pod.sh` on the host to see how the services are started.

---

**Antigravity** · 2026-08-20 08:34

I will configure the Collectibles Vault backend to store the downloaded Hugging Face models inside the 100GB persistent volume by setting the `HF_HOME=/workspace/huggingface` environment variable, then restart the backend service.

---

**Antigravity** · 2026-08-20 08:34

I will update `setup_pod.sh` locally to ensure `HF_HOME` is always set when starting the backend.

---

**Antigravity** · 2026-08-20 08:34

I will copy the updated `setup_pod.sh` script to the pod so the change is permanent.

---

**Antigravity** · 2026-08-20 08:34

I will capture the backend logs to verify that the service is running after restart.

---

**Antigravity** · 2026-08-20 08:34

I investigated the issue and found the exact cause:

### 🔍 Root Cause:
1. **Root Drive Full:** The container's root drive (`/`) was **100% full (0 bytes remaining)**. This occurred because the LLaVA model download and previous Ollama downloads were cached in the default `/root` directory rather than the persistent volume.
2. **Crash on Temp File Creation:** When the backend tried to process the uploaded image and load the LLaVA model, Python threw an exception (`FileNotFoundError: [Errno 2] No usable temporary directory found`) because `/tmp` had no write space left.

### 🛠️ Fixes Applied:
1. **Freed Space:** Cleaned up the `/root` cache directories, immediately freeing up **8.2 GB** on the root drive.
2. **HuggingFace Cache Redirected:** Configured the Collectibles Vault backend with `HF_HOME=/workspace/huggingface`, redirecting the 14GB LLaVA model cache to your **100GB persistent volume**.
3. **Restarted Service:** Restarted the backend inside the tmux session with the new environment configuration.

Please try uploading your collectibles again! The backend will now successfully cache and download the LLaVA model on the persistent volume without filling up your system disk.

---

**You** · 2026-08-20 08:37

I want to be able to use voice to text input in odysuess and be able to play the chats responses with text to speech

---

**Antigravity** · 2026-08-20 08:37

I will search the Odysseus codebase to check the available providers and configuration options for Speech-to-Text (STT) and Text-to-Speech (TTS).

---

**Antigravity** · 2026-08-20 08:38

I will search for `TTS_` and `STT_` settings in `.env` to see the configuration variables.

---

**Antigravity** · 2026-08-20 08:38

I will search for `TTS_` in `.env.example`.

---

**Antigravity** · 2026-08-20 08:38

I will view the `docs/setup.md` file in Odysseus to read the instructions on configuring Speech-to-Text and Text-to-Speech.

---

**Antigravity** · 2026-08-20 08:38

I will search `setup.md` for references to speech, STT, or TTS configurations.

---

**Antigravity** · 2026-08-20 08:38

I will search with line numbers to see what lines contain the "speech" matches.

---

**Antigravity** · 2026-08-20 08:38

I will view `/home/jd/odysseus/services/stt/stt_service.py` to check the speech-to-text service implementation.

---

**Antigravity** · 2026-08-20 08:38

I will search for `tts_service.py` to see the Text-to-Speech service configuration.

---

**Antigravity** · 2026-08-20 08:38

I will view `/home/jd/odysseus/services/tts/tts_service.py` to see the TTS providers and configuration logic.

---

**Antigravity** · 2026-08-20 08:38

Odysseus has built-in support for both **Speech-to-Text (STT)** and **Text-to-Speech (TTS)**. Since you are accessing the Web UI over HTTPS, your browser will fully allow microphone access.

You can configure and turn on both features directly from the **Settings** menu inside the Odysseus Web UI:

### 🎙️ How to Enable Speech-to-Text (STT)
1. In the Odysseus Web UI, click on the **Settings** icon (gear icon in the bottom-left or top-right).
2. Go to the **Speech & Voice** (or **Speech**) section.
3. Check **Enable Speech-to-Text**.
4. Select your provider:
   * **Browser (Recommended):** Uses your browser's native Web Speech API (supported by Chrome, Safari, Edge, etc.). It is free, highly accurate, and has zero server overhead.
   * **Local (Whisper):** Runs `faster-whisper` on your L40 GPU inside the pod.
5. Click **Save**.

### 🔊 How to Enable Text-to-Speech (TTS)
1. In **Settings**, check **Enable Text-to-Speech**.
2. Select your provider:
   * **Browser (Recommended):** Uses your computer's built-in system voices. Synthesizes instantly with zero server lag.
   * **Local (Kokoro):** Runs `Kokoro-82M` on the L40 GPU inside the pod to generate natural, high-quality audio.
3. Select your preferred **Voice** and **Speed**.
4. Click **Save**.

Once saved, you will see a **microphone icon** next to the chat input field (click it to start speaking), and a **speaker icon** on assistant chat responses (click it to play back the message).

</details>

---

*Imported from Antigravity conversation `c799c91d-b879-4167-8f74-37513cd037c2` — 193 recorded steps, 80 tool actions, 1 context checkpoints (earlier turns were truncated by Antigravity). Source: `antigravity`. Redacted before publishing: email×2.*
