---
title: "Redirect Docker Data Directory"
description: "To resolve the 'no space left' error when running Odysseus with Docker, configure Docker to use a data directory located on your external ext4-formatted drive b"
date: "2026-09-24"
tags: ["docker-data-directory","ext4","definition"]
source: "antigravity://92461444-94df-46f4-86eb-5692916fda10"
draft: false
mechanism: "definition"
signal: 5
from: "92461444-94df-46f4-86eb-5692916fda10"
---

To resolve the 'no space left' error when running Odysseus with Docker, configure Docker to use a data directory located on your external ext4-formatted drive by editing `/etc/docker/daemon.json`. Add `"data-root": "/mnt/drive/docker",` where `/mnt/drive/docker` is your chosen mount point.

## Where this came from

Distilled from working notes in Antigravity conversation `92461444`. The raw note is stream-of-consciousness; this is the claim inside it.
