---
title: "Tour Calendar Monitor: Automating Music Tour Tracking"
description: "A project to automatically track tour dates of independent bands through their websites, email lists, and social media."
date: "2026-09-23"
status: "concept"
stage: "idea"
tags: ["calendar","monitoring","music","project","kickstarter","music"]
source: "Projects/Music/Tour-Calendar-Monitor.md"
---
A calendar that automatically monitors favorite bands' websites and email lists for upcoming tour announcements. Most of these bands are independent, so their shows never appear on the popular aggregator apps (Bandsintown, Songkick, Ticketmaster). The system watches the channels the bands actually control, extracts tour dates, and feeds them into a calendar.

The problem is that independent artists announce tours on their own site, mailing list, Bandcamp, or Instagram — not on the apps. You miss shows because you have to check ~dozens of band sites manually. Aggregators only cover bands big enough to pay into the ecosystem.

Initial bands to monitor include YouTube Music + Spotify subscriptions (whatever you follow/subscribe to in each). Source candidates already in ~/Documents:
- liked_tracks.hive (Deezer-style export — e.g. Tame Impala) — parse for artist names
- MarkWatchedYouTubeVideos_2026-06-01T08_13_37.943Z.json — watched videos as a music-interest signal
- YouTube subscriptions export (via Google Takeout) — full subscribed-channel list
- Spotify followed artists (via GET /v1/me/following?type=artist)

The approach involves:

1. Build the artist list
   - Pull followed artists from Spotify API (free tier, OAuth) and YouTube subscriptions (Takeout export or API).
   - Dedupe, keep artist name + any known website/bandcamp/social URL.
   - Store in bands.yaml (name, website, rss, email list, bandcamp, instagram).

2. Monitor channels per band
   - RSS/Atom: many band sites and Bandcamp pages expose an RSS feed — cheap, no scraping.
   - Email lists: the strongest signal (bands announce tours to fans first via email). Plan: a dedicated inbox the band's newsletter auto-forwards to, or a service that polls a catch-all.
   - Website crawl: last resort — fetch site / a /tour or /shows page on a schedule (daily) and diff against the last snapshot to detect new dates.
   - Bandcamp: artist pages + bandcamp.com/artist/live pages list shows.

3. Parse tour dates → calendar events
   - Extract date + city + venue from announcement text/page (regex → then LLM assist for messy pages).
   - Push to a calendar (Google Calendar API is the obvious target; Obsidian Full Calendar/ICS also viable).

4. Notify
   - Alert on new event so you can grab tickets before they sell out (email / Obsidian daily note / push).

Tech sketch includes Python + Feedparser (RSS), Requests/httpx + BeautifulSoup (crawl/diff), Google Calendar API (or .ics generation). Cron/systemd timer for daily runs. State kept as JSON snapshots per artist (last-seen tour dates) to avoid duplicate alerts.

Next actions include:
- Export full YouTube subscriptions list (Google Takeout) and Spotify followed artists → build bands.yaml
- Pick 5 bands with known websites; confirm which have RSS, email lists, and/or Bandcamp pages
- Write the RSS/poll script and a calendar push test for one real band
- Decide calendar target: Google Calendar vs. Obsidian Full Calendar vs. local .ics
