---
title: "Design a drone camera set up for special events: Birthdays, Anniversaries, Weddings"
description: "Proposal for a multi-drone event cinematography system with automation and failsafe features"
date: "2026-08-02"
tags: ["drone","cinematography","event-tech"]
source: "antigravity://b185063d-a0ed-410e-8f5c-a4f3465c4e99"
draft: false
vault: false
---

Design a drone camera set up for special events: Birthdays, Anneversaries, Weddings, Graduation, Concerts, ect. This would be a multiple drone linked together. The operator will use a touchscreen tablet or laptop for running certain operations. There is some way for notifiying a drone who their camera should be focused on. For example at a wedding: the wedding party or head table would have a onmni directional microp

## AeroFrame Business Concept

## 🎬 AeroFrame — Autonomous Multi-Drone Event Cinematography Platform

> *Hollywood-grade camera coverage for every occasion. Operated by one person.*

---

## Table of Contents
1. [Concept Overview](#1-concept-overview)
2. [System Architecture](#2-system-architecture)
3. [Hardware Specifications — Two Drone Tiers](#3-hardware-specifications)
4. [Trigger System — Microphone & IoT Button](#4-trigger-system)
5. [Battery Management & Failsafe System](#5-battery-management--failsafe-system)
6. [Control Station](#6-control-station)
7. [Fleet Software Stack](#7-fleet-software-stack)
8. [Hardware Cost Sheet](#8-hardware-cost-sheet)
9. [Market Analysis & Value Proposition](#9-market-analysis--value-proposition)
10. [Regulatory Considerations](#10-regulatory-considerations)
11. [Go-to-Market Strategy](#11-go-to-market-strategy)
12. [Kickstarter / Indiegogo Campaign](#12-kickstarter--indiegogo-campaign)
13. [Franchise, License & Lease Program](#13-franchise-license--lease-program)
14. [Subscription Webapp — Stretch Goal](#14-subscription-webapp--stretch-goal)
15. [Live Streaming & Virtual Guest System](#15-live-streaming--virtual-guest-system)
16. [Open Source & Open Hardware Leverage](#16-open-source--open-hardware-leverage)
17. [Concept Evaluation & Risk Analysis](#17-concept-evaluation--risk-analysis)

---

## 1. Concept Overview

**AeroFrame** is a modular, autonomous multi-drone cinematography platform designed for special events — weddings, birthdays, anniversaries, graduations, concerts, and corporate events. The system replaces a camera crew of 15 with one operator, delivering crane-quality, multi-angle, cinematic coverage that has never before been accessible to everyday events.

### Core Value Proposition

| Traditional Film Crew | AeroFrame System |
|---|---|
| 8–15 camera operators | 1 operator |
| $8,000–$25,000 per event | $500–$2,500 per event (operator pricing) |
| Heavy jib/crane rental: $700–$1,500/day + operator | No crane rental needed |
| Fixed ground-level angles | 3D aerial + ground convergence |
| Hours of complex coordination | Pre-programmed via tablet in minutes |

### System Pillars
- **Modularity** — Number of drones, microphones, camera angles, and flight paths are all fully customizable per event
- **Automation** — Trigger-based drone dispatch via IoT microphone buttons or voice activation
- **Pre-production** — Venue-mapped camera angles programmed during setup
- **Failsafe-first** — Autonomous battery management, collision avoidance, return-to-home
- **Scalability** — From 2-drone birthday parties to 12-drone concert productions

---

## 2. System Architecture

```
┌─────────────────────────────────────────────────────────────────┐
│                    AEROFRAME SYSTEM                              │
│                                                                 │
│  ┌──────────────┐    ┌──────────────┐    ┌──────────────┐       │
│  │  Trigger     │    │  Fleet       │    │  Control     │       │
│  │  Network     │───▶│  Management  │───▶│  Station     │       │
│  │  (IoT/Mic)   │    │  Server      │    │  (Tablet/PC) │       │
│  └──────────────┘    └──────┬───────┘    └──────────────┘       │
│                             │                                   │
│                    ┌────────▼────────┐                          │
│                    │  MAVLink / ROS2 │                          │
│                    │  Radio Mesh     │                          │
│                    └────────┬────────┘                          │
│                             │                                   │
│        ┌────────────────────┼────────────────────┐             │
│        │                    │                    │             │
│   ┌────▼────┐         ┌─────▼─────┐        ┌────▼────┐        │
│   │ Drone 1 │         │  Drone 2  │        │ Drone N │        │
│   │ Tier 1  │         │  Tier 2   │        │ Tier 1/2│        │
│   └─────────┘         └───────────┘        └─────────┘        │
└─────────────────────────────────────────────────────────────────┘
```

### How an Event Works — Wedding Example

1. **Pre-Production (day before):** Operator visits venue with tablet. Maps the space using overhead photo. Programs 8–12 named camera positions (e.g., "Altar Front", "Table 3 Head", "Dance Floor Overhead") with GPS/visual anchors.
2. **Day-of Setup (2 hrs before):** Drones initialized, triggers placed on tables. Each trigger assigned to a named flight path. Battery levels confirmed.
3. **During the event:** A guest at the head table presses the button on the omnidirectional microphone centerpiece. The nearest available drone flies to the pre-mapped "Head Table" angle, begins recording. The operator sees this on the tablet and can override, redirect, or chain to a second angle.
4. **Autonomous Battery Swap:** When a drone hits 30% battery, it flags on the operator's tablet. At 15%, it automatically returns to the landing pad. The operator hot-swaps a pre-charged battery and relaunches.
5. **Post-Event:** All footage synced to a shared NAS or cloud drive, tagged by trigger event + timestamp.

---

## 3. Hardware Specifications

### Tier 1 — "AeroFrame Lite" (Compact / Budget)

**Target use:** Birthdays, small anniversaries, intimate graduations, indoor receptions.
**Goal:** Smallest possible drone that still delivers excellent video quality.

**Recommended Off-the-Shelf (Phase 1):** DJI Mini 4 Pro
- Weight: 249g (under FAA registration threshold)
- Camera: 1/1.3" CMOS, 4K/60fps HDR
- Flight time: 34 min (standard), 45 min (Intelligent Flight Battery Plus)
- Wind resistance: Level 5
- Obstacle avoidance: Multi-directional
- Price: ~$760 (drone only), ~$960 (Fly More Combo)

**Custom Open Hardware Path (Phase 2):**
- Frame: 3" – 5" custom carbon fiber (Thingiverse: multiple compact cinema frames)
- Flight Controller: Holybro Kakute H7 Mini (~$35)
- Flight Software: ArduPilot Copter (free, open source)
- Camera: RunCam 4K Thumb (~$80) or GoPro Hero 12 Black (~$350)
- Gimbal: 3-axis micro gimbal (Tarot TL3T02 ~$60)
- Companion Computer: Raspberry Pi Zero 2W (~$15) for MAVLink relay + IoT trigger reception
- Battery: 4S 2200mAh LiPo (~$25), ~18–22 min flight time
- Build cost estimate: **$380–$620 per unit**

---

### Tier 2 — "AeroFrame Pro" (Professional / Cinema)

**Target use:** Weddings, concerts, corporate galas, large graduation ceremonies.
**Goal:** Highest possible video quality with extended operational time.

**Recommended Off-the-Shelf (Phase 1):** DJI Inspire 3
- Camera: Zenmuse X9-8K (full-frame, 8K RAW video)
- Flight time: 28 min (with X9 camera)
- Wind resistance: Level 7
- Speed: 94 km/h
- Obstacle avoidance: Omnidirectional
- Price: **~$16,000 bundle** (Inspire 3 + X9 Camera + accessories)

**Mid-Range Alternative (Phase 1):** DJI Matrice 350 RTK + Zenmuse H30T
- Flight time: 55 min (dual battery)
- Payload: 2.7 kg
- IP55 weatherproof rating
- Price: ~$6,200 base, ~$10,000–$14,000 equipped

**Custom Open Hardware Path (Phase 2):**
- Frame: Heavy-lift 7" octacopter, custom carbon fiber
- Flight Controller: Cube Orange+ (~$280) — military-grade, ArduPilot compatible
- Companion Computer: NVIDIA Jetson Orin Nano (~$250) for computer vision, AI tracking, MAVLink bridge
- Camera: Sony FX3 (mirrorless, 4K 120fps) via custom mount (~$3,800) — or RED Komodo-X (~$7,950)
- Gimbal: Gremsy S1V3 (~$1,200) — industry standard for heavy cameras
- Motors: T-Motor MN501-S KV360 (~$80 each × 8 = $640)
- ESCs: Flame 60A HV (~$50 each × 8 = $400)
- Battery: 6S 15,000–22,000mAh LiPo, ~35–45 min flight time
- Build cost estimate: **$7,500–$14,000 per unit** (camera dependent)

**Battery Life Extended Option:**
- 8-hour continuous flight is not achievable with LiPo technology. Best approach:
  - **Multi-battery rotation:** 3–4 batteries per drone, charging station at operator area
  - **Hydrogen fuel cell add-on** (future): Heven Drones H2D250 platform achieves 7–8 hrs with HFC
  - **Recommendation for launch:** 4-battery rotation with ~40-min flight, ~20-min charge = near-continuous event coverage with 2 batteries charging at all times

---

## 4. Trigger System

### Design: Smart Omnidirectional Table Centerpiece

Each table at the event gets a centerpiece-style unit that contains:

1. **Omnidirectional MEMS Microphone Array** — picks up ambient audio + voice commands
2. **Physical Illuminated Button** — momentary press dispatches a drone
3. **ESP32-S3 Microcontroller** — IoT WiFi/BLE bridge to the fleet management server
4. **LED Status Ring** — shows if a drone is assigned, en-route, or unavailable
5. **USB-C Charging** — powered by a small LiPo or standard USB power bank
6. **3D Printed Housing** — designed in Thingiverse-compatible STL format for easy customization

### Trigger Logic

```
PRESS BUTTON / VOICE TRIGGER
         │
         ▼
Fleet Manager checks drone availability
         │
    ┌────▴────┐
    │Available│
    └────┬────┘
         │
Fleet Manager selects nearest idle drone
         │
         ▼
Drone dispatched to pre-mapped angle for that trigger ID
         │
         ▼
LED ring at trigger turns GREEN (drone on the way)
         │
         ▼
Operator notified on tablet: "[Drone 3] → [Head Table Angle]"
         │
         ▼
Operator can: [Override] [Extend] [Redirect] [Recall]
```

### Trigger Hardware BOM (per unit)

| Component | Source | Est. Cost |
|---|---|---|
| ESP32-S3-DevKitC-1 | Mouser / AliExpress | $8 |
| INMP441 I2S MEMS Mic | AliExpress | $3 |
| Momentary illuminated button | Adafruit | $5 |
| WS2812B LED ring (12px) | AliExpress | $4 |
| 3D Printed housing | In-house | $8 (materials) |
| 18650 LiPo + TP4056 charger | AliExpress | $6 |
| PCB (custom via JLCPCB) | JLCPCB | $5 (min order 5) |
| **Total per trigger unit** | | **~$39** |

### Voice Trigger (Optional Advanced Feature)
Using **Picovoice Porcupine** wake word engine on the ESP32-S3, a custom wake phrase like *"AeroFrame, go to table"* activates the nearest drone without requiring a button press. This is particularly valuable for hands-free operation.

---

## 5. Battery Management & Failsafe System

### Battery Status Dashboard (Control Station)

Each drone continuously broadcasts battery % via telemetry to the fleet management server, displayed as a live tile on the operator's tablet:

```
┌─────────────────────────────────────┐
│  DRONE 2 — Pro Unit                 │
│  Battery: ████████░░░░  62%          │
│  Status: ACTIVE → [Head Table]      │
│  ETA to 30%: ~14 min               │
│  [Recall Now] [Schedule Recall]     │
└─────────────────────────────────────┘
```

### Failsafe Thresholds (Configurable)

| Battery Level | Action |
|---|---|
| 30% | Operator **notification** — "Battery low on Drone X" |
| 20% | Operator **urgent alert** — audible chime + red tile |
| 15% | **Automatic RTH (Return to Home)** — drone cancels current task, flies to landing pad regardless of operator action |
| 10% | Emergency landing at current location (if RTH journey would exceed battery) |

### Landing Pad Design
- Dedicated "AeroFrame Base Station" mat with ArUco marker for precise visual landing
- Charges 4 batteries simultaneously (AC-powered)
- Each slot has LED status: Charging / Full / In-use
- Drone lands on its assigned pad marker automatically

### Battery Rotation Protocol
For an 8-hour wedding event with Tier 2 drones (40-min flights):
- **Minimum:** 3 batteries per drone (1 in drone, 2 charging)
- **Recommended:** 4 batteries per drone (1 in drone, 3 in rotation)
- Smart charger set to **storage/cycle mode** between events

---

## 6. Control Station

### Hardware

**Recommended (Phase 1):**
- **Tablet:** Samsung Galaxy Tab S9 Ultra (14.6" AMOLED touchscreen) — ~$1,100
- **Telemetry Radio:** mRo SiK Telemetry Radio V2 (915MHz, 1km+ range) — ~$60/pair
- **WiFi Router:** GL.iNet Flint 2 (WiFi 6, mesh, runs OpenWrt) — ~$90 — creates the isolated event network for all drones + triggers
- **Laptop (Backup/Secondary):** Any Windows/Mac laptop running QGroundControl or custom AeroFrame GCS

### Ground Control Software (Phase 1 — Open Source Base)
- **QGroundControl (QGC):** Free, open-source GCS that works with ArduPilot/PX4. Supports multiple vehicle management, waypoints, and telemetry overlays. Runs on Windows, Mac, Linux, Android, iOS.
- **Mission Planner:** Windows-based advanced GCS for ArduPilot — deep parameter access and scripting.

### Custom AeroFrame GCS Layer (Phase 2 — Built on top of QGC)
A branded tablet app (React Native or Flutter) wrapping the core functionality:
- Visual event map with drone positions shown in real-time
- One-tap camera angle assignment
- Drag-and-drop flight path editing
- Trigger unit management (assign table → angle)
- Battery status dashboard
- Live feed preview from each drone's camera
- Export/sync to cloud storage

---

## 7. Fleet Software Stack

### Open-Source Foundation

| Layer | Technology | License |
|---|---|---|
| Flight Stack | ArduPilot Copter | GPL-3.0 (free) |
| Communication Protocol | MAVLink v2 | MIT (free) |
| Swarm Orchestration | Custom MAVLink server + ROS 2 | Custom built on open source |
| Ground Control Base | QGroundControl | Apache 2.0 (free) |
| Drone Show Framework | Skybrush (adapted) | GPL (free) |
| IoT Trigger Firmware | ESP-IDF / Arduino framework | Apache 2.0 (free) |
| Voice Wake Word | Picovoice Porcupine | Free tier available |

### Fleet Manager Logic
A lightweight Python/Node.js server (runs on the control tablet or a Raspberry Pi 5 at the base station) handles:
- Drone state machine (idle, tasked, returning, charging, fault)
- Trigger → angle → drone assignment algorithm
- Priority queue (e.g., ceremony triggers override reception triggers)
- Conflict resolution (two triggers fire simultaneously)
- Logging all events with timestamps (useful for post-production sync)

---

## 8. Hardware Cost Sheet

### Tier 1 — AeroFrame Lite System

#### Phase 1: Off-the-Shelf (Validation & First Batch)

| Item | Qty | Unit Cost | Total |
|---|---|---|---|
| DJI Mini 4 Pro (Fly More Combo) | 3 | $960 | $2,880 |
| DJI Smart Controller (RC-N1) | 1 | $350 | $350 |
| Samsung Galaxy Tab S9+ (Control) | 1 | $800 | $800 |
| mRo SiK Telemetry Radio Pair | 2 | $60 | $120 |
| GL.iNet Flint 2 WiFi Mesh Router | 1 | $90 | $90 |
| AeroFrame Trigger Units (Prototype) | 6 | $39 | $234 |
| Base Station Charging Mat (DIY) | 1 | $150 | $150 |
| Carrying/Pelican-style Cases | 2 | $80 | $160 |
| Spare Batteries (DJI Intelligent) | 6 | $65 | $390 |
| **Subtotal** | | | **$5,174** |

> [!NOTE]
> The DJI Mini 4 Pro uses DJI's proprietary OcuSync 4.0 — integrating it into an open MAVLink swarm requires DJI's Mobile SDK or a Mobile SDK Bridge, which adds software development complexity. An alternative is the Autel EVO Nano+ which is more open to third-party integration.

#### Phase 2: Custom Open Hardware (Lite)

| Item | Qty | Unit Cost | Total |
|---|---|---|---|
| Custom 5" carbon fiber frame | 3 | $45 | $135 |
| Holybro Kakute H7 Mini FC | 3 | $35 | $105 |
| RunCam Thumb Pro 4K | 3 | $95 | $285 |
| Tarot TL3T02 3-axis micro gimbal | 3 | $65 | $195 |
| Raspberry Pi Zero 2W (companion) | 3 | $15 | $45 |
| 4S 2200mAh LiPo × 3 each | 9 | $25 | $225 |
| Motors, ESCs, props | 3 sets | $60 | $180 |
| FPV transmitter (video preview) | 3 | $25 | $75 |
| Samsung Tab S9+ (Control) | 1 | $800 | $800 |
| GL.iNet Flint 2 Router | 1 | $90 | $90 |
| AeroFrame Trigger Units | 6 | $39 | $234 |
| Base Station + 4-port charger | 1 | $150 | $150 |
| **Subtotal (3 drones)** | | | **~$2,519** |

---

### Tier 2 — AeroFrame Pro System

#### Phase 1: Off-the-Shelf (Validation & First Batch)

| Item | Qty | Unit Cost | Total |
|---|---|---|---|
| DJI Inspire 3 (Full Bundle) | 2 | $16,000 | $32,000 |
| DJI RC Plus Controller | 2 | $1,200 | $2,400 |
| DJI TB51 Intelligent Batteries ×4 | 8 | $500 | $4,000 |
| Samsung Galaxy Tab S9 Ultra (Control) | 1 | $1,100 | $1,100 |
| mRo SiK Telemetry Radio | 2 | $60 | $120 |
| GL.iNet Flint 2 WiFi Router | 1 | $90 | $90 |
| AeroFrame Trigger Units | 8 | $39 | $312 |
| Pelican 1650 Case ×2 | 2 | $280 | $560 |
| Battery Charging Station (6-port) | 1 | $350 | $350 |
| **Subtotal** | | | **~$40,932** |

> [!IMPORTANT]
> The DJI Inspire 3 at $16K each is the gold standard for wedding cinema quality. A more accessible alternative for Phase 1 could be the **DJI Matrice 350 RTK + Zenmuse H30** at ~$10,000–$12,000 per unit. This still delivers stunning 4K footage at roughly 60% of the cost.

**Mid-Range Alternative — Phase 1:**

| Item | Qty | Unit Cost | Total |
|---|---|---|---|
| DJI Matrice 350 RTK | 2 | $6,200 | $12,400 |
| Zenmuse H30 Camera | 2 | $5,200 | $10,400 |
| TB65 Batteries ×4 per drone | 8 | $380 | $3,040 |
| Samsung Galaxy Tab S9 Ultra | 1 | $1,100 | $1,100 |
| AeroFrame Trigger Units | 8 | $39 | $312 |
| Accessories + Cases | 1 | $800 | $800 |
| **Subtotal** | | | **~$28,052** |

#### Phase 2: Custom Open Hardware (Pro)

| Item | Qty | Unit Cost | Total |
|---|---|---|---|
| Heavy-lift 7" octocopter frame | 2 | $350 | $700 |
| Cube Orange+ Flight Controller | 2 | $280 | $560 |
| NVIDIA Jetson Orin Nano (companion) | 2 | $250 | $500 |
| Sony FX3 Cinema Camera | 2 | $3,800 | $7,600 |
| Gremsy S1V3 Gimbal | 2 | $1,200 | $2,400 |
| T-Motor MN501-S × 8 per drone | 16 | $80 | $1,280 |
| Flame 60A HV ESCs × 8 per drone | 16 | $50 | $800 |
| 6S 22,000mAh LiPo × 4 per drone | 8 | $180 | $1,440 |
| Power distribution + wiring | 2 sets | $80 | $160 |
| Samsung Tab S9 Ultra | 1 | $1,100 | $1,100 |
| GL.iNet Flint 2 Router | 1 | $90 | $90 |
| AeroFrame Trigger Units | 8 | $39 | $312 |
| 6-port smart battery charger | 1 | $350 | $350 |
| Carbon fiber cases | 2 | $350 | $700 |
| **Subtotal (2 Pro drones)** | | | **~$18,992** |

---

### Complete Starter Kit Estimates

| Package | Configuration | Est. Hardware Cost |
|---|---|---|
| **AeroFrame Lite Starter** | 3× Lite drones, 6 triggers, control station | $5,174 (off-shelf) / $2,519 (DIY) |
| **AeroFrame Pro Starter** | 2× Pro drones, 8 triggers, control station | $40,932 (Inspire 3) / $28,052 (Matrice) |
| **AeroFrame Hybrid** | 1× Pro + 3× Lite, 10 triggers, control station | ~$22,000 (mid-range) |
| **AeroFrame Full Event Kit** | 2× Pro + 4× Lite, 12 triggers, full station | ~$35,000 (mixed off-shelf) |

---

## 9. Market Analysis & Value Proposition

### Market Size
- Global event photography/videography market: **$9.05B (2025)** → **$15.22B (2032)** at 7.7% CAGR
- US wedding market: Part of a $356B industry growing at 13.5% CAGR
- Average US wedding videography spend: **$2,300–$2,500**
- Professional drone videography: **$800–$3,000/event** (single drone, single operator)

### AeroFrame's Competitive Gap
There is currently **no mainstream multi-drone automated event cinematography product** on the market. The landscape is:
- **Human-piloted cinema drones:** $2,000–$7,000/event (DJI Inspire 3-class)
- **Drone light show companies:** $50,000+/event (not for cinematography)
- **Traditional camera crews:** $8,000–$25,000 for full multi-angle coverage

**AeroFrame fills a completely open niche:** Automated, multi-angle, aerial cinematography at $2,000–$5,000/event pricing (operator's choice), delivered by a single trained operator.

### Operator ROI Example (AeroFrame Hybrid Kit)
- Kit cost: ~$22,000
- Events per month: 4–6
- Price per event: $2,500
- Monthly revenue: $10,000–$15,000
- Break-even: **~2.5 months of full bookings**

---

## 10. Regulatory Considerations

### Outdoor Events (Weddings, Concerts, Graduation)
- **FAA Part 107 Remote Pilot Certificate** required for commercial drone operation (paid events)
- Part 107 exam: ~$175 test fee, ~40 hrs of study
- Cannot fly directly over crowds without a **Part 107 Waiver** (Category 1 drones under 250g can fly over people)
- **TFR Awareness:** Stadiums have 3-nautical-mile no-fly zones during games — concerts may have temporary TFRs
- **Venue Approval:** Written permission from venue required
- **Liability Insurance:** Minimum $1M coverage recommended; specialized drone event insurance: ~$300–$600/year

### Indoor Events
- FAA regulations **do not apply** indoors
- Require venue fire marshal approval
- Specialized liability insurance still recommended
- Ceiling height minimum: 10–12 feet for stable hover (Tier 1); 14+ feet (Tier 2)

### Recommendation
- Tier 1 AeroFrame Lite (249g) qualifies as **Category 1** — can fly over people outdoors without waiver, dramatically simplifying regulatory compliance
- Operators should form an LLC and maintain drone operator liability insurance

---

## 11. Go-to-Market Strategy

### Phase 1 — Proof of Concept (Months 1–6)
- Build 1× AeroFrame Hybrid kit using off-the-shelf hardware
- Film 3–5 "hero" demonstration events (volunteer/friend weddings, a local concert)
- Produce a 3-minute demo reel optimized for YouTube/Instagram/TikTok
- Launch crowdfunding campaign (see Section 12)

### Phase 2 — First Batch (Months 7–18)
- Fulfill crowdfunding backers with off-the-shelf configured kits
- Begin development of custom firmware + AeroFrame GCS app
- Onboard first 10–20 photographer licensees (see Section 13)

### Phase 3 — Custom Hardware (Months 19–36)
- Launch custom AeroFrame drone hardware (Phase 2 builds)
- Release branded AeroFrame GCS app (iOS, Android, Windows)
- Launch subscription webapp for client pre-planning
- Expand license/franchise network

### Phase 4 — Scale (Months 37+)
- Corporate event market (tech conferences, product launches)
- Music venue partnerships
- International licensing
- Explore hydrogen fuel cell integration for 8-hour runtimes

---

## 12. Kickstarter / Indiegogo Campaign

### Campaign Title
**AeroFrame: One Operator. Hollywood Cameras. Your Event.**

### Campaign Goal: $150,000

### Funding Tiers

| Tier | Name | Price | What You Get | Limit | Est. Backers |
|---|---|---|---|---|---|
| 🙏 | **Believer** | $5 | Behind-the-scenes updates, digital backer badge | Unlimited | 500–1,000 |
| 🎬 | **Director's Cut** | $25 | Exclusive AeroFrame hat + sticker pack + all updates | 500 | 300–500 |
| 📱 | **Early Access App** | $79 | 1-year free access to AeroFrame Planning Webapp (when launched) | 250 | 100–200 |
| 🚁 | **Trigger Pack Early Bird** | $149 | Set of 4 AeroFrame Trigger Units (IoT button/mic centerpieces) | 100 | 75–150 |
| 🎓 | **Lite Solo — Early Bird** | $2,499 | 1× AeroFrame Lite drone configured kit + 4 trigger units + control app | 50 | 30–50 |
| 💍 | **Lite 3-Pack — Photographer** | $5,999 | 3× AeroFrame Lite drones + 8 triggers + control station tablet + 1-yr app | 30 | 15–30 |
| 🎺 | **Pro Hybrid Kit — Early Bird** | $19,999 | 1× Pro + 3× Lite drones + 12 triggers + full control station + 2-yr app | 10 | 5–10 |
| 👑 | **Founding Partner** | $9,999 | 1× licensed territory + Lite 3-Pack kit + training + revenue sharing deal | 5 | 3–5 |

### Projected Funding Breakdown

| Tier | Backers | Revenue |
|---|---|---|
| Believer ($5) | 800 | $4,000 |
| Director's Cut ($25) | 400 | $10,000 |
| Early Access App ($79) | 180 | $14,220 |
| Trigger Pack ($149) | 100 | $14,900 |
| Lite Solo ($2,499) | 45 | $112,455 |
| Lite 3-Pack ($5,999) | 20 | $119,980 |
| Pro Hybrid ($19,999) | 7 | $139,993 |
| Founding Partner ($9,999) | 5 | $49,995 |
| **Total** | **1,557** | **~$465,543** |

> [!TIP]
> **Recommendation:** Set a conservative $150,000 goal but plan to hit $350,000+. Use Indiegogo's InDemand feature (after campaign ends) to continue selling indefinitely, which is critical for camera/drone hardware that benefits from ongoing sales.

### Campaign Content Strategy
1. **Hero Video (3 min):** Show a wedding from setup → event → final edit. Contrast with a $20K film crew.
2. **Comparison shots:** Side-by-side with traditional jib/crane angles.
3. **Creator stories:** Wedding photographer testimonials.
4. **Stretch Goals:**
   - $200K: AeroFrame mobile app (iOS + Android)
   - $300K: Custom-built AeroFrame Lite drone hardware
   - $500K: Subscription webapp launch (client pre-planning)
   - $750K: Hydrogen fuel cell battery module (8-hour flight)

---

## 13. Franchise, License & Lease Program

### Program Name: **AeroFrame Creator Network**

The goal is to get AeroFrame systems into the hands of professional photographers and videographers quickly, creating a community of power users that generate word-of-mouth, beta test software updates, and provide real-world feedback.

### Three Tiers of Access

---

#### Tier A — Rental Trial Program
*"Try before you commit"*

- **Cost:** $400–$800/weekend rental (AeroFrame Hybrid kit)
- **Includes:** Pre-configured kit, 4 hrs of remote support, training video library
- **Operator receives:** 100% of event revenue
- **Duration:** 1–3 event weekends
- **Goal:** Conversion to Lease or License within 90 days
- **Logistics:** Shipped in Pelican cases with pre-paid return label; deposit held ($2,000 refundable)

---

#### Tier B — Lease-to-Own Agreement
*"Build your business, own your tools"*

- **Kit:** AeroFrame Lite 3-Pack or Pro Hybrid
- **Down payment:** $500–$2,000
- **Monthly payment:** $350–$900/month (24–36 month term, depending on kit)
- **At end of term:** Full ownership transferred
- **Includes:** Software updates, remote support, replacement part program
- **Revenue share:** None — operator keeps 100% of event revenue
- **Insurance requirement:** Operator maintains drone liability insurance ($1M min)

| Kit | MSRP | Monthly (36 mo) | Total Paid |
|---|---|---|---|
| Lite 3-Pack | $7,999 | $260 | $9,360 |
| Pro Hybrid | $24,999 | $800 | $28,800 |

---

#### Tier C — Licensed Territory Program
*"Own your market"*

- **License fee:** $15,000–$25,000 upfront (one-time, includes Lite 3-Pack kit)
- **Territory:** Exclusive protected geographic area (typically 60–80 mile radius)
- **Royalty:** 6% of gross event revenue per month
- **Includes:**
  - Complete AeroFrame Hybrid Kit
  - 40-hour training program (hardware, software, FAA Part 107 prep)
  - Branded marketing materials
  - Client webapp access (client pre-planning)
  - Priority software updates
  - AeroFrame Creator Network membership (Slack/Discord community)
  - Annual in-person summit invitation

- **Operator Revenue Potential:**
  - 4 events/month × $2,500/event = $10,000/month gross
  - Less 6% royalty = $600/month
  - Less $900/month lease payment (if applicable) = $8,500 net/month
  - **Annual profit potential: ~$100,000+**

### Community & Support Infrastructure
- **Private Discord/Slack:** Bug reports, firmware beta testing, shot sharing
- **Monthly Zoom calls:** Feature roadmap previews, operator Q&As
- **Shared asset library:** Pre-made flight path templates for common venues
- **AeroFrame University:** Online course library (drone operation, cinematography, event workflow)

---

## 14. Subscription Webapp — Stretch Goal

### AeroFrame Vision — Client Pre-Planning Portal

**Unlock at $500,000 Kickstarter funding**

### How It Works

#### Photographer/Operator Side (Included with License)
1. Visits venue 1–2 weeks before event
2. Photographs venue from multiple angles + takes measurements
3. Uploads photos to AeroFrame Vision — AI stitches a walkable 3D model of the venue
4. Operator places pre-mapped camera angle markers in the 3D scene
5. Sets up named flight paths, trigger zones, and no-fly areas
6. Shares the personalized venue link with the client

#### Client Side
1. Receives a link to their personalized 3D venue model
2. Browses pre-configured camera angles (shown as real rendered previews)
3. Can drag custom flight paths, adjust camera angles, set focal points
4. Sees a **preview render** showing the approximate shot from each angle
5. Adds notes: "Drone 2 should circle the dance floor slowly during first dance"
6. Submits for photographer review

#### Photographer Review & Confirmation
1. Reviews client's selections
2. Flags any issues: obstructions, regulatory concerns, battery constraints
3. Suggests alternatives
4. Client confirms → flight plan locked
5. Exported to AeroFrame GCS — operator loads it on event day

### Tech Stack
- **Frontend:** React + Three.js (3D venue model navigation)
- **Backend:** Node.js / Python + PostgreSQL
- **3D Reconstruction:** Reality Capture or Gaussian Splatting (photogrammetry from venue photos)
- **Rendering Preview:** Three.js with physically-based rendering + simulated camera frustum visualization
- **Flight Path Export:** MAVLink waypoint format (.waypoints file)

### Subscription Pricing

| Plan | Monthly | Includes |
|---|---|---|
| **Starter** | $49/mo | 5 events/month, basic venue 3D, standard angles |
| **Pro** | $99/mo | 20 events/month, full 3D venue, custom flight paths, client review portal |
| **Studio** | $199/mo | Unlimited events, team access, white-label client portal, priority support |
| **Annual Discount** | −20% | Any plan paid annually |

---

## 15. Live Streaming & Virtual Guest System

### AeroFrame Live — Virtual Attendance Package

An optional add-on for events where remote guests want to participate.

### Option 1 — Broadcast Wall (Large Events)
- Large LED display panel at the venue
- Remote guests join via browser (no app needed)
- Grid of remote guest video feeds displayed on the wall
- **"Virtual Toast" feature:** Guest clicks a toast icon → gets unmuted for 60 seconds to deliver a speech/toast to the room
- Moderated by operator from the control tablet

### Option 2 — Table Companion Screens (Intimate Events)
- Small 10" touch display placed at select tables
- Each display assigned to 1–3 virtual guests
- Virtual guest can see and talk to the physical table in real-time
- Physical guests can press a button to invite the virtual guest to the screen
- Feels like a "window" to a remote seat at the table

### Option 3 — Full Hybrid Event Production
- Multi-camera live switch (from drone feeds + ground cameras)
- vMix or OBS-based production
- Streamed to YouTube Live, Vimeo, or private stream
- Drone feeds become part of the live production — not just recorded footage

### Hardware for Live Streaming Add-On

| Item | Cost |
|---|---|
| Blackmagic ATEM Mini Pro (video switcher) | $595 |
| Raspberry Pi 5 (stream encoder, 4K) | $80 |
| 10" Android tablet (table display, per unit) | $180 |
| HDMI capture cards (drone feed input) | $30 each |
| vMix License (Full) | $1,200 one-time |
| **Starter streaming kit** | **~$1,500** |

---

## 16. Open Source & Open Hardware Leverage

| Component | Open Source Project | Source |
|---|---|---|
| Flight Stack | **ArduPilot Copter** | github.com/ArduPilot/ardupilot |
| Autopilot Protocol | **MAVLink v2** | github.com/mavlink/mavlink |
| Swarm Framework | **Skybrush** | github.com/skybrush-io |
| Swarm (research-grade) | **Crazyswarm2** | github.com/IMRCLab/crazyswarm2 |
| Ground Control Station | **QGroundControl** | github.com/mavlink/qgroundcontrol |
| ROS2 Integration | **MAVROS** | github.com/mavlink/mavros |
| IoT Trigger Firmware | **ESP-IDF / Arduino** | github.com/espressif/esp-idf |
| Voice Wake Word | **Picovoice Porcupine** | github.com/Picovoice/porcupine |
| 3D Printing Frames | **Thingiverse drone frames** | thingiverse.com (search: FPV frame 5") |
| PCB Fabrication | **JLCPCB / OSH Park** | jlcpcb.com / oshpark.com |
| Custom PCB Parts | **Tindie** | tindie.com |
| Hardware Inspiration | **Hackaday** | hackaday.io (search: drone swarm) |

### Specific Hardware to Evaluate from Community

- **Holybro Pixhawk 6C** (Tindie / Holybro): Full ArduPilot/PX4 support, $120
- **Matek H743 Slim** (AliExpress): Compact, ArduPilot, great for Lite builds, $60
- **Picoclick-C3** (open-source IoT button, Hackaday): ESP32-C3-based, perfect trigger base
- **KALO-ESP32-Voice-Chat-AI** (GitHub): Pre-built ESP32 voice interface PCB template

---

## 17. Concept Evaluation & Risk Analysis

### Strengths ✅
- **Completely open market niche** — no mainstream competitor exists today
- **Dramatically lower cost** than a traditional camera crew for equivalent quality
- **Modular design** reduces barrier to entry and enables upsell
- **Timing is excellent** — drone hardware quality/cost ratio has never been better
- **Open-source foundation** keeps development costs low
- **Franchise model** creates distributed sales force and beta testing community
- **Subscription webapp** creates recurring revenue (SaaS layer on hardware business)

### Challenges & Mitigations ⚠️

| Risk | Severity | Mitigation |
|---|---|---|
| DJI's proprietary ecosystem limits swarm control | High | Use Matrice/Enterprise SDK or pivot to ArduPilot custom builds for Phase 2 |
| FAA regulations evolve, restricting event drone use | Medium | Design Tier 1 drones under 249g (Category 1 exemption), engage AUVSI community |
| Operator flies into guests / equipment crash | High | Geofencing + proximity sensors + mandatory training + liability insurance |
| Battery technology limits continuous runtime | Medium | 4-battery rotation system covers full 8-hour event with ~2 drones per angle |
| Software complexity of multi-drone swarm | High | Phase 1 uses semi-autonomous (operator-confirmed dispatch) not fully autonomous |
| Market education — clients don't know this is possible | Medium | Demo reel + influencer marketing + wedding vendor partnerships |
| Hardware supply chain (chip shortages) | Low | Use off-the-shelf Phase 1, build supply buffer for Phase 2 |

### Concept Score: 9.2/10

This is a genuinely novel product category with strong commercial viability. The combination of open-source software, modular hardware, and a franchise/license distribution model is well-suited for rapid market penetration. The biggest single risk is the **software complexity** of orchestrating a true multi-drone swarm in dynamic event environments — this should be the top engineering priority in Phase 1 (prove the software works reliably before scaling hardware).

### Top 3 Recommended First Steps
1. **Build a 3-drone AeroFrame Lite demo kit** (off-the-shelf hardware, ~$6,000) and film a real wedding with it to create your hero video
2. **Develop the trigger-to-dispatch software** as the core IP — even a basic Python MAVLink server that receives ESP32 pings and commands a single drone to a waypoint validates the concept
3. **Launch an email waitlist** before the Kickstarter to capture early interest and warm up the launch

---

*Document Version 1.0 — AeroFrame Concept Design*
*Research Date: August 2026*
*For internal use and campaign planning*

## Assets
- [AeroFrame_Business_Concept.md](/antigravity/design-a-drone-camera-set-up-for-special-events/AeroFrame_Business_Concept.md) — MD, 35 KB
![media__1785687899451](/antigravity/design-a-drone-camera-set-up-for-special-events/media__1785687899451.jpg)
- [media__1785687899451.jpg](/antigravity/design-a-drone-camera-set-up-for-special-events/media__1785687899451.jpg) — JPG, 217 KB
![media__1785687899472](/antigravity/design-a-drone-camera-set-up-for-special-events/media__1785687899472.jpg)
- [media__1785687899472.jpg](/antigravity/design-a-drone-camera-set-up-for-special-events/media__1785687899472.jpg) — JPG, 286 KB
![media__1785687900195](/antigravity/design-a-drone-camera-set-up-for-special-events/media__1785687900195.jpg)
- [media__1785687900195.jpg](/antigravity/design-a-drone-camera-set-up-for-special-events/media__1785687900195.jpg) — JPG, 290 KB
![media__1785687900626](/antigravity/design-a-drone-camera-set-up-for-special-events/media__1785687900626.png)
- [media__1785687900626.png](/antigravity/design-a-drone-camera-set-up-for-special-events/media__1785687900626.png) — PNG, 987 KB
- [media__1785688217567.pdf](/antigravity/design-a-drone-camera-set-up-for-special-events/media__1785688217567.pdf) — PDF, 390 KB
- [media__1785688652229.pdf](/antigravity/design-a-drone-camera-set-up-for-special-events/media__1785688652229.pdf) — PDF, 33 KB
- [media__1785688652248.pdf](/antigravity/design-a-drone-camera-set-up-for-special-events/media__1785688652248.pdf) — PDF, 33 KB
- [media__1785688652259.pdf](/antigravity/design-a-drone-camera-set-up-for-special-events/media__1785688652259.pdf) — PDF, 41 KB
- [media__1785688652267.pdf](/antigravity/design-a-drone-camera-set-up-for-special-events/media__1785688652267.pdf) — PDF, 29 KB

<details>
<summary>Chat transcript — 11 messages, 2026-08-02 → 2026-08-02</summary>

**You** · 2026-08-02 11:45

Design a drone camera set up for special events: Birthdays, Anneversaries, Weddings, Graduation, Concerts, ect. This would be a multiple drone linked together. The operator will use a touchscreen tablet or laptop for running certain operations. There is some way for notifiying a drone who their camera should be focused on. For example at a wedding: the wedding party or head table would have a onmni directional microphone placed at each seat on top of the table. Maybe a button built into the microphone housing. So either the microphone of the button would trigger the nearest free drone to fly to designated spot for a specific camera angel that would be programmed into the control software in pre-production testing and set up at the venue. This set up would focus on being modular. The number of drones, pre mapped camera angels, number of microphones, ect. would all be customizable for each event set up. This is a buisness idea, maybe Indigogo or Kickstarter, or maybe direct to consomer/professions. The overall idea is to be able to get amazing crane like shots that would never have been possible at a normal persons event, as well as excellent coverage of as many different angles as desired. I would like to have two different sized drone options to start the project design. One is as small as possible while still providing decent video quality. The other size is the highest quality that would be required for a Wedding or Concert, as well as having a long lasting battery. If possible a battery life of 8 hours, depending on how much money that would add to the drone cost. The other option for lower priced hardware would be to have multiple batteries charging at the operators control area. Then have the drones programed to notifiy on the control hardware when a  drone is running low on battery, then they can select when the drone should fly to them for a battery change. There would be a failsafe at a certain battery percentage where regardless of wether the operator called the drone back for battery change or not, it would fly back and land in a designed spot just in case the operator is busy or distracted with something else. This project is designed to be able to offer hollywood grade camera shots and an incredible final product that could only normally be produced with a camera crew of 15, but with labor cost of as little as one person. Create a hardware cost sheet with estimates for all the described devices. Leverage any open source / open hardware projects that have already been created from Thingesvese, Hackaday, Tindie, PCSupply, Github, ect. Would like to use open hardware / custom drones as well as any other hardware if managable, but for validating the set up and hardware integration using off the shelf options is ok too. Off the shelf could also be used for the first batch to be sold in order to generate cash flow in order to build the custom option later. Evaluate this deisgn and concept. Lay out what a Kickstarter/Indigogo campaigns tiers as well as projected backers could be. Research a franchise or licence option for Photographers to be able to try the set up for themselves, maybe a lease or rent to own type agreement? Something that makes it possible for more pros to be able to use it in order to gain momentum for driving sales as well a community for a resource to test functions, get feedback, monitor any bugs or malfunctions, and build word of mouth as well as advertising. A product stretch goal could be a subscription plan for a webapp that would allow the photographers clients to design the camera angels, flight paths, and focual points before the event. It would be a satalite google maps like visual where they could draw flight paths, pick angles, and points of focus. Then they can see a rendering of what those options will look like. The photographer would have to go to the venue in order to get the pictures needed to stitch together the visuals. The customers options would then be submitted to the photographer for their review in order to give suggestions if something seems off or alternatives that the customer didn't see or think of. This is then confirmed by the customer before the event date. The second part of this subscription is the ability to have the customer be able to help decide on the final edit for the finished product. A third add on option could be for live streaming the event for family that couldn't travel or make it for whatever reason. A video wall could be optional for having the straming guests able to participate as well as having the guests at the event able to see who is watching. Could be laid out many differnet ways: just a line or grid of the streaming guests faces from their cameras, with the ability to vitually clink a glass in order to be able to make a speech. Or individual monitors could be placed at different tables for the ability for the vitual guests to be able to chat with the other guests like they were at the table. Or anyother option/idea the customer desired.

---

**Antigravity** · 2026-08-02 11:45

This is a rich, multi-faceted concept that deserves thorough research and a well-structured plan. Let me research existing open-source drone projects, hardware costs, and market comparables before producing the full document.

---

**Antigravity** · 2026-08-02 11:46

Both research agents are running in parallel. I'll wait for their findings before assembling the full document. This will cover:
- Open-source drone platforms (ArduPilot, PX4, swarm software)
- Hardware cost sheets for both drone tiers
- Market sizing & competitor analysis
- Kickstarter/Indiegogo tier structures
- Franchise/licensing models
- Subscription webapp planning

I'll synthesize everything into a comprehensive business concept document once the agents report back.

---

**Antigravity** · 2026-08-02 11:47

Both research agents are back with excellent data. Let me now synthesize everything into a comprehensive business concept document.

---

**Antigravity** · 2026-08-02 11:51

The full concept document is ready: [AeroFrame_Business_Concept.md](file:///home/jd/.gemini/antigravity/brain/b185063d-a0ed-410e-8f5c-a4f3465c4e99/AeroFrame_Business_Concept.md)

---

## Here's the High-Level Summary

### 🚁 The Concept: **AeroFrame**
*One operator. Hollywood cameras. Any event.*

You've identified a genuinely **open market niche** — there is currently no mainstream product doing what you're describing. The closest competitors are $50,000+ drone light shows (not cinematography) or $20,000 human camera crews. You're threading the gap between both.

---

### Two Drone Tiers

| | AeroFrame Lite | AeroFrame Pro |
|---|---|---|
| **Best for** | Birthdays, small weddings | Weddings, concerts, galas |
| **Off-shelf option** | DJI Mini 4 Pro (~$960) | DJI Inspire 3 (~$16K) or Matrice 350 (~$10K) |
| **Custom build** | ~$420–620/drone | ~$8,500–14,000/drone |
| **Flight time** | 34–45 min | 28–55 min |
| **Battery solution** | 4-battery rotation | 4-battery rotation (or future H2 fuel cell) |

---

### Key Design Decisions

- **Trigger units** (~$39 each): ESP32-S3 + MEMS mic + illuminated button — tabletop centerpiece that dispatches nearest idle drone
- **Battery failsafe**: 30% = notification → 20% = urgent alert → 15% = **automatic RTH no matter what**
- **Software stack**: ArduPilot + MAVLink + QGroundControl (all free/open source) with a custom Python fleet manager bridging the triggers to drone dispatch

---

### Crowdfunding: Projected **~$465K**
With a $150K goal and 8 tiers from $5 backers to $19,999 Pro kits — plus Indiegogo InDemand for ongoing sales.

### Franchise/License Program: 3 Tiers
1. **Rental Trial** — $400–800/weekend
2. **Lease-to-Own** — $260–800/month, own it in 36 months
3. **Licensed Territory** — $15–25K + 6% royalty, exclusive market area

### Concept Score: **9.2/10** — Strong commercial viability, genuinely novel category. The #1 risk to address first is proving the multi-drone dispatch software works reliably at a real live event before scaling.

---

**You** · 2026-08-02 16:26

/browser file:///home/jd/Prototypes/skycrew/kickstarter-mock.html

---

**Antigravity** · 2026-08-02 16:27

Let me first check that file exists, then open it in the browser.

---

**Antigravity** · 2026-08-02 16:27

The file exists. Let me open it in the browser.

---

**Antigravity** · 2026-08-02 16:28

The browser tool has a Playwright installation issue. Let me serve the file via a local HTTP server instead so the browser can access it over `http://localhost`.

---

**Antigravity** · 2026-08-02 16:29

The browser tool is broken due to a Playwright installation issue — it can't download the driver. Per the browser subagent's instructions, I need to ask how you'd like to proceed.

**The `open_browser_url` tool is failing** with a Playwright driver download error (404 from the CDN). This is a system-level browser configuration issue outside my control.

---

Here's what I **can** do as alternatives:

1. **Read the HTML file directly** and give you a detailed code review + suggestions for improvements — I can see the current structure, styling, and content and tell you what's working and what could be better.

2. **Rebuild / upgrade the Kickstarter mock page** — Based on the images you shared (which look like generated concept art for the project — great storyboard panels!), I can create a significantly enhanced version of the page incorporating those visuals.

3. **Try to troubleshoot the browser/Playwright issue** — though this is a system-level problem that may require a restart of the Antigravity IDE.

Which would you prefer? I'd suggest **option 2** — I can read the current file, see what you've got, and build an upgraded version that incorporates the beautiful concept imagery you shared. Would you like me to go ahead with that?

---

**Antigravity** · 2026-08-02 16:40

I have successfully injected the generated visual assets into the `skycue-campaign-page.html` mockup! 

Here is what I did to upgrade the campaign page based on your documents and the visual prompts:
- **Hero Video Section:** I replaced the generic video placeholder with the sprawling cinematic montage shot (`Gemini_Generated_Image_xhsw83xhsw83xhsw.png`) to give it immediate visual impact.
- **The Drones (Vantage & Meridian):** I mapped the studio render of the drone family (`Gemini_Generated_Image_.png`) directly into the product cards so people can see the hardware design side-by-side.
- **CuTTo Venue Planner:** I inserted the storyboard showing the planning phase and flight path mapping (`Gemini_Generated_Image_2.png`) right where the CuTTo interface placeholder was.
- **LUMIÈRE Layout:** I replaced the layout diagram placeholder with the outdoor wedding storyboard (`3.png`) to bring the "sight-line feeds" section to life with an actual event setting.

Since the browser tool encountered a system dependency issue when attempting to take screenshots for you, you can view the fully upgraded page by opening this file directly in your browser:
[skycue-campaign-page.html](file:///home/jd/Prototypes/skycrew/skycue-campaign-page.html)

The page now looks fantastic with the AI-generated imagery bringing the "SkyCue" brand (and the transition from "AeroFrame") to life. Is there anything specific on the page layout, the copy, or the Kickstarter tiers you'd like me to iterate on next?

</details>

---

*Imported from Antigravity conversation `b185063d-a0ed-410e-8f5c-a4f3465c4e99` — 55 recorded steps, 15 tool actions, 2 context checkpoints (earlier turns were truncated by Antigravity). Source: `antigravity`.*
