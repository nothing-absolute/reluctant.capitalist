---
title: "OpenPlotter Kickstarter Campaign Plan"
description: "**OpenPlotter: The Chartplotter You Actually Own**"
date: "2026-09-23"
status: "concept"
stage: "idea"
tags: []
source: "Projects/Kickstarter/OpenPlotter-Boat-Monitor/OpenPlotter_Kickstarter_Campaign_Plan.md"
---
## OpenPlotter — Kickstarter Campaign Plan

### 1. CAMPAIGN PAGE DRAFT

#### Headline
**OpenPlotter: The Chartplotter You Actually Own**

#### Subtitle
An open-source marine GPS chartplotter built on a Raspberry Pi — free NOAA charts, no subscriptions, no lockouts, schematics published forever. Built by boaters, for boaters.

#### Story

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
- **Founders Circle** — for the mariners, installers, and small marine businesses who want to fund this without a single dollar of venture capital touching it. No board seats. No exit pressure. No"growth-at-all-costs." Just people who are tired of the current setup putting money behind the alternative.

**OUR PLEDGE**

We will never take VC money. We will never add a subscription. We will never lock a feature behind a paywall you didn't sign up for. Every schematic, every line of firmware, every CAD file goes on GitHub — not as a marketing gesture, but because if this company disappears tomorrow, the project should still be alive and buildable by anyone with a soldering iron and an afternoon.

You should own your navigation equipment as completely as you own your boat. That's it. That's the whole pitch.

#### Risks and Challenges

We're not going to pretend this is risk-free — here's what could go wrong and what we're doing about each one, in plain language:

- **Component pricing is moving under us.** DRAM shortages have pushed Raspberry Pi pricing up over the last year, and tariff rates on China-sourced components are genuinely unsettled in 2026. We've built margin buffer into every tier's pricing and BOM (see the BOM Verification section) specifically to absorb this, and we'll publish quarterly cost updates so backers can see our math, not just our promises.
- **Marine electronics has a higher bar for reliability than a hobby project.** A chartplotter that locks up mid-channel is a genuine safety problem, not just an inconvenience. We're running every unit through a 24-hour burn-in and GPS-lock test before it ships, and Tier 2 goes through additional environmental (vibration, thermal, water ingress) testing before manufacturing scale-up.
- **We're a small team taking on hardware manufacturing at scale for the first time.** This is real. Our mitigation is conservative initial run sizes, a fulfillment plan built for staged shipping rather than one all-at-once blast (see Fulfillment Strategy), and full transparency about timelines including likely slippage.
- **NMEA 2000 certification and FCC/CE compliance take time and money we don't fully control.** We've scoped this in the Regulatory section below with realistic timelines, and Tier 1 ships first specifically because it clears the regulatory bar faster than Tier 2's from-scratch board.

If a delay happens, you'll hear about it from us before you have to ask.

#### FAQ

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

### 2. VIDEO SCRIPT (3 minutes)

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

VO (over the install): "This is the pre-assembled tier. Four screws, two wires, powered on. GPS lock in under a minute. No subscription screen. No account creation. No 'accept these terms to continue.' It just works, because we didn't build in a reason for it not to."

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

### 3. DETAILED BOM VERIFICATION (Qty 100 / 500 / 1000)

#### Context on your source numbers

Two of your input assumptions are directionally correct and worth flagging up front, since they change unit economics materially:

- **Raspberry Pi 5 4GB pricing.** Raspberry Pi Foundation has pushed through multiple price increases since late 2025 due to the LPDDR4 DRAM shortage driven by AI datacenter demand — the 4GB unit moved from roughly $70 toward the $95–$110 range depending on when you're sourcing, with the Foundation describing this as tied to memory market conditions it can't fully control and hasn't committed to a reversal timeline. Your $110 figure is plausible for mid-2026 distributor pricing but should be treated as a moving target, not a locked-in number — build a re-quote checkpoint into your production schedule.
- **Tariff exposure on China-sourced components.** As of mid-2026, the effective US tariff rate on Chinese-origin electronics generally runs in the ~30–35% range (a 10% flat surcharge stacked with a 25% sector-specific duty on most manufactured electronics), down from the much higher rates seen during 2025 but still a real and volatile cost layer — this stack is subject to a scheduled expiration in July 2026 with likely replacement rather than removal, so it should be modeled as durable, not temporary. This applies to your touchscreen, GPS HAT components, and 3D-printed enclosures if sourced from Chinese manufacturers, and does NOT apply to the Raspberry Pi itself (UK/other-origin) or to components you source domestically for Tier 2.

