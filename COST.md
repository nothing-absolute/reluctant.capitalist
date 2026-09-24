# Build cost ledger

Cumulative RunPod spend to produce this version of the site, from bulk raw data import to the
current structured state.

## Total: $2.62

| Session | GPU | Runtime | Rate | Cost | What it bought |
|---|---|---|---|---|---|
| Bulk data ingest | A4000 | 2.7 h | $0.17/hr | $0.46 | 133 posts polished, first `/staging` pass |
| Metadata shaping | RTX 4090 | ~54 min | $0.74/hr | $0.67 | 215 posts titled, described, tagged, sectioned, linked |
| Theme synthesis (4B) | RTX 4090 | 22 min | $0.74/hr | $0.27 | 12 synthesis posts — **0 usable**, all degenerate |
| Theme synthesis + rewrite (14B) | RTX 4090 | 43 min | $0.74/hr | $0.53 | 12 clean synthesis posts, 411 member links |
| **Total** | | | | **$2.62** | |

An A40 pod was also provisioned during the shaping session and stopped without doing work; it is
not counted because it was billed for under a minute.

## What $2.62 produced

- 141 published posts, 82 drafts, 223 on disk across 10 sections
- 12 synthesis posts carrying 411 member links over 12 detected bodies of work
- A `/constellation` page making that structure visible
- A repetition/quality gate that caught 166 machine-loop posts the earlier pipeline passed

## What the money taught

The two cheapest sessions produced the least. The 4B model at $0.27 produced nothing usable —
every one of its 12 outputs was a repetition loop. The 14B model at $0.53 produced all 12 clean.
Model capacity, not token count, was the deciding factor.

Every pod was stopped the moment its last batch finished, before any reviewing or writing, per the
RunPod cost guard in `/home/jd/Prototypes/AGENTS.md`. No network volumes or serverless endpoints
were ever created for this project.
