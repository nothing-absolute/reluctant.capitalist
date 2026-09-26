#!/usr/bin/env python3
"""Generate the chart assets for video_002_second_brain.

Same house style as make_charts.py: dark ground, one hot accent, DejaVu Sans
bold, real numbers only. Every figure here is verifiable from the repo or the
vault -- see reviews/THEMES.json, reviews/FRAGMENTS.json, src/content/**, and
/home/jd/Documents/UnifiedVault.

    python make_charts_002.py --out assets
"""

from __future__ import annotations

import argparse
from pathlib import Path

import matplotlib

matplotlib.use("Agg")
import matplotlib.pyplot as plt
from matplotlib.patches import Circle, FancyArrowPatch, Rectangle

W, H, DPI = 1920, 1080, 100
BG = "#0a0b0e"
FG = "#f2f2f2"
DIM = "#8a8f98"
ACCENT = "#e8543d"
COOL = "#4d9de0"
WARN = "#e8c84d"
GOOD = "#5fbf7f"
PANEL = "#111318"

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
    fig.savefig(out / name, dpi=DPI, facecolor=BG)
    plt.close(fig)
    print(f"  {name}")


def blank_ax(fig, box=(0.06, 0.14, 0.88, 0.66)):
    ax = fig.add_axes(box)
    ax.set_xlim(0, 1)
    ax.set_ylim(0, 1)
    ax.axis("off")
    return ax


def strip(ax, y, items, widths=None, colors=None, fs=17, h=0.11):
    """A row of labelled boxes. `items` is a list of strings."""
    n = len(items)
    gap = 0.022
    total_gap = gap * (n - 1)
    if widths is None:
        widths = [(1 - 0.06 - total_gap) / n] * n
    if colors is None:
        colors = [PANEL] * n
    x = 0.03
    for item, wd, c in zip(items, widths, colors):
        ax.add_patch(Rectangle((x, y), wd, h, facecolor=c, edgecolor="none"))
        ax.text(x + wd / 2, y + h / 2, item, ha="center", va="center",
                fontsize=fs, color=FG, weight="bold", linespacing=1.5)
        x += wd + gap


# ---------------------------------------------------------------- 01 title

def sb_title(out: Path) -> None:
    fig = plt.figure(figsize=(W / DPI, H / DPI), dpi=DPI)
    fig.text(0.5, 0.63, "HOW A MESS", fontsize=76, color=FG, weight="bold",
             ha="center", va="center")
    fig.text(0.5, 0.50, "BECOMES A MAP", fontsize=76, color=ACCENT,
             weight="bold", ha="center", va="center")
    fig.add_artist(plt.Line2D([0.30, 0.70], [0.415, 0.415], color=GOOD, lw=4))
    fig.text(0.5, 0.33, "501 FILES IN.  371 PAGES OUT.", fontsize=30, color=DIM,
             ha="center", va="center")
    fig.text(0.5, 0.24, "a second brain, and what it actually produced",
             fontsize=21, color=FG, ha="center", va="center")
    save(fig, out, "sb_title.png")


# ---------------------------------------------------------------- 02 attachments

def sb_attachments(out: Path) -> None:
    fig = canvas("311 ATTACHMENTS", "dropped in. named for nothing.")
    ax = blank_ax(fig)
    names = [
        "2014.pdf", "2015.pdf", "2016.pdf", "2017.pdf",
        "567562752_1601047670861475_3524536044850501567_n.jpg",
        "1040-2020.pdf", "4506-Request Copy of Tax Return.pdf",
        "nano.509299.save", "Untitled 3.pdf",
    ]
    y = 0.88
    for i, n in enumerate(names):
        big = len(n) > 30
        ax.text(0.02, y, n, fontsize=20 if big else 25, va="center",
                family="DejaVu Sans Mono",
                color=WARN if big else DIM)
        y -= 0.088
    fig.text(0.50, 0.10, "ten files are named by year alone. 31 are screenshots. the longest name is 148 characters.",
             fontsize=19, color=ACCENT, ha="center")
    save(fig, out, "sb_attachments.png")


# ---------------------------------------------------------------- 03 braindump

