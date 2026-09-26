# Viral Campaign Kit Remotion Video Ads

This implementation plan details the creation of high-converting social media video advertisements for the 1994 Lion King Theatrical Standee, based on the `Lion King Standee _ Viral Campaign Kit_v1.html` campaign kit.

## Proposed Changes

We will generate **6 distinct targeted video ad compositions** plus a **Master Campaign Showcase Reel** in Remotion, reflecting the exact design aesthetics, color palettes, motion hooks, and buyer persona targeting defined in the Viral Campaign Kit.

---

### [Remotion Project] `[local path redacted]`

#### [NEW] [InvestorAd.tsx](file://[local path redacted])
- **Target Persona**: Institutional Investor / Portfolio Collector
- **Theme**: Dark stone & gold (`#2d241e`, `#c2410c`), financial asset motif
- **Key Elements**: Box office gross stats ($968.5M), authenticity verification badge, shipping box showcase (`PXL_20260630_030758959.jpg`), CTA: "VIEW VALUATION REPORT"

#### [NEW] [HistorianAd.tsx](file://[local path redacted])
- **Target Persona**: Archival Collector / Film Preservationist
- **Theme**: Sepia/amber archival paper, schematic blueprint lines
- **Key Elements**: Assembly instructions zoom (`PXL_20260630_030747818.jpg`), 10,000+ theaters vs 1 survivor stat, CTA: "PROVENANCE DETAILS"

#### [NEW] [SuperFanAd.tsx](file://[local path redacted])
- **Target Persona**: Disney Renaissance Super-Fan / Millennial
- **Theme**: Vivid blue/orange sunset glow, cinematic font transitions
- **Key Elements**: Painted Mufasa cloud artwork (`PXL_20260630_030506933.jpg`), emotional memory hook, CTA: "OWN THE LEGEND"

#### [NEW] [FomoAd.tsx](file://[local path redacted])
- **Target Persona**: Auction Fence-sitters / High Urgency Buyers
- **Theme**: Crimson red alert (`#dc2626`), high-energy pulse & glitch effects
- **Key Elements**: "⚠️ ONE OF ONE", full standee collage (`lion_king_standee_listing_collage.jpg`), auction ticker, CTA: "BID NOW"

#### [NEW] [LocalAd.tsx](file://[local path redacted])
- **Target Persona**: Sioux Falls Local & Regional History Enthusiasts
- **Theme**: Emerald green, 32-year preservation story stamp
- **Key Elements**: Theater shipping label focus, "A PIECE OF SIOUX FALLS HISTORY", CTA: "READ THE STORY"

#### [NEW] [StoryAd.tsx](file://[local path redacted])
- **Target Persona**: Community Validators & Collectors
- **Theme**: Mystery slate gray, question mark ambient animations
- **Key Elements**: "DOES ANYONE HAVE ONE OF THESE?", curiosity hook, CTA: "HELP ME FIND"

#### [NEW] [CampaignMasterReel.tsx](file://[local path redacted])
- **Compilation**: A 30-second high-energy showcase reel cycling through all 6 viral angles with smooth transitions, perfect for multi-channel video ads.

#### [MODIFY] [Root.tsx](file://[local path redacted])
- Register all 6 individual ad compositions (1080x1350 4:5 Instagram Feed & 1080x1920 9:16 Vertical) plus the `CampaignMasterReel`.

---

## Verification Plan

### Automated Build & Render
1. Run `npx remotion render` for each composition in `[local path redacted]/`.
2. Output MP4 files to `[local path redacted]/`:
   - `ad_investor.mp4`
   - `ad_historian.mp4`
   - `ad_superfan.mp4`
   - `ad_fomo.mp4`
   - `ad_local.mp4`
   - `ad_story.mp4`
   - `campaign_master_reel.mp4`

### Manual Verification
- Update `walkthrough.md` with links and embedded previews of all rendered ad videos.
