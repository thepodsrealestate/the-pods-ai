import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { LeadService } from '@/lib/services/leadService';
import { getCampaignForLead } from '@/lib/config/campaigns';

const VERIFY_TOKEN = process.env.META_WEBHOOK_VERIFY_TOKEN || 'pods_leadgen_secret_2026';
const META_ACCESS_TOKEN = process.env.META_ACCESS_TOKEN || process.env.META_PAGE_ACCESS_TOKEN;

// 1. Meta Webhook Verification
export async function GET(req: NextRequest) {
  const { searchParams } = new URL(req.url);
  const mode = searchParams.get('hub.mode');
  const token = searchParams.get('hub.verify_token');
  const challenge = searchParams.get('hub.challenge');

  if (mode === 'subscribe' && token === VERIFY_TOKEN) {
    return new Response(challenge || '', {
      status: 200,
      headers: {
        'Content-Type': 'text/plain',
      },
    });
  }

  return new Response('Verification failed', { status: 403 });
}

// 2. Meta Inbound Lead Ingestion
export async function POST(req: NextRequest) {
  try {
    const body = await req.json();

    if (body.object !== 'page') {
      return NextResponse.json({ status: 'ignored' }, { status: 200 });
    }

    for (const entry of body.entry || []) {
      for (const change of entry.changes || []) {
        if (change.field === 'leadgen') {
          const leadgenId = change.value?.leadgen_id;

          if (!leadgenId) continue;

          // Fetch full lead details using Meta Graph API
          const metaRes = await fetch(
            `https://graph.facebook.com/v21.0/${leadgenId}?access_token=${META_ACCESS_TOKEN}`
          );
          const leadData = await metaRes.json();

          if (!leadData || leadData.error) {
            console.error('[META GRAPH ERROR]', leadData?.error);
            continue;
          }

          let fullName = 'Meta Lead';
          let phone = '';
          let email = '';
          let budgetMax = 600000;

          for (const field of leadData.field_data || []) {
            const name = field.name?.toLowerCase() || '';
            const val = field.values?.[0] || '';

            if (name.includes('full_name') || name.includes('name')) fullName = val;
            if (name.includes('phone')) phone = val;
            if (name.includes('email')) email = val.toLowerCase().trim();
            if (name.includes('invest') || name.includes('budget')) {
              if (val.includes('200,000')) budgetMax = 200000;
              if (val.includes('600,000')) budgetMax = 600000;
            }
          }

          if (!phone) {
            phone = `+meta_${leadgenId}`;
          }

          // Dynamically resolve active campaign for this lead (auto-expiry built in)
          const matchedCampaign = getCampaignForLead({ phone });
          const isUkPhone = phone.startsWith('+44') || phone.startsWith('44');
          const campaignName = matchedCampaign.type === 'event' ? matchedCampaign.name : 'Meta Instant Form';
          const buyerLocation = matchedCampaign.type === 'event' 
            ? `${matchedCampaign.location.country} (${matchedCampaign.displayName})`
            : (matchedCampaign.timezone === 'Europe/London' ? 'United Kingdom' : (matchedCampaign.id === 'uae-default' ? 'Dubai / UAE' : 'International'));

          // Save / Upsert Lead in Supabase using valid schema keys
          const lead = await LeadService.findOrCreateLead({
            phone,
            fullName,
            leadSource: 'FACEBOOK_ADS',
            attribution: {
              source: 'FACEBOOK_ADS',
              medium: 'cpc',
              campaign: campaignName,
              adId: String(leadgenId),
            },
          });

          // Update Email & Budget Details if available
          if (email || budgetMax || buyerLocation) {
            await prisma.lead.update({
              where: { id: lead.id },
              data: {
                ...(email ? { email } : {}),
                ...(budgetMax ? { budgetMax } : {}),
                buyerLocation,
              },
            });
          }

          // Auto-Sync to Live Google Sheet Master
          const googleSheetWebhook = process.env.GOOGLE_SHEETS_WEBHOOK_URL;
          if (googleSheetWebhook) {
            try {
              await fetch(googleSheetWebhook, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                  timestamp: new Date().toISOString(),
                  leadSource: 'Meta Lead Ad',
                  fullName,
                  phone,
                  email,
                  campaign: isUkPhone ? 'Danube Dubai Expo Leicester (Sept 26-27)' : 'Meta Lead Form',
                  propertyInterest: 'Apartment',
                  budget: budgetMax ? `£${budgetMax.toLocaleString()}` : '£200,000 - £600,000',
                  meetingSlot: isUkPhone ? '26-27 Sept Leicester Marriott' : 'TBD',
                  leadStatus: 'New Lead',
                  assignedAgent: 'Minesh Patel',
                  notes: isUkPhone ? 'Danube Dubai Expo Leicester UK Lead' : 'Meta Instant Form',
                  comments: 'Synced via The Pods AI Engine',
                }),
              });
              console.log(`[GOOGLE SHEET SUCCESS] Synced lead: ${fullName} to Google Sheets`);
            } catch (sheetErr: any) {
              console.error('[GOOGLE SHEET SYNC ERROR]', sheetErr?.message || sheetErr);
            }
          }

          console.log(`[META LEADGEN SUCCESS] Synced lead: ${fullName} (${phone})`);
        }
      }
    }

    return NextResponse.json({ status: 'success' }, { status: 200 });
  } catch (err: any) {
    console.error('[META LEADGEN ERROR]', err?.message || err);
    return NextResponse.json({ status: 'error', error: err?.message || 'Internal error' }, { status: 500 });
  }
}
