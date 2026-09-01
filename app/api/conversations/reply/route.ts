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

    const manychatToken = process.env.MANYCHAT_API_TOKEN;
    const phone = conversation.lead.phone;

    if (!manychatToken) {
      return NextResponse.json({ error: 'WhatsApp delivery is not configured' }, { status: 503 });
    }
    if (!phone || phone.startsWith('+lead_')) {
      return NextResponse.json({ error: 'This lead does not have a deliverable WhatsApp phone number' }, { status: 422 });
    }

    let subscriberId = phone.startsWith('+mc_') ? phone.slice(4) : undefined;
    if (!subscriberId) {
      const cleanPhone = phone.replace(/[^0-9]/g, '');
      const findRes = await fetch(
        `https://api.manychat.com/fb/subscriber/findBySystemField?phone=%2B${cleanPhone}`,
        { headers: { Authorization: `Bearer ${manychatToken}` } }
      );
      const findData = await findRes.json().catch(() => ({}));

      if (!findRes.ok) {
        console.error('ManyChat subscriber lookup failed:', findRes.status, findData);
        return NextResponse.json({ error: 'Unable to locate the WhatsApp contact' }, { status: 502 });
      }

      subscriberId = findData?.data?.id || findData?.data?.[0]?.id;
    }

    if (!subscriberId) {
      return NextResponse.json({ error: 'WhatsApp contact was not found in ManyChat' }, { status: 404 });
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

    if (!sendRes.ok || sendData?.status === 'error') {
      console.error('ManyChat outbound send failed:', sendRes.status, sendData);
      return NextResponse.json({ error: 'WhatsApp rejected the outbound message' }, { status: 502 });
    }

    const savedMsg = await MessageService.storeMessage({
      conversationId: conversation.id,
      senderType: SenderType.HUMAN_AGENT,
      content: text.trim(),
    });
    await prisma.lead.update({
      where: { id: conversation.leadId },
      data: { handoffStatus: false },
    });

    return NextResponse.json({
      success: true,
      delivered: true,
      message: savedMsg,
    });
  } catch (error: any) {
    console.error('Manual reply error:', error.message);
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
