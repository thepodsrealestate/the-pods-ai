import { PrismaClient, LeadStatus } from '@prisma/client';

async function main() {
  const prisma = new PrismaClient();
  
  console.log("Seeding realistic traffic sources and campaigns for dashboard...");

  const mockLeads = [
    {
      phone: "+971501112222",
      fullName: "Alexander Romanov",
      leadSource: "FACEBOOK_ADS",
      buyerLocation: "Dubai Marina",
      purchasePurpose: "INVESTMENT",
      budgetMin: 1200000,
      budgetMax: 1800000,
      timeline: "IMMEDIATE",
      status: LeadStatus.QUALIFIED,
      attribution: {
        source: "FACEBOOK_ADS",
        medium: "cpc",
        campaign: "Danube Bayz 101 - Launch",
        utmSource: "facebook",
        utmMedium: "paid_ad",
        utmCampaign: "danube_bayz_101"
      }
    },
    {
      phone: "+447700900077",
      fullName: "Sarah Jenkins",
      leadSource: "INSTAGRAM_ADS",
      buyerLocation: "Jumeirah Lake Towers",
      purchasePurpose: "SECONDARY_RESIDENCE",
      budgetMin: 900000,
      budgetMax: 1400000,
      timeline: "3_TO_6_MONTHS",
      status: LeadStatus.QUALIFIED,
      attribution: {
        source: "INSTAGRAM_ADS",
        medium: "cpc",
        campaign: "Sobha Hartland Waterfront Luxury",
        utmSource: "instagram",
        utmMedium: "story_ad",
        utmCampaign: "sobha_hartland_ii"
      }
    },
    {
      phone: "+971556667777",
      fullName: "Faisal Al-Mansoor",
      leadSource: "GOOGLE_SEARCH",
      buyerLocation: "Business Bay",
      purchasePurpose: "INVESTMENT",
      budgetMin: 2000000,
      budgetMax: 3500000,
      timeline: "IMMEDIATE",
      status: LeadStatus.QUALIFIED,
      attribution: {
        source: "GOOGLE_SEARCH",
        medium: "organic",
        campaign: "Dubai Off-Plan Best Payment Plans",
        utmSource: "google",
        utmMedium: "seo",
        utmCampaign: "off_plan_search"
      }
    },
    {
      phone: "+971503334444",
      fullName: "Elena Petrova",
      leadSource: "TIKTOK",
      buyerLocation: "Downtown Dubai",
      purchasePurpose: "INVESTMENT",
      budgetMin: 1500000,
      budgetMax: 2200000,
      timeline: "IMMEDIATE",
      status: LeadStatus.QUALIFIED,
      attribution: {
        source: "TIKTOK",
        medium: "video_cpc",
        campaign: "Mercedes Benz Places by Binghatti",
        utmSource: "tiktok",
        utmMedium: "infeed_ad",
        utmCampaign: "binghatti_mercedes"
      }
    }
  ];

  for (const m of mockLeads) {
    const lead = await prisma.lead.upsert({
      where: { phone: m.phone },
      update: {
        fullName: m.fullName,
        leadSource: m.leadSource,
        buyerLocation: m.buyerLocation,
        purchasePurpose: m.purchasePurpose,
        budgetMin: m.budgetMin,
        budgetMax: m.budgetMax,
        timeline: m.timeline,
        status: m.status
      },
      create: {
        phone: m.phone,
        fullName: m.fullName,
        leadSource: m.leadSource,
        buyerLocation: m.buyerLocation,
        purchasePurpose: m.purchasePurpose,
        budgetMin: m.budgetMin,
        budgetMax: m.budgetMax,
        timeline: m.timeline,
        status: m.status,
        attributions: {
          create: {
            source: m.attribution.source,
            medium: m.attribution.medium,
            campaign: m.attribution.campaign,
            utmSource: m.attribution.utmSource,
            utmMedium: m.attribution.utmMedium,
            utmCampaign: m.attribution.utmCampaign
          }
        }
      }
    });

    console.log(`Created/Updated lead: ${lead.fullName} (${lead.leadSource})`);
  }

  await prisma.$disconnect();
  console.log("Seeding completed successfully!");
}

main().catch(console.error);