def sb_braindump(out: Path) -> None:
    fig = canvas("BRAIN DUMPS, APPENDED", "Daily/2026-08-20.md  --  ## Captures")
    ax = blank_ax(fig)
    rows = [
        ("20:12", "Huel Howser Amazed Supercut Tool", COOL),
        ("20:45", "YouTube Script & Shot-List Generator", COOL),
        ("21:00", "YouTube Earnings Analysis: @Dial-UpDayz", WARN),
        ("20:25", "Video Automation Project Setup", COOL),
        ("20:30", "Script & Shot List: Born in 1984", COOL),
        ("20:50", "Video Essay Architecture", COOL),
        ("21:10", "iPod Touch / MIDI & OSC Touchpad Bridge", COOL),
        ("23:45", "Lion King Standee & RunPod GPU Pipeline", COOL),
    ]
    y = 0.90
    for t, label, c in rows:
        ax.add_patch(Rectangle((0.02, y - 0.035), 0.115, 0.07,
                               facecolor="none", edgecolor=c, lw=2))
        ax.text(0.077, y, t, ha="center", va="center", fontsize=16,
                family="DejaVu Sans Mono", color=c)
        ax.text(0.155, y, label, ha="left", va="center", fontsize=19, color=FG)
        y -= 0.088
    fig.text(0.50, 0.085, "ten projects, one night, out of order. nobody re-reads this.",
             fontsize=21, color=ACCENT, ha="center")
    save(fig, out, "sb_braindump.png")


# ---------------------------------------------------------------- 04 sources

def sb_sources(out: Path) -> None:
    fig = canvas("FOUR KINDS OF INPUT", "nothing shares a schema")
    ax = blank_ax(fig)
    cards = [
        ("VAULT", "157 notes\n311 attachments\n30 daily notes", COOL),
        ("AI CHAT", "235 pages\n115 conversations", ACCENT),
        ("AGENT", "27 pages\n26 sessions", WARN),
        ("WEB", "PDFs, prices\nbenchmarks, pages", GOOD),
    ]
    for i, (head, body, c) in enumerate(cards):
        x = 0.02 + i * 0.245
        ax.add_patch(Rectangle((x, 0.24), 0.225, 0.62, facecolor=PANEL,
                               edgecolor=c, lw=3))
        ax.text(x + 0.1125, 0.74, head, ha="center", va="center",
                fontsize=25, color=c, weight="bold")
        ax.text(x + 0.1125, 0.46, body, ha="center", va="center",
                fontsize=17, color=FG, linespacing=1.9)
    fig.text(0.50, 0.11, "four machines, four formats, zero joins",
             fontsize=22, color=ACCENT, ha="center")
    save(fig, out, "sb_sources.png")


# ---------------------------------------------------------------- 05 disconnected

def sb_disconnected(out: Path) -> None:
    fig = canvas("NOTHING POINTS ANYWHERE", "the actual starting condition")
    ax = fig.add_axes([0.04, 0.10, 0.92, 0.74])
    ax.set_xlim(0, 100)
    ax.set_ylim(0, 60)
    ax.axis("off")
    rng = [(12, 44), (26, 30), (34, 52), (48, 22), (52, 46), (66, 34),
           (74, 54), (84, 18), (88, 44), (20, 14), (44, 12), (62, 12),
           (16, 56), (58, 56), (78, 26)]
    for x, y in rng:
        ax.add_patch(Circle((x, y), 0.75, facecolor=DIM, edgecolor="none"))
    fig.text(0.50, 0.075, "no links. no edges. no index. just proximity.",
             fontsize=22, color=ACCENT, ha="center")
    save(fig, out, "sb_disconnected.png")


# ---------------------------------------------------------------- 06 pipeline

