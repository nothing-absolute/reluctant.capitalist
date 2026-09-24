---
title: "Tour Calendar Monitor"
description: "A calendar that automatically monitors favorite bands' **websites and email lists** for upcoming tour announcements. Most of these bands are independent, so their shows never…"
date: "2026-09-23"
status: "seed"
stage: "idea"
tags: []
source: "Projects/Music/Tour-Calendar-Monitor.md"
---
### Core Idea
A calendar that automatically monitors favorite bands' **websites and email lists** for upcoming tour announcements. Most of these bands are independent, so their shows never appear on the popular aggregator apps (Bandsintown, Songkick, Ticketmaster). The system watches the channels the bands actually control, extracts tour dates, and feeds them into a calendar.

### The Problem
- Independent artists announce tours on **their own site / mailing list / Bandcamp / Instagram** — not on the apps.
- You miss shows because you have to check ~dozens of band sites manually.
- Aggregators only cover bands big enough to pay into the ecosystem.

### Seed List
Initial bands to monitor = **YouTube Music + Spotify subscriptions** (whatever you follow/subscribe to in each). Source candidates already in `~/Documents`:
- `liked_tracks.hive` (Deezer-style export — e.g. Tame Impala) — parse for artist names
- `MarkWatchedYouTubeVideos_2026-06-01T08_13_37.943Z.json` — watched videos as a music-interest signal
- YouTube subscriptions export (via Google Takeout) — full subscribed-channel list
- Spotify followed artists (via `GET /v1/me/following?type=artist`)

### Approach

#### 1. Build the artist list
- Pull followed artists from Spotify API (free tier, OAuth) and YouTube subscriptions (Takeout export or API).
- Dedupe, keep artist name + any known website/bandcamp/social URL.
- Store in `bands.yaml` (name, website, rss, email list, bandcamp, instagram).

#### 2. Monitor channels per band
- **RSS/Atom**: many band sites and Bandcamp pages expose an RSS feed — cheap, no scraping.
- **Email lists**: the strongest signal (bands announce tours to fans first via email). Plan: a dedicated inbox the band's newsletter auto-forwards to, or a service that polls a catch-all.
- **Website crawl**: last resort — fetch site / a `/tour` or `/shows` page on a schedule (daily) and diff against the last snapshot to detect new dates.
- **Bandcamp**: artist pages + `bandcamp.com/artist/live` pages list shows.

#### 3. Parse tour dates → calendar events
- Extract date + city + venue from announcement text/page (regex → then LLM assist for messy pages).
- Push to a calendar (Google Calendar API is the obvious target; Obsidian Full Calendar/ICS also viable).

#### 4. Notify
- Alert on new event so you can grab tickets before they sell out (email / Obsidian daily note / push).

### Tech Sketch
- Python + Feedparser (RSS), Requests/httpx + BeautifulSoup (crawl/diff), Google Calendar API (or .ics generation).
- `cron`/systemd timer for daily runs.
- State kept as JSON snapshots per artist (last-seen tour dates) to avoid duplicate alerts.

### Next Actions
- [ ] Export full YouTube subscriptions list (Google Takeout) and Spotify followed artists → build `bands.yaml`
- [ ] Pick 5 bands with known websites; confirm which have RSS, email lists, and/or Bandcamp pages
- [ ] Write the RSS/poll script and a calendar push test for one real band
- [ ] Decide calendar target: Google Calendar vs. Obsidian Full Calendar vs. local `.ics`

### Someday/Maybe
- Auto-import into Obsidian as a per-artist tour log (`03-Resources/Artists/<band>.md`)
- Ticketing watch: alert the moment a show's tickets go on sale
- Multi-region: only care about shows near you (city radius filter)

### Related
- YouTube-Pedal-Demo-Channel — music-tech adjacency
#project/tour-calendar #music #monitoring #calendar
