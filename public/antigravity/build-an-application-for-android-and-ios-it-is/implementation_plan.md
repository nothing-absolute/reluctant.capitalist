# Family Hub App — Implementation Plan

A cross-platform Flutter app (Android + iOS) for family coordination, planning, budgeting, and local LLM integration.

---

## Design Language

Inspired by DailyPlan: **clean white/light-gray backgrounds**, **color-coded category cards** with rounded corners, **subtle shadows**, a calming teal/indigo primary palette with warm accents, and a bottom navigation bar. Dark mode supported.

**Color Palette:**
- Primary: `#2D6A9F` (calm blue) / `#1ABC9C` (teal accent)
- Background: `#F4F6FA` (light) / `#0F172A` (dark)
- Category colors: Blue, Green, Amber, Purple, Coral, Teal (one per module)
- Font: **Inter** (clean, readable sans-serif)

---

## App Sections (Bottom Nav Tabs)

| Tab | Icon | Color | Purpose |
|-----|------|-------|---------|
| **Home** | 🏠 | Blue | Family feed of recent activity |
| **Plans** | 📅 | Teal | Shared family planning posts |
| **To-Do** | ✅ | Green | Notes and task lists |
| **Budget** | 💰 | Amber | Expenses, project funds, money requests |
| **Aria** | 🤖 | Purple | Local LLM assistant |

---

## Technology Stack

- **Framework:** Flutter (Dart) — single codebase for Android + iOS
- **State Management:** Riverpod
- **Local DB:** SQLite via `drift` package (offline-first)
- **Backend Sync:** `json_rpc_2` / REST calls to homelab server
- **LLM Integration:** HTTP calls to local Ollama / LM Studio endpoint (user-configurable URL)
- **Price Watch:** HTTP polling against retailer APIs or scraping endpoints via homelab
- **Notifications:** `flutter_local_notifications`
- **Auth:** Simple 4-digit PIN or biometric per device (family-only, no cloud auth needed)

---

## Open Questions

> [!IMPORTANT]
> **LLM Server URL**: What is the address/port of your homelab LLM? (e.g., `http://192.168.1.100:11434` for Ollama). The app will have a Settings screen where this can be entered.

> [!IMPORTANT]
> **Sync Strategy**: Should family data sync through your homelab server, or do you want a simple shared local network sync? (Options: homelab REST API, Supabase self-hosted, or just local SQLite with manual export)

> [!NOTE]
> **Family Members**: How many people? Do you want separate user profiles (each person picks their avatar/name on first launch) or one shared device experience?

> [!NOTE]
> **Price Watch**: Which stores? Amazon, Best Buy, Target? The homelab LLM section can run a background watcher that pings your server to check prices.

---

## Proposed Changes

### Project Structure

#### [NEW] `[local path redacted]/`

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

---

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

---

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

