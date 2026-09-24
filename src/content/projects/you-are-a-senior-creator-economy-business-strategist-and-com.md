---
title: "Fanvue Digital Twin Pipeline"
description: "Compliant content generation pipeline for a hybrid AI creator on Fanvue"
date: "2026-08-02"
tags: ["ai-content-generation","fanvue","compliance"]
source: "antigravity://47c031a8-0492-4ed7-8da3-282987c01132"
draft: false
---

## compliance ledger

## Compliance Ledger & Storage Structure

Because your AI content is based on a real human (you) and distributed on adult subscription platforms, strict adherence to 18 U.S.C. §2257 record-keeping is non-negotiable, even for "stylized" AI outputs.

## 1. The Local Storage/Cloud Bucket Structure

Do not mix your base photos with your AI outputs. Maintain a highly organized directory on a secure local drive or encrypted cloud storage (like Google Workspace or AWS S3).

```text
/Fanvue_Operations
│
├── /1_Compliance_Records (CRITICAL)
│   ├── /Performer_IDs
│   │   └── front_and_back_gov_id.jpg
│   ├── /Consent_Forms
│   │   └── 2257_model_release_signed.pdf
│   └── /Ledger
│       └── 2257_Master_Ledger.xlsx (See below)
│
├── /2_Base_Dataset
│   ├── /Raw_Photos
│   └── /Captioned_Photos (Used for LoRA)
│
├── /3_Trained_Models
│   └── /Digital_Twin_LoRAs
│       └── xkx_jessica_v1.safetensors
│
└── /4_Generated_Content
    ├── /YYYY_MM_Batch_1
    │   ├── /Timeline_Approved
    │   ├── /PPV_Approved
    │   └── /Rejects
```

## 2. The 2257 Master Ledger (Excel/CSV Template)

You must maintain a spreadsheet (`2257_Master_Ledger.xlsx`) that tracks all content. 

**Required Columns:**
- `File Name/URL`: (e.g., `batch1_001.jpg`)
- `Date of Production`: (When the AI generated the image)
- `Legal Name of Performer`: (Your real legal name)
- `Aliases/Stage Names`: (Your Fanvue display name)
- `Date of Birth`: (Your DOB)
- `Cross-Reference to ID`: (Link or reference to `front_and_back_gov_id.jpg`)
- `Note`: (Include a note: "Synthetic AI stylized rendering of KYC-verified account holder")

> [!CAUTION]
> If your platform undergoes an audit, they will ask for this ledger. If you cannot produce the underlying ID and consent for the likeness in the AI generation, you risk an immediate permanent ban and frozen payouts.

## 3. Platform AI Labeling (Take It Down Act / EU AI Act)

When posting to Fanvue:
1. **Bio Disclosure:** Place a single line in your bio: "Hybrid Creator: Featuring stylized AI renderings of me."
2. **Post Toggle:** Fanvue has a feature to tag content as AI. **Use it.** Do not attempt to deceive subscribers into thinking they are viewing raw, unedited photography. This protects you from chargebacks claiming "false advertising" and keeps you on the right side of platform TOS.

## generation workflow

## Content Generation Workflow

This defines how you transition from an idea to a finished, compliant asset using your RunPod setup.

## 1. The Local LLM Prompt Generator

To maintain a consistent persona, you should not be writing every image prompt from scratch. We will use a local LLM on RunPod (e.g., Llama-3-8B-Instruct via text-generation-webui or Ollama).

**System Prompt for the LLM:**
```text
You are the prompt engineer for a hyper-realistic AI photoshoot. 
The subject is a 25-year-old female named [Trigger Word]. 
Her style is [Insert Style: e.g., boho-chic, elegant, slightly edgy]. 

I will give you a scenario. You must output a detailed comma-separated image generation prompt. 
Format: [Subject description], [Clothing], [Action/Pose], [Setting/Background], [Lighting], [Camera Angle/Quality tags].
Always include the trigger word '[Trigger Word]'.
Do not output any conversational text. Only output the comma-separated prompt.
```

**Workflow:**
- **You Input:** "Morning coffee in bed, messy hair, oversized t-shirt." 
- **LLM Outputs:** `photo of [Trigger Word], 25-year-old female, messy hair, wearing an oversized white t-shirt, sitting in bed holding a white coffee mug, messy white sheets, bedroom setting, morning sunlight streaming through window, soft cinematic lighting, 85mm lens, hyperrealistic, 8k resolution, highly detailed`

## 2. ComfyUI / Image Generation Setup

ComfyUI is recommended on RunPod because you can save the entire node workflow as a JSON file, ensuring absolute consistency every time you generate.

