import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';

export async function GET() {
  try {
    const latestSetting = await prisma.systemEvent.findFirst({
      where: { eventType: 'ADMIN_NOTIFY_SETTINGS' },
      orderBy: { createdAt: 'desc' },
    });

    if (latestSetting) {
      const parsed = JSON.parse(latestSetting.message);
      return NextResponse.json({
        adminPhone: parsed.adminPhone || '+971523666495',
        adminEmail: parsed.adminEmail || 'info@thepodsrealestate.ae',
        resendApiKey: parsed.resendApiKey || process.env.RESEND_API_KEY || '',
      });
    }

    return NextResponse.json({
      adminPhone: process.env.MINESH_NOTIFY_PHONE || '+971523666495',
      adminEmail: process.env.MINESH_NOTIFY_EMAIL || 'info@thepodsrealestate.ae',
      resendApiKey: process.env.RESEND_API_KEY || '',
    });
  } catch (e: any) {
    return NextResponse.json({
      adminPhone: '+971523666495',
      adminEmail: 'info@thepodsrealestate.ae',
      resendApiKey: '',
    });
  }
}

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const adminPhone = body.adminPhone || '+971523666495';
    const adminEmail = body.adminEmail || 'info@thepodsrealestate.ae';
    const resendApiKey = body.resendApiKey || '';

    const settingPayload = JSON.stringify({ adminPhone, adminEmail, resendApiKey });

    await prisma.systemEvent.create({
      data: {
        eventType: 'ADMIN_NOTIFY_SETTINGS',
        message: settingPayload,
      },
    });

    return NextResponse.json({
      status: 'success',
      adminPhone,
      adminEmail,
      resendApiKey,
      message: 'Notification alert settings updated successfully',
    });
  } catch (error: any) {
    return NextResponse.json(
      { status: 'error', message: error.message },
      { status: 500 }
    );
  }
}
