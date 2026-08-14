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
   * Get Conversation Message History
   */
  static async getConversationHistory(conversationId: string, limit: number = 20) {
    return await prisma.message.findMany({
      where: { conversationId },
      orderBy: { createdAt: 'asc' },
      take: limit,
    });
  }
}
