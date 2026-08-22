# 📖 THE PODS AI — COMPLETE SYSTEM BLUEPRINT & KNOWLEDGE BIBLE

> **CONFIDENTIAL & PROPRIETARY**  
> **Client:** The Pods Real Estate (Minesh Patel & Reshma Patel)  
> **Project:** Autonomous AI WhatsApp Concierge & Executive Command Center  
> **Repository:** `https://github.com/thepodsrealestate/the-pods-ai`  
> **Live Production URL:** `https://the-pods-ai.vercel.app`  
> **Version:** 2.0 Production Handover Edition (August 2026)

---

## 📑 TABLE OF CONTENTS
1. [Executive Summary & Business Context](#1-executive-summary--business-context)
2. [Master Architecture & Technology Stack](#2-master-architecture--technology-stack)
3. [Environment Variables & Security Config](#3-environment-variables--security-config)
4. [Database Schema & Data Architecture](#4-database-schema--data-architecture)
5. [AI WhatsApp Concierge Engine (`aiService.ts`)](#5-ai-whatsapp-concierge-engine)
6. [Universal Brochure Delivery System (`/brochures/[slug]`)](#6-universal-brochure-delivery-system)
7. [Lead Deduplication & Real-Time Sync](#7-lead-deduplication--real-time-sync)
8. [Executive Dashboard & Human Takeover System](#8-executive-dashboard--human-takeover-system)
9. [Audio Voice Note Intelligence (OpenAI Whisper)](#9-audio-voice-note-intelligence)
10. [Full 40-Project Master Knowledge Catalog](#10-full-40-project-master-knowledge-catalog)
11. [Standard Operating Procedures (SOPs) for Maintenance](#11-standard-operating-procedures-sops)
12. [One-Click Prompt for New PC / Future Antigravity Chat](#12-one-click-prompt-for-new-pc--future-antigravity-chat)

---

## 1. EXECUTIVE SUMMARY & BUSINESS CONTEXT

### The Business
**The Pods Real Estate** is a premier luxury real estate advisory firm operating dual headquarters in:
* **Dubai:** The Pods Executive Lounge, Bluewaters Island, Dubai, UAE
* **London:** 14 Curzon Street, Mayfair, London W1J 5HN (Park Lane / Sobha UK Desk)

### Key Stakeholders & Contacts
* **Minesh Patel:** Managing Director & Lead Broker (`+971 52 366 6495` / `info@thepodsrealestate.ae`)
* **Reshma Patel:** Managing Partner (`+971 52 399 9502`)
* **Gopeshwar (Gopesh):** Head of Sobha UK Desk (`+44 7977 773177` / Mayfair Office)
* **Chetan:** Media Buyer & Paid Ads Director (Managing Meta Ads campaigns)
* **Aria:** The AI Luxury Property Concierge persona on WhatsApp (`+44 7404 097586`)

### Business Objectives
1. Automatically qualify incoming Meta Ads and direct WhatsApp leads 24/7 in <3 seconds.
2. Route UK/European leads to the London Park Lane desk (Danube Open Day Sept 3 & Binghatti Roadshow Oct 2026).
3. Route UAE/International leads to the Bluewaters Executive Lounge.
4. Seamlessly deliver verified official developer PDF brochures directly to WhatsApp clients.
5. Book VIP investor consultations on Minesh Patel's Google Calendar (`https://calendar.app.google/xGRVwZCTkrnZCypUA`).
6. Notify Minesh & Reshma via instant email alerts (`info@thepodsrealestate.ae`) whenever a lead qualifies or books a meeting.

---

## 2. MASTER ARCHITECTURE & TECHNOLOGY STACK

```
               ┌────────────────────────────────────────────────────────┐
               │              Inbound WhatsApp Lead / Voice Note        │
               └───────────────────────────┬────────────────────────────┘
                                           │
                                           ▼
               ┌────────────────────────────────────────────────────────┐
               │             ManyChat Automation & Webhook Engine       │
               └───────────────────────────┬────────────────────────────┘
                                           │ POST /api/webhooks/whatsapp
                                           ▼
┌────────────────────────────────────────────────────────────────────────────────────────┐
│                               NEXT.JS 16 APPLICATION (VERCEL)                          │
├────────────────────────────────────────────────────────────────────────────────────────┤
│  1. Webhook Ingestion & Phone Normalization (app/api/webhooks/whatsapp/route.ts)       │
│  2. Lead Deduplication & Conversation Store (lib/services/leadService.ts)              │
│  3. OpenAI Whisper Audio Transcription (lib/services/whisperService.ts)                │
│  4. OpenAI GPT-4o-mini Concierge Logic (lib/services/aiService.ts)                     │
│  5. Universal Recursive Brochure Delivery (app/brochures/[slug]/route.ts)              │
│  6. Real-Time Resend Email Notifications (lib/services/notificationService.ts)         │
│  7. Executive Command Dashboard (app/dashboard/page.tsx)                               │
└──────────────────────────────────────────┬─────────────────────────────────────────────┘
                                           │
                                           ▼
               ┌────────────────────────────────────────────────────────┐
               │         PostgreSQL Database (Supabase / Prisma ORM)     │
               └────────────────────────────────────────────────────────┘
```

### Core Technologies
* **Framework:** Next.js 16 (App Router, Turbopack, TypeScript)
* **Database & ORM:** PostgreSQL on Supabase via Prisma ORM (`v5.22.0`)
* **AI Intelligence:** OpenAI `gpt-4o-mini` (Chat completion) + `whisper-1` (Voice note transcription)
* **Messaging Channel:** WhatsApp Cloud API via ManyChat Webhook Integration
* **Email System:** Resend API / SMTP for real-time lead & meeting notifications
* **Hosting & CDN:** Vercel Global Edge Network with GitHub CI/CD

---

## 3. ENVIRONMENT VARIABLES & SECURITY CONFIG

The application requires these environment variables configured in `.env` (local) and Vercel Project Settings:

```env
# Database Connections
DATABASE_URL="postgresql://user:password@host:6543/postgres?pgbouncer=true"
DIRECT_URL="postgresql://user:password@host:5432/postgres"

# AI Engines
OPENAI_API_KEY="sk-proj-xxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxx"

# Messaging & Webhooks
MANYCHAT_API_TOKEN="xxxxxxxxxxxxxxxxxxxxxxxxxxxx"
MANYCHAT_WEBHOOK_SECRET="thepods_secret_webhook_2026"

# Security & Dashboard Access
DASHBOARD_PIN="260414"
DASHBOARD_SESSION_SECRET="the_pods_super_secret_session_token_minesh_2026"
NEXT_PUBLIC_APP_URL="https://the-pods-ai.vercel.app"

# Email Notifications (Optional / Connected)
RESEND_API_KEY="re_xxxxxxxxxxxxxxxxxxxx"
NOTIFICATION_EMAIL="info@thepodsrealestate.ae"
```

---

## 4. DATABASE SCHEMA & DATA ARCHITECTURE

File location: [`prisma/schema.prisma`](file:///c:/Users/USER/Desktop/minesh%20ai%20chatbots%20project/the-pods-ai/prisma/schema.prisma)

### Key Database Models:
1. **`Lead`**: The master client profile. Contains `fullName`, `phone`, `email`, `buyerLocation`, `budgetMin`, `budgetMax`, `purchasePurpose`, `aiTakeover` (boolean for human handoff), and `qualityScore`.
2. **`Conversation`**: The messaging session thread linked to a `Lead` (One-to-Many). Tracks `status` (ACTIVE, HANDOFF, RESOLVED) and `channel` (WHATSAPP).
3. **`Message`**: Individual chat message. Stores `content`, `senderType` (LEAD vs BOT vs AGENT), `tokensUsed`, and timestamp.
4. **`Booking`**: Meeting scheduled on Google Calendar. Stores `meetingTime`, `location`, `status`, and notes.
5. **`WebhookEvent`**: Raw payload log from ManyChat for debugging and audit trail.

---

## 5. AI WHATSAPP CONCIERGE ENGINE

File location: [`lib/services/aiService.ts`](file:///c:/Users/USER/Desktop/minesh%20ai%20chatbots%20project/the-pods-ai/lib/services/aiService.ts)

### Core Rules Programmed in Aria's Prompt:
1. **Concierge Persona:** Aria, Senior Investment Consultant at The Pods Real Estate. Luxury, polite, direct, and under 60 words per WhatsApp response.
2. **Geographic Routing:**
   * UK/London leads ➔ Invited to Park Lane Mayfair Studio (Danube Open Day Sept 3 / Binghatti Roadshow Oct 2026).
   * UAE/International leads ➔ Invited to Bluewaters Executive Lounge.
3. **Developer Separation:**
   * **Danube:** 13 projects with 40/60 plan (0.5% monthly).
   * **Binghatti:** 11 projects with 20/50/30 plan (6% Cash discount for Titania & Vintage).
   * **Sobha Realty:** 16 projects (Pinnacle & Eden locked to 1 & 2-Bed only).
4. **Strict Budget Adherence:** Never recommend properties above the buyer's budget ceiling.
5. **Human Takeover Respect:** If `lead.aiTakeover === true`, AI stops auto-responding immediately.

---

## 6. UNIVERSAL BROCHURE DELIVERY SYSTEM

File location: [`app/brochures/[slug]/route.ts`](file:///c:/Users/USER/Desktop/minesh%20ai%20chatbots%20project/the-pods-ai/app/brochures/%5Bslug%5D/route.ts)

### How Brochure Delivery Works:
1. Client clicks a brochure link on WhatsApp: `https://the-pods-ai.vercel.app/brochures/danube-bayz101.pdf`.
2. The router searches `public/brochures/` **and all developer subfolders recursively** (`danube/`, `sobha/`, `binghatti/`).
3. If an exact static marketing PDF exists, it streams it directly with `Cache-Control: public, max-age=86400`.
4. If a project has no uploaded PDF yet, the server **dynamically generates an official branded The Pods Real Estate PDF Prospectus** from `offplan_catalog.json` so no link ever 404s!

---

## 7. LEAD DEDUPLICATION & REAL-TIME SYNC

File location: [`lib/services/leadService.ts`](file:///c:/Users/USER/Desktop/minesh%20ai%20chatbots%20project/the-pods-ai/lib/services/leadService.ts)

### Deduplication Logic:
When a lead sends a message, ManyChat may pass a synthetic ID (`+mc_1234567`) or a real phone number (`+918369024183` / `+447404097586`).  
The engine:
* Normalizes all numbers to E.164 standard.
* Matches existing records by phone or email.
* Automatically merges synthetic temporary IDs into the client's verified profile without creating duplicate leads.

---

## 8. EXECUTIVE DASHBOARD & HUMAN TAKEOVER SYSTEM

* **Dashboard URL:** `https://the-pods-ai.vercel.app/dashboard`
* **Access PIN:** `260414`

### 6 Core Dashboard Modules:
1. **Overview:** High-level KPI cards (Total Leads, Response Velocity, Meetings Booked, Active Conversations).
2. **Leads:** Master CRM view. Click any lead to open the **Lead Intelligence Dossier** drawer.
3. **Human Takeover Button:** Toggle **"Pause AI & Takeover"** to stop bot responses while Minesh/Reshma chat manually on WhatsApp. Click **"Resume AI Concierge"** to reactivate.
4. **Conversations:** Full live transcript history of every inbound and outbound message.
5. **Bookings:** Calendar meetings booked with investors.
6. **Analytics & Ad Attribution:** Channel breakdown (WhatsApp Direct, Meta Ads, Instagram).

---

## 9. AUDIO VOICE NOTE INTELLIGENCE

Files: [`lib/services/whisperService.ts`](file:///c:/Users/USER/Desktop/minesh%20ai%20chatbots%20project/the-pods-ai/lib/services/whisperService.ts) and [`app/api/ai/transcribe-voice/route.ts`](file:///c:/Users/USER/Desktop/minesh%20ai%20chatbots%20project/the-pods-ai/app/api/ai/transcribe-voice/route.ts)

### How Voice Notes Are Handled:
1. Inbound WhatsApp voice notes arrive as Amazon S3 URLs from ManyChat (`https://manybot-files.s3.eu-central-1.amazonaws.com/...`).
2. The server downloads the audio buffer and streams it to **OpenAI Whisper (`whisper-1`)**.
3. Whisper converts the spoken voice into written English text.
4. OpenAI `gpt-4o-mini` extracts structured attributes:
   * Budget ceiling
   * Target property / Developer
   * Timeline & buyer location
5. Results display instantly in the dashboard under **WhatsApp Voice Note Intelligence**.

---

## 10. FULL 40-PROJECT MASTER KNOWLEDGE CATALOG

### 🏢 Danube Properties (13 Projects — 40/60 Plan with 0.5% Monthly):
1. **BAYZ 101** (Business Bay) — Studio from AED 1.18M, Handover: June 2028
2. **BAYZ 102** (Business Bay) — Dolce Vita Suites from AED 1.27M – 2.40M, Handover: June 2029
3. **DIAMONDZ** (Uptown JLT) — from AED 1.10M, Handover: Nov 2027
4. **SPARKLZ** (Al Furjan) — from AED 900K, Handover: May 2028
5. **ASPIRZ** (Sports City) — from AED 850K – 879K, Handover: Dec 2028
6. **SPORTZ** (Sports City) — SOLD OUT (Resale from AED 620K), Handover: May 2027
7. **OCEANZ** (Maritime City) — from AED 1.10M – 1.20M, Handover: March 2027
8. **BREEZ** (Maritime City) — from AED 1.25M – 1.30M, Handover: March 2029
9. **SERENZ** (JVC) — Studios from AED 840K, 1-Beds from AED 1.10M, Handover: 2029
10. **TIMEZ** (Silicon Oasis) — Convertible Units from AED 800K – 871K, Handover: Q2 2028
11. **FASHIONZ** (JVT) — FashionTV Branded from AED 850K – 1.51M, Handover: July 2027
12. **GREENZ** (Academic City / DSO) — 1-Beds from AED 1.10M, Villas from AED 3.50M, Handover: Q4 2029
13. **SHAHRUKHZ** (Sheikh Zayed Road) — Commercial Office Suites from AED 1.90M, Handover: 2029

### 🏎️ Binghatti Developers (11 Projects — 20/50/30 Plan):
14. **Skyflame** (Majan) — Studio from AED 585K, 1-Bed from AED 1.15M, Handover: Dec 2027
15. **SkyTerraces** (Motor City) — Studio from AED 680K – 775K, 1-Bed from AED 1.21M, Handover: April 2028
16. **Titania** (Majan) — Studio from AED 679K (Cash: AED 651K), 1-Bed from AED 1.05M (Cash: AED 986K), Handover: Sept 2027
17. **Vintage** (Majan) — Studio from AED 674K, 1-Bed from AED 1.11M (Cash: AED 1.04M), Handover: Sept 2027
18. **Wraith** (Al Jaddaf) — Studio from AED 799K, 1-Bed from AED 1.29M, 2-Bed from AED 2.09M, Handover: Dec 2027
19. **Twilight** (Al Jaddaf) — 1-Bed from AED 1.19M, 2-Bed from AED 1.99M (Cash: AED 1.88M), Handover: Dec 2026
20. **Luxuria** (JVT) — Studio from AED 675K, 1-Bed from AED 935K, Handover: Sept 2027
21. **Etherea** (JVC) — Studio from AED 765K, 1-Bed from AED 960K, Handover: July 2027
22. **Burj Binghatti Jacob & Co** (Business Bay) — Sapphire 2-Beds from AED 8.2M, Handover: Q2 2026
23. **Mercedes-Benz Places (Downtown)** — 2-Bed Pagoda Suites from AED 8.88M – 10.3M, Handover: Feb 2027
24. **Mercedes-Benz Places (Meydan / Binghatti City)** — Studios from AED 1.35M, Handover: Q4 2027

### 🌊 Sobha Realty (16 Projects):
25. **The Pinnacle at Sobha Central** (SZR Jebel Ali) — 1-Bed from AED 1.78M, 2-Bed from AED 2.5M (**1 & 2-Bed ONLY**), Handover: Dec 2030
26. **The Eden at Sobha Central** (SZR Jebel Ali) — 1-Bed from AED 1.52M – 1.83M (**1 & 2-Bed ONLY**), Handover: Dec 2030
27. **The Woods Abode** (Sobha Sanctuary, Dubailand) — from AED 999K – 1.00M, Handover: August 2029
28. **The Willows** (Sobha Sanctuary, Nad Al Sheba) — 4-Bed Garden Villas from AED 3.99M – 4.06M, Handover: August 2029
29. **The Grove** (Sobha Sanctuary, Dubailand) — Luxury Estate Villas from AED 9.32M, Handover: Q3/Q4 2029
30. **River Cove Residences** (Sobha City Abu Dhabi) — Waterfront 1 & 2-Beds from AED 1.31M, Handover: Q4 2029
31. **The Terraces** (Sobha City Abu Dhabi) — 3 & 4-Bed Townhouses from AED 4.96M, Handover: Q4 2029
32. **The Orchard** (Sobha City Abu Dhabi) — Forest Mansions from AED 9.05M, Handover: Q4 2029
33. **Yachtside Marina** (Siniya Island UAQ) — Marina 1 & 2-Beds from AED 1.31M, Handover: June 2029
34. **Palm Grove & Coral Beach** (Siniya Island UAQ) — Beachfront Mansions from AED 5.0M – 16.6M, Handover: 2028
35. **310 Riverside Crescent** (Sobha Hartland II) — from AED 1.50M – 3.42M, Handover: April 2028
36. **320 Riverside Crescent** (Sobha Hartland II) — from AED 1.36M – 2.26M, Handover: July 2027
37. **330 Riverside Crescent** (Sobha Hartland II) — from AED 1.14M – 1.63M, Handover: June 2027
38. **340 Riverside Crescent** (Sobha Hartland II) — from AED 1.75M – 1.98M, Handover: Dec 2027
39. **350 Riverside Crescent** (Sobha Hartland II) — from AED 1.26M – 2.50M, Handover: March 2027
40. **360 Riverside Crescent** (Sobha Hartland II) — from AED 1.50M – 3.46M, Handover: Dec 2027

---

## 11. STANDARD OPERATING PROCEDURES (SOPS)

### SOP 1: How to Add a New Property Project
1. Open [`knowledge/published/offplan_catalog.json`](file:///c:/Users/USER/Desktop/minesh%20ai%20chatbots%20project/the-pods-ai/knowledge/published/offplan_catalog.json) and add the JSON block under the developer array.
2. Open [`lib/services/aiService.ts`](file:///c:/Users/USER/Desktop/minesh%20ai%20chatbots%20project/the-pods-ai/lib/services/aiService.ts) and add the alias in `COMPREHENSIVE PHONETIC & ALIAS DICTIONARY`.
3. Drop the PDF brochure into `public/brochures/` (or `knowledge/raw/[developer]/`).
4. Add the brochure URL under `VERIFIED PROPERTY BROCHURES` in `aiService.ts`.
5. Run: `npm run build && git add -A && git commit -m "Add new project" && git push origin main`.

### SOP 2: How to Modify Pricing or Cash Discounts
1. In `offplan_catalog.json`: Edit `startingPriceAed` and `unitsAvailable`.
2. In `aiService.ts`: Edit the price in the alias dictionary.
3. Run: `npm run build && git add -A && git commit -m "Update pricing" && git push origin main`.

---

## 12. ONE-CLICK PROMPT FOR NEW PC / FUTURE ANTIGRAVITY CHAT

> **COPY AND PASTE THIS ENTIRE PROMPT INTO ANY NEW ANTIGRAVITY CONVERSATION ON ANY PC TO INSTANTLY RESTORE COMPLETE KNOWLEDGE:**

```text
You are Antigravity, lead AI engineer for The Pods Real Estate (the-pods-ai).
Repository: https://github.com/thepodsrealestate/the-pods-ai
Live Production: https://the-pods-ai.vercel.app

SYSTEM OVERVIEW & BUSINESS CONTEXT:
- Client: The Pods Real Estate (Minesh Patel & Reshma Patel).
- Headquarters: The Pods Executive Lounge (Bluewaters Island, Dubai) & 14 Curzon Street (Mayfair, London W1J 5HN / Park Lane).
- WhatsApp Bot: Aria, Luxury Concierge (+44 7404 097586).
- VIP Google Calendar: https://calendar.app.google/xGRVwZCTkrnZCypUA
- Notification Contact: Minesh Patel / info@thepodsrealestate.ae.
- Dashboard Login: `info@thepodsrealestate.ae` / `MineshPods0070`

TECHNICAL ARCHITECTURE:
- Next.js 16 App Router + TypeScript + Tailwind CSS.
- Prisma ORM (v5.22.0) with PostgreSQL (Supabase).
- AI Engines: OpenAI gpt-4o-mini (WhatsApp replies) + OpenAI Whisper whisper-1 (Audio voice note transcription).
- ManyChat Webhook Endpoint: /api/webhooks/whatsapp.
- Brochure Delivery Endpoint: /brochures/[slug] (dynamically scans public/brochures and recursive developer folders: danube/, sobha/, binghatti/).
- Database Models: Lead, Conversation, Message, Booking, WebhookEvent.

CORE GUARDRAILS & BUSINESS RULES:
1. SOBHA ACCURACY: The Pinnacle and The Eden at Sobha Central offer 1 & 2-Bedroom apartments ONLY.
2. BINGHATTI CASH DISCOUNT: 6% Upfront Full Cash Discount specifically applies to Titania, Vintage, and Twilight.
3. DANUBE EVENT OFFER: 40/60 Payment Plan with 0.5% Monthly Installments across all 13 Danube projects.
4. GEOGRAPHIC ROUTING: UK/London leads invited to Park Lane Mayfair Studio (Danube Sept 3 / Binghatti Oct); UAE leads invited to Bluewaters Lounge.
5. BUDGET ADHERENCE: Never recommend properties above buyer's stated budget ceiling.
6. HUMAN TAKEOVER: If lead.aiTakeover is true, AI stops responding immediately.
7. BROCHURES: All 40 projects deliver verified official PDF links from https://the-pods-ai.vercel.app/brochures/[slug].pdf.

I am ready to manage, update, or expand The Pods AI system with you. Let me know what changes we need to make today!
```

---

*This blueprint represents the complete, definitive technical knowledge base for The Pods AI. Keep this document stored safely.*
