---
title: "Hydration Station Kickstarter"
description: "Breakdown of costs and logistics for a hydration station Kickstarter campaign"
date: "2026-09-23"
tags: ["kickstarter","cost-breakdown","logistics","hydration-station"]
source: "Projects/Kickstarter/hydration-station-kickstarter.md"
draft: false
clarity: 4
quality: 4
status: "concept"
stage: "idea"
---

The Tier 1 host-donation model is smart — it also solves a real logistics problem for you (siting, power, some baseline security just from being on someone's property). One quick correction before I get into numbers: **donated time from professionals isn't tax-deductible for the donor** under IRS rules — only out-of-pocket materials/expenses are. Worth knowing before you pitch it that way to senior engineers; they can still write off mileage, materials they buy, etc., just not their labor hours. It doesn't kill the ask, just reframe it as "give us your expertise for the mission" rather than "for the write-off.".

Building custom is genuinely the right call here — commercial solar vending units are marked up for a market you're not really in, and your use case (dispense, don't necessarily refrigerate hard, simple payment, one or two SKUs) is much simpler than a snack machine. Here's the ballpark, split the way real hardware projects actually budget: **one-time NRE (design/setup)** vs. **per-unit production cost**.

#### One-time capital: design, R&D, manufacturing setup

|Item|Lean/mostly-volunteer|Market-rate|
|---|---|---|
|Industrial/mechanical design (enclosure, dispense mechanism, CAD)|$3,000–8,000 (entry-level paid + senior review)|$10,000–20,000|
|Electrical engineering + custom PCB design (control board, power board, firmware)|$3,000–8,000|$10,000–20,000|
|PCB prototyping (bare boards, stencils, test fixture)|$500–1,500|$1,000–3,000|
|Prototype build + iteration (1–3 working units)|$5,000–10,000|$10,000–20,000|
|Software: dispense logic, payment integration, camera/LLM pipeline, monitoring dashboard|$5,000–15,000 (open-source/community-supported)|$15,000–35,000|
|**Safety/regulatory testing (UL/ETL listing, NSF food-contact cert for water path)**|$5,000–15,000|$15,000–30,000+|
|Nonprofit legal setup (501 c 3 filing, liability insurance groundwork)|$1,500–3,000|same|
|**Total to first certified, replicable unit**|**~$23,000–60,000**|**~$62,000–130,000+**|

That certification line is the one people skip and shouldn't — it's an unattended, outdoor, publicly-accessible powered device that handles payments and dispenses something for people to drink. That's exactly the profile that gets flagged fastest if there's ever an incident, and a lot of city/institutional hosts (your Tier 1 partners) will want to see it before they let you plug in on their property.

#### Per-unit production cost (once the design is done)

|Component|Est. cost|
|---|---|
|Refurbished vending/cooler chassis (structural body, reused)|$500–1,500|
|Cooling unit (refurbished compressor or simple thermoelectric, if chilled)|$300–800|
|Dispense mechanism (off-the-shelf or salvaged vending coil/motor units)|$300–1,000|
|Custom control PCB(s) — bare board + SMT assembly at 20–50 unit volume|$80–200|
|Off-the-shelf SBC for UI logic (Raspberry Pi-class)|$50–100|
|Touchscreen (10–15

## Related

- [Hydration Station]
- [AI Task Concierge Concept](/projects/ai-task-concierge/)
