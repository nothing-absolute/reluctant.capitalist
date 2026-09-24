---
title: "OpenPlotter Kickstarter Campaign Plan"
description: "A detailed plan for a Kickstarter campaign for OpenPlotter, an open-source marine chartplotter built on a Raspberry Pi with free NOAA charts and repairable hardware."
date: "2026-09-23"
status: "concept"
stage: "idea"
tags: ["project/kickstarter","project/openplotter","topic/ai","type/concept","concept/obsolescence","concept/pkm"]
source: "Projects/Kickstarter/OpenPlotter-Boat-Monitor/OpenPlotter_Kickstarter_Campaign_Plan.md"
---
### OpenPlotter — Kickstarter Campaign Plan

#### 1. CAMPAIGN PAGE DRAFT

##### Headline
**OpenPlotter: The Chartplotter You Actually Own**

##### Subtitle
An open-source marine GPS chartplotter built on a Raspberry Pi — free NOAA charts, no subscriptions, no lockouts, schematics published forever. Built by boaters, for boaters.

##### Story

**THE PROBLEM**

Marine electronics is a $4 billion industry, and it's been running the same play for twenty years: take hardware that costs less every year to build, and charge more for it every year, because you've got a captive customer standing at the helm with no other option.

A Garmin ECHOMAP 54cv — a 5-inch screen — costs $400 and runs on a processor slower than a phone from 2015. Step up to the 9-inch touchscreen model and you're at $1,100. Want a 12-inch unit? $3,960. Raymarine's autopilot bundle runs $1,500. And after you've paid all that, you're often still paying an annual subscription for chart data that the National Oceanic and Atmospheric Administration gives away for free, to everyone, right now.

Meanwhile, a Raspberry Pi, a $38 sunlight-readable touchscreen, and a $12 GPS module can run the same core job — position, charts, tracks, routes, AIS — using entirely open-source software that's been in daily use on cruising boats for over a decade. The hardware to do this well has existed for years. Nobody's just... built it and sold it to you assembled, warrantied, and ready to bolt to your dash. So we are.

If your chartplotter dies outside the warranty window today, you throw it out and buy another one. You can't get a schematic. You can't get a parts list. You can't fix it yourself, and the manufacturer doesn't want you to — a dead unit is a new sale.

**THE SOLUTION**

OpenPlotter is a marine chartplotter built around three ideas: the hardware should be repairable, the software should be free, and the charts should cost nothing, because they already do.

We're building it in three tiers, because "open source" means different things to different people on the water:

- **Build It Yourself** — a kit (or bare parts, or a fully assembled unit) built on Raspberry Pi 5, running OpenCPN and Signal K, with NOAA vector charts pre-loaded. Choose your level of involvement, from soldering nothing to soldering everything.
- **Built in the USA** — the version for people who want marine-grade durability without giving up any of the philosophy: a custom board (no HAT stack hanging off the back), a CNC-machined aluminum enclosure rated IP67, an optically-bonded sunlight-readable display, and a lifetime repair guarantee backed by published schematics.
- **Founders Circle** — for the mariners, installers, and small marine businesses who want to fund this without a single dollar of venture capital touching it. No board seats. No exit pressure. No "growth-at-all-costs." Just people who are tired of the current setup putting money behind the alternative.

**OUR PLEDGE**

We will never take VC money. We will never add a subscription. We will never lock a feature behind a paywall you didn't sign up for. Every schematic, every line of firmware, every CAD file goes on GitHub — not as a marketing gesture, but because if this company disappears tomorrow, the project should still be alive and buildable by anyone with a soldering iron and an afternoon.

You should own your navigation equipment as completely as you own your boat. That's it. That's the whole pitch.

##### Risks and Challenges

We're not going to pretend this is risk-free — here's what could go wrong and what we're doing about each one, in plain language:

