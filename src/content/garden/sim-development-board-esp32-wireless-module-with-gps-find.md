---
title: "SIM Development Board ESP32 Wireless Module with GPS find cheapest option for kickstarter"
description: "A detailed strategy for designing a Kickstarter campaign for a GPS tracker using ESP32 and SIM modules."
date: "2026-08-01"
tags: ["kickstarter","hardware","strategy","cost","electronics"]
source: "antigravity://b0fa3b8a-7515-4ba6-bd07-499f21d7b9c0"
draft: false
vault: false
---

SIM Development Board ESP32 Wireless Module with GPS find cheapest option for kickstarter

## kickstarter tier strategy

## Kickstarter Tier Strategy: ESP32 Cellular/GPS Tracker

This strategy leverages the different hardware approaches to create a compelling reward structure. By offering the LILYGO off-the-shelf board as an "Early Access" tier, you can start shipping units to backers quickly while you use the funds to engineer the final Custom PCBA for the higher-end tiers.

---

## 🥉 Tier 1: The "Infinite Solar Edition" (Powered by LILYGO)
**Target Audience:** Outdoor enthusiasts, boat owners, and power users who want a rugged tracker they can mount outside and *never* have to plug in.
**Limit:** strictly capped at **2,000 units**.

*   **Pledge Amount:** ~$149 - $179
*   **Estimated Delivery:** 1-2 months after campaign ends (Fast fulfillment!)
*   **What's Included:**
    *   1x Infinite Solar Tracker (LILYGO T-SIM7000G mainboard)
    *   Ruggedized IP67 enclosure with an integrated 5V 1W Solar Panel on the lid
    *   Internal 18650 Li-ion battery (charged perpetually by the sun)
    *   **Lifetime Premium Subscription** to your tracking software (No monthly fees ever)
    *   Early API access for developers
*   **The Pitch:** *"Set it and forget it. The Infinite Solar Edition utilizes the native solar-charging circuitry (CN3065) of the proven LILYGO development board. Mount it on your boat, RV, or equipment, and the integrated solar panel guarantees you will never need to replace the battery or plug it in. Because this is our early-access hardware, we're including a Lifetime Premium Subscription."*

## 🥈 Tier 2: The "Covert Pro Edition" (Custom PCBA)
**Target Audience:** Consumers and businesses needing to hide the tracker *inside* a vehicle, asset, or bag, where solar isn't an option.

*   **Pledge Amount:** ~$199 - $249
*   **Estimated Delivery:** 6-8 months after campaign ends
*   **What's Included:**
    *   1x Covert Pro Edition Tracker (Custom engineered PCBA)
    *   Sleek, injection-molded, ultra-compact IP68 waterproof enclosure (No solar panel)
    *   Integrated internal antennas (zero dangling wires)
    *   Aggressively optimized battery management (Up to 2 years of standby life on a single charge without the sun)
    *   1 Year of Premium Subscription included
*   **The Pitch:** *"Can't mount it in the sun? You are funding the engineering of our custom-designed, highly miniaturized circuit board. By dropping the solar panel and optimizing the deep-sleep architecture, we've created a covert tracker that is 50% smaller than the Solar Edition and can stay hidden for up to 2 years on a single charge."*

## 🥇 Tier 3: The "Pro Edition" Fleet Pack (Custom PCBA x5)
**Target Audience:** Small businesses, logistics, or hardcore enthusiasts wanting to track multiple premium assets (cars, boats, RVs, etc.).

*   **Pledge Amount:** ~$899 - $999
*   **Estimated Delivery:** 6-8 months after campaign ends
*   **What's Included:**
    *   5x Covert Pro Edition Trackers
    *   1 Year of Enterprise Fleet-Management Dashboard access
    *   Priority shipping and white-glove onboarding
*   **The Pitch:** *"Securing a fleet? Get a 5-pack of the Covert Pro Edition with enterprise-grade dashboard access for a unified tracking experience."*

---

## 💡 Strategic Benefits of this Structure

> [!TIP]
> **Risk Mitigation**
> Hardware Kickstarters notoriously fail because creators underestimate the time and cost of custom PCBA design. By shipping Tier 1 (LILYGO) early, you prove you can deliver software and build trust with your backers, buying you patience for the Tier 2 custom hardware.

