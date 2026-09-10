import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { AIService } from '@/lib/services/aiService';

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const { conversationId, messages } = body;

    let chatHistory = messages || [];

    let leadData: any = null;

    if (conversationId && chatHistory.length === 0) {
      const conv = await prisma.conversation.findUnique({
        where: { id: conversationId },
        include: {
          messages: { orderBy: { createdAt: 'asc' }, take: 10 },
          lead: true,
        },
      });

      if (conv) {
        leadData = conv.lead;
        chatHistory = conv.messages.map((m) => `${m.senderType}: ${m.content}`);
      }
    }

    const fullHistoryText = chatHistory.join('\n');
    const isUkLead = 
      (leadData?.phone && (leadData.phone.startsWith('+44') || leadData.phone.startsWith('44'))) ||
      fullHistoryText.includes('+44') ||
      /leicester|marriott|expo|danube/i.test(fullHistoryText);

    const prompt = `You are the executive AI Co-Pilot for Minesh Patel, Director at The Pods Real Estate (Dubai & London).
Analyze the conversation history below and generate 3 short, high-converting executive responses that Minesh Patel can send to the client.

CONVERSATION HISTORY:
${fullHistoryText}

GUIDELINES:
- Option 1 (Direct & Professional): Brief, polite, luxury tone answering the client's latest query.
- Option 2 (ROI & Property Focus): Highlights Danube 1% monthly payment plan, capital appreciation, high rental yields (8-10%), or 0% UK property tax.
- Option 3 (VIP Presentation Call to Action): ${isUkLead ? 'Invites the client to reserve a private 1-on-1 VIP consultation with Minesh Patel at the Dubai Property Expo at the Leicester Marriott Hotel on Saturday 26th & Sunday 27th September (or Google Meet). NEVER suggest Bluewaters Island in Dubai to UK leads!' : 'Invites the client for a private consultation at The Pods Bluewaters Island or via Google Meet.'}

Return ONLY a JSON array with 3 objects:
[
  { "type": "Professional", "text": "..." },
  { "type": "ROI & Investment", "text": "..." },
  { "type": "VIP Presentation Invite", "text": "..." }
]`;

    const aiRes = await AIService.generateResponse({
      leadName: leadData?.fullName || 'Client',
      phone: leadData?.phone || undefined,
      buyerLocation: leadData?.buyerLocation || (isUkLead ? 'United Kingdom' : undefined),
      campaignName: isUkLead ? 'Danube_DubaiExpo_Leicester_Sept26-27' : undefined,
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
      suggestions: isUkLead ? [
        {
          type: "Professional",
          text: "Hey! Thanks for registering for the Dubai Property Expo with Danube Properties. Are you planning to attend the event in person at the Leicester Marriott Hotel on September 26th–27th?",
        },
        {
          type: "ROI & Investment",
          text: "At the Leicester Expo, we are showcasing Danube's luxury developments starting from £150k with 1% monthly plans and up to 8-10% tax-free rental returns.",
        },
        {
          type: "VIP Presentation Invite",
          text: "We are scheduling private 1-on-1 VIP consultations with Minesh Patel at the Leicester Marriott Hotel on Saturday 26th & Sunday 27th September. Would Saturday or Sunday suit you best, or would you prefer a quick Google Meet?",
        },
      ] : [
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
