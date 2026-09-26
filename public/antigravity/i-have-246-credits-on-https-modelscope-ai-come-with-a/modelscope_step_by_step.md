# ModelScope Generation Plan — Step by Step
## The West Mall 7 Discovery Teaser Campaign

---
> **Before you start:** Keep a notes doc open. Every time you generate a clip you like, copy the **Seed #** shown in the result and paste it into your notes. This lets you reproduce that exact look again if you need a variation.
---

## DROP 1 — "The Discovery"

---

### CLIP 1.1 — Mall Corridor Walk
*(Atmospheric opener. POV walking down a dark, abandoned mall.)*

**Text-to-Video**

- **Positive Prompt:**
`POV slow forward tracking shot walking down a dimly lit, abandoned 1990s shopping mall corridor at night. Flickering fluorescent lights overhead. Dark shadows. Dirty cracked tile floor. Debris on the ground. 1990s classic 2D animation style, hand-drawn cel animation, rotoscoped, vintage VHS grain, cinematic moody lighting, masterpiece.`

- **Negative Prompt:**
`3D render, CGI, realistic photography, hyperrealistic, modern, bright lighting, clean, people, text, watermarks, morphing, glitchy, ugly.`

**Model Management:**
- **Model to Select:** CogVideoX
- **Checkpoint:** CogVideoX-5B
- **LoRA Model:** 90s Anime Style (if available) — Weight: `0.7`

**Settings:**
- **Random Seed #:** Leave blank (random) — copy whatever number generates so you can reuse it
- **LoRA Acceleration:** ON
- **Time of Video:** 5 seconds

---

### CLIP 1.2 — Flickering Light Close-Up
*(Just the buzzing, dying fluorescent light above. Unsettling.)*

**Text-to-Video**

- **Positive Prompt:**
`Extreme close up looking up at a buzzing, flickering fluorescent light tube on a water-stained ceiling. Erratic light pulses casting harsh shadows. Insects flying near the light. 1990s classic 2D animation style, hand-drawn cel animation, vintage VHS grain, grainy film texture, moody, cinematic, masterpiece.`

- **Negative Prompt:**
`3D render, CGI, realistic photography, hyperrealistic, modern, clean, bright, people, text, watermarks, morphing, glitchy, ugly.`

**Model Management:**
- **Model to Select:** CogVideoX
- **Checkpoint:** CogVideoX-5B
- **LoRA Model:** 90s Anime Style — Weight: `0.7`

**Settings:**
- **Random Seed #:** Leave blank (random)
- **LoRA Acceleration:** ON
- **Time of Video:** 5 seconds

---

### CLIP 1.3 — The Door Slow Zoom
*(Using the base image already generated. The camera slowly pushes in on the "West Mall 7" door.)*

**Image-to-Video**

- **Start Image:** ✅ Use the **abandoned_theater_door** image you already generated
- **End Image:** None
- **Prompt:** `Slow cinematic zoom in on the door. Camera inches closer to the "West Mall 7" placard. Dust particles floating in the air. No movement on the door itself. 1990s hand-drawn cel animation style, VHS grain, moody.`

**Model Management:**
- **Model to Select:** CogVideoX-I2V
- **Checkpoint:** CogVideoX-5B-I2V
- **LoRA Model:** 90s Anime Style — Weight: `0.65`

**Settings:**
- **Random Seed #:** Leave blank (random)
- **LoRA Acceleration:** ON
- **Sampling Steps #:** 28
- **Time of Video:** 5 seconds

---

### CLIP 1.4 — The Placard Close-Up
*(Same door image, but now we pan across the cracked "West Mall 7" text.)*

**Image-to-Video**

- **Start Image:** ✅ Use the **abandoned_theater_door** image (cropped tighter on the placard if possible)
- **End Image:** None
- **Prompt:** `Slow horizontal pan from left to right across a cracked, faded plastic sign that reads "West Mall 7". Camera moves very slowly. Slight camera shake. 1990s hand-drawn cel animation style, VHS grain.`

**Model Management:**
- **Model to Select:** CogVideoX-I2V
- **Checkpoint:** CogVideoX-5B-I2V
- **LoRA Model:** 90s Anime Style — Weight: `0.65`

**Settings:**
- **Random Seed #:** Leave blank (random)
- **LoRA Acceleration:** ON
- **Sampling Steps #:** 28
- **Time of Video:** 5 seconds

---
---

## DROP 2 — "What's Behind the Door"

---

