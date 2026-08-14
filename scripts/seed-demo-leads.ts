import { PrismaClient, LeadStatus, SenderType } from '@prisma/client';

const prisma = new PrismaClient();

async function main() {
  console.log('Seeding demo leads for Minesh Patel dashboard review...');

  // 1. Clear previous test leads if any
  await prisma.message.deleteMany({});
  await prisma.conversation.deleteMany({});
  await prisma.leadAttribution.deleteMany({});
  await prisma.voucher.deleteMany({});
  await prisma.booking.deleteMany({});
  await prisma.handoff.deleteMany({});
  await prisma.lead.deleteMany({});

  // 2. Lead 1: Qualified Investor (London/Dubai)
  const lead1 = await prisma.lead.create({
    data: {
      phone: '+447911123456',
      fullName: 'Sir Richard Al-Maktoum',
      email: 'richard@investments.co.uk',
      leadSource: 'FACEBOOK_ADS',
      buyerLocation: 'London, UK',
      purchasePurpose: 'Investment (High ROI)',
      budgetMin: 3500000,
      budgetMax: 7000000,
      timeline: 'Immediate (Next 14 Days)',
      status: LeadStatus.QUALIFIED,
      aiEnabled: true,
      handoffStatus: false,
      attributions: {
        create: {
          source: 'FACEBOOK_ADS',
          medium: 'cpc',
          campaign: 'Sobha City Abu Dhabi - High Net Worth UK',
          utmSource: 'fb',
          utmMedium: 'cpc',
          utmCampaign: 'sobha_ad_uk_q3',
        },
      },
      conversations: {
        create: {
          active: true,
          messages: {
            create: [
              {
                senderType: SenderType.LEAD,
                content: 'Hi, I saw your Facebook ad for Sobha City Abu Dhabi. Are 3-bedroom waterfront villas available?',
              },
              {
                senderType: SenderType.AI,
                content: 'Hello Sir Richard! Welcome to The Pods Real Estate. Yes, we have exclusive 3-bedroom waterfront villas at Sobha City Abu Dhabi starting from AED 3.8M with a 60/40 payment plan. Are you looking to invest or move in personally?',
              },
              {
                senderType: SenderType.LEAD,
                content: 'Investment. I prefer high rental yield. Can we schedule a meeting at your Bluewaters office when I land in Dubai next Tuesday?',
              },
              {
                senderType: SenderType.AI,
                content: 'Excellent choice. We would be delighted to host you at our Pods presentation desk at Bluewaters Island. I am booking Tuesday at 2:00 PM for you.',
              },
            ],
          },
        },
      },
    },
  });

  // 2. Lead 2: End-user buyer (Abu Dhabi / UAE)
  const lead2 = await prisma.lead.create({
    data: {
      phone: '+971509876543',
      fullName: 'Dr. Fatima Al-Mansoori',
      email: 'fatima.almansoori@doh.gov.ae',
      leadSource: 'INSTAGRAM_ADS',
      buyerLocation: 'Abu Dhabi, UAE',
      purchasePurpose: 'Personal Luxury Residence',
      budgetMin: 2000000,
      budgetMax: 4000000,
      timeline: '1-3 Months',
      status: LeadStatus.AI_ENGAGED,
      aiEnabled: true,
      handoffStatus: false,
      attributions: {
        create: {
          source: 'INSTAGRAM_ADS',
          medium: 'story_ad',
          campaign: 'Sobha River Cove - Luxury Living AD',
          utmSource: 'ig',
          utmMedium: 'social',
          utmCampaign: 'sobha_rivercove_ad',
        },
      },
      conversations: {
        create: {
          active: true,
          messages: {
            create: [
              {
                senderType: SenderType.LEAD,
                content: 'Good evening. What is the starting price for 2-bedroom apartments at River Cove in Sobha City Abu Dhabi?',
              },
              {
                senderType: SenderType.AI,
                content: 'Good evening Dr. Fatima! River Cove at Sobha City Abu Dhabi starts at AED 1.85M for premium 2-bedroom residences featuring lagoon and skyline views.',
              },
            ],
          },
        },
      },
    },
  });

  // 3. Lead 3: VIP Booking with Voucher Issued
  const lead3 = await prisma.lead.create({
    data: {
      phone: '+971564321098',
      fullName: 'Tariq & Sarah Sterling',
      email: 'tariq.sterling@globalholdings.com',
      leadSource: 'WHATSAPP_DIRECT',
      buyerLocation: 'Dubai Marina',
      purchasePurpose: 'Luxury Penthouse',
      budgetMin: 5000000,
      budgetMax: 10000000,
      timeline: 'Immediate',
      status: LeadStatus.MEETING_BOOKED,
      aiEnabled: false,
      handoffStatus: true,
      attributions: {
        create: {
          source: 'WHATSAPP_DIRECT',
          medium: 'referral',
          campaign: 'VIP Direct Concierge',
        },
      },
      conversations: {
        create: {
          active: true,
          messages: {
            create: [
              {
                senderType: SenderType.LEAD,
                content: 'I would like to claim the AED 20,000 VIP voucher for Sobha City Abu Dhabi and meet with Minesh.',
              },
              {
                senderType: SenderType.AI,
                content: 'Welcome Tariq! I have generated your exclusive VIP Voucher (PODS-VIP-8821) valued at AED 20,000 towards your booking. Minesh Patel has been notified and will assist you directly.',
              },
            ],
          },
        },
      },
    },
  });

  console.log('Successfully seeded 3 demo leads!');
}

main()
  .catch(e => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
