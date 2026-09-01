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
   * Send WhatsApp message directly to a lead via ManyChat API
   */
  static async sendWhatsAppDirect(phone: string, text: string) {
    const manychatToken = process.env.MANYCHAT_API_TOKEN;
    if (!manychatToken || !phone || !text.trim()) return false;

    try {
      const cleanPhone = phone.replace(/[^0-9]/g, '');
      const findRes = await fetch(
        `https://api.manychat.com/fb/subscriber/findBySystemField?phone=%2B${cleanPhone}`,
        { headers: { Authorization: `Bearer ${manychatToken}` } }
      );
      const findData = await findRes.json().catch(() => ({}));
      let subscriberId = findData?.data?.id || findData?.data?.[0]?.id;

      if (!subscriberId) {
        console.warn(`[sendWhatsAppDirect] Could not find subscriber for phone +${cleanPhone}`);
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
      console.log(`[sendWhatsAppDirect -> +${cleanPhone}]:`, sendData?.status || 'dispatched');
      return true;
    } catch (err: any) {
      console.error('[sendWhatsAppDirect Error]:', err.message);
      return false;
    }
  }
}
