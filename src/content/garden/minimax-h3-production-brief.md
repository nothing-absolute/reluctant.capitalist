---
title: "MiniMax H3 — 15-Second Clip Production Brief"
description: "Production guide for creating a 15-second video clip using MiniMax H3"
date: "2026-08-31"
tags: ["video-production","ai-video-generation","minimax-h3","content-creation"]
source: "antigravity://09300e2c-0117-4c16-be26-9bc5671d7e42/minimax_h3_production_brief.md"
draft: false
clarity: 5
quality: 5
vault: false
---

### MiniMax H3 — 15-Second Clip Production Brief

#### "The Stall That Time Forgot"

#### Why This Clip Is the Perfect Fit for MiniMax H3

H3's unique strengths map almost 1:1 onto what this sequence demands:

| H3 Feature | How It's Used Here |
|---|---|
| **Native stereo audio generation** | Blowtorch hiss, metal grinding, chains clinking, dramatic bass — all generated *in the same pass* as video. No post-production audio sync needed. |
| **15-second max duration** | This clip is exactly 15 seconds — the full capacity of a single H3 generation. |
| **Image-to-video (first & last frame)** | Feed the **Start Frame** and **End Frame** images below to lock the visual continuity from chained door → revealed box. |
| **Character reference input** | Upload the **Character Reference** image so H3 maintains consistent identity for "you" throughout the clip. |
| **2K resolution** | The dark bathroom setting with fine details (rust, sparks, cobwebs, text on the box) demands high resolution. |
| **Multimodal context understanding** | H3 can take all inputs — start image, end image, character ref, text prompt, AND an audio mood reference — and synthesize them into one coherent shot. |

#### The Scene (15 seconds)

> A hooded figure approaches a condemned bathroom stall inside the West Mall 7 movie theater. The stall door is wrapped in rusted chains, caution tape, and graffiti reading "DO NOT ENTER" and "STAY AWAY." The figure pulls down safety goggles, ignites a blowtorch, and begins cutting through the door hinges. Bright orange sparks shower the grimy tile floor. The door groans, buckles, and crashes inward with a thunderous clang — revealing a dust-covered cardboard box labeled "PROMOTIONAL STANDEE — THE LION KING — 1994 — DO NOT DISCARD." The figure freezes, staring in disbelief. The camera slowly pushes in on the box.

#### Generated Assets

##### 🖼️ Start Frame (First Frame Reference)

**Usage:** Upload as the **First Frame** in MiniMax H3's image-to-video mode. This locks the opening composition — the camera sees the chained stall door from a first-person perspective.

##### 🖼️ End Frame (Last Frame Reference)

**Usage:** Upload as the **Last Frame** in H3's first-and-last-frame mode. This forces the generation to resolve at the exact moment of reveal — the collapsed door, sparks still flying, and the box sitting in the haze. The text reads **"THE LION K"** with old packaging tape covering the remaining letters "ING" — building suspense before the full title is revealed in the next clip.

##### 🧑 Character Reference

**Usage:** Upload as a **Subject/Character Reference** image. H3 will use this to maintain the character's consistent appearance (hoodie, goggles, gloves, blowtorch) throughout the 15-second clip. If you want to use your own likeness instead, swap this out for a clear headshot or photo of yourself from multiple angles.

#### MiniMax H3 Video Prompt

Copy this prompt into MiniMax H3's text input field alongside the three images above:

```
Cinematic dark thriller style. First-person then over-the-shoulder shot. A hooded man wearing safety goggles and leather work gloves walks slowly through a dimly lit, decaying 1990s movie theater bathroom. Greenish fluorescent lights flicker overhead. He approaches a bathroom stall door covered in rusted chains, a padlock, yellow caution tape, and graffiti that reads "DO NOT ENTER." He pulls down his safety goggles, flicks on a blowtorch — a bright blue-orange flame roars to life with a loud hissing sound. He presses the torch to the top hinge. Bright orange sparks cascade down the metal door onto the dirty tile floor. The hinge glows red-hot, then snaps. He moves to the lower hinge. It breaks. The heavy metal door groans, tilts inward, and crashes down with a massive metallic CLANG that echoes through the bathroom. Dust and smoke billow outward. As the haze clears, the camera slowly pushes forward to reveal: sitting alone on the dirty tile floor, a large dusty cardboard box stamped with faded text reading "THE LION KING - 1994 - PROMOTIONAL STANDEE." The man freezes, staring in stunned silence. Hold on the box. Dark cinematic color grading, volumetric haze, dramatic low-key lighting, shallow depth of field.
```

