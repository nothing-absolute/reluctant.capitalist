---
title: "Extract UUIDs from Proto Files"
description: "A Python script can extract conversation IDs (UUID) by parsing the structure: newline character followed by a dollar sign then the UUID. The byte after is '', "
date: "2026-09-24"
tags: ["pythonscript","uuidextraction","definition"]
source: "antigravity://ed987cec-b5ae-4b61-8ac9-7862e843d76c"
draft: false
mechanism: "definition"
signal: 4
from: "ed987cec-b5ae-4b61-8ac9-7862e843d76c"
---

A Python script can extract conversation IDs (UUID) by parsing the structure: newline character followed by a dollar sign then the UUID. The byte after is '', indicating variable-length size data to follow.

## Where this came from

Distilled from working notes in Antigravity conversation `ed987cec`. The raw note is stream-of-consciousness; this is the claim inside it.
