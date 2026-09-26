# SEO Guide — Getting `mlm-truth` on Google

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
