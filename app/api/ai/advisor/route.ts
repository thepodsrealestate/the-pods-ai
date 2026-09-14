import { NextResponse } from 'next/server';
import { metaAdsService } from '@/lib/services/metaAdsService';
import { googleAdsService } from '@/lib/services/googleAdsService';

function parseEventDetails(campaignName: string) {
  const name = campaignName || '';
  const cities = ['Leicester', 'London', 'Birmingham', 'Manchester', 'Leeds', 'Newcastle', 'Glasgow', 'Edinburgh', 'Coventry', 'Nottingham', 'Liverpool', 'Bristol', 'Dubai', 'Abu Dhabi', 'Doha', 'Riyadh'];
  const foundCity = cities.find(c => new RegExp(`(^|[^a-zA-Z])${c}([^a-zA-Z]|$)`, 'i').test(name)) || 'UK Event';

  const developers = ['Danube', 'Sobha', 'Damac', 'Emaar', 'Binghatti', 'Aldar', 'Nakheel', 'Ellington', 'Meraas'];
  const foundDev = developers.find(d => new RegExp(`(^|[^a-zA-Z])${d}([^a-zA-Z]|$)`, 'i').test(name)) || 'Danube Properties';

  let eventDates = 'Upcoming';
  let daysUntilEvent: number | null = null;
  const dateMatch = name.match(/(?:Sept|Sep|Oct|Nov|Dec|Jan|Feb|Mar|Apr|May|Jun|Jul|August|Aug)[a-z0-9\-_]*/i) || name.match(/\d{1,2}[-_]\d{1,2}\s*(?:Sept|Sep|Oct|Nov|Dec|Jan|Feb|Mar|Apr|May|Jun|Jul|Aug)/i);
  if (dateMatch) {
    eventDates = dateMatch[0].replace(/_/g, ' ');
  }

  const specificMatch = name.match(/(Sept|Sep|Oct|Nov|Dec|Jan|Feb|Mar|Apr|May|Jun|Jul|Aug)[a-z]*[-_]?(\d{1,2})/i);
  if (specificMatch) {
    const monthStr = specificMatch[1];
    const dayStr = specificMatch[2];
    const currentYear = new Date().getFullYear();
    const eventDate = new Date(`${monthStr} ${dayStr}, ${currentYear}`);
    if (!isNaN(eventDate.getTime())) {
      const diffMs = eventDate.getTime() - Date.now();
      daysUntilEvent = Math.ceil(diffMs / (1000 * 60 * 60 * 24));
    }
  }

  return {
    city: foundCity,
    developer: foundDev,
    eventDates,
    daysUntilEvent,
  };
}

interface AdCreativeInfo {
  adName?: string;
  headline?: string;
  body?: string;
  description?: string;
  format?: 'IMAGE' | 'VIDEO' | 'CAROUSEL' | 'UNKNOWN';
  callToAction?: string;
  imageUrl?: string;
  imageBase64?: string;
}

