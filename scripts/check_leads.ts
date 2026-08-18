import { prisma } from '../lib/prisma';
async function main() {
  const leads = await prisma.lead.findMany({
    select: { id: true, phone: true, fullName: true, createdAt: true, status: true }
  });
  console.log('TOTAL LEADS IN DB:', leads.length);
  console.log(JSON.stringify(leads, null, 2));
}
main().finally(() => prisma.$disconnect());
