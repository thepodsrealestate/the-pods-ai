import { prisma } from '@/lib/prisma';

export interface NotificationPayload {
  leadName: string;
  phone: string;
  meetingTime: Date;
  location?: string;
  voucherCode?: string;
}

export class NotificationService {
  /**
   * Send Instant Booking Notification to Minesh Patel
   */
  static async notifyMineshBooking(payload: NotificationPayload) {
    const timeFormatted = new Date(payload.meetingTime).toLocaleString('en-US', {
      timeZone: 'Asia/Dubai',
      weekday: 'short',
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
    });

    const alertMessage = `🚨 NEW VIP MEETING BOOKED: ${payload.leadName} (${payload.phone}) scheduled for ${timeFormatted} at ${payload.location || 'The Pods, Bluewaters Island'}.${payload.voucherCode ? ` VIP Voucher: ${payload.voucherCode}` : ''}`;

    console.log(`[NOTIFICATION -> ASIF KHAN (+971545866094)]: ${alertMessage}`);

    // 1. Log System Event in Database for Audit & Dashboard Alert Feed
    try {
      await prisma.systemEvent.create({
        data: {
          eventType: 'MEETING_BOOKED_ALERT',
          message: alertMessage,
        },
      });
    } catch (e: any) {
      console.error('Failed to log system notification event:', e.message);
    }

    // 2. Automated Dispatch to Asif Khan
    const mineshNotifyWebhook = process.env.MINESH_NOTIFY_WEBHOOK_URL;
    if (mineshNotifyWebhook) {
      try {
        await fetch(mineshNotifyWebhook, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            recipients: [
              { name: 'Asif Khan', phone: '+971545866094', email: 'maddyasif8@gmail.com' }
            ],
            phone: payload.phone,
            lead_name: payload.leadName,
            meeting_time: timeFormatted,
            location: payload.location || 'The Pods Bluewaters',
            calendar_link: 'https://calendar.app.google/xGRVwZCTkrnZCypUA',
            dashboard_url: 'https://the-pods-ai.vercel.app/dashboard',
            alert_text: alertMessage,
          }),
        });
      } catch (err: any) {
        console.error('Failed to trigger notification webhook:', err.message);
      }
    }

    return { success: true, alertMessage };
  }

  /**
   * Send Human Handoff Alert to Asif Khan
   */
  static async notifyMineshHandoff(leadName: string, phone: string, reason: string) {
    const alertMessage = `⚠️ HUMAN TAKEOVER REQUIRED: Lead ${leadName} (${phone}) requested human agent. Reason: ${reason}. Live Dashboard: https://the-pods-ai.vercel.app/dashboard`;

    console.log(`[HANDOFF -> ASIF KHAN (+971545866094)]: ${alertMessage}`);

    try {
      await prisma.systemEvent.create({
        data: {
          eventType: 'HUMAN_HANDOFF_ALERT',
          message: alertMessage,
        },
      });
    } catch (e: any) {
      console.error('Failed to log handoff event:', e.message);
    }

    const mineshNotifyWebhook = process.env.MINESH_NOTIFY_WEBHOOK_URL;
    if (mineshNotifyWebhook) {
      try {
        await fetch(mineshNotifyWebhook, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            recipients: [
              { name: 'Asif Khan', phone: '+971545866094', email: 'maddyasif8@gmail.com' }
            ],
            phone,
            lead_name: leadName,
            reason,
            dashboard_url: 'https://the-pods-ai.vercel.app/dashboard',
            alert_text: alertMessage,
          }),
        });
      } catch (err: any) {
        console.error('Failed to trigger handoff webhook:', err.message);
      }
    }

    return { success: true, alertMessage };
  }

}
