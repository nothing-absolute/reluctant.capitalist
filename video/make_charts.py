#!/usr/bin/env python3
"""Generate the chart assets for a timeline. Local, deterministic, free.

Diffusion models garble text, so every asset that has to show a real number or
a real word is rendered here instead. Only persona photography is sent to a GPU.

    python make_charts.py --out assets
"""

from __future__ import annotations

import argparse
import math
from pathlib import Path

import matplotlib
matplotlib.use("Agg")
import matplotlib.pyplot as plt
from matplotlib.patches import FancyArrowPatch, Rectangle

W, H, DPI = 1920, 1080, 100
BG = "#0a0b0e"
FG = "#f2f2f2"
DIM = "#8a8f98"
ACCENT = "#e8543d"
COOL = "#4d9de0"
WARN = "#e8c84d"
GOOD = "#5fbf7f"

plt.rcParams.update({
    "font.family": "DejaVu Sans",
    "font.weight": "bold",
    "figure.facecolor": BG,
    "axes.facecolor": BG,
    "savefig.facecolor": BG,
    "text.color": FG,
    "axes.labelcolor": FG,
    "xtick.color": DIM,
    "ytick.color": DIM,
})


def canvas(title: str, subtitle: str = ""):
    fig = plt.figure(figsize=(W / DPI, H / DPI), dpi=DPI)
    fig.text(0.05, 0.945, title, fontsize=34, color=FG, weight="bold", va="top")
    if subtitle:
        fig.text(0.05, 0.885, subtitle, fontsize=17, color=DIM, va="top")
    fig.add_artist(plt.Line2D([0.05, 0.95], [0.855, 0.855], color=ACCENT, lw=3))
    return fig


def save(fig, out: Path, name: str) -> None:
    path = out / name
    fig.savefig(path, dpi=DPI, facecolor=BG)
    plt.close(fig)
    print(f"  {name}")


def chart_commission_baseline(out: Path) -> None:
    fig = canvas("THE BASELINE", "the part that is not where it falls apart")
    ax = fig.add_axes([0.12, 0.18, 0.76, 0.58])
    vals = [50, 10, 0]
    labels = ["Customer pays", "You keep", "Everyone else"]
    colors = [COOL, ACCENT, DIM]
    left = 0
    for v, lb, c in zip(vals, labels, colors):
        if v:
            ax.barh([0], [v], left=left, color=c, height=0.5)
        left += v
    ax.set_xlim(0, 50)
    ax.set_yticks([])
    ax.set_xticks([])
    for s in ax.spines.values():
        s.set_visible(False)
    ax.text(25, 0.42, "$50", ha="center", color=FG, fontsize=30, weight="bold")
    ax.text(30, -0.42, "YOU KEEP $10", ha="center", color=ACCENT, fontsize=22, weight="bold")
    fig.text(0.12, 0.11, "20% commission. A good rate. This is not the problem.",
             fontsize=18, color=DIM)
    save(fig, out, "chart_commission_baseline.png")


def chart_customers_required(out: Path) -> None:
    fig = canvas("200 CUSTOMERS = $2,000/MONTH", "people who never quit")
    ax = fig.add_axes([0.08, 0.16, 0.84, 0.62])
    xs = list(range(200))
    ys = [10] * 200
    ax.scatter(xs, ys, s=18, color=ACCENT, alpha=0.85, edgecolors="none")
    ax.set_xlim(-5, 205)
    ax.set_ylim(0, 20)
    ax.set_yticks([])
    ax.set_xticks([0, 50, 100, 150, 200])
    for s in ax.spines.values():
        s.set_visible(False)
    ax.grid(axis="x", color="#1e2128", lw=1)
    ax.set_xlabel("paying customers", fontsize=15, color=DIM, labelpad=10)
    fig.text(0.08, 0.10, "Not 200 people. 200 people who never leave.",
             fontsize=19, color=ACCENT)
    save(fig, out, "chart_customers_required.png")


