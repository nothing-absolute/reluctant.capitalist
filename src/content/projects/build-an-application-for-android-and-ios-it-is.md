---
title: "Family Hub App Development Plan"
description: "A cross-platform Flutter app for family coordination, planning, budgeting, and local LLM integration."
date: "2026-08-28"
tags: ["family-app","flutter","llm-integration"]
source: "antigravity://a51dd36a-a2ff-436d-9ec5-9c3989439240"
draft: false
---

## Family Hub — Android Beta Release

## 📱 Family Hub — Android Preview & Beta Build

Here is the design mockup and beta installation setup for the **Family Hub** app on Android.

## 🎨 Interface Mockup

![Family Hub Android Interface](/home/jd/.gemini/antigravity/brain/a51dd36a-a2ff-436d-9ec5-9c3989439240/family_hub_android_mockup_1787947653070.jpg)

### Key Interface Highlights:
- **Greeting Header**: Personalized greeting with quick avatar status indicators.
- **Family Member Carousel**: Live emoji avatar chips for switching profiles or viewing individual activity.
- **Pinned Plans**: Visual cards for upcoming trips, events, and projects with countdowns.
- **Activity Feed**: Unified stream of completed chores, pending budget requests, and updates.
- **Material 3 Bottom Navigation**: Smooth navigation between Home, Tasks, Plans, Budget, and Aria Assistant.

## 📦 Installing the Beta APK on Android

Once the build process completes, your APK file will be ready at:
`file:///home/jd/.gemini/antigravity/scratch/family-hub/build/app/outputs/flutter-apk/app-debug.apk`

### Quick Install Methods:

#### Method A: Via USB / ADB (Fastest if device connected)
```bash
export PATH="$HOME/Android/Sdk/platform-tools:$PATH"
adb install /home/jd/.gemini/antigravity/scratch/family-hub/build/app/outputs/flutter-apk/app-debug.apk
```

#### Method B: Direct APK Transfer
1. Copy `app-debug.apk` onto your Android phone via Google Drive, USB, or local file sharing.
2. Tap the `.apk` file on your device.
3. Allow "Install from unknown sources" if prompted.
4. Open **Family Hub** and complete the quick 3-step onboarding setup!

## implementation plan

## Family Hub App — Implementation Plan

A cross-platform Flutter app (Android + iOS) for family coordination, planning, budgeting, and local LLM integration.

## Design Language

Inspired by DailyPlan: **clean white/light-gray backgrounds**, **color-coded category cards** with rounded corners, **subtle shadows**, a calming teal/indigo primary palette with warm accents, and a bottom navigation bar. Dark mode supported.

**Color Palette:**
- Primary: `#2D6A9F` (calm blue) / `#1ABC9C` (teal accent)
- Background: `#F4F6FA` (light) / `#0F172A` (dark)
- Category colors: Blue, Green, Amber, Purple, Coral, Teal (one per module)
- Font: **Inter** (clean, readable sans-serif)

## App Sections (Bottom Nav Tabs)

| Tab | Icon | Color | Purpose |
|-----|------|-------|---------|
| **Home** | 🏠 | Blue | Family feed of recent activity |
| **Plans** | 📅 | Teal | Shared family planning posts |
| **To-Do** | ✅ | Green | Notes and task lists |
| **Budget** | 💰 | Amber | Expenses, project funds, money requests |
| **Aria** | 🤖 | Purple | Local LLM assistant |

## Technology Stack

- **Framework:** Flutter (Dart) — single codebase for Android + iOS
- **State Management:** Riverpod
- **Local DB:** SQLite via `drift` package (offline-first)
- **Backend Sync:** `json_rpc_2` / REST calls to homelab server
- **LLM Integration:** HTTP calls to local Ollama / LM Studio endpoint (user-configurable URL)
- **Price Watch:** HTTP polling against retailer APIs or scraping endpoints via homelab
- **Notifications:** `flutter_local_notifications`
- **Auth:** Simple 4-digit PIN or biometric per device (family-only, no cloud auth needed)

## Open Questions

