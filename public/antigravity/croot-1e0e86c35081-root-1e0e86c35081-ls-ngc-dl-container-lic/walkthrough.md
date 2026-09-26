# Walkthrough: RunPod L40 Hosting & Deployment Complete

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
ssh root@206.41.93.58 -p 52247 -i ~/.ssh/id_ed25519
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