def _funnel(out: Path, name: str, title: str, stages: list[tuple[str, float, str]], foot: str) -> None:
    fig = canvas(title, "each step is generous. the total is not.")
    ax = fig.add_axes([0.10, 0.20, 0.80, 0.60])
    n = len(stages)
    for i, (label, width, color) in enumerate(stages):
        y = n - 1 - i
        h = 0.66
        w = width
        ax.add_patch(Rectangle((0.5 - w / 2, y - h / 2), w, h,
                               facecolor=color, edgecolor="none", alpha=0.92))
        ax.text(0.5, y, label, ha="center", va="center", fontsize=17,
                color="#ffffff", weight="bold")
        if i < n - 1:
            ax.annotate("", xy=(0.5, y - 0.78), xytext=(0.5, y - 0.36),
                        arrowprops=dict(arrowstyle="-|>", color=DIM, lw=2))
    ax.set_xlim(0, 1)
    ax.set_ylim(-0.6, n)
    ax.axis("off")
    fig.text(0.10, 0.085, foot, fontsize=19, color=ACCENT)
    save(fig, out, name)


def chart_funnel_4000(out: Path) -> None:
    _funnel(out, "chart_funnel_4000.png", "5% CONVERSION",
            [("100 hear it", 0.92, COOL), ("5 buy", 0.62, ACCENT), ("...4,000 needed", 0.34, WARN)],
            "four thousand people have to hear the pitch.")


def chart_funnel_400k(out: Path) -> None:
    _funnel(out, "chart_funnel_400k.png", "1% OPT-IN",
            [("4,000 asked", 0.92, COOL), ("40 say yes", 0.58, WARN), ("...400,000 people", 0.28, ACCENT)],
            "that is the population of a mid-sized city. every month.")


def chart_churn_treadmill(out: Path) -> None:
    fig = canvas("20 LEAVE. 20 REPLACE. REPEAT.", "10% churn, per month")
    ax = fig.add_axes([0.10, 0.18, 0.80, 0.58])
    months = list(range(1, 13))
    net = [200] * 12
    ax.plot(months, net, color=COOL, lw=4, marker="o", label="customers")
    ax.fill_between(months, net, 0, color=COOL, alpha=0.08)
    ax.scatter([1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12],
               [180, 200, 180, 200, 180, 200, 180, 200, 180, 200, 180, 200],
               color=ACCENT, s=70, zorder=5, label="20 left")
    ax.set_ylim(0, 260)
    ax.set_xticks(months)
    ax.set_xticklabels([f"M{m}" for m in months], fontsize=13)
    ax.grid(axis="y", color="#1e2128", lw=1)
    for s in ("top", "right"):
        ax.spines[s].set_visible(False)
    ax.spines["left"].set_color("#2a2e37")
    ax.spines["bottom"].set_color("#2a2e37")
    ax.legend(loc="upper right", frameon=False, fontsize=15, labelcolor=DIM)
    fig.text(0.10, 0.11, "you are not building a base. you are running a treadmill.",
             fontsize=19, color=ACCENT)
    save(fig, out, "chart_churn_treadmill.png")


def chart_infinite_growth(out: Path) -> None:
    fig = canvas("INFINITE GROWTH = IMPOSSIBLE", "the curve bends the wrong way")
    ax = fig.add_axes([0.10, 0.18, 0.80, 0.58])
    m = list(range(0, 25))
    linear = [40 + 22 * t for t in m]
    ax.plot(m, linear, color=COOL, lw=4, label="what they promise")
    hyper = [40 * math.exp(0.135 * t) for t in m]
    ax.plot(m, hyper, color=ACCENT, lw=4, label="what it actually requires")
    ax.fill_between(m, linear, hyper, where=[h > l for h, l in zip(hyper, linear)],
                    color=ACCENT, alpha=0.10)
    ax.set_yscale("log")
    ax.set_xticks([0, 6, 12, 18, 24])
    ax.set_xticklabels(["now", "+6mo", "+12mo", "+18mo", "+24mo"], fontsize=14)
    ax.grid(color="#1e2128", lw=1)
    for s in ("top", "right"):
        ax.spines[s].set_visible(False)
    ax.spines["left"].set_color("#2a2e37")
    ax.spines["bottom"].set_color("#2a2e37")
    ax.legend(loc="upper left", frameon=False, fontsize=15, labelcolor=DIM)
    fig.text(0.10, 0.11, "one line is growth. the other one is arithmetic.",
             fontsize=19, color=ACCENT)
    save(fig, out, "chart_infinite_growth.png")


def chart_revenue_vs_recruitment(out: Path) -> None:
    fig = canvas("RECRUITMENT IS NOT REVENUE", "the product is the bait")
    ax = fig.add_axes([0.08, 0.16, 0.84, 0.64])
    ax.axis("off")
    boxes = [
        (0.06, "A REAL BUSINESS", GOOD,
         ["revenue scales", "with people who stay", "", "the product is the point"]),
        (0.54, "THIS STRUCTURE", ACCENT,
         ["revenue needs", "new humans to survive", "", "the structure is the point"]),
    ]
    for x0, title, color, lines in boxes:
        ax.add_patch(Rectangle((x0, 0.20), 0.40, 0.66, facecolor="#111318",
                               edgecolor=color, lw=3))
        ax.text(x0 + 0.20, 0.80, title, ha="center", fontsize=19, color=color, weight="bold")
        for i, line in enumerate(lines):
            if not line:
                continue
            ax.text(x0 + 0.20, 0.63 - i * 0.13, line, ha="center", fontsize=15, color=FG)
    ax.annotate("", xy=(0.545, 0.53), xytext=(0.465, 0.53),
                arrowprops=dict(arrowstyle="<|-|>", color=DIM, lw=2))
    fig.text(0.08, 0.10, "if your income needs new humans, you are selling recruitment.",
             fontsize=19, color=ACCENT)
    save(fig, out, "chart_revenue_vs_recruitment.png")


def chart_extraction_structure(out: Path) -> None:
    fig = canvas("EXTRACTION PIPELINE", "by design, not by accident")
    ax = fig.add_axes([0.06, 0.16, 0.88, 0.64])
    ax.axis("off")
    stages = ["you", "your labour", "the recruit", "their labour", "the next recruit"]
    n = len(stages)
    bw, gap = 0.16, 0.04
    for i, s in enumerate(stages):
        x = 0.02 + i * (bw + gap)
        color = ACCENT if i in (0, n - 1) else WARN
        ax.add_patch(Rectangle((x, 0.42), bw, 0.30, facecolor="#111318",
                               edgecolor=color, lw=3))
        ax.text(x + bw / 2, 0.57, s, ha="center", va="center",
                fontsize=15, color=FG, weight="bold", wrap=True)
        if i < n - 1:
            ax.annotate("", xy=(x + bw + gap, 0.57), xytext=(x + bw, 0.57),
                        arrowprops=dict(arrowstyle="-|>", color=DIM, lw=2))
        if i < n - 1:
            ax.annotate("", xy=(x + bw / 2, 0.44), xytext=(x + bw / 2, 0.40),
                        arrowprops=dict(arrowstyle="-|>", color=ACCENT, lw=1.5))
            ax.text(x + bw / 2, 0.345, "value up", ha="center", fontsize=12, color=ACCENT)
    ax.annotate("", xy=(0.94, 0.20), xytext=(0.06, 0.20),
                arrowprops=dict(arrowstyle="-|>", color=DIM, lw=2))
    ax.text(0.5, 0.13, "value moves one way only — away from you",
            ha="center", fontsize=16, color=DIM)
    fig.text(0.06, 0.075, "the demand for infinite growth is the extraction, restated.",
             fontsize=19, color=ACCENT)
    save(fig, out, "chart_extraction_structure.png")


def chart_treadmill_vs_asset(out: Path) -> None:
    fig = canvas("TREADMILL vs ASSET", "the difference in one line")
    ax = fig.add_axes([0.10, 0.18, 0.80, 0.60])
    m = list(range(1, 13))
    treadmill = [100 * (0.9 ** t) for t in m]
    asset = [100 + 18 * t for t in m]
    ax.plot(m, asset, color=GOOD, lw=4, marker="o", label="an asset — builds without you")
    ax.plot(m, treadmill, color=ACCENT, lw=4, marker="s", label="a treadmill — needs you forever")
    ax.axhline(50, color=DIM, lw=1, ls="--")
    ax.text(12.1, 52, "half", fontsize=13, color=DIM, va="bottom")
    ax.set_xticks(m)
    ax.set_xticklabels([f"M{t}" for t in m], fontsize=12)
    ax.grid(color="#1e2128", lw=1)
    for s in ("top", "right"):
        ax.spines[s].set_visible(False)
    ax.spines["left"].set_color("#2a2e37")
    ax.spines["bottom"].set_color("#2a2e37")
    ax.legend(loc="upper right", frameon=False, fontsize=15, labelcolor=DIM)
    fig.text(0.10, 0.11, "build once. it does not need anybody underneath it.",
             fontsize=19, color=GOOD)
    save(fig, out, "chart_treadmill_vs_asset.png")