> [!IMPORTANT]
> **LLM Server URL**: What is the address/port of your homelab LLM? (e.g., `http://192.168.1.100:11434` for Ollama). The app will have a Settings screen where this can be entered.

> [!IMPORTANT]
> **Sync Strategy**: Should family data sync through your homelab server, or do you want a simple shared local network sync? (Options: homelab REST API, Supabase self-hosted, or just local SQLite with manual export)

> [!NOTE]
> **Family Members**: How many people? Do you want separate user profiles (each person picks their avatar/name on first launch) or one shared device experience?

> [!NOTE]
> **Price Watch**: Which stores? Amazon, Best Buy, Target? The homelab LLM section can run a background watcher that pings your server to check prices.

## Proposed Changes

### Project Structure

#### [NEW] `/home/jd/.gemini/antigravity/scratch/family-hub/`

```
family-hub/
├── lib/
│   ├── main.dart                    # App entry point
│   ├── theme/
│   │   └── app_theme.dart           # Color palette, text styles
│   ├── models/                      # Data models
│   │   ├── post.dart
│   │   ├── task.dart
│   │   ├── budget_item.dart
│   │   └── money_request.dart
│   ├── screens/
│   │   ├── home/
│   │   │   └── home_screen.dart     # Family feed
│   │   ├── plans/
│   │   │   ├── plans_screen.dart    # Planning posts list
│   │   │   └── new_plan_screen.dart
│   │   ├── todos/
│   │   │   ├── todos_screen.dart    # Task lists
│   │   │   └── new_task_screen.dart
│   │   ├── budget/
│   │   │   ├── budget_screen.dart   # Budget overview
│   │   │   ├── expense_screen.dart
│   │   │   └── money_request_screen.dart
│   │   ├── aria/
│   │   │   ├── aria_screen.dart     # LLM chat interface
│   │   │   └── aria_settings.dart   # Configure LLM endpoint
│   │   └── settings/
│   │       └── settings_screen.dart
│   ├── widgets/                     # Shared UI components
│   │   ├── category_card.dart
│   │   ├── family_avatar.dart
│   │   └── bottom_nav.dart
│   ├── providers/                   # Riverpod state
│   │   ├── posts_provider.dart
│   │   ├── tasks_provider.dart
│   │   ├── budget_provider.dart
│   │   └── aria_provider.dart
│   └── services/
│       ├── database_service.dart    # SQLite/drift
│       ├── llm_service.dart         # Ollama/LM Studio API
│       └── sync_service.dart        # Homelab sync
├── pubspec.yaml
└── README.md
```

## Key Features Per Screen

### 🏠 Home Feed
- Card-based activity feed (newest plans, tasks due, budget requests)
- Color-coded by category
- Family member avatar + timestamp on each card
- Quick-action FAB to add anything

### 📅 Plans
- Posts with title, description, date, tags
- Categories: Trip, Event, Project, Idea
- Comment/reaction capability (local)
- Pin important posts

### ✅ To-Do
- Multiple named lists (e.g., "Grocery", "Home Repairs", "Weekly Chores")
- Drag-to-reorder, swipe-to-complete
- Assign to family member
- Due dates with local notifications

### 💰 Budget
- Monthly overview with color-coded category bars
- Add expenses by category
- **Money Requests**: Family member submits a request with amount + reason
- Simple approval/deny flow
- Running balance per project

### 🤖 Aria (Local LLM)
- Chat interface with your homelab LLM
- Preset quick-prompts:
  - "Help me plan a family trip"
  - "Research best prices for [item]"
  - "Create a shopping list"
  - "Add a feature to this app"
- **Price Watch**: Add items to a watchlist; Aria polls homelab for price alerts
- Image generation: Send prompt, get image back from local Stable Diffusion / FLUX

## Verification Plan

### Automated
- `flutter analyze` — static analysis
- `flutter test` — unit tests for models and providers

### Manual
- Run on Android emulator: `flutter run`
- Run on iOS simulator: `flutter run`
- Test LLM connection with mock server response
- Verify dark/light mode switching
- Verify offline-first data persistence

## task

## Family Hub — Task List

