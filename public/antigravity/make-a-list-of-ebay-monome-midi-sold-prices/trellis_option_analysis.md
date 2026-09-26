# Adafruit Trellis/NeoTrellis: Monome Grid Kickstarter Viability Analysis

Yes! Using **Adafruit Trellis** or **NeoTrellis** is a highly viable entry point for building a Monome Grid compatible device. In fact, many DIY makers build "NeoTrellis grids" using open-source firmware (like `neotrellis-monome` by `okyeron`). 

However, when moving from a **DIY/maker project** to a **commercial Kickstarter product**, there are substantial technical, financial, and mechanical trade-offs to consider.

---

## 🛠️ The Technology: NeoTrellis vs. Traditional Trellis
If you go this route, you must use **Adafruit NeoTrellis** boards (which feature addressable RGB NeoPixels and I2C interfaces), rather than the original **Trellis** boards (which are monochrome red LEDs and require a complex button matrix setup).

* **NeoTrellis Advantages:** Up to 32 boards can be tiled together on a single I2C bus using a simple 4-wire connection (Power, Ground, SDA, SCL). The microcontroller (like a Raspberry Pi Pico or Teensy 4.0) only needs to talk to one I2C address per 4x4 tiled module.

---

## 💰 Financial Reality Check: BOM Cost Analysis (Grid 128)

Let's look at the bill of materials (BOM) for building an 8x16 (128 buttons) Grid clone using Adafruit NeoTrellis parts at retail prices:

| Component | Quantity | Unit Price | Total Cost |
| :--- | :---: | :---: | :---: |
| **Adafruit NeoTrellis RGB PCB** (4x4 buttons) | 8 | $12.50 | $100.00 |
| **Silicone Elastomer Button Pad** (4x4) | 8 | $4.95 | $39.60 |
| **RP2040 or Teensy 4.0 Microcontroller** | 1 | $4.00 – $20.00 | $10.00 |
| **Custom Carrier PCB** (to mount and bus the 8 modules) | 1 | $5.00 | $5.00 |
| **Enclosure** (CNC Walnut / Anodized Aluminum) | 1 | $25.00 | $25.00 |
| **Hardware & Cables** (screws, USB-C jack, wiring) | 1 | $5.00 | $5.00 |
| **Packaging & Assembly Labor** | 1 | $15.00 | $15.00 |
| **Total Estimated BOM Cost (per unit)** | | | **~$199.60 USD** |

### The Kickstarter Margin Problem:
To make a crowdfunding campaign financially viable and absorb platform fees (5%), payment processing (3-5%), manufacturing defects, and shipping risks, you generally need a **3x markup** on raw BOM cost. 
* A BOM of ~$200 means you would need to retail the Grid 128 clone on Kickstarter for **$599 USD**.
* At $599 USD, you are competing directly with used official Monome Grids, which diminishes the "budget DIY alternative" appeal of the clone.

---

## 📐 Mechanical and Aesthetic Drawbacks

The official Monome Grid is world-renowned for its minimalist, ultra-slim design (~7.5mm thick). 

| Feature | Official Monome Grid | Adafruit NeoTrellis DIY Grid |
| :--- | :--- | :--- |
| **Thickness** | **Ultra-slim (7.5 mm)** | **Thick (20 - 25 mm)** |
| **Key Travel / Feel** | Soft, clicky, shallow travel, highly responsive. | Mushy, deep travel, requires firm pressure to actuate. |
| **LED Diffusion** | Subtle, matte, circular halo light pipes. | Bright, direct LED points underneath clear silicone. |
| **Look & Feel** | Premium, museum-grade art piece. | Hobbyist, chunkier "synth DIY" look. |

---

## ⛓️ Supply Chain Risk (The Crowdfunding Nightmare)
Relying on a third-party manufacturer (Adafruit) for your core hardware components is highly risky for a Kickstarter campaign:
1. **Stock Outages:** If Adafruit runs out of NeoTrellis PCBs during your production run, your campaign is stuck. You cannot fulfill orders, causing backer frustration.
2. **Wholesale Discounts:** Adafruit does offer distributor pricing, but their margins on manufactured boards are relatively tight. You will not get the 80% cost reductions you would get if you manufactured the PCBs directly in Shenzhen.

---

## 💡 The "Best of Both Worlds" Kickstarter Solution

If you want to crowdfund a Grid, **do not buy Adafruit modules**. Instead, design your own PCB that replicates the NeoTrellis architecture:

1. **Design a Single Large PCB:** Instead of tiling 8 separate I2C NeoTrellis boards, design a single 8x16 PCB. You can use cheap, standard shift registers or I/O expanders (like the MAX7313 or similar I2C LED drivers) to scan the matrix.
2. **Custom Silicone Button Tooling:** Order custom silicone keypads directly from a manufacturer in China. Upfront tooling might cost $3,000, but the per-unit cost drops from $39.60 (for 8 Adafruit pads) to **less than $5.00** per keypad.
3. **Bring the BOM down to ~$65:** By manufacturing your own single PCB and custom keypads, your BOM drops from **$200 to under $70**, allowing you to launch a premium Grid 128 on Kickstarter for **$299 – $349 USD** with comfortable margins!
