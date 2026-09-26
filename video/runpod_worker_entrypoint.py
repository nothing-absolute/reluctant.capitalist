#!/usr/bin/env python3
"""Runpod Serverless video worker for The Reluctant Capitalist.

Renders a strict JSON timeline (voiceover + visuals) into a 1920x1080 MP4.

Why ffmpeg does the video work
------------------------------
moviepy's `VideoClip(frame_function=...)` (a Ken Burns zoom) silently loses its
duration once the clip is wrapped in a CompositeVideoClip and passed to
`concatenate_videoclips`. The clip reports the right duration, the audio is
correct, and the written MP4 comes out truncated - video stream ends early
while audio runs to the end. Measured here: 16.00s expected, 6.07s written.

So stills go through ffmpeg's `zoompan` filter and segments are joined with the
concat demuxer. Both are exact-duration by construction, and joining is a
stream copy rather than a re-encode.

Run locally:   python test_render_local.py
Run on Runpod: container entrypoint, driven by runpod serverless
"""

from __future__ import annotations

import asyncio
import json
import logging
import os
import shutil
import subprocess
import tempfile
from pathlib import Path
from typing import Any

import runpod

log = logging.getLogger("rc-video-worker")
log.setLevel(os.environ.get("LOG_LEVEL", "INFO"))

WIDTH, HEIGHT, FPS = 1920, 1080, 30
BG = "0x0a0b0e"
ACCENT = "0xe8543d"
WORKDIR = Path(os.environ.get("VIDEO_WORKDIR", tempfile.gettempdir()))
FONT = os.environ.get("VIDEO_FONT", "/usr/share/fonts/truetype/dejavu/DejaVuSans-Bold.ttf")

REQUIRED_TOP = {"video_id", "title", "timeline"}
REQUIRED_SEQ = {"sequence", "tts_dialogue", "visual_asset_type", "visual_asset_path", "on_screen_text"}

VOICE_PROFILES: dict[str, dict[str, str]] = {
    "satirical_streamer": {"voice": "en-US-GuyNeural", "rate": "+12%", "pitch": "-8Hz"},
    "clinical_empathetic_male": {"voice": "en-US-AndrewNeural", "rate": "+0%", "pitch": "-2Hz"},
    "clinical_empathetic_female": {"voice": "en-US-AriaNeural", "rate": "+0%", "pitch": "+0Hz"},
    "narrator": {"voice": "en-US-GuyNeural", "rate": "+4%", "pitch": "-4Hz"},
}


class TimelineError(ValueError):
    pass


def validate(payload: dict[str, Any]) -> dict[str, Any]:
    missing = REQUIRED_TOP - set(payload)
    if missing:
        raise TimelineError(f"missing top-level keys: {sorted(missing)}")
    if not isinstance(payload["timeline"], list) or not payload["timeline"]:
        raise TimelineError("timeline must be a non-empty list")

    seen: set[int] = set()
    for i, seq in enumerate(payload["timeline"], start=1):
        if not isinstance(seq, dict):
            raise TimelineError(f"timeline[{i - 1}] is not an object")
        absent = REQUIRED_SEQ - set(seq)
        if absent:
            raise TimelineError(f"timeline[{i - 1}] missing {sorted(absent)}")
        n = seq["sequence"]
        if not isinstance(n, int):
            raise TimelineError(f"timeline[{i - 1}] sequence must be int, got {type(n).__name__}")
        if n in seen:
            raise TimelineError(f"duplicate sequence {n}")
        seen.add(n)
        if not str(seq["tts_dialogue"]).strip():
            raise TimelineError(f"sequence {n} has empty tts_dialogue")

    ordered = sorted(payload["timeline"], key=lambda s: s["sequence"])
    payload = {**payload, "timeline": ordered}
    res = payload.get("resolution") or "1920x1080"
    try:
        w, h = (int(v) for v in str(res).lower().split("x"))
    except ValueError as exc:
        raise TimelineError(f"bad resolution {res!r}, expected WIDTHxHEIGHT") from exc
    payload["resolution"] = (w, h)
    payload["fps"] = int(payload.get("fps") or FPS)
    payload["voice_profile"] = payload.get("tts_voice_profile") or "narrator"
    if payload["voice_profile"] not in VOICE_PROFILES:
        raise TimelineError(
            f"unknown tts_voice_profile {payload['voice_profile']!r}; known: {sorted(VOICE_PROFILES)}"
        )
    return payload


async def synthesize(text: str, profile: str, out_path: Path) -> Path:
    """Generate one voiceover segment. Swap this function to change TTS engines."""
    import edge_tts

    cfg = VOICE_PROFILES[profile]
    comm = edge_tts.Communicate(text, cfg["voice"], rate=cfg["rate"], pitch=cfg["pitch"])
    await comm.save(str(out_path))
    if not out_path.exists() or out_path.stat().st_size == 0:
        raise RuntimeError(f"tts produced no audio for: {text[:60]!r}")
    return out_path


