import { prisma } from '../lib/prisma';

async function main() {
  console.log('Adding Minesh, Reshma, and Sanyukta leads to dashboard...');

  const teamMembers = [
    { fullName: 'Minesh Patel', phone: '+971501234567', buyerLocation: 'Dubai Marina', purchasePurpose: 'Executive Desk / VIP' },
    { fullName: 'Reshma Patel', phone: '+971502345678', buyerLocation: 'London / Dubai', purchasePurpose: 'Luxury Portfolio' },
    { fullName: 'Sanyukta', phone: '+971503456789', buyerLocation: 'Dubai', purchasePurpose: 'Investor Client' },
  ];

  for (const m of teamMembers) {
    const existing = await prisma.lead.findUnique({ where: { phone: m.phone } });
    if (!existing) {
      const lead = await prisma.lead.create({
        data: {
          phone: m.phone,
          fullName: m.fullName,
          buyerLocation: m.buyerLocation,
          purchasePurpose: m.purchasePurpose,
          status: 'QUALIFIED',
          aiEnabled: true,
          conversations: {
            create: {
              active: true,
              messages: {
                create: [
                  { senderType: 'LEAD', content: `Hello Aria, this is ${m.fullName} checking in.` },
                  { senderType: 'AI', content: `Welcome ${m.fullName}! The Pods Real Estate luxury concierge is live and active for your VIP portfolio.` }

                ]
              }
            }
          }
        }
      });
      console.log(`Created lead for ${m.fullName}`);
    }
  }
}

main().finally(() => prisma.$disconnect());
