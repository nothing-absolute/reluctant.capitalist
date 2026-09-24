---
draft: true
title: "The One-File Artifact"
description: "A design discipline: whole interfaces shipped as a single HTML file — the constraint that keeps scope honest."
date: 2026-08-03
discipline: "web"
tags: ["design", "constraints", "html"]
---

Some of the best interfaces in this repo are single HTML files. The constraint does the design work: no build step, no framework, no dependency that isn't the browser.

What the constraint forces:

- **Scope dies early.** If it needs a database, it's two files. You feel the weight immediately.
- **Performance is free.** One file loads in one request.
- **Fidelity to the idea.** Nothing between the thought and the artifact except a text editor.

Examples: the Hydration Station and the Opendoors campaign mock. Both started as conversations with the browser and stayed that way.
