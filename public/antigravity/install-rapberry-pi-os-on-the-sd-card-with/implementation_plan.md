# Install Raspberry Pi OS and Configure XPT2046

This plan details the steps to safely download, flash, and configure the Raspberry Pi OS onto your SD card. The configuration will specifically set up the SPI interface and the `ads7846` (XPT2046) overlay required for your touch controller on a Raspberry Pi 3 B+.

> [!CAUTION]
> Flashing an OS to a drive is a destructive action. We must be absolutely sure of the target SD card device path (e.g., `/dev/mmcblk0` or `/dev/sdb`) to avoid accidentally wiping your host machine's hard drive!

## Open Questions

Before we proceed, please answer the following questions:

1. **Target SD Card Device:** What is the exact block device path of your SD card? (You can usually find this by running `lsblk` in your terminal).
2. **OS Version:** Do you prefer Raspberry Pi OS **Lite** (no desktop environment, faster) or **Desktop**?
3. **Headless Setup:** Do you need SSH enabled and Wi-Fi pre-configured? If so, please provide your Wi-Fi SSID and Password (or you can add them manually later).
4. **Touch Calibration:** Do you need any specific display rotation (e.g., 90, 180, 270 degrees) or X/Y axis swapping for your specific screen?

## Proposed Changes

Once you provide the above information, I will create and execute an automation script (`flash_and_config_rpi.sh`) that will perform the following actions:

### 1. Download and Extract the OS Image
We will download the latest stable release of Raspberry Pi OS (Bookworm) and extract the `.img` file.

### 2. Flash the SD Card
Using the `dd` command, we will carefully write the image to your specified SD card device. 

### 3. Configure the XPT2046 Touch Controller
We will temporarily mount the SD card's boot partition and modify the `/boot/firmware/config.txt` (or `/boot/config.txt` depending on OS version) to append the following required lines:

```ini
# Enable SPI interface
dtparam=spi=on

# Configure the XPT2046 (ads7846) touch controller
dtoverlay=ads7846,speed=50000,penirq=25,penirq_pull=2,keep_vref_on=0,swapxy=0,pmax=255,xohms=150,xmin=200,xmax=3900,ymin=200,ymax=3900
```
*(Note: Parameters like `swapxy`, `xmin`, `xmax`, etc., can be adjusted later if the touch coordinates are inverted or misaligned).*

### 4. Enable SSH and Wi-Fi (Optional)
If requested, we will also create the `ssh` empty file and the `wpa_supplicant.conf` file in the boot partition for a seamless headless setup.

## Verification Plan

### Manual Verification
1. Insert the SD card into your Raspberry Pi 3 B+.
2. Connect your XPT2046 display to the GPIO pins.
3. Power on the Raspberry Pi.
4. Verify that the screen receives input and the touch controller registers your touches correctly. If the touch axes are inverted, we can SSH in and adjust the `config.txt` parameters.
