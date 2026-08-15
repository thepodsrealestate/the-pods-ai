import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { AIService } from '@/lib/services/aiService';

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const { leadId } = body;

    if (!leadId) {
      return NextResponse.json({ success: false, error: 'Lead ID required' }, { status: 400 });
    }

    const lead = await prisma.lead.findUnique({
      where: { id: leadId },
      include: {
        conversations: {
          include: { messages: { orderBy: { createdAt: 'asc' } } },
        },
        bookings: true,
        attributions: true,
      },
    });

    if (!lead) {
      return NextResponse.json({ success: false, error: 'Lead not found' }, { status: 404 });
    }

    const allMessages = lead.conversations
      .flatMap((c) => c.messages)
      .map((m) => `${m.senderType}: ${m.content}`)
      .join('\n');

    const prompt = `You are the lead intelligence analyst for The Pods Real Estate. Analyze this buyer lead and return a JSON executive dossier summary.

LEAD PROFILE:
Name: ${lead.fullName || 'Unknown'}
Phone: ${lead.phone}
Email: ${lead.email || 'N/A'}
Status: ${lead.status}
Budget: AED ${lead.budgetMin || 0} - AED ${lead.budgetMax || 0}
Location Preference: ${lead.buyerLocation || 'N/A'}
Timeline: ${lead.timeline || 'N/A'}

CONVERSATION TRANSCRIPT:
${allMessages || 'No conversation recorded yet.'}

RETURN ONLY JSON:
{
  "buyingIntent": "Short summary of what property they want",
  "coreMotivator": "High ROI / Capital Appreciation / Personal Residence / Golden Visa",
  "recommendedAction": "Actionable next step for broker",
  "dealHeatScore": "HOT" | "WARM" | "COLD",
  "heatReason": "Brief explanation for the heat score"
}`;

    const aiRes = await AIService.generateResponse({
      leadName: lead.fullName || 'Client',
      conversationHistory: [],
      userMessage: prompt,
    });

    try {
      const jsonMatch = aiRes.reply.match(/\{[\s\S]*\}/);
      if (jsonMatch) {
        const briefing = JSON.parse(jsonMatch[0]);
        return NextResponse.json({ success: true, briefing });
      }
    } catch (e) {}

    // Fallback default briefing
    const isQualified = lead.status === 'QUALIFIED' || (lead.budgetMax && lead.budgetMax >= 3000000);
    return NextResponse.json({
      success: true,
      briefing: {
        buyingIntent: lead.buyerLocation ? `Seeking luxury property in ${lead.buyerLocation}` : "High-net-worth real estate investment",
        coreMotivator: "Capital Appreciation & Tax-Free Rental Yield",
        recommendedAction: "Schedule VIP Presentation at Bluewaters office",
        dealHeatScore: isQualified ? "HOT" : "WARM",
        heatReason: isQualified ? "High budget target & verified investor inquiry" : "Standard inquiry awaiting detailed qualification",
      },
    });
  } catch (error: any) {
    return NextResponse.json(
      { success: false, error: error.message },
      { status: 500 }
    );
  }
}
