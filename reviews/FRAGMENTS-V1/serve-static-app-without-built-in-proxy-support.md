---
title: "Serve Static App Without Built-in Proxy Support"
description: "When serving a built static app via 'npx serve', consider changing frontend's base URL directly or placing a reverse proxy (Caddy/Nginx) in front of both servic"
date: "2026-09-24"
tags: ["serve-static-app","reverse-proxy","tooling"]
source: "antigravity://2163af39-ee81-4fad-a665-92194e6e6f77"
draft: false
mechanism: "tooling"
signal: 2
from: "2163af39-ee81-4fad-a665-92194e6e6f77"
---

When serving a built static app via 'npx serve', consider changing frontend's base URL directly or placing a reverse proxy (Caddy/Nginx) in front of both services to route '/api -> http://<backend-proxy-url>:8000'. This ensures proper routing and avoids CORS issues.

## Where this came from

Distilled from working notes in Antigravity conversation `2163af39`. The raw note is stream-of-consciousness; this is the claim inside it.