#### Audio / Sound Design Prompt

> [!TIP]
> H3 generates **native stereo audio** alongside the video. The text prompt above already contains strong audio cues (blowtorch hiss, sparks, metallic clang, echoes). However, if you want to provide an **audio reference track** for mood, use one of these approaches:

##### Option A: Let H3 Generate Everything (Recommended)
The prompt above has rich audio descriptions built in. H3 will generate:
- Echoing footsteps on tile
- Blowtorch ignition hiss and roar
- Sparks sizzling and popping
- Metal groaning and the massive door crash
- Eerie bathroom ambience (dripping water, buzzing fluorescent lights)
- Dramatic low-frequency bass hit on the reveal

##### Option B: Provide a Mood Reference Audio
If you want even more control, find or generate a ~15-second audio clip to upload as an **Audio Reference** in H3. Use this prompt to generate one with a text-to-audio tool (like ElevenLabs Sound Effects or MiniMax's own audio platform):

```
Dark horror movie sound design. Start with quiet, eerie ambience — dripping
water echoing in a tiled room, a faint buzzing fluorescent light. At 3 seconds,
a blowtorch ignites with a sharp pressurized hiss that builds into a roaring
flame. Metallic sparks crackle and sizzle. At 10 seconds, a massive metallic
clash — a heavy steel door slamming onto a tile floor. The crash reverberates
through the room. Then sudden silence. At 13 seconds, a single low orchestral
bass note slowly swells, creating a sense of awe and dread.
```

##### Option C: Background Music Prompt (for post-production overlay)
If you want to add a music bed after generating the video, use this prompt with a music generation tool:

```
Dark cinematic orchestral score. Tense strings and low brass. Starts with a
quiet, unsettling pizzicato pattern. Builds slowly with dissonant held chords
and a ticking rhythm. At the climax, all instruments drop out except a single,
depth sustained bass note that vibrates and resonates. The mood shifts from
horror to wonder — like uncovering a long-buried treasure. 15 seconds long.
Film score style, Hans Zimmer influence.
```

#### How to Submit to MiniMax H3

##### Via Hailuo AI (Web UI)
1. Go to [hailuoai.video](https://hailuoai.video/zh-Intl/tools/minimax-h3)
2. Select **Image-to-Video** mode → **First & Last Frame**
3. Upload **Start Frame** as first frame, **End Frame** as last frame
4. Upload **Character Reference** as a subject reference image
5. Paste the **Video Prompt** above
6. Set duration to **15 seconds**, resolution to **2K**, aspect ratio **16:9**
7. Generate

##### Via MiniMax API
Use the `H3-Base Ref2VA` model endpoint with:
- `first_frame_image`: Start Frame
- `last_frame_image`: End Frame
- `subject_reference`: Character Reference
- `prompt`: Video Prompt text above
- `duration`: 15
- `resolution`: "2k"

#### Editing Notes

> [!IMPORTANT]
> This 15-second H3 clip covers the **climax** of your video — the actual break-in and reveal. In your final edit timeline, it should land after the TikTok talking-head conspiracy section (generated on ModelScope) and before the close-up box-opening/standee reveal (generated on LTX Studio with your remaining $0.53 budget).

##### Suggested Edit Timeline
| Timecode | Source | Content |
|---|---|---|
| 0:00–0:25 | ModelScope | TikTok conspiracy talking heads (3-4 clips) |
| 0:25–0:30 | ModelScope/LTX | Transition: walking into theater |
| **0:30–0:45** | **MiniMax H3** | **⬅️ THIS CLIP: Break-in & box reveal** |
| 0:45–0:55 | LTX Studio | Close-up: tearing open box, standee unfolds |
| 0:55–1:00 | Any | Final reaction / credits |

## Related

- [What kind of AI video generation could i do with local llm on a: Apple Macbook Pro 14…](/garden/what-kind-of-ai-video-generation-could-i-do/)
- [what kind of gs milage on the highway would 1976 Winnebago chevy get?]
- [where are files and projects from antigravity saved locally?](/garden/where-are-files-and-projects-from-antigravity-saved-locally/)
