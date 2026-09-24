---
title: "help me pick out a computer for running local llm on"
description: "Guide to building a budget headless linux server for local llm"
date: "2026-08-06"
tags: ["llm-server","budget","headless-linux","gpu"]
source: "antigravity://fc9af648-4195-40f7-a36a-cb7c211f4643"
draft: false
vault: false
---

## llm server build guide

## Budget Local LLM Server Build Guide (<$300)

Building a headless Linux server for local Large Language Models (LLMs) on a budget is an exciting project. When your budget is tightly capped around $300, the strategy shifts heavily towards finding cheap **used enterprise hardware** and prioritizing **GPU VRAM** above all else. 

Here is a breakdown of the best strategies, system types, and GPUs to look for on online marketplaces like eBay.

---

## 1. Choosing the Base System: Rackmount vs. Mac Pro vs. Workstation

When picking a base system, you want a machine that has strong power supplies, plenty of PCIe slots for GPUs, and decent cooling.

### The Problem with Rackmount Servers (e.g., Dell PowerEdge R720)
While older rack servers are incredibly cheap (often under $100 barebones) and have massive RAM capacities, they are generally **not recommended for home use** unless you have a dedicated garage or soundproof room. 
- **The Cons:** They sound like jet engines, draw a lot of idle power, and often lack the specific power cables required for modern GPUs without risky modifications. 

### The Problem with Mac Pro "Cheese Graters" (e.g., Mac Pro 5,1)
The legacy Mac Pro 5,1 is a beautiful machine with dual Xeon support, but it's showing its age.
- **The Cons:** The PCIe architecture is older (PCIe 2.0), the CPUs lack modern AVX instruction sets that some AI tools require, and getting power to modern, high-draw GPUs can be very complicated due to Apple's proprietary power supply design. 

### The Recommended Route: Refurbished Tower Workstations
For a headless Linux LLM server, your best bet is an enterprise **Tower Workstation**. They use standard PC parts, are quiet enough for an office, and usually come with hefty 600W+ power supplies designed for multiple add-in cards.
- **Top Models to look for on eBay ($80 - $150):**
  - **HP Z440 / Z640:** Excellent PCIe lane availability, good power supplies, and very popular for AI homelabs.
  - **Dell Precision T5810 / T3620:** Extremely reliable and easy to find cheap. 
  - **Lenovo ThinkStation P500 / P510:** Great build quality and easy to upgrade.

> [!TIP]
> Make sure the workstation you buy includes a power supply of at least **600W** (preferably 700W+) and has at least two 6-pin or 8-pin PCIe power connectors for your GPU.

---

## 2. The GPUs: VRAM is King

For local LLMs, the CPU barely matters—**it's all about the GPU's Video RAM (VRAM).** More VRAM allows you to load larger, smarter models. Since this is a headless server, you don't even need a display output on the GPU.

### Option A: The Server GPU Route (Best Bang for Buck)
Data center GPUs have massive VRAM but don't have built-in fans (they rely on server airflow). To use them in a tower workstation, you will need to buy or 3D-print a cheap "fan shroud" and attach a standard PC fan to keep them cool.

*   **NVIDIA Tesla P40 (24GB VRAM)**
    *   **eBay Price:** ~$130 - $170
    *   **Why it's great:** 24GB of VRAM at this price is unbeatable. It can easily run 30B to 70B parameter quantized models.
    *   **The Catch:** It's passive. You *must* strap a high-static-pressure fan to it, and it requires a specific 8-pin EPS to dual 8-pin PCIe power adapter.
*   **NVIDIA Tesla M40 (24GB VRAM)**
    *   **eBay Price:** ~$80 - $100
    *   **Why it's great:** Even cheaper than the P40.
    *   **The Catch:** Much older Maxwell architecture. Software support is fading, and it's much slower than the P40. (The P40 is highly recommended over this).

### Option B: The Consumer GPU Route (Plug and Play)
If you don't want to mess with custom fans and server cards, consumer cards are much easier to deal with, though you get less VRAM per dollar.

*   **NVIDIA RTX 3060 (12GB VRAM)**
    *   **eBay Price:** ~$180 - $220 (Used)
    *   **Why it's great:** Modern architecture, fast memory, very easy to set up, and draws relatively low power. 12GB is enough to run very smart 7B and 8B parameter models (like Llama-3 8B) very fast.

---

## 3. Example Under-$300 Build Strategy

Here is a realistic shopping list for eBay right now:

