import { NextRequest, NextResponse, after } from 'next/server';
import { AIService } from '@/lib/services/aiService';
import { prisma } from '@/lib/prisma';
import { LeadService } from '@/lib/services/leadService';
import { MessageService } from '@/lib/services/messageService';
import { NotificationService } from '@/lib/services/notificationService';
import { CalendarService } from '@/lib/services/calendarService';
import { WhisperService } from '@/lib/services/whisperService';
import { LeadStatus } from '@prisma/client';

// Sliding Window Rate Limiter (tracks phone -> request timestamps)
const requestTracker = new Map<string, number[]>();

// In-Flight and Recent Request Deduplication Locks (prevents concurrent ManyChat double-execution)
const inFlightRequests = new Map<string, { timestamp: number; responsePromise: Promise<any> }>();
const recentCompletedResponses = new Map<string, { timestamp: number; response: any }>();

function checkRateLimit(identifier: string, limit: number = 10, windowMs: number = 60000): boolean {
  const now = Date.now();
  const timestamps = (requestTracker.get(identifier) || []).filter((ts) => now - ts < windowMs);
  
  if (timestamps.length >= limit) {
    return false;
  }
  
  timestamps.push(now);
  requestTracker.set(identifier, timestamps);
  return true;
}

export async function POST(req: NextRequest) {
  const startTime = Date.now();
  try {
    const body = await req.json();

    // 1. Check if this is a direct Meta Lead Ad Webhook Event
    if (body.object === 'page' || body.entry?.[0]?.changes?.[0]?.field === 'leadgen') {
      const leadgenChange = body.entry?.[0]?.changes?.[0]?.value;
      const leadgenId = leadgenChange?.leadgen_id;
      const formId = leadgenChange?.form_id;

      console.log(`[META LEADGEN EVENT RECEIVED] Leadgen ID: ${leadgenId}, Form ID: ${formId}`);

      // Process Meta Lead in background and return 200 immediately to Meta
      after(async () => {
        if (!leadgenId) return;
        try {
          const pageToken = process.env.META_ADS_ACCESS_TOKEN || process.env.META_PAGE_ACCESS_TOKEN || process.env.META_ACCESS_TOKEN;
          if (pageToken) {
            const res = await fetch(`https://graph.facebook.com/v26.0/${leadgenId}?access_token=${pageToken}`);
            const leadData = await res.json();
            
            if (leadData?.field_data) {
              let fullName = 'Meta Lead';
              let phone = '';
              let email = '';

              leadData.field_data.forEach((field: { name: string; values: string[] }) => {
                const val = field.values?.[0] || '';
                if (field.name.includes('name')) fullName = val;
                if (field.name.includes('phone')) phone = val;
                if (field.name.includes('email')) email = val.toLowerCase().trim();
              });

              if (phone) {
                const lead = await LeadService.findOrCreateLead({
                  phone,
                  fullName,
                  leadSource: 'FACEBOOK_ADS',
                  attribution: {
                    source: 'FACEBOOK_ADS',
                    medium: 'cpc',
                    campaign: 'Meta London Event Form',
                    adId: String(formId || leadgenId || ''),
                  },
                });

                if (email && lead.id) {
                  await prisma.lead.update({
                    where: { id: lead.id },
                    data: { email },
                  });
                }
                console.log(`[META LEAD SAVED] Successfully captured ${fullName} (${phone})`);
              }
            }
          }
        } catch (leadFetchErr: any) {
          console.error('[META LEADGEN ERROR]', leadFetchErr?.message || leadFetchErr);
        }
      });

      return NextResponse.json({ status: 'success', event: 'meta_leadgen_received' }, { status: 200 });
    }

    // 2. ManyChat Webhook Secret Verification (if MANYCHAT_WEBHOOK_SECRET is set)
    const secretHeader = req.headers.get('x-manychat-secret') || req.headers.get('authorization');
    const expectedSecret = process.env.MANYCHAT_WEBHOOK_SECRET;
    if (expectedSecret && secretHeader !== expectedSecret && secretHeader !== `Bearer ${expectedSecret}`) {
      console.warn('[SECURITY] Webhook signature mismatch');
      return NextResponse.json({ status: 'unauthorized', error: 'Invalid webhook authorization' }, { status: 401 });
    }

    let rawPhone = body.opt_in_phone || body.whatsapp_phone || body.phone || body.phone_number || body.user_phone || body.contact_phone || body.from || body.custom_fields?.phone || body.custom_fields?.whatsapp_phone;
    if (typeof rawPhone === 'string' && (rawPhone.includes('{{') || rawPhone.trim() === '' || rawPhone === 'unknown')) {
      rawPhone = undefined;
    }

    const cleanField = (val: any): string => {
      if (typeof val !== 'string') return '';
      const trimmed = val.trim();
      if (
        trimmed.includes('{{') || 
        trimmed.includes('}}') || 
        trimmed.toLowerCase() === 'undefined' || 
        trimmed.toLowerCase() === 'null' || 
        trimmed.toLowerCase() === 'unknown'
      ) {
        return '';
      }
      return trimmed;
    };

    const rawFirstName = cleanField(body.first_name);
    const rawLastName = cleanField(body.last_name);
    const rawFullName = cleanField(body.name || body.full_name || body.sender_name || body.user_name || body.custom_fields?.name);

    let senderName = "VIP Client";
    if (rawFirstName && rawLastName) {
      senderName = `${rawFirstName} ${rawLastName}`;
    } else if (rawFirstName) {
      senderName = rawFirstName;
    } else if (rawFullName) {
      senderName = rawFullName;
    }

    const subscriberId = body.id || body.subscriber_id || body.user_id || body.contact_id;
    const nameSlug = senderName.toLowerCase().replace(/[^a-z0-9]/g, '');
    const phone = rawPhone || (subscriberId ? `+mc_${subscriberId}` : (nameSlug && nameSlug !== 'vipclient' ? `+lead_${nameSlug}` : `+lead_guest`));
    let userText = body.last_input_text || body.payload?.text || body.text || body.message || "";

    // Audio / Voice Note Detection & Automatic OpenAI Whisper Transcription
    const audioUrl = body.voice_url || body.audio_url || body.media_url || body.file_url || body.last_media_url || body.last_input_url || body.last_media || body.media || body.payload?.url || body.custom_fields?.voice_url || body.custom_fields?.audio_url;
    if (audioUrl && typeof audioUrl === 'string' && audioUrl.startsWith('http') && (!userText || userText === "Hi" || userText.toLowerCase().includes("voice") || userText.toLowerCase().includes("audio") || userText.toLowerCase().includes("media") || userText.trim().length < 5)) {
      try {
        const transcribed = await WhisperService.transcribeAudio(audioUrl);
        if (transcribed && transcribed.trim()) {
          userText = transcribed.trim();
          console.log(`[WHISPER VOICE NOTE TRANSCRIBED] "${userText}"`);
        }
      } catch (audioErr: any) {
        console.error('Audio Transcription Error:', audioErr?.message || audioErr);
      }
    }

    // Form field extraction from WhatsApp text payload
    let extractedFormName: string | undefined = undefined;
    let extractedFormEmail: string | undefined = undefined;
    let extractedFormPhone: string | undefined = undefined;

    const nameMatch = userText.match(/(?:full\s*name|name):\s*([^\n\r,]+)/i);
    if (nameMatch && nameMatch[1] && nameMatch[1].trim().length > 1) {
      extractedFormName = nameMatch[1].trim();
      senderName = nameMatch[1].trim();
    }

    const emailMatch = userText.match(/[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}/);
    if (emailMatch && emailMatch[0]) {
      extractedFormEmail = emailMatch[0].toLowerCase().trim();
    }

    const phoneMatch = userText.match(/(?:phone\s*number|phone|mobile):\s*([+\d\s()-]{7,})/i);
    if (phoneMatch && phoneMatch[1] && phoneMatch[1].trim().length > 6) {
      extractedFormPhone = phoneMatch[1].replace(/[^\d+]/g, '').trim();
    }

    console.log(`[FAST] ${senderName} (${phone}): "${userText}"`);

    if (!phone || phone === "unknown") {
      return NextResponse.json({ status: 'error', reply: 'Welcome to The Pods Real Estate! How can I help?' });
    }

    // Rate Limiting (max 10 requests per minute per phone number)
    if (!checkRateLimit(phone, 10, 60000)) {
      console.warn(`[RATE LIMIT] Throttled ${phone}`);
      return NextResponse.json({
        status: 'rate_limited',
        reply: 'Thank you for contacting The Pods Real Estate. Our team is preparing your details.',
      }, { status: 429 });
    }

    let normalizedPhone = phone;
    try {
      normalizedPhone = LeadService.normalizePhone(phone, senderName);
    } catch (_) { /* fallback to raw phone */ }

    const now = Date.now();
    const textSnippet = userText.trim().toLowerCase().substring(0, 30).replace(/[^a-z0-9]/g, '');
    const dedupKey = `${normalizedPhone}_${textSnippet}`;

    // 1. Distributed Database-Level Atomic Idempotency Lock (PostgreSQL ACID)
    // Prevents parallel Vercel Serverless Lambdas from ever processing the exact same message concurrently
    const timeBucket = Math.floor(Date.now() / 8000); // 8-second idempotency window
    const distributedLockKey = `LOCK_${normalizedPhone}_${textSnippet}_${timeBucket}`;

    try {
      await prisma.webhookEvent.create({
        data: {
          eventId: distributedLockKey,
          eventType: 'INBOUND_WHATSAPP_LOCK',
          payload: { phone: normalizedPhone, textSnippet, timeBucket },
        }
      });
      // Fire-and-forget async cleanup of old locks (>2 hours)
      prisma.webhookEvent.deleteMany({
        where: { createdAt: { lt: new Date(Date.now() - 7200000) } }
      }).catch(() => {});
    } catch (lockErr: any) {
      console.log(`[DISTRIBUTED DB LOCK BLOCKED] Duplicate concurrent webhook call rejected for ${distributedLockKey}`);
      return NextResponse.json({
        status: 'dedup_suppressed',
        reply: '', // Strictly send empty reply to prevent duplicate outbound messages
      });
    }

    // 2. In-Memory Level Fast Cache
    const recent = recentCompletedResponses.get(dedupKey);
    if (recent && now - recent.timestamp < 6000) {
      console.log(`[DEDUP] In-memory duplicate request from ${normalizedPhone} within 6s — returning cached response`);
      return NextResponse.json(recent.response);
    }

    const processExecution = async () => {
      let conversationHistory: { sender: string; text: string }[] = [];
      let existingLead: any = null;
      try {
        const searchConditions: any[] = [{ phone: normalizedPhone }, { phone }];
        if (extractedFormPhone) {
          searchConditions.push({ phone: extractedFormPhone });
        }
        if (extractedFormEmail) {
          searchConditions.push({ email: { equals: extractedFormEmail, mode: 'insensitive' } });
        }
        if (senderName && senderName !== 'VIP Client' && senderName !== 'Guest') {
          searchConditions.push({ fullName: { equals: senderName, mode: 'insensitive' } });
        }

        existingLead = await prisma.lead.findFirst({
          where: { OR: searchConditions },
          include: {
            conversations: {
              orderBy: { updatedAt: 'desc' },
              take: 1,
              include: {
                messages: {
                  take: 100,
                  orderBy: { createdAt: 'desc' },
                },
              },
            },
          },
        });

        if (existingLead && existingLead.conversations.length > 0) {
          const recentMsgs = existingLead.conversations[0].messages.slice(0, 10);
          const rawMsgs = [...recentMsgs].reverse();
          conversationHistory = rawMsgs.map((m: any) => ({
            sender: m.senderType === 'LEAD' ? 'LEAD' : 'AI',
            text: m.content,
          }));
        }

        // CRITICAL: If AI is toggled OFF for this lead, save the message but DO NOT generate AI reply
        if (existingLead && existingLead.aiEnabled === false) {
          console.log(`[AI-OFF] AI disabled for ${existingLead.fullName || phone} — saving message only, no AI reply`);
          after(async () => {
            try {
              await logToDatabase(body, userText, senderName, normalizedPhone, { reply: '', action: 'NONE', language: 'en' });
            } catch (err: any) { console.error('[BG-LOG] Error:', err.message); }
          });
          return {
            status: 'success',
            reply: '',
            ai_reply: '',
            text: '',
            action: 'AI_DISABLED',
            language: 'en',
            latency_ms: Date.now() - startTime,
          };
        }
      } catch (histErr) {
        console.warn('[CONTEXT] History lookup warning:', histErr);
      }

      let adSource = 'ORGANIC';
      let campaignName = '';
      const utmSource = body.utm_source || body.source || body.custom_fields?.utm_source || body.custom_fields?.source;
      const utmCampaign = body.utm_campaign || body.campaign_name || body.custom_fields?.utm_campaign;
      const userTextLower = userText.toLowerCase();

      if (utmSource) {
        const srcUpper = String(utmSource).toUpperCase();
        adSource = srcUpper.includes('GOOGLE') ? 'GOOGLE_ADS' : (srcUpper.includes('FACEBOOK') || srcUpper.includes('INSTAGRAM') || srcUpper.includes('META')) ? 'META_ADS' : 'ORGANIC';
        campaignName = utmCampaign || '';
      } else if (body.campaign_id || body.ad_id) {
        adSource = 'FACEBOOK_ADS';
        campaignName = utmCampaign || 'Meta Ad Campaign';
      } else if (userText.includes('[GADS]') || userText === 'Can I get more info on this?' || userText === 'Hello! Can I get more info on this?' || (userTextLower.includes('can i get more info') && conversationHistory.length === 0)) {
        adSource = 'GOOGLE_ADS';
        campaignName = 'Google Display Campaign';
      } else if (
        userText.includes('[META]') || 
        userText.includes('[FB]') || 
        userText.includes('[IG]') || 
        userTextLower.includes('filled in your form') || 
        userTextLower.includes('filled out your form') || 
        userTextLower.includes('looking to invest in dubai property')
      ) {
        adSource = 'META_ADS';
        campaignName = 'Meta London Event Form';
      }

      const aiResult = await AIService.generateResponse({
        leadName: senderName || existingLead?.fullName || undefined,
        buyerLocation: existingLead?.buyerLocation || undefined,
        purchasePurpose: existingLead?.purchasePurpose || undefined,
        budgetMin: existingLead?.budgetMin || undefined,
        budgetMax: existingLead?.budgetMax || undefined,
        timeline: existingLead?.timeline || undefined,
        adSource,
        campaignName,
        conversationHistory,
        userMessage: userText,
      });

      const latency = Date.now() - startTime;
      console.log(`[FAST] AI replied in ${latency}ms: "${aiResult.reply.substring(0, 80)}..."`);

      after(async () => {
        try {
          await logToDatabase(body, userText, senderName, normalizedPhone, aiResult);
        } catch (err: any) {
          console.error('[BG-LOG] Async logging error:', err.message);
        }
      });

      return {
        status: 'success',
        reply: aiResult.reply,
        ai_reply: aiResult.reply,
        text: aiResult.reply,
        action: aiResult.action || 'NONE',
        language: aiResult.language || 'en',
        latency_ms: latency,
      };
    };

    const executionPromise = processExecution();
    inFlightRequests.set(dedupKey, { timestamp: now, responsePromise: executionPromise });

    try {
      const responsePayload = await executionPromise;
      recentCompletedResponses.set(dedupKey, { timestamp: Date.now(), response: responsePayload });
      return NextResponse.json(responsePayload);
    } finally {
      inFlightRequests.delete(dedupKey);
    }
  } catch (error: any) {
    console.error('Webhook Error:', error.message);
    return NextResponse.json({
      status: 'error',
      reply: 'Welcome to The Pods Real Estate! Send us a message and our luxury property specialist will assist you shortly.',
    });
  }
}

