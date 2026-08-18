import { prisma } from '../lib/prisma';
async function main() {
  const events = await prisma.webhookEvent.findMany({
    take: 5,
    orderBy: { createdAt: 'desc' }
  });
  console.log('RECENT WEBHOOK PAYLOADS:');
  console.log(JSON.stringify(events, null, 2));
}
main().finally(() => prisma.$disconnect());

