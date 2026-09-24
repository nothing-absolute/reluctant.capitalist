---
title: "AI Task Concierge Concept"
description: "An AI task concierge designed to help ADHD/neurodivergent users manage anxiety-inducing phone and paperwork tasks by automating the process and providing emotional support through "
date: "2026-09-23"
status: "concept"
stage: "idea"
tags: ["type/idea","project/ai-task-concierge","type/task","adhd","ai","kickstarter"]
source: "Projects/AI/AI-Task-Concierge.md"
---
An AI "task concierge" that completes anxiety-inducing phone-and-paperwork tasks for ADHD/neurodivergent users, absorbing the executive-function and emotional load so the user never has to start (or re-start) the task.

**Origin story:** Applying for unemployment/disability. Eligible for years, but the application always felt too daunting — start, gather part of the info, get overwhelmed or distracted, forget for months. The concierge makes all the calls and tracks everything.

**Example flow (disability application):**
1. Agent calls every doctor's office the user has visited and requests the specific medical records the application requires.
2. Agent gives each office a fax number / email address to send records to.
3. Agent monitors the email inbox for arrivals.
4. Records are parsed and attached to the application form.
5. If records don't arrive within a set window → agent makes follow-up calls.
6. Dashboard shows status of every call, overall task status, and progress graphics.

#### Core Insight (the moat)

The telephony/voice-agent layer is a **commodity** (Retell, Vapi, Voiceflow, Pipecat + Twilio — all mature in 2026). The differentiated value is two layers on top:

1. **The task-recipe playbook** — for each task type, exactly what's needed, who to call, what info to gather, what docs are required, the failure paths and follow-ups.
2. **Emotional-load management** — the dashboard's "realistic time and effort" visualization is a *cognitive reframe* for ADHD/anxiety brains: a wall of tiny ambiguous steps becomes a finite, visible, nearly-done-for-you pipeline. Progress graphics double as dopamine/encouragement.

The product is not "AI that makes calls." It's "AI that finishes the task so I don't have to.".

#### MVP: Medical Records Concierge

First use case, chosen because it's finite, measurable, common, and high-anxiety:
- Needed for: unemployment, disability (SSDI/SSI, private), FMLA, insurance disputes, legal cases.
- Finite: list of providers → records requested → records arrived ✓.
- The user's own pain: the phone calls to doctor's offices are the most daunting part.

**Scope decision:** Build the Medical Records Concierge as the first *recipe* on a **flexible task-recipe framework** — not a bespoke one-off. Future recipes: unemployment application, insurance dispute, cancel subscription, reschedule appointments, benefits status check.

#### Task-Recipe Framework

Every task type is a recipe — a JSON schema the agent engine executes:

```jsonc
{
  "id": "medical-records",
  "name": "Medical Records Request",
  "inputs_required_from_user": [
    {"key": "providers", "type": "provider_list", "label": "Doctors/offices visited"},
    {"key": "ssn_dob", "type": "identity", "label": "SSN / DOB / insurance info"},
    {"key": "authorization_form", "type": "upload", "label": "Signed HIPAA release + ID copy"}
  ],
  "steps": [
    {"id": "call_provider", "for_each": "providers", "action": "voice_call",
     "script": "request records for [user], provide fax/email, note expected turnaround"},
    {"id": "receive_records", "action": "monitor_email_and_fax", "trigger": "record_arrival"},
    {"id": "follow_up", "delay": "7d", "if": "no_records", "action": "voice_call", "script": "status check"},
    {"id": "organize_and_attach", "action": "parse_pdfs", "output": "application_folder"}
  ],
  "required_documents": ["signed_authorization", "photo_id"],
  "success_criteria": "all providers' records collected and filed",
  "escalation": "human intervention when a provider requires manual step (portal, in-person, fee)"
}
```

The engine runs any recipe: same call orchestration, same records pipeline, same dashboard. New use cases = new recipe + small user-input form, not new engineering.

#### Architecture

##### Voice Agent
- **Platform:** Retell / Vapi / Pipecat + Twilio (outbound calling, phone-tree navigation, hold-waiting, live-human handoff).
- **Voice:** neutral, professional assistant voice now ("Hi, I'm calling on behalf of [user]"). **Voice cloning = opt-in premium feature later** (deliberately deferred: adds TCPA/consent and impersonation friction, contributes nothing to trust in an agent that must self-identify as automated anyway).
- **Self-identification:** required by FCC Feb 2024 TCPA ruling (AI voices covered by TCPA; legal when the agent is the principal's authorized caller).

##### Records Pipeline
- **Email:** dedicated inbox per task (or Gmail API on a user-owned address), watched for arrivals + OCR/parse attachments.
- **Fax:** fax API (eFax / Telnyx) as the fax-back destination providers prefer.
- **Docs:** PDF parse/OCR → extract → file into the application folder (organized by provider + doc type).

##### Dashboard (webapp)
- Per-call status board (each provider: queued → called → requested → awaiting → received / follow-up scheduled).
- Overall task progress.
- **Realistic time/effort visualization** — shows exactly what remains, how long it'll really take, how much is already handled for them.
- Progress graphics + encouragement (win-momentum design, consistent with Refocus Guardian philosophy — no timers, no lockouts).

#### Compliance & Reality Checks
- **HIPAA/PHI:** medical records contain PHI → HIPAA-compliant handling: BAA with every vendor that touches it (voice, email, fax, storage), encryption at rest/in transit, minimize retention, user-owned/controlled data.
- **Signed authorization:** most providers require a signed HIPAA release + photo ID copy before releasing records. This is a small but un-automatable **human step** the app must orchestrate (pre-filled form, e-sign, user uploads ID once) — design it honestly as part of the recipe, not something the AI can skip.
- **SSA caveat:** SSA's Disability Determination Services gathers medical records itself once you file — so the strongest first use case is **state unemployment / private insurance / FMLA**, where the claimant must supply records.
- **TCPA:** AI-generated voices are legal with consent/authorization; agent must self-identify as automated.

#### Business Model
- **Subscription** product (monthly tiers: # of active tasks / concierge credits).
- **Kickstarter / Indiegogo candidate** — personal, relatable origin story (the disability-application failure is a compelling campaign narrative); could also sell as a B2B perk (HR/benefits) later.
- Market gap confirmed: voice-agent infrastructure exists (Retell, Vapi, Voiceflow, etc.) but no dominant "concierge for executive-function load" consumer product.

#### Next Steps
- [ ] Define recipe schema v1 (providers input form, call scripts, follow-up rules)
- [ ] Prototype one real call flow with a voice-agent platform (record it for the campaign)
- [ ] Design the time/effort visualization + encouragement dashboard
- [ ] Map provider authorization-form variations (the human-step orchestration)
- [ ] Research subscription pricing + Kickstarter campaign structure
