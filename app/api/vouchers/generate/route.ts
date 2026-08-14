import { NextRequest, NextResponse } from "next/server";
import prisma from "@/lib/prisma";

export async function POST(req: NextRequest) {
  try {
    const { leadId, valueAed = 20000 } = await req.json();

    if (!leadId) {
      return NextResponse.json({ success: false, error: "Lead ID is required" }, { status: 400 });
    }

    const lead = await prisma.lead.findUnique({ where: { id: leadId } });
    if (!lead) {
      return NextResponse.json({ success: false, error: "Lead not found" }, { status: 404 });
    }

    // Generate unique code PODS-VIP-XXXX
    const randomSuffix = Math.floor(1000 + Math.random() * 9000);
    const code = `PODS-VIP-${randomSuffix}`;

    // Create or find dummy booking if needed
    let booking = await prisma.booking.findFirst({ where: { leadId } });
    if (!booking) {
      booking = await prisma.booking.create({
        data: {
          leadId,
          calendarEventId: `evt_vip_${Date.now()}`,
          meetingTime: new Date(Date.now() + 86400000 * 2), // 2 days later
          location: "The Pods, Bluewaters Island, Dubai",
          status: "CONFIRMED"
        }
      });
    }

    const voucher = await prisma.voucher.create({
      data: {
        leadId,
        bookingId: booking.id,
        code,
        valueAed
      }
    });

    return NextResponse.json({
      success: true,
      voucher: {
        code: voucher.code,
        valueAed: voucher.valueAed,
        issuedAt: voucher.issuedAt,
        clientName: lead.fullName || "VIP Client",
        phone: lead.phone,
        location: "The Pods, Bluewaters Island, Dubai"
      }
    });
  } catch (error: any) {
    console.error("Voucher generation error:", error.message);
    return NextResponse.json({ success: false, error: error.message }, { status: 500 });
  }
}