## Setup & Scaffolding
- [x] Create Flutter project directory structure
- [x] Write pubspec.yaml with all dependencies
- [x] Write app_theme.dart (DailyPlan-inspired colors, light + dark mode)
- [x] Write app_router.dart (go_router with shell navigation)
- [x] Write main.dart (entry point with Riverpod + theming)

## Models
- [x] family_member.dart
- [x] plan_post.dart (with categoryColor getter)
- [x] task_item.dart
- [x] money_request.dart
- [x] aria_message.dart

## Providers (Riverpod StateNotifier + SharedPreferences)
- [x] settings_provider.dart
- [x] plans_provider.dart (with filteredPlansProvider)
- [x] todos_provider.dart (with tasksByListProvider)
- [x] budget_provider.dart (with totalPendingProvider)
- [x] aria_provider.dart (full Ollama HTTP loop + price watch)

## Services
- [x] llm_service.dart (Ollama HTTP, 60s timeout)
- [x] sync_service.dart (homelab stub)

## Screens
- [x] screens/shell/main_shell.dart (Material 3 NavigationBar, 5 tabs)
- [x] screens/onboarding/onboarding_screen.dart (3-page gradient flow)
- [x] screens/home/home_screen.dart (feed, pinned plans, FAB)
- [x] screens/plans/plans_screen.dart (filter chips, long-press options)
- [x] screens/plans/new_plan_screen.dart (form + live preview)
- [x] screens/todos/todos_screen.dart (Dismissible, ExpansionTile)
- [x] screens/todos/new_task_screen.dart (autocomplete, avatar picker)
- [x] screens/budget/budget_screen.dart (tabs: pending/approved/all)
- [x] screens/budget/money_request_screen.dart (prominent amount field)
- [x] screens/aria/aria_screen.dart (chat bubbles, typing indicator, price watch)
- [x] screens/aria/aria_settings.dart (test connection button)
- [x] screens/settings/settings_screen.dart (family members, dark mode, Aria)

## Widgets
- [x] widgets/plan_card.dart (color accent bar)
- [x] widgets/task_card.dart (animated checkbox)
- [x] widgets/money_request_card.dart (approve/deny actions)
- [x] widgets/family_avatar.dart (selected ring animation)

## Finalization
- [x] README.md with setup instructions
- [x] Fix pubspec.yaml (remove font file refs, use GoogleFonts at runtime)
- [x] Create required asset directories (images/, icons/, lottie/) 
- [x] Add AndroidManifest internet permission + cleartext traffic for local HTTP
- [x] Add iOS Info.plist network permissions (NSAllowsLocalNetworking)
- [x] Write setup.sh convenience script
- [x] All files complete ✅

## walkthrough

## Family Hub — App Walkthrough

![Family Hub UI Mockup](/home/jd/.gemini/antigravity/brain/a51dd36a-a2ff-436d-9ec5-9c3989439240/family_hub_mockup_1787943736378.jpg)

## What Was Built

A complete cross-platform Flutter app (Android + iOS) at [/home/jd/.gemini/antigravity/scratch/family-hub/](file:///home/jd/.gemini/antigravity/scratch/family-hub/)

## App Structure

```
family-hub/
├── pubspec.yaml                         # Dependencies
├── README.md                            # Setup guide
└── lib/
    ├── main.dart                        # Entry point
    ├── theme/app_theme.dart             # Color palette (DailyPlan-inspired)
    ├── router/app_router.dart           # Navigation with go_router
    ├── models/
    │   ├── family_member.dart           # 👤 Family member data
    │   ├── plan_post.dart               # 📅 Plan/post data
    │   ├── task_item.dart               # ✅ Task data
    │   ├── money_request.dart           # 💰 Budget request data
    │   └── aria_message.dart            # 🤖 AI chat message
    ├── providers/
    │   ├── settings_provider.dart       # App settings + family members
    │   ├── plans_provider.dart          # Plans state
    │   ├── todos_provider.dart          # Tasks state
    │   ├── budget_provider.dart         # Budget state
    │   └── aria_provider.dart           # Aria chat state
    ├── screens/
    │   ├── shell/main_shell.dart        # Bottom nav shell
    │   ├── onboarding/                  # First-launch setup
    │   ├── home/home_screen.dart        # Family activity feed
    │   ├── plans/                       # Plans list + new plan form
    │   ├── todos/                       # Task lists + new task form
    │   ├── budget/                      # Money requests + form
    │   ├── aria/                        # AI chat + settings
    │   └── settings/settings_screen.dart
    ├── widgets/
    │   ├── plan_card.dart               # Plan card with color accent
    │   ├── task_card.dart               # Task card with checkbox
    │   ├── money_request_card.dart      # Budget request card
    │   └── family_avatar.dart           # Member emoji avatar
    └── services/
        ├── llm_service.dart             # Ollama HTTP client
        └── sync_service.dart            # Homelab sync (stub)
```

## 5 App Tabs

| Tab | Color | What's Here |
|-----|-------|------------|
| 🏠 **Home** | Blue | Activity feed, pinned plans, family avatars |
| 📅 **Plans** | Teal | Create and browse family plans by category |
| ✅ **To-Do** | Green | Multiple named task lists, swipe to complete |
| 💰 **Budget** | Amber | Money requests with approve/deny workflow |
| 🤖 **Aria** | Purple | AI chat powered by your local Ollama server |

## Getting Started

### 1. Install Flutter
```bash
# macOS
brew install --cask flutter

# Or download from https://flutter.dev/docs/get-started/install
``` 

### 2. Run the App
```bash
cd /home/jd/.gemini/antigravity/scratch/family-hub
flutter pub get
flutter run  # runs on connected device or emulator
``` 

### 3. Set Up Aria on Your Homelab
```bash
# On your homelab server
curl -fsSL https://ollama.ai/install.sh | sh
ollama pull llama3.2
OLLAMA_HOST=0.0.0.0 ollama serve
``` 
Then in the app: **Aria tab → ⚙️ → enter your server IP**.

## Design Choices

- **Color palette**: DailyPlan-inspired — calm blue (#2D6A9F), teal (#1ABC9C), amber (#FFB347), purple (#9B59B6), green (#27AE60)
- **Font**: Inter (Google Fonts) — clean, highly readable
- **Cards**: 16px rounded corners, subtle shadow, color-coded left accent bars
- **Dark mode**: Full dark mode support, toggled in Settings
- **Offline-first**: All data stored locally in SharedPreferences (SQLite can be added as the family's data grows)

## Future Expansion via Aria

The Aria tab is designed to grow. Examples of what you can add:

- **Price drop alerts**: Aria polls your homelab to watch Amazon/Best Buy wishlists
- **Image generation**: Connect to local Stable Diffusion or FLUX via Ollama
- **Family calendar sync**: Add CalDAV or Google Calendar integration
- **Shopping automation**: Aria creates Instacart/Amazon lists from your To-Do items
- **New screens**: Ask Aria "add a meal planning section" and it describes the feature spec

## Assets
- [android_beta_release.md](/antigravity/build-an-application-for-android-and-ios-it-is/android_beta_release.md) — MD, 2 KB
![family_hub_android_mockup_1787947653070](/antigravity/build-an-application-for-android-and-ios-it-is/family_hub_android_mockup_1787947653070.jpg)
- [family_hub_android_mockup_1787947653070.jpg](/antigravity/build-an-application-for-android-and-ios-it-is/family_hub_android_mockup_1787947653070.jpg) — JPG, 614 KB
![family_hub_mockup_1787943736378](/antigravity/build-an-application-for-android-and-ios-it-is/family_hub_mockup_1787943736378.jpg)
- [family_hub_mockup_1787943736378.jpg](/antigravity/build-an-application-for-android-and-ios-it-is/family_hub_mockup_1787943736378.jpg) — JPG, 529 KB
- [implementation_plan.md](/antigravity/build-an-application-for-android-and-ios-it-is/implementation_plan.md) — MD, 6 KB
- [task.md](/antigravity/build-an-application-for-android-and-ios-it-is/task.md) — MD, 2 KB
- [walkthrough.md](/antigravity/build-an-application-for-android-and-ios-it-is/walkthrough.md) — MD, 4 KB
