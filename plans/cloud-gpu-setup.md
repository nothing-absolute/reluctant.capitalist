# Cloud GPU Setup — reluctant.capitalist polish + video gen (2026-09-23)

Budget: **$24** (add to existing RunPod account). Goal: (1) finish the LLM polish pass
project, (2) use remaining budget for video-gen projects. Chosen platform: **RunPod
Serverless** — its core feature is exactly "easily switch between different GPUs":
you change the GPU tier on an endpoint in-app without touching code or containers.

---

## 1. Provider decision + sign-up bonuses

### Recommendation: stick with RunPod (already have an account)
- RunPod Serverless is purpose-built for this: per-second billing, scale-to-zero, and
  **switching GPU class on an endpoint = a dropdown in the endpoint config.** No other
  provider makes GPU switching this easy.

### Sign-up bonuses (re-checked 2026-09-23 — stale claims removed):
| Service | Bonus (currently running) | Fit for this profile |
|---|---|---|
| **Modal** | **$30/mo free compute** on Starter, resets monthly, **no card required** | Serverless GPU; run the LLM polish pass for $0 → keeps all $24 for video. Best fit bonus |
| **AMD Developer Cloud** | **$100 credits** (AMD AI Developer Program; pick AMD Instinct GPU or Fireworks): 30-day expiry after activation, ~2–3 business-day approval | Biggest raw-GPU grant; video gen on ROCm adds friction |
| **Lightning AI** | Free tier: **up to 80 free GPU hrs**; 1 free 24/7 Studio; 5 credits (+25 if you add a card) | Turnkey studios; plenty for a polish pass |
| **Paperspace (DigitalOcean)** | **$200 credit** for the first 60 days | Raw GPU VMs, more manual |
| **Oracle Cloud** | **$300 credit** (30 days) + Always Free tier | Raw GPU; availability/stock issues |
| RunPod | **None on self-serve** ($1k credit is an application-only startup tier, not a signup bonus) | Already has an account → no bonus available |
| Together AI | **None** — signup credit promo retired; **$5 min prepay** to use the platform | Ruled out on credits |
| Baseten / Replicate / xAI | Baseten promo ended Dec 2025; Replicate limited free runs; xAI data-sharing privacy tradeoff | Skip |

**Budget-stretching play (updated):** top-up RunPod with $24 for video gen; run the LLM
polish pass free on **Modal's $30/mo recurring credit** (point `polish.mjs` at a
Modal-hosted vLLM/llama.cpp OpenAI-compatible endpoint). Optional: AMD's $100 credit is
the largest one-shot GPU grant if a 30-day expiry + approval works for you.

### Pricing reference (RunPod Serverless, per hr except /sec noted — verify on dashboard)
| GPU class | Flex ($/hr) | Active –40% ($/hr) | Use for |
|---|---|---|---|
| A4000/16GB | $0.58 | $0.40 | 4B–14B LLM polish |
| L4/A5000/3090/24GB | $0.69 | $0.47 | LLM + small video |
| 4090/24GB | $1.12 | $0.76 | Video gen |
| A6000/A40/48GB | $1.22 | $0.86 | Bigger video, 30B MoE |
| A100/80GB | $2.74 | $2.16 | Heavy video |
(Serverless worker price per sec shown on the endpoints page; Flex = spike workloads /
scale-to-zero, Active = 24/7 consistent load.)

---

## 2. Cost to complete the project (LLM polish pass)

Workload: 135 candidates, ~183k input / ~200k output tokens, JSON out, llama.cpp-style.
On an A4000 (16GB) this is ~10–20 min of worker time.

| Item | Est. hours (A4000 flex $0.58/hr) | Cost |
|---|---|---|
| Setup: create endpoint, test 1 note | ~0.5h | ~$0.30 |
| Dry-run full batch (135 notes), inspect diffs | ~0.8h | ~$0.45 |
| Fix/iterate (1–2 re-runs) | ~1h | ~$0.60 |
| Final run + `--apply`, promote | ~0.5h | ~$0.30 |
| **Total (project completion)** | | **≈ $1.65–2.50** |

If using Together's free credits instead: **$0.00** (you pay nothing out of the $24).

---

## 3. Remaining budget → video gen

After the LLM project: **~$21–24 left**. All easily funded on RunPod.

### Option A — RunPod Public Endpoints (per-video fixed price, zero infra)
One API call per video, no GPU management. Per 5s clip:

