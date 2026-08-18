import { prisma } from '../lib/prisma';

async function main() {
  console.log('Cleaning up and merging duplicate test leads...');

  // Find all Shankar leads
  const shankarLeads = await prisma.lead.findMany({
    where: { fullName: { contains: 'Shankar', mode: 'insensitive' } },
    include: { conversations: { include: { messages: true } } },
    orderBy: { createdAt: 'asc' }
  });

  if (shankarLeads.length > 1) {
    console.log(`Found ${shankarLeads.length} Shankar leads. Merging into first lead...`);
    const primaryShankar = shankarLeads[0];
    const primaryConv = primaryShankar.conversations[0];

    for (let i = 1; i < shankarLeads.length; i++) {
      const duplicate = shankarLeads[i];
      for (const conv of duplicate.conversations) {
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
      await prisma.lead.delete({ where: { id: duplicate.id } });
    }
    // Update primary phone to stable slug
    await prisma.lead.update({
      where: { id: primaryShankar.id },
      data: { phone: '+lead_shankar', fullName: 'Shankar' }
    });
  }

  // Find all Asif duplicate leads
  const asifLeads = await prisma.lead.findMany({
    where: {
      OR: [
        { fullName: { contains: 'Asif', mode: 'insensitive' } },
        { phone: '+' },
        { phone: { startsWith: '+lead_178' } }
      ]
    },
    include: { conversations: { include: { messages: true } } },
    orderBy: { createdAt: 'asc' }
  });

  if (asifLeads.length > 1) {
    console.log(`Found ${asifLeads.length} Asif leads. Merging into one clean thread...`);
    const primaryAsif = asifLeads[0];
    const primaryConv = primaryAsif.conversations[0];


    for (let i = 1; i < asifLeads.length; i++) {
      const duplicate = asifLeads[i];
      for (const conv of duplicate.conversations) {
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
      await prisma.lead.delete({ where: { id: duplicate.id } });
    }
    await prisma.lead.update({
      where: { id: primaryAsif.id },
      data: { phone: '+447404097586', fullName: 'Asif Khan' }
    });
  }

  console.log('? Duplicate cleanup complete!');
  const finalLeads = await prisma.lead.findMany({ select: { id: true, fullName: true, phone: true } });
  console.log('FINAL CLEAN LEADS IN DB:', JSON.stringify(finalLeads, null, 2));
}

main().finally(() => prisma.$disconnect());