async function logToDatabase(body: any, userText: string, senderName: string, phone: string, aiResult: any) {
  try {
    const { prisma } = await import('@/lib/prisma');
    const { LeadService } = await import('@/lib/services/leadService');
    const { MessageService } = await import('@/lib/services/messageService');
    const { SenderType } = await import('@prisma/client');

    const eventId = body.event_id || body.message_id || `evt_${Date.now()}_${Math.random()}`;
    const existing = await prisma.webhookEvent.findUnique({ where: { eventId } });
    if (existing) return;

    await prisma.webhookEvent.create({
      data: { eventId, eventType: 'inbound_whatsapp', payload: body },
    });

    let leadSource = 'WHATSAPP_DIRECT';
    let attributionObj: any = undefined;

    const utmSource = body.utm_source || body.source || body.custom_fields?.utm_source || body.custom_fields?.source || undefined;
    const utmCampaign = body.utm_campaign || body.campaign_name || body.custom_fields?.utm_campaign || undefined;
    const utmMedium = body.utm_medium || body.medium || body.custom_fields?.utm_medium || undefined;

    if (utmSource || utmCampaign || body.campaign_id || body.ad_id) {
      const srcUpper = utmSource ? String(utmSource).toUpperCase() : '';
      leadSource = srcUpper.includes('GOOGLE') ? 'GOOGLE_ADS' : 'FACEBOOK_ADS';
      attributionObj = {
        source: leadSource,
        medium: utmMedium || 'cpc',
        campaign: utmCampaign || (leadSource === 'GOOGLE_ADS' ? 'Google Display Campaign' : 'Meta Ad Campaign'),
        campaignId: body.campaign_id || undefined,
        adSet: body.adset_name || body.adset_id || undefined,
        adId: body.ad_id || undefined,
        utmSource: utmSource || undefined,
        utmMedium: utmMedium || undefined,
        utmCampaign: utmCampaign || undefined,
      };
    } else if (userText && (userText.includes('[GADS]') || userText.toLowerCase().includes('google') || userText.includes('Can I get more info on this?'))) {
      leadSource = 'GOOGLE_ADS';
      attributionObj = {
        source: 'GOOGLE_ADS',
        medium: 'display',
        campaign: 'Dubai Offplan Display Campaign',
      };
    } else if (
      userText && (
        userText.includes('[META]') || 
        userText.includes('[FB]') || 
        userText.includes('[IG]') || 
        userText.toLowerCase().includes('instagram') || 
        userText.toLowerCase().includes('facebook') || 
        userText.toLowerCase().includes('filled in your form') || 
        userText.toLowerCase().includes('filled out your form') || 
        userText.toLowerCase().includes('looking to invest in dubai property')
      )
    ) {
      leadSource = 'FACEBOOK_ADS';
      attributionObj = {
        source: 'FACEBOOK_ADS',
        medium: 'cpc',
        campaign: 'Meta London Event Form',
      };
    }

    const emailMatch = userText.match(/[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}/);
    const extractedEmail = emailMatch ? emailMatch[0].toLowerCase().trim() : (aiResult.booking_details?.email?.toLowerCase().trim() || aiResult.lead_updates?.email?.toLowerCase().trim() || undefined);

    const nameMatch = userText.match(/(?:full\s*name|name):\s*([^\n\r,]+)/i);
    const extractedName = nameMatch && nameMatch[1].trim().length > 1 ? nameMatch[1].trim() : senderName;

    const phoneMatch = userText.match(/(?:phone\s*number|phone|mobile):\s*([+\d\s()-]{7,})/i);
    const extractedFormPhone = phoneMatch && phoneMatch[1].trim().length > 6 ? phoneMatch[1].replace(/[^\d+]/g, '').trim() : phone;

    const lead = await LeadService.findOrCreateLead({
      phone: extractedFormPhone,
      fullName: extractedName,
      email: extractedEmail,
      leadSource,
      attribution: attributionObj,
    });

    const conversation = await LeadService.getOrCreateConversation(lead.id);

    if (userText && userText.trim()) {
      const recentLeadMsg = await prisma.message.findFirst({
        where: {
          conversationId: conversation.id,
          senderType: SenderType.LEAD,
          createdAt: { gte: new Date(Date.now() - 8000) },
        },
        orderBy: { createdAt: 'desc' },
      });
      if (!recentLeadMsg) {
        await MessageService.storeMessage({ conversationId: conversation.id, senderType: SenderType.LEAD, content: userText, externalId: undefined });
      }
    }
    if (aiResult.reply && aiResult.reply.trim()) {
      const recentAiMsg = await prisma.message.findFirst({
        where: {
          conversationId: conversation.id,
          senderType: SenderType.AI,
          createdAt: { gte: new Date(Date.now() - 8000) },
        },
        orderBy: { createdAt: 'desc' },
      });
      if (!recentAiMsg) {
        await MessageService.storeMessage({ conversationId: conversation.id, senderType: SenderType.AI, content: aiResult.reply });
      }
    }

    if (extractedEmail && (!lead.email || lead.email !== extractedEmail)) {
      await prisma.lead.update({
        where: { id: lead.id },
        data: { email: extractedEmail },
      });
      lead.email = extractedEmail;
    }

    if (aiResult.lead_updates) {
      const updates: any = {};
      if (aiResult.lead_updates.buyer_location) updates.buyerLocation = aiResult.lead_updates.buyer_location;
      if (aiResult.lead_updates.purchase_purpose) updates.purchasePurpose = aiResult.lead_updates.purchase_purpose;
      if (aiResult.lead_updates.budget_min) updates.budgetMin = aiResult.lead_updates.budget_min;
      if (aiResult.lead_updates.budget_max) updates.budgetMax = aiResult.lead_updates.budget_max;
      if (aiResult.lead_updates.timeline) updates.timeline = aiResult.lead_updates.timeline;
      if (aiResult.lead_updates.meeting_preference) updates.meetingPreference = aiResult.lead_updates.meeting_preference;
      if (extractedEmail) updates.email = extractedEmail;
      if (Object.keys(updates).length > 0) {
        await prisma.lead.update({ where: { id: lead.id }, data: updates });
      }
    }

    const isMeetingBooking = 
      aiResult.action === 'BOOK_MEETING' || 
      (extractedEmail && (
        aiResult.reply.toLowerCase().includes('confirmed for') || 
        aiResult.reply.toLowerCase().includes('booked for') || 
        aiResult.reply.toLowerCase().includes("you're all set") || 
        aiResult.reply.toLowerCase().includes('invitation has been sent')
      ));

    if (isMeetingBooking) {
      let meetingTime = new Date(Date.now() + 86400000); // Default to tomorrow
      meetingTime.setHours(15, 0, 0, 0);

      const rawDateStr = ((aiResult.booking_details?.date || '') + ' ' + (aiResult.booking_details?.time || '') + ' ' + userText + ' ' + aiResult.reply).toLowerCase();
      
      if (rawDateStr.includes('tomorrow') || rawDateStr.includes('tom')) {
        meetingTime = new Date(Date.now() + 86400000);
      } else if (rawDateStr.includes('today')) {
        meetingTime = new Date();
      }

      const monthsMap: Record<string, number> = { jan:0, feb:1, mar:2, apr:3, may:4, jun:5, jul:6, aug:7, sep:8, oct:9, nov:10, dec:11 };
      
      const dayFirstMatch = rawDateStr.match(/(\d{1,2})(?:st|nd|rd|th)?\s+(?:of\s+)?(jan|feb|mar|apr|may|jun|jul|aug|sep|oct|nov|dec)\w*(?:\s+(\d{4}))?/i);
      const monthFirstMatch = rawDateStr.match(/(jan|feb|mar|apr|may|jun|jul|aug|sep|oct|nov|dec)\w*\s+(\d{1,2})(?:st|nd|rd|th)?(?:\s*,?\s*(\d{4}))?/i);

      if (dayFirstMatch) {
        const dayNum = parseInt(dayFirstMatch[1], 10);
        const mKey = dayFirstMatch[2].toLowerCase().slice(0, 3);
        const yr = dayFirstMatch[3] ? parseInt(dayFirstMatch[3], 10) : meetingTime.getFullYear();
        const mIdx = monthsMap[mKey];
        if (mIdx !== undefined && dayNum >= 1 && dayNum <= 31) {
          meetingTime.setFullYear(yr, mIdx, dayNum);
        }
      } else if (monthFirstMatch) {
        const mKey = monthFirstMatch[1].toLowerCase().slice(0, 3);
        const dayNum = parseInt(monthFirstMatch[2], 10);
        const yr = monthFirstMatch[3] ? parseInt(monthFirstMatch[3], 10) : meetingTime.getFullYear();
        const mIdx = monthsMap[mKey];
        if (mIdx !== undefined && dayNum >= 1 && dayNum <= 31) {
          meetingTime.setFullYear(yr, mIdx, dayNum);
        }
      }

      const timeMatch = (aiResult.booking_details?.time || rawDateStr).match(/(\d{1,2}):?(\d{2})?\s*(AM|PM)?/i);
      if (timeMatch) {
        let hours = parseInt(timeMatch[1], 10);
        const mins = parseInt(timeMatch[2] || '0', 10);
        const ampm = timeMatch[3]?.toUpperCase();
        if (ampm === 'PM' && hours < 12) hours += 12;
        if (ampm === 'AM' && hours === 12) hours = 0;
        meetingTime.setHours(hours, mins, 0, 0);
      }

      const replyLower = aiResult.reply.toLowerCase();
      const userTextLower = userText.toLowerCase();
      const bookingLocationRaw = (aiResult.booking_details?.location || '').toLowerCase();
      const isLondonEvent = 
        replyLower.includes('london') || 
        replyLower.includes('brompton') || 
        replyLower.includes('knightsbridge') || 
        replyLower.includes('open house') || 
        userTextLower.includes('london') || 
        userTextLower.includes('knightsbridge') || 
        userTextLower.includes('thursday') || 
        userTextLower.includes('sept 3') || 
        bookingLocationRaw.includes('london') || 
        bookingLocationRaw.includes('knightsbridge');

      let bookingLocation = 'Google Meet';
      if (isLondonEvent) {
        bookingLocation = 'Danube Properties, 44 Brompton Rd, Knightsbridge, London SW3 1BW, UK';
        // Explicitly pin date to Thursday, September 3, 2026!
        meetingTime.setFullYear(2026);
        meetingTime.setMonth(8); // September (0-indexed: Jan=0 ... Sep=8)
        meetingTime.setDate(3);
        // Ensure reasonable daylight meeting hour (e.g. 18:00 GST = 3:00 PM BST)
        if (meetingTime.getHours() === 0) {
          meetingTime.setHours(18, 0, 0, 0);
        }
      } else if (replyLower.includes('bluewaters') || replyLower.includes('pods') || bookingLocationRaw.includes('bluewaters')) {
        bookingLocation = 'The Pods, Bluewaters Island, Dubai';
      }

      await CalendarService.createBooking({
        leadId: lead.id,
        meetingTime,
        location: bookingLocation,
      });
      console.log('[BG-LOG] ✅ Meeting Booking created & Google Calendar invite dispatched to', lead.email, 'at', bookingLocation, 'on', meetingTime.toISOString());
    } else if (aiResult.action === 'HANDOFF') {
      await prisma.lead.update({
        where: { id: lead.id },
        data: { aiEnabled: false, handoffStatus: true },
      });
      try {
        await prisma.handoff.create({
          data: {
            leadId: lead.id,
            reason: aiResult.handoff_reason || 'Human takeover requested',
          },
        });
      } catch (_) { /* handoff record may already exist */ }
      await NotificationService.notifyMineshHandoff(senderName, phone, aiResult.handoff_reason || 'Human takeover requested');
      console.log('[BG-LOG] ✅ Handoff alert sent & AI paused for this lead!');
    }

    console.log('[BG-LOG] ✅ Messages and attribution saved to DB');
  } catch (err: any) {
    console.error('[BG-LOG] Error:', err.message);
  }
}

export async function GET(req: NextRequest) {
  const { searchParams } = new URL(req.url);
  const mode = searchParams.get('hub.mode');
  const token = searchParams.get('hub.verify_token');
  const challenge = searchParams.get('hub.challenge');

  const verifyToken = process.env.META_WEBHOOK_VERIFY_TOKEN || 'pods_leadgen_secret_2026';

  if (mode === 'subscribe' && token === verifyToken) {
    console.log('[META/WHATSAPP WEBHOOK] Handshake verified successfully with challenge:', challenge);
    return new Response(challenge || '', {
      status: 200,
      headers: {
        'Content-Type': 'text/plain',
      },
    });
  }

  return NextResponse.json({
    status: 'online',
    service: 'The Pods Real Estate WhatsApp AI Concierge',
    prompt_version: AIService.PROMPT_VERSION,
    timestamp: new Date().toISOString(),
  });
}
