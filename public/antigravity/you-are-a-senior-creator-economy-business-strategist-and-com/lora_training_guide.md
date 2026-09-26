# Dataset Prep & LoRA Training Guide

To achieve high-fidelity character consistency for your Digital Twin, you must train a LoRA (Low-Rank Adaptation) on your own likeness. Here is your operational checklist for executing this on RunPod.

## 1. Dataset Preparation Checklist

You need 30-50 high-quality images of yourself. Do not skip these ratios.

- **15 Close-up Portraits:** Focus on the face. Different expressions (smiling, serious, smirking). Different lighting (harsh flash, soft sunlight, studio).
- **15 Half-Body Shots (Cowboy shot):** Waist up. Vary the clothing styles (casual, lingerie, formal) to prevent the LoRA from over-associating your face with one specific outfit.
- **10 Full-Body Shots:** Head to toe. Ensures the AI learns your body proportions.
- **10 Varied Angles/Backgrounds:** Profiles, looking away from camera, different backgrounds (bedroom, outdoors, studio) to prevent background bleeding into generation.

> [!IMPORTANT]
> **Cropping and Sizing:** Crop all images to 1024x1024 (if training for SDXL) or 512x512/768x768 (if training for SD 1.5/Pony). 

## 2. Auto-Captioning
Images need text descriptions so the model knows what is you and what is the background.
- Use **WD14 Tagger** (available in Kohya_ss).
- Set a unique trigger word for yourself (e.g., `xkx_jessica`).
- **Crucial Step:** Manually review the text files. If you are wearing a red dress, the caption *must* say `red dress`. If you don't caption the red dress, the AI will think the red dress is part of your body.

## 3. RunPod Kohya_ss Configuration

1. **Instance Setup:** Deploy a RunPod instance using a pre-configured Kohya_ss template. An RTX 3090 or 4090 template (e.g., `runpod/pytorch`) is recommended.
2. **Folder Structure (inside RunPod):**
   - `/workspace/lora_training/img/100_xkx_jessica` (Put your images and .txt captions here. The '100' means 100 repeats per image).
   - `/workspace/lora_training/model` (Output goes here).
   - `/workspace/lora_training/log`
3. **Training Parameters (SDXL Target):**
   - **Base Model:** `sd_xl_base_1.0.safetensors`
   - **Batch Size:** 1 (up to 4 on 24GB VRAM)
   - **Epochs:** 10 (You will test epochs 5, 6, 7, 8, 9, 10 to see which looks best without overtraining).
   - **Network Rank (Dim):** 128
   - **Network Alpha:** 128 (or 64)
   - **Optimizer:** `Adafactor` (best for SDXL) or `AdamW8bit`
   - **Learning Rate:** `1e-4` or `4e-4`
4. **Execution:** Start training. On a 4090, an SDXL LoRA on 40 images takes ~1-2 hours.

## 4. Testing the LoRA (X/Y Plot)
Do not immediately use the final epoch. Use the X/Y/Z plot script in ComfyUI or Automatic1111 to test epochs 5 through 10 against a simple prompt: `photo of xkx_jessica, sitting in a cafe, natural lighting`. Pick the epoch that looks most like you without deep-frying the image texture.
