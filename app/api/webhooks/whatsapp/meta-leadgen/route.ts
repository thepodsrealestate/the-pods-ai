import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { LeadService } from '@/lib/services/leadService';

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

          // Save / Upsert Lead in Supabase using valid schema keys
          const lead = await LeadService.findOrCreateLead({
            phone,
            fullName,
            leadSource: 'FACEBOOK_ADS',
            attribution: {
              source: 'FACEBOOK_ADS',
              medium: 'cpc',
              campaign: 'Meta Instant Form',
              adId: String(leadgenId),
            },
          });

          // Update Email & Budget Details if available
          if (email || budgetMax) {
            await prisma.lead.update({
              where: { id: lead.id },
              data: {
                ...(email ? { email } : {}),
                ...(budgetMax ? { budgetMax } : {}),
                buyerLocation: 'International',
              },
            });
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
