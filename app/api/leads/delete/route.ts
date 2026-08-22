import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const { leadId, passcode } = body;

    if (!leadId) {
      return NextResponse.json({ success: false, message: 'Lead ID is required' }, { status: 400 });
    }

    const validPasscode = process.env.DASHBOARD_PASSCODE || process.env.NEXT_PUBLIC_DASHBOARD_PASSCODE || 'MineshPods0070';

    if (!passcode || passcode.trim() !== validPasscode.trim()) {
      return NextResponse.json({ success: false, message: 'Invalid admin passcode. Deletion aborted.' }, { status: 403 });
    }

    // Verify lead exists
    const existingLead = await prisma.lead.findUnique({
      where: { id: leadId },
      include: {
        conversations: {
          include: { messages: true }
        }
      }
    });

    if (!existingLead) {
      return NextResponse.json({ success: false, message: 'Lead not found or already deleted' }, { status: 404 });
    }

    // Delete lead (cascades to conversations, messages, bookings, vouchers, handoffs, attributions)
    await prisma.lead.delete({
      where: { id: leadId }
    });

    // Log deletion event
    try {
      await prisma.systemEvent.create({
        data: {
          eventType: 'LEAD_DELETED',
          message: `Lead ${existingLead.fullName || 'VIP Client'} (${existingLead.phone}) and all conversation history was permanently deleted by admin.`,
        },
      });
    } catch (e) {}

    return NextResponse.json({
      success: true,
      message: `Lead ${existingLead.fullName || existingLead.phone} and all conversation history deleted successfully.`
    });
  } catch (error: any) {
    console.error('[DELETE LEAD ERROR]', error);
    return NextResponse.json({ success: false, message: error.message || 'Failed to delete lead' }, { status: 500 });
  }
}
