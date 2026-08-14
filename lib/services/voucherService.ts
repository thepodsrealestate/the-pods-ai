import { prisma } from '@/lib/prisma';
import crypto from 'crypto';

export class VoucherService {
  /**
   * Generate Cryptographically Unique VIP Voucher Code (POD-VIP-XXXXX)
   */
  static generateVoucherCode(): string {
    const randomHex = crypto.randomBytes(3).toString('hex').toUpperCase();
    return `POD-VIP-${randomHex}`;
  }

  /**
   * Issue AED 20,000 Pods VIP Fine Dining Voucher upon Confirmed Booking
   */
  static async issueVIPVoucher(leadId: string, bookingId: string) {
    // Check if voucher already issued for this booking
    const existing = await prisma.voucher.findFirst({
      where: { bookingId },
    });

    if (existing) return existing;

    const code = this.generateVoucherCode();

    return await prisma.voucher.create({
      data: {
        leadId,
        bookingId,
        code,
        valueAed: 20000,
      },
    });
  }
}
