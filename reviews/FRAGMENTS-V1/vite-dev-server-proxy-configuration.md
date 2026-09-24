---
title: "Vite Dev Server Proxy Configuration"
description: "If using Vite dev server during development, configure proxy in vite.config.ts to route '/api -> http://127.0.0.1:8000' with `changeOrigin: true` ensuring API c"
date: "2026-09-24"
tags: ["vite-config","proxy-setup","definition"]
source: "antigravity://2163af39-ee81-4fad-a665-92194e6e6f77"
draft: false
mechanism: "definition"
signal: 3
from: "2163af39-ee81-4fad-a665-92194e6e6f77"
---

If using Vite dev server during development, configure proxy in vite.config.ts to route '/api -> http://127.0.0.1:8000' with `changeOrigin: true` ensuring API calls are correctly proxied from frontend to backend inside the pod.

## Where this came from

Distilled from working notes in Antigravity conversation `2163af39`. The raw note is stream-of-consciousness; this is the claim inside it.
