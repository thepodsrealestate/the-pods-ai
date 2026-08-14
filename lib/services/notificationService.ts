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
      weekday: 'short',
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
    });

    const alertMessage = `🚨 NEW VIP MEETING BOOKED: ${payload.leadName} (${payload.phone}) scheduled for ${timeFormatted} at ${payload.location || 'The Pods, Bluewaters Island'}.${payload.voucherCode ? ` VIP Voucher: ${payload.voucherCode}` : ''}`;

    console.log(`[NOTIFICATION -> MINESH PATEL]: ${alertMessage}`);

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

    // 2. WhatsApp / Email Webhook dispatch to Minesh
    const mineshNotifyWebhook = process.env.MINESH_NOTIFY_WEBHOOK_URL;
    if (mineshNotifyWebhook) {
      try {
        await fetch(mineshNotifyWebhook, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            recipient: 'Minesh Patel',
            phone: payload.phone,
            lead_name: payload.leadName,
            meeting_time: timeFormatted,
            location: payload.location || 'The Pods Bluewaters',
            dashboard_url: 'https://the-pods-ai.vercel.app/dashboard',
            alert_text: alertMessage,
          }),
        });
      } catch (err: any) {
        console.error('Failed to trigger Minesh notification webhook:', err.message);
      }
    }

    return { success: true, alertMessage };
  }

  /**
   * Send Human Handoff Alert to Minesh Patel
   */
  static async notifyMineshHandoff(leadName: string, phone: string, reason: string) {
    const alertMessage = `⚠️ HUMAN TAKEOVER REQUIRED: Lead ${leadName} (${phone}) requested human agent. Reason: ${reason}. AI has paused.`;

    console.log(`[HANDOFF -> MINESH PATEL]: ${alertMessage}`);

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

    return { success: true, alertMessage };
  }
}
