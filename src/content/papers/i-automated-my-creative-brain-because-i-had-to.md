---
title: "I Automated My Creative Brain (Because I Had To)"
description: "A paper on building a hybrid system for creative writing and content production."
date: "2026-09-24"
tags: ["creative-tools","ai-ethics","content-production"]
source: "blog-draft://meta_content_001_building_the_machine.md"
draft: false
type: "essay"
---

## I Automated My Creative Brain (Because I Had To)

When I started *A Plain of Jars* and the *MLM Truth* project, I realized something very quickly: I have too much raw data, too many fragmented memories, and too little time to manually format all of it for different audiences. 

I needed a system that didn't just store my writing, but actively helped me route it. I needed a pipeline that allowed me to focus purely on the research and the writing, while automation handled the packaging.

But there was a catch. I wasn't willing to build a "Faceless AI" spam channel. The human element—my voice, my father's history, the specific ethical boundary of treating victims with empathy—had to remain intact. 

So, I built a hybrid. A local, open-source pipeline that automates the heavy lifting, but forces a hard stop for human review.

Here is exactly how the architecture works.

### 1. The Central Brain (The Data Layer)
I don't write "for YouTube" or "for Substack." I just write. I have a local folder structure (my "Central Brain") where I dump everything:
*   The raw prose for *A Plain of Jars*.
*   JSON datasets and FTC rulings for *MLM Truth*.
*   Rambling 2 AM essays on economic theory.

I wrote a lightweight Python `watchdog` script that runs in the background. The moment a new `.md` file hits any of those folders, the script grabs it and throws it into a routing queue.

### 2. The Local RAG Engine (The Context Layer)
This is where the magic happens, and it happens 100% locally on my machine for free. 
I set up **ChromaDB** as a local vector database. It ingested my entire history of writing. When a new file hits the queue, my local LLM (running via **Ollama**) reads it, compares it against the ChromaDB history, and synthesizes it. 

The LLM doesn't just read it; it transforms it. It looks at a rambling essay about my dad's NLP tapes and outputs three things:
1. An outline for a 15-minute video essay.
2. A draft for a Substack post.
3. A 60-second hook for TikTok.

### 3. The Human Review Gate (The Ethical Layer)
The local LLM does not have permission to publish. It pushes those three drafts into a custom UI dashboard (Odysseus). When I open my computer, I see an inbox of synthesized ideas. 

I review them. I fix the tone. I inject the specific dark humor or grief that an LLM can't emulate. And then, if I approve it, I click a button.

### 4. Runpod.io (The Muscle)
Once approved, the script packages the text and fires it via API to **Runpod.io**, a serverless cloud GPU provider. That's where the heavy, expensive compute happens—generating data visualizations, complex text-to-speech, or video rendering. By keeping this gated, I never pay for cloud GPU time on an idea that sucks.

### The Result
The system isn't locked into one brand. It tests ideas across multiple formats simultaneously. It is highly reactive, deeply personal, and entirely under my control.

If you are interested in building this yourself, I am open-sourcing the Python scripts. Paid subscribers to this Substack get access to the raw GitHub repository where I'm pushing updates to the `watchdog`, the ChromaDB ingester, and the Runpod API hooks.

We are building the exit. You might as well see the blueprints.

## Related

- [all my opencode projects are no longer connected. all the tabs from the sessions…](/papers/all-my-opencode-projects-are-no-longer-connected-all/)
- [The Honest Campaign: Notes on Pricing Physical Things](/papers/honest-campaign-notes/)
- [The Rent-Seeking Trap (And How to Walk Away)](/papers/the-rent-seeking-trap-and-how-to-walk-away/)
