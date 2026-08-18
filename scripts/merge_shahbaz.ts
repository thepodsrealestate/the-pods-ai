import { prisma } from '../lib/prisma';

async function main() {
  console.log('Merging all Shahbaz leads into 1 unified conversation...');

  const shahbazLeads = await prisma.lead.findMany({
    where: { fullName: { contains: 'Shahbaz', mode: 'insensitive' } },
    include: { conversations: { include: { messages: true } } },
    orderBy: { createdAt: 'asc' }
  });

  console.log(`Found ${shahbazLeads.length} Shahbaz records.`);


  if (shahbazLeads.length > 1) {
    const primary = shahbazLeads[0];
    const primaryConv = primary.conversations[0];

    for (let i = 1; i < shahbazLeads.length; i++) {
      const dup = shahbazLeads[i];
      for (const conv of dup.conversations) {
        for (const msg of conv.messages) {
          if (primaryConv) {
            await prisma.message.create({
              data: {
                conversationId: primaryConv.id,
                senderType: msg.senderType,
                content: msg.content,
                createdAt: msg.createdAt
              }
            });
          }
        }
      }
      await prisma.lead.delete({ where: { id: dup.id } });
    }

    await prisma.lead.update({
      where: { id: primary.id },
      data: { phone: '+lead_shahbaz', fullName: 'Shahbaz' }
    });
    console.log('? Shahbaz leads successfully merged into 1 single thread!');
  }
}

main().finally(() => prisma.$disconnect());
