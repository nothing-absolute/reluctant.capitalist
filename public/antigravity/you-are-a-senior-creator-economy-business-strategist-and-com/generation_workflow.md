# Content Generation Workflow

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
