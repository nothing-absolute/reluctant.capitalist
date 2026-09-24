---
title: "Boat Monitor Data Viz"
description: "This document contains Mermaid charts and mockup graphics to support the marketing and business case for the No-Subscription Boat Monitor."
date: "2026-09-23"
status: "concept"
stage: "idea"
tags: []
source: "Projects/Kickstarter/OpenPlotter-Boat-Monitor/boat_monitor_data_viz.md"
---
## Data Visualizations & Marketing Assets

This document contains Mermaid charts and mockup graphics to support the marketing and business case for the No-Subscription Boat Monitor.

### 1. The "Marine Tax" Cumulative Cost Comparison

This chart demonstrates the extreme cost disparity over a 5-year ownership period between a traditional subscription-based monitor and the No-Subscription open-hardware approach.

> [!TIP]
> **Use Case:** Perfect for a carousel post on LinkedIn or Instagram to logically justify the purchase to buyers.

```mermaid
xychart-beta
    title "Cumulative Cost of Boat Monitoring (5 Years)"
    x-axis ["Year 1", "Year 2", "Year 3", "Year 4", "Year 5"]
    y-axis "Total Cost ($)" 0 --> 1800
    line "Traditional (Siren/BRNKL)" [740, 980, 1220, 1460, 1700]
    line "No-Subscription Monitor (BYO-SIM)" [223, 247, 271, 295, 319]
```
*(Assumes Traditional: $500 hardware + $20/mo. Ours: $199 hardware + $2/mo Bring-Your-Own-SIM)*

### 2. Feature Comparison Matrix

```mermaid
block-beta
  columns 3
  space:1 Traditional:1 Ours:1
  Hardware_Cost["$500 - $800"]:1 HC1["$199"]
  Monthly_Fee["$15 - $25/mo"]:1 MF1["$0 (BYO SIM)"]
  App_Requirement["Proprietary App"]:1 AR1["Web UI / Any App"]
  Data_Ownership["Corporate Cloud"]:1 DO1["100% Yours"]
  NMEA_Integration["Paid Add-on"]:1 NI1["Built-in Standard"]
```

### 3. Open System Architecture

This diagram shows how the system securely relays data without relying on a proprietary corporate server that could be shut down.

```mermaid
graph LR
    subgraph "On the Boat"
        B[Bilge Pump] --> M(Boat Monitor Core)
        V[Battery Bank] --> M
        G[GPS Antenna] --> M
    end

    M -- "Standard MQTT over Cellular" --> C((Open Source Broker / HomeAssistant))
    C -- "Push Notifications" --> P[Your Smartphone]

    style M fill:#1a365d,stroke:#fff,stroke-width:2px,color:#fff
    style C fill:#2b6cb0,stroke:#fff,stroke-width:2px,color:#fff
    style P fill:#48bb78,stroke:#fff,stroke-width:2px,color:#fff
```

### Mockup Graphics & Imagery

#### Instagram "POV" Action Shot
Use this to demonstrate the simplicity of checking on the boat from the helm or the dock.

#### Infographic Background Template
Use this blank template to overlay text such as "Stop Paying the Marine Tax" or to drop in the Mermaid charts above for high-quality social posts.

#### System Connectivity Illustration
Use this clean, flat illustration on the website or in a pitch deck to explain how the data flows from the boat to the phone.
