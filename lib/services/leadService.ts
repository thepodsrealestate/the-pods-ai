import { prisma } from '@/lib/prisma';
import { LeadStatus } from '@prisma/client';

export interface CreateLeadInput {
  phone: string;
  fullName?: string;
  email?: string;
  leadSource?: string;
  buyerLocation?: string;
  purchasePurpose?: string;
  budgetMin?: number;
  budgetMax?: number;
  timeline?: string;
  meetingPreference?: string;
  attribution?: {
    source: string;
    medium?: string;
    campaign?: string;
    campaignId?: string;
    adSet?: string;
    adId?: string;
    utmSource?: string;
    utmMedium?: string;
    utmCampaign?: string;
  };
}

export class LeadService {
  /**
   * E.164 Phone Number Normalization
   */
  static normalizePhone(phone: string, fullName?: string): string {
    if (!phone || phone.trim() === '' || phone === 'unknown') {
      const nameSlug = (fullName || 'guest').toLowerCase().replace(/[^a-z0-9]/g, '_');
      return `+lead_${nameSlug}`;
    }

    // Preserve stable lead slugs (+lead_shahbaz, +mc_12345)
    if (phone.startsWith('+lead_') || phone.startsWith('+mc_')) {
      return phone;
    }

    let cleaned = phone.replace(/[^0-9+]/g, '');
    if (!cleaned || cleaned === '+') {
      const nameSlug = (fullName || 'guest').toLowerCase().replace(/[^a-z0-9]/g, '_');
      return `+lead_${nameSlug}`;
    }
    if (!cleaned.startsWith('+')) {
      if (cleaned.startsWith('00')) {
        cleaned = '+' + cleaned.substring(2);
      } else if (cleaned.startsWith('971')) {
        cleaned = '+' + cleaned;
      } else if (cleaned.startsWith('0')) {
        cleaned = '+971' + cleaned.substring(1);
      } else {
        cleaned = '+' + cleaned;
      }
    }
    return cleaned;
  }

  /**
   * Find or Create Lead with Idempotent Attribution
   */
  static async findOrCreateLead(input: CreateLeadInput) {
    const normalizedPhone = this.normalizePhone(input.phone, input.fullName);

    // Search by normalized phone or exact contact name to guarantee 100% unified thread
    let lead = await prisma.lead.findFirst({
      where: {
        OR: [
          { phone: normalizedPhone },
          input.fullName && input.fullName !== 'VIP Client' && input.fullName !== 'Guest'
            ? { fullName: { equals: input.fullName, mode: 'insensitive' } }
            : { phone: normalizedPhone }
        ]
      },
      include: { attributions: true },
    });


    if (!lead) {
      lead = await prisma.lead.create({
        data: {
          phone: normalizedPhone,
          fullName: input.fullName || null,
          email: input.email || null,
          leadSource: input.leadSource || 'DIRECT',
          buyerLocation: input.buyerLocation || null,
          purchasePurpose: input.purchasePurpose || null,
          budgetMin: input.budgetMin || null,
          budgetMax: input.budgetMax || null,
          timeline: input.timeline || null,
          meetingPreference: input.meetingPreference || null,
          status: LeadStatus.NEW,
          aiEnabled: true,
          handoffStatus: false,
          attributions: input.attribution
            ? {
                create: {
                  source: input.attribution.source || 'DIRECT',
                  medium: input.attribution.medium || null,
                  campaign: input.attribution.campaign || null,
                  campaignId: input.attribution.campaignId || null,
                  adSet: input.attribution.adSet || null,
                  adId: input.attribution.adId || null,
                  utmSource: input.attribution.utmSource || null,
                  utmMedium: input.attribution.utmMedium || null,
                  utmCampaign: input.attribution.utmCampaign || null,
                },
              }
            : undefined,
        },
        include: { attributions: true },
      });
    } else {
      // Preserve existing data, update missing non-null fields
      const updateData: any = {};
      if (!lead.fullName && input.fullName) updateData.fullName = input.fullName;
      if (!lead.email && input.email) updateData.email = input.email;

      if (Object.keys(updateData).length > 0) {
        lead = await prisma.lead.update({
          where: { id: lead.id },
          data: updateData,
          include: { attributions: true },
        });
      }
    }

    return lead;
  }

  /**
   * Get or Create Active Conversation Thread
   */
  static async getOrCreateConversation(leadId: string) {
    let conversation = await prisma.conversation.findFirst({
      where: { leadId, active: true },
    });

    if (!conversation) {
      conversation = await prisma.conversation.create({
        data: {
          leadId,
          active: true,
        },
      });
    }

    return conversation;
  }
}
