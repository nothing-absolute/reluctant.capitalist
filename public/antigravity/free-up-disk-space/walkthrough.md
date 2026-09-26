# Disk Space Cleanup Walkthrough

## Changes Made
The following actions were taken to free up disk space:
- **Cleaned NPM Cache**: `npm cache clean --force` was run to clear out the Node.js package cache.
- **Emptied User Cache Directory**: The contents of `~/.cache/` were removed, clearing temporary files created by various applications.
- **Removed Crash Dumps**: The large crash dump file `~/core.1431657` was deleted.
- **Flatpak Cleanup**: Ran `flatpak uninstall --unused -y` to remove unused Flatpak runtimes (no unused runtimes were found).

## Validation Results
Before cleanup, the root partition `/dev/sda2` was **100% full** (95GB used, 265MB available).
After cleanup, the partition is now **95% full** (90GB used, 5.1GB available).

We successfully freed up **~4.8 GB** of disk space! 

If you'd like to free up more space in the future, please consider reviewing your personal directories such as `~/Videos`, `~/.local`, `~/.config`, and `~/Documents`.
