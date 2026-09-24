---
title: "Find OmniRoute free providers (@general subagent)"
description: "I need to research what free LLM providers OmniRoute supports. Please do the following:"
date: "2026-08-31"
draft: true
tags: ["opencode","session"]
source: "opencode://eager-circuit"
---
**What this is:** an opencode working session — 22 messages.

**When:** 2026-08-31 · **Working directory:** `/home/jd/Prototypes`

**Opened with:**

> I need to research what free LLM providers OmniRoute supports. Please do the following:
>
> 1. Query the OmniRoute database for all known provider types:
>    `sqlite3 /home/jd/.omniroute/storage.sqlite "SELECT DISTINCT provider_type FROM provider_connections;" 2>/dev/null`
>
> 2. Query for the full provider connection details:
