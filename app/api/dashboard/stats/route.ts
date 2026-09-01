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

    type DashboardConversation = (typeof conversations)[number];
    type DashboardMessage = DashboardConversation["messages"][number];

    const isConsecutiveDuplicate = (previous: DashboardMessage | undefined, current: DashboardMessage) => {
      if (!previous || previous.senderType !== current.senderType) return false;

      const sameContent = previous.content.trim().toLowerCase() === current.content.trim().toLowerCase();
      const timeDifference = new Date(current.createdAt).getTime() - new Date(previous.createdAt).getTime();
      return sameContent && timeDifference >= 0 && timeDifference <= 10000;
    };

    // Keep one thread per lead while preserving legitimate repeated messages.
    const uniqueConvMap = new Map<string, DashboardConversation>();
    for (const c of conversations) {
      const key = c.leadId || c.id;
      if (!uniqueConvMap.has(key)) {
        uniqueConvMap.set(key, { ...c, messages: [...c.messages] });
      } else {
        uniqueConvMap.get(key)?.messages.push(...c.messages);
      }
    }

    const deduplicatedConversations = Array.from(uniqueConvMap.values()).map((conversation) => {
      const sortedMessages = [...conversation.messages].sort(
        (a, b) => new Date(a.createdAt).getTime() - new Date(b.createdAt).getTime()
      );
      const cleanMessages = sortedMessages.filter(
        (message, index) => !isConsecutiveDuplicate(sortedMessages[index - 1], message)
      );
      return { ...conversation, messages: cleanMessages };
    });

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
