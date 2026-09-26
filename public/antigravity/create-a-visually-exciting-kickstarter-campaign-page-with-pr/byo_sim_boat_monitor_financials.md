# Kickstarter Financial Projections: BYO-SIM Boat Monitor

This document outlines the projected financial outcomes for a new Kickstarter campaign focused on the **Bring Your Own SIM (BYO-SIM) Boat Monitor**. 

> [!TIP]
> **The Value Proposition**
> Commercial boat monitors (Siren, BRNKL) charge $15 to $30 a month just for the cellular connection. By building a rugged monitor around an ESP32 microcontroller and a standard LTE-M/4G modem, users can buy a $2/month IoT SIM card (like Hologram or Twilio) and pay no forced subscriptions. The hardware is cheap to produce, highly reliable, and hits a massive pain point for boat owners.

---

## Unit Economics (Per-Tier Breakdown)

| Tier | Price | Estimated COGS | Kickstarter Fees (8%) | **Gross Margin / Unit** |
| :--- | :--- | :--- | :--- | :--- |
| **1: Bare Board (Hackers)** | $49 | $15 (ESP32, LTE Modem, GPS) | $3.92 | **$30.08** (61%) |
| **2: Basic Kit** | $99 | $30 (Board, 3D Case, Harness) | $7.92 | **$61.08** (61%) |
| **3: Rugged Pro Unit** | $199 | $75 (IP67 Case, Battery Backup)| $15.92 | **$108.08** (54%) |
| **4: Fleet Pack (3 Units)** | $499 | $225 (3x Pro Units) | $39.92 | **$234.08** (46%) |
| **5: Founders Circle** | $1,000 | $100 (Pro Unit + Swag) | $80.00 | **$820.00** (82%) |

*(Note: COGS are significantly lower than the Chartplotter because this relies on microcontrollers (ESP32) rather than full Linux Single Board Computers, and requires no expensive LCD screens).*

---

## Scenario 1: Base Funding ($30,000)
*Proof of concept. Covers the initial PCB spin, cellular certification (PTCRB/FCC) consulting, and injection molding for the basic case.*

| Tier | Units Sold | Gross Revenue | Total COGS | Platform Fees | **Net Profit (Pre-OpEx)** |
| :--- | :--- | :--- | :--- | :--- | :--- |
| **1 (Bare Board)**| 100 | $4,900 | $1,500 | $392 | $3,008 |
| **2 (Basic Kit)** | 100 | $9,900 | $3,000 | $792 | $6,108 |
| **3 (Pro Unit)** | 50 | $9,950 | $3,750 | $796 | $5,404 |
| **4 (Fleet Pack)**| 5 | $2,495 | $1,125 | $199 | $1,171 |
| **5 (Founders)** | 3 | $3,000 | $300 | $240 | $2,460 |
| **TOTAL** | **258 Units** | **$30,245** | **$9,675** | **$2,419** | **<mark>$18,151</mark>** |

---

## Scenario 2: Moderate Success ($150,000)
*The target zone. Allows for bulk purchasing of cellular modems (the most expensive component) and proper IP67 tooling for the Pro Unit.*

| Tier | Units Sold | Gross Revenue | Total COGS | Platform Fees | **Net Profit (Pre-OpEx)** |
| :--- | :--- | :--- | :--- | :--- | :--- |
| **1 (Bare Board)**| 400 | $19,600 | $6,000 | $1,568 | $12,032 |
| **2 (Basic Kit)** | 500 | $49,500 | $15,000 | $3,960 | $30,540 |
| **3 (Pro Unit)** | 300 | $59,700 | $22,500 | $4,776 | $32,424 |
| **4 (Fleet Pack)**| 20 | $9,980 | $4,500 | $798 | $4,682 |
| **5 (Founders)** | 12 | $12,000 | $1,200 | $960 | $9,840 |
| **TOTAL** | **1,232 Units**| **$150,780**| **$49,200** | **$12,062** | **<mark>$89,518</mark>** |

---

## Scenario 3: Breakout Hit ($500,000+)
*Volume production. At this scale, we can move from off-the-shelf cellular modems to integrating the cellular chipset directly onto our PCB, slashing COGS drastically.*

| Tier | Units Sold | Gross Revenue | Total COGS (Optimized)* | Platform Fees | **Net Profit (Pre-OpEx)** |
| :--- | :--- | :--- | :--- | :--- | :--- |
| **1 (Bare Board)**| 1,000 | $49,000 | $10,000 (-33%) | $3,920 | $35,080 |
| **2 (Basic Kit)** | 1,500 | $148,500 | $36,000 (-20%) | $11,880 | $100,620 |
| **3 (Pro Unit)** | 1,200 | $238,800 | $72,000 (-20%) | $19,104 | $147,696 |
| **4 (Fleet Pack)**| 100 | $49,900 | $18,000 (-20%) | $3,992 | $27,908 |
| **5 (Founders)** | 25 | $25,000 | $2,500 | $2,000 | $20,500 |
| **TOTAL** | **3,825 Units**| **$511,200**| **$138,500** | **$40,896** | **<mark>$331,804</mark>** |

*\*Note: Microcontroller/IoT devices scale much more profitably than display screens. The optimization at 3,000+ units allows direct chipset integration rather than using modular cellular breakouts, massively increasing the gross margin.*
