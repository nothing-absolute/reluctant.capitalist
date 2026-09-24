---
title: "how to make my website: https://nothing-absolute.github.io/mlm-truth/ come up on search"
description: "SEO guide for improving website visibility in search results"
date: "2026-08-30"
tags: ["seo","website","search","optimization","visibility"]
source: "antigravity://7a77f340-98ff-444b-bfeb-bd7707cbcebc"
draft: false
vault: false
---

how to make my website: https://nothing-absolute.github.io/mlm-truth/ come up on search

## seo guide

## SEO Guide — Getting `mlm-truth` on Google

Your site **is currently not indexed by Google** (`site:nothing-absolute.github.io/mlm-truth/` returns 0 results). Here's exactly what to do, ordered by impact.

---

## 🔴 Critical: Tell Google Your Site Exists

Google doesn't know about your page yet. These two steps fix that:

### 1. Submit to Google Search Console (free, ~5 min)

This is the **single most important step**. Without it, Google may never crawl your site.

1. Go to [Google Search Console](https://search.google.com/search-console)
2. Click **"Add Property"** → choose **URL Prefix** → enter `https://nothing-absolute.github.io/mlm-truth/`
3. **Verify ownership** — the easiest method for GitHub Pages:
   - Choose **"HTML file"** verification
   - Download the verification file Google gives you (something like `google1234567890abcdef.html`)
   - Add it to your `mlm-truth` repo root and push
4. Once verified, go to **URL Inspection** → paste your URL → click **"Request Indexing"**

> [!IMPORTANT]
> This is the #1 thing to do. Everything else is secondary until Google knows your site exists.

### 2. Create a `sitemap.xml` (currently missing)

Add this file to your repo root:

```xml
<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
  <url>
    <loc>https://nothing-absolute.github.io/mlm-truth/</loc>
    <lastmod>2026-08-30</lastmod>
    <changefreq>monthly</changefreq>
    <priority>1.0</priority>
  </url>
</urlset>
```

Then submit it in Search Console: **Sitemaps** → enter `sitemap.xml` → Submit.

### 3. Create a `robots.txt` (currently missing)

Add this file to your repo root:

```
User-agent: *
Allow: /

Sitemap: https://nothing-absolute.github.io/mlm-truth/sitemap.xml
```

---

## 🟡 Important: Fix Your HTML Meta Tags

Your page has a good `<title>` (`The MLM Machine — Follow The Money`) but is **completely missing** meta description, Open Graph tags, and structured data. These directly affect how (and whether) your page appears in search results.

### Add these tags inside your `<head>`:

```html
<!-- SEO Meta -->
<meta name="description" content="An interactive investigation into MLM pyramid schemes. Follow the money with real data, income breakdowns, psychological tactics, and a personal cost calculator.">
<meta name="keywords" content="MLM, multi-level marketing, pyramid scheme, network marketing, MLM scam, MLM income disclosure, Amway, Herbalife, MLM truth">
<meta name="author" content="MLM Decoded">

<!-- Open Graph (Facebook, LinkedIn, iMessage previews) -->
<meta property="og:title" content="The MLM Machine — Follow The Money">
<meta property="og:description" content="An interactive investigation into MLM pyramid schemes. Real data. Real math. Real consequences.">
<meta property="og:type" content="website">
<meta property="og:url" content="https://nothing-absolute.github.io/mlm-truth/">
<meta property="og:image" content="https://nothing-absolute.github.io/mlm-truth/og-image.png">

<!-- Twitter Card -->
<meta name="twitter:card" content="summary_large_image">
<meta name="twitter:title" content="The MLM Machine — Follow The Money">
<meta name="twitter:description" content="Interactive data exposing how MLM pyramid schemes really work.">
<meta name="twitter:image" content="https://nothing-absolute.github.io/mlm-truth/og-image.png">

<!-- Canonical URL (prevents duplicate content issues) -->
<link rel="canonical" href="https://nothing-absolute.github.io/mlm-truth/">
```

> [!TIP]
> Create an `og-image.png` (1200×630px) — a screenshot or designed graphic of your hero section works great. This is what shows when people share your link on social media and messaging apps.

---

## 🟡 Important: Content Accessibility for Crawlers

Your site is **heavily JavaScript-driven** (Three.js canvases, dynamic sliders, quiz). Google can render JS, but the main textual content should be in the HTML itself — which it mostly is. However:

### Add Semantic HTML

Replace generic `<section>` tags with more meaningful structure where possible:

```html
<!-- Add a main landmark -->
<main>
  <!-- Your sections here -->
</main>

<!-- Add article wrapper for the main content -->
<article>
  ...
</article>
```

### Add `alt` text to any images you add later

Currently you have no `<img>` tags (everything is canvas), but if you add an OG image or any other images, always include descriptive `alt` text.

---

## 🟢 Nice to Have: Boost Discoverability

### Backlinks (most powerful ranking factor)

Your Reddit posts are already generating some backlinks. Keep sharing on:
- **r/antiMLM** — you've already posted there, and that community is perfect
- **r/personalfinance**, **r/dataisbeautiful** (for the interactive visualizations)
- Anti-MLM Facebook groups
- Link from any personal social profiles

### Page Speed

Your page loads Three.js and Google Fonts externally. Consider:
- Adding `rel="preload"` for the fonts
- Adding `loading="lazy"` to any below-fold content

```html
<link rel="preload" href="https://fonts.googleapis.com/css2?family=Bebas+Neue&family=Space+Mono:ital,wght@0,400;0,700;1,400&display=swap" as="style">
```

### Submit to Bing Too

Go to [Bing Webmaster Tools](https://www.bing.com/webmasters) and submit your URL there as well. Similar process to Google Search Console.

---

## ✅ Quick Checklist

| Task | Status | Impact |
|------|--------|--------|
| Submit to Google Search Console | ❌ Not done | 🔴 Critical |
| Request indexing in Search Console | ❌ Not done | 🔴 Critical |
| Add `sitemap.xml` | ❌ Missing | 🔴 Critical |
| Add `robots.txt` | ❌ Missing | 🔴 Critical |
| Add `<meta name="description">` | ❌ Missing | 🟡 High |
| Add Open Graph tags | ❌ Missing | 🟡 High |
| Add canonical URL | ❌ Missing | 🟡 Medium |
| Create OG image (1200×630) | ❌ Missing | 🟡 Medium |
| Share on anti-MLM communities | ✅ Reddit done | 🟢 Ongoing |
| Submit to Bing Webmaster Tools | ❌ Not done | 🟢 Nice to have |

---

> [!NOTE]
> After submitting to Search Console and requesting indexing, it typically takes **2–7 days** for Google to crawl and index the page. For a new GitHub Pages site, it can sometimes take up to 2–4 weeks to start appearing in search results for competitive terms.

## Assets
![og_image_1788114264426](/antigravity/how-to-make-my-website-https-nothing-absolute-github-io-mlm/og_image_1788114264426.jpg)
- [og_image_1788114264426.jpg](/antigravity/how-to-make-my-website-https-nothing-absolute-github-io-mlm/og_image_1788114264426.jpg) — JPG, 295 KB
- [seo_guide.md](/antigravity/how-to-make-my-website-https-nothing-absolute-github-io-mlm/seo_guide.md) — MD, 6 KB

<details>
<summary>Chat transcript — 10 messages, 2026-08-30 → 2026-08-30</summary>

**You** · 2026-08-30 18:17

how to make my website: https://nothing-absolute.github.io/mlm-truth/ come up on search

---

**Antigravity** · 2026-08-30 18:17

Let me take a look at your site to see what's there and identify what SEO improvements can be made.

---

**Antigravity** · 2026-08-30 18:17

Now let me check if there's a repository with more source files, and look for any existing SEO setup like sitemap, robots.txt, or meta tags:

---

**Antigravity** · 2026-08-30 18:17

Good — now I have a clear picture. Your site is **not indexed by Google at all** (the `site:` search returned zero results), and it's missing several critical SEO foundations. Let me put together a comprehensive guide for you.

---

**Antigravity** · 2026-08-30 18:18

Here's the situation: **Google has zero knowledge your site exists.** The `site:` search returned nothing — you're completely unindexed.

The full guide is in the artifact above, but here's the **TL;DR priority order**:

1. **Go to [Google Search Console](https://search.google.com/search-console)** → add your URL → verify ownership with an HTML file you drop in your repo → then hit **"Request Indexing."** This is the #1 thing.

2. **Add a `sitemap.xml` and `robots.txt`** to your repo — I have the exact contents in the guide. These tell crawlers what to index.

3. **Add a `<meta name="description">` tag** — your page has a good title but no description, which means Google has nothing to show as a search snippet even if it does find you.

4. **Add Open Graph tags** — so when people share your link on Reddit/Facebook/iMessage, it shows a nice preview card instead of a blank link.

Your Reddit posts on r/antiMLM are already generating backlinks, which is great. Once Google actually *knows* the page exists (step 1), you should start appearing in search within a week or two.

Want me to generate the actual `sitemap.xml`, `robots.txt`, and updated `<head>` section files ready to drop into your repo?

---

**You** · 2026-08-30 18:24

yes

---

**Antigravity** · 2026-08-30 18:24

Let me generate all the files, including an OG image for social sharing.

---

**Antigravity** · 2026-08-30 18:24

Good — now let me copy that OG image to the SEO files folder and create the updated `<head>` section:

---

**Antigravity** · 2026-08-30 18:25

Now let me create the updated `<head>` snippet:

---

**Antigravity** · 2026-08-30 18:25

All 4 files are ready. Here's what you need to do:

### Files to drop into your `mlm-truth` repo root:

| File | What it does |
|---|---|
| [sitemap.xml](file:///home/jd/.gemini/antigravity/scratch/mlm-truth-seo/sitemap.xml) | Tells Google what pages exist |
| [robots.txt](file:///home/jd/.gemini/antigravity/scratch/mlm-truth-seo/robots.txt) | Tells crawlers they're allowed in + points to sitemap |
| [og-image.jpg](file:///home/jd/.gemini/antigravity/scratch/mlm-truth-seo/og-image.jpg) | Social sharing preview image (the pyramid graphic above) |
| [updated-head.html](file:///home/jd/.gemini/antigravity/scratch/mlm-truth-seo/updated-head.html) | Copy the meta tags from this into your `index.html` `<head>` |

### Steps:
1. **Copy** `sitemap.xml`, `robots.txt`, and `og-image.jpg` into your repo root
2. **Edit** your `index.html` — replace everything between `<head>` and the `<style>` tag with the meta tags from `updated-head.html` (keep your existing CSS untouched)
3. **Push** to GitHub
4. **Go to [Google Search Console](https://search.google.com/search-console)** → add your site → verify → submit the sitemap → request indexing

All files are at `/home/jd/.gemini/antigravity/scratch/mlm-truth-seo/`. You should start showing up in Google search within about a week of submitting.

</details>

---

*Imported from Antigravity conversation `7a77f340-98ff-444b-bfeb-bd7707cbcebc` — 27 recorded steps, 11 tool actions, 1 context checkpoints (earlier turns were truncated by Antigravity). Source: `antigravity`.*
