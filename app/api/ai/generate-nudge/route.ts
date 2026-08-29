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

    let purpose = "property investment";
    let isLondonEvent = false;

    if (leadId) {
      const lead = await prisma.lead.findUnique({
        where: { id: leadId },
        include: { attributions: true }
      });
      if (lead) {
        leadName = lead.fullName || "there";
        location = lead.buyerLocation || "Dubai";
        budget = lead.budgetMax ? `AED ${lead.budgetMax.toLocaleString()}` : "AED 1.5M";
        purpose = lead.purchasePurpose || "property investment";
        isLondonEvent = Boolean(
          lead.meetingPreference?.toLowerCase().includes("london") ||
          lead.meetingPreference?.toLowerCase().includes("3rd sept") ||
          lead.attributions.some(a => a.campaign?.toLowerCase().includes("london"))
        );
      }
    }

    const firstName = leadName.split(" ")[0] || "there";

    if (isLondonEvent) {
      return NextResponse.json({
        success: true,
        nudge: `Hey ${firstName}! Minesh here from The Pods. We're finalizing the VIP attendee list for the Danube London Open House this Thursday (Sept 3rd @ Knightsbridge). Were you planning to join us in person, or should I send the exclusive event floor plans over WhatsApp?`,
      });
    }

    return NextResponse.json({
      success: true,
      nudge: `Hey ${firstName}! Minesh Patel here from The Pods Real Estate. Just wanted to check in regarding your Dubai property inquiry. Would you prefer me to send over the latest 1% monthly payment plan options on WhatsApp, or set up a quick 5-minute call?`,
    });
  } catch (error: any) {
    return NextResponse.json(
      { success: false, error: error.message },
      { status: 500 }
    );
  }
}
