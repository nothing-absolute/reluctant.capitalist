# Automating ModelScope Video Generation

Yes! You can **100% automate this process** so you don't have to manually copy-paste prompts, upload images, and click buttons 16+ times in a web browser.

Here are the **3 best ways to automate this**, ranging from the cleanest code-based approach to LLM-driven browser controllers like Odysseus.

---

## Option 1: Gradio Client Python Script (⭐ Recommended & Fastest)

Most ModelScope web spaces are built on **Gradio**. Gradio has a built-in Python client (`gradio_client`) that allows you to bypass the web UI entirely and call the model backend directly via API from your terminal.

### How it works:
1. Install `gradio_client`:
   ```bash
   pip install gradio_client
   ```
2. Run a Python script that loops through a batch JSON file containing all 16 clip configurations and downloads the generated MP4 files automatically.

---

## Option 2: Headless Browser Automation (Playwright / Selenium)

If ModelScope requires interacting directly with a specific Web UI form (with logins, sliders, and buttons), a **Playwright Python script** can launch a browser in the background, navigate the page, fill in textboxes, upload your base images, click "Generate", wait for completion, and save the resulting MP4s to disk.

---

## Option 3: LLM Browser Agent (Odysseus / Browser-Use)

If you prefer using an AI agent (like **Odysseus**, **browser-use**, or Antigravity's autonomous browser agent):

- **Odysseus / Browser-Use**: You feed it a single JSON task file containing the prompts and settings, and the agent visually clicks through the web interface, handles file pickers, monitors generation progress, and downloads the output files.
- **Workflow:** You give the agent the `clips_config.json` file created below and prompt it: *"Log into ModelScope, then loop through `clips_config.json` and generate every video clip. Save each output video to `./output_clips/`."*

---

## Ready-to-Use Batch Configuration (`clips_config.json`)

Here is a structured JSON file containing all 16 clip definitions and image paths:

```json
[
  {
    "clip_id": "clip_1_1",
    "type": "T2V",
    "prompt": "POV slow forward tracking shot walking down a dimly lit, abandoned 1990s shopping mall corridor at night. Flickering fluorescent lights overhead. Dark shadows. Dirty cracked tile floor. Debris on the ground. 1990s classic 2D animation style, hand-drawn cel animation, rotoscoped, vintage VHS grain, cinematic moody lighting, masterpiece.",
    "negative_prompt": "3D render, CGI, realistic photography, hyperrealistic, modern, bright lighting, clean, people, text, watermarks, morphing, glitchy, ugly.",
    "duration_sec": 5,
    "model": "CogVideoX-5B",
    "lora": "90s Anime Style",
    "lora_weight": 0.7,
    "start_image": null
  },
  {
    "clip_id": "clip_1_2",
    "type": "T2V",
    "prompt": "Extreme close up looking up at a buzzing, flickering fluorescent light tube on a water-stained ceiling. Erratic light pulses casting harsh shadows. Insects flying near the light. 1990s classic 2D animation style, hand-drawn cel animation, vintage VHS grain, grainy film texture, moody, cinematic, masterpiece.",
    "negative_prompt": "3D render, CGI, realistic photography, hyperrealistic, modern, clean, bright, people, text, watermarks, morphing, glitchy, ugly.",
    "duration_sec": 5,
    "model": "CogVideoX-5B",
    "lora": "90s Anime Style",
    "lora_weight": 0.7,
    "start_image": null
  },
  {
    "clip_id": "clip_1_3",
    "type": "I2V",
    "prompt": "Slow cinematic zoom in on the door. Camera inches closer to the West Mall 7 placard. Dust particles floating in the air. No movement on the door itself. 1990s hand-drawn cel animation style, VHS grain, moody.",
    "negative_prompt": "3D render, CGI, realistic photography, ugly, morphing.",
    "duration_sec": 5,
    "model": "CogVideoX-5B-I2V",
    "lora": "90s Anime Style",
    "lora_weight": 0.65,
    "start_image": "[local path redacted]"
  },
  {
    "clip_id": "clip_1_4",
    "type": "I2V",
    "prompt": "Slow horizontal pan from left to right across a cracked, faded plastic sign that reads West Mall 7. Camera moves very slowly. Slight camera shake. 1990s hand-drawn cel animation style, VHS grain.",
    "negative_prompt": "3D render, CGI, realistic photography, ugly, morphing.",
    "duration_sec": 5,
    "model": "CogVideoX-5B-I2V",
    "lora": "90s Anime Style",
    "lora_weight": 0.65,
    "start_image": "[local path redacted]"
  },
  {
    "clip_id": "clip_2_1",
    "type": "I2V",
    "prompt": "A hand slowly pushes the door open from the right side of frame. The door creaks open. Warm golden light spills out from the room beyond, contrasting the dark hallway. Dust falls from the door frame. 1990s hand-drawn cel animation, VHS grain.",
    "negative_prompt": "3D render, CGI, realistic photography, ugly, morphing.",
    "duration_sec": 5,
    "model": "CogVideoX-5B-I2V",
    "lora": "90s Anime Style",
    "lora_weight": 0.65,
    "start_image": "[local path redacted]"
  },
  {
    "clip_id": "clip_2_2",
    "type": "T2V",
    "prompt": "POV stepping through a doorway into a dusty, abandoned storage room. Beam of warm light cutting through the darkness. Dust motes floating in the air. Old shelves with junk in the background. 1990s classic 2D animation style, hand-drawn cel animation, VHS grain, cinematic lighting, masterpiece.",
    "negative_prompt": "3D render, CGI, realistic, hyperrealistic, modern, clean, bright, people, text, watermarks, morphing, ugly.",
    "duration_sec": 5,
    "model": "CogVideoX-5B",
    "lora": "90s Anime Style",
    "lora_weight": 0.7,
    "start_image": null
  },
  {
    "clip_id": "clip_2_3",
    "type": "I2V",
    "prompt": "Slow cinematic pan from left to right across a large, weathered cardboard box sitting on a concrete floor in a dark room. Dust particles drifting slowly. Shaft of light illuminating the top of the box. Camera moves very slowly. 1990s hand-drawn cel animation, VHS grain.",
    "negative_prompt": "3D render, CGI, realistic photography, ugly, morphing.",
    "duration_sec": 5,
    "model": "CogVideoX-5B-I2V",
    "lora": "90s Anime Style",
    "lora_weight": 0.65,
    "start_image": "[local path redacted]"
  },
  {
    "clip_id": "clip_2_4",
    "type": "I2V",
    "prompt": "Extreme close up of a faded shipping label on a cardboard box. The camera slowly loses focus and then partially regains it, keeping the text blurry and illegible. Mysterious. 1990s hand-drawn cel animation, VHS grain, shallow depth of field.",
    "negative_prompt": "3D render, CGI, realistic photography, ugly, morphing.",
    "duration_sec": 5,
    "model": "CogVideoX-5B-I2V",
    "lora": "90s Anime Style",
    "lora_weight": 0.65,
    "start_image": "[local path redacted]"
  },
  {
    "clip_id": "clip_3_1",
    "type": "I2V",
    "prompt": "Slow zoom in on a vintage shipping label. The text reads West Mall 7 Theater - Sioux Falls, SD. Camera holds steady, perfectly in focus. Dust settles slowly on the box surface. 1990s hand-drawn cel animation, VHS grain.",
    "negative_prompt": "3D render, CGI, realistic photography, ugly, morphing.",
    "duration_sec": 5,
    "model": "CogVideoX-5B-I2V",
    "lora": "90s Anime Style",
    "lora_weight": 0.65,
    "start_image": "[local path redacted]"
  },
  {
    "clip_id": "clip_3_2",
    "type": "T2V",
    "prompt": "Extreme close up of yellowed, brittle, cracked packing tape sealing the top of a vintage cardboard box. Camera slowly tilts downward. Dust on the tape. The tape is unbroken. 1990s classic 2D animation style, hand-drawn cel animation, VHS grain, moody lighting, masterpiece.",
    "negative_prompt": "3D render, CGI, realistic, hyperrealistic, modern, open box, broken tape, people, hands, text, watermarks, morphing, ugly, glitchy.",
    "duration_sec": 5,
    "model": "CogVideoX-5B",
    "lora": "90s Anime Style",
    "lora_weight": 0.7,
    "start_image": null
  },
  {
    "clip_id": "clip_3_3",
    "type": "I2V",
    "prompt": "A cartoon hand slowly moves toward the top of the box, stopping just above the tape. Hesitation. The hand trembles slightly and then pulls back without touching. 1990s hand-drawn cel animation, VHS grain.",
    "negative_prompt": "3D render, CGI, realistic photography, ugly, morphing.",
    "duration_sec": 5,
    "model": "CogVideoX-5B-I2V",
    "lora": "90s Anime Style",
    "lora_weight": 0.65,
    "start_image": "[local path redacted]"
  },
  {
    "clip_id": "clip_3_4",
    "type": "I2V",
    "prompt": "A hand gently sweeps away a thick layer of dust from the top surface of the cardboard box. A cloud of dust rises into the light beam. Slow, careful motion. 1990s hand-drawn cel animation, VHS grain.",
    "negative_prompt": "3D render, CGI, realistic photography, ugly, morphing.",
    "duration_sec": 5,
    "model": "CogVideoX-5B-I2V",
    "lora": "90s Anime Style",
    "lora_weight": 0.65,
    "start_image": "[local path redacted]"
  },
  {
    "clip_id": "clip_4_1",
    "type": "I2V",
    "prompt": "A hand holding a yellow utility box cutter slowly moves the blade toward the yellowed packing tape on the cardboard box. Tense, deliberate movement. The blade tip touches the edge of the tape. 1990s hand-drawn cel animation, VHS grain.",
    "negative_prompt": "3D render, CGI, realistic photography, ugly, morphing.",
    "duration_sec": 5,
    "model": "CogVideoX-5B-I2V",
    "lora": "90s Anime Style",
    "lora_weight": 0.65,
    "start_image": "[local path redacted]"
  },
  {
    "clip_id": "clip_4_2",
    "type": "I2V",
    "prompt": "The box cutter blade slices cleanly through the old, brittle packing tape in one smooth motion. The tape splits and curls back. A satisfying cut. 1990s hand-drawn cel animation, VHS grain.",
    "negative_prompt": "3D render, CGI, realistic photography, ugly, morphing.",
    "duration_sec": 5,
    "model": "CogVideoX-5B-I2V",
    "lora": "90s Anime Style",
    "lora_weight": 0.65,
    "start_image": "[local path redacted]"
  },
  {
    "clip_id": "clip_4_3",
    "type": "I2V",
    "prompt": "A hand grips the cardboard box flap and slowly lifts it open. The flap peels back to reveal darkness inside the box. Dust rises from the interior. Camera slowly tilts down to look inside the dark void. 1990s hand-drawn cel animation, VHS grain.",
    "negative_prompt": "3D render, CGI, realistic photography, ugly, morphing.",
    "duration_sec": 5,
    "model": "CogVideoX-5B-I2V",
    "lora": "90s Anime Style",
    "lora_weight": 0.65,
    "start_image": "[local path redacted]"
  },
  {
    "clip_id": "clip_4_4",
    "type": "I2V",
    "prompt": "Looking down into the dark interior of an open cardboard box. A sliver of bright gold lettering and a hint of a lion's mane in deep blue are barely visible in the shadows. Camera very slowly pushes in toward the darkness. 1990s hand-drawn cel animation, VHS grain.",
    "negative_prompt": "3D render, CGI, realistic photography, ugly, morphing.",
    "duration_sec": 5,
    "model": "CogVideoX-5B-I2V",
    "lora": "90s Anime Style",
    "lora_weight": 0.65,
    "start_image": "[local path redacted]"
  }
]
```

---

## Sample Automation Script (`automate_batch.py`)

Using Python + `gradio_client` (or Playwright), you can automate the execution:

```python
import json
import os
import time
from gradio_client import Client, handle_file

# Load clip configurations
with open("clips_config.json", "r") as f:
    clips = json.load(f)

# Connect to ModelScope Gradio endpoint (replace with exact Space URL)
# Example: Client("modelscope/CogVideoX-5B-Space")
client = Client("YOUR_MODELSCOPE_SPACE_URL")

output_dir = "./generated_clips"
os.makedirs(output_dir, exist_ok=True)

for clip in clips:
    print(f"🎬 Processing {clip['clip_id']} ({clip['type']})...")
    
    try:
        if clip["type"] == "I2V":
            result = client.predict(
                prompt=clip["prompt"],
                image=handle_file(clip["start_image"]),
                negative_prompt=clip["negative_prompt"],
                guidance_scale=6.0,
                num_inference_steps=28,
                api_name="/predict"
            )
        else: # T2V
            result = client.predict(
                prompt=clip["prompt"],
                negative_prompt=clip["negative_prompt"],
                guidance_scale=6.0,
                num_inference_steps=28,
                api_name="/predict"
            )
            
        print(f"✅ Finished {clip['clip_id']}: {result}")
        # Save output MP4
        save_path = os.path.join(output_dir, f"{clip['clip_id']}.mp4")
        os.rename(result, save_path)
        
    except Exception as e:
        print(f"❌ Error on {clip['clip_id']}: {e}")

    # Pause to prevent rate limits
    time.sleep(3)

print("🎉 All clips generated successfully!")
```