> [!NOTE]
> **Cash Flow Management**
> The LILYGO boards have a known, fixed cost. You can calculate your margins perfectly for Tier 1. The profit generated from Tier 1 will help cushion the upfront NRE (Non-Recurring Engineering) costs required to design the custom PCBA for Tier 2.

> [!IMPORTANT]
> **Messaging is Key**
> Be incredibly transparent about *why* the Pro Edition takes longer to ship. Backers love supporting the "engineering journey." Framing Tier 2 as "funding the custom miniaturization" makes them feel like investors in your hardware evolution.

## tier1 industrial design

## Industrial Design Concept: Tier 1 Infinite Solar Edition

This document outlines the conceptual industrial design and internal architecture for the **Tier 1 Infinite Solar Edition** tracker, designed to house the LILYGO T-SIM7000G board.

## Exterior Concept Rendering

![Tier 1 Rugged Solar Tracker Concept](/home/jd/.gemini/antigravity/brain/b0fa3b8a-7515-4ba6-bd07-499f21d7b9c0/tier1_solar_tracker_concept_1785565125558.jpg)

### Key Design Features
1.  **Solar Lid:** A flush-mounted ~1W 5V solar panel integrated directly into the top casing, providing constant trickle-charging to the internal battery during daylight hours.
2.  **Rugged IP67 Enclosure:** Matte black, UV-resistant ABS/Polycarbonate blend designed to withstand harsh marine and automotive environments.
3.  **Mounting Flanges:** Heavy-duty side flanges with pre-drilled holes for secure screw/bolt mounting to boats, RVs, and heavy equipment.
4.  **Weatherproof Gaskets:** High-visibility orange silicone gaskets ensure a watertight seal for the primary enclosure seam and any external ports.

---

## Internal Architecture & Layer Schematic

To accommodate the off-the-shelf LILYGO board without custom PCBA engineering, the enclosure is designed in stacked layers.

```mermaid
block-beta
  columns 1
  
  block:Lid["Top Lid Layer"]
    SolarPanel["Integrated 5V Solar Panel"]
    PolycarbonateCover["Clear UV-Resistant Polycarbonate Cover"]
  end
  
  space
  
  block:Seal["Sealing Layer"]
    SiliconeGasket["IP67 Orange Silicone O-Ring / Gasket"]
  end
  
  space
  
  block:Electronics["Electronics Tray"]
    LILYGO["LILYGO T-SIM7000G Mainboard"]
    Antennas["LTE & Active GPS Antennas (Mounted to interior sidewalls)"]
  end
  
  space
  
  block:Power["Power Compartment"]
    Battery["18650 3400mAh Li-ion Battery (Single Cell)"]
    Wiring["JST-PH Routing from Solar & Battery to LILYGO"]
  end
  
  space
  
  block:Base["Base Layer"]
    MountingFlanges["Integrated Mounting Flanges"]
    Magnets["Optional Neodymium Magnet Recesses"]
  end

  Lid --> Seal
  Seal --> Electronics
  Electronics --> Power
  Power --> Base
```

### Manufacturing Notes for Tier 1
Because you are fulfilling Tier 1 early, you can avoid expensive steel injection-molding tooling initially. 
*   **Initial Run (Sub 500 units):** Can be manufactured using high-quality Multi Jet Fusion (MJF) 3D printing (Nylon PA12) or CNC machining, which requires zero upfront tooling costs. 
*   **Scale Run (500 - 2,000 units):** Transition to basic injection molding. The "blocky" design shown above requires simple 2-part molds without complex side-actions, keeping tooling costs under ~$3,000.

## Assets
- [kickstarter_tier_strategy.md](/antigravity/sim-development-board-esp32-wireless-module-with-gps-find/kickstarter_tier_strategy.md) — MD, 4 KB
- [tier1_industrial_design.md](/antigravity/sim-development-board-esp32-wireless-module-with-gps-find/tier1_industrial_design.md) — MD, 3 KB
![tier1_solar_tracker_concept_1785565125558](/antigravity/sim-development-board-esp32-wireless-module-with-gps-find/tier1_solar_tracker_concept_1785565125558.jpg)
- [tier1_solar_tracker_concept_1785565125558.jpg](/antigravity/sim-development-board-esp32-wireless-module-with-gps-find/tier1_solar_tracker_concept_1785565125558.jpg) — JPG, 479 KB

