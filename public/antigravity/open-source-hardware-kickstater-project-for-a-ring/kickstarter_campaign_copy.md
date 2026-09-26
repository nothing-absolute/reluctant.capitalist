# OpenDoor: The 100% Cloud-Free Video Doorbell
**Take back your front porch. Own your hardware, own your data, and never pay a subscription fee again.**

---

## 🎬 The Story (Campaign Video Script Outline)

*(Visual: A person walks up to a generic doorbell. The camera cuts to a server room, then to a smartphone screen showing a monthly credit card charge for "$10/mo - Smart Home Video".)*

**Voiceover:** You bought a video doorbell to keep your home safe. But what you actually bought was a surveillance node for a giant tech company, and a subscription fee that never ends. If you stop paying? Your "smart" doorbell becomes a dumb button. If your internet goes down? It stops working. 

*(Visual: The person takes the old doorbell off the wall and replaces it with the rugged, industrial OpenDoor unit. They smile as the LED ring glows green.)*

**Voiceover:** We believe you should own the things you buy. Meet OpenDoor. It’s the first consumer-ready, battery-powered video doorbell that is 100% open-source, runs completely locally, and requires exactly zero subscriptions. 

---

## 🛑 The Problem

Modern smart doorbells are broken by design:
1.  **The Subscription Trap:** You pay $150 for the hardware, and then they lock your video history behind a $10/month paywall. Over three years, that doorbell costs you over $500.
2.  **Privacy Invasions:** When your camera records to the cloud, you lose control of that data. Your front porch footage shouldn't be accessible to tech company employees or used to train AI models without your explicit consent.
3.  **Planned Obsolescence:** If a company decides to shut down their servers, your expensive hardware becomes a paperweight overnight. 

## 🟢 The OpenDoor Solution

OpenDoor flips the model. We designed a premium, consumer-ready video doorbell from the ground up using open-source hardware (the powerful ESP32-S3) and software. 

*   **100% Local Recording:** Videos save directly to the onboard MicroSD card, or to our optional **OpenBase Station** inside your house. No cloud servers, no monthly fees.
*   **Insanely Fast Notifications:** Because OpenDoor doesn't have to bounce a signal to a server in Virginia before ringing your phone, notifications on your local Wi-Fi network are near-instantaneous.
*   **Privacy by Default:** When you are away from home, the OpenDoor app uses an End-to-End Encrypted (E2EE) relay to securely stream video to your phone. We couldn't look at your video feed even if we wanted to.

---

## 🔬 Deep Dive: Real Engineering, No White-Labels

A lot of crowdfunding projects just slap a logo on a generic factory design. We engineered OpenDoor's PCB from the ground up to solve the hardest problem in smart home tech: **Video + Battery Life + Solar.**

Most DIY or open-source doorbell projects fail because Wi-Fi video streaming drains batteries fast, and standard development boards draw over 1.2mA even while "sleeping." We fixed this.

*   **The ~14µA Miracle:** By utilizing the **AXP2101 Power Management Unit (PMU)** alongside the ultra-efficient Seeed XIAO ESP32-S3 architecture, we completely shut down power to the camera and SD card when idle. Our board sleeps at an incredible ~14µA (microamps).
*   **True Solar Independence:** Because our idle power draw is so low (consuming only ~0.5 to 0.8 Wh/day even with 5 active doorbell rings), the **integrated 3W monocrystalline solar panel** easily generates 2 to 4 Wh/day. In most climates, OpenDoor generates more power than it uses. It runs indefinitely.
*   **Zero-Latency ESP-NOW Chime:** Connecting to Wi-Fi from deep sleep takes 1.5 seconds. When a visitor presses the doorbell, OpenDoor uses an **ESP-NOW broadcast** to instantly trigger your indoor Wi-Fi chime in milliseconds, *while* it negotiates the Wi-Fi connection in the background to start the video stream. No lag, no missed visitors.
*   **Hardware PIR Wakeup:** An ultra-low-power Panasonic EKMC PIR sensor acts as a hardware interrupt, ensuring the camera only turns on when a physical heat signature approaches. 

---

## 🎁 Reward Tiers

We’ve designed rewards for everyone—from the hardcore maker to the everyday consumer who just wants it to work out of the box.

### Tier 1: The Digital Maker - $15
*   Access to all optimized STL files to 3D print the enclosure yourself.
*   Gerber files and the BOM to order and solder your own PCBs.

### Tier 2: The Standalone Doorbell (Early Bird) - $89 
*(Retail: $129)*
*   1x Fully Assembled OpenDoor Video Doorbell.
*   1x Indoor Wi-Fi Chime.
*   1x Mounting Bracket & Hardware.
*   *Note: Records directly to an onboard MicroSD card (card not included).*

### Tier 3: The Solar Bundle - $129
*(Retail: $169)*
*   Everything in Tier 2, PLUS:
*   1x Custom-fit Solar Panel mounting bracket.
*   *Never take your doorbell down to charge it again.*

### Tier 4: The "Local Cloud" Ecosystem - $199
*(Retail: $259) - The Ultimate Setup.*
*   1x Fully Assembled OpenDoor Video Doorbell.
*   1x Indoor Wi-Fi Chime.
*   1x **OpenBase Station** (includes a 128GB internal SSD).
*   *The OpenBase plugs into your router and handles all video archiving and advanced motion detection inside the safety of your home.*

### Tier 5: The Hacker Pack (Dev Kit) - $249
*   Everything in the "Local Cloud" Ecosystem, PLUS:
*   A transparent diagnostic faceplate.
*   Exposed UART/JTAG debugging pins pre-soldered on the board.
*   Early access to the firmware beta.

---

## 📅 Timeline & Production Plan

*   **August:** Kickstarter Campaign is Live!
*   **September:** Finalize tooling for the injection-molded enclosures. 
*   **October:** Order initial run of 5,000 PCBs and components (ESP32-S3s, Cameras).
*   **November:** Assembly and QA testing. 
*   **December/January:** Shipping to Backers!
