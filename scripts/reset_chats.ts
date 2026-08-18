import { prisma } from '../lib/prisma';

async function main() {
  console.log('Resetting all test conversations and leads for a fresh clean start...');

  // Delete all messages, conversations, bookings, vouchers, handoffs, and webhook events
  await prisma.message.deleteMany({});
  await prisma.conversation.deleteMany({});
  await prisma.booking.deleteMany({});
  await prisma.voucher.deleteMany({});
  await prisma.handoff.deleteMany({});
  await prisma.leadAttribution.deleteMany({});
  await prisma.webhookEvent.deleteMany({});
  await prisma.lead.deleteMany({});

  console.log('? All old test chats and duplicate leads wiped clean!');

  // Seed pristine clean team & VIP benchmark profiles
  const benchmarkLeads = [
    {
      fullName: 'Minesh Patel',
      phone: '+971501234567',
      buyerLocation: 'Dubai Marina',
      purchasePurpose: 'Executive Desk / VIP',
      status: 'QUALIFIED' as const,
      initialMsg: 'Hello Aria, this is Minesh Patel checking in on today\'s lead volume.'
    },
    {
      fullName: 'Reshma Patel',
      phone: '+971502345678',
      buyerLocation: 'London / Dubai',
      purchasePurpose: 'Luxury Portfolio',
      status: 'QUALIFIED' as const,
      initialMsg: 'Hi Aria, please prepare the Sobha Hartland II presentation for our London client.'
    },
    {
      fullName: 'Sanyukta',
      phone: '+971503456789',
      buyerLocation: 'Dubai',
      purchasePurpose: 'Investor Client',
      status: 'QUALIFIED' as const,
      initialMsg: 'Hi Aria, is the Danube Diamondz payment plan updated for 2026?'
    },
    {
      fullName: 'Lord Alexander Vance',
      phone: '+447700900077',
      buyerLocation: 'Mayfair, London',
      purchasePurpose: 'Investment ROI',
      status: 'MEETING_BOOKED' as const,
      initialMsg: 'Good day. I am looking for a waterfront penthouse on Palm Jumeirah or Bluewaters with an 8-10% net yield.'
    },
    {
      fullName: 'Dr. Fatima Al-Mansoori',
      phone: '+971509876543',
      buyerLocation: 'Abu Dhabi',
      purchasePurpose: 'Personal Residence',
      status: 'AI_ENGAGED' as const,
      initialMsg: 'Good evening. I am looking for a 4-bedroom luxury villa in Sobha Hartland II.'
    }
  ];

  for (const leadData of benchmarkLeads) {
    const lead = await prisma.lead.create({
      data: {
        fullName: leadData.fullName,
        phone: leadData.phone,
        buyerLocation: leadData.buyerLocation,
        purchasePurpose: leadData.purchasePurpose,
        status: leadData.status,
        aiEnabled: true,
        conversations: {
          create: {
            active: true,
            messages: {
              create: [
                {
                  senderType: 'LEAD',
                  content: leadData.initialMsg,
                  createdAt: new Date(Date.now() - 3600000)
                },
                {
                  senderType: 'AI',
                  content: `Welcome ${leadData.fullName}! The Pods Real Estate luxury concierge is active. We have prepared the verified off-plan prospectus for you.`,
                  createdAt: new Date(Date.now() - 3500000)
                }
              ]
            }
          }
        }
      }
    });
    console.log(`Created clean profile: ${lead.fullName}`);
  }


  console.log('?? Fresh database reset complete! Ready for clean testing.');
}

main().finally(() => prisma.$disconnect());
