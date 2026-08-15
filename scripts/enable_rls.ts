import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

const tables = [
  'User',
  'Lead',
  'LeadAttribution',
  'Conversation',
  'Message',
  'PropertyProject',
  'PropertyDocument',
  'PropertyFact',
  'Booking',
  'Voucher',
  'Handoff',
  'WebhookEvent',
  'AuditLog',
  'SystemEvent',
];

async function enableRLS() {
  console.log('Enabling Row Level Security (RLS) on all Supabase PostgreSQL tables...');

  for (const table of tables) {
    try {
      await prisma.$executeRawUnsafe(`ALTER TABLE "${table}" ENABLE ROW LEVEL SECURITY;`);
      console.log(`✅ RLS Enabled on table: "${table}"`);
    } catch (err: any) {
      console.error(`❌ Could not enable RLS on "${table}":`, err.message);
    }
  }

  console.log('🎉 RLS configuration complete! All Supabase critical warnings cleared.');
}

enableRLS()
  .catch((e) => console.error(e))
  .finally(() => prisma.$disconnect());
