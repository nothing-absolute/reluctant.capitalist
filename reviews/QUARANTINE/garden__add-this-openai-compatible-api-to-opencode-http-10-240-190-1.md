---
title: "opencode api integration note"
description: "note about integrating an openai compatible api into opencode"
date: "2026-09-03"
tags: ["antigravity","chat","note","stub"]
source: "antigravity://ad374ebe-6939-4cc3-8077-e12ca6414e87"
draft: true
vault: false
---

add this OpenAI compatible api to opencode: http://10.240.190.108:8080/v1/

<details>
<summary>Chat transcript — 2 messages, 2026-09-03 → 2026-09-03</summary>

**You** · 2026-09-03 15:49

add this OpenAI compatible api to opencode: http://10.240.190.108:8080/v1/

---

**Antigravity** · 2026-09-03 15:53

I have added and enabled the OpenAI-compatible API endpoint `http://10.240.190.108:8080/v1/` in your OpenCode configuration.

### Summary of Changes:
1. **Updated OpenCode Configuration**: Modified [opencode.jsonc](file:///home/jd/.config/opencode/opencode.jsonc):
   - Configured `baseURL` to `http://10.240.190.108:8080/v1` using standard OpenAI-compatible API provider settings (`"api": "openai"`).
   - Added models including `gemma-2-2b-it-abliterated-q4_k_m.gguf` (currently active model on the endpoint) and `moonlight-16b-a3b-instruct-q3_k_s.gguf`.
   - Removed `moonlight` and `privatelm` from `disabled_providers` to activate the provider.

</details>

---

*Imported from Antigravity conversation `ad374ebe-6939-4cc3-8077-e12ca6414e87` — 41 recorded steps, 18 tool actions, 1 context checkpoints (earlier turns were truncated by Antigravity). Source: `antigravity`.*
