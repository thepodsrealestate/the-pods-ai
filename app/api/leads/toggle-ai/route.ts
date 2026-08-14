import { NextRequest, NextResponse } from "next/server";
import prisma from "@/lib/prisma";

export async function POST(req: NextRequest) {
  try {
    const { leadId, aiEnabled } = await req.json();

    if (!leadId) {
      return NextResponse.json({ success: false, error: "Lead ID is required" }, { status: 400 });
    }

    const updatedLead = await prisma.lead.update({
      where: { id: leadId },
      data: {
        aiEnabled: Boolean(aiEnabled),
        handoffStatus: !aiEnabled
      }
    });

    return NextResponse.json({
      success: true,
      lead: updatedLead
    });
  } catch (error: any) {
    console.error("Toggle AI error:", error.message);
    return NextResponse.json({ success: false, error: error.message }, { status: 500 });
  }
}