- **Component pricing is moving under us.** DRAM shortages have pushed Raspberry Pi pricing up over the last year, and tariff rates on China-sourced components are genuinely unsettled in 2026. We've built margin buffer into every tier's pricing and BOM (see the BOM Verification section) specifically to absorb this, and we'll publish quarterly cost updates so backers can see our math, not just our promises.
- **Marine electronics has a higher bar for reliability than a hobby project.** A chartplotter that locks up mid-channel is a genuine safety problem, not just an inconvenience. We're running every unit through a 24-hour burn-in and GPS-lock test before it ships, and Tier 2 goes through additional environmental (vibration, thermal, water ingress) testing before manufacturing scale-up.
- **We're a small team taking on hardware manufacturing at scale for the first time.** This is real. Our mitigation is conservative initial run sizes, a fulfillment plan built for staged shipping rather than one all-at-once blast (see Fulfillment Strategy), and full transparency about timelines including likely slippage.
- **NMEA 2000 certification and FCC/CE compliance take time and money we don't fully control.** We've scoped this in the Regulatory section below with realistic timelines, and Tier 1 ships first specifically because it clears the regulatory bar faster than Tier 2's from-scratch board.

If a delay happens, you'll hear about it from us before you have to ask.

##### FAQ

**Is this legal for primary navigation?**
No, and we're not going to pretend otherwise. OpenPlotter, like the vast majority of chartplotters on the market including plenty of expensive ones, ships as a navigational aid, not a certified sole means of navigation. Keep paper charts aboard. See the Regulatory section for exactly how we frame this in writing.

**Why not just build this myself right now for less money?**
You can! The Full Kit and Bring Your Own Pi tiers exist specifically for people who want to do exactly that, with the sourcing and assembly work done for them and a support community behind it. If you'd genuinely rather source every part yourself, our GitHub repo (live from day one of the campaign) has the complete BOM, PCB files, and assembly guide for free. We'd rather you build one than not have one.

**What happens if OpenPlotter the company shuts down?**
Every schematic, every CAD file, every line of firmware is published on GitHub under an open license, updated continuously, not just dumped at the end. If we disappear, anyone can keep building these boards. That's a structural commitment, not a marketing line — see the Anti-VC Governance section for how we're making it binding.

**Why is Tier 2 so much more expensive than Tier 1 if it's the same philosophy?**
Different manufacturing reality. Tier 1 uses off-the-shelf components assembled in volume overseas. Tier 2 is a from-scratch board built and assembled in the US, in a CNC-machined marine enclosure, with a premium optically-bonded display — the same panel class used in Furuno and Raymarine units. US labor and machining cost more. We've priced it to cover that honestly, not to pad margin.

**Do you support AIS, radar, autopilot integration?**
AIS via RTL-SDR dongle (a $34 device already outselling every marine-brand AIS receiver, and one reason we know there's appetite for this) is supported at launch through a plugin. NMEA 2000 (for autopilot, engine data, wind/depth instruments) is native on Tier 2 and via a USB gateway on Tier 1. Radar overlay is on the software roadmap but not committed for launch — see the Software Development Plan.

**What if I back Tier 1 and want to upgrade to Tier 2 later?**
Your OpenCPN configuration, routes, and waypoints live on the SD card / storage and are portable between units — moving up is a data migration, not a rebuild.

**Why should I trust pledge levels this high in Founders Circle ($10K, $50K)?**
Those tiers exist for marine businesses and professional mariners who want influence over the roadmap, not just a product. We're not asking retail backers to pledge at that level — see the Founders Circle description for exactly what each tier includes and why it's structured as a mission investment, not an equity stake.

#### 2. VIDEO SCRIPT (3 minutes)

**[0:00–0:20] COLD OPEN — The side-by-side]**
*Shot: Static tripod shot, boat helm console. Left side: Garmin ECHOMAP 93sv running. Right side: OpenPlotter prototype, same charts loaded, same zoom level, side by side on the same dash.*

VO (plainspoken, slightly annoyed, not shouty): "This one costs eleven hundred dollars. This one costs two-ninety-nine. They're showing you the exact same NOAA chart data — because it's the same free data. The only difference is what you paid to look at it."

*Beat. Cut to price tags overlaid on screen: $1,100 vs $299.*

**[0:20–0:50] THE PROBLEM]**
*Shot: Hands scrolling through a marine electronics retailer site — prices climbing across models. Cut to a torn-open dead chartplotter on a workbench, clearly proprietary, no visible fasteners meant to be opened.*

VO: "Marine electronics has run the same playbook for twenty years. Hardware gets cheaper. Prices don't. And when it breaks — and it will — you can't fix it. You can't even open it. You just buy another one."