| Component | Item | Estimated Price |
| :--- | :--- | :--- |
| **Base System** | Used HP Z440 (Xeon E5, 16GB RAM, 700W PSU, No GPU) | $100.00 |
| **GPU** | Used NVIDIA Tesla P40 (24GB) | $150.00 |
| **Cooling Mod** | 3D Printed Shroud + 120mm Fan (for P40) | $20.00 |
| **Power Cable** | CPU 8-pin to dual PCIe 8-pin (if needed for P40) | $10.00 |
| **Storage** | 500GB SSD (if not included in base system) | $20.00 |
| **Total** | | **$300.00** |

---

## 4. Upgrading Down the Line

Starting with a workstation like the HP Z440 gives you a fantastic upgrade path:
1.  **More RAM:** Workstations use ECC memory, which is dirt cheap on eBay. You can easily upgrade to 64GB or 128GB of RAM. While LLMs run best on the GPU, if you exceed your GPU's VRAM, the model will "spill over" to your system RAM. It's slower, but having 64GB of system RAM ensures you can run massive models if needed.
2.  **Multiple GPUs:** The HP Z440 and Dell T5810 motherboards have multiple PCIe x16 slots. Once you have more budget, you can drop a *second* Tesla P40 or RTX 3060 into the system, doubling your VRAM and allowing you to run incredibly large models (like Llama-3 70B). 

> [!IMPORTANT]
> When setting up your headless Linux server, use **Ubuntu Server LTS**. The AI community builds almost all their tools (like Ollama, llama.cpp, vLLM, and Docker/NVIDIA drivers) with Ubuntu in mind, ensuring the smoothest setup experience.

## Assets
- [llm_server_build_guide.md](/antigravity/help-me-pick-out-a-computer-for-running-local/llm_server_build_guide.md) — MD, 5 KB

<details>
<summary>Chat transcript — 2 messages, 2026-08-06 → 2026-08-06</summary>

**You** · 2026-08-06 05:28

help me pick out a computer for running local llm on. I am thinking about a Mac Pro Xeon, or a rack mounted server. Want to find a used system for less then $300 to start off with ideally, with a good format for upgrading down the line. I will run the system as a headless linux server and call the llm on my local network. rank the best models to look for, as well as a list of cheaper used GPU to add or what GPU to look for when buying the system. Pull a list of used models from online marketplaces if possible.

---

**Antigravity** · 2026-08-06 05:29

I have put together a comprehensive guide for you to help plan your budget LLM build! I've placed the details in the [llm_server_build_guide.md](file:///home/jd/.gemini/antigravity/brain/fc9af648-4195-40f7-a36a-cb7c211f4643/llm_server_build_guide.md) artifact, which breaks down system choices, GPU recommendations, and a sample build list. 

Here are the key takeaways from the research:

1. **Avoid Rackmounts and Mac Pros:** While cheap, rack servers (like older PowerEdges) are incredibly loud (think jet engines) and draw a lot of idle power. The older Mac Pro "cheese graters" use outdated PCIe architectures and lack modern CPU instruction sets, making them a headache to set up.
2. **Buy an Enterprise Tower Workstation:** A refurbished HP Z440, Dell Precision T5810, or Lenovo P500 is your best bet. They are quiet, fit under a desk, and usually come with 700W+ power supplies designed for handling expansion cards. You can routinely find them barebones for around **$100** on eBay.
3. **VRAM is King (The Tesla P40):** For a headless setup, your CPU doesn't matter much. The absolute best budget option for VRAM right now is a used **NVIDIA Tesla P40 (24GB)** for about **$150**. Since it's a passive server card, you'll need to spend about $20 to strap a standard PC fan to it using a 3D-printed shroud, but having 24GB of VRAM allows you to run massive models (like 30B to 70B parameters) on a shoestring budget.
4. **The Upgrade Path:** By starting with a workstation tower, you can easily double your RAM for cheap (using used ECC server memory) or drop a *second* Tesla P40 into the tower down the line to achieve an incredible 48GB of VRAM.

Take a look at the guide and let me know if you want to dive deeper into any specific parts, like how to set up the software stack once you have the hardware!

</details>

---

*Imported from Antigravity conversation `fc9af648-4195-40f7-a36a-cb7c211f4643` — 18 recorded steps, 5 tool actions, 1 context checkpoints (earlier turns were truncated by Antigravity). Source: `antigravity`.

## Related

- [cheapest way to get FCC certification for Boat Monitor project](/garden/cheapest-way-to-get-fcc-certification-for-boat-monitor/)
- [cheapest photorelalistic video gen LLM option, either a subscription model, API, or…](/garden/cheapest-photorelalistic-video-gen-llm-option-either-a-subsc/)
- [cheapest photorelalistic video gen LLM option, either a subscription model, API, or…](/garden/cheapest-photorelalistic-video-gen-llm-option-either-a-subsc/)
