import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { AIService } from '@/lib/services/aiService';

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const { leadId } = body;

    let leadName = "Valued Client";
    let location = "Dubai Prime Locations";
    let budget = "AED 5,000,000";

    if (leadId) {
      const lead = await prisma.lead.findUnique({ where: { id: leadId } });
      if (lead) {
        leadName = lead.fullName || "Valued Client";
        location = lead.buyerLocation || "Dubai Prime Locations";
        budget = lead.budgetMax ? `AED ${lead.budgetMax.toLocaleString()}` : "AED 5,000,000";
      }
    }

    const prompt = `You are Minesh Patel, Director at The Pods Real Estate. Draft a 48-hour follow-up WhatsApp message for a client who went silent after inquiring about luxury properties in ${location} with a budget of ${budget}.

CLIENT NAME: ${leadName}

GUIDELINES:
- Luxury tone, high urgency, exclusive offer.
- Mentions a limited release unit or exclusive payment plan offer.
- Asks for a brief 2-minute phone chat or presentation booking at Bluewaters Island desk.
- Keep under 60 words.

Return JSON: { "nudgeMessage": "..." }`;

    const aiRes = await AIService.generateResponse({
      leadName,
      conversationHistory: [],
      userMessage: prompt,
    });

    try {
      const jsonMatch = aiRes.reply.match(/\{[\s\S]*\}/);
      if (jsonMatch) {
        const result = JSON.parse(jsonMatch[0]);
        return NextResponse.json({ success: true, nudge: result.nudgeMessage });
      }
    } catch (e) {}

    return NextResponse.json({
      success: true,
      nudge: `Good day ${leadName}! A limited penthouse inventory just opened up in ${location} with an attractive 1% monthly payment plan and Golden Visa eligibility. Would you like me to reserve details for your presentation?`,
    });
  } catch (error: any) {
    return NextResponse.json(
      { success: false, error: error.message },
      { status: 500 }
    );
  }
}