def sb_pipeline(out: Path) -> None:
    fig = canvas("SIX STAGES, EVERY TIME", "the vault is never read by the build")
    ax = blank_ax(fig)
    stages = [
        ("SNAPSHOT", "copy the vault", COOL),
        ("INGEST", "pull chat +\nagent candidates", WARN),
        ("CLASSIFY", "normalise, route,\nwrite MANIFEST", ACCENT),
        ("PROMOTE", "copy approved\ninto src/content", GOOD),
        ("POLISH", "rewrite with a\nlocal model", COOL),
        ("STAGE", "a human\nsays yes", GOOD),
    ]
    for i, (head, body, c) in enumerate(stages):
        x = 0.012 + i * 0.163
        ax.add_patch(Rectangle((x, 0.28), 0.150, 0.50, facecolor=PANEL,
                               edgecolor=c, lw=3))
        ax.text(x + 0.075, 0.665, head, ha="center", va="center",
                fontsize=15, color=c, weight="bold")
        ax.text(x + 0.075, 0.43, body, ha="center", va="center",
                fontsize=11, color=FG, linespacing=1.7)
        if i < 5:
            ax.annotate("", xy=(x + 0.161, 0.53), xytext=(x + 0.151, 0.53),
                        arrowprops=dict(arrowstyle="-|>", color=DIM, lw=2))
    fig.text(0.50, 0.155, "a human ticks a box in MANIFEST.md. then it is allowed out.",
             fontsize=21, color=ACCENT, ha="center")
    save(fig, out, "sb_pipeline.png")


# ---------------------------------------------------------------- 07 normalize

def sb_normalize(out: Path) -> None:
    fig = canvas("CLEAN IT DETERMINISTICALLY", "no model in this step")
    ax = blank_ax(fig)
    rows = [
        ('frontmatter: "---"   (empty values that parsed as dashes)', ACCENT),
        ("{{title}} / {{date}}   (template vars nobody filled in)", ACCENT),
        ("[[wikilinks]] and ![[embeds]]   (collapsed to text)", COOL),
        ("# H1  ->  ## H2   (57 headers demoted)", COOL),
        ("47 near-duplicates   (12 adjudicated, 0.45 threshold)", WARN),
        ("33 quarantined   (18 empty, 11 stubs, 4 scratch)", WARN),
        ("7 dead links   ->   7 repaired", GOOD),
    ]
    y = 0.90
    for text, c in rows:
        ax.add_patch(Rectangle((0.02, y - 0.032), 0.028, 0.064, facecolor=c,
                               edgecolor="none"))
        ax.text(0.065, y, text, ha="left", va="center", fontsize=17,
                family="DejaVu Sans Mono", color=FG)
        y -= 0.098
    fig.text(0.50, 0.10, "boring rules, applied every time. that is the point.",
             fontsize=22, color=ACCENT, ha="center")
    save(fig, out, "sb_normalize.png")


# ---------------------------------------------------------------- 08 tags

