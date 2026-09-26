# ModelScope Video Generation Plan: The West Mall 7 Discovery

With **246 credits** on ModelScope, the goal is to produce roughly 15 to 20 highly stylized, 5-second clips to assemble your 4 teaser drops. To maximize the "overall combined video quality" over raw resolution, we will prioritize **Image-to-Video (I2V)** where specific composition is needed, and **Text-to-Video (T2V)** for atmospheric/transitional shots.

By keeping the resolution standard (e.g., 720p or 1080x1920 vertical) and avoiding expensive upscaling until assembly, you can stretch your credits to cover multiple generations (rerolls) to get the perfect movement and style.

---

## 1. Global Generation Strategy & Settings

### Model Selection
*   **Primary Video Model:** **CogVideoX-5B-I2V** (Image-to-Video) and **CogVideoX-5B** (Text-to-Video). These are currently some of the most capable open-weight models available on ModelScope for coherent movement. 
*   *(Alternative if available/preferred for anime styles):* **Kling** (if accessible via your ModelScope tier) or **AnimateDiff** paired with a 90s anime base model.
*   **Base Image Model (for I2V prep):** If you are generating base images to feed into I2V, use **FLUX.1-schnell** or **Stable Diffusion XL (SDXL)** paired with a 90s cartoon/cel-shading LoRA.

### LoRA Options (For Base Images / T2V)
*   Search ModelScope for: **"90s Anime Style"**, **"Studio Ghibli Style"**, or **"Retro Cel Animation"** LoRAs. 
*   **LoRA Weight:** `0.6` to `0.8`. You want it to look hand-drawn but still recognizable as a real-world setting (a dirty mall bathroom).

### Global Settings (To Maximize Credits)
*   **Resolution:** 720x1280 (Vertical 9:16 is best for TikTok/Reels). Do not generate in 4K.
*   **Frames/Duration:** 5 seconds (usually 24 or 30 FPS, totaling ~120-150 frames).
*   **Inference Steps:** 25-30 (Diminishing returns beyond 30; saves credits to keep it here).
*   **Guidance Scale (CFG):** `6.0 - 7.5` (Higher makes it adhere strictly to the prompt, lower gives the AI more creative freedom for fluid motion).
*   **Workflow:** Generate 1-2 variations per prompt. Pick the best one.

### Global Prompts
*   **Universal Positive Prompts (append to all):** `1990s classic 2D animation style, hand-drawn cel animation, rotoscoped, vintage VHS aesthetic, grainy, cinematic lighting, moody, nostalgic, masterpiece, highly detailed.`
*   **Universal Negative Prompts (append to all):** `3D render, CGI, realistic, modern photography, ugly, deformed, glitchy, morphing, text, watermarks, bad proportions, hyperrealistic.`

---

## 2. Drop 1: "The Discovery" (15-20 sec)
**Goal:** Establish the creepy, abandoned mall vibe.
**Total Clips:** 4

*   **Clip 1.1: Mall Corridor (T2V)**
    *   **Method:** Text-to-Video
    *   **Prompt:** `POV walking slowly down a dimly lit, abandoned 1990s shopping mall corridor. Flickering fluorescent lights, dark shadows, dirty tile floor. [Universal Prompts]`
    *   **Motion/Prompt:** `Slow forward tracking shot.`
*   **Clip 1.2: Flickering Light (T2V)**
    *   **Method:** Text-to-Video
    *   **Prompt:** `Close up of a buzzing, flickering fluorescent light fixture on a textured ceiling, casting erratic shadows. [Universal Prompts]`
*   **Clip 1.3: The Bathroom Door (I2V)**
    *   **Method:** Image-to-Video. *Why? You need the door to look exactly like the door in the next shot.* (Take a photo of a real door, run it through an image-to-image filter to cartoonify it, then use I2V).
    *   **Prompt:** `A water-stained, faded wooden door in a dark hallway. Slowly zooming in on the door. [Universal Prompts]`
*   **Clip 1.4: The Placard (I2V)**
    *   **Method:** Image-to-Video.
    *   **Prompt:** `Extreme close up of a faded, cracked plastic sign that says "West Mall 7" on a wooden door. The camera slowly pans across the text. [Universal Prompts]`

---

## 3. Drop 2: "What's Behind the Door" (15-20 sec)
**Goal:** The tease of the box.
**Total Clips:** 4

