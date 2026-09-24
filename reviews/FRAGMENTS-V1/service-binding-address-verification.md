---
title: "Service Binding Address Verification"
description: "To verify if both services are correctly listening, run `ss -ltnp | egrep ':3000|:8000'` inside the pod's Web Terminal or SSH session and check for 'LISTEN ... "
date: "2026-09-24"
tags: ["service-binding","verification-steps","tooling"]
source: "antigravity://2163af39-ee81-4fad-a665-92194e6e6f77"
draft: false
mechanism: "tooling"
signal: 4
from: "2163af39-ee81-4fad-a665-92194e6e6f77"
---

To verify if both services are correctly listening, run `ss -ltnp | egrep ':3000|:8000'` inside the pod's Web Terminal or SSH session and check for 'LISTEN ... 0.0.0.0:xxxx'. This ensures the servers bind properly on all interfaces rather than localhost only.

## Where this came from

Distilled from working notes in Antigravity conversation `2163af39`. The raw note is stream-of-consciousness; this is the claim inside it.
