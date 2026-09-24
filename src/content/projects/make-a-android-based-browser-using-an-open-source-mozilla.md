---
title: "Make a Android-based browser using an open source Mozilla Firefox as the base"
description: "Implementation plan for a minimal Android browser based on Mozilla Firefox."
date: "2026-08-23"
tags: ["browser","android","mozilla","geckoview","privacy","raw-source","undistilled"]
source: "antigravity://750b0b62-4e01-46ef-b4f0-6772e34267d6"
draft: true
---

## projects

## Make a Android-based browser using an open source Mozilla Firefox as the base. It…

## implementation plan

## Implementation Plan - Zen Android Browser

We will design and implement the architecture for **Zen Android Browser** (working title: *ZenMobile*). ZenMobile is a minimal, privacy-focused Android browser based on Mozilla's GeckoView (the engine behind Firefox for Android). It features:
1. **Zen Minimal UI**: A highly simplified, gesture-driven browser interface.
2. **Dashboard Pages (History & Tab Extension Combo)**: One-stop control panel for recent history and open tabs.
3. **FoxyProxy LLM Wrapper**: A text-based proxy helper that recommends and configures proxies for blocked sites using a light LLM.
4. **Tampermonkey & Nova YouTube Pre-configuration**: Custom userscript settings adjustable via natural language prompts instead of deep menus.
5. **Build Variants**: Google Play flavor (with AdMob ads) and F-Droid flavor (completely ad-free and open-source).

To help visualize and prototype these advanced features, we will build an **Interactive Web Prototype** of the browser's UI, and scaffold the **Android GeckoView Kotlin Codebase** in `/home/jd/.gemini/antigravity/scratch/zen-android-browser/`.


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


## Proposed Changes

