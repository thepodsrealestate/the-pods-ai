import { NextRequest, NextResponse } from 'next/server';
import { AIService } from '@/lib/services/aiService';

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const { budgetMax, buyerLocation } = body;

    const targetBudget = budgetMax || 5000000;
    const targetLocation = buyerLocation || "Bluewaters Island / Dubai Marina";

    const prompt = `You are the lead property investment strategist at The Pods Real Estate. Match 2 luxury off-plan developments in Dubai for a buyer with a budget of AED ${targetBudget} seeking properties in ${targetLocation}.

Calculate realistic payment plan terms:
- Down Payment: 20%
- Construction Installments: 60% over 3 years (1% monthly)
- Handover / Post-Handover: 20%
- Golden Visa Eligible: Yes (if budget >= 2,000,000 AED)

Return ONLY JSON:
{
  "matchedProjects": [
    {
      "projectName": "Sobha Hartland II Penthouses",
      "developer": "Sobha Realty",
      "startingPrice": "AED ${targetBudget}",
      "location": "Hartland Estate",
      "downPayment": "AED ${(targetBudget * 0.2).toLocaleString()}",
      "monthlyInstallment": "AED ${(targetBudget * 0.01).toLocaleString()}",
      "goldenVisaEligible": true
    },
    {
      "projectName": "Danube Bayz 101 Sky Suites",
      "developer": "Danube Properties",
      "startingPrice": "AED ${(targetBudget * 0.85).toLocaleString()}",
      "location": "Business Bay / Downtown",
      "downPayment": "AED ${(targetBudget * 0.85 * 0.2).toLocaleString()}",
      "monthlyInstallment": "AED ${(targetBudget * 0.85 * 0.01).toLocaleString()}",
      "goldenVisaEligible": true
    }
  ]
}`;

    const aiRes = await AIService.generateResponse({
      leadName: 'Property Investor',
      conversationHistory: [],
      userMessage: prompt,
    });

    try {
      const jsonMatch = aiRes.reply.match(/\{[\s\S]*\}/);
      if (jsonMatch) {
        const result = JSON.parse(jsonMatch[0]);
        return NextResponse.json({ success: true, projects: result.matchedProjects });
      }
    } catch (e) {}

    return NextResponse.json({
      success: true,
      projects: [
        {
          projectName: "Sobha Hartland II Penthouses",
          developer: "Sobha Realty",
          startingPrice: `AED ${targetBudget.toLocaleString()}`,
          location: targetLocation,
          downPayment: `AED ${(targetBudget * 0.2).toLocaleString()} (20%)`,
          monthlyInstallment: `AED ${(targetBudget * 0.01).toLocaleString()} (1% Monthly)`,
          goldenVisaEligible: targetBudget >= 2000000,
        },
        {
          projectName: "Danube Bayz 101 Sky Suites",
          developer: "Danube Properties",
          startingPrice: `AED ${(targetBudget * 0.85).toLocaleString()}`,
          location: "Business Bay / Downtown",
          downPayment: `AED ${(targetBudget * 0.85 * 0.2).toLocaleString()} (20%)`,
          monthlyInstallment: `AED ${(targetBudget * 0.85 * 0.01).toLocaleString()} (1% Monthly)`,
          goldenVisaEligible: targetBudget >= 2000000,
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
