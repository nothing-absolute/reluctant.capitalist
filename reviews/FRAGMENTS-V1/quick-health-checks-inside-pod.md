---
title: "Quick Health Checks Inside Pod"
description: "Running `curl -sS <address> | head` for each service inside the pod can quickly verify their status. Common issues are bind address problems leading to unreacha"
date: "2026-09-24"
tags: ["health-checks","quick-verification","reach"]
source: "antigravity://2163af39-ee81-4fad-a665-92194e6e6f77"
draft: false
mechanism: "reach"
signal: 3
from: "2163af39-ee81-4fad-a665-92194e6e6f77"
---

Running `curl -sS <address> | head` for each service inside the pod can quickly verify their status. Common issues are bind address problems leading to unreachable ports via Runpod's external access URLs.

## Where this came from

Distilled from working notes in Antigravity conversation `2163af39`. The raw note is stream-of-consciousness; this is the claim inside it.
