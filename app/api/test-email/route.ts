import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';

export async function POST(req: NextRequest) {
  try {
    const body = await req.json().catch(() => ({}));

    // Fetch saved notification recipient email
    const settings = await prisma.systemEvent.findFirst({
      where: { eventType: 'ADMIN_NOTIFY_SETTINGS' },
      orderBy: { createdAt: 'desc' },
    });

    let targetEmail = body.email || 'info@thepodsrealestate.ae';
    let resendApiKey = process.env.RESEND_API_KEY || body.resendApiKey;

    if (settings) {
      try {
        const parsed = JSON.parse(settings.message);
        if (parsed.adminEmail) targetEmail = parsed.adminEmail;
        if (parsed.resendApiKey) resendApiKey = parsed.resendApiKey;
      } catch (e) {}
    }

    if (!resendApiKey) {
      return NextResponse.json({
        status: 'warning',
        message: 'Resend API Key is required for live email dispatch. Please enter your Resend API Key in the settings field below or add RESEND_API_KEY in Vercel.',
        targetEmail,
        requiresApiKey: true,
      });
    }

    // Dispatch live email via Resend HTTP API
    const response = await fetch('https://api.resend.com/emails', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${resendApiKey}`,
      },
      body: JSON.stringify({
        from: 'The Pods Real Estate AI <onboarding@resend.dev>',
        to: [targetEmail],
        subject: '🚨 NEW VIP Presentation Booked: Lord Alexander Vance',
        html: `
          <div style="font-family: Arial, sans-serif; background-color: #0D0F17; color: #ffffff; padding: 24px; borderRadius: 16px;">
            <h2 style="color: #C5A059; margin-bottom: 8px;">VIP Presentation Booking Alert</h2>
            <p style="font-size: 14px; color: #94A3B8;">A new high-net-worth property lead has been scheduled for a presentation with Minesh Patel.</p>
            
            <div style="background-color: #151824; border: 1px solid #1E2230; padding: 16px; border-radius: 12px; margin: 16px 0;">
              <p style="margin: 4px 0;"><strong>Client Name:</strong> Lord Alexander Vance</p>
              <p style="margin: 4px 0;"><strong>Phone:</strong> +44 7700 900077</p>
              <p style="margin: 4px 0;"><strong>Location:</strong> The Pods, Bluewaters Island, Dubai</p>
              <p style="margin: 4px 0;"><strong>Scheduled Date:</strong> Tuesday at 2:00 PM</p>
              <p style="margin: 4px 0; color: #10B981;"><strong>VIP Voucher Code:</strong> PODS-VIP-9912 (AED 20,000)</p>
            </div>
            
            <a href="https://the-pods-ai.vercel.app/dashboard" style="display: inline-block; background-color: #C5A059; color: #000000; font-weight: bold; padding: 10px 20px; border-radius: 8px; text-decoration: none; margin-top: 12px;">Open Command Center Dashboard</a>
          </div>
        `,
      }),
    });

    const data = await response.json();

    if (!response.ok) {
      return NextResponse.json(
        { status: 'error', message: data.message || 'Resend API returned an error', targetEmail },
        { status: response.status }
      );
    }

    return NextResponse.json({
      status: 'success',
      message: `Live test email successfully dispatched to ${targetEmail}!`,
      resendId: data.id,
      targetEmail,
    });
  } catch (error: any) {
    return NextResponse.json(
      { status: 'error', message: error.message },
      { status: 500 }
    );
  }
}