<details>
<summary>Chat transcript — 16 messages, 2026-08-01 → 2026-08-01</summary>

**You** · 2026-08-01 05:36

SIM Development Board ESP32 Wireless Module with GPS find cheapest option for kickstarter

---

**Antigravity** · 2026-08-01 05:37

When planning for a Kickstarter, "cheapest" means different things depending on what stage you are in. The cheapest way to build *one* prototype is very different from the cheapest way to fulfill *one thousand* orders.

Here is a breakdown of the cheapest options for an ESP32 + SIM (Cellular) + GPS module, categorized by where you are in your Kickstarter journey:

### 1. The "Off-the-Shelf" Board (Best for Prototyping & Early Fulfillment)
If you want a reliable, all-in-one board that requires zero custom hardware engineering and can be purchased in bulk directly from the manufacturer, this is your best bet.

*   **Top Pick:** **LILYGO T-SIM7000G** or **T-SIM7670G**
*   **What it is:** A single, highly integrated development board containing an ESP32, a modern LTE cellular modem (SIM7000G uses Cat-M1/NB-IoT; SIM7670G uses Cat-1), a GPS receiver, battery charging circuitry, and a SIM card slot.
*   **The Cost:**
    *   **Retail (1 unit):** ~$30 to $40 USD (via AliExpress, Amazon, or LILYGO direct).
    *   **Wholesale (Kickstarter Volume):** If you contact LILYGO directly via Alibaba for bulk orders (e.g., 500+ units), the price typically drops significantly, often into the **$20 - $25 USD** range.
*   **Why it's good for Kickstarter:** You don't have to deal with hardware design or FCC/CE certification of custom boards. You can just buy them in bulk, flash your firmware, put them in an enclosure, and ship.

### 2. The Custom PCBA Route (Cheapest at Scale 1000+ Units)
If your Kickstarter is highly successful and you are ordering thousands of units, buying pre-made LILYGO boards cuts too much into your profit margins. The cheapest option at scale is to design your own Printed Circuit Board Assembly (PCBA).

*   **The Setup:** You design a custom board that integrates an **ESP32-WROOM module** (~$2.50), a **SIM7070G or SIM7670G module** (~$10.00), and a GPS antenna/circuitry.
*   **The Cost:** 
    *   Using rapid manufacturers like JLCPCB or PCBWay, a fully assembled custom board at a volume of 1,000+ units can bring your per-unit cost down to **$15 - $18 USD**.
*   **The Catch:** This requires high upfront Non-Recurring Engineering (NRE) costs. You have to pay a hardware engineer to design it, pay for setup fees at the factory, and potentially deal with expensive EMI/FCC certifications if you are selling a commercial product.

### 3. The DIY Modular Approach (Cheapest Prototype, Worst for Kickstarter)
If you are just hacking together your very first proof-of-concept and want the absolute lowest price tag for *one* unit, you can wire separate cheap modules together.

*   **The Setup:** 
    *   Generic ESP32 DevKit (~$4)
    *   SIM800L module (~$3) OR SIM868 (GSM + GPS for ~$7)
    *   NEO-6M GPS module (~$4)
*   **The Cost:** Roughly **$11 - $15 USD** total.
*   **Why you SHOULD NOT use this for Kickstarter:** 
    1.  **Assembly Nightmare:** You cannot fulfill a Kickstarter by hand-soldering jumper wires on hundreds of units. It will take months, and the failure rate will be massive.
    2.  **The 2G Problem:** Modules like the SIM800L and SIM868 are **2G-only**. 2G networks are already completely dead in the US, Australia, and many parts of Europe. If you ship a 2G product today, your backers will have bricks.
    3.  **Power Issues:** Cellular modules require massive current spikes (up to 2 Amps). Wiring them together manually on a breadboard often leads to constant rebooting and power instability. 

### Summary Recommendation
Start with a **LILYGO T-SIM7000G** to build your prototype, shoot your Kickstarter video, and prove the software works. 
*   If you sell **under 500 units**, just negotiate a wholesale deal with LILYGO on Alibaba and ship those. 
*   If you sell **over 1,000 units**, take that Kickstarter money, hire a hardware engineer on Upwork, and build a custom PCBA via JLCPCB to maximize your margins.

---

**You** · 2026-08-01 05:52

design kickstarter tier format. Starting witha LILYGO option for tier 1, then custom PCBA option for tier 2.

