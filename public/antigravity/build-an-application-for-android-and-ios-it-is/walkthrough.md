# Family Hub — App Walkthrough

![Family Hub UI Mockup]([local path redacted])

## What Was Built

A complete cross-platform Flutter app (Android + iOS) at [[local path redacted]/](file://[local path redacted]/)

---

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

---

## 5 App Tabs

| Tab | Color | What's Here |
|-----|-------|------------|
| 🏠 **Home** | Blue | Activity feed, pinned plans, family avatars |
| 📅 **Plans** | Teal | Create and browse family plans by category |
| ✅ **To-Do** | Green | Multiple named task lists, swipe to complete |
| 💰 **Budget** | Amber | Money requests with approve/deny workflow |
| 🤖 **Aria** | Purple | AI chat powered by your local Ollama server |

---

## Getting Started

### 1. Install Flutter
```bash
# macOS
brew install --cask flutter

# Or download from https://flutter.dev/docs/get-started/install
```

### 2. Run the App
```bash
cd [local path redacted]
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

---

## Design Choices

- **Color palette**: DailyPlan-inspired — calm blue (#2D6A9F), teal (#1ABC9C), amber (#FFB347), purple (#9B59B6), green (#27AE60)
- **Font**: Inter (Google Fonts) — clean, highly readable
- **Cards**: 16px rounded corners, subtle shadow, color-coded left accent bars
- **Dark mode**: Full dark mode support, toggled in Settings
- **Offline-first**: All data stored locally in SharedPreferences (SQLite can be added as the family's data grows)

---

## Future Expansion via Aria

The Aria tab is designed to grow. Examples of what you can add:

- **Price drop alerts**: Aria polls your homelab to watch Amazon/Best Buy wishlists
- **Image generation**: Connect to local Stable Diffusion or FLUX via Ollama
- **Family calendar sync**: Add CalDAV or Google Calendar integration
- **Shopping automation**: Aria creates Instacart/Amazon lists from your To-Do items
- **New screens**: Ask Aria "add a meal planning section" and it describes the feature spec

