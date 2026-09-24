---
title: "Hydration Station Kickstarter Page"
description: "Generate a complete single-file HTML Kickstarter campaign page for Hydration Station — a nonprofit building solar-powered, community-maintained water dispensers that give free…"
date: "2026-09-23"
status: "concept"
stage: "idea"
tags: []
source: "Projects/Kickstarter/hydration-station-kickstarter-page.md"
---
Generate a complete single-file HTML Kickstarter campaign page for Hydration Station — a nonprofit building solar-powered, community-maintained water dispensers that give free water to anyone who needs it, no questions asked.

Design
Dark navy (#0 D 1 B 2 A) bg, cyan/teal (#00 B 4 D 8) accent, warm amber (#F 4 A 100). Fonts: Inter (sans), Anton (display), JetBrains Mono (data).
No external chart libraries — all charts hand-drawn with SVG or CSS (conic-gradient donuts, bar charts, thermometer animation).
Fully responsive, scroll-triggered fade-in animations via IntersectionObserver.
Single self-contained HTML file, embedded CSS + JS. No deps except Google Fonts.
Must feel ready to drop into Kickstarter with minimal reformatting.
Sections
1. Hero
Animated temp counter 75 → 113°F on load. Headline: "At that temperature, shade isn't enough." Two CTAs: Back this project / Pledge your skills. Citation footnote for temp data.

2. Stats Strip (4 big numbers)
2,325 — Heat deaths in US 2023, highest on record [JAMA 2024; CDC WONDER]
745,652 — People homeless on a single night in 2025 [HUD 2025 AHAR Part 1]
49% — Share of Maricopa County heat deaths that were unhoused [Maricopa County DPH 2024]
$0.00 — Cost to anyone who needs water
3. The Problem (3 cards)
110–120°F heat index (Phoenix 2024: 113 consecutive 100°F+ days) | Most water is gated behind purchases | $2-3/bottle is impossible for someone without income

4. How It Works (6 cards)
Free water no-questions-asked | Pay-what-you-can | Solar-powered (LiFePO 4 battery) | Community-run paid local jobs | Open source everything | Transparent public data

5. Three Tiers
Tier 1 — Plug-in ($1,500–$3,200): Donated space/power, refrigerated, tap-to-pay, 7" touchscreen, custom open-source PCB, cellular monitoring Tier 2 — Solar ($2,800–$5,500): [featured/highlighted] Everything in T 1 + 400-600 W solar, 100-200 Ah LiFePO 4, MPPT, IP 65 Tier 3 — Solar+AI ($3,500–$7,000): Everything in T 2 + Jetson Orin Nano, on-device IR camera, privacy-reviewed research pipeline Note: Commercial solar vending runs $8 k–$17 k+. Custom open-source cuts 60-70%.

6. Budget ($50 k goal) — SVG/CSS donut chart
Engineering/design $22 k (44%) | 5× Tier 1 pilots $12.5 k (25%) | Software $6.5 k (13%) | Legal $4.5 k (9%) | Operations reserve $4.5 k (9%) What $50 k unlocks: 5 deployed machines + open-source designs + first jobs + pilot data for grants + 501(c)(3)

7. Three-Phase Roadmap
Phase 1 — Now ($50 k crowdfund): Design, 5 pilots → unlocks OS + data | Phase 2 — 12-18 mo ($150 k–$400 k grants): HUD, EPA EJ, foundations. 25-80 solar units | Phase 3 — 2-4 yr ($1 M+): 200+ multi-city units, published research, replication kit

8. Grant Table
HUD CDBG $25 k-$250 k | EPA EJ $50 k-$500 k ($2 B Community Change Grants, Track I $10-20 M each) | USDA REAP $2.5 k-$1 M | Hilton Foundation $50 k-$500 k | Kresge $100 k-$1 M | State solar $500-$50 k/unit | Local foundations $5 k-$50 k

9. Skills Needed (9 cards)
Embedded/firmware (KiCad, ESP 32) | Mechanical design (enclosure, thermal) | Solar/electrical (LiFePO 4, MPPT) | Full-stack (React, Supabase) | Edge AI (Jetson) | Nonprofit attorney | Fabricator/welder | Grant writer | Community partnerships

10. Host Partner Pitch (4 cards)
Community goodwill + naming | Foot traffic/exposure | Nonprofit co-branding | Equipment donations tax-deductible. IRS transparency note on donated services.

11-12. Final CTA + Footer
"We can do better. Right now. With this." hello@hydrationstation.org

All Citations (embed as subtle footnotes)
Heat deaths: JAMA Netw Open 2024, 2,325 deaths, 117% increase since 1999. jamanetwork.com/journals/jama/fullarticle/2822854
Homelessness: HUD 2025 AHAR Part 1. huduser.gov/portal/datasets/ahar/2025-ahar-part-1-pit-estimates-of-homelessness-in-the-us.html
Phoenix 2024: NWS data via NBC News. 113 consecutive 100°F+ days, 61 days 110°F+.
Homeless heat mortality: PMC 2024, 50.1% of homeless deaths in Clark County attributable to heat. ncbi.nlm.nih.gov/pmc/articles/PMC 12096282/
Maricopa 2024: 608 heat deaths, 49% unhoused. IOP Science 2025.
Cooling recovery: Homeless seniors need 70 min minimum cooling. IOP Science 2025.
Commercial vending: $8 k-$17 k+ outdoor solar units. Industry data 2024-2025.
EPA EJ grants: $2 B Community Change Grants, Track I $10-20 M each. epa.gov/newsreleases/biden-harris-administration-announces-nearly-16-billion-environmental-and-climate
HUD CDBG: $3.3 B/yr + ESG $290 M/yr. FY 2025.
Veteran heat risk: JAMA 2024, homeless veterans 36% increased death odds in extreme heat.
Tone
Urgent but hopeful. Data-driven but human. Every problem has a corresponding solution. Goal: "I can be part of fixing this."

Output
Single complete valid HTML file, all CSS+JS embedded, no external deps except Google Fonts. SVG/CSS charts only. Ready to open in browser or paste into Kickstarter.
