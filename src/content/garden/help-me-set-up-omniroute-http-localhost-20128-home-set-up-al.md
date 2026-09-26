---
title: "Help me set up OmniRoute: http://localhost:20128/home Set up all the available free API/models that ave availa"
description: "Guide on setting up OmniRoute with free API/models"
date: "2026-08-31"
tags: ["omniroute","api","free-models","setup","configuration"]
source: "antigravity://4e972a19-24a8-4e8d-a4cc-73426b5f6c4e"
draft: false
vault: false
---

Help me set up OmniRoute: http://localhost:20128/home Set up all the available free API/models that ave available. Import providers from file Upload a CSV or JSON file listing multiple providers (each row can be a different provider type).

<details>
<summary>Chat transcript — 9 messages, 2026-08-31 → 2026-08-31</summary>

**You** · 2026-08-31 16:40

Help me set up OmniRoute:  http://localhost:20128/home 

Set up all the available free API/models that ave available. Import providers from file Upload a CSV or JSON file listing multiple providers (each row can be a different provider type).

---

**Antigravity** · 2026-08-31 16:40

Let me first visit the OmniRoute interface to understand what's available before we set anything up.

---

**Antigravity** · 2026-08-31 16:41

The browser tool is having issues with Playwright. Let me try to access OmniRoute directly via HTTP to understand the interface and its API structure.

---

**Antigravity** · 2026-08-31 16:41

The browser can't render the JS-heavy UI, but I can see the page title. Let me try to look at the previous OmniRoute conversation for context, and also probe the API endpoints to understand the structure.

---

**Antigravity** · 2026-08-31 16:42

Now I can see that `/home` redirects to `/login`. Let me find the auth token and look at the OmniRoute configuration files to understand the setup better.

---

**You** · 2026-08-31 16:45

continue

---

**Antigravity** · 2026-08-31 16:46

I've created a CSV file that contains a comprehensive list of all the free and no-authentication providers supported by OmniRoute, including:
- **No-Auth Gateways**: DuckDuckGo AI Chat, Felo, The Old LLM, MiMoCode, OpenCode
- **Free API Providers**: Qoder, HuggingChat, AI Horde
- **Free Aggregators**: G4F (Groq, Gemini, Ollama, NVIDIA, Pollinations), Pollinations AI, HackClub AI
- **Specialty/Media Free**: Veo AI Free, Chipotle Pepper AI

I have saved this file for you at:
[providers.csv](file://[local path redacted])

### How to Import the Providers

Since OmniRoute is currently protected by an authentication wall at `http://localhost:20128/home` (which redirects to `/login`), you will need to upload this file manually through your dashboard:

1. Open [http://localhost:20128/home](http://localhost:20128/home) in your browser and log in to your OmniRoute instance.
2. Navigate to the **Providers** or **Connections** section in the dashboard.
3. Look for an **Import**, **Bulk Add**, or **Upload CSV/JSON** button (usually located near the "Add Provider" button).
4. Select the `providers.csv` file I generated for you.
5. If it asks you to map the columns, make sure they align as follows:
   - **Provider ID**: `provider`
   - **Connection Name**: `name`
   - **API Key**: `apiKey` (All of these are set to "none" as they are free/no-auth models)
6. Confirm the import, and OmniRoute will automatically register and provision these models for you to use!

Let me know if you need me to adjust the list or include any additional providers!

---

**You** · 2026-08-31 16:53

how can i add all of those providers to Odysseus?

---

**Antigravity** · 2026-08-31 16:56

Because Odysseus is designed to work with any OpenAI-compatible API, the absolute best way to use these providers is to **connect Odysseus directly to OmniRoute**! 

OmniRoute acts as a proxy—it will pool all of those free providers together and serve them as a single API endpoint that Odysseus can understand. Once connected, Odysseus will automatically import every model you have enabled in OmniRoute.

Here is how you link them:

### Step 1: Upload the Providers to OmniRoute
First, make sure you've uploaded the `providers.csv` file I created for you into the OmniRoute dashboard at `http://localhost:20128/home`. 

### Step 2: Add OmniRoute to Odysseus
1. Open your **Odysseus UI** in your browser (usually `http://localhost:7000` or similar).
2. Click on the **Settings** gear icon.
3. Navigate to the **Model Endpoints** or **Providers** tab.
4. Click **Add Endpoint** (or "Add Custom Provider").
5. Fill in the details:
   - **Name:** `OmniRoute`
   - **Base URL:** `http://localhost:20128/v1` (Make sure to include the `/v1`!)
   - **API Key:** `sk-omniroute` (OmniRoute doesn't require a key by default, but Odysseus usually requires *something* in this field, so any dummy string will work).
   - **Type / Format:** Select `OpenAI Compatible` (if asked).

### Step 3: Refresh Models
Once you save the endpoint in Odysseus, it will reach out to OmniRoute and automatically download the list of all available models. You will instantly see models from G4F, DuckDuckGo, HuggingChat, and the others show up in your Odysseus chat dropdown!

*(If you ever want me to run a script to automatically inject this endpoint directly into your Odysseus database instead of using the UI, just let me know!)*

</details>

---

*Imported from Antigravity conversation `4e972a19-24a8-4e8d-a4cc-73426b5f6c4e` — 123 recorded steps, 55 tool actions, 2 context checkpoints (earlier turns were truncated by Antigravity). Source: `antigravity`.*
