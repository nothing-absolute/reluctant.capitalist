---
title: "Evaluating Audio Routing Options with AAudio/OpenSL Stack Limitation"
description: "AAudio/OpenSL stack presents latency issues when using PRoot via PulseAudio/Pipewire TCP sockets. I'm leaning towards native Termux with direct ALSA access to a"
date: "2026-09-24"
tags: ["audio-routing-options","latency-issues","definition"]
source: "antigravity://ceabce17-c09c-4849-83bd-4247d600ee3c"
draft: false
mechanism: "definition"
signal: 4
from: "ceabce17-c09c-4849-83bd-4247d600ee3c"
---

AAudio/OpenSL stack presents latency issues when using PRoot via PulseAudio/Pipewire TCP sockets. I'm leaning towards native Termux with direct ALSA access to achieve low-latency JACK performance.

## Where this came from

Distilled from working notes in Antigravity conversation `ceabce17`. The raw note is stream-of-consciousness; this is the claim inside it.
