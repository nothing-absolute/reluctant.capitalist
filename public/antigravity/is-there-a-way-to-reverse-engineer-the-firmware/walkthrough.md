# OP-XY DIY Synthesizer Build Walkthrough

We have successfully initialized the project architecture and code framework for the **OP-XY** DIY synthesizer, combining LMN-3 hardware with an OTTO-style visual interface and DSP.

---

## 📁 Repository Structure Created

Here is the directory structure created at `[local path redacted]/`:

*   **[docs/](file://[local path redacted]/)**
    *   [schematics.md](file://[local path redacted]): Pin mappings between Raspberry Pi, Teensy 4.1, Hyperpixel 4.0 display, and PCM5102a DAC.
    *   [build_guide.md](file://[local path redacted]): 3D printing guidelines and step-by-step mechanical assembly instructions.
*   **[firmware-teensy/](file://[local path redacted]/)**
    *   [firmware-teensy.ino](file://[local path redacted]): Teensy 4.1 C++ code scanning the 4x6 grid keyboard matrix and the 4 quadrature encoders, transmitting USB-MIDI data.
*   **[software-pi/](file://[local path redacted]/)**
    *   [simulator.py](file://[local path redacted]): A fully interactive, real-time Python/Pygame simulator running an 800x480 screen displaying OTTO-style dial rings, a running wave oscilloscope, and a virtual keyboard with dynamic DSP FM-synthesis sound generation.

---

## 🕹️ How to Run the Desktop Simulator

You can test the DSP parameters and user interface instantly on your machine before assembling the hardware.

### 1. Install Dependencies
Make sure you have Python 3 and Pygame installed:
```bash
pip install pygame
```

### 2. Launch the Simulator
Run the Python script:
```bash
python [local path redacted]
```

### 3. Controls Layout
*   **Musical Keys**: Use your QWERTY keyboard:
    *   White keys: `A`, `S`, `D`, `F`, `G`, `H`, `J`, `K`
    *   Black keys: `W`, `E`, `T`, `Y`, `U`
*   **Parameters Adjustment**: Hover your mouse cursor over one of the four color-coded status dials on the left and **scroll your mouse wheel** (or trackpad scroll) up or down:
    *   **Blue (Waveform)**: Cycle through Sine, Square, Sawtooth, and Triangle oscillators.
    *   **Green (Modulation Rate)**: Control the frequency of the LFO/FM modulator.
    *   **White (Envelope Release)**: Adjust envelope decay/release length.
    *   **Orange (Volume)**: Set output gain.

---

## 🛠️ Next Hardware Steps

1.  Order the parts listed in the [build_guide.md](file://[local path redacted]).
2.  Print the Top Plate and Bottom Case using the settings provided.
3.  Flash [firmware-teensy.ino](file://[local path redacted]) to your Teensy 4.1 using the Arduino IDE.
4.  Configure the Raspberry Pi with a real-time Linux kernel overlay and test with the USB MIDI inputs.
