# Family Hub — Task List

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
- [x] screens[local path redacted] (feed, pinned plans, FAB)
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
