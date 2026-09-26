# Lumina Phone Kickstarter Campaign Pitch

We will design and build a premium, interactive Kickstarter campaign landing page for the **Lumina Phone & Lumina OS**—a distraction-free minimalist Android-based phone, accompanied by the **Lumina Kids** edition and an interactive **Parental Control Web App** simulator.

The page will follow a high-end minimalist design aesthetic using rich dark/light modes, glassmorphism, fluid interactive components, and premium typography.

---

## User Review Required

> [!IMPORTANT]
> - **Product Identity**: We have named this concept **Lumina Phone** (running **Lumina OS**). The Kids edition is named **Lumina Kids**.
> - **Privacy-First, Google-Free OS**: Per your requirement, Lumina OS will be built on a **DeGoogled Android (AOSP)** foundation. It will completely strip out Google Mobile Services (GMS), ensuring zero background tracking, maximum battery life, and complete data privacy. We will highlight this heavily in the marketing pitch as a major selling point for privacy-conscious adults and safety-focused parents.
> - **Hardware Strategy Update**: Initial funding tiers will offer Lumina OS pre-installed on **off-the-shelf hardware** (a rugged Android for kids, and a standard OLED Android for adults). The previously rendered custom hardware (e-ink Pro and pastel bio-polycarbonate Kids) will be positioned as **Stretch Goals** at $1M and $1.5M.
> - **Interactive Simulators**: The core of the landing page will feature two side-by-side live simulators:
>   1. **Lumina Kids Phone Simulator**: Visualizing the minimalist home screen, essential apps, and restriction states.
>   2. **Lumina Parent Dashboard Simulator**: Allowing you to toggle app availability, set screen time schedules, and view mock location data, with changes instantly reflecting on the Kids Phone simulator.

---

## Proposed Changes

We will create a project directory at `[local path redacted]` containing the web assets.

### Kickstarter Web Page Component

#### [NEW] [index.html](file://[local path redacted])
- Main landing page structuring the Kickstarter campaign.
- Sections:
  - Hero Section: High-impact taglines, visual pitch, "Back this Project" status bar.
  - The Core Problem & Philosophy: Narrative on digital fatigue and mindful technology.
  - Lumina OS Feature Matrix: Interactive list of basic distraction-free apps, highlighting the **Google-Free, Tracking-Free privacy architecture**.
  - Interactive Simulator Playground: Side-by-side mockups of the Parent Control Web App and the Lumina Kids Phone OS.
  - Hardware Strategy: Pitching the reliable off-the-shelf "Phase 1" hardware for early delivery.
  - Reward Tiers: Interactive pledge card selector for the initial off-the-shelf tiers.
  - Stretch Goals: Displaying the premium custom hardware renderings (E-ink Pro and Custom Kids) as unlockable targets.

#### [NEW] [style.css](file://[local path redacted])
- Premium dark-themed stylesheet utilizing a neutral slate, warm cream, and soft accent colors.
- Custom fonts (using Inter and Outfit via Google Fonts).
- Responsive grid layouts, glassmorphic panels, glowing cards.
- Smooth transitions, micro-animations, and hover states for all interactive elements.

#### [NEW] [app.js](file://[local path redacted])
- Interactive Simulator Engine:
  - Binds parent dashboard switches to the adjacent Lumina Kids screen.
  - Updates the child's screen in real-time, removing/adding app icons or triggering fullscreen lock overlays.
- Backer Widgets:
  - Backer status progress bar simulator (increases funding when users click "Simulate Pledge").
  - Dynamically unlocks stretch goals on the UI if the simulated funding passes $1,000,000.

---

## Verification Plan

### Manual Verification
- We will start a local server using python and check the rendering and layout.
- We will use the `browser_subagent` to test the page in a browser, confirm styling, interactions (dashboard toggles updating phone launcher in real-time), and capture a video of the interface.
