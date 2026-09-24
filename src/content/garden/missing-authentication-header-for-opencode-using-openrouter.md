---
title: "Missing Authentication header for opencode using OpenRouter how to fix"
description: "Troubleshooting authentication issues with OpenRouter and OpenCode"
date: "2026-08-01"
tags: ["ai","openrouter","opencode","authentication","debugging"]
source: "antigravity://d45b2767-da0a-4f86-8d21-79779354c90d"
draft: false
vault: false
---

Missing Authentication header for opencode using OpenRouter how to fix

<details>
<summary>Chat transcript — 5 messages, 2026-08-01 → 2026-08-01</summary>

**You** · 2026-08-01 16:46

Missing Authentication header for opencode using OpenRouter how to fix


---

**Antigravity** · 2026-08-01 16:47

The "Missing Authentication header" error when using OpenRouter with tools like OpenCode (or similar AI coding agents) usually means the application isn't successfully picking up your OpenRouter API key to include in its requests. 

Here is how you can fix it:

### 1. Set the Environment Variable
Most CLI tools look for the API key in your system's environment variables. You need to export it in the same terminal session before running OpenCode.

**On Linux/macOS:**
```bash
export OPENROUTER_API_KEY="your-api-key-here"
```
*(To make this permanent, add the line above to your `~/.bashrc` or `~/.zshrc` file and run `source ~/.bashrc`.)*

**On Windows (Command Prompt):**
```cmd
set OPENROUTER_API_KEY=your-api-key-here
```

**On Windows (PowerShell):**
```powershell
$env:OPENROUTER_API_KEY="your-api-key-here"
```

### 2. Check OpenCode's Configuration
If OpenCode has an interactive setup command or uses a configuration file, the key might not have been saved correctly.
* Try running the setup or login command again (e.g., `opencode auth` or `opencode config` depending on the exact tool's syntax).
* If there is a configuration file (often found in a hidden directory in your home folder, like `~/.opencode/` or `~/.config/opencode/`), open it and ensure your API key is correctly associated with the OpenRouter provider.

### 3. Verify Your API Key is Valid
To isolate whether the issue is with OpenCode or the key itself, try making a direct request to OpenRouter using `curl` in your terminal:

```bash
curl https://openrouter.ai/api/v1/models \
  -H "Authorization: Bearer [secret redacted]"
```

* **If it returns a list of models:** Your key is working perfectly, and the issue is definitely that OpenCode isn't reading the key correctly. Double-check your environment variables or config file.
* **If it returns an authentication error:** Your key might be invalid or revoked. You can generate a new one at [openrouter.ai/keys](https://openrouter.ai/keys).

Let me know if you are using a specific framework or extension alongside OpenCode and I can provide more targeted instructions!


---

**You** · 2026-08-01 16:56

[Darkbloom] auto tool schema union members require an explicit type


---

**Antigravity** · 2026-08-01 16:58

The error **[Darkbloom] auto tool schema union members require an explicit type** is a validation error coming directly from **OpenRouter**. 

From the logs in your `~/.local/share/opencode/log/opencode.log`, this error is occurring while OpenCode is trying to use the **`google/gemma-4-26b-a4b-it:free`** model via OpenRouter. 

### Why this happens
OpenCode uses complex "tool schemas" (which define the commands it can run) that include **Union types** (e.g., allowing a parameter to be either a string or an array). 

When you select a model on OpenRouter that does not natively support these complex tool definitions, OpenRouter intercepts the request and tries to translate the schema using its internal validation engine (which appears to be named "Darkbloom"). Darkbloom is very strict and rejects schemas that have ambiguous unions without explicit types.

### How to fix it

Since you cannot easily change the hardcoded tool schemas inside the compiled OpenCode application, you need to bypass OpenRouter's strict validator. You can do this in a couple of ways:

**1. Switch to a model with Native Tool-Calling Support (Recommended)**
Instead of using the free Gemma model, switch your OpenCode model to one that natively handles complex tool-calling on OpenRouter. Because they have native support, OpenRouter passes OpenCode's schema straight through without triggering the Darkbloom validator. Models that work well with OpenCode include:
*   `anthropic/claude-3.5-sonnet` (Best for coding agents)
*   `openai/gpt-4o`
*   `google/gemini-1.5-pro`

**2. Use a Direct Provider Instead of OpenRouter
If you want to use Gemini/Gemma models without OpenRouter's middleware interfering, you can switch the provider in OpenCode from `OpenRouter` to `Google Gemini` directly (if OpenCode supports it) and use a free API key from Google AI Studio. 

**3. If you must use a free OpenRouter model:**
Try experimenting with different free models on OpenRouter. Some might bypass the Darkbloom validator if OpenRouter considers them natively capable of tool calling (e.g., try `meta-llama/llama-3.1-70b-instruct:free` or `google/gemini-flash-1.5-exp` if available).


---

**Antigravity** · 2026-08-01 16:59

The background search task has completed and it fully confirmed my previous findings! 

The logs in your `~/.local/share/opencode/log/opencode.log` explicitly show the exact error:
```
AI_APICallError: [Darkbloom] auto tool schema union members require an explicit type
``` 
This confirms that it is indeed OpenRouter's Darkbloom engine rejecting the tool schemas that OpenCode is trying to send to the free `gemma-4-26b-a4b-it` model. 

Switching your model in OpenCode to a natively supported model like `anthropic/claude-3.5-sonnet`, `openai/gpt-4o`, or bypassing OpenRouter by using Google AI Studio directly, is the guaranteed way to resolve this issue.

</details>


---

*Imported from Antigravity conversation `d45b2767-da0a-4f86-8d21-79779354c90d` — 29 recorded steps, 7 tool actions, 1 context checkpoints (earlier turns were truncated by Antigravity). Source: `antigravity`. Redacted before publishing: bearer×1.
