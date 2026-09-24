---
title: "OpenPlotter — Kickstarter Campaign Package"
description: "A detailed guide to the OpenPlotter Kickstarter campaign, including campaign page layout, product photography specs, brand and typography guide, and infographic specifications."
date: "2026-09-23"
status: "concept"
stage: "idea"
tags: ["project/kickstarter","type/idea","topic/content","concept/pkm","project/documentary","project/openplotter"]
source: "Projects/Kickstarter/OpenPlotter-Boat-Monitor/openplotter-kickstarter-campaign.md"
---
### OpenPlotter — Kickstarter Campaign Package
##### "The Marine Chartplotter You Actually Own"

This document contains: (1) the full campaign page copy and layout, (2) detailed production specs for 5–8 photo/render assets, (3) a brand and typography guide, and (4) specs for four infographics. Everything here is written to be handed directly to a photographer, 3D artist, or designer.

#### PART 1 — CAMPAIGN PAGE LAYOUT

##### Hero Block

**[IMAGE: Helm Comparison Shot — see Asset 1]**
Full-width hero image. OpenPlotter Premium mounted next to a Garmin ECHOMAP 93sv on a real helm, same chart loaded, price tags burned into the image as clean overlay type — not screenshots pasted in.

**Headline (Montserrat Bold, 56px, charcoal on white):**
> OPENPLOTTER
> The Marine Chartplotter You Actually Own

**Subhead (Source Serif, 22px, regular weight, ocean blue):**
> Same NOAA charts. Same GPS accuracy. A third of the price. And when it breaks, you fix it — because you have the schematics, not a warranty ticket number.

**CTA band:** Back This Project — funding bar, days left, backer count. Standard Kickstarter chrome, styled with our palette (see Part 3).

##### Section: The Problem

**[IMAGE: Split graphic — a padlock icon over a NOAA chart, with a subscription price ticking upward. See Asset callout in Part 2 for "gate" visual treatment.]**

**Body copy (Source Serif, 18px, high line-height for readability):**

Marine electronics companies didn't build a better chartplotter. They built a better toll booth.

NOAA charts are free. Public data, paid for by your taxes, updated by the federal government for everyone. But Garmin, Navico, and Raymarine will still charge you $150 a year to look at them, because the map isn't the product — the gate is.

The hardware markup is worse. A Garmin ECHOMAP 93sv — a 9" touchscreen chartplotter with GPS and sonar — retails for $1,100. Strip it down and you're looking at a Linux-adjacent embedded computer, a commodity touch panel, and a GPS chip that costs less than a good multitool. The rest is margin, brand tax, and a subscription trap waiting at setup.

Meanwhile a $34 RTL-SDR dongle — the same one hobbyists use for AIS, ADS-B, and ham radio — already outsells every dedicated marine AIS receiver on Amazon. The technology to do this cheaply has existed for years. Nobody with a marine electronics distribution deal had a reason to sell it to you.

**Pull quote (Monospace, teal, boxed):**
> "You've already paid for your charts. You've been paying for the gate."

##### Section: The Solution

**[IMAGE: Kit contents flat lay — Asset 3]**

**Body copy:**

OpenPlotter is a marine chartplotter built from parts you can buy from a dozen different vendors, running software you can read the source code of, doing a job that doesn't require permission from anybody.

It runs on a Raspberry Pi 5. It talks to your boat over NMEA 0183 and NMEA 2000. It loads NOAA raster and vector charts for free, forever, because they're supposed to be free. It reads AIS off a $34 dongle. It's built on OpenCPN and Signal K — mature, actively developed open-source marine software already trusted by cruisers doing ocean crossings.

We sell three tiers of the same idea: buy the parts and build it yourself, buy a kit and assemble it in an afternoon, or buy it built, tested, and ready to bolt to your helm. Above that, we sell a version built entirely in the USA on custom PCBs in a billet aluminum enclosure — for people who want the DIY philosophy with zero DIY required.

Every schematic, every board file, every line of firmware is public on GitHub right now. Not after the campaign funds. Now.

**[IMAGE: GitHub-on-laptop-on-boat — Asset 5, inset right-aligned within this section]**

##### Section: Our Pledge

**[FULL-WIDTH DARK BAND — charcoal background, white/amber type, no imagery. This section should look like a manifesto, not a marketing block.]**

**Header (Montserrat Bold, uppercase, letter-spaced):**
> THE PLEDGE

**Body (Monospace, JetBrains Mono, left-aligned like a terminal output or a legal document — deliberately unglamorous, deliberately hard to misread):**
```
We will never take venture capital.
We will never add a subscription.
We will never lock features behind a paywall.

Every schematic, every line of firmware, every CAD file
is on GitHub under an irrevocable open-source license —
published now, not after funding.

If this company disappears tomorrow, the project lives.
```

