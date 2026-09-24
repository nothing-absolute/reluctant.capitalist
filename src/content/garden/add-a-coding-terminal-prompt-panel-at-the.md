---
title: "Add a coding terminal / prompt panel at the bottom of the MPC web app"
description: "Adds a terminal panel for generating code in MPC web app"
date: "2026-08-21"
tags: ["coding","terminal","generative","web","development"]
source: "antigravity://aacd384e-3289-4d33-9eb1-fb12335d388c"
draft: false
vault: false
---

<details>
<summary>Chat transcript — 2 messages, 2026-08-21 → 2026-08-21</summary>

**You** · 2026-08-21 04:33

Add a coding terminal / prompt panel at the bottom of the MPC web app.
1. The panel should allow typing a prompt for 'Processing Visuals' or 'PureData Audio'.
2. When the user clicks 'Generate Node', parse key terms (like 'tunnel', 'glitch', 'rainbow', 'feedback', 'wave', 'delay', 'noise', 'reverb', 'distort') or execute a robust generative algorithm to output fully operational custom code.
3. Automatically spawn a new Custom Node in the workspace wrapper.
   - For 'Processing Visuals': Spawns a node running the generated p5.js/canvas render routine.
   - For 'PureData Audio': Spawns an audio node running the Web Audio API representation of the requested PureData synthesis graph.
4. Let the user also view and edit the generated code in a mini text editor in the terminal panel.
Update index.html, index.css, and app.js to integrate this terminal. Make sure it has beautiful animations, glow outlines, and look futuristic.

---

**Antigravity** · 2026-08-21 04:35

I have successfully integrated the **Generative Node Graph Terminal** at the bottom of the MPC web app.

### Accomplished Changes:
1. **Interactive Layout (`index.html`)**: Added a terminal footer layout (`terminal-panel`) consisting of:
   - Mode selectors for **Processing Visuals** and **PureData Audio**.
   - A shell-like prompt field (`#terminal-prompt-input`) with a "Generate Node" button.
   - A mini text editor (`#terminal-code-editor`) with an "Apply Changes" button to manually tweak live JavaScript.
2. **Futuristic Aesthetics (`index.css`)**: Equipped the panel with a cyberpunk theme featuring scanning animations, outline glow accents when focused, custom scrollbars/fields, and a clean side-by-side grid layout.
3. **Synthesis & Visual Canvas Pipeline (`app.js`)**:
   - Implemented two new custom Node classes: `CustomVisualNode` and `CustomAudioNode`.
   - Programmed algorithmic pattern generators parsing keywords (`tunnel`, `glitch`, `rainbow`, `feedback`, `wave`, `delay`, `noise`, `reverb`, `distort`) into clean, modular Javascript routines.
   - Built dynamic compilation/execution wrappers hookable directly to MPC Drum Pad triggers and LFO modulation inputs.
4. **Validation**: Ran Vite's production build pipeline successfully to ensure the changes are free of compilation or formatting issues.

</details>

---

*Imported from Antigravity conversation `aacd384e-3289-4d33-9eb1-fb12335d388c` — 52 recorded steps, 23 tool actions, 1 context checkpoints (earlier turns were truncated by Antigravity). Source: `antigravity`.

## Related

- [UNDERTONE — OpenCode Agent System Prompt](/garden/undertone-opencode-prompt/)
- [Undertone — Pitch Deck]
- [Undertone Pitch Deck]
