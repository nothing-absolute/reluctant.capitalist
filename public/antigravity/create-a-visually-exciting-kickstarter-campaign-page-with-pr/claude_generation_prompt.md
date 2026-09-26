# Claude Prompt for Landing Page & Kickstarter

*Copy and paste the text below directly into Claude. This prompt is optimized to make Claude act as both an expert copywriter and a frontend developer, leveraging its ability to generate React/Tailwind web pages.*

***

**Copy the text below:**

```text
You are an expert copywriter, UI/UX designer, and frontend developer. I am launching a new hardware product called the "BYO-SIM Boat Monitor" and I need two deliverables from you:

1. A fully coded, mobile-responsive landing page (using React and Tailwind CSS).
2. The full Kickstarter campaign page copy in Markdown.

### Context & The Product
- **Product:** The BYO-SIM Boat Monitor. It is a remote boat monitoring system (tracking GPS, battery voltage, bilge pump activity, temperature).
- **The Problem:** Commercial boat monitors (like Siren Marine) charge $240+ a year for a cellular subscription just to send a few kilobytes of data.
- **The Solution:** Our monitor uses an open-source ESP32 microcontroller and an LTE-M modem, built into an IP67 waterproof billet aluminum case with automotive connectors. We leave the Nano-SIM slot open. The user buys their own $2/month IoT SIM card (like Hologram or Twilio) and pays us ZERO monthly fees. 
- **The Tiers:** 
  - $49: Bare PCB Board (For hackers/DIYers)
  - $99: Basic Kit (Board + 3D printed case)
  - $199: Rugged Pro Unit (Fully assembled, IP67 waterproof, internal battery backup)

### The Tone & Aesthetic
- **Tone:** Angry-at-the-right-things, engineer-respecting, pro-freedom. No startup-speak. Validate the customer's frustration with the "marine tax" and subscription traps.
- **Visual Aesthetic (for the web page):** Dark mode, high contrast. Marine charcoal backgrounds, crisp white text, ocean blue primary accents, and warning amber/orange for Call-to-Action buttons.

### Task 1: Generate the Landing Page
Please write the code for a mobile-first, responsive landing page using React and Tailwind CSS (output this as a single file artifact so I can preview it). 
The page must include:
- **Hero Section:** Strong headline, subheadline, and a CTA to "Back us on Kickstarter".
- **The Problem/Solution (Split Section):** Visually contrast the $240/yr commercial subscription against our $2/mo BYO-SIM reality.
- **Hardware Features:** Highlight the IP67 waterproofing, ESP32 brain, open CM4-style architecture, and the open Nano-SIM slot.
- **Pricing Tiers:** 3 clean pricing cards for the $49, $99, and $199 tiers.

### Task 2: Generate the Kickstarter Page
Please write the complete Kickstarter campaign page in Markdown.
The page must include:
- A compelling hook/intro.
- "The Subscription Trap" section.
- "The Hardware" section (explaining why it's tough enough for marine use).
- "The Tiers" breakdown.
- "The Anti-VC Pledge" (A bold promise that we will never take Venture Capital, never lock features behind a paywall, and all schematics/code are open-source on GitHub).

Please provide the web page code and the markdown document as two separate artifacts.
```
