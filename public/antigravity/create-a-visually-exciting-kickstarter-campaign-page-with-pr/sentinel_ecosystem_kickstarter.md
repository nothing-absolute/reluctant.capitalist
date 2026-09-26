# Project Sentinel: The Open Marine Ecosystem
**Unified Kickstarter Campaign Blueprint**

> [!NOTE]
> **Campaign Strategy**
> By combining the open-source chartplotter (Hub) and the BYO-SIM remote monitor (Node), we are no longer just launching a product—we are launching a complete, subscription-free alternative to the Garmin/Siren Marine monopoly. This is a unified marine ecosystem built on open protocols (MQTT/Signal K).

---

## The Header & Hook

**Headline (Inter):** Project Sentinel: The Subscription-Free Marine Ecosystem
**Subtitle (Inter):** A rugged, open-architecture chartplotter and a BYO-SIM boat monitor. Free NOAA charts. Zero monthly fees. Take your helm back.

**Campaign Video Hook:**
*Visual:* High-impact CGI of a boat sinking at the dock at midnight ("The Midnight Sinking" concept). 
*Voiceover:* "Every year, 65% of boat losses occur right at the dock. Dead batteries, jammed bilge float switches, or undetected leaks submerge $50,000 assets in under 3 hours."
*Cut to:* The Sentinel Monitor sending an instant SMS. 
*Voiceover:* "The industry solution? Charge you $800 upfront and lock you into a $25/month subscription trap. We think that's extortion."

---

## The Problem: The "Marine Tax"

Marine electronics is a $4 billion industry, and it is entirely broken. 

Right now, if you want a reliable chartplotter, you pay $1,100 for a locked black box, plus $150 a year for map updates you already paid for with your taxes (NOAA charts are free public data). 

If you want to monitor your boat while you're away, you pay $400-$800 for a remote monitor, plus $240 a year for a forced cellular subscription that sends less data than a single webpage. 

Between the chartplotter and the monitor, you are trapped paying hundreds of dollars a year in recurring fees. When a port corrodes in three years, the manufacturer tells you to throw it in the trash.

## The Solution: The Sentinel Ecosystem

We are engineers and boaters. We were tired of being locked out of our own equipment. So we built **Project Sentinel**—a two-part open ecosystem that replaces the industry giants.

### Product 1: The Sentinel Hub (Chartplotter)
A fully functional, daylight-readable, open-source chartplotter. 
*   **Open Compute Architecture:** Built on the CM4 footprint. If one supplier has a shortage, we drop in alternative processors (Raspberry Pi, Radxa, Pine64). Immune to supply chain lock-in.
*   **Built to be Fixed:** The Pro tier features a CNC billet aluminum shell, O-ring seals, and standard stainless hex bolts. We publish the schematics. 
*   **Free Forever:** Runs open-source marine software. Add a $34 RTL-SDR dongle to our USB port for AIS. Never pay for a chart subscription again.

### Product 2: The Sentinel Monitor (Remote Security)
*Your Boat is Sinking. And You Won't Know Until It's Too Late.*
*   **Bring Your Own SIM:** Powered by an ESP32 and an LTE-M/WiFi modem. We leave the Nano-SIM slot open. Buy a $2/month IoT SIM card (Hologram, Twilio) and plug it in. We charge you ZERO monthly fees.
*   **Rock-Solid Sensing:** Dual-voltage (12V/24V) battery sensing, optocoupler isolated float switch inputs, and a u-blox GPS module for geofencing against outboard theft.
*   **Marine Tough:** Housed in an IP67 waterproof UV-resistant polycarbonate enclosure. 

### How They Work Together
The Sentinel Monitor uses standard MQTT and TLS protocols. When you are away from the dock, it sends cellular alerts to your phone. When you are on board, the Monitor pushes real-time battery and bilge data directly to the Sentinel Hub chartplotter via local WiFi or NMEA 2000. It is a seamless, open ecosystem.

---

## The Anti-VC Pledge
> [!WARNING]
> **Our Promise to You:**
> We will never take venture capital. We will never add a subscription. We will never lock features behind a paywall. Every schematic, every line of firmware, every CAD file is on GitHub under an irrevocable open-source license. If this company disappears tomorrow, your gear keeps working.

---

## Reward Tiers & Economics

*(By bundling the products, we increase the Average Order Value (AOV) significantly while still offering massive savings compared to commercial equivalents).*

| Tier | Price | What You Get | Commercial Equivalent Cost (3 Yrs) |
| :--- | :--- | :--- | :--- |
| **1: Early Bird Monitor** | **$139** | 1x Sentinel BYO-SIM Monitor. *(MSRP $199)* | Siren Marine 3 Pro: ~$1,400 |
| **2: Hub Kit (DIY)** | **$199** | 1x Sentinel Hub Kit (No Pi). You assemble. | Garmin 7": ~$850 |
| **3: Hub Premium** | **$299** | 1x Sentinel Hub Premium (Pre-Assembled 7") | Garmin 7": ~$850 |
| **4: The Ecosystem** | **$429** | 1x Sentinel Monitor + 1x Hub Premium | Garmin + Siren: ~$2,250 |
| **5: The Billet Pro** | **$649** | 1x 10" CNC Billet Aluminum Hub | Garmin 9": ~$1,550 |
| **6: The Ultimate Rig**| **$779** | 1x Sentinel Monitor + 1x 10" Billet Hub | Garmin + Siren: ~$2,950 |
| **7: Founders Circle** | **$1,500** | 2x Monitors, 1x Billet Hub, Name in Firmware, Direct chat with devs. | N/A |

---

## Stretch Goals & Roadmap

*   **$100k:** Campaign Funded! Tooling unlocked for IP67 polycarbonate enclosures.
*   **$250k:** **NMEA 2000 Certification:** We will finalize the NMEA 2000 bridge firmware, allowing the Sentinel Monitor to push data onto standard marine networks.
*   **$500k:** **Radar Integration Roadmap:** We hire a dedicated open-source developer to accelerate open radar compatibility for the Sentinel Hub.
*   **$1M:** **Satellite Fallback Module:** We unlock an add-on module for the Sentinel Monitor that falls back to the Iridium satellite network when offshore (for bluewater cruisers).

---

## Risks and Challenges
Hardware is hard. However, we have engineered our primary risk—global supply chain bottlenecks—out of the product. The Sentinel Hub uses a modular Compute Module architecture, allowing us to pivot silicon vendors instantly. The Sentinel Monitor uses widely available ESP32 microcontrollers and commodity LTE modems. Our primary remaining risk is FCC/IC certification delays for the cellular radios, which we have budgeted 4-6 months for in our delivery timeline.