def probe_duration(path: Path, stream: str = "v:0") -> float:
    out = subprocess.run(
        ["ffprobe", "-v", "error", "-select_streams", stream, "-show_entries", "format=duration",
         "-of", "default=nw=1:nk=1", str(path)],
        capture_output=True, text=True, check=True,
    )
    return float(out.stdout.strip())


def _escape_drawtext(text: str) -> str:
    return (text.replace("\\", "\\\\").replace(":", r"\:").replace("'", "")
                .replace("%", r"\%").replace(",", r"\,").replace("[", r"\[").replace("]", r"\]"))


def _wrap(text: str, width: int = 26) -> str:
    words, lines, cur = text.split(), [], ""
    for w in words:
        if len(cur) + len(w) + 1 > width:
            lines.append(cur)
            cur = w
        else:
            cur = f"{cur} {w}".strip()
    if cur:
        lines.append(cur)
    return "\n".join(lines)


def render_still_segment(image: Path, seconds: float, on_screen: str, sub: str,
                         size: tuple[int, int], fps: int, audio: Path, out: Path,
                         text_overlay: bool = True) -> Path:
    w, h = size
    frames = max(int(round(seconds * fps)), 1)
    zoompan = (
        f"scale={w * 2}:{h * 2}:force_original_aspect_ratio=increase,"
        f"crop={w * 2}:{h * 2},"
        f"zoompan=z='min(zoom+0.00022,1.16)':d={frames}"
        f":x='iw/2-(iw/zoom/2)+12*on/{frames}'"
        f":y='ih/2-(ih/zoom/2)-10*on/{frames}'"
        f":s={w}x{h}:fps={fps}"
    )
    vf = zoompan
    # Assets that already carry their own typography (generated charts, title
    # cards) set text_overlay=false: burning the headline and the narration
    # over them duplicates the text and covers axis labels and footers.
    if on_screen and text_overlay:
        lines = _wrap(on_screen.upper(), 30)
        vf += (f",drawtext=fontfile={FONT}:text='{_escape_drawtext(lines)}'"
               f":fontcolor=white:fontsize=64:line_spacing=14:text_align=center"
               f":borderw=3:bordercolor=black@0.85"
               f":x=(w-text_w)/2:y=h*0.16")
    if sub and text_overlay:
        sl = _wrap(sub, 52)
        vf += (f",drawtext=fontfile={FONT}:text='{_escape_drawtext(sl)}'"
               f":fontcolor={ACCENT}:fontsize=34:line_spacing=10:text_align=center"
               f":borderw=3:bordercolor=black@0.8"
               f":x=(w-text_w)/2:y=h-text_h-h*0.14")
    cmd = ["ffmpeg", "-y", "-loop", "1", "-i", str(image), "-i", str(audio),
           "-vf", vf, "-t", f"{seconds:.3f}", "-r", str(fps),
           "-c:v", "libx264", "-crf", os.environ.get("VIDEO_CRF", "19"),
           "-preset", os.environ.get("VIDEO_PRESET", "medium"),
           "-pix_fmt", "yuv420p", "-c:a", "aac", "-b:a", "160k",
           "-shortest", str(out)]
    subprocess.run(cmd, check=True, capture_output=True)
    return out


def render_text_segment(seconds: float, on_screen: str, sub: str,
                        size: tuple[int, int], fps: int, audio: Path, out: Path,
                        accent: bool = False) -> Path:
    w, h = size
    head = _wrap(on_screen.upper(), 24)
    font_size = 84 if accent else 72
    vf = f"drawbox=x=0:y=0:w={w}:h={h}:color={BG}:t=fill"
    vf += (f",drawtext=fontfile={FONT}:text='{_escape_drawtext(head)}'"
           f":fontcolor=white:fontsize={font_size}:line_spacing=16:text_align=center"
           f":borderw=4:bordercolor={ACCENT}@0.5"
           f":x=(w-text_w)/2:y=(h-text_h)/2-h*0.06")
    if sub:
        sl = _wrap(sub, 56)
        vf += (f",drawtext=fontfile={FONT}:text='{_escape_drawtext(sl)}'"
               f":fontcolor={ACCENT}:fontsize=32:line_spacing=10:text_align=center"
               f":x=(w-text_w)/2:y=h*0.76")
    cmd = ["ffmpeg", "-y", "-f", "lavfi", "-i", f"color=c={BG}:s={w}x{h}:r={fps}",
           "-i", str(audio), "-vf", vf, "-t", f"{seconds:.3f}",
           "-c:v", "libx264", "-crf", os.environ.get("VIDEO_CRF", "19"),
           "-preset", os.environ.get("VIDEO_PRESET", "medium"),
           "-pix_fmt", "yuv420p", "-c:a", "aac", "-b:a", "160k",
           "-shortest", str(out)]
    subprocess.run(cmd, check=True, capture_output=True)
    return out


