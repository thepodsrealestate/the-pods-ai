import { NextResponse } from "next/server";
import prisma from "@/lib/prisma";

export const revalidate = 0;

export async function GET() {
  try {
    const [
      totalLeads,
      aiQualified,
      handoffsRequired,
      totalBookings,
      totalVouchers,
      recentLeads,
      conversations,
      bookings
    ] = await Promise.all([
      prisma.lead.count(),
      prisma.lead.count({ where: { status: "QUALIFIED" } }),
      prisma.handoff.count({ where: { resolved: false } }),
      prisma.booking.count(),
      prisma.voucher.count(),
      prisma.lead.findMany({
        take: 50,
        orderBy: { createdAt: "desc" },
        include: { attributions: true }
      }),
      prisma.conversation.findMany({
        orderBy: { updatedAt: "desc" },
        include: {
          lead: {
            include: { attributions: true }
          },
          messages: { orderBy: { createdAt: "asc" } }
        }
      }),
      prisma.booking.findMany({
        orderBy: { createdAt: "desc" },
        include: { 
          lead: {
            include: { attributions: true }
          }
        }
      })
    ]);

    return NextResponse.json({
      success: true,
      stats: {
        totalLeads,
        aiQualified,
        handoffsRequired,
        totalBookings,
        totalVouchers
      },
      recentLeads,
      conversations,
      bookings
    });
  } catch (error: any) {
    return NextResponse.json(
      { success: false, error: error.message },
      { status: 500 }
    );
  }
}
