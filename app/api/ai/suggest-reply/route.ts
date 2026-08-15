import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { AIService } from '@/lib/services/aiService';

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const { conversationId, messages } = body;

    let chatHistory = messages || [];

    if (conversationId && chatHistory.length === 0) {
      const conv = await prisma.conversation.findUnique({
        where: { id: conversationId },
        include: {
          messages: { orderBy: { createdAt: 'asc' }, take: 10 },
          lead: true,
        },
      });

      if (conv) {
        chatHistory = conv.messages.map((m) => `${m.senderType}: ${m.content}`);
      }
    }

    const prompt = `You are the executive AI Co-Pilot for Minesh Patel, Director at The Pods Real Estate (Dubai & London).
Analyze the conversation history below and generate 3 short, high-converting executive responses that Minesh Patel can send to the client.

CONVERSATION HISTORY:
${chatHistory.join('\n')}

GUIDELINES:
- Option 1 (Direct & Professional): Brief, polite, luxury tone answering the client's latest query.
- Option 2 (ROI & Property Focus): Highlights capital appreciation, payment plans, or Golden Visa benefits.
- Option 3 (VIP Presentation Call to Action): Invites the client for a private consultation at Bluewaters Island or London desk.

Return ONLY a JSON array with 3 objects:
[
  { "type": "Professional", "text": "..." },
  { "type": "ROI & Investment", "text": "..." },
  { "type": "VIP Presentation Invite", "text": "..." }
]`;

    const aiRes = await AIService.generateResponse({
      leadName: 'Client',
      conversationHistory: [],
      userMessage: prompt,
    });

    try {
      const jsonMatch = aiRes.reply.match(/\[[\s\S]*\]/);
      if (jsonMatch) {
        const suggestions = JSON.parse(jsonMatch[0]);
        return NextResponse.json({ success: true, suggestions });
      }
    } catch (e) {}

    // Fallback default suggestions
    return NextResponse.json({
      success: true,
      suggestions: [
        {
          type: "Professional",
          text: "Good day! I would be delighted to assist you with our latest luxury launches at Bluewaters Island and Sobha Hartland.",
        },
        {
          type: "ROI & Investment",
          text: "Our featured developments offer up to 8% guaranteed net yields alongside 10-year UAE Golden Visa eligibility. Would you like our Q3 investment prospectus?",
        },
        {
          type: "VIP Presentation Invite",
          text: "I have reserved private presentation slots at our Bluewaters Island Pods office this Tuesday. Shall I confirm a time for your consultation?",
        },
      ],
    });
  } catch (error: any) {
    return NextResponse.json(
      { success: false, error: error.message },
      { status: 500 }
    );
  }
}
