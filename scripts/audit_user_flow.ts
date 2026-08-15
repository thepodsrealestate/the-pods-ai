import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

async function auditDashboardFlow() {
  console.log('--- STARTING USER FLOW & UX AUDIT ---');

  // 1. Audit Leads & Attributions
  const totalLeads = await prisma.lead.count();
  const leadsWithAttribution = await prisma.lead.findMany({
    take: 5,
    include: { attributions: true, conversations: true, bookings: true },
  });
  console.log(`[AUDIT] Total Leads in DB: ${totalLeads}`);
  console.log(`[AUDIT] Sample Lead Structure:`, JSON.stringify(leadsWithAttribution[0] || {}, null, 2));

  // 2. Audit Settings Persistence
  const latestSetting = await prisma.systemEvent.findFirst({
    where: { eventType: 'ADMIN_NOTIFY_SETTINGS' },
    orderBy: { createdAt: 'desc' },
  });
  console.log(`[AUDIT] Saved Notification Settings:`, latestSetting?.message || 'No custom settings saved yet');

  // 3. Audit Bookings & Vouchers
  const totalBookings = await prisma.booking.count();
  const totalVouchers = await prisma.voucher.count();
  console.log(`[AUDIT] Total VIP Bookings: ${totalBookings}, Issued Vouchers: ${totalVouchers}`);

  // 4. Audit System Events & Alerts
  const alerts = await prisma.systemEvent.findMany({
    take: 5,
    orderBy: { createdAt: 'desc' },
  });
  console.log(`[AUDIT] Recent System Alerts (${alerts.length}):`);
  alerts.forEach((a) => console.log(`   - [${a.eventType}] ${a.message.substring(0, 80)}...`));

  console.log('--- USER FLOW & UX AUDIT COMPLETE ---');
}

auditDashboardFlow()
  .catch(console.error)
  .finally(() => prisma.$disconnect());
