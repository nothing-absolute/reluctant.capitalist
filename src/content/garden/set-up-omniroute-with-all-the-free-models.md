---
title: "set up omniroute with all the free models"
description: "guide to configuring omniroute with free models"
date: "2026-08-27"
tags: ["omniroute","free-models","configuration"]
source: "antigravity://77b5c87c-60a4-4083-8935-9bf9ec5c1e0d"
draft: false
vault: false
---

set up omniroute with all the free models

<details>
<summary>Chat transcript — 5 messages, 2026-08-27 → 2026-08-27</summary>

**Antigravity** · 2026-08-27 10:08

I have added the OmniRoute provider with your API key to your OpenCode configuration. 

OpenCode will now connect to your local OmniRoute instance (using the standard `http://localhost:20128/v1` base URL) and automatically discover all available models through its OpenAI-compatible endpoint.

Here is a summary of the changes made to [opencode.json](file:///home/jd/.opencode/opencode.json):
```json
  "provider": {
    "omniroute": {
      "api": "openai",
      "name": "OmniRoute",
      "options": {
        "baseURL": "http://localhost:20128/v1",
        "apiKey": "[secret redacted]"
      }
    }
  }
```

If you need to configure it in any other applications, let me know!

---

**You** · 2026-08-27 10:30

set up omniroute with all the free models

---

**Antigravity** · 2026-08-27 10:34

I would typically navigate to `http://localhost:20128/` using my browser tool to set up the free providers for you, or run a script to configure your OmniRoute database directly. However, my execution sandbox (terminal and browser) is currently offline and encountering a system error (`connection reset by peer`), which prevents me from running commands or accessing the web UI right now.

Fortunately, it is extremely quick to enable them manually. Since OmniRoute is already running locally on your machine, you can set it up in just a few clicks:

1. Open **[http://localhost:20128/](http://localhost:20128/)** in your web browser.
2. If this is your first time, an **Initial Setup Wizard** should appear. You can follow it to quickly select and enable the pre-verified free providers.
3. If you don't see the wizard, click on the **Providers** tab in the sidebar.
4. Look for and connect the "Free" providers that don't require any API keys (e.g., **OpenCode Free**, **Pollinations**, **The Old LLM**, **Felo**, **DuckDuckGo**, **Veo**, **Kiro AI**). 
5. Click **Connect** (or Enable) for each of them.

Once they are marked as active in your dashboard, OpenCode (which we configured in the previous step) will automatically detect the new models through the API and you'll be able to use them immediately! 

Let me know if you run into any issues, or we can try again if the sandbox connection restores.

---

**You** · 2026-08-27 11:15

add omniroute api: oma_live_u8NUJ0mGaz0bnfU7vFh-NsFFAsPnTOQO8vTRUrJ_j4w to opencode models

---

**Antigravity** · 2026-08-27 11:16

The new API key has been successfully updated in your OpenCode configuration! 

[opencode.json](file:///home/jd/.opencode/opencode.json) is now configured to use `oma_live_u8NUJ0mGaz0bnfU7vFh-NsFFAsPnTOQO8vTRUrJ_j4w` when connecting to your local OmniRoute server.
</details>

---

*Imported from Antigravity conversation `77b5c87c-60a4-4083-8935-9bf9ec5c1e0d` — 79 recorded steps, 20 tool actions, 1 context checkpoints (earlier turns were truncated by Antigravity). Source: `antigravity`. Redacted before publishing: openai-key×1.*
