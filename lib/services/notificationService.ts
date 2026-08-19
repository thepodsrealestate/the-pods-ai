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

    // 2. Dispatch Live Resend Email
    try {
      const settings = await prisma.systemEvent.findFirst({
        where: { eventType: 'ADMIN_NOTIFY_SETTINGS' },
        orderBy: { createdAt: 'desc' },
      });

      let targetEmail = process.env.ADMIN_NOTIFY_EMAIL || 'maddyasif8@gmail.com';
      let resendApiKey = process.env.RESEND_API_KEY;

      if (settings) {
        try {
          const parsed = JSON.parse(settings.message);
          if (parsed.adminEmail) targetEmail = parsed.adminEmail;
          if (parsed.resendApiKey) resendApiKey = parsed.resendApiKey;
        } catch (_) {}
      }

      if (resendApiKey) {
        await fetch('https://api.resend.com/emails', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            Authorization: `Bearer ${resendApiKey}`,
          },
          body: JSON.stringify({
            from: 'The Pods Real Estate AI <onboarding@resend.dev>',
            to: [targetEmail],
            subject: `🚨 VIP Booking: ${payload.leadName} (${payload.phone})`,
            html: `
              <div style="font-family: Arial, sans-serif; background-color: #0D0F17; color: #ffffff; padding: 24px; border-radius: 16px;">
                <h2 style="color: #C5A059; margin-bottom: 8px;">VIP Presentation Booked</h2>
                <p style="font-size: 14px; color: #94A3B8;">A client has scheduled a presentation with Minesh Patel.</p>
                <div style="background-color: #151824; border: 1px solid #1E2230; padding: 16px; border-radius: 12px; margin: 16px 0;">
                  <p style="margin: 4px 0;"><strong>Client Name:</strong> ${payload.leadName}</p>
                  <p style="margin: 4px 0;"><strong>Phone:</strong> ${payload.phone}</p>
                  <p style="margin: 4px 0;"><strong>Scheduled Time:</strong> ${timeFormatted}</p>
                  <p style="margin: 4px 0;"><strong>Location:</strong> ${payload.location || 'The Pods, Bluewaters Island'}</p>
                  ${payload.voucherCode ? `<p style="margin: 4px 0; color: #10B981;"><strong>VIP Voucher:</strong> ${payload.voucherCode}</p>` : ''}
                </div>
                <a href="https://the-pods-ai.vercel.app/dashboard" style="display: inline-block; background-color: #C5A059; color: #000000; font-weight: bold; padding: 10px 20px; border-radius: 8px; text-decoration: none; margin-top: 12px;">Open Command Center</a>
              </div>
            `,
          }),
        });
        console.log(`[EMAIL DISPATCHED] VIP Booking notification sent to ${targetEmail}`);
      }
    } catch (emailErr: any) {
      console.error('Failed to dispatch live email:', emailErr?.message || emailErr);
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

    // Dispatch Live Resend Email for Human Takeover
    try {
      const settings = await prisma.systemEvent.findFirst({
        where: { eventType: 'ADMIN_NOTIFY_SETTINGS' },
        orderBy: { createdAt: 'desc' },
      });

      let targetEmail = process.env.ADMIN_NOTIFY_EMAIL || 'maddyasif8@gmail.com';
      let resendApiKey = process.env.RESEND_API_KEY;

      if (settings) {
        try {
          const parsed = JSON.parse(settings.message);
          if (parsed.adminEmail) targetEmail = parsed.adminEmail;
          if (parsed.resendApiKey) resendApiKey = parsed.resendApiKey;
        } catch (_) {}
      }

      if (resendApiKey) {
        await fetch('https://api.resend.com/emails', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            Authorization: `Bearer ${resendApiKey}`,
          },
          body: JSON.stringify({
            from: 'The Pods Real Estate AI <onboarding@resend.dev>',
            to: [targetEmail],
            subject: `⚠️ Human Takeover Required: ${leadName} (${phone})`,
            html: `
              <div style="font-family: Arial, sans-serif; background-color: #0D0F17; color: #ffffff; padding: 24px; border-radius: 16px;">
                <h2 style="color: #EF4444; margin-bottom: 8px;">Human Agent Takeover Required</h2>
                <p style="font-size: 14px; color: #94A3B8;">A WhatsApp lead has requested to speak with a human broker or asked for a call.</p>
                <div style="background-color: #151824; border: 1px solid #1E2230; padding: 16px; border-radius: 12px; margin: 16px 0;">
                  <p style="margin: 4px 0;"><strong>Client Name:</strong> ${leadName}</p>
                  <p style="margin: 4px 0;"><strong>Phone:</strong> ${phone}</p>
                  <p style="margin: 4px 0;"><strong>Reason:</strong> ${reason}</p>
                </div>
                <a href="https://the-pods-ai.vercel.app/dashboard" style="display: inline-block; background-color: #C5A059; color: #000000; font-weight: bold; padding: 10px 20px; border-radius: 8px; text-decoration: none; margin-top: 12px;">Open Live WhatsApp Chat</a>
              </div>
            `,
          }),
        });
        console.log(`[EMAIL DISPATCHED] Handoff notification sent to ${targetEmail}`);
      }
    } catch (emailErr: any) {
      console.error('Failed to dispatch handoff email:', emailErr?.message || emailErr);
    }

    return { success: true, alertMessage };
  }

}
