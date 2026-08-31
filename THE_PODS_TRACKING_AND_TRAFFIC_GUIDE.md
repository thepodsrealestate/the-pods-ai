# Multi-Channel Ad Tracking & Attribution Implementation Guide
**Prepared for:** Chetan Sharma (Media Buying & Ad Operations)  
**Company:** The Pods Real Estate x Danube Properties  
**System:** The Pods AI Real Estate Operating System  
**Official WhatsApp AI Number:** +44 7404 097586  
**Date:** August 31, 2026  

---

## 1. Overview & How Attribution Works

The Pods AI platform uses a **dual-layer tracking architecture** to capture and attribute every single lead accurately:

1. **Parameter Layer (UTM Parameters):** Captures standard UTM parameters (utm_source, utm_campaign, utm_medium, utm_content, utm_term) when users visit web pages, landing pages, or submit lead forms.
2. **Deep-Link Tag Layer ([SOURCE_TAG]):** Embeds an invisible attribution identifier into the WhatsApp pre-filled message. When a user clicks an ad and sends their first message, our AI backend automatically reads this tag and categorizes the lead into **The Pods Command Center Dashboard** instantly.

---

## 2. Meta Ads (Facebook & Instagram)

### Campaign Type 1: Click-to-WhatsApp Ads (CTWA / Messaging Objective)
* **Objective in Meta Ads Manager:** Engagement -> Messaging Apps -> WhatsApp
* **Destination WhatsApp Business Number:** +44 7404 097586
* **Target Audience:** UK / Greater London (Radius 25km around Knightsbridge)
* **Creative Asset:** Rizwan Sajan & Minesh Patel Video Reel

#### Destination WhatsApp Deep Link:
Copy and paste this exact link into your ad\'s destination / action button:

`	ext
https://wa.me/447404097586?text=Hi%20Aria%2C%20I%20saw%20the%20Danube%20London%20Open%20House%20ad%20with%20Rizwan%20Sajan%20and%20Minesh%20Patel.%20I%20want%20to%20reserve%20a%20VIP%20slot%20for%20Sept%203rd%20[META_CTWA_LONDON]
`

---

### Campaign Type 2: Meta Instant Forms (Lead Generation Objective)
* **Objective in Meta Ads Manager:** Leads -> Instant Forms
* **Form Thank-You Screen:** At the final \'Completion / Thank You\' screen of the form, set the Call to Action button to **\'Chat on WhatsApp\'** or **\'View VIP Availability\'**.

#### Form Completion Button URL:
`	ext
https://wa.me/447404097586?text=Hello!%20I%20just%20filled%20in%20your%20form%20for%20the%20London%20Danube%20Open%20House%20[META_LEAD_FORM]
`

---

### Campaign Type 3: Meta Dynamic URL Parameters (For All Meta Ads)
* **Where to Paste:** At the bottom of the **Ad Level** in Meta Ads Manager, scroll down to the **\'Tracking\'** section and paste this inside the **\'URL Parameters\'** box.

`	ext
utm_source=facebook&utm_medium=cpc&utm_campaign={{campaign.name}}&utm_content={{ad.name}}&utm_term={{adset.name}}
`

---

## 3. Google Ads (Search, Display & Performance Max)

### Option A: Account / Campaign Level Tracking Template
* **Where to Paste:** In Google Ads -> Campaign Settings -> **Additional Settings** -> **Campaign URL Options** -> Paste into **\'Final URL Suffix\'**.

`	ext
utm_source=google&utm_medium=cpc&utm_campaign={campaignid}&utm_content={creative}&utm_term={keyword}&matchtype={matchtype}&device={device}
`

---

### Option B: Google Ad Sitelinks & Callout Extensions (WhatsApp Direct)
* **Where to Use:** For Sitelink extensions labeled *\'Chat on WhatsApp\'* or *\'Book 1-on-1 Consultation\'*.

#### Sitelink Final URL:
`	ext
https://wa.me/447404097586?text=Hello%20Aria%2C%20I%20found%20The%20Pods%20Real%20Estate%20on%20Google.%20I%20want%20more%20details%20on%20Dubai%20off-plan%20properties%20[GADS_SEARCH]
`

---

## 4. TikTok Ads

### Option A: TikTok Dynamic URL Parameters
* **Where to Paste:** In TikTok Ads Manager -> Ad Creation -> **Tracking** -> **URL Parameters**.

`	ext
utm_source=tiktok&utm_medium=cpc&utm_campaign=__CAMPAIGN_NAME__&utm_content=__AID_NAME__&utm_term=__CID_NAME__
`

---

### Option B: Direct WhatsApp Destination Link (Bio & In-Feed Ads)
`	ext
https://wa.me/447404097586?text=Hi%20Aria%2C%20I%20saw%20your%20video%20on%20TikTok%20about%20the%20London%20Danube%20Event%20[TIKTOK_EVENT]
`

---

## 5. Summary Reference Table

| Platform | Campaign Objective | Destination / Placement | Tracking URL / Parameter |
|---|---|---|---|
| Meta (Instagram/FB) | Click-to-WhatsApp (CTWA) | Ad CTA Button | https://wa.me/447404097586?text=...[META_CTWA_LONDON] |
| Meta (Instagram/FB) | Instant Lead Form | Form Thank-You Screen | https://wa.me/447404097586?text=...[META_LEAD_FORM] |
| Meta (Instagram/FB) | All Ads (Tracking Box) | Ad Level URL Parameters | utm_source=facebook&utm_medium=cpc&utm_campaign={{campaign.name}}&utm_content={{ad.name}} |
| Google Ads | Search / Display / PMax | Final URL Suffix | utm_source=google&utm_medium=cpc&utm_campaign={campaignid}&utm_term={keyword} |
| Google Ads | Sitelinks / Callouts | Extension Final URL | https://wa.me/447404097586?text=...[GADS_SEARCH] |
| TikTok Ads | In-Feed / Bio Video Ads | Destination URL | https://wa.me/447404097586?text=...[TIKTOK_EVENT] |

---

## 6. Pre-Launch Quality Assurance (QA) Checklist for Chetan

* [ ] 1. Pause Inactive Campaigns: Verify that \'Danube Open House - London Awareness – Copy\' is paused to avoid budget waste.
* [ ] 2. Verify Destination Phone: Ensure the target WhatsApp number is +44 7404 097586 (The Pods AI Concierge Official Business Number).
* [ ] 3. Test Deep Links: Click each generated link on a mobile device to verify that WhatsApp opens with the pre-filled text and bracketed tag intact.
* [ ] 4. Check Dashboard Telemetry: After launching, monitor https://the-pods-ai.vercel.app/dashboard under Lead Matrix to confirm new leads reflect their exact traffic source automatically.
