#!/usr/bin/env python3
"""Generate the persona shot set on a Runpod GPU. One pod, one model load, all shots.

Character consistency across shots comes from a fixed seed plus a single shared
character description, varied only by pose and framing.

    python generate_persona.py --out /workspace/out
"""

from __future__ import annotations

import argparse
import json
import os
from pathlib import Path

import torch

MODEL = os.environ.get("PERSONA_MODEL", "stabilityai/sdxl-turbo")
NEGATIVE = (
    "cartoon, anime, illustration, painting, cgi, 3d render, text, watermark, logo, "
    "letters, caption, subtitles, deformed face, extra fingers, extra limbs, blurry, "
    "low quality, woman, long hair, young child, multiple people, second person, "
    "other people, crowd, background person, legs in frame, wide shot, full body, "
    "bright room, white walls, office, daylight, window light, fluorescent, high key, "
    "clean corporate, stock photo, smiling broadly, thin moustache, clean shaven"
)

CHARACTER = (
    "bald white man, late thirties, completely shaved head, THICK blond handlebar moustache, "
    "plain black t-shirt, at a desk at night in a very dark room, "
    "strong red LED backlight outlining him, dim warm key light on his face, "
    "large microphone on a boom arm close to his mouth, gaming chair, monitor glow, "
    "PHOTOGRAPH, photorealistic, real human face, natural skin, DSLR, 50mm lens, "
    "tight medium close-up from the chest up, head and shoulders filling the frame, "
    "he is completely alone, nobody else in the room, the room behind him is empty and dark, "
    "empty chair, no one in the background"
)

SHOTS = {
    "persona_cam_hard_open": (
        "leaning forward aggressively into frame, intense stare, one hand flat on the desk, "
        "mid-sentence, wide eyes, confrontational energy"
    ),
    "persona_cam_plan_on_desk": (
        "looking down at a printed spreadsheet spread across the desk, pointing at a column "
        "of numbers with a pen, skeptical expression, visible paper on the desk"
    ),
    "persona_cam_pointed_question": (
        "pointing straight at the camera with one index finger, head tilted, eyebrows raised, "
        "rhetorical question expression, half-smirk"
    ),
    "persona_cam_lean_in": (
        "leaning in very close to the camera, conspiratorial, hand cupped near his mouth, "
        "as if sharing a secret, low key lighting"
    ),
    "persona_cam_quit_slide": (
        "sitting back, both palms up in a shrug, resigned and slightly amused expression, "
        "shaking his head, shoulders dropped"
    ),
    "persona_cam_pivot": (
        "turning his head and upper body to the side mid-gesture, motion blur on the hand, "
        "transitioning to a new point, mouth open speaking"
    ),
    "persona_cam_gesture_out": (
        "one arm extended out toward the side of frame, palm up, presenting something "
        "off-screen, looking at his own hand, explanatory gesture"
    ),
    "persona_cam_quiet": (
        "completely still, hands folded, looking straight into the lens, grave and sincere, "
        "no smile at all, dimmer red lighting, a quiet pause"
    ),
    "persona_cam_close_out": (
        "centred and square to camera, both hands resting on the desk, calm direct address, "
        "closing statement, slight confident nod"
    ),
}

STYLE = (
    "low-light photograph shot on a webcam at night, dark room lit by red and warm lights, "
    "shallow depth of field, sharp focus on the face, 16:9"
)


def main() -> None:
    ap = argparse.ArgumentParser()
    ap.add_argument("--out", default="/workspace/out")
    ap.add_argument("--seed", type=int, default=20260924)
    ap.add_argument("--steps", type=int, default=6)
    ap.add_argument("--width", type=int, default=1344)
    ap.add_argument("--height", type=int, default=768)
    args = ap.parse_args()

    from diffusers import AutoPipelineForText2Image
    from PIL import Image

    out = Path(args.out)
    out.mkdir(parents=True, exist_ok=True)

    turbo = "turbo" in MODEL.lower()
    device = "cuda" if torch.cuda.is_available() else "cpu"
    dtype = torch.float16 if device == "cuda" else torch.float32
    print(f"device={device} model={MODEL}", flush=True)

    pipe = AutoPipelineForText2Image.from_pretrained(
        MODEL, torch_dtype=dtype, variant="fp16" if device == "cuda" else None,
        use_safetensors=True,
    ).to(device)
    pipe.set_progress_bar_config(disable=True)

    made = []
    seeds = {}
    for i, (name, pose) in enumerate(SHOTS.items(), start=1):
        prompt = f"{CHARACTER}, {pose}, {STYLE}"
        shot_seed = args.seed + i
        seeds[name] = shot_seed
        generator = torch.Generator(device="cpu").manual_seed(shot_seed)
        image = pipe(
            prompt=prompt,
            negative_prompt=NEGATIVE,
            width=args.width,
            height=args.height,
            num_inference_steps=args.steps,
            guidance_scale=0.0 if turbo else 7.0,
            generator=generator,
        ).images[0]
        image = image.resize((1920, 1080), Image.LANCZOS)
        path = out / f"{name}.png"
        image.save(path)
        made.append(str(path))
        print(f"[{i}/{len(SHOTS)}] {name}", flush=True)

    (out / "manifest.json").write_text(
        json.dumps({"model": MODEL, "seed": args.seed, "seeds": seeds,
                    "steps": args.steps,
                    "size": [1920, 1080], "files": made}, indent=2),
        encoding="utf-8",
    )
    print("DONE", len(made), flush=True)


if __name__ == "__main__":
    main()