async function fetchActiveAdCreative(campaignId: string): Promise<AdCreativeInfo | null> {
  const token = process.env.META_ADS_ACCESS_TOKEN;
  if (!token || !campaignId) return null;

  try {
    const adsUrl = `https://graph.facebook.com/v19.0/${campaignId}/ads?fields=id,name,status,effective_status,creative{id,name,title,body,call_to_action_type,image_url,thumbnail_url,video_id,asset_feed_spec}&limit=5&access_token=${token}`;
    const res = await fetch(adsUrl, { cache: 'no-store' });
    if (!res.ok) return null;
    const json = await res.json();
    const activeAd = Array.isArray(json?.data) ? json.data.find((a: any) => a.effective_status === 'ACTIVE') || json.data[0] : null;
    if (!activeAd || !activeAd.creative) return null;

    const cr = activeAd.creative;
    const feed = cr.asset_feed_spec;
    const headline = feed?.titles?.[0]?.text || cr.title || cr.name || '';
    const body = feed?.bodies?.[0]?.text || cr.body || '';
    const description = feed?.descriptions?.[0]?.text || '';
    const callToAction = feed?.call_to_actions?.[0]?.type || cr.call_to_action_type || 'SIGN_UP';
    const isVideo = !!cr.video_id || (Array.isArray(feed?.videos) && feed.videos.length > 0);
    const format = isVideo ? 'VIDEO' : 'IMAGE';

    let imageUrl = cr.image_url || cr.thumbnail_url;
    let imageBase64: string | undefined = undefined;

    // Fetch high-res image if hash is available
    if (Array.isArray(feed?.images) && feed.images.length > 0) {
      const hash = feed.images[0].hash;
      const account = (process.env.META_AD_ACCOUNT_ID || '').startsWith('act_') ? process.env.META_AD_ACCOUNT_ID : `act_${process.env.META_AD_ACCOUNT_ID}`;
      const imgApiUrl = `https://graph.facebook.com/v19.0/${account}/adimages?hashes=${encodeURIComponent(JSON.stringify([hash]))}&fields=url&access_token=${token}`;
      const imgRes = await fetch(imgApiUrl, { cache: 'no-store' }).catch(() => null);
      if (imgRes && imgRes.ok) {
        const imgJson = await imgRes.json();
        if (imgJson?.data?.[0]?.url) {
          imageUrl = imgJson.data[0].url;
        }
      }
    }

    // Download image buffer for OpenAI multimodal vision
    if (imageUrl) {
      try {
        const fetchImg = await fetch(imageUrl);
        if (fetchImg.ok) {
          const buffer = await fetchImg.arrayBuffer();
          imageBase64 = Buffer.from(buffer).toString('base64');
        }
      } catch (err) {
        console.warn('Could not download creative image for vision model:', err);
      }
    }

    return {
      adName: activeAd.name,
      headline,
      body,
      description,
      format,
      callToAction,
      imageUrl,
      imageBase64,
    };
  } catch (error) {
    console.warn('Error fetching active ad creative:', error);
    return null;
  }
}

