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
        adminPhone: parsed.adminPhone || '+971509876543',
        adminEmail: parsed.adminEmail || 'info@thepodsrealestate.ae',
      });
    }

    return NextResponse.json({
      adminPhone: process.env.MINESH_NOTIFY_PHONE || '+971509876543',
      adminEmail: process.env.MINESH_NOTIFY_EMAIL || 'info@thepodsrealestate.ae',
    });
  } catch (e: any) {
    return NextResponse.json({
      adminPhone: '+971509876543',
      adminEmail: 'info@thepodsrealestate.ae',
    });
  }
}

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const adminPhone = body.adminPhone || '+971509876543';
    const adminEmail = body.adminEmail || 'info@thepodsrealestate.ae';

    const settingPayload = JSON.stringify({ adminPhone, adminEmail });

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
      message: 'Notification alert settings updated successfully',
    });
  } catch (error: any) {
    return NextResponse.json(
      { status: 'error', message: error.message },
      { status: 500 }
    );
  }
}