*   **Clip 2.1: Opening the Door (I2V)**
    *   **Method:** Image-to-Video (using the door image from Drop 1 as the start frame).
    *   **Prompt:** `A hand pushes open the heavy, creaky wooden door. A sliver of warm, golden light spills out from the dark room inside. [Universal Prompts]`
*   **Clip 2.2: Entering the Room (T2V)**
    *   **Method:** Text-to-Video
    *   **Prompt:** `POV stepping into a dusty, abandoned storage closet. Dust motes dancing in a single shaft of light. [Universal Prompts]`
*   **Clip 2.3: The Box Appears (I2V)**
    *   **Method:** Image-to-Video. (Generate an image of a vintage cardboard box in a dark room first).
    *   **Prompt:** `Slow pan across a large, weathered, brown cardboard box sitting on a concrete floor in the shadows. [Universal Prompts]`
*   **Clip 2.4: Blurry Label Tease (I2V)**
    *   **Method:** Image-to-Video. 
    *   **Prompt:** `Close up of a torn, faded shipping label on a cardboard box. The camera loses focus and regains focus, blurring the text. [Universal Prompts]`

---

## 4. Drop 3: "The Label" (20-25 sec)
**Goal:** Confirming the location and age.
**Total Clips:** 4

*   **Clip 3.1: The Clear Label (I2V)**
    *   **Method:** Image-to-Video. (Create a base image where the text "West Mall 7 Theater - Sioux Falls, SD" is clearly visible).
    *   **Prompt:** `A steady, clear shot of a vintage shipping label reading "West Mall 7 Theater - Sioux Falls, SD". Dust is settling on the box. [Universal Prompts]`
*   **Clip 3.2: The Tape (T2V)**
    *   **Method:** Text-to-Video
    *   **Prompt:** `Extreme close up of yellowed, brittle packing tape holding a cardboard box shut. The camera slowly tilts down. [Universal Prompts]`
*   **Clip 3.3: Hand Hovering (I2V)**
    *   **Method:** Image-to-Video.
    *   **Prompt:** `A person's hand slowly reaches out toward the top of the cardboard box, hesitating before touching the old tape. [Universal Prompts]`
*   **Clip 3.4: Dusting off the Box (I2V)**
    *   **Method:** Image-to-Video.
    *   **Prompt:** `A hand gently wipes away a thick layer of dust from the top of the vintage cardboard box. [Universal Prompts]`

---

## 5. Drop 4: "First Cut" (20-30 sec)
**Goal:** The climax of the teaser campaign.
**Total Clips:** 4 to 5

*   **Clip 4.1: The Box Cutter (I2V)**
    *   **Method:** Image-to-Video.
    *   **Prompt:** `A hand holding a yellow box cutter approaches the yellowed tape of the cardboard box. [Universal Prompts]`
*   **Clip 4.2: The Slice (I2V)**
    *   **Method:** Image-to-Video. (This is the hardest motion. You may need to run this 2-3 times to get it right without the knife morphing).
    *   **Prompt:** `The box cutter slices cleanly through the old, brittle packing tape on the cardboard box. [Universal Prompts]`
*   **Clip 4.3: Opening the Flap (I2V)**
    *   **Method:** Image-to-Video.
    *   **Prompt:** `The cardboard box flap is slowly lifted open, revealing darkness inside. [Universal Prompts]`
*   **Clip 4.4: The Sliver of Gold (I2V)**
    *   **Method:** Image-to-Video. (Create a base image showing just a hint of the Lion King standee—maybe the tip of a gold letter "L" or a sliver of Simba's mane against a blue background).
    *   **Prompt:** `Looking inside the dark box, a sliver of bright gold lettering and blue background is barely visible. Slow push in. [Universal Prompts]`

---

## Summary of Credit Usage

*   **Total Planned Clips:** 16 clips.
*   **Reroll Allowance:** Assuming you have 246 credits, and a standard 5-second T2V/I2V generation costs around 5-10 credits depending on the model, you have enough credits to generate approximately **25 to 45 clips**.
*   **Strategy:** This means you have enough credits to run every shot on this list, and you have enough leftover credits to **reroll your 10 most important shots at least once or twice** to ensure the animation doesn't morph weirdly (which AI video is prone to do). 
*   **Rule of Thumb:** Save your rerolls for the **I2V shots involving hands and text** (like the box cutter slice and the label reveal), as AI struggles most with keeping these consistent during motion. Let the T2V environment shots (like the flickering lights) be a little weird/dreamy—it adds to the eerie mockumentary vibe.
