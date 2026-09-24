---
title: "Exploring Space Utilization in Downloads"
description: "Hugging Face Hub downloads models to `~/.cache/huggingface/hub`, which is part of the root filesystem, leading me to investigate potential bottlenecks."
date: "2026-09-24"
tags: ["space-utilization","reach"]
source: "antigravity://c799c91d-b879-4167-8f74-37513cd037c2"
draft: false
mechanism: "reach"
signal: 3
from: "c799c91d-b879-4167-8f74-37513cd037c2"
---

Hugging Face Hub downloads models to `~/.cache/huggingface/hub`, which is part of the root filesystem, leading me to investigate potential bottlenecks.

## Where this came from

Distilled from working notes in Antigravity conversation `c799c91d`. The raw note is stream-of-consciousness; this is the claim inside it.