export async function POST(req: Request) {
  try {
    const body = await req.json();
    const { query, period = 'last_30d', leadContext } = body;

    if (!query || typeof query !== 'string') {
      return NextResponse.json({ error: 'Query parameter is required' }, { status: 400 });
    }

    // 1. Fetch live metrics and campaign-level data in parallel
    const [meta, google, metaCampaigns, googleCampaigns] = await Promise.all([
      metaAdsService.getMetrics(period),
      googleAdsService.getMetrics(period),
      metaAdsService.getCampaigns(period),
      googleAdsService.getCampaigns(period),
    ]);

    const totalSpend = parseFloat((meta.spendAed + google.spendAed).toFixed(2));
    const totalLeads = meta.leads + google.leads;
    const overallCpl = totalLeads > 0 ? (totalSpend / totalLeads).toFixed(2) : (meta.clicks + google.clicks > 0 ? (totalSpend / (meta.clicks + google.clicks)).toFixed(2) : '0');

    // 2. Identify ACTIVE campaigns dynamically
    const allCampaigns = [...(metaCampaigns || []), ...(googleCampaigns || [])];
    const activeCampaigns = allCampaigns.filter((c: any) => c.status === 'Active');
    const pausedCampaigns = allCampaigns.filter((c: any) => c.status !== 'Active');

    // 3. Disambiguate if user is asking about a specific campaign by name, ID, or keywords
    const queryLower = query.toLowerCase();
    const sortedCampaignsByLen = [...allCampaigns].sort((a, b) => (b.campaignName?.length || 0) - (a.campaignName?.length || 0));
    
    let targetCampaign: any = null;
    
    // Direct campaign ID match
    targetCampaign = allCampaigns.find(c => c.campaignId && query.includes(c.campaignId));

    // Exact or partial campaign name match (longest string first so 'leads 2' matches before prefix)
    if (!targetCampaign) {
      for (const c of sortedCampaignsByLen) {
        if (c.campaignName && queryLower.includes(c.campaignName.toLowerCase())) {
          targetCampaign = c;
          break;
        }
      }
    }

    // Suffix / alias matching (e.g. "leads 2", "campaign 2", "second campaign", "ad 2")
    if (!targetCampaign) {
      if (queryLower.includes('leads 2') || queryLower.includes('campaign 2') || queryLower.includes('second campaign') || queryLower.includes('2nd campaign') || queryLower.includes('ad 2')) {
        targetCampaign = allCampaigns.find(c => c.campaignName?.toLowerCase().includes('leads 2') || c.campaignName?.toLowerCase().endsWith(' 2'));
      } else if (queryLower.includes('leads 1') || queryLower.includes('campaign 1') || queryLower.includes('first campaign') || queryLower.includes('1st campaign') || queryLower.includes('ad 1')) {
        targetCampaign = allCampaigns.find(c => !c.campaignName?.toLowerCase().includes('leads 2') && (c.campaignName?.toLowerCase().includes('sept26-27') || c.campaignName?.toLowerCase().includes('leicester')));
      }
    }

    // 4. Fetch active ad creatives in parallel
    const campaignsToFetch = targetCampaign && targetCampaign.campaignId
      ? [targetCampaign, ...activeCampaigns.filter((c: any) => c.campaignId !== targetCampaign.campaignId)].slice(0, 3)
      : activeCampaigns.slice(0, 3);

    const creativesWithCampaigns = await Promise.all(
      campaignsToFetch.map(async (c: any) => ({
        campaign: c,
        creative: await fetchActiveAdCreative(c.campaignId),
      }))
    );

    const primaryTargetItem = targetCampaign
      ? creativesWithCampaigns.find(item => item.campaign.campaignId === targetCampaign.campaignId) || creativesWithCampaigns[0]
      : creativesWithCampaigns[0];

    const activeCreative = primaryTargetItem?.creative || null;

    let activeCampaignsSummary = '';
    if (activeCampaigns.length > 0) {
      activeCampaignsSummary = activeCampaigns.map((c: any) => {
        const details = parseEventDetails(c.campaignName);
        const daysText = details.daysUntilEvent !== null
          ? (details.daysUntilEvent > 0 ? `${details.daysUntilEvent} days remaining` : `${Math.abs(details.daysUntilEvent)} days ago (past)`)
          : 'Event countdown in progress';

        return `ACTIVE CAMPAIGN: "${c.campaignName}" (${c.platform.toUpperCase()})
- Delivery Status: ACTIVE & DELIVERING
- Target Market / City: ${details.city}
- Featured Developer: ${details.developer} (1% monthly payment plan, high rental yield, UAE Golden Visa)
- Event Date Window: ${details.eventDates} (${daysText})
- Live Spend: AED ${c.spend.toLocaleString()}
- Live Clicks: ${c.clicks}
- Live Impressions: ${c.impressions.toLocaleString()}
- Live CTR: ${c.ctr}% (Benchmark for UK-to-Dubai: 1.2% - 2.2%)
- Live CPC: AED ${c.cpc} (Benchmark: AED 4.50 - 8.50)
- Inbound Form Leads: ${c.leads}
- Current CPL: ${c.leads > 0 ? `AED ${c.cpl}` : '0 leads captured yet (Conversion rate 0.0%)'}`;
      }).join('\n\n');
    } else {
      activeCampaignsSummary = 'No campaign is currently delivering (all campaigns are paused or ended).';
    }

    let creativeSection = '';
    if (creativesWithCampaigns.length > 0) {
      const creativeDescriptions = creativesWithCampaigns
        .filter(item => item.creative)
        .map(item => {
          const cr = item.creative!;
          const isTarget = targetCampaign && item.campaign.campaignId === targetCampaign.campaignId;
          return `CAMPAIGN: "${item.campaign.campaignName}" (${item.campaign.platform.toUpperCase()})${isTarget ? ' [PRIMARY TARGET OF USER QUERY]' : ''}
- Ad Name: "${cr.adName || 'Active Ad'}"
- Media Format: ${cr.format} (${cr.format === 'IMAGE' ? 'Static Graphic Image Flyer (Zero video motion)' : 'Video Creative'})
- Live Headline / Title: "${cr.headline}"
- Live Description: "${cr.description}"
- Live Primary Text (Ad Copy): "${cr.body}"
- Call To Action Button: "${cr.callToAction}"
- Computer Vision Status: ${cr.imageBase64 ? 'Active ad image attached directly to this prompt via multimodal vision. Analyze the actual image pixels, text hierarchy, and aesthetics.' : 'Image metadata loaded.'}`;
        })
        .join('\n\n');

      creativeSection = `
ACTIVE AD CREATIVE DETAILS (INSPECTED LIVE VIA META GRAPH API):
${creativeDescriptions}
${targetCampaign ? `\nUSER SPECIFIC FOCUS: The user specifically asked about campaign "${targetCampaign.campaignName}". Direct your primary analysis, visual critique, and diagnosis specifically to this campaign's creative and metrics!` : ''}
`;
    }

    let leadPromptSection = '';
    if (leadContext) {
      leadPromptSection = `
ACTIVE LEAD IN FOCUS:
- Name: ${leadContext.fullName || 'Unknown'}
- Phone: ${leadContext.phone || 'Unknown'}
- Budget: AED ${leadContext.budgetMax ? leadContext.budgetMax.toLocaleString() : 'Undisclosed'}
- Location Interest: ${leadContext.buyerLocation || 'Undisclosed'}
- Status: ${leadContext.status || 'NEW'}
- AI Enabled: ${leadContext.aiEnabled ? 'Yes' : 'No'}
`;
    }

    const systemPrompt = `You are the Chief Marketing Officer (CMO) & Senior Real Estate Performance Marketing Director for "The Pods Real Estate" Dubai, advising Minesh Patel (CEO) and his team.

TODAY'S DATE: ${new Date().toLocaleDateString('en-GB', { day: 'numeric', month: 'long', year: 'numeric' })}
SELECTED DASHBOARD TIMEFRAME: ${period.toUpperCase().replace('_', ' ')}

CURRENT LIVE CAMPAIGNS IN DELIVERING STATE:
${activeCampaignsSummary}
${creativeSection}

HISTORICAL / PAUSED CAMPAIGNS SUMMARY:
- Paused Campaigns: ${pausedCampaigns.length} total (e.g. UK_LONDON_EVENT_SEPT03_META, Danube Open House, Breez by Danube, Feb Events)
- Lifetime Account Spend: AED ${totalSpend.toLocaleString()} | Leads: ${totalLeads} | Overall CPL: AED ${overallCpl}

DUBAI REAL ESTATE UK-EXPATS PERFORMANCE BENCHMARKS:
1. CTR (Click-Through Rate):
   - Healthy: >= 1.2%
   - Underperforming: < 1.0% (Root Cause: static flyer fatigue, lack of video walkthrough, weak hook on Danube 1% payment plan).
2. CPC (Cost Per Click):
   - Target: AED 4.50 - 8.00 (£1.00 - £1.75).
   - High: > AED 9.00 (Root Cause: audience too narrow or general competition; expand to UK Midlands investor / NRI clusters).
3. Form Conversion (Click-to-Lead):
   - Target: 8% - 14% of ad clicks should convert to instant form leads.
   - Warning (e.g. 16+ clicks and 0 leads): High form friction, too many pre-qualifying questions, or lack of immediate incentive (e.g. free VIP event pass, floorplan catalog).
4. CPL (Cost Per Lead):
   - Target for UK Property Expos: AED 120 - 220 (£25 - £45).

YOUR ROLE & TONE:
- You are a strategic advisor with computer vision capabilities. If asked about the creative, critique the attached image, the headline, the format (static vs video), and copy.
- Dissect the ACTIVE campaign's health, diagnose why numbers are where they are, and provide 3 concrete tactical recommendations.
- Keep the tone direct, authoritative, commercially astute, and tailored to UK-to-Dubai property exhibitions.
- Do NOT use markdown headers (###). Format answer in clean paragraphs. Do not use emojis.

OUTPUT FORMAT:
Return a valid JSON object with:
- "answer": A 2-3 paragraph strategic analysis addressing Minesh's query with active campaign diagnosis, creative critique, root-cause insight, and market context.
- "bullets": An array of exactly 3 concise, high-impact tactical recommendations.`;

    const apiKey = process.env.OPENAI_API_KEY;

    if (!apiKey || apiKey === 'dummy_key' || apiKey.includes('placeholder')) {
      const campName = targetCampaign?.campaignName || activeCampaigns[0]?.campaignName || 'Danube_DubaiExpo_Leicester_Sept26-27';
      const head = activeCreative?.headline || 'Dubai Property Expo';
      return NextResponse.json({
        success: true,
        answer: `Your active campaign ${campName} is using an ad titled "${head}".`,
        bullets: [
          `Deploy a 15-second vertical video reel featuring Danube's 1% payment plan to replace static visuals.`,
          `Refine ad copy to emphasize the Leicester Marriott Hotel venue for higher local relevance.`,
          `Streamline instant form fields to eliminate drop-off.`,
        ],
      });
    }

    const userMessageContent: any[] = [{ type: 'text', text: query }];

    if (primaryTargetItem?.creative?.imageBase64) {
      userMessageContent.push({
        type: 'image_url',
        image_url: { url: `data:image/jpeg;base64,${primaryTargetItem.creative.imageBase64}` },
      });
    } else {
      for (const item of creativesWithCampaigns) {
        if (item.creative?.imageBase64) {
          userMessageContent.push({
            type: 'text',
            text: `[Live Ad Image for Campaign: "${item.campaign.campaignName}"]`,
          });
          userMessageContent.push({
            type: 'image_url',
            image_url: { url: `data:image/jpeg;base64,${item.creative.imageBase64}` },
          });
        }
      }
    }

    const aiRes = await fetch('https://api.openai.com/v1/chat/completions', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${apiKey}`,
      },
      body: JSON.stringify({
        model: 'gpt-4o-mini',
        response_format: { type: 'json_object' },
        messages: [
          { role: 'system', content: systemPrompt },
          { role: 'user', content: userMessageContent },
        ],
        temperature: 0.3,
      }),
    });

    if (!aiRes.ok) {
      throw new Error(`OpenAI API returned status ${aiRes.status}`);
    }

    const data = await aiRes.json();
    let parsedContent: any = {};
    try {
      parsedContent = JSON.parse(data.choices[0]?.message?.content || '{}');
    } catch {
      parsedContent = { answer: data.choices[0]?.message?.content || 'Unable to generate analysis.', bullets: [] };
    }

    let answer = parsedContent.answer;
    if (!answer && parsedContent.diagnosis) {
      answer = typeof parsedContent.diagnosis === 'string'
        ? parsedContent.diagnosis
        : (parsedContent.diagnosis.summary || Object.values(parsedContent.diagnosis).join('\n\n'));
    }
    if (!answer) {
      answer = typeof parsedContent === 'string' ? parsedContent : Object.values(parsedContent).find(v => typeof v === 'string') as string || 'Analysis complete.';
    }

    let bullets = parsedContent.bullets || parsedContent.recommendations;
    if (!Array.isArray(bullets) || bullets.length === 0) {
      bullets = [
        `Active Campaign Spend: AED ${meta.spendAed.toLocaleString()} across active channels.`,
        `Review instant form questions to eliminate drop-off before the event date.`,
        `Test video creative showing 1% monthly payment plan to improve CTR.`,
      ];
    }

    return NextResponse.json({
      success: true,
      answer,
      bullets,
    });
  } catch (error: any) {
    console.error('Error in AI Advisor endpoint:', error);
    return NextResponse.json({ error: 'Failed to process AI Advisor query' }, { status: 500 });
  }
}
