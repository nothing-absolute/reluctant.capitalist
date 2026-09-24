---
title: "Hydration Station"
description: "A single-page 'hydration station' concept — daily water target tracker with a deliberately over-engineered interface, built as a one-file HTML artifact."
date: 2026-08-03
status: "prototype"
stage: "mvp"
tags: ["health", "web-app", "prototype"]
stack: ["HTML/CSS/JS", "single-file"]
---

A morning ritual instrument: set a daily hydration target, track progress with an interface that rewards showing up more than it scolds you for missing.

**What it is:** one file, no framework, no build step (`hydration-station-v3.html`). An exercise in restraint — the third version cut features instead of adding them.

**Design decisions worth keeping:**

- Progress is framed as *distance to goal*, not *percentage of perfection*
- Zero login; the browser is the database
- The visual rhythm (large type, generous spacing) is the actual feature — a tool you open first thing should feel calm

## Status

MVP is functional in a browser. Next step if it ever graduates: a proper app shell and offline support. Or it stays a one-file artifact — which is also fine.