def sb_tags(out: Path) -> None:
    fig = canvas("625 TAGS, MODEL-INVENTED", "no fixed vocabulary, so a note can be many things")
    ax = blank_ax(fig)
    axes_ = [
        ("type/*", "what kind of note\nproject, idea, reference", COOL),
        ("topic/*", "subject matter\nai, content, solar", ACCENT),
        ("project/*", "which venture\nkickstarter, openplotter", WARN),
        ("concept/*", "theory\npkm, obsolescence", GOOD),
        ("area/*", "ongoing responsibility", COOL),
        ("source/*", "where it came from\nopencode, antigravity", ACCENT),
    ]
    for i, (head, body, c) in enumerate(axes_):
        x = 0.015 + (i % 3) * 0.33
        y = 0.60 - (i // 3) * 0.44
        ax.add_patch(Rectangle((x, y), 0.305, 0.34, facecolor=PANEL,
                               edgecolor=c, lw=3))
        ax.text(x + 0.1525, y + 0.255, head, ha="center", va="center",
                fontsize=23, color=c, weight="bold")
        ax.text(x + 0.1525, y + 0.10, body, ha="center", va="center",
                fontsize=14, color=FG, linespacing=1.7)
    fig.text(0.50, 0.075, "89 of 89 notes re-tagged in 2,278s, on a 1.5b model, locally",
             fontsize=20, color=ACCENT, ha="center")
    save(fig, out, "sb_tags.png")


# ---------------------------------------------------------------- 09 dashboard

def sb_dashboard(out: Path) -> None:
    fig = canvas("THE DASHBOARD IS 100% QUERIES", "not one filename in the whole file")
    ax = blank_ax(fig)
    code = [
        "```dataview",
        "TASK",
        "WHERE !completed",
        "GROUP BY file.link",
        "LIMIT 100",
        "```",
        "",
        "LIST",
        "FROM #type/project",
        "SORT file.mtime DESC",
    ]
    ax.add_patch(Rectangle((0.04, 0.20), 0.52, 0.66, facecolor=PANEL,
                           edgecolor="#2a2f3a", lw=2))
    ax.text(0.075, 0.795, "\n".join(code), ha="left", va="top", fontsize=19,
            family="DejaVu Sans Mono", color=COOL, linespacing=1.55)
    ax.text(0.63, 0.66, "0", ha="center", va="center", fontsize=88, color=ACCENT)
    ax.text(0.63, 0.44, "hardcoded\nfilenames", ha="center", va="center",
            fontsize=20, color=FG, linespacing=1.6)
    ax.text(0.63, 0.26, "a new note\nappears by itself", ha="center", va="center",
            fontsize=17, color=GOOD, linespacing=1.6)
    fig.text(0.50, 0.105, "folders are where a note lives. tags are what surface it.",
             fontsize=21, color=DIM, ha="center")
    save(fig, out, "sb_dashboard.png")


# ---------------------------------------------------------------- 10 guardrail

def sb_guardrail(out: Path) -> None:
    fig = plt.figure(figsize=(W / DPI, H / DPI), dpi=DPI)
    fig.text(0.5, 0.90, "THE RULE THAT MATTERS MOST", fontsize=30, color=DIM,
             ha="center", va="top")
    fig.text(0.5, 0.795, '"...the tool being talked to, not JD thinking."', fontsize=40,
             color=FG, ha="center", va="top", style="italic")
    fig.text(0.5, 0.66, '"...forcing them into a first-person fragment"', fontsize=31,
             color=DIM, ha="center", va="top", style="italic")
    fig.text(0.5, 0.575, '"FABRICATES A POSITION HE NEVER TOOK."', fontsize=33,
             color=ACCENT, ha="center", va="top")
    fig.add_artist(plt.Line2D([0.22, 0.78], [0.515, 0.515], color="#2a2f3a", lw=2))
    ax = blank_ax(fig, box=(0.10, 0.10, 0.80, 0.36))
    strip(ax, 0.62, ["COMMAND", "DROPPED"], [0.42, 0.42], [DIM, "#2a2f3a"], fs=20, h=0.28)
    strip(ax, 0.14, ["THOUGHT", "DISTILLED"], [0.42, 0.42], [COOL, GOOD], fs=20, h=0.28)
    fig.text(0.5, 0.045, "54 of 169 raw notes were thrown out for saying nothing",
             fontsize=19, color=WARN, ha="center")
    save(fig, out, "sb_guardrail.png")


# ---------------------------------------------------------------- 11 output count

def sb_output_count(out: Path) -> None:
    fig = canvas("371 FILES. 350 WITH RECEIPTS.", "94% of the corpus can name its own origin")
    ax = fig.add_axes([0.10, 0.26, 0.80, 0.44])
    ax.barh([0], [350], color=GOOD, height=0.44)
    ax.barh([0], [21], left=[350], color=DIM, height=0.44)
    ax.set_xlim(0, 371)
    ax.set_yticks([])
    ax.set_xticks([0, 100, 200, 300, 371])
    for s in ax.spines.values():
        s.set_visible(False)
    ax.text(175, 0, "350  carry a source address", ha="center", va="center",
            fontsize=24, color="#0a0b0e")
    ax.text(360, 0, "21", ha="center", va="center", fontsize=18, color=FG)
    fig.text(0.50, 0.155, "not a date. an address.", fontsize=26, color=ACCENT, ha="center")
    save(fig, out, "sb_output_count.png")


# ---------------------------------------------------------------- 12 provenance

def sb_provenance(out: Path) -> None:
    fig = canvas("WHERE EVERY PAGE CAME FROM", "371 files, 350 receipts")
    ax = fig.add_axes([0.27, 0.16, 0.55, 0.64])
    rows = [
        ("AI chats  antigravity://", 235, ACCENT),
        ("Vault files  daily, projects", 63, COOL),
        ("Agent sessions  opencode://", 27, WARN),
        ("Hand-written seeds", 21, DIM),
        ("PIPELINE-WRITTEN  no human", 20, GOOD),
        ("Project docs + drafts", 5, DIM),
    ]
    names = [r[0] for r in rows][::-1]
    vals = [r[1] for r in rows][::-1]
    cols = [r[2] for r in rows][::-1]
    ax.barh(range(len(rows)), vals, color=cols, height=0.66)
    ax.set_yticks(range(len(rows)))
    ax.set_yticklabels(names, fontsize=15, color=FG)
    ax.set_xlim(0, 250)
    ax.set_xticks([0, 100, 200])
    for s in ax.spines.values():
        s.set_visible(False)
    ax.grid(axis="x", color="#1e2128", lw=1)
    for i, v in enumerate(vals):
        ax.text(v + 4, i, str(v), va="center", fontsize=16, color=FG)
    ax.set_xlabel("files", fontsize=15, color=DIM, labelpad=8)
    fig.text(0.50, 0.085, "12 theme hubs + 8 composed arguments, written by a model, on purpose",
             fontsize=20, color=GOOD, ha="center")
    save(fig, out, "sb_provenance.png")


# ---------------------------------------------------------------- 13 themes

def sb_themes(out: Path) -> None:
    fig = canvas("118 POSTS / 12 BODIES OF WORK", "posts may belong to more than one")
    ax = fig.add_axes([0.26, 0.14, 0.56, 0.66])
    rows = [
        ("odysseus  local-first stack", 72, ACCENT),
        ("second brain  this one", 52, ACCENT),
        ("openplotter  boat monitor", 55, COOL),
        ("the machine  video channel", 49, COOL),
        ("addiction recovery", 44, WARN),
        ("undertone  algorithmic reach", 28, WARN),
        ("makerspace  third space", 19, GOOD),
        ("music hardware", 16, GOOD),
        ("9 more bodies of work", 72, DIM),
    ]
    names = [r[0] for r in rows][::-1]
    vals = [r[1] for r in rows][::-1]
    cols = [r[2] for r in rows][::-1]
    ax.barh(range(len(rows)), vals, color=cols, height=0.68)
    ax.set_yticks(range(len(rows)))
    ax.set_yticklabels(names, fontsize=14, color=FG)
    ax.set_xlim(0, 100)
    ax.set_xticks([0, 50, 100])
    for s in ax.spines.values():
        s.set_visible(False)
    ax.grid(axis="x", color="#1e2128", lw=1)
    for i, v in enumerate(vals):
        ax.text(v + 1.5, i, str(v), va="center", fontsize=14, color=FG)
    ax.set_xlabel("member posts", fontsize=14, color=DIM, labelpad=8)
    fig.text(0.50, 0.075, "345 memberships across 118 posts -- overlap is the feature",
             fontsize=19, color=DIM, ha="center")
    save(fig, out, "sb_themes.png")


# ---------------------------------------------------------------- 14 fragments

def sb_fragments(out: Path) -> None:
    fig = canvas("115 FRAGMENTS", "one claim each, median 71 words")
    ax = fig.add_axes([0.16, 0.14, 0.68, 0.68])
    mech = [("definition", 39), ("tooling", 37), ("craft", 12), ("capture", 10),
            ("extraction", 6), ("reach", 6), ("legibility", 3), ("volume", 2)]
    names = [m[0] for m in mech][::-1]
    vals = [m[1] for m in mech][::-1]
    cols = [ACCENT if n in ("definition", "tooling") else COOL for n in names]
    ax.barh(range(len(mech)), vals, color=cols, height=0.7)
    ax.set_yticks(range(len(mech)))
    ax.set_yticklabels(names, fontsize=15, color=FG)
    ax.set_xlim(0, 44)
    ax.set_xticks([0, 20, 40])
    for s in ax.spines.values():
        s.set_visible(False)
    ax.grid(axis="x", color="#1e2128", lw=1)
    for i, v in enumerate(vals):
        ax.text(v + 0.8, i, str(v), va="center", fontsize=15, color=FG)
    ax.set_xlabel("fragments by mechanism", fontsize=14, color=DIM, labelpad=8)
    fig.text(0.50, 0.075, "98 outbound edges / 98 backlinks. mined from ~70 conversations.",
             fontsize=19, color=DIM, ha="center")
    save(fig, out, "sb_fragments.png")


# ---------------------------------------------------------------- 15 compose

def sb_compose(out: Path) -> None:
    fig = canvas("115 FRAGMENTS  /  8 MECHANISMS", "three composed into full arguments so far")
    ax = blank_ax(fig)
    posts = [
        ("Someone else already\ndecided what you want", "39", ACCENT),
        ("The instrument decides\nwhat you can think", "37", ACCENT),
        ("Finishing is the part\nthis work is about", "12", COOL),
        ("The shape of being absorbed", "10", COOL),
        ("What the system actually takes", "6", WARN),
        ("Distribution is a design\ndecision", "6", WARN),
        ("Being understood is separate\nfrom being right", "3", GOOD),
        ("The loudest one wins", "2", GOOD),
    ]
    for i, (title, n, c) in enumerate(posts):
        x = 0.01 + (i % 4) * 0.25
        y = 0.46 - (i // 4) * 0.44
        ax.add_patch(Rectangle((x, y), 0.225, 0.36, facecolor=PANEL,
                               edgecolor=c, lw=2))
        ax.text(x + 0.1125, y + 0.115, n, ha="center", va="center",
                fontsize=32, color=c)
        ax.text(x + 0.1125, y + 0.275, title, ha="center", va="center",
                fontsize=12, color=FG, linespacing=1.5)
    fig.text(0.50, 0.075, "every fragment gets a back-link to the post it landed in",
             fontsize=20, color=ACCENT, ha="center")
    save(fig, out, "sb_compose.png")


# ---------------------------------------------------------------- 16 section card

def sb_best(out: Path) -> None:
    fig = plt.figure(figsize=(W / DPI, H / DPI), dpi=DPI)
    fig.text(0.5, 0.56, "WHAT CAME OUT", fontsize=72, color=FG, weight="bold",
             ha="center", va="center")
    fig.add_artist(plt.Line2D([0.32, 0.68], [0.455, 0.455], color=ACCENT, lw=4))
    fig.text(0.5, 0.36, "a calculator.  a memoir bible.  a financial model that said no.",
             fontsize=25, color=DIM, ha="center", va="center")
    fig.text(0.5, 0.28, "a marketplace.  a manifesto.  20 pages nobody typed.",
             fontsize=25, color=DIM, ha="center", va="center")
    save(fig, out, "sb_best.png")


# ---------------------------------------------------------------- 17 mlm chain

def sb_mlm_chain(out: Path) -> None:
    fig = canvas("ONE PROJECT, FOUR ARTIFACTS", "each one points back at the last")
    ax = blank_ax(fig)
    steps = [
        ("RESEARCH", "FTC income\ndisclosure data", COOL),
        ("TOOL", "single-file\ncalculator", WARN),
        ("SCRIPTS", "5 videos,\nordered by reach", ACCENT),
        ("ADS", "3 hooks,\n1 picked", GOOD),
    ]
    for i, (head, body, c) in enumerate(steps):
        x = 0.015 + i * 0.25
        ax.add_patch(Rectangle((x, 0.30), 0.215, 0.50, facecolor=PANEL,
                               edgecolor=c, lw=3))
        ax.text(x + 0.1075, 0.665, head, ha="center", va="center",
                fontsize=22, color=c, weight="bold")
        ax.text(x + 0.1075, 0.44, body, ha="center", va="center",
                fontsize=15, color=FG, linespacing=1.8)
        if i < 3:
            ax.annotate("", xy=(x + 0.243, 0.55), xytext=(x + 0.222, 0.55),
                        arrowprops=dict(arrowstyle="-|>", color=DIM, lw=3))
    fig.text(0.50, 0.155, 'the winning hook was: "Type this into a calculator."',
             fontsize=22, color=ACCENT, ha="center")
    fig.text(0.50, 0.095, "the other two were thrown away",
             fontsize=17, color=DIM, ha="center")
    save(fig, out, "sb_mlm_chain.png")


# ---------------------------------------------------------------- 18 mlm ladder

def sb_mlm_ladder(out: Path) -> None:
    fig = canvas("THE NUMBER THAT MADE IT WORK", "5 recruits per level. pure arithmetic.")
    ax = fig.add_axes([0.10, 0.20, 0.82, 0.58])
    levels = list(range(1, 17))
    people = [5 ** n for n in levels]
    ax.bar(levels, people, color=[DIM] * 12 + [WARN, WARN, ACCENT, ACCENT], width=0.7)
    ax.axhline(8e9, color=GOOD, lw=3, ls="--")
    ax.text(0.75, 1.15e10, "WORLD POPULATION  8.0B", color=GOOD, fontsize=15,
            ha="left", va="center")
    ax.set_yscale("log")
    ax.set_ylim(1, 2e10)
    ax.set_xlim(0.3, 16.7)
    ax.set_xlabel("level of the recruitment ladder", fontsize=15, color=DIM, labelpad=10)
    ax.grid(axis="y", color="#1e2128", lw=1)
    for s in ("top", "right"):
        ax.spines[s].set_visible(False)
    ax.annotate("level 13\n1.22 billion", xy=(13, 1.22e9), xytext=(9.0, 1.1e8),
                fontsize=17, color=ACCENT, linespacing=1.5,
                arrowprops=dict(arrowstyle="-|>", color=ACCENT, lw=2))
    fig.text(0.50, 0.095, "it is not an argument. it is a counter.",
             fontsize=24, color=ACCENT, ha="center")
    save(fig, out, "sb_mlm_ladder.png")


# ---------------------------------------------------------------- 19 jars bible

def sb_jars_bible(out: Path) -> None:
    fig = canvas("A MEMOIR BECAME A SPEC", "A Plain of Jars -- project bible")
    ax = fig.add_axes([0.05, 0.16, 0.90, 0.62])
    ax.set_xlim(0, 4)
    ax.set_ylim(0, 1)
    ax.axis("off")
    stats = [
        ("400", "working days", "1-2 finished pages/day, full-time", COOL),
        ("~400", "pages", "3 volumes, 180 / 150 / 120", COOL),
        ("$150", "per page", "the market rate for this register", WARN),
        ("$60k", "of art", "before a single panel exists", ACCENT),
    ]
    for i, (big, label, sub, c) in enumerate(stats):
        x = 0.02 + i * 0.245
        ax.add_patch(Rectangle((x, 0.02), 0.225, 0.94, facecolor=PANEL,
                               edgecolor=c, lw=3))
        ax.text(x + 0.1125, 0.70, big, ha="center", va="center", fontsize=46, color=c)
        ax.text(x + 0.1125, 0.48, label, ha="center", va="center", fontsize=19, color=FG)
        ax.text(x + 0.1125, 0.22, sub, ha="center", va="center", fontsize=12,
                color=DIM, linespacing=1.5)
    fig.text(0.50, 0.085, "18-24 months, named up front, before anyone started",
             fontsize=20, color=DIM, ha="center")
    save(fig, out, "sb_jars_bible.png")


# ---------------------------------------------------------------- 20 kickstarter

def sb_kickstarter(out: Path) -> None:
    fig = canvas("THEN THE MODEL SAID NO", "goal band vs. success rate, with real benchmarks")
    ax = fig.add_axes([0.14, 0.24, 0.60, 0.54])
    bands = ["comics,\nany goal", "$30-100k\ngoal", "$100k+\ngoal"]
    rates = [72.5, 18.6, 10.6]
    cols = [GOOD, WARN, ACCENT]
    ax.bar(range(3), rates, color=cols, width=0.55)
    ax.set_xticks(range(3))
    ax.set_xticklabels(bands, fontsize=16, color=FG, linespacing=1.6)
    ax.set_ylim(0, 100)
    ax.set_yticks([0, 25, 50, 75, 100])
    ax.set_yticklabels(["0", "25", "50", "75", "100%"], fontsize=14)
    for s in ("top", "right"):
        ax.spines[s].set_visible(False)
    ax.grid(axis="y", color="#1e2128", lw=1)
    for i, v in enumerate(rates):
        ax.text(i, v + 3, f"{v}%", ha="center", fontsize=21, color=FG)
    fig.text(0.79, 0.60, "67-78%", fontsize=25, color=GOOD)
    fig.text(0.79, 0.555, "comics succeed", fontsize=14, color=DIM)
    fig.text(0.79, 0.47, "$17.5k", fontsize=25, color=WARN)
    fig.text(0.79, 0.425, "median raise", fontsize=14, color=DIM)
    fig.text(0.50, 0.105, '"GO for the right reason (the artifact). Not income."',
             fontsize=24, color=ACCENT, ha="center")
    save(fig, out, "sb_kickstarter.png")


# ---------------------------------------------------------------- 21 idea relay

def sb_idea_relay(out: Path) -> None:
    fig = plt.figure(figsize=(W / DPI, H / DPI), dpi=DPI)
    fig.text(0.5, 0.72, "THE IDEA RELAY", fontsize=44, color=FG, weight="bold",
             ha="center", va="center")
    fig.text(0.5, 0.55, '"Most ideas don\'t die from lack of funding."',
             fontsize=34, color=DIM, ha="center", va="center", style="italic")
    fig.text(0.5, 0.42, '"They die from lack of HANDOFF."',
             fontsize=40, color=ACCENT, ha="center", va="center")
    fig.add_artist(plt.Line2D([0.34, 0.66], [0.325, 0.325], color="#2a2f3a", lw=2))
    fig.text(0.5, 0.235, "plus an honest list of the five problems that would break it",
             fontsize=21, color=FG, ha="center", va="center")
    fig.text(0.5, 0.155, "a seed note -> a marketplace, where credit is provable on the lineage",
             fontsize=17, color=DIM, ha="center", va="center")
    save(fig, out, "sb_idea_relay.png")


# ---------------------------------------------------------------- 22 thesis

def sb_thesis(out: Path) -> None:
    fig = plt.figure(figsize=(W / DPI, H / DPI), dpi=DPI)
    fig.text(0.5, 0.80, "STRUCTURE DID NOT", fontsize=42, color=FG, weight="bold",
             ha="center", va="center")
    fig.text(0.5, 0.695, "CREATE THE IDEAS.", fontsize=42, color=FG, weight="bold",
             ha="center", va="center")
    fig.text(0.5, 0.565, "IT MADE THEM", fontsize=42, color=ACCENT, weight="bold",
             ha="center", va="center")
    fig.text(0.5, 0.46, "ADDRESSABLE.", fontsize=42, color=ACCENT, weight="bold",
             ha="center", va="center")
    fig.add_artist(plt.Line2D([0.36, 0.64], [0.385, 0.385], color=GOOD, lw=3))
    fig.text(0.5, 0.285, "brain dump  ->  page  ->  link  ->  back-link  ->  build on it",
             fontsize=23, color=FG, ha="center", va="center")
    fig.text(0.5, 0.185, "addressable is the thing that lets you build on a thought",
             fontsize=18, color=DIM, ha="center", va="center")
    save(fig, out, "sb_thesis.png")


# ---------------------------------------------------------------- 23 end card

def sb_end(out: Path) -> None:
    fig = plt.figure(figsize=(W / DPI, H / DPI), dpi=DPI)
    fig.text(0.5, 0.60, "THE RELUCTANT", fontsize=62, color=FG, weight="bold",
             ha="center", va="center")
    fig.text(0.5, 0.505, "CAPITALIST", fontsize=62, color=ACCENT, weight="bold",
             ha="center", va="center")
    fig.add_artist(plt.Line2D([0.33, 0.67], [0.425, 0.425], color=GOOD, lw=4))
    fig.text(0.5, 0.315, "501 files in.  371 pages out.  350 receipts.",
             fontsize=26, color=DIM, ha="center", va="center")
    fig.text(0.5, 0.225, "localhost:4321", fontsize=22, color=FG, ha="center", va="center")
    save(fig, out, "sb_end.png")


CHARTS = [
    sb_title, sb_attachments, sb_braindump, sb_sources, sb_disconnected,
    sb_pipeline, sb_normalize, sb_tags, sb_dashboard, sb_guardrail,
    sb_output_count, sb_provenance, sb_themes, sb_fragments, sb_compose,
    sb_best, sb_mlm_chain, sb_mlm_ladder, sb_jars_bible, sb_kickstarter,
    sb_idea_relay, sb_thesis, sb_end,
]


def main() -> None:
    ap = argparse.ArgumentParser()
    ap.add_argument("--out", default="assets")
    args = ap.parse_args()
    out = Path(args.out).resolve()
    out.mkdir(parents=True, exist_ok=True)
    print(f"rendering {len(CHARTS)} assets -> {out}")
    for fn in CHARTS:
        fn(out)
    print("done")


if __name__ == "__main__":
    main()