#### Tier 1 — Full Kit ($199 pledge), landed COGS by volume

| Item | Qty 100 | Qty 500 | Qty 1000 | Notes |
|---|---|---|---|---|
| Raspberry Pi 5 4GB | $105 | $98 | $92 | Distributor pricing improves modestly with volume but is capped by the DRAM market, not by your order size. Model at $100 avg through 2026. |
| 7" IPS touchscreen (1024x600) | $46 | $38 | $34 | Your $38 figure holds at 500-unit MOQ from most Shenzhen suppliers; qty 100 typically doesn't hit that price break. |
| NEO-M9N GPS HAT (module+PCB+assembly+ant) | $28 | $25 | $22 | JLCPCB assembly pricing scales meaningfully past 500 units. |
| 32GB microSD (pre-flashed) | $7 | $6 | $5.50 | |
| 12V→5V buck converter | $3.50 | $3 | $2.75 | |
| 3D-printed enclosure (SLS nylon) | $11 | $8 | $6.50 | SLS pricing drops sharply past 500 units; below that, consider vacuum casting instead. |
| Cables/connectors/fuse/mount | $6 | $5 | $4.50 | |
| **Subtotal, components** | **$206.50** | **$183** | **$167.25** | |
| **Import duty (China-origin components only, ~32% on touchscreen + GPS HAT PCB + enclosure)** | **+$27** | **+$22** | **+$19** | Applied to touchscreen, HAT assembly, and enclosure; Pi itself is not China-origin. |
| Freight (air, per-unit allocated) | $6 | $3.50 | $2.75 | Ocean freight becomes viable above ~500 units and cuts this further but adds 4-6 weeks lead time. |
| Software labor (imaging + QA, amortized) | $5 | $5 | $5 | |
| Packaging + printed manual | $4 | $3 | $2.50 | |
| **Landed COGS** | **$248.50** | **$216.50** | **$196.50** | |
| Kickstarter + payment processing (~8% platform+CC combined) | $16 | $16 | $16 | Applied to $199 pledge price |
| Fulfillment (pick/pack/label, domestic) | $6 | $5 | $4.50 | |
| **All-in cost per unit** | **$270.50** | **$237.50** | **$217** | |
| **Pledge price** | $199 | $199 | $199 | |

**This is the finding that matters:** at qty 100 and even at qty 500, the Full Kit as priced is **underwater** — costing more to build and ship than the $199 pledge collects, before you've paid for tooling, marketing, warranty reserve, or your own time. It only becomes marginally viable around qty 1000, and even then margin is thin (roughly break-even, not profitable). You have three real options: raise the Full Kit pledge price to $229–$249, set a minimum funding threshold that guarantees you clear 1,000+ units before committing to production, or accept Tier 1 as a loss-leader/community-building tier subsidized by Tier 2 margin. We'd recommend a combination of the first two.

#### Tier 1 — Premium Pre-Assembled ($299 pledge)

Add to Full Kit landed COGS: assembly labor (~25 min/unit at $18/hr fully burdened = $7.50), burn-in test rig time (~$3/unit amortized), and QC/certification labor (~$4/unit). That adds roughly $14.50 to the qty-1000 landed cost, bringing all-in cost to about **$231.50**, against a $299 pledge — this tier has real margin (~$67, before CC fees already counted above) and should be the one you push hardest in campaign messaging.

#### Tier 1 — Bring Your Own Pi ($99 pledge)

Subtract the Pi, touchscreen, and buck converter from the Full Kit BOM (customer supplies these): remaining components (GPS HAT, SD card, enclosure, cables, software labor, packaging) land around $46–$52 depending on volume, plus duty (~$8) and freight (~$2) — landed COGS around **$58–$62**, plus $8 platform/CC fee and $4 fulfillment = **~$70–$74 all-in** against a $99 pledge. This is your healthiest margin tier per dollar and the easiest to fund early, since it needs the least capital tied up in inventory.

