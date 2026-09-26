# Claude Code Alternative Setup Guide

Follow this guide to get your private AI coding assistant running on a RunPod GPU and your local terminal.

## Phase 1: Deploying the Backend on RunPod

We are going to deploy `vLLM` using a Pod template. This will expose an OpenAI-compatible API endpoint that our local CLI agent can connect to.

1. **Log in** to your [RunPod Console](https://www.runpod.io/console/pods).
2. Click **Deploy** and select **GPU Pod**.
3. **Select a GPU:** Choose a GPU with at least 24GB of VRAM. An **RTX 3090**, **RTX 4090**, or **RTX A5000/A6000** is recommended.
4. **Choose a Template:** 
   - Click the **Templates** dropdown and select the **vLLM** template (often named `RunPod vLLM` or similar), or use the custom image: `vllm/vllm-openai:latest`.
5. **Customize the Template (Crucial Step):**
   - Click **Edit Template** or **Customize Deployment**.
   - Set the **Container Disk** to at least `60 GB` (models are large!).
   - Set the **Volume Disk** to at least `50 GB`.
   - **Environment Variables:** Add or modify the following environment variables. This configures vLLM to serve `Qwen2.5-Coder-32B-Instruct`, and forces it to use an API key for security.

| Key | Value |
| :--- | :--- |
| `MODEL` | `Qwen/Qwen2.5-Coder-32B-Instruct` |
| `VLLM_API_KEY` | `my-secret-key-123` *(Change this to a strong password!)* |
| `MAX_MODEL_LEN` | `32768` *(Ensures you have a large context window for code)* |

6. **Deploy:** Click **Deploy On-Demand** (or Spot if you want to save money, but it may be interrupted).
7. **Get Your Endpoint:** 
   - Once the Pod is running, click the **Connect** button.
   - Click on **HTTP Service** or **TCP Port 8000**.
   - Copy the URL provided. It will look something like: `https://<pod-id>-8000.proxy.runpod.net/v1`

---

## Phase 2: Setting up Aider (Local CLI Agent)

Aider is a highly capable AI pair programming tool for the terminal. We will install it and configure it to talk to your RunPod instance instead of a commercial API.

### 1. Install Aider
Open your local terminal and install Aider using `pip` or `pipx`:

```bash
# Recommended: Install via pipx to avoid dependency conflicts
python3 -m pip install --user pipx
python3 -m pipx ensurepath
pipx install aider-chat
```

### 2. Configure Aider for your RunPod Endpoint
You need to pass the RunPod URL and the secret API key you defined in Phase 1 to Aider.

```bash
# Set your environment variables (replace with your actual RunPod URL and Key)
export OPENAI_API_BASE="https://<your-pod-id>-8000.proxy.runpod.net/v1"
export OPENAI_API_KEY="my-secret-key-123"

# Start Aider, specifying the exact model name vLLM is serving
aider --model openai/Qwen/Qwen2.5-Coder-32B-Instruct
```

> [!TIP]
> To avoid typing these exports every time, you can add them to your `~/.bashrc` or `~/.zshrc` file, or create a `.env` file in the root of your project directory containing:
> ```env
> OPENAI_API_BASE=https://<your-pod-id>-8000.proxy.runpod.net/v1
> OPENAI_API_KEY=my-secret-key-123
> ```

## Usage Example

Once Aider launches in your terminal, it will analyze your current Git repository. You can interact with it just like Claude Code:

```text
Aider v0.X.X
Model: openai/Qwen/Qwen2.5-Coder-32B-Instruct
Git repo: .git
Repo-map: 1024 tokens

> /add main.py
Added main.py to the chat.

> Refactor the data loading function to use async/await and handle exceptions better.
```
