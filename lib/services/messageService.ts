import { prisma } from '@/lib/prisma';
import { SenderType } from '@prisma/client';

export interface StoreMessageInput {
  conversationId: string;
  senderType: SenderType;
  content: string;
  externalId?: string;
}

export class MessageService {
  /**
   * Store Message Record with Idempotency Protection
   */
  static async storeMessage(input: StoreMessageInput) {
    if (input.externalId) {
      const existing = await prisma.message.findUnique({
        where: { externalId: input.externalId },
      });
      if (existing) return existing;
    }

    return await prisma.message.create({
      data: {
        conversationId: input.conversationId,
        senderType: input.senderType,
        content: input.content,
        externalId: input.externalId || null,
        deliveredAt: new Date(),
      },
    });
  }

  /**
   * Resolve ManyChat Subscriber ID reliably from DB webhook events or ManyChat API
   */
  static async findManyChatSubscriberId(phone: string): Promise<string | null> {
    if (!phone) return null;
    if (phone.startsWith('+mc_')) return phone.slice(4);

    const cleanPhone = phone.replace(/[^0-9]/g, '');

    // 1. Direct Lead record in database (fastest, permanent, zero external API latency)
    try {
      const lead = await prisma.lead.findFirst({
        where: {
          phone: { in: [phone, `+${cleanPhone}`, cleanPhone] },
        },
        select: { id: true, manychatId: true },
      });
      if (lead?.manychatId) return lead.manychatId;
    } catch (_) {}

    // 2. Check if we logged an inbound WhatsApp webhook event with this subscriber ID
    try {
      const event = await prisma.webhookEvent.findFirst({
        where: {
          eventType: 'inbound_whatsapp',
          OR: [
            { payload: { path: ['phone'], string_contains: cleanPhone } },
            { payload: { path: ['opt_in_phone'], string_contains: cleanPhone } },
          ],
        },
        orderBy: { createdAt: 'desc' },
      });
      const subId = (event?.payload as any)?.subscriber_id || (event?.payload as any)?.id;
      if (subId) {
        // Self-heal: persist to Lead table for instant future lookups
        prisma.lead.updateMany({
          where: { phone: { in: [phone, `+${cleanPhone}`, cleanPhone] }, manychatId: null },
          data: { manychatId: String(subId) },
        }).catch(() => {});
        return String(subId);
      }
    } catch (_) {}

    const manychatToken = process.env.MANYCHAT_API_TOKEN;
    if (manychatToken) {
      // 3. Look up by ManyChat custom field (contact_phone ID: 14962965)
      try {
        const cfRes = await fetch(
          `https://api.manychat.com/fb/subscriber/findByCustomField?field_id=14962965&field_value=%2B${cleanPhone}`,
          { headers: { Authorization: `Bearer ${manychatToken}` } }
        );
        const cfData = await cfRes.json().catch(() => ({}));
        const cfSubId = cfData?.data?.[0]?.id || cfData?.data?.id;
        if (cfSubId) {
          prisma.lead.updateMany({
            where: { phone: { in: [phone, `+${cleanPhone}`, cleanPhone] }, manychatId: null },
            data: { manychatId: String(cfSubId) },
          }).catch(() => {});
          return String(cfSubId);
        }
      } catch (_) {}

      // 4. Fallback to ManyChat system field
      try {
        const findRes = await fetch(
          `https://api.manychat.com/fb/subscriber/findBySystemField?phone=%2B${cleanPhone}`,
          { headers: { Authorization: `Bearer ${manychatToken}` } }
        );
        const findData = await findRes.json().catch(() => ({}));
        const subId = findData?.data?.id || findData?.data?.[0]?.id;
        if (subId) {
          prisma.lead.updateMany({
            where: { phone: { in: [phone, `+${cleanPhone}`, cleanPhone] }, manychatId: null },
            data: { manychatId: String(subId) },
          }).catch(() => {});
          return String(subId);
        }
      } catch (_) {}
    }

    return null;
  }

  /**
   * Send WhatsApp message directly to a lead via ManyChat API
   */
  static async sendWhatsAppDirect(phone: string, text: string) {
    const manychatToken = process.env.MANYCHAT_API_TOKEN;
    if (!manychatToken || !phone || !text.trim()) return false;

    try {
      const subscriberId = await this.findManyChatSubscriberId(phone);

      if (!subscriberId) {
        console.warn(`[sendWhatsAppDirect] Could not find subscriber for phone ${phone}`);
        return false;
      }

      const sendRes = await fetch('https://api.manychat.com/fb/sending/sendContent', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${manychatToken}`,
        },
        body: JSON.stringify({
          subscriber_id: subscriberId,
          data: {
            version: 'v2',
            content: {
              messages: [{ type: 'text', text: text.trim() }],
            },
          },
        }),
      });

      const sendData = await sendRes.json().catch(() => ({}));
      console.log(`[sendWhatsAppDirect -> ${phone}]:`, sendData?.status || 'dispatched');
      return true;
    } catch (err: any) {
      console.error('[sendWhatsAppDirect Error]:', err.message);
      return false;
    }
  }
}
