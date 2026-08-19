import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { MessageService } from '@/lib/services/messageService';
import { SenderType } from '@prisma/client';

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const { conversationId, text } = body;

    if (!conversationId || !text || !text.trim()) {
      return NextResponse.json({ error: 'Missing conversationId or message text' }, { status: 400 });
    }

    const conversation = await prisma.conversation.findUnique({
      where: { id: conversationId },
      include: { lead: true },
    });

    if (!conversation) {
      return NextResponse.json({ error: 'Conversation not found' }, { status: 404 });
    }

    // 1. Store the outbound message in database
    const savedMsg = await MessageService.storeMessage({
      conversationId: conversation.id,
      senderType: SenderType.AI,
      content: text.trim(),
    });

    // 2. Dispatch via ManyChat WhatsApp Send API if MANYCHAT_API_TOKEN is available
    const manychatToken = process.env.MANYCHAT_API_TOKEN;
    const phone = conversation.lead.phone;

    if (manychatToken && phone && !phone.startsWith('+lead_guest')) {
      try {
        const cleanPhone = phone.replace(/[^0-9]/g, '');
        // Dispatch to ManyChat subscriber via WhatsApp API
        await fetch('https://api.manychat.com/fb/sending/sendContentByUserRef', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            Authorization: `Bearer ${manychatToken}`,
          },
          body: JSON.stringify({
            phone: cleanPhone,
            data: {
              version: 'v2',
              content: {
                messages: [
                  {
                    type: 'text',
                    text: text.trim(),
                  },
                ],
              },
            },
          }),
        });
      } catch (waErr: any) {
        console.error('ManyChat outbound send error:', waErr.message);
      }
    }

    return NextResponse.json({
      success: true,
      message: savedMsg,
    });
  } catch (error: any) {
    console.error('Manual reply error:', error.message);
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
