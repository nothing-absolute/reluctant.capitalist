# Free Up Additional Disk Space

Your root partition is currently 83% full (79G used, 17G available). Since our last cleanup, some temporary files and caches have regenerated. 

## Proposed Changes

Here is the plan to safely free up more space:

### Temporary & Cache Files
- **User Cache Directory**: Empty the contents of `~/.cache/`. This contains temporary application data that can be safely regenerated (e.g., from OpenCode and browsers). This will free up approximately **1.9 GB**.
- **Gradle Cache**: Clear the Android/Gradle dependency cache at `~/.gradle/caches/`. Gradle will re-download only the dependencies you actually use the next time you build an Android project, which helps clear out old, unused dependencies. This will free up approximately **1.3 GB**.

### System & Package Management
- **Flatpak Cleanup**: Run `flatpak uninstall --unused` to remove any newly orphaned or unused flatpak runtimes. 

## User Review Required

> [!WARNING]
> Please review the proposed cleanup actions above. Once you approve, I will automatically execute them for you.

## Open Questions

> [!IMPORTANT]
> The largest space consumers on your drive continue to be your personal directories and application configs (`~/.local/`, `~/Documents/`, `~/.config/`, `~/.mozilla/`), which I will **not** touch without your explicit instruction.
> 
> Would you like me to help you manually inspect any of these large directories?
