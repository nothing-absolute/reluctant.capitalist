---
title: "Edit fstab for Persistent Mount"
description: "Add an entry to `/etc/fstab` (e.g., `[file:///etc/fstab](/etc/fstab)`) to mount the external drive at boot: `UUID=<your-uuid> /mnt/drive ext4 defaults,nofail 0 "
date: "2026-09-24"
tags: ["fstab","mount-point","tooling"]
source: "antigravity://92461444-94df-46f4-86eb-5692916fda10"
draft: false
mechanism: "tooling"
signal: 3
from: "92461444-94df-46f4-86eb-5692916fda10"
---

Add an entry to `/etc/fstab` (e.g., `[file:///etc/fstab](/etc/fstab)`) to mount the external drive at boot: `UUID=<your-uuid> /mnt/drive ext4 defaults,nofail 0 0`. Replace `<your-uuid>` and `/mnt/drive` as needed.

## Where this came from

Distilled from working notes in Antigravity conversation `92461444`. The raw note is stream-of-consciousness; this is the claim inside it.
