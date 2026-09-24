---
title: "The Idea Relay — a market for unfinished ideas"
description: "Kickstarter funds a creator; this inverts it: post an idea you can't finish, let others carry it forward, and get provable credit + royalties from the lineage."
date: 2026-08-03
tags: ["concepts", "marketplace", "blockchain", "crowdfunding"]
---

Most ideas don't die from lack of funding. They die from lack of *handoff*. Someone has a concept but not the skill; a prototype but not the time; a working thing but none of the drive left to push it past the finish line.

Kickstarter's assumption is that one creator will see a project through. Patreon's assumption is that the creator will keep producing. Both platforms are built around *people*. What if the unit of value were the *idea's lineage* instead?

## The shape of it

1. **Post, don't pitch.** A creator posts a concept or prototype and declares why they're stuck: missing skill, missing time, missing funds, missing drive. Explicitly *not* a funding ask.
2. **The backend finds overlaps.** Semantic matching across posted projects — problem statement, stack, audience, blocker type — evaluates the best path forward: **merge** complementary teams, **handoff** the missing skill, **consolidate** duplicates.
3. **Transparent logic.** Every match exposes its reasoning in plain language: "Project A has UI but no backend; Project B has backend but no users → merge."
4. **Provenance on a ledger.** The original post is hashed; every contribution is a signed transaction forming a lineage DAG (git + citations combined). "Who was first" is provable.
5. **Score the contributions.** Each contributor earns a weighted value-added score — downstream builds, adoption, peer endorsements. The score is public, and it's the claim on future value.
6. **Royalties downstream.** When a relayed project graduates to funding or subscription, a royalty pool splits by score weight across the whole lineage. The originator keeps a reserved floor.

## Why this could work

- **The supply is enormous.** Every forum is full of "I had this idea but I can't code" posts.
- **The economics invert gracefully.** The platform earns on the downstream funding event, not on the initial post — which keeps the posting barrier near zero.
- **Blockchain earns its keep here.** This is one of the few consumer cases where an immutable, publicly-verifiable record of priority is genuinely valuable.

## The three hard problems

1. **Attribution.** Objectively scoring "value added" is unsolved — signals like downstream builds and endorsements are gameable.
2. **License defaults.** Who owns a fork? The platform needs sane defaults before the first dispute.
3. **Cold start.** Matching is only as good as the posted base. A marketplace needs both sides of a two-sided network before day one.

This is a seed, not a company. It belongs in the concept collection because the *framing* is the deliverable: ideas as relayable assets, credit as provenance, royalties as arithmetic on the lineage.
