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

    console.log(`[NOTIFICATION -> MINESH PATEL (+971523666495)]: ${alertMessage}`);

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

      let targetEmail = process.env.ADMIN_NOTIFY_EMAIL || 'info@thepodsrealestate.ae';
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
                  <p style="margin: 4px 0;"><strong>Location / Format:</strong> ${payload.location || 'Google Meet Video Consultation'}</p>
                  ${payload.location?.toLowerCase().includes('google meet') || !payload.location ? `<p style="margin: 8px 0;"><a href="https://calendar.app.google/xGRVwZCTkrnZCypUA" style="color: #60A5FA; text-decoration: underline;">👉 Open Google Calendar & Meet Details</a></p>` : ''}
                  ${payload.voucherCode ? `<p style="margin: 4px 0; color: #10B981;"><strong>VIP Voucher:</strong> ${payload.voucherCode}</p>` : ''}
                </div>
                <div style="margin-top: 16px;">
                  <a href="https://the-pods-ai.vercel.app/dashboard" style="display: inline-block; background-color: #C5A059; color: #000000; font-weight: bold; padding: 10px 20px; border-radius: 8px; text-decoration: none; margin-right: 12px;">Open Command Center</a>
                  <a href="https://calendar.google.com" style="display: inline-block; background-color: #1E2230; color: #ffffff; padding: 10px 16px; border-radius: 8px; text-decoration: none; border: 1px solid #334155;">View in Calendar</a>
                </div>
              </div>
            `,
          }),
        });
        console.log(`[EMAIL DISPATCHED] VIP Booking notification sent to ${targetEmail}`);
      }
    } catch (emailErr: any) {
      console.error('Failed to dispatch live email:', emailErr?.message || emailErr);
    }

    // 3. Dispatch Live WhatsApp Message to Minesh Patel & Reshma Patel
    try {
      await this.sendWhatsAppAlert(alertMessage);
    } catch (waErr: any) {
      console.error('Failed to dispatch WhatsApp alert:', waErr?.message || waErr);
    }

    return { success: true, alertMessage };
  }

  /**
   * Send Human Handoff Alert to Minesh Patel & Reshma Patel
   */
  static async notifyMineshHandoff(leadName: string, phone: string, reason: string) {
    const alertMessage = `⚠️ HUMAN TAKEOVER REQUIRED: Lead ${leadName} (${phone}) requested human agent. Reason: ${reason}. Live Dashboard: https://the-pods-ai.vercel.app/dashboard`;

    console.log(`[HANDOFF -> MINESH PATEL (+971523666495) & RESHMA PATEL (+971523999502)]: ${alertMessage}`);

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

    // 1. Dispatch Live Resend Email for Human Takeover
    try {
      const settings = await prisma.systemEvent.findFirst({
        where: { eventType: 'ADMIN_NOTIFY_SETTINGS' },
        orderBy: { createdAt: 'desc' },
      });

      let targetEmail = process.env.ADMIN_NOTIFY_EMAIL || 'info@thepodsrealestate.ae';
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

    // 2. Dispatch Live WhatsApp Message to Minesh Patel & Reshma Patel
    try {
      await this.sendWhatsAppAlert(alertMessage);
    } catch (waErr: any) {
      console.error('Failed to dispatch WhatsApp alert:', waErr?.message || waErr);
    }

    return { success: true, alertMessage };
  }

  /**
   * Dispatch Live Outbound WhatsApp Alert to Minesh Patel & Reshma Patel
   */
  private static async sendWhatsAppAlert(messageText: string) {
    const adminPhones = [
      (process.env.ADMIN_PHONE_MINESH || '+971523666495').replace(/[^0-9]/g, ''),
      (process.env.ADMIN_PHONE_RESHMA || '+971523999502').replace(/[^0-9]/g, ''),
    ];

    // Method 1: ManyChat Send Content API
    const manychatToken = process.env.MANYCHAT_API_TOKEN;
    if (manychatToken) {
      for (const phone of adminPhones) {
        try {
          // Look up subscriber by phone in ManyChat
          const findRes = await fetch(`https://api.manychat.com/fb/subscriber/findBySystemField?phone=%2B${phone}`, {
            headers: { Authorization: `Bearer ${manychatToken}` },
          });
          const findData = await findRes.json();
          let subscriberId = findData?.data?.id || findData?.data?.[0]?.id;

          // If not found by phone, try searching by name or direct custom field
          if (!subscriberId) {
            const nameSearch = phone.includes('523666495') ? 'Minesh' : 'Reshma';
            const nameRes = await fetch(`https://api.manychat.com/fb/subscriber/findByName?name=${encodeURIComponent(nameSearch)}`, {
              headers: { Authorization: `Bearer ${manychatToken}` },
            });
            const nameData = await nameRes.json();
            subscriberId = nameData?.data?.[0]?.id;
          }

          if (subscriberId) {
            const sendRes = await fetch('https://api.manychat.com/fb/sending/sendContent', {
              method: 'POST',
              headers: {
                'Content-Type': 'application/json',
                Authorization: `Bearer ${manychatToken}`,
              },
              body: JSON.stringify({
                subscriber_id: subscriberId,
                data: {
                  version: 'v2',
                  content: {
                    messages: [{ type: 'text', text: messageText }],
                  },
                },
              }),
            });
            const sendData = await sendRes.json();
            console.log(`[WHATSAPP ALERT SENT via ManyChat to ${phone}]:`, sendData?.status || 'dispatched');
          } else {
            console.warn(`[WHATSAPP ALERT] Admin phone +${phone} not found as subscriber in ManyChat.`);
          }
        } catch (err: any) {
          console.error(`[WHATSAPP ALERT ERROR] Failed sending to ${phone}:`, err.message);
        }
      }
    }

    // Method 2: Meta WhatsApp Cloud API Direct Dispatch (if configured)
    const waPhoneNumberId = process.env.WHATSAPP_PHONE_NUMBER_ID;
    const waAccessToken = process.env.WHATSAPP_ACCESS_TOKEN || process.env.META_SYSTEM_USER_TOKEN;
    if (waPhoneNumberId && waAccessToken) {
      for (const phone of adminPhones) {
        try {
          const cloudRes = await fetch(`https://graph.facebook.com/v21.0/${waPhoneNumberId}/messages`, {
            method: 'POST',
            headers: {
              'Content-Type': 'application/json',
              Authorization: `Bearer ${waAccessToken}`,
            },
            body: JSON.stringify({
              messaging_product: 'whatsapp',
              to: phone,
              type: 'text',
              text: { body: messageText },
            }),
          });
          const cloudData = await cloudRes.json();
          console.log(`[WHATSAPP ALERT SENT via Meta Cloud API to ${phone}]:`, cloudData?.messages?.[0]?.id || 'dispatched');
        } catch (cErr: any) {
          console.error(`[WHATSAPP META CLOUD API ERROR] Failed sending to ${phone}:`, cErr.message);
        }
      }
    }
  }

}
