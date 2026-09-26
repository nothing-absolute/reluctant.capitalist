# Claude Prompt: OpenDoor Kickstarter Campaign Generation

*Copy and paste the text below directly into Claude (or any other LLM) to generate the final, polished Kickstarter page layout.*

***

**System Role:** You are an expert crowdfunding copywriter and campaign strategist who has raised millions of dollars on Kickstarter for consumer hardware and open-source tech products. 

**Task:** I need you to write the complete, final Kickstarter campaign page for a new hardware product called "OpenDoor." I will provide you with the product blueprint, the reward tiers, and the rough draft of the pitch. Your job is to take this raw information and format it into a highly persuasive, beautifully structured Kickstarter page. 

**Formatting Requirements:**
*   Use standard markdown.
*   Clearly indicate where graphics, GIFs, or lifestyle photos should be placed using brackets (e.g., `[Insert GIF: User swapping the battery]`).
*   Break the page down into the standard highly-converting Kickstarter sections: The Hook, The Problem, The Solution, Deep Dive Features, Engineering Architecture, Tech Specs, Reward Tiers, Timeline, and Team.
*   The tone should be passionate, anti-big-tech, transparent, and highly technical when appropriate to prove to backers that this is not a generic white-labeled product. 

**Product Context (The "OpenDoor"):**
*   **What it is:** A 100% cloud-free, open-source video doorbell. It replaces products like Ring or Nest.
*   **The Hardware:** Rugged, industrial design (matte metal, exposed screws). Powered by an internal battery or an optional integrated solar panel roof. 
*   **The Software:** No subscriptions. Users can record locally to an onboard MicroSD card, or to our optional "OpenBase Station" (a plug-and-play local server hub). It uses a custom mobile app for setup and viewing. Remote access is handled via an End-to-End Encrypted relay so we never see their footage.

**CRITICAL: The Engineering Deep Dive (Make this a major section of the page):**
Backers love transparency and clever engineering. You must highlight these specific technical solutions that make OpenDoor vastly superior to standard DIY builds:
1.  **The AXP2101 PMU:** Normal ESP32 dev boards draw 1.2mA while sleeping. We use a dedicated Power Management Unit to kill power to the camera and SD card, achieving a board-level deep sleep of just **~14µA**. 
2.  **True Solar Viability:** Because our board only consumes 0.5 to 0.8 Wh/day, our integrated 3W monocrystalline solar panel (yielding 2-4 Wh/day) provides indefinite power. The math actually works.
3.  **ESP-NOW Chime Signaling:** Connecting to Wi-Fi from sleep takes 1.5 seconds. We bypass that lag by using an instant local ESP-NOW broadcast to ring the indoor chime in milliseconds, while the Wi-Fi connects in the background.
4.  **Hardware PIR:** We use a Panasonic EKMC low-power PIR sensor as a hardware interrupt so the camera only wakes when a physical heat signature approaches.

**Reward Tiers (Must be included):**
1.  **$15 - The Digital Maker:** All STL and Gerber files for DIY.
2.  **$89 - Standalone Doorbell (Early Bird):** Fully assembled doorbell + indoor Wi-Fi chime.
3.  **$129 - Solar Bundle:** Doorbell + Chime + Custom Solar Panel Mount.
4.  **$199 - The "Local Cloud" Ecosystem:** Doorbell + Chime + OpenBase Station.
5.  **$249 - Hacker Pack:** Everything above + diagnostic faceplate and pre-soldered UART debugging pins.

**The Rough Pitch (Use this as inspiration for the hook):**
"You bought a video doorbell to keep your home safe. But what you actually bought was a surveillance node for a giant tech company, and a subscription fee that never ends. If you stop paying? Your 'smart' doorbell becomes a dumb button. Meet OpenDoor. It’s the first consumer-ready, battery-powered video doorbell that is 100% open-source, runs completely locally, and requires exactly zero subscriptions. You own the hardware, you own the data."

**Output:** Please generate the complete Kickstarter page content from top to bottom.
