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
      prisma.lead.count({ where: { handoffStatus: true, aiEnabled: false } }),
      prisma.booking.count(),
      prisma.voucher.count(),
      prisma.lead.findMany({
        take: 50,
        orderBy: { createdAt: "desc" },
        include: { attributions: true }
      }),
      prisma.conversation.findMany({
        take: 100,
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

    // Deduplicate conversations so each unique lead has exactly ONE conversation thread
    const uniqueConvMap = new Map<string, any>();
    for (const c of conversations) {
      const key = c.leadId || c.id;
      if (!uniqueConvMap.has(key)) {
        // Deduplicate messages within the single conversation
        const seenMsg = new Set<string>();
        const cleanMsgs: any[] = [];
        for (const m of c.messages) {
          const mKey = `${m.senderType}_${m.content.trim().toLowerCase().substring(0, 80)}`;
          if (!seenMsg.has(mKey)) {
            seenMsg.add(mKey);
            cleanMsgs.push(m);
          }
        }
        uniqueConvMap.set(key, { ...c, messages: cleanMsgs });
      } else {
        const existing = uniqueConvMap.get(key);
        const seenMsg = new Set<string>(existing.messages.map((m: any) => `${m.senderType}_${m.content.trim().toLowerCase().substring(0, 80)}`));
        for (const m of c.messages) {
          const mKey = `${m.senderType}_${m.content.trim().toLowerCase().substring(0, 80)}`;
          if (!seenMsg.has(mKey)) {
            seenMsg.add(mKey);
            existing.messages.push(m);
          }
        }
        existing.messages.sort((a: any, b: any) => new Date(a.createdAt).getTime() - new Date(b.createdAt).getTime());
      }
    }
    const deduplicatedConversations = Array.from(uniqueConvMap.values());

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
      conversations: deduplicatedConversations,
      bookings
    });
  } catch (error: any) {
    return NextResponse.json(
      { success: false, error: error.message },
      { status: 500 }
    );
  }
}
