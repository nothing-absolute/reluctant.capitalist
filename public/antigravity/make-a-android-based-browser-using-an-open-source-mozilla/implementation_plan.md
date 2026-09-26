# Implementation Plan - Zen Android Browser

We will design and implement the architecture for **Zen Android Browser** (working title: *ZenMobile*). ZenMobile is a minimal, privacy-focused Android browser based on Mozilla's GeckoView (the engine behind Firefox for Android). It features:
1. **Zen Minimal UI**: A highly simplified, gesture-driven browser interface.
2. **Dashboard Pages (History & Tab Extension Combo)**: One-stop control panel for recent history and open tabs.
3. **FoxyProxy LLM Wrapper**: A text-based proxy helper that recommends and configures proxies for blocked sites using a light LLM.
4. **Tampermonkey & Nova YouTube Pre-configuration**: Custom userscript settings adjustable via natural language prompts instead of deep menus.
5. **Build Variants**: Google Play flavor (with AdMob ads) and F-Droid flavor (completely ad-free and open-source).

To help visualize and prototype these advanced features, we will build an **Interactive Web Prototype** of the browser's UI, and scaffold the **Android GeckoView Kotlin Codebase** in `[local path redacted]`.

---

## Technical Architecture

### 1. Android Engine & Components
- **GeckoView**: Used for page rendering and WebExtension compatibility (uBlock Origin, Tampermonkey, FoxyProxy).
- **Mozilla Android Components**: Specifically `browser-engine-gecko` for session handling, `browser-state` for tab and history management.

### 2. Built-in Extensions & Custom Injectors
- **Pre-installed Extensions**:
  - **uBlock Origin**: Included in the asset bundle and auto-loaded via GeckoView's WebExtension APIs.
  - **Tampermonkey & Nova YouTube**: Bootstrapped via WebExtensions or custom JavaScript injection in GeckoSession.
- **FoxyProxy LLM Wrapper**:
  - A custom Kotlin interface containing a text box.
  - Passes user input to a light local LLM or API endpoint (e.g., Gemini Nano or simple REST helper) to suggest proxy workarounds (HTTP/SOCKS5).
  - Uses GeckoView's proxy API (`GeckoRuntime.getSettings().setProxy...`) to apply settings dynamically.

### 3. Build Flavors (`build.gradle.kts`)
- `playStore`: Includes Google Mobile Ads SDK (AdMob) dependencies and renders banner/interstitial ads.
- `fdroid`: Excludes AdMob dependencies completely, using fake/empty view stubs to maintain clean layout.

---

## Proposed Changes

### Component 1: Android Project Scaffolding
We will create a multi-flavor Android project with Kotlin:
- `[NEW]` [settings.gradle.kts](file://[local path redacted])
- `[NEW]` [build.gradle.kts](file://[local path redacted])
- `[NEW]` [app/build.gradle.kts](file://[local path redacted])
- `[NEW]` [AndroidManifest.xml](file://[local path redacted])
- `[NEW]` [MainActivity.kt](file://[local path redacted])
- `[NEW]` [ProxyHelper.kt](file://[local path redacted])
- `[NEW]` [ScriptPromptManager.kt](file://[local path redacted])

### Component 2: Interactive Web Simulator
To visualize this beautiful layout, we will build a rich web simulator:
- `[NEW]` [index.html](file://[local path redacted])
- `[NEW]` [style.css](file://[local path redacted])
- `[NEW]` [app.js](file://[local path redacted])

---

## Verification Plan

### Automated Scaffolding Verification
- Run a gradle sync dry-run or compile test if possible.
- Run static checks on Kotlin files.

### Interactive Verification
- Launch the prototype simulator using `browser_subagent` to verify all custom UI features (minimal UI, FoxyProxy LLM prompt, Tampermonkey prompt, and history/tab dashboard).