### CLIP 2.1 — The Door Opens
*(Using the door base image. A hand pushes it open, light spills out.)*

**Image-to-Video**

- **Start Image:** ✅ Use the **abandoned_theater_door** image
- **End Image:** None
- **Prompt:** `A hand slowly pushes the door open from the right side of frame. The door creaks open. Warm golden light spills out from the room beyond, contrasting the dark hallway. Dust falls from the door frame. 1990s hand-drawn cel animation, VHS grain.`

**Model Management:**
- **Model to Select:** CogVideoX-I2V
- **Checkpoint:** CogVideoX-5B-I2V
- **LoRA Model:** 90s Anime Style — Weight: `0.65`

**Settings:**
- **Random Seed #:** Leave blank (random) — ⚠️ **This clip is hard. Plan to run it 2–3 times to get clean hand animation.**
- **LoRA Acceleration:** ON
- **Sampling Steps #:** 30
- **Time of Video:** 5 seconds

---

### CLIP 2.2 — Entering the Room
*(POV stepping into the dusty storage room.)*

**Text-to-Video**

- **Positive Prompt:**
`POV stepping through a doorway into a dusty, abandoned storage room. Beam of warm light cutting through the darkness. Dust motes floating in the air. Old shelves with junk in the background. 1990s classic 2D animation style, hand-drawn cel animation, VHS grain, cinematic lighting, masterpiece.`

- **Negative Prompt:**
`3D render, CGI, realistic, hyperrealistic, modern, clean, bright, people, text, watermarks, morphing, ugly.`

**Model Management:**
- **Model to Select:** CogVideoX
- **Checkpoint:** CogVideoX-5B
- **LoRA Model:** 90s Anime Style — Weight: `0.7`

**Settings:**
- **Random Seed #:** Leave blank (random)
- **LoRA Acceleration:** ON
- **Time of Video:** 5 seconds

---

### CLIP 2.3 — The Box Appears
*(Using the vintage cardboard box base image. Camera pans slowly across it.)*

**Image-to-Video**

- **Start Image:** ✅ Use the **vintage_cardboard_box** image you already generated
- **End Image:** None
- **Prompt:** `Slow cinematic pan from left to right across a large, weathered cardboard box sitting on a concrete floor in a dark room. Dust particles drifting slowly. Shaft of light illuminating the top of the box. Camera moves very slowly. 1990s hand-drawn cel animation, VHS grain.`

**Model Management:**
- **Model to Select:** CogVideoX-I2V
- **Checkpoint:** CogVideoX-5B-I2V
- **LoRA Model:** 90s Anime Style — Weight: `0.65`

**Settings:**
- **Random Seed #:** Leave blank (random)
- **LoRA Acceleration:** ON
- **Sampling Steps #:** 28
- **Time of Video:** 5 seconds

---

