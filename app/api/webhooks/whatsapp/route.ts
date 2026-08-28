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

// Ultra-fast webhook — skips DB, responds to ManyChat within timeout
// DB logging happens in background after response is sent
export async function POST(req: NextRequest) {
  const startTime = Date.now();
  try {
    // 1. Webhook Secret Verification (if MANYCHAT_WEBHOOK_SECRET is set)
    const secretHeader = req.headers.get('x-manychat-secret') || req.headers.get('authorization');
    const expectedSecret = process.env.MANYCHAT_WEBHOOK_SECRET;
    if (expectedSecret && secretHeader !== expectedSecret && secretHeader !== `Bearer ${expectedSecret}`) {
      console.warn('[SECURITY] Webhook signature mismatch');
      return NextResponse.json({ status: 'unauthorized', error: 'Invalid webhook authorization' }, { status: 401 });
    }

    const body = await req.json();

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

    if (!userText || userText.trim() === "") {
      userText = "Hi";
    }

    console.log(`[FAST] ${senderName} (${phone}): "${userText}"`);

    if (!phone || phone === "unknown") {
      return NextResponse.json({ status: 'error', reply: 'Welcome to The Pods Real Estate! How can I help?' });
    }


    // 2. Rate Limiting (max 10 requests per minute per phone number)
    if (!checkRateLimit(phone, 10, 60000)) {
      console.warn(`[RATE LIMIT] Throttled ${phone}`);
      return NextResponse.json({
        status: 'rate_limited',
        reply: 'Thank you for contacting The Pods Real Estate. Our team is preparing your details.',
      }, { status: 429 });
    }

    // 3. Normalize phone for consistent database lookups
    let normalizedPhone = phone;
    try {
      normalizedPhone = LeadService.normalizePhone(phone, senderName);
    } catch (_) { /* fallback to raw phone */ }

    // 4. Fetch past conversation history & dynamic lead profile for 100% memory retention
    let conversationHistory: { sender: string; text: string }[] = [];
    let existingLead: any = null;
    try {
      existingLead = await prisma.lead.findFirst({
        where: {
          OR: [
            { phone: normalizedPhone },
            { phone },
            senderName && senderName !== 'VIP Client' && senderName !== 'Guest'
              ? { fullName: { equals: senderName, mode: 'insensitive' } }
              : { phone: normalizedPhone },
          ],
        },
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
        // Use the last 10 recent messages for immediate conversational context so model does not anchor on previous topics
        const recentMsgs = existingLead.conversations[0].messages.slice(0, 10);
        const rawMsgs = [...recentMsgs].reverse();
        conversationHistory = rawMsgs.map((m: any) => ({
          sender: m.senderType === 'LEAD' ? 'LEAD' : 'AI',
          text: m.content,
        }));
      }
    } catch (histErr) {
      console.warn('[CONTEXT] History lookup warning:', histErr);
    }

    // Detect ad source BEFORE AI call so Aria knows the lead's origin
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

    // Generate AI Response with full dynamic lead memory + ad source context
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

    // Use Next.js after() to run DB logging & email dispatch in the background after returning HTTP response to ManyChat
    after(async () => {
      try {
        await logToDatabase(body, userText, senderName, normalizedPhone, aiResult);
      } catch (err: any) {
        console.error('[BG-LOG] Async logging error:', err.message);
      }
    });

    return NextResponse.json({
      status: 'success',
      reply: aiResult.reply,
      ai_reply: aiResult.reply,
      text: aiResult.reply,
      action: aiResult.action || 'NONE',
      language: aiResult.language || 'en',
      latency_ms: latency,
    });
  } catch (error: any) {
    console.error('Webhook Error:', error.message);
    return NextResponse.json({
      status: 'error',
      reply: 'Welcome to The Pods Real Estate! Send us a message and our luxury property specialist will assist you shortly.',
    });
  }
}

// Background DB logging — runs AFTER response is sent to ManyChat
async function logToDatabase(body: any, userText: string, senderName: string, phone: string, aiResult: any) {
  try {
    const { prisma } = await import('@/lib/prisma');
    const { LeadService } = await import('@/lib/services/leadService');
    const { MessageService } = await import('@/lib/services/messageService');
    const { SenderType } = await import('@prisma/client');

    // Idempotency
    const eventId = body.event_id || body.message_id || `evt_${Date.now()}_${Math.random()}`;
    const existing = await prisma.webhookEvent.findUnique({ where: { eventId } });
    if (existing) return;

    await prisma.webhookEvent.create({
      data: { eventId, eventType: 'inbound_whatsapp', payload: body },
    });

    // Parse attribution details from ManyChat payload dynamically
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
      // Heuristic detection: Display ad pre-filled message
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

    const lead = await LeadService.findOrCreateLead({
      phone,
      fullName: senderName,
      leadSource,
      attribution: attributionObj,
    });

    const conversation = await LeadService.getOrCreateConversation(lead.id);

    // Only store messages if there's actual content
    if (userText && userText.trim()) {
      await MessageService.storeMessage({ conversationId: conversation.id, senderType: SenderType.LEAD, content: userText, externalId: undefined });
    }
    if (aiResult.reply && aiResult.reply.trim()) {
      await MessageService.storeMessage({ conversationId: conversation.id, senderType: SenderType.AI, content: aiResult.reply });
    }

    // Extract Email from user text or AI output if provided (normalized to lowercase)
    const emailMatch = userText.match(/[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}/);
    const extractedEmail = emailMatch ? emailMatch[0].toLowerCase().trim() : (aiResult.booking_details?.email?.toLowerCase().trim() || aiResult.lead_updates?.email?.toLowerCase().trim() || undefined);
    if (extractedEmail && (!lead.email || lead.email !== extractedEmail)) {
      await prisma.lead.update({
        where: { id: lead.id },
        data: { email: extractedEmail },
      });
      lead.email = extractedEmail;
    }

    // Save lead_updates from AI (budget, purpose, timeline, location, meeting preference)
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

    // 4. Handle Meeting Bookings or Handoffs asynchronously in DB
    const isMeetingBooking = 
      aiResult.action === 'BOOK_MEETING' || 
      (extractedEmail && (
        aiResult.reply.toLowerCase().includes('confirmed for') || 
        aiResult.reply.toLowerCase().includes('booked for') || 
        aiResult.reply.toLowerCase().includes("you're all set") ||
        aiResult.reply.toLowerCase().includes('invitation has been sent')
      ));

    if (isMeetingBooking) {
      // Parse actual booking date + time from AI response
      let meetingTime = new Date(Date.now() + 86400000 * 2);
      meetingTime.setHours(15, 0, 0, 0); // 3:00 PM default

      // Try to parse date from booking_details (e.g. "3 PM on September 3rd", "2026-09-03 15:00")
      if (aiResult.booking_details?.time) {
        try {
          // Try parsing as a full date string first
          const parsed = new Date(aiResult.booking_details.time);
          if (!isNaN(parsed.getTime()) && parsed.getFullYear() >= 2026) {
            meetingTime = parsed;
          } else {
            // Extract time component
            const timeMatch = aiResult.booking_details.time.match(/(\d{1,2}):?(\d{2})?\s*(AM|PM)?/i);
            if (timeMatch) {
              let hours = parseInt(timeMatch[1]);
              const mins = parseInt(timeMatch[2] || '0');
              const ampm = timeMatch[3]?.toUpperCase();
              if (ampm === 'PM' && hours < 12) hours += 12;
              if (ampm === 'AM' && hours === 12) hours = 0;
              meetingTime.setHours(hours, mins, 0, 0);
            }
          }

          // Extract date component (e.g. "September 3", "Sep 3", "3rd September")
          const dateInReply = (aiResult.booking_details.time + ' ' + (aiResult.booking_details.date || '')).toLowerCase();
          const monthMatch = dateInReply.match(/(jan|feb|mar|apr|may|jun|jul|aug|sep|oct|nov|dec)\w*\s+(\d{1,2})/i) ||
                             dateInReply.match(/(\d{1,2})\s+(jan|feb|mar|apr|may|jun|jul|aug|sep|oct|nov|dec)/i);
          if (monthMatch) {
            const months: any = { jan:0,feb:1,mar:2,apr:3,may:4,jun:5,jul:6,aug:7,sep:8,oct:9,nov:10,dec:11 };
            const m1 = monthMatch[1].toLowerCase().slice(0,3);
            const m2 = monthMatch[2]?.toLowerCase().slice(0,3);
            const monthIdx = months[m1] ?? months[m2];
            const day = parseInt(months[m1] !== undefined ? monthMatch[2] : monthMatch[1]);
            if (monthIdx !== undefined && day) {
              meetingTime.setMonth(monthIdx, day);
              if (meetingTime < new Date()) meetingTime.setFullYear(meetingTime.getFullYear() + 1);
            }
          }
        } catch (_) { /* fallback to default */ }
      }

      // Detect location — London event or Dubai/Google Meet
      const replyLower = aiResult.reply.toLowerCase();
      const bookingLocationRaw = aiResult.booking_details?.location || '';
      let bookingLocation = 'Google Meet';
      if (replyLower.includes('london') || replyLower.includes('brompton') || replyLower.includes('knightsbridge') || bookingLocationRaw.toLowerCase().includes('london')) {
        bookingLocation = 'Danube Properties, 44 Brompton Rd, Knightsbridge, London SW3 1BW, UK';
      } else if (replyLower.includes('bluewaters') || replyLower.includes('pods') || bookingLocationRaw.toLowerCase().includes('bluewaters')) {
        bookingLocation = 'The Pods, Bluewaters Island, Dubai';
      }

      await CalendarService.createBooking({
        leadId: lead.id,
        meetingTime,
        location: bookingLocation,
      });
      console.log('[BG-LOG] ✅ Meeting Booking created & Google Calendar invite dispatched to', lead.email, 'at', bookingLocation, 'on', meetingTime.toISOString());
    } else if (aiResult.action === 'HANDOFF') {
      // BUG FIX: Persist handoff state — disable AI and create Handoff record
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


export async function GET() {
  return NextResponse.json({
    status: 'online',
    service: 'The Pods Real Estate WhatsApp AI Concierge',
    prompt_version: AIService.PROMPT_VERSION,
    timestamp: new Date().toISOString(),
  });
}