---

**Antigravity** · 2026-08-01 05:53

I have designed a Kickstarter tier strategy that leverages both hardware approaches. You can view the full breakdown in the [kickstarter_tier_strategy.md](file:///home/jd/.gemini/antigravity/brain/b0fa3b8a-7515-4ba6-bd07-499f21d7b9c0/kickstarter_tier_strategy.md) artifact.

Here is the high-level concept:

*   **Tier 1: The "Maker Edition" (LILYGO):** Positioned for early adopters and tinkerers. It uses the off-the-shelf LILYGO board, meaning you can fulfill these orders almost immediately after the campaign ends. This builds massive trust with your backers and gets your software into the wild quickly.
*   **Tier 2: The "Pro Edition" (Custom PCBA):** Positioned for consumers wanting a polished, miniaturized product. You use the funds from the campaign to pay for the engineering and manufacturing of this custom board. You set a much later delivery date for this tier, managing expectations while you finalize the hardware.

This is a classic "stair-step" hardware strategy. It drastically reduces your risk because you aren't promising custom-engineered hardware to *everyone* on day one, and you establish cash flow early through the Tier 1 sales. 

Let me know if you want to adjust the pricing estimates or add software/subscription tiers on top of this!

---

**You** · 2026-08-01 06:03

make the price estimate as high as possible with a goal of upto 2000 units for tier 1

---

**Antigravity** · 2026-08-01 06:03

I've updated the [kickstarter_tier_strategy.md](file:///home/jd/.gemini/antigravity/brain/b0fa3b8a-7515-4ba6-bd07-499f21d7b9c0/kickstarter_tier_strategy.md) artifact to push the pricing into a premium bracket and cap Tier 1 at 2,000 units.

To justify these higher margins on the LILYGO hardware, I repositioned Tier 1 as a **"Founders Edition"** ($129 - $149) that includes lifetime software access and early API access. This creates a massive sense of FOMO (Fear Of Missing Out) and justifies the higher price point despite it being a slightly bulkier, off-the-shelf board. 

If you max out those 2,000 units at $149, that's nearly **$300,000** in revenue just from your early-shipping tier—giving you an incredible cash runway to engineer the custom PCBA for Tier 2 ($199 - $249).

Take a look at the updated artifact and let me know if you want to tweak the positioning or include any specific software features in the bundles!

---

**You** · 2026-08-01 06:06

what are the cost estimates for the first two tiers for hardware only

---

**Antigravity** · 2026-08-01 06:06

Here is the estimated breakdown for the bare hardware and manufacturing costs for both tiers, assuming a volume of 1,000 to 2,000 units. 

### Tier 1: Founders Edition (LILYGO Based)
Because this is an off-the-shelf board, your upfront engineering costs are effectively zero, but the per-unit cost of the mainboard is slightly higher than raw components.

*   **LILYGO T-SIM7000G Board:** ~$22.00 - $25.00 (Negotiated wholesale price on Alibaba for 2,000 qty)
*   **Battery (e.g., 2000mAh LiPo or 18650):** ~$3.00 - $4.00
*   **Enclosure (High-yield 3D print or basic injection mold):** ~$3.00
*   **Packaging & Cables:** ~$2.00
*   **Total Estimated Hardware Cost:** **~$30.00 - $34.00 per unit**

> **Margin Check:** If you sell this tier at $149, your hardware profit is roughly **$115 per unit** (a phenomenal ~77% gross margin), leaving plenty of room for shipping, taxes, and Kickstarter fees.

### Tier 2: Pro Edition (Custom PCBA)
With a custom PCBA, your per-unit hardware cost drops because you aren't paying LILYGO's markup, but you will have upfront Non-Recurring Engineering (NRE) costs (e.g., paying an engineer to design it, FCC testing, and paying for injection mold tooling).

*   **ESP32-WROOM Module:** ~$2.50
*   **Cellular Modem (e.g., SIM7670G):** ~$10.00
*   **GPS & Cellular Internal Antennas:** ~$2.50
*   **PCB Fabrication & Assembly (via JLCPCB/PCBWay):** ~$3.50 (Components + placement)
*   **Battery (Optimized LiPo):** ~$3.50
*   **Custom Enclosure (Injection Molded part cost):** ~$1.50
*   **Packaging:** ~$1.50
*   **Total Estimated Hardware Cost:** **~$25.00 - $26.00 per unit**

> **The NRE Factor:** While the *per-unit* cost of Tier 2 is cheaper (~$25 vs ~$34), you will need to budget roughly **$5,000 to $10,000** of your Kickstarter funds to pay for the custom hardware engineering, prototyping, and the steel tooling required for the injection-molded waterproof enclosure.

---

**You** · 2026-08-01 06:09

what is the estimated battery life for both designs

---

**Antigravity** · 2026-08-01 06:09

Battery life for an ESP32 Cellular/GPS tracker is entirely dependent on the **update frequency** (how often it wakes up, gets a GPS lock, and transmits data) and how effectively you use **deep sleep**. 

Assuming both tiers use the exact same **2000mAh LiPo battery**, here is the estimated battery life based on typical tracking profiles.

### Tier 1: Founders Edition (LILYGO T-SIM7000G)
Because the LILYGO is a "development board," it includes components designed for convenience, not power efficiency (e.g., USB-to-Serial chips, bright indicator LEDs, and standard voltage regulators). Even when the ESP32 goes to sleep, these components continue to slowly drain the battery, resulting in a "deep sleep" current of roughly **1mA to 2mA**.

*   **Aggressive Tracking (Updates every 1 minute):** ~12 to 18 hours. *(Waking up the cellular modem this often eats battery fast).*
*   **Standard Tracking (Updates every 15 minutes):** ~3 to 5 days. *(ESP32 sleeps between updates).*
*   **Theft/Standby Mode (Updates once a day):** ~1 to 1.5 months. *(At this point, the baseline power drain of the LILYGO board itself becomes the bottleneck, killing the battery before the tracker actually does any work).*

### Tier 2: Pro Edition (Custom PCBA)
A custom PCBA allows your hardware engineer to aggressively optimize for power. They will use ultra-low quiescent current regulators, remove unnecessary LEDs, and install load switches (MOSFETs) that physically cut power to the GPS and Cellular modems when they aren't transmitting. This can drop the deep sleep current to an incredibly low **20µA to 50µA**.

*   **Aggressive Tracking (Updates every 1 minute):** ~15 to 20 hours. *(When constantly transmitting, the power savings are minimal because the cellular modem is doing the heavy lifting).*
*   **Standard Tracking (Updates every 15 minutes):** ~7 to 10 days. *(The efficiency of the custom board starts to show here).*
*   **Theft/Standby Mode (Updates once a day):** **~1 to 2 YEARS.** *(This is where the custom PCBA shines. Because the sleep current is virtually zero, the tracker can sit hidden in a car or boat for over a year on a single charge, waiting to wake up).*

### The Takeaway for Your Campaign
This difference in battery life is exactly how you market the **Tier 2 Pro Edition**. 

You can explicitly state: *"By backing the Pro Edition and funding our custom circuit board, you are unlocking **months to years of standby battery life** that is physically impossible on a standard development kit."*

---

**You** · 2026-08-01 06:13

design a new layout using the LILYGO board, but adding a solar pannel for eliminating the need for replacing the battery or connecting to a charger

---

**Antigravity** · 2026-08-01 06:14

I've updated the [kickstarter_tier_strategy.md](file:///home/jd/.gemini/antigravity/brain/b0fa3b8a-7515-4ba6-bd07-499f21d7b9c0/kickstarter_tier_strategy.md) artifact with this brilliant new layout!

Because the **LILYGO T-SIM7000G** natively includes a CN3065 solar charging IC and a 2-pin JST connector specifically designed for a 5V solar panel, this is practically a plug-and-play modification for Tier 1. 

By adding a small, rugged ~1W solar panel to the lid of your enclosure, we completely eliminate the LILYGO board's biggest weakness (its higher deep-sleep current). During the day, the solar panel provides more than enough juice to power the ESP32 and recharge the 18650 Li-ion battery for nighttime tracking.

Here is how this completely changes (and improves) the Kickstarter pitch:

*   **Tier 1 becomes the "Infinite Solar Edition":** Targeted at outdoor enthusiasts (boats, RVs, heavy equipment). It's a bit bulkier because of the solar panel, but it gives them an "install it and forget it forever" experience.
*   **Tier 2 becomes the "Covert Pro Edition":** Targeted at people who need to track things where the sun *doesn't* shine (inside a glovebox, stitched into a bag, under a car seat). Because it uses the Custom PCBA, it's 50% smaller, drops the bulky solar panel, and relies purely on aggressive deep-sleep power optimization to survive for years on a single charge. 

This creates a massive contrast between the two tiers, meaning you won't cannibalize your own sales. People will very clearly fall into either the "I need solar" camp or the "I need it hidden" camp!

---

**You** · 2026-08-01 06:18

create an industrial design scematic for tier 1

---

**Antigravity** · 2026-08-01 06:18

I have put together a conceptual industrial design rendering and an internal layer schematic for the Tier 1 "Infinite Solar Edition". 

You can view the full concept and architectural breakdown in the [tier1_industrial_design.md](file:///home/jd/.gemini/antigravity/brain/b0fa3b8a-7515-4ba6-bd07-499f21d7b9c0/tier1_industrial_design.md) artifact!

I designed it to look rugged and utilitarian—perfect for mounting on boats, ATVs, or construction equipment. The internal schematic breaks down how you can stack the off-the-shelf LILYGO board, the 18650 battery, and the solar panel into a single cohesive unit without needing to engineer a custom circuit board.

Let me know if you want to tweak the design language (e.g., make it more stealthy, more aerodynamic, etc.)!

---

**You** · 2026-08-01 06:20

find a housing design that has been built to be waterproof example from an open hardware project online

---

**Antigravity** · 2026-08-01 06:21

When it comes to waterproof hardware for a Kickstarter, relying purely on a 3D-printed outer shell is risky. Standard 3D prints (like PLA or PETG) are inherently porous, and water *will* eventually seep through the layer lines unless you heavily coat them in epoxy.

However, the open-hardware community has solved this. Here are the best approaches and examples for a waterproof Tier 1 tracker:

### 1. The "Off-the-Shelf + Custom Internals" Approach (Highly Recommended)
The most successful open-hardware outdoor projects (like remote weather stations or LoRa nodes) buy a cheap, mass-produced waterproof box and only 3D-print the *internal* sled to hold the electronics. 
*   **The LILYGO FSH711 Box:** LILYGO actually makes an official waterproof enclosure (the FSH711) designed specifically for their boards. You could source these boxes directly from LILYGO for a few dollars each.
*   **Hammond / Sonoff Enclosures:** Search for **"IP66 Waterproof Junction Box"** (like the Sonoff IP66). These cost $3-$4 in bulk, have a clear lid (perfect for mounting your solar panel underneath the lid to protect it from the elements), and use a thick rubber gasket. You then just 3D print a simple bracket to hold the T-SIM7000G and battery securely inside it.

### 2. Open-Source 3D Printable Examples
If you want to print the entire case, you must use a design that incorporates an O-ring (usually a TPU printed gasket or a rubber band) and screws to compress it.

*   **The "Rugged Waterproof Box" (Thingiverse / Printables):** There is a famous parametric design by *Whity* on Printables called the **"Rugged Box (Parametric)"**. While not strictly for the T-SIM7000G, thousands of makers use this exact design file, adjust the dimensions for their ESP32 boards, and print it in PETG or ABS. It uses M3 screws to clamp down on a TPU gasket, making it highly water-resistant.
*   **The SLy Case (Thingiverse):** If you search "LILYGO T-SIM7000G" on Thingiverse, the most popular fit is the *SLy Case*. It is a great starting point for the internal dimensions and port alignment, but you would need to modify the CAD file to add a flange and a gasket channel to make it truly waterproof.

### How to execute this for your Tier 1:
Do not try to 3D print the waterproof exterior yourself for 2,000 backers. You will have a massive failure rate if it rains. 

Instead, buy **2,000 clear-lid IP67 junction boxes** from Alibaba (~$2 each). 
1. Mount the solar panel facing up against the inside of the clear lid.
2. 3D print an internal chassis to hold the LILYGO board and battery beneath the solar panel.
3. Close the lid and screw it tight. 

You instantly get a 100% waterproof, solar-charging tracker with minimal manufacturing risk!

</details>

---

*Imported from Antigravity conversation `b0fa3b8a-7515-4ba6-bd07-499f21d7b9c0` — 62 recorded steps, 12 tool actions, 1 context checkpoints (earlier turns were truncated by Antigravity). Source: `antigravity`.*