### CLIP 2.4 — The Blurry Label Tease
*(We see the label but can't quite read it yet. Camera loses focus.)*

**Image-to-Video**

- **Start Image:** ✅ Use the **vintage_cardboard_box** image (or generate the shipping label base image first — see Image Prompt #3)
- **End Image:** None
- **Prompt:** `Extreme close up of a faded shipping label on a cardboard box. The camera slowly loses focus and then partially regains it, keeping the text blurry and illegible. Mysterious. 1990s hand-drawn cel animation, VHS grain, shallow depth of field.`

**Model Management:**
- **Model to Select:** CogVideoX-I2V
- **Checkpoint:** CogVideoX-5B-I2V
- **LoRA Model:** 90s Anime Style — Weight: `0.65`

**Settings:**
- **Random Seed #:** Leave blank (random)
- **LoRA Acceleration:** ON
- **Sampling Steps #:** 28
- **Time of Video:** 5 seconds

---
---

## DROP 3 — "The Label"

---

### CLIP 3.1 — The Label Revealed
*(First time the text is fully legible. Slow push in.)*
**⚠️ Generate Image Prompt #3 (Shipping Label) from your Gemini Image list BEFORE running this clip.**

**Image-to-Video**

- **Start Image:** ✅ Generate "Image 3: The Shipping Label" from the Gemini prompts doc first, then upload it here
- **End Image:** None
- **Prompt:** `Slow zoom in on a vintage shipping label. The text reads "West Mall 7 Theater - Sioux Falls, SD". Camera holds steady, perfectly in focus. Dust settles slowly on the box surface. 1990s hand-drawn cel animation, VHS grain.`

**Model Management:**
- **Model to Select:** CogVideoX-I2V
- **Checkpoint:** CogVideoX-5B-I2V
- **LoRA Model:** 90s Anime Style — Weight: `0.65`

**Settings:**
- **Random Seed #:** Leave blank (random)
- **LoRA Acceleration:** ON
- **Sampling Steps #:** 30
- **Time of Video:** 5 seconds

---

### CLIP 3.2 — The Tape
*(A reminder the box has never been opened. The packing tape tells the story.)*

**Text-to-Video**

- **Positive Prompt:**
`Extreme close up of yellowed, brittle, cracked packing tape sealing the top of a vintage cardboard box. Camera slowly tilts downward. Dust on the tape. The tape is unbroken. 1990s classic 2D animation style, hand-drawn cel animation, VHS grain, moody lighting, masterpiece.`

- **Negative Prompt:**
`3D render, CGI, realistic, hyperrealistic, modern, open box, broken tape, people, hands, text, watermarks, morphing, ugly, glitchy.`

**Model Management:**
- **Model to Select:** CogVideoX
- **Checkpoint:** CogVideoX-5B
- **LoRA Model:** 90s Anime Style — Weight: `0.7`

**Settings:**
- **Random Seed #:** Leave blank (random)
- **LoRA Acceleration:** ON
- **Time of Video:** 5 seconds

---

### CLIP 3.3 — The Hovering Hand
*(A hand reaches out… and hesitates.)*
**⚠️ Generate Image Prompt #4 (Hovering Hand) from your Gemini Image list BEFORE running this clip.**

**Image-to-Video**

- **Start Image:** ✅ Generate "Image 4: The Hovering Hand" from the Gemini prompts doc first, then upload it here
- **End Image:** None
- **Prompt:** `A cartoon hand slowly moves toward the top of the box, stopping just above the tape. Hesitation. The hand trembles slightly and then pulls back without touching. 1990s hand-drawn cel animation, VHS grain.`

**Model Management:**
- **Model to Select:** CogVideoX-I2V
- **Checkpoint:** CogVideoX-5B-I2V
- **LoRA Model:** 90s Anime Style — Weight: `0.65`

**Settings:**
- **Random Seed #:** Leave blank (random) — ⚠️ **Hand animation is hard. Plan to run 2–3 times.**
- **LoRA Acceleration:** ON
- **Sampling Steps #:** 30
- **Time of Video:** 5 seconds

---

### CLIP 3.4 — Dusting Off the Box
*(The hand sweeps away dust, confirming how long this has sat untouched.)*

**Image-to-Video**

- **Start Image:** ✅ Use the **vintage_cardboard_box** image
- **End Image:** None
- **Prompt:** `A hand gently sweeps away a thick layer of dust from the top surface of the cardboard box. A cloud of dust rises into the light beam. Slow, careful motion. 1990s hand-drawn cel animation, VHS grain.`

**Model Management:**
- **Model to Select:** CogVideoX-I2V
- **Checkpoint:** CogVideoX-5B-I2V
- **LoRA Model:** 90s Anime Style — Weight: `0.65`

**Settings:**
- **Random Seed #:** Leave blank (random)
- **LoRA Acceleration:** ON
- **Sampling Steps #:** 28
- **Time of Video:** 5 seconds

---
---

## DROP 4 — "First Cut"

---

### CLIP 4.1 — The Box Cutter Approaches
*(Tension. The blade is out.)*
**⚠️ Generate Image Prompt #5 (Box Cutter) from your Gemini Image list BEFORE running this clip.**

**Image-to-Video**

- **Start Image:** ✅ Generate "Image 5: The Box Cutter" from the Gemini prompts doc first, then upload it here
- **End Image:** None
- **Prompt:** `A hand holding a yellow utility box cutter slowly moves the blade toward the yellowed packing tape on the cardboard box. Tense, deliberate movement. The blade tip touches the edge of the tape. 1990s hand-drawn cel animation, VHS grain.`

**Model Management:**
- **Model to Select:** CogVideoX-I2V
- **Checkpoint:** CogVideoX-5B-I2V
- **LoRA Model:** 90s Anime Style — Weight: `0.65`

**Settings:**
- **Random Seed #:** Leave blank (random)
- **LoRA Acceleration:** ON
- **Sampling Steps #:** 30
- **Time of Video:** 5 seconds

---

### CLIP 4.2 — The Slice
*(The most satisfying 5 seconds of the whole campaign.)*

**Image-to-Video**

- **Start Image:** ✅ Use the same **Box Cutter** base image
- **End Image:** None
- **Prompt:** `The box cutter blade slices cleanly through the old, brittle packing tape in one smooth motion. The tape splits and curls back. A satisfying cut. 1990s hand-drawn cel animation, VHS grain.`

**Model Management:**
- **Model to Select:** CogVideoX-I2V
- **Checkpoint:** CogVideoX-5B-I2V
- **LoRA Model:** 90s Anime Style — Weight: `0.65`

**Settings:**
- **Random Seed #:** Leave blank (random) — ⚠️ **Most difficult clip. Plan to run 3 times minimum. The blade tends to morph. Pick the cleanest result.**
- **LoRA Acceleration:** ON
- **Sampling Steps #:** 35
- **Time of Video:** 5 seconds

---

### CLIP 4.3 — Opening the Flap
*(The moment everything has been building to — except we still don't see inside.)*
**⚠️ Generate Image Prompt #6 (Box Flap) from your Gemini Image list BEFORE running this clip.**

**Image-to-Video**

- **Start Image:** ✅ Generate "Image 6: The Flap Opening" from the Gemini prompts doc first, then upload it here
- **End Image:** None
- **Prompt:** `A hand grips the cardboard box flap and slowly lifts it open. The flap peels back to reveal darkness inside the box. Dust rises from the interior. Camera slowly tilts down to look inside the dark void. 1990s hand-drawn cel animation, VHS grain.`

**Model Management:**
- **Model to Select:** CogVideoX-I2V
- **Checkpoint:** CogVideoX-5B-I2V
- **LoRA Model:** 90s Anime Style — Weight: `0.65`

**Settings:**
- **Random Seed #:** Leave blank (random)
- **LoRA Acceleration:** ON
- **Sampling Steps #:** 30
- **Time of Video:** 5 seconds

---

### CLIP 4.4 — The Sliver of Gold
*(The final tease. A hint of gold lettering. That's it. That's the hook.)*
**⚠️ Generate Image Prompt #7 (Sliver of Gold) from your Gemini Image list BEFORE running this clip.**

**Image-to-Video**

- **Start Image:** ✅ Generate "Image 7: The Sliver of Gold" from the Gemini prompts doc first, then upload it here
- **End Image:** None
- **Prompt:** `Looking down into the dark interior of an open cardboard box. A sliver of bright gold lettering and a hint of a lion's mane in deep blue are barely visible in the shadows. Camera very slowly pushes in toward the darkness. 1990s hand-drawn cel animation, VHS grain.`

**Model Management:**
- **Model to Select:** CogVideoX-I2V
- **Checkpoint:** CogVideoX-5B-I2V
- **LoRA Model:** 90s Anime Style — Weight: `0.65`

**Settings:**
- **Random Seed #:** Leave blank (random)
- **LoRA Acceleration:** ON
- **Sampling Steps #:** 30
- **Time of Video:** 5 seconds

---
---

## Quick Reference: What to Generate in Order

| Step | Type | What to Do |
|------|------|------------|
| 1 | **Gemini Image** | Generate Images 3, 4, 5, 6, 7 (you already have Images 1 & 2) |
| 2 | **T2V** | Run Clips 1.1, 1.2 (no base image needed) |
| 3 | **I2V** | Run Clips 1.3, 1.4 using the door image |
| 4 | **I2V** | Run Clip 2.1 using the door image |
| 5 | **T2V** | Run Clip 2.2 (no base image needed) |
| 6 | **I2V** | Run Clips 2.3, 2.4 using the box image |
| 7 | **I2V** | Run Clip 3.1 using the label image |
| 8 | **T2V** | Run Clip 3.2 (no base image needed) |
| 9 | **I2V** | Run Clips 3.3, 3.4 using hand/box images |
| 10 | **I2V** | Run Clips 4.1, 4.2 using the box cutter image |
| 11 | **I2V** | Run Clips 4.3, 4.4 using flap/gold images |

## Credit Budget Estimate

| Category | # of Clips | Est. Credits Each | Subtotal |
|----------|------------|-------------------|----------|
| T2V clips (easy) | 4 | ~5–8 credits | ~28 credits |
| I2V clips (standard) | 8 | ~8–12 credits | ~80 credits |
| I2V clips (hard — hands/blade) | 4 | ~8–12 each × 3 rerolls | ~120 credits |
| **TOTAL** | | | **~228 credits** |
| **Buffer remaining** | | | **~18 credits** |
