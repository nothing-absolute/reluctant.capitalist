# 📱 Family Hub — Android Preview & Beta Build

Here is the design mockup and beta installation setup for the **Family Hub** app on Android.

---

## 🎨 Interface Mockup

![Family Hub Android Interface]([local path redacted])

### Key Interface Highlights:
- **Greeting Header**: Personalized greeting with quick avatar status indicators.
- **Family Member Carousel**: Live emoji avatar chips for switching profiles or viewing individual activity.
- **Pinned Plans**: Visual cards for upcoming trips, events, and projects with countdowns.
- **Activity Feed**: Unified stream of completed chores, pending budget requests, and updates.
- **Material 3 Bottom Navigation**: Smooth navigation between Home, Tasks, Plans, Budget, and Aria Assistant.

---

## 📦 Installing the Beta APK on Android

Once the build process completes, your APK file will be ready at:
`file://[local path redacted]`

### Quick Install Methods:

#### Method A: Via USB / ADB (Fastest if device connected)
```bash
export PATH="$HOME/Android/Sdk/platform-tools:$PATH"
adb install [local path redacted]
```

#### Method B: Direct APK Transfer
1. Copy `app-debug.apk` onto your Android phone via Google Drive, USB, or local file sharing.
2. Tap the `.apk` file on your device.
3. Allow *"Install from unknown sources"* if prompted.
4. Open **Family Hub** and complete the quick 3-step onboarding setup!
