# 🏆 The Pods Real Estate — AI Concierge & Command Center

A high-performance luxury real estate AI Concierge system and Command Center dashboard built with Next.js, Prisma, PostgreSQL (Supabase), OpenAI, and ManyChat.

---

## 🔐 1. COMMAND CENTER LOGIN DETAILS
The dashboard is secured by a premium dark-themed passcode screen. 

* **Authorized Email:** `info@thepodsrealestate.ae`
* **Secure Passcode:** `MineshPods0070`

---

## 🎨 2. CUSTOM BRANDING & LOGO
The logo files are loaded directly from the `/public` directory:
* **Dark Background Logo (Light Text):** Put your logo file as `logo_white.jpeg` inside the `/public` folder. 
* **Light Background Logo (Dark Text):** Put your logo file as `logo_black.jpeg` inside the `/public` folder.

*(If the image file is not found, the dashboard displays a elegant gold fallback `P` brand icon to prevent layout breakage).*

---

## 🚀 3. HOW TO DEPLOY TO VERCEL (STEP-BY-STEP)

Since you have set up both **GitHub** (`thepodsrealestate`) and **Vercel**, here is how to push it live:

### Step A: Push code to GitHub
Run these commands in your project terminal:
```bash
git init
git add .
git commit -m "Initialize The Pods AI Concierge & Dashboard"
git remote add origin https://github.com/thepodsrealestate/the-pods-ai.git
git branch -M main
git push -u origin main
```

### Step B: Connect to Vercel
1. Go to your [Vercel Dashboard](https://vercel.com/dashboard) ➔ click **`Add New`** ➔ **`Project`**.
2. Select your imported GitHub repository `the-pods-ai`.
3. In the **`Environment Variables`** section, copy all values from your local `.env` file:
   * `DATABASE_URL` (Supabase connection pooler URL)
   * `DIRECT_URL` (Supabase direct connection URL)
   * `OPENAI_API_KEY` (Your OpenAI API Key)
   * `MANYCHAT_API_TOKEN` (ManyChat Integration Token)
4. Click **`Deploy`**! Vercel will build the project and give you a permanent public URL (e.g. `the-pods-ai.vercel.app`).
5. **Update ManyChat Webhook URL:** Replace your temporary Cloudflare tunnel URL in ManyChat's External Request block with your new Vercel URL:  
   👉 `https://YOUR-SUBDOMAIN.vercel.app/api/webhooks/whatsapp`

---

## 📊 4. MARKETING AD ATTRIBUTION (TRACKING LEADS)

The dashboard includes a **Lead Traffic Source Attribution** widget that tracks which ad campaigns bring in each lead. It is 100% automated:

### Meta Ads (Facebook & Instagram):
* **No links needed!**
* The Meta Ads expert simply selects **WhatsApp** as the destination in Meta Ads Manager.
* Meta automatically passes the **Campaign Name**, **Adset**, and **Ad ID** directly to ManyChat, which our database stores and displays.

### Google Ads & TikTok Ads (Link Tracking):
Provide your ads experts with these one-time tracking templates:
* **Google Ads Target URL:**  
  `https://wa.me/447404097586?text=Hi! I am interested in Dubai Off-Plan Projects. [utm_source=Google_Ads&utm_campaign={campaignid}]`
* **TikTok Ads Target URL:**  
  `https://wa.me/447404097586?text=Hi! I am interested in Dubai Off-Plan Projects. [utm_source=TikTok_Ads&utm_campaign={campaign_name}]`
* **Instagram/Facebook Bio Link:**  
  `https://wa.me/447404097586?text=Hi! I am interested in Dubai Off-Plan Projects. [utm_source=Social_Bio&utm_campaign=profile_link]`

*(ValueTrack parameters like `{campaign_name}` and `{campaignid}` are automatically replaced by Google/TikTok's ad servers for every single click).*

---

## 🛠️ 5. LOCAL DEVELOPMENT
To run the server locally:
```bash
npm install
npx prisma generate
npm run dev
```
Open [http://localhost:3000](http://localhost:3000) to access the console locally.
