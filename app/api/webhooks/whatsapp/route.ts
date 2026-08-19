import { NextRequest, NextResponse } from 'next/server';
import { AIService } from '@/lib/services/aiService';

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

    let rawPhone = body.whatsapp_phone || body.phone || body.phone_number || body.user_phone || body.contact_phone || body.from || body.custom_fields?.phone || body.custom_fields?.whatsapp_phone;
    if (typeof rawPhone === 'string' && (rawPhone.includes('{{') || rawPhone.trim() === '' || rawPhone === 'unknown')) {
      rawPhone = undefined;
    }

    const subscriberId = body.id || body.subscriber_id || body.user_id || body.contact_id;
    const senderName = body.first_name ? `${body.first_name} ${body.last_name || ''}`.trim() : (body.name || body.full_name || body.sender_name || body.user_name || body.custom_fields?.name || "VIP Client");
    const nameSlug = senderName.toLowerCase().replace(/[^a-z0-9]/g, '');
    const phone = rawPhone || (subscriberId ? `+mc_${subscriberId}` : (nameSlug && nameSlug !== 'vipclient' ? `+lead_${nameSlug}` : `+lead_guest`));
    let userText = body.last_input_text || body.payload?.text || body.text || body.message || "";




    // Audio / Voice Note Detection & Automatic OpenAI Whisper Transcription
    const audioUrl = body.voice_url || body.audio_url || body.media_url || body.file_url || body.payload?.url;
    if (audioUrl && (!userText || userText === "Hi" || userText.toLowerCase().includes("voice") || userText.toLowerCase().includes("audio"))) {
      try {
        const { WhisperService } = await import('@/lib/services/whisperService');
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
    const ip = req.headers.get('x-forwarded-for') || 'anon';
    const rateLimitKey = `${phone}_${ip}`;
    if (!checkRateLimit(rateLimitKey, 10, 60000)) {
      console.warn(`[SECURITY RATE LIMIT] Exceeded for ${phone}`);
      return NextResponse.json({
        status: 'rate_limited',
        reply: 'Thank you for contacting The Pods Real Estate. Our team is preparing your details.',
      }, { status: 429 });
    }

    // 3. Normalize phone for consistent database lookups
    let normalizedPhone = phone;
    try {
      const { LeadService } = await import('@/lib/services/leadService');
      normalizedPhone = LeadService.normalizePhone(phone, senderName);
    } catch (_) { /* fallback to raw phone */ }

    // 4. Fetch past conversation history from database for 100% unlimited memory retention
    let conversationHistory: { sender: string; text: string }[] = [];
    try {
      const { prisma } = await import('@/lib/prisma');
      const existingLead = await prisma.lead.findFirst({
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
        const rawMsgs = [...existingLead.conversations[0].messages].reverse();
        conversationHistory = rawMsgs.map((m: any) => ({
          sender: m.senderType === 'LEAD' ? 'LEAD' : 'AI',
          text: m.content,
        }));
      }
    } catch (histErr) {
      console.warn('[CONTEXT] History lookup warning:', histErr);
    }


    // Generate AI Response with full conversation memory
    const aiResult = await AIService.generateResponse({
      leadName: senderName || undefined,
      conversationHistory,
      userMessage: userText,
    });

    const latency = Date.now() - startTime;
    console.log(`[FAST] AI replied in ${latency}ms: "${aiResult.reply.substring(0, 80)}..."`);

    // Fire-and-forget: log to DB in background (doesn't block response)
    logToDatabase(body, userText, senderName, normalizedPhone, aiResult).catch(err =>
      console.error('[BG-LOG] DB logging error:', err.message)
    );

    return NextResponse.json({
      status: 'success',
      reply: aiResult.reply,
      ai_reply: aiResult.reply,
      text: aiResult.reply,
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
    let attributionObj = undefined;

    const utmSource = body.utm_source || body.source || undefined;
    const utmCampaign = body.utm_campaign || body.campaign_name || undefined;
    const utmMedium = body.utm_medium || body.medium || undefined;

    if (utmSource || utmCampaign || body.campaign_id || body.ad_id) {
      leadSource = utmSource ? String(utmSource).toUpperCase() : 'FACEBOOK_ADS';
      attributionObj = {
        source: leadSource,
        medium: utmMedium || 'cpc',
        campaign: utmCampaign || 'Ad Campaign',
        campaignId: body.campaign_id || undefined,
        adSet: body.adset_name || body.adset_id || undefined,
        adId: body.ad_id || undefined,
        utmSource: utmSource || undefined,
        utmMedium: utmMedium || undefined,
        utmCampaign: utmCampaign || undefined,
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

    // Save lead_updates from AI (budget, purpose, timeline, location)
    if (aiResult.lead_updates) {
      const updates: any = {};
      if (aiResult.lead_updates.buyer_location) updates.buyerLocation = aiResult.lead_updates.buyer_location;
      if (aiResult.lead_updates.purchase_purpose) updates.purchasePurpose = aiResult.lead_updates.purchase_purpose;
      if (aiResult.lead_updates.budget_min) updates.budgetMin = aiResult.lead_updates.budget_min;
      if (aiResult.lead_updates.budget_max) updates.budgetMax = aiResult.lead_updates.budget_max;
      if (aiResult.lead_updates.timeline) updates.timeline = aiResult.lead_updates.timeline;
      if (Object.keys(updates).length > 0) {
        await prisma.lead.update({ where: { id: lead.id }, data: updates });
      }
    }

    // BUG FIX: Only create booking on confirmed BOOK_MEETING (NOT CHECK_CALENDAR)
    if (aiResult.action === 'BOOK_MEETING') {
      const { CalendarService } = await import('@/lib/services/calendarService');
      // Parse actual booking time from AI response instead of hardcoding
      let meetingTime = new Date(Date.now() + 86400000 * 2);
      meetingTime.setHours(14, 0, 0, 0);
      if (aiResult.booking_details?.time) {
        try {
          const timeMatch = aiResult.booking_details.time.match(/(\d{1,2}):?(\d{2})?\s*(AM|PM)?/i);
          if (timeMatch) {
            let hours = parseInt(timeMatch[1]);
            const mins = parseInt(timeMatch[2] || '0');
            const ampm = timeMatch[3]?.toUpperCase();
            if (ampm === 'PM' && hours < 12) hours += 12;
            if (ampm === 'AM' && hours === 12) hours = 0;
            meetingTime.setHours(hours, mins, 0, 0);
          }
        } catch (_) { /* fallback to default */ }
      }
      await CalendarService.createBooking({
        leadId: lead.id,
        meetingTime,
        location: 'The Pods, Bluewaters Island, Dubai',
      });
      console.log('[BG-LOG] ✅ Meeting Booking created & notification sent!');
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
      const { NotificationService } = await import('@/lib/services/notificationService');
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