**The Golden Node Workflow:**
1. **Checkpoint Loader:** Load your base model (e.g., SDXL or Juggernaut XL).
2. **LoRA Loader:** Load your trained Digital Twin LoRA. Set strength to `0.8 - 0.9` (1.0 often overbakes the image).
3. **Positive Prompt:** Paste the LLM output here.
4. **Negative Prompt:** `(worst quality, low quality, illustration, 3d, 2d, painting, cartoons, sketch), deformed, bad anatomy, bad hands, missing fingers, extra digit, cropped`
5. **KSampler:** 
   - Steps: 30-40
   - CFG: 5.0 - 7.0
   - Sampler: `dpmpp_2m` / Scheduler: `karras`
6. **A-Detailer / FaceRestore Node:** (CRITICAL) Route the output into an A-Detailer node targeting the face. This fixes any warped eyes or blurry facial features that occur in full-body shots.
7. **Upscale Node:** (Optional) Use Ultimate SD Upscale for PPV/high-tier content.

## 3. The 2-Week Sprint Batching
Do not generate daily. Generate in batches.
- **Sunday:** 
  - Generate 30 Standard Timeline images (varied outfits, casual).
  - Generate 10 PPV/High-Value images (lingerie, implied, highly stylized).
- **Monday:** Curation. Throw away any images with bad hands or where the likeness drops below 90%. 
- **Tuesday:** Schedule the 14-day queue in Fanvue.

## implementation plan

## Compliant Content Operations & Production Pipeline (Digital Twin on Fanvue)

**Concept:** Build a scalable, compliant content generation pipeline for a "digital twin" AI creator on Fanvue. We will leverage RunPod cloud GPUs for rendering open-source image models (e.g., Stable Diffusion/ComfyUI) and LLMs to produce highly consistent, compliant assets.

## User Review Required

> [!CAUTION]
> **COMPLIANCE CHECKPOINTS:**
> 1. **Fanvue AI Policy:** Even though it is a digital twin, Fanvue requires you to toggle the "AI-Generated" flag for synthetic content to avoid deceptive pass-offs. 
> 2. **18 U.S.C. §2257:** Since the base is a real human (you), you must maintain standard 2257 record-keeping for the underlying likeness (ID, consent forms), even if the final output is stylized via AI.
> 3. **Non-Consensual / Deepfake Risk:** Because you are training a LoRA on your own face, ensure your RunPod/cloud environments are secure so the weights cannot be stolen or misused.

## Open Questions

> [!WARNING]
> Please address these before we finalize execution:
> 1. **Generation UI:** Do you prefer ComfyUI (better for node-based automation and consistent pipelines) or Automatic1111/Forge (easier UI for manual prompting) on your RunPod?
> 2. **Volume Targets:** Are we aiming for a standard cadence (e.g., 5-7 paywall posts/week + 15 top-of-funnel posts/week), or higher volume?
> 3. **LLM Integration:** Will the LLM on RunPod purely generate prompts for the image generator, or will we also use it to draft DM scripts and chat responses?

## Proposed Pipeline Architecture

### 1. Persona & Model Training Ops (RunPod)
- **Dataset Prep:** Gather 30-50 high-quality photos of the verified operator (varied lighting, angles, clothing).
- **LoRA Training:** Use Kohya_ss on RunPod to train a custom LoRA of the operator. This creates the "Digital Twin" weights.
- **Base Model Selection:** Select an appropriate open-source base model (e.g., SDXL or Pony Diffusion V6 if aiming for specific stylized aesthetics) to pair with the LoRA.

### 2. Content Generation Workflow
- **Prompt Generation (LLM):** Use a local LLM on RunPod (e.g., Llama 3 or Mistral) with a system prompt defining the persona to output daily outfit/scenario prompts.
- **Image Generation (ComfyUI/A1111):** Pass prompts into the image generator applying the Digital Twin LoRA.
- **Refinement:** Use Adetailer (for face consistency) and upscaling nodes to ensure premium quality.

### 3. Compliance & Labeling Protocol
- **Metadata:** Ensure EXIF data or platform toggles clearly mark content as synthetic.
- **Storage:** Maintain a secure cloud bucket (e.g., AWS S3 or Google Cloud Storage) with a folder structure strictly separating: `/1_Base_Photos`, `/2_Trained_Models`, `/3_Approved_Outputs`.
- **2257 Records:** Keep a signed digital ledger of the operator's consent and ID matching the account holder.

### 4. Distribution & Fanvue Setup
- **Batching:** Generate content in 2-week sprints to decouple production from posting.
- **Tiering:** Filter standard generations to the timeline, and highly customized/complex generations to PPV (Pay-Per-View) messages ($5-$15).

## Verification Plan

### Automated/Pipeline Verification
- Spin up a test RunPod instance, deploy the model + LoRA, and generate a batch of 10 test images using standard prompts.
- Verify facial consistency across the 10 images (target >90% likeness to the digital twin).

### Manual Verification
- Review the Fanvue profile setup to ensure the AI disclosure toggle is active and the bio accurately reflects the hybrid nature of the account.
- Audit the 2257 compliance folder to ensure operator documents are present and correctly formatted.

