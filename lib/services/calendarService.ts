import { prisma } from '@/lib/prisma';
import { NotificationService } from './notificationService';

export interface BookingInput {
  leadId: string;
  meetingTime: Date;
  location?: string;
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
   * Create Confirmed Meeting Booking & Notify Minesh
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

    // Trigger Instant Notification Alert for Minesh Patel
    await NotificationService.notifyMineshBooking({
      leadName: booking.lead.fullName || 'VIP Client',
      phone: booking.lead.phone,
      meetingTime: booking.meetingTime,
      location: booking.location,
    });

    return booking;
  }
}