| Model | 5s 720p | 10s | Notes |
|---|---|---|---|
| **Pruna Video** (draft: $0.005/s) | $0.03 | $0.05 | cheapest; proof-of-concept |
| **Pruna Video** (standard $0.02/s) | $0.10 | $0.20 | good quality, fast |
| WAN 2.1 / 2.5 I2V | $0.30 | $0.60 | solid open model |
| WAN 2.6 I2V ($0.10/s) | $0.50 | $1.00 | audio support, 1080p |
| WAN 2.6 T2V | $0.50 | $1.00 | text-to-video |

**What $21 buys:** ~200 Pruna-standard 5s clips, OR ~40 WAN 2.6 I2V 5s clips, OR a mix.

### Option B — Custom serverless (bring your own ComfyUI/Wan/LTX container)
Host any open video model on 4090/A6000. Gen times ~5–8 min/clip → **$0.05–0.20/clip**.
$21 → ~100–400 clips. More setup effort; GPU-switchable (this is where you'd use the
4090 → A6000 dropdown). Good if you have specific LoRAs/workflows.

### Recommended video stack for the budget
1. **Pruna Video** (public endpoint) for quick drafts/iterations (~$0.03–0.10/clip).
2. **WAN 2.6 I2V** for final 5–10s clips with audio (~$0.50–1.00/clip).
3. Later, if any specific workflow needs it, deploy a custom serverless endpoint and switch to 4090/A6000.

---

## 4. Setup outline (RunPod, LLM polish)

### Prerequisite
- Top up RunPod with **$24**; optionally also sign up at **Together AI** and claim **$150 free** (then polish runs free — see 5).

### Create the endpoint
1. RunPod → **Serverless → New Endpoint**.
2. Container: use the llama.cpp serverless template (runpod/llama.cpp-serverless) or
   the community Qwen3 GGUF template that exposes an OpenAI-compatible `/v1/chat/completions`.
3. Model: `Qwen_Qwen3-4B-Q4_K_M.gguf` (bartowski, 2.5GB) — or Qwen3-14B if quality needs it
   (still fits 16GB, slightly slower).
4. GPU: **A4000 16GB**, **Flex**, max workers 1 (sequential batch → keep cost minimal).
5. **Cold-start note:** llama.cpp flash-boots the GGUF in seconds; with max 1 worker and
   Flex, you pay nothing between catalogue runs.

### Repo code (small change to `scripts/polish.mjs`)
- Add optional `POLISH_API` and `POLISH_MODEL` env overrides; add an
  `Authorization: Bearer` header when a `POLISH_API_KEY` env var is set.
  (OpenAI-compatible, so RunPod endpoint or Together both work unchanged otherwise.)
- Rest of the contract already works: reads `message.content`, `temperature:0.3`,
  `max_tokens` 4096, `TIMEOUT` 900s, `# First batch output should be JSON`.
- Run: `npm run polish -- <review-timestamp> <section>/<file>` (dry-run) →
  inspect `polish/diffs/` → `--apply` to promote. Never publishes automatically.

### Run down the batch
```
POLISH_API=https://<your-endpoint>.runpod.net POLISH_MODEL=qwen3-4b npm run polish -- 20260923-20260923-182419
```
Dry-run first, review diffs, re-run, then `--apply` per approved candidates.

---

## 5. Together AI — not worth it anymore (bonus retired)
1. Signup credits **retired** (Together support docs): no free tier/trial now; **$5 minimum prepay** to use the platform. Not a fit vs Modal/RunPod free-funding paths.
2. If you ever want its hosted token API: `POLISH_API=https://api.together.xyz/v1 POLISH_MODEL=Qwen/Qwen3-14B POLISH_API_KEY=together_...` → 135-candidate batch ≈ $0.08, but prepaying $5 defeats the budget goal.

Cost with Together for LLM: not free → skip.

---

## 6. Total budget picture
| Spend | Amount |
|---|---|
| LLM polish project completion (RunPod, or **free via Modal's $30/mo credit**) | **$0.00–2.50** |
| Remaining for video-gen projects (incl. optional AMD $100 grant) | **~$21.50–24.00** |
| RunPod balance + Modal monthly credit | **$24 + $30/mo** |

## Verify at click time
RunPod prices (endpoints page), Modal credit balance, and model-availability figures
were researched 2026-09-23 and can drift; check the dashboard before large runs.