def concat_segments(parts: list[Path], out: Path) -> Path:
    listfile = out.parent / "concat.txt"
    listfile.write_text("".join(f"file '{p.resolve()}'\n" for p in parts), encoding="utf-8")
    subprocess.run(
        ["ffmpeg", "-y", "-f", "concat", "-safe", "0", "-i", str(listfile),
         "-c", "copy", "-movflags", "+faststart", str(out)],
        check=True, capture_output=True,
    )
    return out


async def render(payload: dict[str, Any]) -> dict[str, Any]:
    job = validate(payload)
    size, fps, profile = job["resolution"], job["fps"], job["voice_profile"]
    out_dir = WORKDIR / f"render_{job['video_id']}"
    if out_dir.exists():
        shutil.rmtree(out_dir)
    out_dir.mkdir(parents=True, exist_ok=True)

    report: dict[str, Any] = {"video_id": job["video_id"], "title": job["title"],
                              "assets_used": [], "assets_substituted": [], "segments": []}
    parts: list[Path] = []

    for seq in job["timeline"]:
        n = seq["sequence"]
        wav = out_dir / f"seg_{n:03d}.mp3"
        await synthesize(seq["tts_dialogue"], profile, wav)
        seconds = max(probe_duration(wav, "a:0"), 1.0)
        seg = out_dir / f"seg_{n:03d}.mp4"

        raw = Path(seq["visual_asset_path"])
        roots = [Path(os.environ["VIDEO_ASSETS_DIR"])] if os.environ.get("VIDEO_ASSETS_DIR") else []
        roots += [out_dir, Path("/workspace"), Path(__file__).resolve().parent, Path("assets")]
        found = next((c for c in (raw, *(r / raw for r in roots), *(r / raw.name for r in roots))
                      if c.is_file()), None)

        if found:
            render_still_segment(found, seconds, seq["on_screen_text"],
                                 seq["tts_dialogue"][:120], size, fps, wav, seg,
                                 text_overlay=bool(seq.get("text_overlay", True)))
            report["assets_used"].append({"sequence": n, "path": str(found)})
        else:
            kind = str(seq["visual_asset_type"])
            is_chart = kind in {"d3_chart", "chart", "graph", "flowchart"}
            render_text_segment(seconds, seq["on_screen_text"], seq["tts_dialogue"][:120],
                                size, fps, wav, seg, accent=is_chart)
            report["assets_substituted"].append({
                "sequence": n, "requested": str(raw), "reason": "missing",
                "used": f"generated {'chart' if is_chart else 'text'} card",
            })

        parts.append(seg)
        report["segments"].append({"sequence": n, "seconds": round(seconds, 2),
                                   "tts_words": len(seq["tts_dialogue"].split())})
        log.info("segment %s ok (%.1fs)", n, seconds)

    mp4 = out_dir / f"{job['video_id']}.mp4"
    concat_segments(parts, mp4)

    v_dur = probe_duration(mp4, "v:0")
    a_dur = probe_duration(mp4, "a:0")
    drift = abs(v_dur - a_dur)
    if drift > 0.5:
        raise RuntimeError(
            f"av drift after concat: video {v_dur:.2f}s vs audio {a_dur:.2f}s"
        )

    report.update({
        "output_path": str(mp4),
        "output_bytes": mp4.stat().st_size,
        "video_seconds": round(v_dur, 2),
        "audio_seconds": round(a_dur, 2),
        "av_drift_seconds": round(drift, 3),
        "segments_rendered": len(parts),
        "substitution_count": len(report["assets_substituted"]),
    })
    log.info("render complete: %s (%.2fs video, %.2fs audio, %.1fMB)",
             mp4, v_dur, a_dur, report["output_bytes"] / 1_048_576)
    return report


def handler(event: dict[str, Any], context: Any = None) -> dict[str, Any]:
    """Render a video timeline payload into an MP4.

    Input:
        {
            "video_id": string,
            "title": string,
            "resolution": string ("1920x1080"),
            "fps": int,
            "tts_voice_profile": string,
            "timeline": [
                {
                    "sequence": int,
                    "tts_dialogue": str,
                    "visual_asset_type": str,
                    "visual_asset_path": str,
                    "on_screen_text": str,
                    "text_overlay": bool  # optional, default true. set false when
                                          # the asset already has its own
                                          # typography (generated charts/cards)
                }
            ]
        }
    """
    job = event.get("input", event)
    try:
        return {"output": asyncio.run(render(job))}
    except TimelineError as exc:
        log.warning("invalid timeline: %s", exc)
        return {"error": str(exc), "error_type": "TimelineError"}


def _serve() -> None:
    if os.environ.get("RUNPOD_SERVERLESS") or os.environ.get("RUNPOD_DEBUG"):
        runpod.serverless.start({"handler": handler})


_serve()
