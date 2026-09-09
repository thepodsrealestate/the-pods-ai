import prisma from '../lib/prisma';
async function run() {
  const tables = ['User', 'Lead', 'LeadAttribution', 'Conversation', 'Message', 'PropertyProject', 'Booking', 'Voucher', 'Handoff', 'WebhookEvent', 'AuditLog', 'SystemEvent'];
  console.log('=== ROW COUNTS IN LIVE SUPABASE DATABASE ===');
  for (const t of tables) {
    try {
      const modelName = t.charAt(0).toLowerCase() + t.slice(1);
      const count = await (prisma as any)[modelName].count();
      console.log('  ' + t + ': ' + count);
    } catch (e: any) {
      console.log('  ' + t + ': error ' + e.message);
    }
  }
}
run().finally(async () => {
  await prisma.$disconnect();
});
