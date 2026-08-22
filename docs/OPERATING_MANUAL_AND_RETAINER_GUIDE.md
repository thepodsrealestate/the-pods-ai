# 📘 The Pods AI — Operating Manual & Retainer Maintenance Guide

**Client:** The Pods Real Estate (Minesh Patel & Reshma Patel)  
**System:** Autonomous AI WhatsApp Concierge & Executive Command Center  
**Version:** Production Handover Edition (August 2026)

---

## 🎯 Executive Overview
This guide provides non-technical, step-by-step instructions for managing and updating **The Pods AI System** during monthly retainer operations. Whether adding new developer projects, uploading new PDF brochures, updating pricing, or modifying AI behavior, this manual details every action.

---

## 📑 Table of Contents
1. [How to Command Antigravity to Make Changes Automatically](#1-how-to-command-antigravity-to-make-changes)
2. [How to Add a New Property Project](#2-how-to-add-a-new-property-project)
3. [How to Upload & Connect New PDF Brochures](#3-how-to-upload--connect-new-pdf-brochures)
4. [How to Update Pricing, Payment Plans & Cash Discounts](#4-how-to-update-pricing-payment-plans--cash-discounts)
5. [How to Add a Completely New Developer (e.g. Damac, Emaar, Ellington)](#5-how-to-add-a-new-developer)
6. [How to Monitor Leads & Control AI Takeover in Dashboard](#6-how-to-monitor-leads--control-ai-takeover-in-dashboard)
7. [How to Deploy Changes to Live Server (GitHub & Vercel)](#7-how-to-deploy-changes-to-live-server)
8. [Master Troubleshooting & FAQ](#8-master-troubleshooting--faq)

---

## 1. How to Command Antigravity to Make Changes
You do **not** need to write code manually. You can simply open Antigravity and give plain English prompts.

### 💡 Copy-Paste Prompts for Common Retainer Tasks:

#### Scenario A: Adding a New Project
> *"Add a new Danube project called 'Oasis Towers' located in Business Bay. Studios start from AED 750K, 1-Beds from AED 1.2M. Handover is Dec 2028 with 40/60 plan (0.5% monthly). I have placed `oasis-towers-brochure.pdf` in `knowledge/raw/danube/`."*

#### Scenario B: Updating Project Pricing or Handover
> *"Update the starting price for Binghatti SkyTerraces studio to AED 720K and change the handover date to June 2028."*

#### Scenario C: Adding a New Developer
> *"We are onboarding Emaar. Add Emaar properties with 3 projects: Address Creek Harbour, Emaar South Parkside, and Dubai Hills Park Field. Create the raw folder and update catalog."*

#### Scenario D: Changing VIP Calendar or Desk Location
> *"Update the London office consultation hours in the AI prompt to 10:00 AM – 7:00 PM and update the meeting booking link."*

---

## 2. How to Add a New Property Project

### Step 1: Open the Project Catalog
File path: [`offplan_catalog.json`](file:///c:/Users/USER/Desktop/minesh%20ai%20chatbots%20project/the-pods-ai/knowledge/published/offplan_catalog.json)

### Step 2: Add the Project Block
Find the respective developer array (`Danube Properties`, `Sobha Realty`, or `Binghatti Developers`) and append the new JSON object:

```json
{
  "id": "danube-newproject",
  "projectName": "NEWPROJECT by Danube",
  "location": "Business Bay, Dubai",
  "startingPriceAed": 850000,
  "paymentPlan": "Exclusive Event Offer: 40/60 Payment Plan with 0.5% Monthly Installments",
  "handover": "2029",
  "unitsAvailable": [
    "Studio (from AED 850K)",
    "1-Bed (from AED 1.25M)",
    "2-Bed (from AED 1.85M)"
  ],
  "keyFacts": [
    "Luxury high-rise residential tower in prime Business Bay",
    "Fully furnished Italian interiors with 40+ resort-style amenities",
    "Handover: 2029 | Starting Price: AED 850K"
  ]
}
```

### Step 3: Add to AI Quick-Dictionary
File path: [`aiService.ts`](file:///c:/Users/USER/Desktop/minesh%20ai%20chatbots%20project/the-pods-ai/lib/services/aiService.ts)  
Under the `COMPREHENSIVE PHONETIC & ALIAS DICTIONARY` section, add:
```ts
- "newproject" / "danube newproject" -> NEWPROJECT by Danube (Business Bay | Studios from AED 850K, 1-Beds from AED 1.25M | Handover: 2029 | Plan: 40/60 with 0.5% monthly)
```

---

## 3. How to Upload & Connect New PDF Brochures

### Step 1: Place the Raw File
Save the original developer PDF inside your organized local workspace:
- Danube: `knowledge/raw/danube/newproject-brochure.pdf`
- Sobha: `knowledge/raw/sobha/newproject-brochure.pdf`
- Binghatti: `knowledge/raw/binghatti/newproject-brochure.pdf`

### Step 2: Place in Public Folder
Copy the PDF to `public/brochures/` with a clean filename (e.g. `danube-newproject.pdf`).
*(Note: If file is >50MB, compress it down to ~15–30MB using standard PDF compression so it opens instantly on mobile WhatsApp).*

### Step 3: Add the Link to the AI Prompt
In [`aiService.ts`](file:///c:/Users/USER/Desktop/minesh%20ai%20chatbots%20project/the-pods-ai/lib/services/aiService.ts) under `VERIFIED PROPERTY BROCHURES`, add:
```
- NEWPROJECT (Business Bay): https://the-pods-ai.vercel.app/brochures/danube-newproject.pdf
```

> [!TIP]
> **Automatic Subfolder Scanning:** The brochure router automatically searches root and all developer subfolders (`danube/`, `sobha/`, `binghatti/`). You will never get a 404 broken link.

---

## 4. How to Update Pricing, Payment Plans & Cash Discounts

### Updating Entry Prices & Cash Discounts
1. In `knowledge/published/offplan_catalog.json`: Update `startingPriceAed` and the `unitsAvailable` array.
2. In `lib/services/aiService.ts`: Update the quick-reference line in the alias dictionary.
3. If an upfront cash discount applies (e.g. 6% on full payment), specify both the standard asking price and the net full cash price:
   ```ts
   - "project" -> Project Name (Location | Studio Asking AED 693K, Full Cash AED 651K with 6% discount)
   ```

---

## 5. How to Add a New Developer

To expand beyond Danube, Sobha, and Binghatti (e.g. adding *Damac Properties*):

1. **Create Folder:** Create `knowledge/raw/damac/` and place raw brochures/inventory sheets inside.
2. **Update Catalog:** In `knowledge/published/offplan_catalog.json`, add a new developer object:
   ```json
   {
     "name": "Damac Properties",
     "projects": [ ... ]
   }
   ```
3. **Add Brochure URLs:** Add the PDF files to `public/brochures/` and add the links in `lib/services/aiService.ts`.
4. **Add Geographic / Developer Boundary:** In `aiService.ts`, list the developer under `DEVELOPER BOUNDARIES`.

---

## 6. How to Monitor Leads & Control AI Takeover in Dashboard

### Accessing the Command Center
1. URL: `https://the-pods-ai.vercel.app/dashboard` (or `/login`)
2. **Email:** `info@thepodsrealestate.ae`
3. **Passcode:** `MineshPods0070`

### Key Retainer Features:
* **Leads Tab:** View every lead with real-time intent heat score (Hot, Warm, Cold), budget, and target property.
* **Pause AI & Human Takeover:** Open any lead drawer and click **"Pause AI & Takeover"** to disable bot auto-replies while an agent chats manually. Click **"Resume AI Concierge"** to reactivate the bot.
* **Transcribe Voice Note:** Click **"Transcribe Voice Note"** on any lead to convert inbound WhatsApp audio notes into English text and extract budget/location intelligence via OpenAI Whisper.
* **CSV Export:** Click **"Export CSV"** in the top-right corner to download full CRM records for Minesh and Reshma.

---

## 7. How to Deploy Changes to Live Server

Whenever you make any changes to files, deploy them live using these 3 simple commands in the terminal:

```bash
# 1. Build and verify TypeScript
npm run build

# 2. Commit your changes
git add -A
git commit -m "Update property catalog and add new brochures"

# 3. Push to GitHub (Vercel deploys automatically in ~30 seconds)
git push origin main
```

---

## 8. Master Troubleshooting & FAQ

| Issue | Cause | Solution |
|---|---|---|
| **Brochure shows wrong cover in browser** | Browser cached old PDF tab | Press `Ctrl + Shift + R` or open in Incognito window. |
| **Bot repeats older project details** | User switched topic quickly | Fixed by LATEST message priority rule in prompt. |
| **Large PDF upload fails to GitHub** | File is >100 MB | Compress images in PDF to ~20–30 MB before uploading. |
| **New lead has duplicate phone number** | Same person texted from new channel | LeadService deduplication automatically merges them into one master dossier. |

---

*Curated for The Pods Real Estate Retainer Operations. Powered by Google Antigravity & OpenAI GPT-4o-mini.*
