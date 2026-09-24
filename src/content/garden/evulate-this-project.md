---
title: "evulate this project"
description: "Evaluation of a drone-based event videography project"
date: "2026-08-03"
tags: ["project-evaluation","drone-technology","event-videography"]
source: "antigravity://60c83a2b-d326-4c30-99a7-349fcf6b4975"
draft: true
vault: false
---

evulate this project

## Assets
- [media__1785765665153.pdf](/antigravity/evulate-this-project/media__1785765665153.pdf) — PDF, 3.1 MB

<details>
<summary>Chat transcript — 2 messages, 2026-08-03 → 2026-08-03</summary>

**You** · 2026-08-03 14:01

evulate this project

---

**Antigravity** · 2026-08-03 14:01

Here is an evaluation of the "SkyCue" project based on the provided campaign page. Overall, the presentation is extremely polished and the concept is highly compelling. However, there are some significant technical and logistical claims that warrant scrutiny.

Here is a breakdown of the project's strengths, weaknesses, and potential risks:

### 1. Concept & Value Proposition
**Rating: Excellent**
*   **The Hook:** Replacing a 15-person camera crew with one operator and an automated drone swarm is a phenomenal value proposition for the high-end event market (weddings, concerts). 
*   **Workflow Automation:** The "Trigger Pods" concept (microphones that automatically dispatch drones when someone speaks) is a brilliant way to solve the problem of managing multiple angles without needing multiple pilots.
*   **The Software Ecosystem (CuTTo):** Building a 3D pre-production planner and a live orchestrator shows that the creators understand the workflow of event videographers, not just the hardware of drones.

### 2. Technical Feasibility
**Rating: Skeptical / High Risk**
While the decision to use a proven open-source stack (ArduPilot, OpenHD, Skybrush, STorM32) significantly reduces software R&D risks, there are several physical and technical claims that push the boundaries of current technology:
*   **Battery Life (The Biggest Red Flag):** The campaign claims 30–45 minutes for the "Vantage" cinewhoop (400-650g) and 40–48 minutes for the "Meridian" heavy lifter. **This is highly unrealistic with current LiPo/Li-ion technology.** A typical cinewhoop gets 5–10 minutes of flight time. A heavy lifter carrying a Blackmagic 6K or Sony FX3 will typically get 10–15 minutes max. Unless there is a breakthrough battery tech involved (the $750k stretch goal mentions a "Hydrogen V2 Prototype", implying standard batteries for the base models), these numbers are physically improbable.
*   **Indoor Positioning & Environment:** Using UWB (Ultra-Wideband) anchors fused with optical flow is the correct approach for indoor autonomous flight. However, relying on optical flow in dark, dynamic environments (like a dimly lit wedding reception with flashing dance lights) is famously unreliable. Furthermore, maintaining line-of-sight for 4-6 UWB anchors in a room full of moving guests can lead to multipath interference and positioning dropouts.
*   **Noise:** A heavy lifter drone carrying a cinema camera is incredibly loud, as is a high-RPM cinewhoop. Having a fleet of these flying around during an intimate wedding ceremony or speeches could ruin the atmosphere and the audio recordings.
*   **RF Congestion:** Achieving ~100ms video latency across multiple drones simultaneously using OpenHD in a venue crowded with hundreds of guest smartphones and venue WiFi will require serious RF management to avoid interference.

### 3. Business Model & Pricing
**Rating: Strong but Margin-Risky**
*   **Operator Economics:** The pitch to videographers is very strong. Earning $4,000–$6,000 per event means the ROI on a $1,500 – $15,000 kit is incredibly fast.
*   **Tier Pricing:** The entry-level pricing seems suspiciously low. The **$1,499 Vantage Starter Kit** includes the drone, an action pod, 4 UWB anchors, a ground hub, a charging station, 2 trigger pods, and 2 landing pads. Given the cost of high-quality UWB anchors, computing hubs, and the drone itself, this leaves almost no margin for manufacturing and support, increasing the risk of the project failing to deliver.

### 4. Safety, Regulatory & Liability
**Rating: Well-Addressed but Challenging**
*   The campaign proactively addresses the "elephant in the room" (drone safety) excellently. Implementing geofences, "No Flight Over Crowds", and auto-landing failsafes shows maturity.
*   While they note that operators must be FAA Part 107 certified, the FAA does not actually regulate indoor airspace. The real hurdle here will be **Venue Permission and Insurance**. Many luxury venues flat-out ban drones indoors due to liability. The inclusion of "$1M Liability Insurance" via the rental/lease program is a smart move to counter this, but it will still be an uphill battle getting venue coordinators to agree to a "swarm of drones" flying over their tables.

### Summary
SkyCue is pitched beautifully and targets a very lucrative, real-world problem for event videography. The ecosystem they have designed (from pre-viz software to hot-swap stations) is incredibly well thought out.

However, as an investor or backer, **the flight time claims and the acoustic noise problem are the two biggest obstacles.** If the creators can prove that their heavy-lifter can actually fly for 45 minutes indoors without drowning out the wedding vows, it’s a game-changer. If those numbers are exaggerated, the continuous swapping of batteries every 8 minutes will break the "One Operator" illusion very quickly.

</details>

---

*Imported from Antigravity conversation `60c83a2b-d326-4c30-99a7-349fcf6b4975` — 5 recorded steps, 1 context checkpoints (earlier turns were truncated by Antigravity). Source: `antigravity`.
