import { prisma } from '@/lib/prisma';
import { NotificationService } from './notificationService';
import { GoogleCalendarService } from './googleCalendarService';

export interface BookingInput {
  leadId: string;
  meetingTime: Date;
  location?: string;
  notes?: string;
}

export class CalendarService {
  /**
   * Check Available Meeting Slots at The Pods Bluewaters
   */
  static async checkAvailability(dateStr?: string): Promise<string[]> {
    // Standard VIP Pod availability slots: 12:00 PM, 2:00 PM, 4:00 PM, 6:00 PM, 8:00 PM
    return ['12:00 PM', '2:00 PM', '4:00 PM', '6:00 PM', '8:00 PM'];
  }

  /**
   * Create Confirmed Meeting Booking & Notify Minesh + Insert to Google Calendar
   */
  static async createBooking(input: BookingInput) {
    const calendarEventId = `gcal_evt_${Date.now()}_${Math.floor(Math.random() * 1000)}`;

    const booking = await prisma.booking.create({
      data: {
        leadId: input.leadId,
        calendarEventId,
        meetingTime: input.meetingTime,
        location: input.location || 'The Pods, Bluewaters Island, Dubai',
        status: 'CONFIRMED',
      },
      include: { lead: true },
    });

    // Update Lead Status to MEETING_BOOKED
    await prisma.lead.update({
      where: { id: input.leadId },
      data: { status: 'MEETING_BOOKED' },
    });

    // Insert Event directly into Minesh Patel's Google Calendar
    try {
      const gcalResult = await GoogleCalendarService.insertEvent({
        summary: `VIP Investor Consultation - ${booking.lead.fullName || 'VIP Client'}`,
        description: `Investor Meeting with Minesh Patel (The Pods Real Estate)\n\nLead Name: ${booking.lead.fullName || 'VIP Client'}\nPhone: ${booking.lead.phone}\nEmail: ${booking.lead.email || 'N/A'}\nPurpose: ${booking.lead.purchasePurpose || 'Luxury Real Estate Investment'}\nBudget: ${booking.lead.budgetMax ? `AED ${booking.lead.budgetMax}` : 'HNW'}\n\nLocation: ${booking.location}`,
        location: booking.location,
        startTime: booking.meetingTime,
        attendeeEmail: booking.lead.email || undefined,
        attendeeName: booking.lead.fullName || undefined,
      });

      if (gcalResult?.eventId) {
        await prisma.booking.update({
          where: { id: booking.id },
          data: { calendarEventId: gcalResult.eventId },
        });
      }
    } catch (gcalErr: any) {
      console.warn('[CALENDAR] Google Calendar direct sync notice:', gcalErr.message);
    }

    // Trigger Instant Notification Alert for Minesh Patel & Reshma Patel
    await NotificationService.notifyMineshBooking({
      leadName: booking.lead.fullName || 'VIP Client',
      phone: booking.lead.phone,
      meetingTime: booking.meetingTime,
      location: booking.location,
    });

    return booking;
  }
}

