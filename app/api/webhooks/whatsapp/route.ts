import { NextRequest, NextResponse, after } from 'next/server';
import crypto from 'crypto';
import { AIService } from '@/lib/services/aiService';
import { prisma } from '@/lib/prisma';
import { LeadService, isRealName, extractNameFromText, formatPersonName } from '@/lib/services/leadService';
import { MessageService } from '@/lib/services/messageService';
import { NotificationService } from '@/lib/services/notificationService';
import { CalendarService } from '@/lib/services/calendarService';
import { WhisperService } from '@/lib/services/whisperService';
import { LeadStatus } from '@prisma/client';
import { getCampaignForLead, getActiveEvents, CampaignConfig } from '@/lib/config/campaigns';
import { SystemConfigService } from '@/lib/services/systemConfigService';

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
        trimmed.toLowerCase() === 'unknown' ||
        trimmed.toLowerCase() === 'guest' ||
        trimmed.toLowerCase() === 'vip client' ||
        trimmed === '-' ||
        trimmed === '--' ||
        trimmed === '---' ||
        /^[-_\s.]+$/.test(trimmed)
      ) {
        return '';
      }
      return trimmed;
    };

    const rawFirstName = cleanField(body.first_name);
    const rawLastName = cleanField(body.last_name);
    const rawFullName = cleanField(body.name || body.full_name || body.sender_name || body.user_name || body.custom_fields?.name);

    let senderName = "";
    if (rawFirstName && rawLastName) {
      senderName = `${rawFirstName} ${rawLastName}`;
    } else if (rawFirstName) {
      senderName = rawFirstName;
    } else if (rawFullName) {
      senderName = rawFullName;
    }

    const subscriberId = body.id || body.subscriber_id || body.user_id || body.contact_id;
    const nameSlug = senderName ? senderName.toLowerCase().replace(/[^a-z0-9]/g, '') : '';
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
      if (!userText || userText.trim().length === 0) {
        userText = '🎤 Voice note';
      }
    } else if (!userText && (body.type === 'audio' || body.type === 'voice' || body.content_type === 'audio' || body.payload?.type === 'audio')) {
      userText = '🎤 Voice note';
    } else if (!userText && (body.type === 'image' || body.content_type === 'image' || body.payload?.type === 'image')) {
      userText = '📷 Photo attachment';
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

    // STRICT SUPPRESSION OF EMPTY/BLANK INBOUND WEBHOOKS ONLY (preserve audio / media)
    if (!userText || userText.trim().length === 0) {
      if (audioUrl || body.type === 'audio' || body.type === 'voice') {
        userText = '🎤 Voice note';
      } else if (body.type === 'image') {
        userText = '📷 Photo attachment';
      } else {
        console.log(`[IGNORE EMPTY] No message content or audio for ${phone} — suppressing reply generation`);
        return NextResponse.json({ status: 'empty_ignored', reply: '' });
      }
    }

    // Rate Limiting (max 10 requests per minute per phone number)
    if (!checkRateLimit(phone, 10, 60000)) {
      console.warn(`[RATE LIMIT] Throttled ${phone}`);
      return NextResponse.json({
        status: 'rate_limited',
        reply: '',
      }, { status: 429 });
    }

    let normalizedPhone = phone;
    try {
      normalizedPhone = LeadService.normalizePhone(phone, senderName);
    } catch (_) { /* fallback to raw phone */ }

    const now = Date.now();
    
    // Message-level deduplication: ONLY suppress IDENTICAL duplicate webhook calls for the exact same message
    // Different messages ("Yes", "Afternoon", "2pm") have different hashes and are NEVER suppressed!
    const cleanUserMsg = (userText || '').trim().toLowerCase();
    const msgHash = crypto.createHash('md5').update(cleanUserMsg).digest('hex').substring(0, 8);
    const dedupKey = `${normalizedPhone}_${msgHash}`;

    // 1. Distributed Database-Level Atomic Idempotency Lock (PostgreSQL ACID)
    // Locked strictly by PHONE + MESSAGE HASH with 3-second TTL to prevent concurrent duplicate ManyChat webhook firings of the exact same message
    const distributedLockKey = `LOCK_${normalizedPhone}_${msgHash}`;
    const lockCutoff = new Date(Date.now() - 3000);

    try {
      // Clear expired lock if more than 3 seconds old
      await prisma.webhookEvent.deleteMany({
        where: {
          eventId: distributedLockKey,
          createdAt: { lt: lockCutoff },
        },
      });

      // Atomically claim the lock for this specific message from this phone
      await prisma.webhookEvent.create({
        data: {
          eventId: distributedLockKey,
          eventType: 'INBOUND_WHATSAPP_LOCK',
          payload: { phone: normalizedPhone, userText: userText.substring(0, 50), timestamp: now },
        },
      });

      // Fire-and-forget async cleanup of old locks (>1 hour)
      prisma.webhookEvent.deleteMany({
        where: {
          eventType: 'INBOUND_WHATSAPP_LOCK',
          createdAt: { lt: new Date(Date.now() - 3600000) },
        },
      }).catch(() => {});
    } catch (lockErr: any) {
      console.log(`[DISTRIBUTED DB LOCK BLOCKED] Duplicate concurrent webhook call rejected for ${distributedLockKey}`);
      return NextResponse.json({
        status: 'dedup_suppressed',
        reply: '', // Strictly send empty reply to prevent duplicate outbound messages
      });
    }

    // 2. In-Memory Level Fast Cache (cooldown strictly for IDENTICAL message text within 3s)
    const recent = recentCompletedResponses.get(dedupKey);
    if (recent && now - recent.timestamp < 3000) {
      console.log(`[DEDUP] In-memory duplicate request for ${dedupKey} within 3s — returning empty reply`);
      return NextResponse.json({
        status: 'dedup_suppressed',
        reply: '',
      });
    }

    const processExecution = async () => {
      let conversationHistory: { sender: string; text: string }[] = [];
      let existingLead: any = null;
      try {
        const isAdminSender = normalizedPhone.includes('447812222111') || normalizedPhone.includes('523666495') || phone.includes('447812222111') || phone.includes('523666495');

        if (isAdminSender) {
          const pendingBooking = await prisma.booking.findFirst({
            where: { status: 'PENDING_APPROVAL' },
            orderBy: { createdAt: 'desc' },
            include: { lead: true },
          });

          const adminTextLower = userText.toLowerCase().trim();
          const isApproval = adminTextLower.includes('yes') || adminTextLower.includes('approve') || adminTextLower.includes('confirm') || adminTextLower.includes('ok') || adminTextLower.includes('fine');
          const isDecline = adminTextLower.includes('no') || adminTextLower.includes('decline') || adminTextLower.includes('cancel') || adminTextLower.includes('unavailable') || adminTextLower.includes('reject') || adminTextLower.includes('not possible');
          const isReschedule = !isApproval && !isDecline && (
            adminTextLower.includes('pm') || 
            adminTextLower.includes('am') || 
            adminTextLower.includes('monday') || 
            adminTextLower.includes('tuesday') || 
            adminTextLower.includes('wednesday') || 
            adminTextLower.includes('thursday') || 
            adminTextLower.includes('friday') || 
            adminTextLower.includes('saturday') || 
            adminTextLower.includes('sunday') || 
            adminTextLower.includes('next week') || 
            adminTextLower.includes('tomorrow') || 
            adminTextLower.includes('move to') || 
            adminTextLower.includes('reschedule') || 
            adminTextLower.includes('change')
          );

          if (pendingBooking && isApproval) {
            // 1. Confirm the booking in DB
            await prisma.booking.update({
              where: { id: pendingBooking.id },
              data: { status: 'CONFIRMED' },
            });

            // 2. Dispatch calendar invite / booking service
            try {
              await CalendarService.createBooking({
                leadId: pendingBooking.leadId,
                meetingTime: pendingBooking.meetingTime,
                location: pendingBooking.location,
              });
            } catch (_) {}

            // 3. Send confirmation WhatsApp back to the lead/partner (e.g. Sheldon)
            const leadPhone = pendingBooking.lead?.phone;
            const timeFormatted = new Date(pendingBooking.meetingTime).toLocaleString('en-US', {
              timeZone: 'Asia/Dubai',
              weekday: 'short',
              month: 'short',
              day: 'numeric',
              hour: '2-digit',
              minute: '2-digit',
            });

            const partnerReply = `Hi ${pendingBooking.lead?.fullName || 'there'}! Minesh has reviewed his schedule and confirmed your meeting for ${timeFormatted} at ${pendingBooking.location}. We look forward to meeting you!`;

            if (leadPhone) {
              await MessageService.sendWhatsAppDirect(leadPhone, partnerReply);
            }

            const adminReply = `✅ Meeting Confirmed!\n\n👤 ${pendingBooking.lead?.fullName || 'Partner'}\n📍 ${pendingBooking.location}\n⏰ ${timeFormatted}\n\nI have confirmed the meeting and sent a WhatsApp confirmation to ${pendingBooking.lead?.fullName || 'the contact'}.`;

            return {
              status: 'success',
              reply: adminReply,
              ai_reply: adminReply,
              text: adminReply,
              action: 'ADMIN_APPROVED',
              language: 'en',
              latency_ms: Date.now() - startTime,
            };
          } else if (pendingBooking && isDecline) {
            // Minesh declined the meeting
            await prisma.booking.update({
              where: { id: pendingBooking.id },
              data: { status: 'DECLINED' },
            });

            const leadPhone = pendingBooking.lead?.phone;
            const partnerReply = `Hi ${pendingBooking.lead?.fullName || 'there'}, thank you for reaching out. Minesh is unavailable for an in-person meeting at that time due to prior commitments. Please let us know your availability for next week and we will be happy to coordinate!`;

            if (leadPhone) {
              await MessageService.sendWhatsAppDirect(leadPhone, partnerReply);
            }

            const adminReply = `❌ Meeting Declined.\n\nI have politely informed ${pendingBooking.lead?.fullName || 'the contact'} that you are unavailable and asked them for alternative availability next week.`;

            return {
              status: 'success',
              reply: adminReply,
              ai_reply: adminReply,
              text: adminReply,
              action: 'ADMIN_DECLINED',
              language: 'en',
              latency_ms: Date.now() - startTime,
            };
          } else if (pendingBooking && isReschedule) {
            // Minesh proposed a new time
            const proposedTimeText = userText.trim();
            await prisma.booking.update({
              where: { id: pendingBooking.id },
              data: { status: 'RESCHEDULE_PROPOSED' },
            });

            const leadPhone = pendingBooking.lead?.phone;
            const partnerReply = `Hi ${pendingBooking.lead?.fullName || 'there'}! Minesh is eager to meet with you at ${pendingBooking.location}, but has a schedule conflict at the requested slot. He has proposed meeting at: "${proposedTimeText}". Does this slot work for you?`;

            if (leadPhone) {
              await MessageService.sendWhatsAppDirect(leadPhone, partnerReply);
            }

            const adminReply = `🔄 Reschedule Proposal Sent!\n\n👤 ${pendingBooking.lead?.fullName || 'Partner'}\n📍 ${pendingBooking.location}\n⏰ Proposed: "${proposedTimeText}"\n\nI have sent this alternative time to ${pendingBooking.lead?.fullName || 'the contact'} and will notify you as soon as they reply.`;

            return {
              status: 'success',
              reply: adminReply,
              ai_reply: adminReply,
              text: adminReply,
              action: 'ADMIN_RESCHEDULED',
              language: 'en',
              latency_ms: Date.now() - startTime,
            };
          } else if (pendingBooking) {
            const timeFormatted = new Date(pendingBooking.meetingTime).toLocaleString('en-US', {
              timeZone: 'Asia/Dubai',
              weekday: 'short',
              month: 'short',
              day: 'numeric',
              hour: '2-digit',
              minute: '2-digit',
            });

            const adminReply = `👋 Hello Minesh Sir! You have 1 VIP meeting approval pending:\n\n👤 ${pendingBooking.lead?.fullName || 'Partner'}\n📞 ${pendingBooking.lead?.phone}\n📍 ${pendingBooking.location}\n⏰ ${timeFormatted}\n\n👉 Reply "YES" to confirm.\n👉 Or reply with another time (e.g. "Friday 2 PM" or "Monday 11 AM").\n👉 Or reply "NO" to decline.`;

            return {
              status: 'success',
              reply: adminReply,
              ai_reply: adminReply,
              text: adminReply,
              action: 'ADMIN_PROMPT',
              language: 'en',
              latency_ms: Date.now() - startTime,
            };
          } else {
            const adminReply = `👋 Hello Minesh Sir! All systems are live at The Pods Real Estate Command Center. You will receive live WhatsApp alerts here for any VIP meetings or human takeover requests.`;

            return {
              status: 'success',
              reply: adminReply,
              ai_reply: adminReply,
              text: adminReply,
              action: 'ADMIN_IDLE',
              language: 'en',
              latency_ms: Date.now() - startTime,
            };
          }
        }

        const searchConditions: any[] = [{ phone: normalizedPhone }, { phone }];
        if (normalizedPhone.startsWith('+44')) {
          searchConditions.push({ phone: '+440' + normalizedPhone.substring(3) });
        } else if (normalizedPhone.startsWith('+440')) {
          searchConditions.push({ phone: '+44' + normalizedPhone.substring(4) });
        }
        if (subscriberId) {
          searchConditions.push({ manychatId: String(subscriberId) });
        }
        if (extractedFormPhone) {
          searchConditions.push({ phone: extractedFormPhone });
        }
        if (extractedFormEmail) {
          searchConditions.push({ email: { equals: extractedFormEmail, mode: 'insensitive' } });
        }
        existingLead = await prisma.lead.findFirst({
          where: { OR: searchConditions },
          include: {
            attributions: { take: 1, orderBy: { createdAt: 'desc' } },
            bookings: { take: 1, orderBy: { createdAt: 'desc' } },
            conversations: {
              orderBy: { createdAt: 'asc' }, // Always bind to the primary conversation
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

          // Smart Deduplication for Canned Meta Lead Form Messages
          // Meta Click-to-WhatsApp thank-you pages often lead users to tap "Chat on WhatsApp" a 2nd time within minutes.
          // Detect if this exact canned form message was already received from this lead within the last 30 minutes.
          const cleanIncomingText = (userText || '').trim().toLowerCase();
          const isFormLeadMsg = 
            cleanIncomingText.includes('filled in your form') ||
            cleanIncomingText.includes('filled out your form') ||
            cleanIncomingText.includes('would like to know more about your business') ||
            (cleanIncomingText.includes('phone number:') && cleanIncomingText.includes('email:'));

          if (isFormLeadMsg || (cleanIncomingText.length > 40 && conversationHistory.some(m => m.sender === 'LEAD' && m.text.trim().toLowerCase() === cleanIncomingText))) {
            const thirtyMinsAgo = new Date(Date.now() - 30 * 60 * 1000);
            const hasRecentDuplicate = existingLead.conversations[0].messages.some((m: any) => {
              if (m.senderType !== 'LEAD') return false;
              const msgDate = new Date(m.createdAt);
              if (msgDate < thirtyMinsAgo) return false;

              const prevTextClean = (m.content || '').trim().toLowerCase();
              if (prevTextClean === cleanIncomingText) return true;
              if (isFormLeadMsg && (
                prevTextClean.includes('filled in your form') ||
                prevTextClean.includes('filled out your form') ||
                prevTextClean.includes('would like to know more about your business')
              )) {
                return true;
              }
              return false;
            });

            if (hasRecentDuplicate) {
              console.log(`[DUPLICATE FORM SUPPRESSED] Lead ${phone} re-submitted identical form text within 30m — suppressing duplicate reply & database clutter`);
              return {
                status: 'duplicate_form_suppressed',
                reply: '',
                ai_reply: '',
                text: '',
                action: 'NONE',
                language: 'en',
                latency_ms: Date.now() - startTime,
              };
            }
          }
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
      } else if (userText.includes('[GADS') || userText === 'Can I get more info on this?' || userText === 'Hello! Can I get more info on this?' || (userTextLower.includes('can i get more info') && conversationHistory.length === 0)) {
        adSource = 'GOOGLE_ADS';
        const matchedCamp = getCampaignForLead({ phone: normalizedPhone || phone, userText: userTextLower });
        campaignName = matchedCamp.type === 'event' ? matchedCamp.name : 'Google Demand Gen Video';
      } else if (
        userText.includes('[META]') || 
        userText.includes('[FB]') || 
        userText.includes('[IG]') || 
        userTextLower.includes('filled in your form') || 
        userTextLower.includes('filled out your form') || 
        userTextLower.includes('looking to invest in dubai property') ||
        userTextLower.includes('signed up for this event')
      ) {
        adSource = 'META_ADS';
        const isUkOrLeicester = 
          normalizedPhone.startsWith('+44') || 
          phone.startsWith('44') || 
          userText.includes('+44') || 
          userTextLower.includes('leicester') || 
          userTextLower.includes('marriott') || 
          userTextLower.includes('event');

        const matchedCamp = getCampaignForLead({ phone: normalizedPhone || phone, userText: userTextLower });
        campaignName = matchedCamp.type === 'event' ? matchedCamp.name : (isUkOrLeicester ? 'Meta UK Campaign' : 'Meta Ad Campaign');
      }

      // Check if existing lead has campaign attribution
      if (!campaignName && existingLead?.attributions?.[0]?.campaign) {
        campaignName = existingLead.attributions[0].campaign;
      }

      const effectivePhone = normalizedPhone || phone || extractedFormPhone || undefined;
      const isUkPhone = effectivePhone && (effectivePhone.startsWith('+44') || effectivePhone.startsWith('44') || effectivePhone.startsWith('0044'));

      const nameFromUserMsg = extractNameFromText(userText);
      const resolvedName = nameFromUserMsg
        || (isRealName(existingLead?.fullName) ? existingLead.fullName : undefined)
        || (isRealName(senderName) ? formatPersonName(senderName) : undefined);

      const resolvedEmail = existingLead?.email || extractedFormEmail || undefined;

      const existingBooking = existingLead?.bookings?.[0];
      const isMeetingBooked = existingLead?.status === 'MEETING_BOOKED' || 
        existingBooking?.status === 'CONFIRMED' || 
        existingBooking?.status === 'PENDING_APPROVAL';

      const bookingDetails = existingBooking ? {
        meetingTime: existingBooking.meetingTime,
        location: existingBooking.location,
        timezone: existingBooking.timezone || undefined,
      } : undefined;

      const cleanUserMsg = userText.toLowerCase().trim().replace(/[^a-z0-9]/g, '');
      const isAck = [
        'thankyou', 'thanks', 'thankyousomuch', 'manythanks', 'thx', 'cheers',
        'ok', 'okay', 'great', 'perfect', 'soundsgood', 'soundsgreat', 'seeyou',
        'seeyouthen', 'seeyousoon', 'lookingforwardtoit', 'cantwait', 'done',
        'cool', 'brilliant', 'awesome', 'yes', 'yep', 'yeah', 'right', 'noted'
      ].includes(cleanUserMsg) || cleanUserMsg === '' || /^(\.|\?|!)+$/.test(userText.trim());

      let aiResult: any;

      if (isMeetingBooked && nameFromUserMsg) {
        const firstName = nameFromUserMsg.split(/\s+/)[0];
        const venueName = bookingDetails?.location || (isUkPhone ? (getActiveEvents().length > 0 ? 'Leicester Marriott Hotel' : 'Google Meet') : 'The Pods Bluewaters');
        let meetingDayStr = '';
        if (bookingDetails?.meetingTime) {
          try {
            const mDate = new Date(bookingDetails.meetingTime);
            meetingDayStr = ' on ' + mDate.toLocaleDateString('en-GB', { weekday: 'long', day: 'numeric', month: 'long', timeZone: bookingDetails.timezone || 'Europe/London' });
          } catch (_) {}
        }
        const passText = getActiveEvents().length > 0 ? 'event pass' : 'consultation';
        const reply = `Wonderful to meet you, ${firstName}! I've updated your ${passText} with your name. Really looking forward to seeing you${meetingDayStr} at the ${venueName}! Let me know if you need anything before then.`;
        aiResult = {
          reply,
          language: 'en',
          action: 'UPDATE_LEAD',
          lead_updates: { full_name: nameFromUserMsg },
        };
      } else if (isMeetingBooked && isAck) {
        const leadDisplayName = resolvedName && resolvedName !== 'Guest' && resolvedName !== 'VIP Client' ? `, ${resolvedName}` : '';
        const venueName = bookingDetails?.location || (isUkPhone ? (getActiveEvents().length > 0 ? 'Leicester Marriott Hotel, Smith Way, Grove Park, Enderby, Leicester LE19 1SW' : 'Google Meet') : 'The Pods Bluewaters');

        let meetingDayStr = '';
        if (bookingDetails?.meetingTime) {
          try {
            const mDate = new Date(bookingDetails.meetingTime);
            meetingDayStr = ' on ' + mDate.toLocaleDateString('en-GB', { weekday: 'long', day: 'numeric', month: 'long', timeZone: bookingDetails.timezone || 'Europe/London' });
          } catch (_) {}
        }

        const reply = `You're very welcome${leadDisplayName}! Looking forward to seeing you${meetingDayStr} at the ${venueName}. Let me know if you need any directions or questions before then!`;

        aiResult = {
          reply,
          language: 'en',
          action: 'NONE',
        };
      } else {
        const globalAiMode = await SystemConfigService.getGlobalAiMode();
        const isLeadFirstTouch = !existingLead || conversationHistory.length === 0;
        const isMetaLeadInquiry = 
          userTextLower.includes('filled in your form') ||
          userTextLower.includes('filled out your form') ||
          userTextLower.includes('signed up for this event') ||
          userTextLower.includes('looking to invest in dubai property') ||
          userText.includes('[META]') ||
          userText.includes('[FB]') ||
          userText.includes('[IG]');

        if (globalAiMode === 'DAY') {
          if (isLeadFirstTouch || isMetaLeadInquiry) {
            const firstName = resolvedName ? resolvedName.split(/\s+/)[0] : '';
            const greetingName = firstName ? ` ${firstName}` : '';
            const dayModeReply = `Hey${greetingName}! Thanks for reaching out to The Pods Real Estate. Our representative will be contacting you in few mins.`;

            aiResult = {
              reply: dayModeReply,
              language: 'en',
              action: 'HANDOFF',
              handoff_reason: 'Day Mode: Greeting dispatched, lead placed in manual takeover queue for marketing team',
            };
            console.log(`[DAY-MODE] Dispatched single touchpoint greeting to ${resolvedName || phone} and queued for manual human takeover.`);
          } else {
            // Day Mode is Human First: Lead is already in touch or has history. AI bot will not reply back!
            aiResult = {
              reply: '',
              language: 'en',
              action: 'NONE',
            };
            console.log(`[DAY-MODE] Inbound message from existing lead ${resolvedName || phone} received during Day Mode — AI kept silent for human takeover.`);
          }
        } else {
          aiResult = await AIService.generateResponse({
            leadName: resolvedName,
            email: resolvedEmail,
            phone: effectivePhone,
            buyerLocation: existingLead?.buyerLocation || (isUkPhone ? 'United Kingdom' : undefined),
            purchasePurpose: existingLead?.purchasePurpose || undefined,
            budgetMin: existingLead?.budgetMin || undefined,
            budgetMax: existingLead?.budgetMax || undefined,
            timeline: existingLead?.timeline || undefined,
            adSource: adSource || existingLead?.attributions?.[0]?.source || undefined,
            campaignName: campaignName || existingLead?.attributions?.[0]?.campaign || undefined,
            isMeetingBooked,
            bookingDetails,
            conversationHistory,
            userMessage: userText,
          });
        }
      }

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
    const { LeadService, isRealName } = await import('@/lib/services/leadService');
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
    } else if (userText && (userText.includes('[GADS') || userText.toLowerCase().includes('google') || userText.includes('Can I get more info on this?'))) {
      leadSource = 'GOOGLE_ADS';
      attributionObj = {
        source: 'GOOGLE_ADS',
        medium: 'video',
        campaign: userText.toLowerCase().includes('leicester') ? 'Danube_DubaiExpo_Leicester_Sept26-27' : 'Google Demand Gen Video',
      };
    }

    const emailMatch = userText.match(/[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}/);
    const extractedEmail = emailMatch ? emailMatch[0].toLowerCase().trim() : (aiResult.booking_details?.email?.toLowerCase().trim() || aiResult.lead_updates?.email?.toLowerCase().trim() || undefined);

    const nameFromUserMsg = extractNameFromText(userText);
    const nameMatch = userText.match(/(?:full\s*name|name):\s*([^\n\r,]+)/i);
    const cleanedFormName = nameMatch 
      ? nameMatch[1].replace(/\s*(?:phone\s*number|phone|mobile|tel|email|budget|what\s*type|are\s*you).*$/i, '').trim() 
      : undefined;
    const cleanedSenderName = senderName 
      ? senderName.replace(/\s*(?:phone\s*number|phone|mobile|tel|email|budget|what\s*type|are\s*you).*$/i, '').trim() 
      : undefined;
    const extractedName = nameFromUserMsg 
      || (cleanedFormName && isRealName(cleanedFormName) ? formatPersonName(cleanedFormName) : undefined)
      || (cleanedSenderName && isRealName(cleanedSenderName) ? formatPersonName(cleanedSenderName) : undefined);

    const phoneMatch = userText.match(/(?:phone\s*number|phone|mobile):\s*([+\d\s()-]{7,})/i);
    const extractedFormPhone = phoneMatch && phoneMatch[1].trim().length > 6 ? phoneMatch[1].replace(/[^\d+]/g, '').trim() : phone;

    const isUkNumber = extractedFormPhone.startsWith('+44') || extractedFormPhone.startsWith('44') || phone.startsWith('+44') || phone.startsWith('44') || userText.includes('+44');

    if (!attributionObj && userText && (
        userText.includes('[META]') || 
        userText.includes('[FB]') || 
        userText.includes('[IG]') || 
        userText.toLowerCase().includes('instagram') || 
        userText.toLowerCase().includes('facebook') || 
        userText.toLowerCase().includes('filled in your form') || 
        userText.toLowerCase().includes('filled out your form') || 
        userText.toLowerCase().includes('looking to invest in dubai property') ||
        userText.toLowerCase().includes('signed up for this event')
      )
    ) {
      leadSource = 'FACEBOOK_ADS';
      const matchedCamp = getCampaignForLead({ phone: extractedFormPhone, userText: userText.toLowerCase() });
      attributionObj = {
        source: 'FACEBOOK_ADS',
        medium: 'cpc',
        campaign: matchedCamp.type === 'event' ? matchedCamp.name : (isUkNumber ? 'Meta UK Campaign' : 'Meta Instant Form'),
      };
    }

    const manychatSubId = body.id || body.subscriber_id || body.user_id || body.contact_id;

    const lead = await LeadService.findOrCreateLead({
      phone: extractedFormPhone,
      fullName: extractedName,
      email: extractedEmail,
      manychatId: manychatSubId ? String(manychatSubId) : undefined,
      leadSource,
      attribution: attributionObj,
    });

    const conversation = await LeadService.getOrCreateConversation(lead.id);

    if (userText && userText.trim()) {
      const recentLeadMsg = await prisma.message.findFirst({
        where: {
          conversationId: conversation.id,
          senderType: SenderType.LEAD,
          createdAt: { gte: new Date(Date.now() - 3000) },
        },
        orderBy: { createdAt: 'desc' },
      });
      const isDuplicateLeadMessage = recentLeadMsg
        && recentLeadMsg.content.trim().toLowerCase() === userText.trim().toLowerCase();
      if (!isDuplicateLeadMessage) {
        await MessageService.storeMessage({ conversationId: conversation.id, senderType: SenderType.LEAD, content: userText, externalId: undefined });
      }
    }
    if (aiResult.reply && aiResult.reply.trim()) {
      const recentAiMsg = await prisma.message.findFirst({
        where: {
          conversationId: conversation.id,
          senderType: SenderType.AI,
          createdAt: { gte: new Date(Date.now() - 10000) },
        },
        orderBy: { createdAt: 'desc' },
      });
      const isDuplicateAiMessage = recentAiMsg
        && recentAiMsg.content.trim().toLowerCase() === aiResult.reply.trim().toLowerCase();
      if (!isDuplicateAiMessage) {
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

    const realPersonName = (nameFromUserMsg && isRealName(nameFromUserMsg))
      ? nameFromUserMsg
      : (aiResult.lead_updates?.full_name && isRealName(aiResult.lead_updates.full_name))
        ? formatPersonName(aiResult.lead_updates.full_name)
        : (extractedName && isRealName(extractedName))
          ? extractedName
          : undefined;

    if (realPersonName && (!isRealName(lead.fullName) || lead.fullName !== realPersonName)) {
      await prisma.lead.update({
        where: { id: lead.id },
        data: { fullName: realPersonName },
      });
      lead.fullName = realPersonName;
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
      if (isUkNumber) {
        const activeCamp = getCampaignForLead({ phone: extractedFormPhone });
        updates.buyerLocation = activeCamp.type === 'event' ? `United Kingdom (${activeCamp.displayName})` : 'United Kingdom';
      }
      if (manychatSubId && lead.manychatId !== String(manychatSubId)) updates.manychatId = String(manychatSubId);
      if (Object.keys(updates).length > 0) {
        await prisma.lead.update({ where: { id: lead.id }, data: updates });
      }
    } else {
      const fallbackUpdates: any = {};
      if (isUkNumber) {
        const activeCamp = getCampaignForLead({ phone: extractedFormPhone });
        const expectedLoc = activeCamp.type === 'event' ? `United Kingdom (${activeCamp.displayName})` : 'United Kingdom';
        if (lead.buyerLocation !== expectedLoc) fallbackUpdates.buyerLocation = expectedLoc;
      }
      if (manychatSubId && lead.manychatId !== String(manychatSubId)) {
        fallbackUpdates.manychatId = String(manychatSubId);
      }
      if (Object.keys(fallbackUpdates).length > 0) {
        await prisma.lead.update({
          where: { id: lead.id },
          data: fallbackUpdates,
        });
      }
    }

    // Sync extracted name, phone & email back to ManyChat so ManyChat does not display a blank name and can be queried
    const manychatToken = process.env.MANYCHAT_API_TOKEN;
    const finalNameForSync = isRealName(extractedName) ? extractedName : (isRealName(lead.fullName) ? lead.fullName : undefined);
    if (manychatSubId && manychatToken) {
      const parts = (finalNameForSync || '').trim().split(/\s+/);
      const firstName = parts[0] || '';
      const lastName = parts.slice(1).join(' ') || '';
      const updatePayload: any = {
        subscriber_id: Number(manychatSubId) || manychatSubId,
      };
      if (firstName) updatePayload.first_name = firstName;
      if (lastName) updatePayload.last_name = lastName;
      if (extractedEmail) {
        updatePayload.email = extractedEmail;
        updatePayload.has_opt_in_email = true;
      }
      if (extractedFormPhone && !extractedFormPhone.startsWith('+lead_') && !extractedFormPhone.startsWith('+mc_')) {
        updatePayload.phone = extractedFormPhone.startsWith('+') ? extractedFormPhone : `+${extractedFormPhone}`;
        updatePayload.has_opt_in_sms = true;
        updatePayload.consent_phrase = 'Customer Consent';
      }

      try {
        await fetch('https://api.manychat.com/fb/subscriber/updateSubscriber', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            Authorization: `Bearer ${manychatToken}`,
          },
          body: JSON.stringify(updatePayload),
        });
        console.log(`[MANYCHAT SYNC] Updated subscriber ${manychatSubId}`);
      } catch (mcErr: any) {
        console.warn('[MANYCHAT SYNC WARNING]', mcErr?.message || mcErr);
      }

      // Also set custom field 14962965 (contact_phone) for reliable WhatsApp phone lookup
      if (extractedFormPhone && !extractedFormPhone.startsWith('+lead_') && !extractedFormPhone.startsWith('+mc_')) {
        const phoneToSet = extractedFormPhone.startsWith('+') ? extractedFormPhone : `+${extractedFormPhone}`;
        try {
          await fetch('https://api.manychat.com/fb/subscriber/setCustomField', {
            method: 'POST',
            headers: {
              'Content-Type': 'application/json',
              Authorization: `Bearer ${manychatToken}`,
            },
            body: JSON.stringify({
              subscriber_id: Number(manychatSubId) || manychatSubId,
              field_id: 14962965,
              field_value: phoneToSet,
            }),
          });
          console.log(`[MANYCHAT SYNC] Set contact_phone on ManyChat subscriber ${manychatSubId} to ${phoneToSet}`);
        } catch (cfErr: any) {
          console.warn('[MANYCHAT CUSTOM FIELD SYNC WARNING]', cfErr?.message || cfErr);
        }
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
      
      let dateResolvedByRelative = false;
      if (rawDateStr.includes('tomorrow') || rawDateStr.includes('tom')) {
        meetingTime = new Date(Date.now() + 86400000);
        dateResolvedByRelative = true;
      } else if (rawDateStr.includes('today')) {
        meetingTime = new Date();
        dateResolvedByRelative = true;
      } else {
        const weekdaysMap: Record<string, number> = {
          sunday: 0, monday: 1, tuesday: 2, wednesday: 3, thursday: 4, friday: 5, saturday: 6
        };
        for (const [dayName, targetDayNum] of Object.entries(weekdaysMap)) {
          if (rawDateStr.includes(dayName)) {
            const currentDayNum = new Date().getDay();
            let daysToAdd = (targetDayNum - currentDayNum + 7) % 7;
            if (daysToAdd === 0) daysToAdd = 7; // Next occurrence
            meetingTime = new Date(Date.now() + daysToAdd * 86400000);
            dateResolvedByRelative = true;
            break;
          }
        }
      }

      // Only parse explicit "26th September" / "September 27" style dates if no relative date was found
      if (!dateResolvedByRelative) {
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
      }

      // Remove email addresses from rawDateStr so digits inside email (e.g. sabrina545) never trigger false time matches!
      const sanitizedTimeStr = ((aiResult.booking_details?.time || '') + ' ' + (aiResult.booking_details?.date || '') + ' ' + userText + ' ' + aiResult.reply)
        .replace(/[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}/g, '')
        .toLowerCase();

      let targetHour = 14; // Default to 2:00 PM for afternoon consultations (NEVER 12 AM midnight)
      let targetMin = 0;

      const explicitTimeMatch = sanitizedTimeStr.match(/\b([1-9]|1[0-2])(?::([0-5]\d))?\s*(am|pm)\b/i);
      const hour24Match = sanitizedTimeStr.match(/\b([01]?\d|2[0-3]):([0-5]\d)\b/);

      if (explicitTimeMatch) {
        let h = parseInt(explicitTimeMatch[1], 10);
        targetMin = explicitTimeMatch[2] ? parseInt(explicitTimeMatch[2], 10) : 0;
        const ampm = explicitTimeMatch[3].toLowerCase();
        if (ampm === 'pm' && h < 12) h += 12;
        if (ampm === 'am' && h === 12) h = 0;
        targetHour = h;
      } else if (hour24Match) {
        targetHour = parseInt(hour24Match[1], 10);
        targetMin = parseInt(hour24Match[2], 10);
      } else if (sanitizedTimeStr.includes('morning')) {
        targetHour = 11;
        targetMin = 0;
      } else if (sanitizedTimeStr.includes('afternoon') || sanitizedTimeStr.includes('after around 1') || sanitizedTimeStr.includes('after around 2')) {
        targetHour = 14; // 2:00 PM
        targetMin = 0;
      } else if (sanitizedTimeStr.includes('evening')) {
        targetHour = 17; // 5:00 PM
        targetMin = 0;
      }

      meetingTime.setHours(targetHour, targetMin, 0, 0);

      const replyLower = aiResult.reply.toLowerCase();
      const userTextLower = userText.toLowerCase();
      const bookingLocationRaw = (aiResult.booking_details?.location || '').toLowerCase();

      // Dynamic Campaign Resolution for Booking (auto-expiry built in)
      const bookingCampaign = getCampaignForLead({
        phone,
        userText: userTextLower,
        buyerLocation: lead?.buyerLocation || undefined,
        campaignName: attributionObj?.campaign || leadSource,
        conversationHistory: replyLower,
      });

      const isOnlineChosen = 
        userTextLower.includes('online') || 
        userTextLower.includes('google meet') || 
        userTextLower.includes('video call') || 
        userTextLower.includes('zoom') ||
        bookingLocationRaw.includes('google meet');

      let bookingLocation = bookingCampaign.location.calendarLocation;
      let bookingTimezone = bookingCampaign.timezone;

      if (isOnlineChosen) {
        bookingLocation = 'Google Meet';
        bookingTimezone = 'Asia/Dubai';
      } else if (bookingCampaign.type === 'event') {
        // For event-type campaigns, use specific event dates
        bookingLocation = bookingCampaign.location.calendarLocation;
        
        // Parse event dates from campaign config
        const eventStartDate = new Date(bookingCampaign.dates.start);
        const eventEndDate = new Date(bookingCampaign.dates.end);
        const startDay = eventStartDate.getUTCDate();
        const endDay = eventEndDate.getUTCDate();
        const eventMonth = eventStartDate.getUTCMonth(); // 0-indexed
        const eventYear = eventStartDate.getUTCFullYear();

        // Determine which day of the event
        let eventDay = startDay; // Default to first day
        if (startDay !== endDay) {
          const isSecondDay = userTextLower.includes('sunday') || userTextLower.includes(String(endDay)) || 
                             rawDateStr.includes('sunday') || rawDateStr.includes(String(endDay));
          if (isSecondDay) eventDay = endDay;
        }

        // Use campaign timezone for proper local time calculation
        // For BST (UTC+1): local hour - 1 = UTC hour. Date.UTC handles negative hours correctly.
        const tzOffset = bookingCampaign.timezone === 'Europe/London' ? 1 : 
                         bookingCampaign.timezone === 'Asia/Dubai' ? 4 : 0;
        meetingTime = new Date(Date.UTC(eventYear, eventMonth, eventDay, targetHour - tzOffset, targetMin, 0));
      } else {
        if (bookingLocationRaw.includes('bluewaters') || bookingLocationRaw.includes('pods')) {
          bookingLocation = 'The Pods, Bluewaters Island, Dubai';
          bookingTimezone = 'Asia/Dubai';
        } else if (
          rawDateStr.includes('burlington') || 
          rawDateStr.includes('business bay') || 
          rawDateStr.includes('ellington') ||
          bookingLocationRaw.includes('burlington') ||
          bookingLocationRaw.includes('ellington')
        ) {
          bookingLocation = 'Ellington Properties, Burlington Tower, Business Bay, Dubai';
          bookingTimezone = 'Asia/Dubai';
        } else if (aiResult.booking_details?.location && aiResult.booking_details.location.trim().length > 3 && !aiResult.booking_details.location.toLowerCase().includes('google meet')) {
          bookingLocation = aiResult.booking_details.location.trim();
        }

        // Align target hour to timezone offset for non-event meetings
        const tzOffset = bookingTimezone === 'Europe/London' ? 1 : 
                         bookingTimezone === 'Asia/Dubai' ? 4 : 0;
        meetingTime = new Date(Date.UTC(
          meetingTime.getFullYear(),
          meetingTime.getMonth(),
          meetingTime.getDate(),
          targetHour - tzOffset,
          targetMin,
          0
        ));
      }

      await CalendarService.createBooking({
        leadId: lead.id,
        meetingTime,
        location: bookingLocation,
        timezone: bookingTimezone,
      });

      console.log('[BG-LOG] ✅ Meeting Booking created & Google Calendar invite dispatched to', lead.email, 'at', bookingLocation, '(TZ:', bookingTimezone, ') on', meetingTime.toISOString());
    } else if (aiResult.action === 'HANDOFF' || aiResult.action === 'DAY_MODE_HANDOFF') {
      await prisma.lead.update({
        where: { id: lead.id },
        data: { aiEnabled: false, handoffStatus: true },
      });
      try {
        await prisma.handoff.create({
          data: {
            leadId: lead.id,
            reason: aiResult.handoff_reason || (aiResult.action === 'DAY_MODE_HANDOFF' ? 'Day Mode: Lead queued for manual chat' : 'Human takeover requested'),
          },
        });
      } catch (_) { /* handoff record may already exist */ }
      if (aiResult.action === 'HANDOFF') {
        await NotificationService.notifyMineshHandoff(senderName, phone, aiResult.handoff_reason || 'Human takeover requested');
      }
      console.log(`[BG-LOG] ✅ ${aiResult.action}: AI paused & lead queued for human takeover!`);
    }

    console.log('[BG-LOG] ✅ Messages and attribution saved to DB');
  } catch (err: any) {
    console.error('[BG-LOG] Error in logToDatabase:', err.message);
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
