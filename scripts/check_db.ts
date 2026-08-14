import { PrismaClient } from '@prisma/client';

async function main() {
  const p = new PrismaClient();
  
  // Check recent messages
  const msgs = await p.message.findMany({
    take: 5,
    orderBy: { createdAt: 'desc' },
    select: { content: true, senderType: true, createdAt: true }
  });
  console.log("=== RECENT MESSAGES ===");
  console.log(JSON.stringify(msgs, null, 2));
  
  // Check recent webhook events  
  const events = await p.webhookEvent.findMany({
    take: 3,
    orderBy: { createdAt: 'desc' },
    select: { eventId: true, eventType: true, createdAt: true }
  });
  console.log("\n=== RECENT WEBHOOK EVENTS ===");
  console.log(JSON.stringify(events, null, 2));
  
  // Check leads
  const leads = await p.lead.findMany({
    take: 3,
    orderBy: { createdAt: 'desc' },
    select: { fullName: true, phone: true, createdAt: true }
  });
  console.log("\n=== RECENT LEADS ===");
  console.log(JSON.stringify(leads, null, 2));
  
  await p["$disconnect"]();
}

main().catch(console.error);