**Small caption beneath, Source Serif italic, muted:**
*No equity is offered or implied in any tier of this campaign. Founders Circle contributions are backer rewards and/or donations, not investment.*

##### Section: Install It In 5 Minutes

**[IMAGE: 5-panel install storyboard — Asset 4]**

Short intro line: "This isn't a home theater install. It's five steps and a GPS lock."

Panels run left to right beneath the section header, each with a one-line caption underneath in monospace.

##### Section: Built in the USA (Tier 2 feature section)

**[IMAGE: CNC machine shop shot — Asset 6, full width]**
**[IMAGE: CNC enclosure cutaway diagram — Asset 2, placed directly below as the technical follow-up to the tactile shot]**

Body copy:

The Tier 2 unit is machined from 6061 aluminum billet in a small machine shop in the United States, not stamped from injection-molded plastic in a factory you'll never see the inside of. It's IP67 sealed with an O-ring gasket you can actually replace. The display is optically bonded — no air gap, no fogging, no glare washout at noon. And it comes with a lifetime repair guarantee, because we publish the schematics, so "we don't make that part anymore" is never a sentence you'll hear from us.

##### Section: Founder Statement

**[IMAGE: Founder speaking to camera, underway, low speed — Asset 7. Embed as video if the campaign platform supports it; use a still as the thumbnail/fallback.]**

Short intro line above the video embed:
"No pitch deck. No greenroom. Just a boat and a camera."

##### Section: The Tiers

**[GRAPHIC: Tier comparison table — see Part 4, Graphic A]**

Full rendered comparison graphic, followed by expandable/scrollable Kickstarter reward tiles matching the standard platform format (image thumbnail, price, title, short description, estimated delivery) for each of: 1A, 1B, 1C, Tier 2, Tier 3.

##### Section: How Your Money Is Spent

**[GRAPHIC: Cost breakdown pie chart — Part 4, Graphic B]**

Intro line: "We're not going to pretend this is cheaper to make than it is. Here's the honest math on the Premium Pre-Assembled unit."

##### Section: Stretch Goals

**[GRAPHIC: Horizontal milestone progress bar — Part 4, Graphic C]**

##### Section: Risks and Challenges

**[GRAPHIC: Risk matrix — Part 4, Graphic D]**

Body copy (Kickstarter requires this section; keep it plain and specific, no boilerplate):

We're not going to tell you this is risk-free, because every hardware campaign has supply chain and fulfillment risk, and you deserve to see ours mapped out rather than waved away.

The two biggest: Raspberry Pi 5 supply and pricing (DRAM shortages pushed Pi 5 pricing up roughly 57% over the past year — we've priced Tier 1 assuming current cost levels, not last year's), and CNC lead times for Tier 2 enclosures if a machine shop run slips. Both are addressed in our timeline buffer and our supplier relationships, detailed below the risk matrix.

##### FAQ

**Is this legal? / Are NOAA charts really free?**
Yes. NOAA raster and vector charts are public domain data, released under 17 U.S.C. § 105. OpenCPN and Signal K are both established open-source projects with years of active development and real-world ocean use. We didn't invent anything here — we packaged it.

**Why is Garmin so much more expensive if the components are similar?**
Brand, retail distribution margin, marketing spend, R&D on features you may not use, and in many cases, subscription infrastructure. We're not saying Garmin hardware is bad — we're saying you're paying for a lot more than the electronics.

**What happens if OpenPlotter (the company) shuts down?**
The hardware still works. The software is open source and hosted independently on GitHub, not on our servers. Nothing about this product phones home to us to function. That's the point.

**Do I need technical skills to use this?**
To use it, no — power it on, it boots into a chartplotter interface. To build the Full Kit, you need to be comfortable with a screwdriver and following instructions; no soldering required. Bring Your Own Pi requires slightly more comfort with Raspberry Pi setup, and full instructions are provided.

**Does this replace my sonar/fishfinder/radar?**
Not at launch. Tier 1 and Tier 2 focus on chartplotting, GPS, AIS receive, and NMEA 2000 network display. Sonar/radar integration is a stretch goal (see Stretch Goals section) — we'd rather ship a great chartplotter on time than a mediocre everything-box late.

**What about warranty and support?**
Tier 1 kits carry a standard 1-year hardware warranty. Tier 2 carries our lifetime repair guarantee — because the schematics are public, we (or any competent electronics shop) can always source or fabricate a replacement part.

**Can I use my own screen/Pi/enclosure?**
Yes — that's what the Bring Your Own Pi tier and the public GitHub repo are for. Build it entirely yourself if you want. We'll never stop you.
