import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { LeadService } from '@/lib/services/leadService';
import { CalendarService } from '@/lib/services/calendarService';
import { MessageService } from '@/lib/services/messageService';
import { NotificationService } from '@/lib/services/notificationService';
import { SenderType, LeadStatus } from '@prisma/client';

export async function POST(req: NextRequest) {
  try {
    const body = await req.json().catch(() => ({}));

    const leadName = body.leadName || 'Lord Alexander Vance';
    const leadPhone = body.leadPhone || '+447700900077';
    const location = body.location || 'The Pods, Bluewaters Island, Dubai';

    // 1. Find or Create Lead
    const lead = await LeadService.findOrCreateLead({
      phone: leadPhone,
      fullName: leadName,
      leadSource: 'FACEBOOK_ADS',
      buyerLocation: 'London, UK',
      purchasePurpose: 'Penthouse Investment',
      budgetMin: 5000000,
      budgetMax: 10000000,
    });

    // 2. Get or Create Conversation Thread
    const conversation = await LeadService.getOrCreateConversation(lead.id);

    // 3. Add simulated WhatsApp messages
    await MessageService.storeMessage({
      conversationId: conversation.id,
      senderType: SenderType.LEAD,
      content: 'I would like to book a private VIP presentation for a penthouse investment next Tuesday at 2:00 PM.',
    });

    const aiReply = `Good day ${leadName}! I have reserved Tuesday at 2:00 PM for your private presentation at The Pods Bluewaters Island. Minesh Patel will host your consultation.`;

    await MessageService.storeMessage({
      conversationId: conversation.id,
      senderType: SenderType.AI,
      content: aiReply,
    });

    // 4. Create Meeting Booking (which automatically triggers NotificationService alert!)
    const meetingTime = new Date(Date.now() + 86400000 * 2); // 2 days from now
    meetingTime.setHours(14, 0, 0, 0);

    const booking = await CalendarService.createBooking({
      leadId: lead.id,
      meetingTime,
      location,
    });

    // 5. Fetch latest admin notification settings saved by user
    const settings = await prisma.systemEvent.findFirst({
      where: { eventType: 'ADMIN_NOTIFY_SETTINGS' },
      orderBy: { createdAt: 'desc' },
    });

    let adminPhone = '+971523666495';
    let adminEmail = 'info@thepodsrealestate.ae';

    if (settings) {
      try {
        const parsed = JSON.parse(settings.message);
        if (parsed.adminPhone) adminPhone = parsed.adminPhone;
        if (parsed.adminEmail) adminEmail = parsed.adminEmail;
      } catch (e) {}
    }

    return NextResponse.json({
      status: 'success',
      message: `Test VIP Meeting Booked successfully for ${leadName}!`,
      notifiedPhone: adminPhone,
      notifiedEmail: adminEmail,
      booking: {
        id: booking.id,
        leadName,
        phone: leadPhone,
        meetingTime,
        location,
      },
    });
  } catch (error: any) {
    console.error('Test booking error:', error);
    return NextResponse.json(
      { status: 'error', message: error.message },
      { status: 500 }
    );
  }
}
