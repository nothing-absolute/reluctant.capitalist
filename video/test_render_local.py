#!/usr/bin/env python3
"""Local verification for the Reluctant Capitalist video worker.

Renders a real MP4 from a real timeline so the logic is proven before it ever
touches a GPU. Uses generated placeholder assets by default, which also
exercises the missing-asset fallback path.

    python test_render_local.py
    python test_render_local.py --timeline timelines/video_001_mlm_calculator.json
    python test_render_local.py --dry-run          # validate only, no ffmpeg
"""

from __future__ import annotations

import argparse
import asyncio
import json
import sys
import time
from pathlib import Path

HERE = Path(__file__).resolve().parent
sys.path.insert(0, str(HERE))

import runpod_worker_entrypoint as worker  # noqa: E402


def make_placeholder_assets(timeline: dict, out: Path) -> int:
    """Generate stand-in images so the asset path is exercised, not just the fallback."""
    try:
        import numpy as np
        from PIL import Image, ImageDraw
    except ImportError:
        return 0

    out.mkdir(parents=True, exist_ok=True)
    seen: set[str] = set()
    for seq in timeline["timeline"]:
        rel = seq["visual_asset_path"]
        if rel in seen:
            continue
        seen.add(rel)
        rng = abs(hash(rel))
        r, g, b = 20 + rng % 60, 24 + (rng >> 8) % 40, 40 + (rng >> 16) % 60
        img = Image.new("RGB", (1920, 1080), (r, g, b))
        d = ImageDraw.Draw(img)
        for i in range(0, 1920, 120):
            d.line([(i, 0), (i - 400, 1080)], fill=(r + 22, g + 22, b + 26), width=3)
        d.rectangle([80, 80, 1840, 1000], outline=(232, 84, 61), width=6)
        d.text((120, 520), rel.replace("assets/", "")[:44], fill=(240, 240, 240))
        img.save(out / Path(rel).name)
    return len(seen)


def main() -> int:
    ap = argparse.ArgumentParser()
    ap.add_argument("--timeline", default="timelines/video_001_mlm_calculator.json")
    ap.add_argument("--assets", default="", help="directory to write placeholder assets into")
    ap.add_argument("--force", action="store_true",
                    help="allow --assets to overwrite the real assets/ directory")
    ap.add_argument("--dry-run", action="store_true", help="validate the payload and stop")
    ap.add_argument("--limit", type=int, default=0, help="render only the first N segments (fast iteration)")
    args = ap.parse_args()

    payload = json.loads((HERE / args.timeline).read_text(encoding="utf8"))

    try:
        job = worker.validate(payload)
    except worker.TimelineError as exc:
        print(f"FAIL validation: {exc}")
        return 1

    print(f"payload      {job['video_id']}")
    print(f"  title      {job['title']}")
    print(f"  resolution {job['resolution'][0]}x{job['resolution'][1]} @ {job['fps']}fps")
    print(f"  voice      {job['voice_profile']} -> {worker.VOICE_PROFILES[job['voice_profile']]['voice']}")
    print(f"  segments   {len(job['timeline'])}")
    words = sum(len(s["tts_dialogue"].split()) for s in job["timeline"])
    print(f"  narration  {words} words")

    if args.dry_run:
        print("dry run: validation only, nothing rendered")
        return 0

    if args.limit:
        payload = {**payload, "timeline": payload["timeline"][:args.limit]}
        job = payload
        print(f"  limited   {len(payload['timeline'])} segments")

    if args.assets:
        real_assets = (HERE / "assets").resolve()
        target = Path(args.assets).resolve()
        if target == real_assets and not args.force:
            print(f"REFUSING to write placeholder images into {target}")
            print("That is the real asset directory; it would destroy the rendered charts.")
            print("Point --assets at a scratch dir, or pass --force to overwrite deliberately.")
            return 1
        worker.WORKDIR.mkdir(parents=True, exist_ok=True)
        made = make_placeholder_assets(job, target)
        print(f"  assets     {made} placeholder images in {args.assets}")

    print(f"\nrendering (workdir {worker.WORKDIR}) ... this calls edge-tts and needs ffmpeg")
    t0 = time.time()
    try:
        report = asyncio.run(worker.render(payload))
    except Exception as exc:
        print(f"FAIL render: {type(exc).__name__}: {exc}")
        return 1

    print(f"\nOK in {time.time() - t0:.1f}s")
    print(f"  output      {report['output_path']}")
    print(f"  video       {report['video_seconds']}s")
    print(f"  audio       {report['audio_seconds']}s")
    print(f"  av drift    {report['av_drift_seconds']}s")
    print(f"  size        {report['output_bytes'] / 1_048_576:.1f} MB")
    print(f"  segments    {report['segments_rendered']}")
    print(f"  assets used {len(report['assets_used'])}")
    print(f"  substituted {report['substitution_count']}")
    for sub in report["assets_substituted"][:5]:
        print(f"    seq {sub['sequence']}: {sub['requested']} -> {sub['used']}")
    if report["substitution_count"] > 5:
        print(f"    ... {report['substitution_count'] - 5} more")
    return 0


if __name__ == "__main__":
    raise SystemExit(main())
