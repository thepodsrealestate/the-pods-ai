import { prisma } from '@/lib/prisma';
import { LeadStatus } from '@prisma/client';

export interface CreateLeadInput {
  phone: string;
  fullName?: string;
  email?: string;
  manychatId?: string;
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

export function isRealName(name?: string | null): boolean {
  if (!name) return false;
  const trimmed = name.trim();
  return (
    trimmed.length > 1 &&
    trimmed !== '-' &&
    trimmed !== '--' &&
    trimmed !== 'VIP Client' &&
    trimmed.toLowerCase() !== 'unknown' &&
    trimmed.toLowerCase() !== 'guest' &&
    !/^[-_\s.]+$/.test(trimmed)
  );
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

    // Strip country code national trunk zero (e.g. UK +4407... -> +447..., UAE +97105... -> +9715...)
    if (cleaned.startsWith('+440')) {
      cleaned = '+44' + cleaned.substring(4);
    } else if (cleaned.startsWith('+9710')) {
      cleaned = '+971' + cleaned.substring(5);
    }

    return cleaned;
  }

  /**
   * Find or Create Lead with Idempotent Attribution
   */
  static async findOrCreateLead(input: CreateLeadInput) {
    const normalizedPhone = this.normalizePhone(input.phone, input.fullName);

    // Names are not stable identifiers; only merge contacts by phone, email, or ManyChat subscriber ID.
    const searchConditions: any[] = [{ phone: normalizedPhone }];
    if (normalizedPhone.startsWith('+44')) {
      searchConditions.push({ phone: '+440' + normalizedPhone.substring(3) });
    }
    if (input.manychatId) {
      searchConditions.push({ manychatId: String(input.manychatId) });
    }
    if (input.email && input.email.trim()) {
      searchConditions.push({ email: { equals: input.email.trim(), mode: 'insensitive' } });
    }

    let lead = await prisma.lead.findFirst({
      where: { OR: searchConditions },
      include: { attributions: true },
    });


    if (!lead) {
      try {
        lead = await prisma.lead.create({
          data: {
            phone: normalizedPhone,
            fullName: isRealName(input.fullName) ? input.fullName!.trim() : null,
            email: input.email && input.email.trim() ? input.email.trim().toLowerCase() : null,
            manychatId: input.manychatId || null,
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
      } catch (createErr: any) {
        lead = await prisma.lead.findFirst({
          where: { OR: searchConditions },
          include: { attributions: true },
        });
        if (!lead) throw createErr;
      }
    } else {
      // Update existing lead if real phone number, fuller name, or ManyChat subscriber ID arrives
      const updateData: any = {};

      if (input.manychatId && lead.manychatId !== input.manychatId) {
        updateData.manychatId = input.manychatId;
      }

      // Only update name if incoming name is a valid real name AND either current name is invalid or incoming is more complete
      if (isRealName(input.fullName)) {
        if (!isRealName(lead.fullName) || (input.fullName!.length > (lead.fullName?.length || 0) && input.fullName!.toLowerCase().includes((lead.fullName || '').toLowerCase()))) {
          updateData.fullName = input.fullName!.trim();
        }
      }

      if (normalizedPhone && !normalizedPhone.startsWith('+lead_') && !normalizedPhone.startsWith('+mc_') && lead.phone !== normalizedPhone) {
        updateData.phone = normalizedPhone;
      }
      if (input.email && input.email.trim() && (!lead.email || lead.email.trim() === '')) {
        updateData.email = input.email.trim().toLowerCase();
      }

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
      where: { leadId },
      orderBy: { createdAt: 'asc' },
    });

    if (!conversation) {
      try {
        conversation = await prisma.conversation.create({
          data: {
            leadId,
            active: true,
          },
        });
      } catch (_) {
        conversation = await prisma.conversation.findFirst({
          where: { leadId },
          orderBy: { createdAt: 'asc' },
        });
      }
    }

    // Failsafe: Guarantee strict 1-conversation-per-lead invariant
    const allConvs = await prisma.conversation.findMany({
      where: { leadId },
      orderBy: { createdAt: 'asc' },
    });

    if (allConvs.length > 1) {
      const primary = allConvs[0];
      const duplicates = allConvs.slice(1);
      for (const dup of duplicates) {
        await prisma.message.updateMany({
          where: { conversationId: dup.id },
          data: { conversationId: primary.id },
        }).catch(() => {});
        await prisma.conversation.delete({
          where: { id: dup.id },
        }).catch(() => {});
      }
      return primary;
    }

    return conversation!;
  }
}