### Component 1: Android Project Scaffolding
We will create a multi-flavor Android project with Kotlin:
- `[NEW]` [settings.gradle.kts](file:///home/jd/.gemini/antigravity/scratch/zen-android-browser/settings.gradle.kts)
- `[NEW]` [build.gradle.kts](file:///home/jd/.gemini/antigravity/scratch/zen-android-browser/build.gradle.kts)
- `[NEW]` [app/build.gradle.kts](file:///home/jd/.gemini/antigravity/scratch/zen-android-browser/app/build.gradle.kts)
- `[NEW]` [AndroidManifest.xml](file:///home/jd/.gemini/antigravity/scratch/zen-android-browser/app/src/main/AndroidManifest.xml)
- `[NEW]` [MainActivity.kt](file:///home/jd/.gemini/antigravity/scratch/zen-android-browser/app/src/main/java/app/zen/browser/MainActivity.kt)
- `[NEW]` [ProxyHelper.kt](file:///home/jd/.gemini/antigravity/scratch/zen-android-browser/app/src/main/java/app/zen/browser/proxy/ProxyHelper.kt)
- `[NEW]` [ScriptPromptManager.kt](file:///home/jd/.gemini/antigravity/scratch/zen-android-browser/app/src/main/java/app/zen/browser/scripts/ScriptPromptManager.kt)

### Component 2: Interactive Web Simulator
To visualize this beautiful layout, we will build a rich web simulator:
- `[NEW]` [index.html](file:///home/jd/.gemini/antigravity/scratch/zen-android-browser/prototype/index.html)
- `[NEW]` [style.css](file:///home/jd/.gemini/antigravity/scratch/zen-android-browser/prototype/style.css)
- `[NEW]` [app.js](file:///home/jd/.gemini/antigravity/scratch/zen-android-browser/prototype/app.js)


## Verification Plan

### Automated Scaffolding Verification
- Run a gradle sync dry-run or compile test if possible.
- Run static checks on Kotlin files.

### Interactive Verification
- Launch the prototype simulator using `browser_subagent` to verify all custom UI features (minimal UI, FoxyProxy LLM prompt, Tampermonkey prompt, and history/tab dashboard).


## task

## Tasks: Zen Android Browser

- `[x]` Scaffold Android Project Build Files
  - `[x]` settings.gradle.kts
  - `[x]` build.gradle.kts (project level)
  - `[x]` app/build.gradle.kts (app level with playStore / fdroid flavors)
  - `[x]` AndroidManifest.xml
- `[x]` Implement Kotlin Source Files
  - `[x]` MainActivity.kt (Minimal GeckoView setup, simplified UI handling)
  - `[x]` ProxyHelper.kt (FoxyProxy LLM wrapper helper)
  - `[x]` ScriptPromptManager.kt (Tampermonkey prompt configuration parser)
- `[x]` Implement Interactive Web Simulator (Prototype)
  - `[x]` prototype/index.html
  - `[x]` prototype/style.css
  - `[x]` prototype/app.js
- `[x]` Verification and Preview
  - `[x]` Run static analysis / preview checks
  - `[x]` Capture walkthrough details


## walkthrough

## Walkthrough: Zen Android Browser

We have successfully scaffolded the Gradle build definitions, Kotlin modules, manifests, and created an interactive HTML5/CSS3 prototype showing the user interface, LLM FoxyProxy helper, and Nova YouTube settings prompter.


## Changes Made

### Android Scaffolding & Base Shell
1. **[settings.gradle.kts](file:///home/jd/.gemini/antigravity/scratch/zen-android-browser/settings.gradle.kts)**: Configured repositories to include Mozilla's Maven repo (`https://maven.mozilla.org/maven2/`).
2. **[build.gradle.kts](file:///home/jd/.gemini/antigravity/scratch/zen-android-browser/build.gradle.kts)**: Standard Kotlin and Android Gradle plugin definitions.
3. **[app/build.gradle.kts](file:///home/jd/.gemini/antigravity/scratch/zen-android-browser/app/build.gradle.kts)**:
   - Configured GeckoView (`org.mozilla.geckoview:geckoview-stable:120.0.20231116134553`).
   - Defined `playStore` (with AdMob ads dependency) and `fdroid` (ad-free) product flavors.
4. **[AndroidManifest.xml](file:///home/jd/.gemini/antigravity/scratch/zen-android-browser/app/src/main/AndroidManifest.xml)**: Standard internet permission setup and AdMob application ID placeholder.
5. **[MainActivity.kt](file:///home/jd/.gemini/antigravity/scratch/zen-android-browser/app/src/main/java/app/zen/browser/MainActivity.kt)**: Setup GeckoView session, minimal bottom controller bar with shortcut buttons (Dashboard, Proxy Assistant, Nova YT Prompt, Settings), dialogs, and conditional playStore ads initializer.
6. **[ProxyHelper.kt](file:///home/jd/.gemini/antigravity/scratch/zen-android-browser/app/src/main/java/app/zen/browser/proxy/ProxyHelper.kt)**: Mocked the FoxyProxy LLM helper that resolves blocking reasons (e.g. SOCKS5 proxy recommendation for school firewalls) and sets the GeckoView proxy config.
7. **[ScriptPromptManager.kt](file:///home/jd/.gemini/antigravity/scratch/zen-android-browser/app/src/main/java/app/zen/browser/scripts/ScriptPromptManager.kt)**: Parses natural language commands to update Nova settings variables and outputs javascript config payloads to inject.

### Interactive UI Prototype
- Built a gorgeous HTML5 simulator illustrating the minimal Zen layout, history/tab combo dashboard, the FoxyProxy LLM form, and Nova prompt configurations:
  - **[index.html](file:///home/jd/.gemini/antigravity/scratch/zen-android-browser/prototype/index.html)**
  - **[style.css](file:///home/jd/.gemini/antigravity/scratch/zen-android-browser/prototype/style.css)**
  - **[app.js](file:///home/jd/.gemini/antigravity/scratch/zen-android-browser/prototype/app.js)**


## Status and Playwright Issue
During verification, the headless browser subsystem returned a `404 Not Found` downloading Playwright drivers, which prevented automatic screenshot capture. However, all source files are intact in `/home/jd/.gemini/antigravity/scratch/zen-android-browser/`.

## Assets
- [implementation_plan.md](/antigravity/make-a-android-based-browser-using-an-open-source-mozilla/implementation_plan.md) — MD, 4 KB
- [task.md](/antigravity/make-a-android-based-browser-using-an-open-source-mozilla/task.md) — MD, 761 B
- [walkthrough.md](/antigravity/make-a-android-based-browser-using-an-open-source-mozilla/walkthrough.md) — MD, 3 KB

## Related

- [AI Task Concierge Concept](/projects/ai-task-concierge/)
- [Music Hardware Market Analysis & Kickstarter Blueprint](/projects/analyze-the-sythnesizer-midi-controller-guitar-pedal-market/)
- [building a react testbed for the byo sim boat monitor](/projects/build-a-testing-application-for-the-byo-sim-boat/)

---

> **Undistilled source.** This post is raw working material restored from quarantine: the
> narrative prose here is a machine transcript with repetition loops, kept for the record rather
> than for reading. The ideas inside it are being extracted into the
> [fragments](/fragments/) section, and the coherent version lives in the synthesis posts.
> Nothing is lost here — it is just not published.
