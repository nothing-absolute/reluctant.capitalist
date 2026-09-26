# Kickstarter Financial Projections: OpenPlotter

This document outlines the projected financial outcomes of the Kickstarter campaign across three potential funding scenarios: **Base Funding**, **Moderate Success**, and **Breakout Hit**. It incorporates the new modular supply chain strategy.

> [!TIP]
> **The B2B Pivot**
> By utilizing an open Compute Module (CM4) architecture, the Tier 2 custom PCB can easily be white-labeled post-Kickstarter for other sectors suffering from hardware lockdown (e.g., precision agriculture displays, industrial automation interfaces, off-grid monitoring). This Kickstarter acts as paid R&D for a much larger B2B hardware platform.

---

## Unit Economics (Per-Tier Breakdown)

| Tier | Price | Estimated COGS | Kickstarter Fees (8%) | **Gross Margin / Unit** |
| :--- | :--- | :--- | :--- | :--- |
| **1A: BYO Pi** | $99 | $40 (HAT, Case, SD) | $7.92 | **$51.08** (51%) |
| **1B: Full Kit** | $199 | $130 (Pi 4, Screen, Parts) | $15.92 | **$53.08** (26%) |
| **1C: Pre-Assembled** | $299 | $145 (Parts + Basic Labor) | $23.92 | **$130.08** (43%) |
| **2: Built in USA** | $649 | $330 (Billet, CM4, Bonded LCD) | $51.92 | **$267.08** (41%) |
| **3: Founders Circle** | $1,000 (Avg) | $150 (Tier 2 Unit) | $80.00 | **$770.00** (77%) |

*(Note: COGS estimates include standard 15% wastage/yield buffer for Tier 2 optical bonding).*

---

## Scenario 1: Base Funding ($75,000)
*Proof of concept. Validates the market, covers tooling for the CNC enclosure and initial PCB runs.*

| Tier | Units Sold | Gross Revenue | Total COGS | Platform Fees | **Net Profit (Pre-OpEx)** |
| :--- | :--- | :--- | :--- | :--- | :--- |
| **1A** | 50 | $4,950 | $2,000 | $396 | $2,554 |
| **1B** | 100 | $19,900 | $13,000 | $1,592 | $5,308 |
| **1C** | 100 | $29,900 | $14,500 | $2,392 | $13,008 |
| **2** | 20 | $12,980 | $6,600 | $1,038 | $5,342 |
| **3** | 8 | $8,000 | $1,200 | $640 | $6,160 |
| **TOTAL** | **278 Units** | **$75,730** | **$37,300** | **$6,058** | **<mark>$32,372</mark>** |

---

## Scenario 2: Moderate Success ($300,000)
*The target zone. Provides enough capital to negotiate significant bulk discounts on Rockchip/Radxa Compute Modules and bulk aluminum stock.*

| Tier | Units Sold | Gross Revenue | Total COGS | Platform Fees | **Net Profit (Pre-OpEx)** |
| :--- | :--- | :--- | :--- | :--- | :--- |
| **1A** | 200 | $19,800 | $8,000 | $1,584 | $10,216 |
| **1B** | 300 | $59,700 | $39,000 | $4,776 | $15,924 |
| **1C** | 450 | $134,550 | $65,250 | $10,764 | $58,536 |
| **2** | 100 | $64,900 | $33,000 | $5,192 | $26,708 |
| **3** | 25 | $25,000 | $3,750 | $2,000 | $19,250 |
| **TOTAL** | **1,075 Units** | **$303,950** | **$149,000** | **$24,316** | **<mark>$130,634</mark>** |

---

## Scenario 3: Breakout Hit ($1,000,000+)
*The "Hardware Revolution" scenario. At this volume, Tier 2 PCB manufacturing is heavily optimized, and we can directly approach LCD manufacturers for custom bonded glass.*

| Tier | Units Sold | Gross Revenue | Total COGS (Optimized)* | Platform Fees | **Net Profit (Pre-OpEx)** |
| :--- | :--- | :--- | :--- | :--- | :--- |
| **1A** | 500 | $49,500 | $17,500 (-12%) | $3,960 | $28,040 |
| **1B** | 1,000 | $199,000 | $115,000 (-11%) | $15,920 | $68,080 |
| **1C** | 1,500 | $448,500 | $195,000 (-10%) | $35,880 | $217,620 |
| **2** | 400 | $259,600 | $112,000 (-15%) | $20,768 | $126,832 |
| **3** | 50 | $50,000 | $7,500 | $4,000 | $38,500 |
| **TOTAL** | **3,450 Units** | **$1,006,600**| **$447,000** | **$80,528** | **<mark>$479,072</mark>** |

*\*Note: In Scenario 3, COGS decreases significantly due to economies of scale (indicated in parenthesis), boosting gross margins across all tiers.*