## lora training guide

## Dataset Prep & LoRA Training Guide

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
2. **Folder Structure (inside RunPod):
   - `/workspace/lora_training/img/100_xkx_jessica` (Put your images and .txt captions here. The '100' means 100 repeats per image).
   - `/workspace/lora_training/model` (Output goes here).
   - `/workspace/lora_training/log`
3. **Training Parameters (SDXL Target):
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

## monetization schedule

## Fanvue Distribution & Monetization Schedule

Traffic generation is useless if the funnel does not convert. Here is the operational cadence and pricing structure designed for a hybrid AI creator to maximize retention and PPV sales without burning out.

## 1. Subscription Tiering & Pricing
- **Subscription Price:** $9.99/month (Sweet spot for AI creators). 
- **Promos:** Run a permanent 30% off first-month promo ($6.99) to lower the barrier to entry.
- **The "Why":** The subscription fee is just the cover charge. It covers your baseline software costs (RunPod, Midjourney). The real revenue (60-80%) comes from DMs and PPV.

## 2. Weekly Content Cadence (The Paywall)
Schedule these using Fanvue's queue feature in 2-week batches.
- **Monday:** Timeline Post (Casual, morning aesthetic, engaging caption).
- **Tuesday:** Timeline Post + Mass DM PPV Teaser ($5).
- **Wednesday:** Timeline Post (Interactive question to drive comments).
- **Thursday:** Timeline Post + Mass DM High-Value PPV ($10-$15).
- **Friday:** Timeline Post (Weekend vibes, heavier styling).
- **Saturday:** No timeline post. Respond to custom requests in DMs.
- **Sunday:** Free Mass DM (A voice note recorded by YOU, the human, or a non-explicit "good morning" photo) to build parasocial connection and boost retention.

## 3. The DM & Chat Strategy (Human + AI)

> [!IMPORTANT]
> **Do not fully automate your DMs with AI chatbots on the platform.** If a user feels they are talking to a robot, they will chargeback. 

**The Hybrid Chat Flow:*
1. **LLM Drafts:** You can use your local LLM on RunPod to draft creative responses to complex user roleplays.
2. **Human Sends:** YOU (the operator) copy, edit for authenticity, and press send. 
3. **Upsell Scripts:** 
   - *User:* "You look amazing in that dress."
   - *Operator:* "Thank you! I actually tried on a few others that were a bit more... revealing. Want to see? 😈" -> (Send locked PPV for $8).

## 4. Top-of-Funnel Traffic (Social Media)
AI creators live and die by volume.
- **Reddit:** 5 posts a day across niche subreddits (e.g., /r/aigirls, /r/digitalcreators, plus aesthetic-specific subs). 
- **TikTok/Reels:** (Advanced) If you have the capability, use tools like Luma Dream Machine or Runway Gen-3 to animate your ComfyUI outputs into 3-second looping videos. Post 2x a day.
- **X (Twitter):** Reply-guy strategy. Engage with other AI creators and post 2x daily (1 SFW teaser, 1 engagement prompt).

## task

- `[/]` Initialize Workspace
  - `[x]` Create task.md
- `[x]` Deliverable 1: Dataset Prep & LoRA Training Guide (RunPod/Kohya)
- `[x]` Deliverable 2: Content Generation Workflow (LLM Prompts & ComfyUI Config)
- `[x]` Deliverable 3: Compliance Ledger (2257) & Storage Structure
- `[x]` Deliverable 4: Fanvue Distribution & Monetization Schedule
- `[x]` Create walkthrough.md

## walkthrough

## Fanvue Digital Twin Pipeline Walkthrough

I have successfully mapped and generated the operational playbooks for your hybrid AI creator business. 

## What Was Built

The operation has been broken down into four ready-to-execute modules, organized in your workspace:

1. **[Dataset Prep & LoRA Training Guide](file:///home/jd/.gemini/antigravity/brain/47c031a8-0492-4ed7-8da3-282987c01132/lora_training_guide.md)**
   - Detailed specifications for capturing the 30-50 base images of yourself.
   - RunPod Kohya_ss configurations (epochs, batch size, learning rate) for training a high-fidelity digital twin LoRA.
2. **[Content Generation Workflow](file:///home/jd/.gemini/antigravity/brain/47c031a8-0492-4ed7-8da3-282987c01132/generation_workflow.md)**
   - System prompts for your local LLM to generate precise image prompts.
   - The "Golden Node" ComfyUI workflow architecture for ensuring facial consistency and preventing anatomical errors.
3. **[Compliance Ledger & Storage Struc

## Related

- [Community Data Center / Third-Space Cooperative — Vision]
- [AI Task Concierge Concept](/projects/ai-task-concierge/)
- [develop the into production schedule, shot lists, screen play, assests needed, vidsual…]