CHARTS = [
    chart_commission_baseline,
    chart_customers_required,
    chart_funnel_4000,
    chart_funnel_400k,
    chart_churn_treadmill,
    chart_infinite_growth,
    chart_revenue_vs_recruitment,
    chart_extraction_structure,
    chart_treadmill_vs_asset,
]


def calculator_ui(out: Path) -> None:
    fig = canvas("THE CALCULATOR", "type the plan in. it does the rest.")
    ax = fig.add_axes([0.16, 0.16, 0.68, 0.62])
    ax.axis("off")
    rows = [
        ("product price / month", "$50", FG),
        ("your commission", "20%", FG),
        ("customers you need", "200", FG),
        ("conversion rate", "5%", FG),
        ("people who must hear it", "4,000", WARN),
        ("opt-in rate", "1%", FG),
        ("PEOPLE REQUIRED", "400,000", ACCENT),
        ("monthly churn", "10%", FG),
        ("customers leaving / month", "20", WARN),
    ]
    for i, (label, val, col) in enumerate(rows):
        y = 0.94 - i * 0.105
        if i == 6:
            ax.add_patch(Rectangle((0.0, y - 0.045), 1.0, 0.095,
                                   facecolor=ACCENT, alpha=0.14, edgecolor=ACCENT, lw=2))
        ax.text(0.02, y, label, fontsize=19, color=col if i == 6 else DIM, va="center",
                weight="bold" if i == 6 else "normal")
        ax.text(0.98, y, val, fontsize=22, color=col, va="center", ha="right",
                weight="bold")
        if i < len(rows) - 1:
            ax.plot([0.0, 1.0], [y - 0.052, y - 0.052], color="#1e2128", lw=1)
    fig.text(0.16, 0.10, "free. open source. no account, no upsell.",
             fontsize=19, color=GOOD)
    save(fig, out, "calculator_ui_main.png")


def light_field_commons(out: Path) -> None:
    fig = canvas("THE LIGHT FIELD", "build once. nobody underneath it.")
    ax = fig.add_axes([0.10, 0.18, 0.80, 0.58])
    ax.axis("off")
    items = ["PUBLIC", "OPEN SOURCE", "FREE TO RUN", "YOURS TO COPY",
             "NO PERMISSION", "NO TREADMILL"]
    cols, rows_n = 3, 2
    bw, bh = 0.29, 0.34
    for i, label in enumerate(items):
        c, r = i % cols, i // cols
        x = 0.03 + c * 0.33
        y = 0.52 - r * 0.46
        ax.add_patch(Rectangle((x, y), bw, bh, facecolor="#111318",
                               edgecolor=GOOD, lw=3))
        ax.text(x + bw / 2, y + bh / 2, label, ha="center", va="center",
                fontsize=19, color=GOOD, weight="bold")
    fig.text(0.10, 0.10, "an asset, not a chain.", fontsize=20, color=FG)
    save(fig, out, "light_field_open_commons.png")


def light_field_title(out: Path) -> None:
    fig = plt.figure(figsize=(W / DPI, H / DPI), dpi=DPI)
    fig.text(0.5, 0.60, "THE RELUCTANT", fontsize=64, color=FG,
             weight="bold", ha="center", va="center")
    fig.text(0.5, 0.50, "CAPITALIST", fontsize=64, color=ACCENT,
             weight="bold", ha="center", va="center")
    fig.add_artist(plt.Line2D([0.32, 0.68], [0.43, 0.43], color=GOOD, lw=4))
    fig.text(0.5, 0.34, "FREE.  OPEN.  NO PERMISSION NEEDED.",
             fontsize=27, color=DIM, ha="center", va="center")
    fig.text(0.5, 0.24, "the calculator is here. bring your own plan.",
             fontsize=20, color=FG, ha="center", va="center")
    save(fig, out, "light_field_title_card.png")


CARDS = [calculator_ui, light_field_commons, light_field_title]


def main() -> None:
    ap = argparse.ArgumentParser()
    ap.add_argument("--out", default="assets")
    args = ap.parse_args()
    out = Path(args.out).resolve()
    out.mkdir(parents=True, exist_ok=True)
    print(f"rendering {len(CHARTS)} charts + {len(CARDS)} cards -> {out}")
    for fn in CHARTS:
        fn(out)
    for fn in CARDS:
        fn(out)
    print("done")


if __name__ == "__main__":
    main()


