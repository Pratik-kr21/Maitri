# Maitri — Product Requirements Document (PRD)

**Version:** 1.0  
**Date:** February 26, 2026  
**Status:** Draft  
**Owner:** Maitri Product Team  

---

## Table of Contents

1. [Executive Summary](#1-executive-summary)
2. [Problem Statement](#2-problem-statement)
3. [Target Users](#3-target-users)
4. [Goals & Success Metrics](#4-goals--success-metrics)
5. [Scope](#5-scope)
6. [Functional Requirements](#6-functional-requirements)
7. [Non-Functional Requirements](#7-non-functional-requirements)
8. [Privacy & Legal Requirements](#8-privacy--legal-requirements)
9. [Technical Architecture](#9-technical-architecture)
10. [UX & Design Principles](#10-ux--design-principles)
11. [Community Guidelines & Moderation](#11-community-guidelines--moderation)
12. [AI Layer Specification](#12-ai-layer-specification)
13. [Data Models](#13-data-models)
14. [Build Order & Milestones](#14-build-order--milestones)
15. [Risks & Mitigations](#15-risks--mitigations)
16. [Open Questions](#16-open-questions)

---

## 1. Executive Summary

Maitri is a **privacy-first, AI-assisted women's health web app** centered on period and reproductive health tracking. Its singular purpose is to go beyond prediction — to help teenage girls and working women understand what their cycle is actually telling them about their bodies and minds, each day.

Unlike existing trackers (Flo, Clue, Maya) that function as passive calendars, Maitri connects logged symptoms to real physiological explanations, surfaces patterns users would never notice on their own, and provides a safe, moderated community of women at similar life stages — all without ever selling user data or posing as a medical service.

**The one-line pitch:** *The first period tracker that teaches you what your cycle is actually telling you — privately, safely, and with people who get it.*

---

## 2. Problem Statement

### 2.1 The Core Gap

Millions of teenage girls and working women track their periods using generic calendar apps, notes apps, or paper. These tools offer zero health context, no symptom intelligence, and no privacy guarantees. When something feels off, users turn to unreliable sources — Google, TikTok, Reddit — where information is either too alarming or dangerously vague.

There is no single trusted, private, and intelligent space built specifically for them.

### 2.2 Why Existing Solutions Fall Short

| App | Core Failure |
|-----|-------------|
| Flo | Monetizes health data; prediction without explanation |
| Clue | Clinical and cold; poor experience for teenagers |
| Maya | Outdated UX; no community or education layer |
| Reddit / Forums | No personal context; misinformation risk; no safety |

### 2.3 The Real Problem, In Plain Language

- A 16-year-old has irregular periods and doesn't know if she should be worried. She's too embarrassed to ask her mother and too scared to Google it.
- A 31-year-old working woman has cyclic mood crashes every month but has never connected them to her hormonal cycle. She wants to understand herself, not just be predicted.

Both need the same thing: **a trusted, private space that explains their body to them.**

---

## 3. Target Users

### 3.1 Primary Persona — "Priya" (Age 16)

- Recently started getting irregular periods
- Feels confused and mildly anxious about her body
- Too embarrassed to discuss with family
- Scared of alarming Google results
- Needs: reassurance, plain-language explanation, and peer connection

**Key behaviors:** Uses phone primarily, privacy-conscious, low trust in institutions, responds to warmth and non-clinical tone.

### 3.2 Secondary Persona — "Ananya" (Age 31)

- Working professional, uses Flo currently but finds it shallow
- Notices cyclical patterns — mood crashes, fatigue, bloating — but can't explain them
- Has occasional gynecologist visits but doesn't feel informed in between
- Needs: pattern intelligence, explanation tied to her own data, community with peers her age

**Key behaviors:** Willing to pay for value, wants efficiency, trusts evidence-based information, appreciates data exports for doctor visits.

### 3.3 Age Group Breakdown

| Segment | Age | Community Space | Ask Maitri Scope |
|---------|-----|-----------------|-----------------|
| Teens | 13–17 | Teen-only circles | Conservative; nudges to trusted adults |
| Young Adults | 18–24 | Mixed 13–24 circles | Standard |
| Working Women | 25–45 | Separate circles | Full scope |

---

## 4. Goals & Success Metrics

### 4.1 Product Goals

- Build the most trusted period tracker for Indian teenagers and working women
- Create genuine health literacy, not just data logging
- Establish a safe, active community from day one
- Be unambiguously private — provably, not just as a promise

### 4.2 Launch Success Metrics (First 6 Months)

| Metric | Target |
|--------|--------|
| Monthly Active Users (MAU) | 5,000 |
| Day-7 Retention | ≥ 40% |
| Day-30 Retention | ≥ 25% |
| Daily journal check-in rate | ≥ 35% of MAU |
| Community posts per week | ≥ 500 |
| "Ask Maitri" queries per week | ≥ 1,000 |
| NPS Score | ≥ 50 |
| Prediction accuracy (cycle 3+) | ≥ 80% within ±2 days |

### 4.3 Phase 2 Unlock Trigger

Phase 2 (cycle-synced nutrition guidance) unlocks when Maitri reaches **10,000 MAU** and qualitative research confirms users are requesting nutritional guidance.

---

## 5. Scope

### 5.1 In Scope — MVP (Phase 1)

- User authentication with age verification and parental consent flow for under-18
- Cycle tracker with transparent, tiered prediction
- Phase-aware daily insight cards tied to logged data
- Symptom journal as a micro-conversation check-in
- Pattern detection and surfacing after 2–3 cycles
- "Ask Maitri" AI assistant with clinical guardrails
- Community circles with moderation
- Private health vault with PDF export
- Monthly Cycle Story

### 5.2 Out of Scope — Phase 1

- Nutrition and diet guidance
- Telehealth / appointment booking
- Wearable device integration
- Native iOS / Android apps (PWA covers mobile)
- Multilingual support (English only at launch)
- Social login (Google, Apple)

### 5.3 In Scope — Phase 2 (Post-10K MAU)

- Cycle-synced nutrition guidance based on user's own logged symptoms
- Multilingual support (Hindi, Tamil, Bengali)

---

## 6. Functional Requirements

---

### 6.1 Authentication & Onboarding

#### FR-AUTH-01: Signup Flow

The app shall support two signup paths:

**Standard (18+):**
- Email input → magic link sent → click to activate → age confirmation → username selection → onboarding

**Under-18:**
- Email input → age confirmation triggers parental consent flow → parent/guardian email is collected → parental consent email sent → parent approves → teen account activated → username selection → onboarding

The under-18 flow is mandatory and non-bypassable. Age is collected via a birth year selector (not a checkbox) to reduce dishonest input.

#### FR-AUTH-02: Anonymous Identity

- Users are identified publicly only by their chosen username
- No real name is required or stored
- Profile photo is optional and avatar-based (no real photo uploads in MVP)
- Username is separate from email at the database level

#### FR-AUTH-03: Passwordless Login

- All logins via magic link to the registered email
- Session tokens expire after 30 days of inactivity
- No password stored; no password reset flow needed

---

### 6.2 Cycle Tracker

#### FR-CYCLE-01: Cycle Logging

Users can log the following per cycle:
- Period start date
- Period end date
- Flow intensity per day (light / medium / heavy / spotting)
- Symptoms per day (drawn from a predefined library — see FR-CYCLE-04)

#### FR-CYCLE-02: Prediction Engine

The prediction engine shall use a validated open-source algorithm (based on published menstrual cycle research, reviewed by the clinical advisory panel before launch).

Prediction confidence is tiered and displayed honestly to the user:

| Cycles logged | Confidence display |
|--------------|-------------------|
| 0–1 | "We're still learning your pattern" |
| 2–3 | "Early estimate — may vary by a few days" |
| 4–6 | "Getting more accurate" |
| 7+ | Standard prediction with ±2 day range shown |

The app shall never display a single-day prediction without an uncertainty range.

#### FR-CYCLE-03: Cycle Phase Display

The current cycle phase is displayed prominently on the home screen at all times:

- **Menstrual** (day 1 to end of period)
- **Follicular** (post-period to ovulation)
- **Ovulatory** (ovulation window)
- **Luteal** (post-ovulation to next period)

Phase descriptions use plain language, not clinical terminology as the primary label.

#### FR-CYCLE-04: Symptom Library

The predefined symptom library shall include at minimum:

Physical: cramps, bloating, headache, breast tenderness, acne, fatigue, nausea, back pain, spotting, heavy flow, light flow

Emotional: anxious, irritable, sad, happy, calm, overwhelmed, motivated, brain fog, low confidence

Energy: low, medium, high

Users may also add free-text notes per day (max 280 characters).

---

### 6.3 Phase-Aware Daily Insight Cards

#### FR-INSIGHT-01: Daily Card Generation

Every day, the home screen displays one insight card. The card is generated based on:
1. The user's current cycle phase
2. Symptoms logged in the previous 24–48 hours
3. Patterns detected across previous cycles (if available)

The card has three components:
- **What's happening:** A one-sentence plain-language explanation of the current phase
- **Why you might feel X:** A direct connection to a symptom the user logged (e.g., "You logged fatigue yesterday. During your luteal phase, progesterone rises and can make your body feel heavier and slower — this is normal.")
- **One small thing:** A single, actionable, low-effort tip (e.g., "Iron-rich foods like spinach and lentils can help counter the energy dip from blood loss.")

#### FR-INSIGHT-02: Content Quality

All insight card content shall be reviewed by the clinical advisory panel before launch. Content is written at a Grade 8 reading level. No content shall claim to diagnose a condition or prescribe a treatment.

---

### 6.4 Symptom Journal

#### FR-JOURNAL-01: Daily Check-In Design

The daily check-in is designed as a micro-conversation, not a form. It consists of three prompts presented sequentially:

1. **Energy:** "How's your energy today?" → [Low] [Medium] [High]
2. **Physical:** "Anything bothering you physically?" → Icon-based multi-select from symptom library
3. **Mood:** "One word for your mood?" → Free text, optional, max 30 characters

Total completion time target: under 30 seconds.

#### FR-JOURNAL-02: Journal History

Users can view a calendar-style history of all logged entries. Tapping any day shows the full log for that day. Entries can be edited up to 72 hours after logging.

#### FR-JOURNAL-03: Pattern Surfacing

After 2 full cycles of journal data, the app shall begin surfacing patterns in a dedicated "My Patterns" section. Example pattern cards:

- "You tend to feel anxious on days 20–24 of your cycle. This is the luteal phase, when serotonin levels dip as progesterone rises."
- "Your energy is consistently highest around day 12–14 — this is your ovulatory phase, when oestrogen peaks."
- "You've logged cramps on the first 2 days of your last 3 periods."

Pattern cards are generated weekly and are presented as observations, never diagnoses.

---

### 6.5 Ask Maitri — AI Health Assistant

#### FR-AI-01: Scope Definition

Ask Maitri shall answer questions within the following defined scope:

**In scope:**
- General reproductive health questions (what is PCOS, why do periods change, what causes cramps)
- Contextual questions tied to the user's own logged data ("Why do I feel so tired on day 3?")
- Guidance on when to see a doctor, framed helpfully
- Preparation for doctor appointments (what to mention, what questions to ask)

**Out of scope (hard limits):**
- Diagnosing conditions
- Interpreting specific test results or bloodwork
- Commenting on medication or supplements
- Answering questions about fertility treatment protocols
- Answering questions that are clearly outside reproductive health

#### FR-AI-02: Escalation Logic

The following symptom patterns shall trigger a mandatory "please see a doctor" response, with no option to override:

- Periods absent for more than 90 days (excluding pregnancy)
- Severe pain described as 8/10 or higher
- Bleeding lasting more than 10 days
- Any mention of pregnancy symptoms combined with pain
- Any mention of self-harm or crisis language (triggers crisis resource response)

Escalation responses include a printable symptom summary from the user's health vault to bring to the appointment.

#### FR-AI-03: Under-18 Modified Scope

For users in the under-18 flow, Ask Maitri applies a more conservative response set:
- More frequent nudges toward talking to a trusted adult or school counselor
- No discussion of contraception unless the user explicitly initiates
- Crisis language triggers immediate display of helpline numbers (iCall India: 9152987821)

#### FR-AI-04: Clinical Advisory Review

All response guidelines, hard limits, escalation triggers, and edge case handling shall be reviewed and approved by the clinical advisory panel (minimum 2 gynecologists + 1 adolescent health specialist) before any user interaction with Ask Maitri goes live. This is a launch gate, not a post-launch task.

---

### 6.6 Community Circles

#### FR-COMM-01: Circle Structure

Community is organized into named circles based on life stage and shared experience:

| Circle | Target audience |
|--------|----------------|
| Teen Talk | Users 13–24 only |
| Working & Cycling | Users 25–45 |
| PCOS Warriors | Open to all |
| Endo Support | Open to all |
| Irregular Periods | Open to all |
| General Wellness | Open to all |

Teen Talk is strictly age-gated. No user above 24 can view or post in it.

#### FR-COMM-02: Post Types

Posts within circles are structured, not freeform. Users select a post type before writing:

- **Question** — "I have a question about..."
- **Experience** — "Something I noticed this cycle..."
- **Win** — "I want to share something positive..."
- **Resource** — "This helped me and might help you..."

Structured post types reduce the blank-page problem for new users and make moderation more consistent.

#### FR-COMM-03: Anonymity

All community activity uses the user's chosen username only. No connection to real name or email is visible to other users or to moderators. Community data is stored in a completely separate database from health data.

#### FR-COMM-04: Weekly Prompts

Each circle has one rotating weekly prompt to drive engagement regardless of cycle phase. Examples:
- "This week I struggled with \_\_\_."
- "Something that actually helped my cramps: \_\_\_."
- "A question I was too embarrassed to Google: \_\_\_."

Prompts refresh every Monday.

#### FR-COMM-05: Interaction Model

- Users can upvote posts (no downvotes)
- Users can reply to posts (threaded, max 2 levels deep)
- No follower counts, no public like counts on profiles
- Users can save posts to a private bookmark list

#### FR-COMM-06: Pre-Launch Seeding

Before public launch, Maitri shall recruit 50–100 founding community members from women's college networks, PCOS support groups, and adolescent health NGOs. These members will populate the community with real content so that the first public user never encounters an empty feed.

---

### 6.7 Private Health Vault & PDF Export

#### FR-VAULT-01: What is Stored

The health vault contains all of the user's logged data in one place:
- Full cycle history with dates and flow intensity
- Symptom logs by day
- Journal entries
- Pattern cards generated by the app
- Ask Maitri conversation history (optional — user can disable storage)

#### FR-VAULT-02: PDF Export

Users can generate a health summary PDF at any time. The PDF includes:
- Cycle history for a selected date range
- Symptom frequency summary
- Notable patterns identified
- A section titled "Questions to ask your doctor" pre-populated with any escalation triggers that occurred

The PDF is formatted for use in a medical appointment. It is generated client-side where possible to avoid health data transiting the server unnecessarily.

#### FR-VAULT-03: Data Deletion

Users can delete individual log entries, individual cycle records, or their entire account. Full account deletion permanently purges all data within 24 hours and sends a confirmation email. Deletion is irreversible and the app communicates this clearly before confirmation.

---

### 6.8 Monthly Cycle Story

#### FR-STORY-01: Content

At the end of each cycle, Maitri generates a personal summary containing:
- Average cycle length vs. previous cycles
- Most frequently logged physical symptoms
- Most frequently logged emotional states
- Energy pattern across the cycle (chart)
- One new insight compared to last month ("This cycle, your luteal phase fatigue was shorter than last month — by 2 days.")
- A shareable card (image format) with a summary — no health data visible, only positive framing

#### FR-STORY-02: Delivery

The Monthly Cycle Story is delivered as a push notification and displayed as a full-screen card in the app. It is always opt-in to share; never shared without explicit user action.

---

## 7. Non-Functional Requirements

### 7.1 Performance

| Metric | Requirement |
|--------|------------|
| Page load (initial) | < 2 seconds on 4G |
| Page load (subsequent) | < 500ms (cached) |
| API response time (p95) | < 800ms |
| Ask Maitri first token | < 1.5 seconds |
| PDF export generation | < 5 seconds |
| Uptime | 99.5% monthly |

### 7.2 Accessibility

- WCAG 2.1 AA compliance
- All interactive elements keyboard navigable
- Minimum contrast ratio 4.5:1
- Screen reader compatible (tested with VoiceOver and TalkBack)
- All icons have text labels (no icon-only navigation)

### 7.3 Mobile Experience

- Full PWA support — installable on iOS and Android home screens
- All core flows functional and optimized for screens 375px and above
- Touch targets minimum 44x44px
- No horizontal scroll on any screen

### 7.4 Offline Support

- Last-loaded home screen and daily card available offline
- Journal check-in can be completed offline and syncs on reconnection
- No critical functionality silently fails offline — clear messaging shown

---

## 8. Privacy & Legal Requirements

### 8.1 Data Separation Architecture

Health data and community data shall be stored in **two completely separate PostgreSQL databases** with no shared keys or cross-referencing identifiers. A community username cannot be traced back to a health profile, even internally. This is an architectural requirement, not a policy.

### 8.2 Encryption

- All health logs encrypted at the application layer before writing to the database
- Encryption keys managed separately from the database
- Community data encrypted at rest
- All data in transit encrypted via TLS 1.3

### 8.3 Parental Consent (Under-18)

- Users who indicate they are under 18 must complete parental consent before account activation
- Parent/guardian email is collected and a consent email is sent
- Account remains in a pending state until consent is confirmed
- Parental consent records are retained for legal compliance
- This flow cannot be bypassed at the UI or API level

### 8.4 Data Minimization

- No real name collected or stored
- No phone number collected
- No location data collected
- Profile photo uploads not supported in MVP
- Only data necessary for core features is collected

### 8.5 User Rights

Users have the right to:
- Access all their stored data (downloadable via PDF export)
- Correct any logged entry (up to 72 hours)
- Delete any entry or their full account permanently
- Opt out of pattern detection
- Opt out of Ask Maitri conversation history storage
- Withdraw parental consent (for under-18 accounts), which deactivates the account

### 8.6 Policy Communication

The data policy is written in plain language (Grade 8 reading level) and displayed in full at signup — not hidden behind a link. Key commitments are summarized in three bullet points at the top of the policy page before the full text.

### 8.7 Compliance

- India DPDP Act (Digital Personal Data Protection Act, 2023) — primary compliance framework
- GDPR-aware design for future expansion
- HIPAA-aware design (clinical-grade sensitivity applied even where not legally mandated)
- Legal review by a qualified data privacy attorney before launch — this is a launch gate

### 8.8 Analytics

Analytics via Plausible only — no cookies, no fingerprinting, no personal data in analytics. No third-party ad tracking scripts. No data sharing with advertising networks under any circumstances.

---

## 9. Technical Architecture

### 9.1 Stack

| Layer | Technology | Rationale |
|-------|-----------|-----------|
| Frontend | Next.js (React) | PWA support, SSR for performance, strong ecosystem |
| Backend | Node.js + Express | Consistent JS stack, strong community |
| Health Database | PostgreSQL (dedicated instance) | Application-layer encryption, mature, reliable |
| Community Database | PostgreSQL (separate instance) | Physical separation from health data |
| AI Layer | Claude API (claude-sonnet-4-6) | Safe, nuanced health conversations; content moderation |
| Authentication | Custom magic link (Resend for email) | No third-party auth that touches health data |
| Real-time | Supabase Realtime | Community live updates |
| File Storage | Cloudflare R2 | PDF storage; no personal data in filenames |
| Hosting | Vercel (frontend) + Railway (backend) | Low cost, easy scaling |
| Analytics | Plausible | Privacy-respecting, GDPR compliant |
| Error Tracking | Sentry | No PII in error logs (must be enforced in config) |

### 9.2 Key Architectural Decisions

**Two-database model:** Health and community data are in separate PostgreSQL instances. No join queries across them are permitted at any layer. The only shared identifier is a randomly generated internal user UUID that has no external meaning.

**Application-layer encryption:** Health logs are encrypted before being written to the database using AES-256. The encryption key is stored in a separate secrets manager (not in the database or environment variables in plain text).

**PWA over native app:** A Progressive Web App covers the mobile use case without requiring App Store distribution, which is particularly important for the under-18 audience (avoids App Store age rating complications) and reduces the engineering overhead of maintaining two codebases.

**No social login:** Google/Apple login creates a dependency on third-party services that have access to the user's email and login patterns. Maitri's privacy promise requires controlling the full auth stack.

### 9.3 API Design Principles

- All health data endpoints require authentication
- All community endpoints require authentication
- Rate limiting on Ask Maitri (20 queries per user per day in MVP)
- No health data fields in API logs — logs capture only metadata (endpoint, timestamp, status code)
- API versioned from day one (/api/v1/)

---

## 10. UX & Design Principles

### 10.1 Core Design Values

**Warm, not clinical.** The app should feel like a knowledgeable friend, not a medical form. Language is conversational. Colors are warm and grounded. No cold whites, no aggressive reds.

**Explain, don't just display.** Every data point shown to the user has a plain-language explanation within one tap. Users should never see a number or label without understanding what it means.

**Confidence through honesty.** Prediction uncertainty is shown, not hidden. The app does not pretend to know things it doesn't. This builds more long-term trust than false precision.

**Privacy feels visible.** The app actively shows users that their data is theirs — through the health vault, easy deletion, and clear separation between community identity and health data.

### 10.2 Tone of Voice

- Warm and encouraging, never condescending
- Plain English, Grade 8 reading level for all user-facing text
- No medical jargon without immediate plain-language explanation
- For teens: slightly more casual, more reassurance
- For working women: slightly more efficient, more data-forward

### 10.3 Navigation Structure

```
Home
  └── Today's Insight Card
  └── Current Phase Display
  └── Quick Journal Check-In
  └── Cycle Calendar

My Health
  └── Cycle History
  └── Symptom Patterns
  └── Monthly Cycle Stories
  └── Health Vault & PDF Export

Ask Maitri
  └── AI Chat Interface

Community
  └── My Circles
  └── Weekly Prompts
  └── Saved Posts

Settings
  └── Account & Privacy
  └── Notification Preferences
  └── Data Controls
  └── Parental Consent (under-18)
```

---

## 11. Community Guidelines & Moderation

### 11.1 Community Rules (User-Facing)

1. Be kind. This is a safe space — treat it like one.
2. Share experiences, not medical advice. Say "this helped me" not "you should do this."
3. No misinformation. If you're not sure, say so.
4. No promotion of products, supplements, or services.
5. No shaming — of bodies, choices, or symptoms.
6. Respect anonymity. Don't try to identify other users.
7. Teen Talk is for ages 13–24 only. Age-gating is enforced.

### 11.2 Moderation System

**Layer 1 — Automated (Claude API):**
- Content is scanned on post before going live
- Flags are raised for: medical misinformation patterns, crisis/self-harm language, promotional content, harassment, adult content in Teen Talk
- Flagged content is held for human review before publishing (not auto-deleted, to reduce false positive impact)

**Layer 2 — Human Review:**
- All AI-flagged content reviewed by a trained moderator within 4 hours (target)
- Moderators are volunteers recruited from women's health communities, trained via a written guideline document and onboarding session
- Moderator decisions: approve / remove / escalate to admin
- Users are notified if their post is removed, with a reason (no detail on why it was flagged by AI)

**Layer 3 — User Reporting:**
- Any user can report any post
- Reports go to the human review queue
- Three reports on the same post trigger immediate hold pending review

### 11.3 Crisis Response

Any post or Ask Maitri query containing crisis or self-harm language triggers an immediate response:
- The post is held from the community feed
- The user is shown a calm, non-alarmist message with crisis resources
- iCall India: 9152987821
- Vandrevala Foundation: 1860-2662-345
- International Association for Suicide Prevention: https://www.iasp.info/resources/Crisis_Centres/

### 11.4 Disclaimer on All Community Health Posts

Every post in the health-related circles carries a visible, non-intrusive disclaimer: *"Community experiences are personal — they're not medical advice. If you're concerned about a symptom, Ask Maitri or speak to a doctor."*

---

## 12. AI Layer Specification

### 12.1 Model

Claude API — `claude-sonnet-4-6`

### 12.2 System Prompt Architecture

The Ask Maitri system prompt shall define:
- Maitri's role and personality
- Hard scope limits (what it will and won't answer)
- Escalation triggers and exact escalation language
- Under-18 modified behavior flag (passed per-user)
- User's current cycle phase and recent symptom log (passed per-session as context)
- Instruction to always recommend speaking to a doctor when in doubt, framed helpfully not alarmistically

The system prompt shall be versioned and all changes reviewed by the clinical advisory panel.

### 12.3 Context Injection

Each Ask Maitri session receives the following context:
- Current cycle phase
- Symptoms logged in the last 7 days
- Whether the user is in the under-18 flow
- Number of cycles logged (to calibrate confidence language)

This context enables personalized responses without requiring the user to re-explain their situation.

### 12.4 Community Moderation

The Claude API is also used for community post moderation (Layer 1). The moderation prompt shall define:
- Categories of content to flag
- Confidence thresholds for flagging vs. passing
- Special rules for Teen Talk circle

### 12.5 Rate Limits

- Ask Maitri: 20 queries per user per 24-hour window in MVP
- Users are shown their remaining queries
- Community moderation: no user-facing rate limit; backend throttled per-post

---

## 13. Data Models

### 13.1 Health Database — Core Tables

```
users
  id (UUID, primary key)
  email (encrypted)
  username (hashed for lookup; display stored separately)
  date_of_birth (encrypted; used for age verification only)
  is_minor (boolean, derived at account creation)
  parental_consent_granted (boolean)
  parental_consent_email (encrypted, stored only if is_minor = true)
  created_at
  deleted_at (soft delete; hard delete job runs within 24h)

cycles
  id (UUID)
  user_id (FK → users)
  start_date (encrypted)
  end_date (encrypted, nullable)
  created_at

daily_logs
  id (UUID)
  user_id (FK → users)
  cycle_id (FK → cycles, nullable)
  log_date (encrypted)
  flow_intensity (enum: none/spotting/light/medium/heavy)
  symptoms (encrypted JSON array)
  energy_level (enum: low/medium/high)
  mood_word (encrypted, nullable)
  notes (encrypted, nullable)
  created_at
  updated_at

patterns
  id (UUID)
  user_id (FK → users)
  pattern_type (enum)
  description (encrypted)
  detected_at
  cycles_analyzed (integer)

cycle_stories
  id (UUID)
  user_id (FK → users)
  cycle_id (FK → cycles)
  story_data (encrypted JSON)
  generated_at
```

### 13.2 Community Database — Core Tables

```
community_users
  id (UUID, primary key) — no link to health DB user ID
  display_username
  age_bracket (enum: teen / adult) — used for circle gating; not exact age
  created_at

circles
  id (UUID)
  name
  description
  age_restricted (boolean)
  age_bracket_required (enum: teen / adult / null)

posts
  id (UUID)
  community_user_id (FK → community_users)
  circle_id (FK → circles)
  post_type (enum: question/experience/win/resource)
  content (text)
  is_published (boolean)
  moderation_status (enum: pending/approved/removed)
  created_at

replies
  id (UUID)
  post_id (FK → posts)
  parent_reply_id (FK → replies, nullable — max 1 level)
  community_user_id (FK → community_users)
  content (text)
  moderation_status
  created_at

upvotes
  id (UUID)
  post_id (FK → posts)
  community_user_id (FK → community_users)
  created_at

reports
  id (UUID)
  post_id (FK → posts)
  reporting_user_id (FK → community_users)
  reason (text)
  created_at
```

---

## 14. Build Order & Milestones

### Pre-Development Gates (Must Complete Before Code Reaches Users)

- [ ] Clinical advisory panel assembled (2 gynecologists + 1 adolescent health specialist)
- [ ] Clinical review of Ask Maitri scope, escalation triggers, and response guidelines
- [ ] Clinical review of all phase education card content
- [ ] Legal review of data policy, parental consent flow, and DPDP Act compliance
- [ ] Community moderation guidelines written and moderator onboarding designed
- [ ] Founding community members recruited (target: 50–100)

### Milestone 1 — Foundation (Weeks 1–4)

- [ ] Project setup: Next.js frontend, Node.js backend, two PostgreSQL instances
- [ ] Auth system: magic link login, session management
- [ ] Age verification and parental consent flow
- [ ] Anonymous user profile creation

### Milestone 2 — Core Tracker (Weeks 5–8)

- [ ] Cycle logging (start/end dates, flow intensity)
- [ ] Symptom library and daily log
- [ ] Tiered prediction engine (integrated from validated open-source model)
- [ ] Cycle phase detection and display

### Milestone 3 — Education Layer (Weeks 9–11)

- [ ] Phase-aware daily insight card generation
- [ ] Daily journal micro-conversation
- [ ] Pattern detection engine (2-cycle minimum)
- [ ] "My Patterns" display section

### Milestone 4 — Health Vault (Weeks 12–13)

- [ ] Health vault UI — full data history view
- [ ] PDF export generation
- [ ] Data deletion flow (entry-level and account-level)

### Milestone 5 — Community (Weeks 14–17)

- [ ] Circle structure and age-gating
- [ ] Post creation with post types
- [ ] Reply threading
- [ ] Upvote system
- [ ] Weekly prompt system
- [ ] AI-layer moderation integration (Claude API)
- [ ] Human review queue interface for moderators
- [ ] Crisis response trigger
- [ ] Community seeding with founding members

### Milestone 6 — Ask Maitri (Weeks 18–20)

- [ ] Claude API integration
- [ ] System prompt with clinical guardrails (post advisory review)
- [ ] Context injection (cycle phase, recent symptoms, age bracket)
- [ ] Escalation responses with symptom summary link
- [ ] Under-18 modified scope
- [ ] Rate limiting (20 queries/day)

### Milestone 7 — Monthly Cycle Story (Weeks 21–22)

- [ ] Story generation logic
- [ ] Story UI (full-screen card)
- [ ] Shareable card export (no health data visible)
- [ ] Delivery notification

### Milestone 8 — Pre-Launch (Weeks 23–24)

- [ ] End-to-end QA across all flows
- [ ] Accessibility audit (WCAG 2.1 AA)
- [ ] Performance testing (load time targets)
- [ ] Security penetration test
- [ ] Privacy policy final review
- [ ] Community moderation dry run with founding members
- [ ] Soft launch to founding members for 2-week feedback cycle

### Public Launch — Week 26

---

## 15. Risks & Mitigations

| Risk | Likelihood | Impact | Mitigation |
|------|-----------|--------|------------|
| AI gives harmful health advice | Medium | High | Clinical advisory review of all guardrails; hard escalation limits; conservative defaults |
| Community stays empty post-launch | High | High | 50–100 founding members seeded before launch; weekly prompts; structured post types reduce blank-page friction |
| Under-18 parental consent creates friction that kills teen adoption | Medium | Medium | Make consent flow fast and clear; send a warm, reassuring email to parents; make the teen value prop clear in the consent email |
| Prediction engine inaccurate in early cycles | High (by design) | Medium | Tiered confidence display makes this an expectation, not a failure; honest communication from onboarding |
| Data breach exposes health data | Low | Very High | Application-layer encryption means breach exposes ciphertext only; separate databases reduce blast radius |
| Misinformation spreads in community | Medium | High | Structured post types reduce freeform risk; two-layer moderation; post-level disclaimer; no medical advice framing enforced |
| Legal challenge on under-18 data handling | Low | Very High | Legal review before launch; parental consent records retained; DPDP Act compliance built in from day one |
| Clinical panel unavailable at launch | Low | High | Identify and contract advisors in pre-development phase; treat as a hard launch gate |

---

## 16. Open Questions

These questions require decisions from the team before development begins on the affected features.

| # | Question | Affects | Priority |
|---|---------|---------|---------|
| 1 | Which open-source cycle prediction algorithm will we base our engine on? Needs clinical review. | FR-CYCLE-02 | High |
| 2 | Who are the specific members of the clinical advisory panel? How are they compensated? | FR-AI-04, FR-INSIGHT-02 | High |
| 3 | Who is the legal advisor for DPDP Act review? | Section 8 | High |
| 4 | What is the moderator recruitment and compensation model? Volunteers vs. paid? | FR-COMM-06, Section 11 | High |
| 5 | What is the process for updating Ask Maitri's system prompt post-launch — is every update re-reviewed by the clinical panel? | Section 12 | Medium |
| 6 | Should cycle prediction display a calendar or a timeline? UX decision needed. | FR-CYCLE-02 | Medium |
| 7 | What is the exact age bracket for "working women" community circles — 25–45, or user-defined? | FR-COMM-01 | Medium |
| 8 | Is Ask Maitri conversation history opt-in or opt-out by default? | FR-VAULT-01 | Medium |
| 9 | How do we handle a user who transitions from the teen bracket to adult (turns 18) mid-use? | FR-AUTH-01, FR-COMM-01 | Low |
| 10 | What languages will the community disclaimer be shown in at launch? English only, or bilingual? | Section 11.4 | Low |

---

*This document is a living PRD and will be updated as decisions are made on open questions, as clinical and legal reviews are completed, and as user research informs changes to scope or requirements. Version history should be maintained in the project repository.*

---

**Document Owner:** Maitri Product Team  
**Last Updated:** February 26, 2026  
**Next Review:** Upon completion of Pre-Development Gates