#### Tier 2 — Built in the USA ($549–$749 target)

| Item | Qty 100 | Qty 500 | Qty 1000 | Notes |
|---|---|---|---|---|
| CM5 4GB module | $78 | $75 | $70 | |
| Custom 4-layer PCB (US fab) | $22 | $12 | $9 | Your $12 figure needs 500+ units; small-run US PCB fab runs notably higher per unit. |
| PCB assembly (US CM) | $45 | $30 | $24 | Your $30 is right at qty 500; US contract manufacturers typically want 500+ to hit that rate, and $45 is realistic at qty 100. |
| CNC billet aluminum enclosure (US) | $95 | $65 | $52 | CNC time dominates cost here; qty 100 is meaningfully worse than qty 500 because setup/programming cost amortizes less. |
| 1000-nit optically-bonded 7" display | $110 | $95 | $85 | |
| NMEA 2000 isolation + connector | $20 | $18 | $16 | |
| Power supply + transient protection | $9 | $8 | $7 | |
| Misc connectors/hardware/packaging | $17 | $15 | $13 | |
| **Subtotal, components** | **$396** | **$318** | **$276** | |
| Domestic freight/handling | $8 | $5 | $4 | No import duty — US-made |
| Assembly/final QA labor | $35 | $28 | $24 | Higher-touch than Tier 1 |
| Environmental test (vibration/thermal/IP67 verify, amortized) | $15 | $9 | $6 | |
| **Landed COGS** | **$454** | **$360** | **$310** | |
| CC/platform fees (~8% of $649 mid-point pledge) | $52 | $52 | $52 | |
| Fulfillment | $10 | $8 | $7 | |
| **All-in cost per unit** | **$516** | **$420** | **$369** | |
| **Target pledge (7" version)** | $549 | $549 | $549 | |

Your $549–$749 target range holds up reasonably well at qty 500+, with real margin at qty 1000 (~$180/unit) that funds the lifetime repair guarantee reserve fund discussed below. At qty 100, margin is thin (~$33/unit) and doesn't leave room for warranty reserve — Tier 2 should carry a stated minimum order quantity (recommend 300+) before committing to a production run, communicated openly in the campaign so backers understand why Tier 2 might ship later than Tier 1.

#### Cross-cutting cost notes for all tiers
- Build a **10% BOM contingency line** into every tier given DRAM and tariff volatility — none of the above numbers should be treated as locked for a campaign that funds today and ships in 6-9 months.
- Kickstarter's own platform fee is 5%, plus payment processing (typically ~3-5% combined depending on card mix and region) — the 8% figure used above is a reasonable blended estimate but confirm current rates before finalizing pricing.
- International backer shipping (EU, AU, etc.) is **not included above** and should be quoted separately per region — add $15-40/unit depending on destination and add import VAT/duty disclosure language to the FAQ so EU backers aren't surprised at their border.

### 4. SOFTWARE DEVELOPMENT PLAN

Vanilla OpenCPN + Signal K gets you 70% of the way there. The remaining 30% is what makes this a product instead of a science project, and it's where your actual engineering budget should go:

1. **One-click NOAA chart downloader/updater.** A background service that checks NOAA's ENC (Electronic Navigational Chart) distribution service on a schedule or on-demand, downloads updates for the region the unit is in (via last-known GPS position), and installs them into OpenCPN without the user touching a file system. This is the single highest-value piece of custom software — it's the difference between "technical hobbyist tool" and "appliance."
2. **Pi-specific display calibration tool.** A first-boot wizard for touchscreen calibration, brightness/contrast presets tuned for direct sunlight vs. night mode (red-shift night palette is standard in marine nav — OpenCPN supports this but needs a simplified UI wrapper for non-technical users), and auto-rotation handling for portrait/landscape mounting.
3. **Waterproof/glove/wet-finger touch calibration.** Capacitive touchscreens behave unpredictably with wet fingers or through the water film common on an open boat. This needs either a resistive-touch hardware option for Tier 1 base config, or a software debounce/sensitivity-threshold layer tuned specifically for marine conditions (this exists in aftermarket automotive touch firmware and is portable with real engineering effort — budget for a dedicated sprint, not a quick patch).
4. **NMEA 2000 plugin/gateway.** OpenCPN has NMEA 2000 support via plugins (e.g., existing open-source PGN parsing libraries), but production-grade support for autopilot control, engine data display, and wind/depth instrument integration needs real integration testing against actual NMEA 2000 hardware from multiple vendors (Garmin, Raymarine, Actisense gateways) to avoid support tickets down the road.
5. **First-boot onboarding flow.** Wi-Fi setup, chart region selection, boat profile (draft, length, beam — used for anchor alarm and grounding warnings), and account-free operation by default (no forced cloud login) — this is where you differentiate on philosophy, not just price.
6. **AIS via RTL-SDR plugin polish.** The dongle side works out of the box with existing open-source tools (rtl-ais, dAISy-adjacent projects); the work is a clean OpenCPN-integrated setup flow so a non-technical user can plug in the SDR dongle and see targets within minutes.
7. **Update mechanism that respects "no forced updates."** Build an opt-in update channel (security patches auto-apply, feature updates require explicit consent) — this needs to be built deliberately, since most embedded Linux update tooling defaults to auto-everything.
8. **Anchor alarm / track recording / basic routing** — largely available in OpenCPN already; budget for UI simplification and Pi-performance tuning (chart rendering at speed on a Pi 5 vs. a desktop) rather than new feature development.

**Not recommended for launch (roadmap items, not commitments):** radar overlay (requires licensing/integration work with specific radar hardware vendors and is a multi-month effort on its own), full weather routing, multi-unit networking/sync between helm and flybridge stations. Naming these explicitly as "future roadmap, not launch commitment" protects you from backer expectation-setting problems.

### 5. REGULATORY DEEP-DIVE

**FCC — Part 15 (unintentional/intentional radiators).** The Raspberry Pi 5 itself is already FCC-certified as a component (it carries its own FCC ID). Your obligation is at the *system* level: once you integrate the Pi, GPS HAT, display, and enclosure into a product you sell, you're the "responsible party" and need to verify the assembled system doesn't create new emissions issues beyond what the certified sub-components already cover. In practice, most integrators of pre-certified boards can qualify under a simplified compliance path (Class B verification/Declaration of Conformity for unintentional radiators) rather than a full new certification, IF you haven't added your own RF-emitting components beyond what's already certified. Your GPS module (GNSS receive-only, not a transmitter) typically doesn't trigger additional intentional-radiator rules, but confirm this with the specific NEO-M9N module's existing FCC documentation from u-blox — most u-blox modules ship pre-certified as modular components, which simplifies your path considerably. **Do not skip this** — get a compliance consultant or test lab to confirm your specific integration before you ship units; this is a few thousand dollars well spent versus a recall risk.

**CE marking (EU backers).** Similar logic to FCC but a separate, mandatory process for anything shipped to EU addresses — CE marking requires a Declaration of Conformity covering EMC Directive, and if the device could be seen as a radio device (GPS receiver), the Radio Equipment Directive (RED) as well. Realistically: budget for EMC pre-compliance testing at a lab (a few thousand dollars per major hardware revision) before committing to ship Tier 1 or Tier 2 to EU backers on the initial campaign timeline. A common and legitimate approach for a first Kickstarter run: offer EU shipping as a stretch goal or delayed-ship option specifically pending CE testing completion, rather than promising simultaneous global ship dates you can't back up yet.

**Liability / "not for primary navigation" framing.** This needs to appear in three places, each with slightly different legal weight: (1) prominently on the campaign page itself, not buried in the FAQ, (2) as a physical label on the unit and in the printed manual, and (3) inside a clickthrough disclaimer on first boot of the software. The core language marine electronics manufacturers use (and you should mirror, not reinvent): the device is a navigational aid intended to supplement, not replace, official paper charts, a magnetic compass, and prudent seamanship; it is not certified for use as a sole means of navigation under any flag-state or Coast Guard carriage requirement; the manufacturer is not liable for damages arising from reliance on the device as a primary navigation source. Get this reviewed by an attorney familiar with product liability in recreational marine electronics specifically (a general product liability attorney without marine-specific experience can miss carriage-requirement nuances) — this is not a place to use boilerplate you found online.

**One more regulatory item not in your original list worth flagging: NMEA 2000 certification itself.** True "NMEA 2000 certified" is a trademark-protected certification process through the National Marine Electronics Association, involving conformance testing and a licensing fee — it is not automatic just because you support the protocol. You can build NMEA 2000 *compatible* hardware and say so accurately without paying for formal certification, but you cannot use the certified logo/trademark without going through it. Budget this as a Tier 2 post-launch initiative rather than a day-one requirement — most backers care that it works, not that it carries the trademark.

### 6. FULFILLMENT STRATEGY (2,000+ backers, 3 tiers, 6 SKUs)

The core risk with a multi-tier hardware Kickstarter isn't building the product — it's the logistics of shipping six different configurations to thousands of addresses without your team drowning in it. Recommended approach:

1. **Stage shipping by tier, don't try to ship everything simultaneously.** Ship Tier 1 (BYO Pi, then Full Kit, then Premium) in waves as regulatory/manufacturing clears, with Tier 2 shipping last given its longer manufacturing and certification runway. Communicate this staging explicitly in the campaign so nobody expects simultaneous delivery.
2. **Use a third-party fulfillment center for Tier 1, not in-house shipping.** At 2,000+ units across three SKUs, in-house pick-and-pack becomes a full-time job you didn't budget for. A 3PL that handles Kickstarter-scale hardware fulfillment (several specialize specifically in crowdfunded hardware) can receive palletized inventory from your assembler, handle address changes/refunds/lost packages, and give you tracking integration — budget $4-8/unit for this depending on package size and destination mix.
3. **Batch by geography, not by pledge date.** Group domestic US shipments as the first wave (fastest, cheapest, least regulatory friction), then Canada, then EU (pending CE clearance), then rest-of-world. This lets you start fulfilling and generating goodwill/reviews before the slowest regulatory path resolves.
4. **Build a public shipping dashboard, updated at least biweekly.** Crowdfunded hardware campaigns lose backer trust fastest through silence, not through delay — a simple public page showing "Tier 1 BYO Pi: shipped 340/500" does more for your reputation than a perfect on-time record with no visibility.
5. **Tier 2's from-scratch board means a hardware revision cycle is likely.** Budget for a pilot run of 25-50 units shipped to your most engaged Founders Circle backers first, explicitly framed as an early-access/beta cohort, before the full Tier 2 production run — this catches manufacturing defects before they're in 500 units instead of after.
6. **Address SKU complexity by minimizing configurable options.** Six SKUs (3 Tier 1 sub-tiers + 2 Tier 2 screen sizes + Founders Circle physical rewards) is manageable; resist backer requests for additional customization (screen size options within Tier 1, color choices, etc.) during the campaign — each added option multiplies fulfillment complexity nonlinearly, not linearly.
7. **Reserve 3-5% overage inventory per SKU** for warranty replacements, DOA units, and lost-in-transit claims — this is standard practice and should be modeled into your BOM contingency, not treated as a surprise cost later.

### 7. ANTI-VC GOVERNANCE STRUCTURE

You have real options here, each with different tradeoffs — this isn't a one-size-fits-right answer, and you should get an actual attorney to finalize whichever direction you pick, but here's the honest landscape:

- **Public Benefit Corporation (PBC), Delaware or your home state.** Keeps you a standard for-profit corporation (simplest for handling manufacturing, contracts, and hardware sales) but legally requires directors to balance shareholder profit against a stated public benefit — in your case, something like "advancing open-source marine electronics and equipment repairability." This does NOT by itself prevent a future VC round or acquisition; it constrains *how* the company must weigh decisions, not who can invest. Most hardware companies choose this or plain C-corp/LLC for the for-profit manufacturing entity.
- **L3C (low-profit limited liability company).** Legally available in a handful of states, designed to blend charitable purpose with limited profit motive — in practice, L3Cs have fallen out of favor because they don't reliably qualify for the program-related-investment tax treatment they were designed around, and several states have repealed their L3C statutes. Not recommended as your primary structure in 2026 given this trend — mention it to your attorney but expect them to steer you elsewhere.
- **Cooperative (worker or purchaser co-op).** Genuinely locks out VC-style equity investment by design (co-ops are member-owned, not shareholder-owned), which directly serves your "no VC ever" pledge in the strongest legally binding way available. Tradeoff: co-ops are unfamiliar to most contract manufacturers, banks, and component suppliers, which can create friction in day-to-day business operations, and raising the working capital needed for hardware manufacturing (which requires real upfront cash for tooling and inventory) is structurally harder without an equity-sale option. Best fit if your Founders Circle backers are meant to become actual voting members, not just donors with a say.
- **Fiscal sponsorship for the open-source/nonprofit side, paired with a separate for-profit manufacturing entity.** This is likely your best practical structure: a 501(c)(3) fiscal sponsor (an existing nonprofit that houses your open-source project, accepts tax-deductible donations for the "keep the schematics free forever" mission) sits alongside a normal for-profit LLC or PBC that manufactures and sells hardware. This is exactly the split you already described in Tier 3 ("straight donation — 100% tax-deductible through 501(c)(3) fiscal sponsor for open-source development" alongside the revenue-share option) — you've essentially already designed this structure; it just needs to be formalized with an actual fiscal sponsor agreement (organizations like Software in the Public Interest, or a boating-focused nonprofit, could plausibly serve this role) before the campaign launches, since backers pledging at the "donation" option need it to be real and tax-deductible on day one, not "coming soon."
- **Making the "no lockout forever" promise legally binding, not just a stated value.** The mechanism that actually works here: place the core schematics, firmware, and CAD files under an irrevocable open-source license (e.g., CERN-OHL for hardware, GPL or similar for firmware) filed with a timestamped public commit *before* or *during* the campaign, not after funding closes. Once code/hardware designs are released under an OSI-approved or equivalent open license, that release cannot be legally revoked — the company can stop maintaining the project, but it cannot retroactively make already-published designs proprietary. This is a stronger and more enforceable guarantee than a corporate charter clause, and it's worth stating explicitly in the campaign FAQ so backers understand *why* it's binding rather than just trusting a promise.

**Recommended combination:** For-profit PBC or LLC for manufacturing + a fiscal-sponsor relationship for the open-source/donation side + irrevocable open-source licensing of all technical designs, published incrementally starting with the campaign launch. This gets you real legal teeth on the "can't be taken away" promise without requiring an unfamiliar-to-vendors co-op structure for the manufacturing operations.

### 8. SALES PROJECTIONS

Using your Amazon monthly sell-through figures as a market-size sanity check (not a direct predictor — Kickstarter backers and Amazon shoppers are different populations with different intent, but the numbers tell you the addressable market exists and roughly how big it is):

| Scenario | Tier 1 backers | Tier 2 backers | Founders Circle | Total revenue (gross, pre-fees) |
|---|---|---|---|---|
| **Conservative** | 400 (mostly Full Kit) | 40 | 15 backers, avg $800 | ~$115,000 |
| **Moderate** | 1,100 | 150 | 40 backers, avg $1,200 | ~$370,000 |
| **Aggressive** | 2,400 | 400 | 100 backers, avg $1,800 | ~$920,000 |

Reasoning behind these bands: the RTL-SDR data point you provided (500-1,000 units/month already selling into the marine AIS niche at $34, with no marine-branded competitor coming close) is the strongest signal in your data that a meaningful population of boaters is already comfortable buying open-source-adjacent, non-brand-name marine electronics — that population is your realistic Tier 1 addressable market, and it's larger than the premium chartplotter buyer population (Garmin's 12" unit selling only ~23/month at $3,960 shows the very top of the market is small, which is exactly the segment Tier 2 should NOT try to compete head-on against on volume — Tier 2's realistic ceiling is closer to the low-hundreds-of-units range for a first campaign, not thousands). The conservative scenario assumes minimal outside press and word-of-mouth only within existing DIY-marine-electronics communities (forums like Panbo, r/sailing, the OpenCPN user community). The moderate scenario assumes modest boating-press pickup (a feature in a sailing/boating publication or YouTube channel with meaningful reach). The aggressive scenario assumes broader tech-press pickup (the Garmin-vs-$299 framing has real "hacker news front page" potential) driving backers well outside the existing boating-DIY audience.

**Recommend setting your public funding goal at the low end of Conservative** (e.g., $75,000-$90,000) — this is standard Kickstarter strategy (a reachable goal builds early momentum and social proof) even if your internal planning targets Moderate, and structure stretch goals around unlocking Tier 2 screen size options or EU shipping rather than around headcount targets that could pressure you into overcommitting on units you can't profitably fulfill (see the Tier 1 Full Kit margin problem flagged in the BOM section above).

### 9. RISK MATRIX — TOP 10 RISKS, RANKED

| Rank | Risk | Likelihood | Impact | Mitigation |
|---|---|---|---|---|
| 1 | **Raspberry Pi / component pricing continues rising during production window** | High | High | Lock in a supplier quote with a defined validity window before finalizing pledge pricing; build 10% BOM contingency; consider a bulk pre-purchase of Pi units near campaign close to freeze cost if cash flow allows |
| 2 | **Tier 1 Full Kit tier is underwater on margin at low-to-mid volume (see BOM section)** | High (already identified) | High | Raise pledge price, set a hard minimum-quantity threshold before committing production, or explicitly subsidize from Tier 2 margin — decide before launch, not after funding |
| 3 | **Tariff volatility on China-sourced sub-components (touchscreen, GPS HAT PCB, enclosure)** | High | Medium-High | Model at current ~32% effective rate as a durable planning assumption, not temporary; investigate whether a Vietnam-based assembler is viable for touchscreen/enclosure sourcing given the more favorable current rate structure there |
| 4 | **NMEA 2000 / marine environmental reliability failures post-ship (safety-relevant product)** | Medium | High | 24-hour burn-in on every unit; pilot batch of Tier 2 to engaged early backers before full production run; clear "not for primary navigation" disclaimer reduces liability exposure but doesn't reduce reputational risk of failures |
| 5 | **Returns/support burden from user error (DIY assembly tiers, non-technical backers underestimating soldering/setup difficulty)** | Medium-High | Medium | Clear tier descriptions with honest skill-level framing; video assembly guide; consider a "skill check" quiz or explicit warning before allowing BYO-Pi pledges; community Discord/forum for peer support to reduce direct support load |
| 6 | **Shipping damage (fragile displays, aluminum enclosures with tight tolerances)** | Medium | Medium | Custom-fit packaging tested with drop tests before full production; insurance on high-value Tier 2 shipments; clear unboxing/damage-claim process published upfront |
| 7 | **CE/FCC compliance delays pushing back EU or even US ship dates** | Medium | Medium-High | Start compliance testing engagement immediately at campaign launch, not after funding closes; stage EU shipping as explicitly delayed/stretch-goal-gated rather than promised on the base timeline |
| 8 | **Manufacturing partner (US CM for Tier 2) can't hit qty-500 pricing at your actual order size** | Medium | Medium | Get binding quotes at your realistic first-run quantity, not aspirational future volume, before setting Tier 2 pledge price; qualify a second-source CM as backup |
| 9 | **Founders Circle high-dollar tiers ($10K/$50K) don't fill, undermining both the funding and the "community governance" narrative** | Medium | Low-Medium | Don't build these into your baseline funding-goal math; treat them as upside, and have a credible plan (personal outreach to marine installers, boatyards, co-ops you already know) rather than hoping the campaign page alone sells them |
| 10 | **Open-source licensing gets challenged or a component vendor's own licensing (e.g., a proprietary chart format, a closed driver) creates a legal snag in the "fully open" claim** | Low-Medium | Medium | Legal review of every third-party component's license before publishing the "100% open, forever" claim publicly; be precise in campaign language about what's open (your designs/firmware) vs. what necessarily isn't (e.g., certain chip vendor driver blobs, if any) |

*This document is a planning draft, not legal, tax, or regulatory advice. The BOM, tariff, and pricing figures reflect research current as of mid-2026 and should be re-verified against live supplier quotes before finalizing campaign pledge pricing — component and tariff conditions in this market have been moving month to month. Have the governance structure, liability disclaimers, and FCC/CE compliance approach reviewed by qualified counsel before launch.*