*Cut to a phone screen: NOAA chart download page, free, public.*

VO: "Meanwhile the charts themselves? Free. Public. Yours already."

**[0:50–1:40] THE SOLUTION / INSTALL DEMO]**
*Shot: Time-lapse-style but real-time-feeling — a guy (weathered hands, actual boat, not a studio) unboxing the Premium Pre-Assembled unit, mounting it to a dash bracket, running power leads to a 12V source, powering on. GPS lock happens on screen. Total elapsed real time: under 5 minutes, shown with an unobtrusive on-screen timer.*

VO (over the install): "This is the pre-assembled tier. Four screws, two wires, powered on. GPS lock in under a minute. No subscription screen. No account creation. No "accept these terms to continue." It just works, because we didn't build in a reason for it not to."

*Cut to a hand pulling up the GitHub repo on a laptop — schematics, BOM, firmware visible.*

VO: "And if you want to know exactly what's inside — it's all right here. Every board. Every line of code."

**[1:40–2:20] TIER 2 MANUFACTURING]**
*Shot: CNC machine cutting a 6061 aluminum enclosure from billet stock, coolant running, chips flying — a satisfying, tactile manufacturing shot. Cut to the same enclosure, now anodized, being fitted with the optically-bonded display and custom PCB in a small US assembly shop.*

VO: "This is the Built-in-the-USA tier. Machined from solid aluminum block, not stamped. Sealed against the water it's going to live around. Built to be fixed, not replaced — if it breaks, we repair it at cost, or replace it at half price, forever. That's not a warranty gimmick. That's the business model."

**[2:20–2:50] THE PLEDGE]**
*Shot: Founder(s), on a boat, talking straight to camera. No branded backdrop, no studio lighting — a real cockpit, maybe underway at low speed.*

FOUNDER: "We're not taking VC money on this. No growth-at-all-costs pressure, no exit strategy, no boardroom telling us to add a subscription in year two. If you back this, you're backing the actual thing we said we'd build — because we've structured it so we can't quietly become the company we're replacing."

**[2:50–3:00] CLOSE / CTA]**
*Shot: Wide shot of the boat, OpenPlotter visible on the dash, chart data moving as the boat moves.*

VO: "OpenPlotter. Marine electronics for people who fix their own engines. Back it below."

*End card: logo, three tier prices, Kickstarter CTA.*

#### 3. DETAILED BOM VERIFICATION (Qty 100 / 500 / 1000)

##### Context on your source numbers

Two of your input assumptions are directionally correct and worth flagging up front, since they change unit economics materially:

- **Raspberry Pi 5 4GB pricing.** Raspberry Pi Foundation has pushed through multiple price increases since late 2025 due to the LPDDR4 DRAM shortage driven by AI datacenter demand — the 4GB unit moved from roughly $70 toward the $95–$110 range depending on when you're sourcing, with the Foundation describing this as tied to memory market conditions it can't fully control and hasn't committed to a reversal timeline. Your $110 figure is plausible for mid-2026 distributor pricing but should be treated as a moving target, not a locked-in number — build a re-quote checkpoint into your production schedule.
- **Tariff exposure on China-sourced components.** As of mid-2026, the effective US tariff rate on Chinese-origin electronics generally runs in the ~30–35% range (a 10% flat surcharge stacked with a 25% sector-specific duty on most manufactured electronics), down from the much higher rates seen during 2025 but still a real and volatile cost layer — this stack is subject to a scheduled expiration in July 2026 with likely replacement rather than removal, so it should be modeled as durable, not temporary. This applies to your touchscreen, GPS HAT components, and 3D-printed enclosures if sourced from Chinese manufacturers, and does NOT apply to the Raspberry Pi itself (UK/other-origin) or to components you source domestically for Tier 2.

##### Tier 1 — Full Kit ($199 pledge), landed COGS by volume

| Item | Qty 100 | Qty 500 | Qty 1000 | Notes |
|---|---|---|---|---|
| Raspberry Pi 5 4GB | $105 | $98 | $92 | Distributor pricing improves modestly with volume but is capped by the DRAM market, not by your order size. Model at $100 avg through 2026. |
| 7
