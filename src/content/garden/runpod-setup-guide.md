---
title: "RunPod Setup Guide for Video Generation"
description: "Step-by-step guide to setting up RunPod for video generation with models like LTX-2.3, Wan 2.2, and HunyuanVideo 1.5."
date: "2026-09-23"
tags: ["type/concept","topic/ai","concept/pkm","idea/project","task/setup","topic/content"]
source: "Knowledge/References/runpod-setup-guide.md"
vault: true
draft: true
clarity: 5
quality: 5
---

### RunPod Setup Guide for Video Generation (2026)

**TL;DR:** Create account → Network Volume (150GB) → H100 GPU + PyTorch → Attach volume at launch → SSH and clone ComfyUI + download model weights → Open web interface → Generate.

#### Overview

RunPod is a cloud GPU rental platform offering per-second billing with access to 30+ GPU models (RTX 4090, A100, H100). This guide covers setting up open-source video generation models:
- **LTX-2.3** (native audio + video, 22B params, Apache 2.0)
- **Wan 2.2** (highest quality video-only, 14B params, Apache 2.0)
- **HunyuanVideo 1.5** (8.3B params, cinematic realism, Apache 2.0)

#### Phase 1: Account Setup & Network Volume (5 minutes)

##### 1.1 Create RunPod Account
- Go to [runpod.io](https://runpod.io)
- Sign up with email or OAuth
- You'll receive promotional GPU credits ($10-50 depending on current promo)
- Add payment method (optional, but recommended for production)

##### 1.2 Create Network Volume (Persistent Storage)

**Why?** Without a network volume, your model weights and outputs are deleted when the pod stops.

**Steps:**
1. Navigate to **Storage → Network Volumes**
2. Click **Create Network Volume**
3. Set size based on model:
   - **Wan 2.2 + ComfyUI**: 150GB minimum
   - **LTX-2.3 + ComfyUI**: 120-150GB minimum
   - **HunyuanVideo 1.5 + ComfyUI**: 100GB minimum
4. Choose data center (select closest to your location for speed)
5. Click **Create**

**Cost:** $0.07/GB/month (negligible vs. time saved re-downloading weights)

#### Phase 2: GPU Pod Setup (3-5 minutes)

##### 2.1 Select GPU Type

| Model | Recommended GPU | VRAM | Cost/Hour | Notes |
|-------|-----------------|------|-----------|-------|
| **Wan 2.2** | H100 (Secure Cloud) | 80GB | ~$2.50 | Best quality video-only |
| **Wan 2.2** | A100 (Secure Cloud) | 40GB | ~$1.50 | Works with quantization |
| **LTX-2.3** | H100 or A100 | 80/40GB | ~$2.50/$1.50 | Native audio + video |
| **HunyuanVideo 1.5** | RTX 4090 | 24GB | ~$0.80 | More affordable, slightly slower |

**For iteration/testing:** Use RTX 4090 or A100 (cheaper)
**For production/final renders:** Use H100 (best quality, fastest)

##### 2.2 Launch Pod

1. Go to **Pods → GPU Cloud**
2. Click **+ Deploy** or **+ Rent**
3. **Select GPU**:
   - Choose your GPU from the list
   - Select **Secure Cloud** (not Community Cloud) for production
   - Sort by price if cost-conscious
4. **Select Template**:
   - Use **PyTorch 2.4.0** as base
   - *Or* search community templates for pre-built Wan/HunyuanVideo templates
5. **Configure Networking**:
   - Expose port **8188** (for ComfyUI web interface)
   - Optional: Enable SSH for terminal access
6. **Attach Network Volume**:
   - **Critical:** Must be done at deployment—cannot be added after
   - Select the network volume you created
   - Set mount point to `/workspace` or `/root/.cache`
7. **Click Deploy On-Demand**

Pod launches in under 3 minutes.

#### Phase 3: Model Setup

##### Option A: Pre-built Community Template (Recommended for Beginners)

If using a community template, models + ComfyUI may already be installed.

1. After pod launches, click **Connect → HTTP**
2. Open the HTTP link in your browser (should show ComfyUI interface)
3. Skip to **Phase 4**

##### Option B: Manual Setup via Terminal

**Step 1: SSH into Pod**
- From pod details, click **Connect → SSH**
- Copy the SSH command and paste into terminal
- Or use web terminal in RunPod dashboard

**Step 2: Install ComfyUI**
```bash
cd /workspace
 git clone https://github.com/comfyui/ComfyUI.git
 cd ComfyUI
 pip install -r requirements.txt
```

**Step 3: Download Model Weights**

**For Wan 2.2:**
```bash
 huggingface-cli download alimama-creative/Wan-2.2
  --cache-dir /workspace/models
```

**For LTX-2.3:**
```bash
 huggingface-cli download Lightricks/LTX-2.3-full
  --cache-dir /workspace/models
```

**For HunyuanVideo 1.5:**
```bash
 huggingface-cli download Tencent-Hunyuan/HunyuanVideo
  --cache-dir /workspace/models
```

*Note: First download may take 10-20 min depending on model size and internet speed.*

**Step 4: Download ComfyUI Model Nodes**

Video models require specific ComfyUI nodes:

**For Wan 2.2:**
```bash
 cd /workspace/ComfyUI/custom_nodes
 git clone https://github.com/comfyui/nodes-wan-2.2.git
 cd nodes-wan-2.2 && pip install -r requirements.txt
```

**For LTX-2.3:**
```bash
 cd /workspace/ComfyUI/custom_nodes
 git clone https://github.com/Lightricks/ComfyUI-LTX-2.3.git
 cd ComfyUI-LTX-2.3 && pip install -r requirements.txt
```

**For HunyuanVideo:**
```bash
 cd /workspace/ComfyUI/custom_nodes
 git clone https://github.com/kijai/ComfyUI-HunyuanVideoWrapper.git
 cd ComfyUI-HunyuanVideoWrapper && pip install -r requirements.txt
```

**Step 5: Start ComfyUI Server**
```bash
 cd /workspace/ComfyUI
 python main.py --listen 0.0.0.0 --port 8188
```

Output should show:
```
To see the GUI go to: http://127.0.0.1:8188
```

**Step 6: Access Web Interface**
- Go back to RunPod pod details
- Click **Connect → HTTP**
- Open the link (should show ComfyUI interface)

#### Phase 4: Run Your First Video (2-5 minutes)

##### 4.1 Load a Workflow

1. In ComfyUI, click **Load** (or find workflow manager)
2. Search GitHub for pre-built workflows:
   - `wan-2.2-text-to-video-comfyui`
   - `ltx-2.3-comfyui-workflow`
   - `hunyuan-video-comfyui-workflow`
3. Download the `.json` workflow file and upload to ComfyUI

##### 4.2 Configure Prompt

Example prompt (descriptive = better results):
```
A slow dolly push through a misty forest at dawn,
soft golden light filtering through tall pine trees,
gentle fog rising from the ground, birds chirping,
cinematic camera movement, 24fps, 720p
```

**Prompt tips:**
- Include camera angle (wide shot, close-up, dolly push, pan left)
- Specify lighting (golden hour, overcast, neon)
- Add motion descriptor (slow, smooth, dynamic)
- Set mood/style (cinematic, photorealistic, moody)

##### 4.3 Adjust Settings

| Setting | Value | Notes |
|---------|-------|-------|
| **Guidance Scale** | 3.5-7.0 | Higher = closer to prompt, risk over-processing. Start at 3.5 |
| **Steps** | 20-50 | Higher = better quality, longer inference |
| **Sampler** | dpmpp_2m_sde | Recommended for video |
| **Seed** | random or fixed | Fixed = reproducible results |
| **Duration** | 5-10 seconds | Model dependent |
| **Resolution** | 720p or 1080p | Check model max (Wan 2.2: 720p native) |

##### 4.4 Generate

1. Click **Queue Prompt**
2. Wait for generation (3-8 minutes depending on GPU/duration)
3. Download MP4 when complete

**First-time generation may be slow** due to model compilation—subsequent runs are faster.

#### Cost Management

##### Per-Second Billing Breakdown

**Example: 5-second video on H100**
- H100 cost: ~$2.50/hour = ~$0.000694/second
- Generation time: 5-8 minutes = ~$0.21-$0.33 per video
- Network volume: $10.50/month (150GB)
- **Total cost per video:** ~$0.25-$0.40

**Example: 5-second video on RTX 4090**
- RTX 4090 cost: ~$0.80/hour = ~$0.000222/second
- Generation time: 15-20 minutes = ~$0.20-$0.27 per video
- Network volume: $10.50/month (150GB)
- **Total cost per video:** ~$0.20-$0.30

##### Cost Optimization Tips

1. **Always stop pod when not generating**
   - Pod running idle still charges hourly
   - Click **Manage → Stop** when done
   - Pod restarts instantly (models already on network volume)

2. **Use Spot pricing for iteration**
   - Spot = peer-supplied hardware, cheaper, less stable
   - Secure Cloud = datacenter, stable, 20-30% more expensive
   - Use Spot for testing prompts, Secure Cloud for final renders

3. **Batch multiple generations**
   - Start pod once, generate 5-10 videos, then stop
   - Amortizes startup overhead

4. **Pre-cache models on network volume**
   - First pod launch downloads models (slow)
   - Subsequent launches use network volume (instant)
   - Download models in advance if possible

#### Alternative: No-Setup Browser Option

If RunPod setup feels overwhelming, LTX-2.3 also runs in the browser:

**LTX-23 Playground:** https://ltx-23.app

**Pros:**
- No GPU sizing decisions
- No ComfyUI setup
- No terminal needed
- Instant results

**Cons:**
- Credit-based pricing (varies, typically $0.50-$2.00 per video)
- No native audio without additional API call
- Less control over parameters

**Best for:** Quick prototyping, one-off videos, learning the model

#### Troubleshooting

##### Pod Won't Start
- **Issue:** "Pod creation failed"
- **Solution:** That GPU type might be out of stock. Choose different GPU or wait 5 minutes

##### CUDA Out of Memory (OOM)
- **Issue:** "RuntimeError: CUDA out of memory"
- **Solutions:**
  - Reduce video duration (8 sec → 5 sec)
  - Lower resolution (1080p → 720p)
  - Use a larger GPU (A100 → H100)
  - Enable quantization (FP8 instead of FP16)

##### ComfyUI won't start
- **Issue:** "ModuleNotFoundError: No module named 'custom_nodes'"
- **Solution:** Ensure you're in "/workspace/ComfyUI" directory before running "python main.py"

##### Models not found
- **Issue:** ComfyUI error "Model not found"
- **Solution:**
  - Verify model downloaded to correct path
  - Check network volume is attached and mounted
  - Re-download model if corrupted

##### Slow inference (20+ minutes for 5 sec)
- **Issue:** Generation taking too long
- **Solutions:**
  - Using RTX 4090? This is normal (15-20 min expected)
  - Upgrade to A100/H100 for 5-8 minute speeds
  - Reduce resolution/duration
  - Check if other processes consuming GPU memory

##### Can't connect to web interface
- **Issue:** HTTP link shows "Connection refused"
- **Solutions:**
  - Wait 2-3 minutes for ComfyUI server to start
  - Verify port 8188 is exposed in pod config
  - Check SSH terminal to confirm "python main.py" running without errors

#### Quick Reference Commands

##### SSH into Pod
```bash
 ssh -p [PORT] root@[POD_IP]
``` (Copy from RunPod Connect → SSH)

##### Monitor GPU Usage
```bash
 nvidia-smi -l 1  # Updates every 1 second
```

##### Check Model Disk Usage
```bash
 du -sh /workspace/models/
```

##### Stop ComfyUI Server
```bash
 Ctrl+C  # In terminal where python main.py runs
```

##### Restart ComfyUI
```bash
 cd /workspace/ComfyUI
 python main.py --listen 0.0.0.0 --port 8188
```

##### View Running Processes
```bash
 ps aux | grep python
```

#### Next Steps

1. **Start with community template** for easiest setup
2. **Test with RTX 4090** to dial in your prompts (cheap iteration)
3. **Upgrade to H100** for final production renders
4. **Batch multiple videos** to amortize setup overhead
5. **Keep network volume** (costs $0.07/GB/month) to avoid re-downloading weights

#### Resources

- **RunPod Docs:** https://docs.runpod.io
- **ComfyUI:** https://github.com/comfyui/ComfyUI
- **Wan 2.2 Model:** https://huggingface.co/alimama-creative/Wan-2.2
- **LTX-2.3 Model:** https://huggingface.co/Lightricks/LTX-2.3-full
- **HunyuanVideo Model:** https://huggingface.co/Tencent-Hunyuan/HunyuanVideo
- **Community Workflows:** Search GitHub for `[model-name]-comfyui-workflow`

**Last updated:** August 2026
**GPU availability & pricing subject to change—check RunPod dashboard for current rates
