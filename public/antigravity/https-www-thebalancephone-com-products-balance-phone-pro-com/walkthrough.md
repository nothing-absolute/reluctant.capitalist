# Lumina Phone Kickstarter Simulator

The interactive Kickstarter campaign landing page and OS simulator for Lumina Phone have been successfully built!

## What was built:
1. **Premium Minimalist UI**: The site uses a deep slate dark mode with glassmorphic panels, highlighting the digital detox aesthetic.
2. **Interactive Parent Dashboard**: Side-by-side with the Lumina Kids phone mock-up.
   - Try toggling the **Web Browser** and **Spotify** switches to see the apps appear/disappear instantly from the kid's home screen.
   - Try enabling **School Mode** to see the device go into a strict lock-down overlay.
3. **Dynamic Backing Widget**: Clicking any pledge card simulates a backer joining the campaign. Watch the progress bar fill up and unlock the Custom Hardware Stretch Goals dynamically once funding hits $1,000,000!

## How to test it locally:

You can open the raw HTML file directly in your browser:
[Open Landing Page Simulator](file://[local path redacted])

Alternatively, for the most accurate rendering, you can start a local development server by opening your terminal, navigating to the scratch directory, and running:
```bash
cd [local path redacted]
python3 -m http.server 8080
```
Then visit `http://localhost:8080` in your web browser.

---

> [!TIP]
> Make sure to click the **"Pledge $469" (Family Pack)** multiple times rapidly to watch the funding skyrocket and trigger the **$1,000,000 Stretch Goal Unlock** animation!
