import { prisma } from '@/lib/prisma';

export type SystemAiMode = 'DAY' | 'NIGHT';

export class SystemConfigService {
  /**
   * Retrieves the current global AI mode.
   * Defaults to 'DAY' (Human First) as required for active daytime lead handling.
   */
  static async getGlobalAiMode(): Promise<SystemAiMode> {
    try {
      const record = await prisma.systemEvent.findFirst({
        where: { eventType: 'GLOBAL_AI_MODE' },
        orderBy: { createdAt: 'desc' },
      });

      if (record && (record.message === 'DAY' || record.message === 'NIGHT')) {
        return record.message as SystemAiMode;
      }
      return 'DAY';
    } catch (e) {
      console.error('[SYSTEM CONFIG] Error fetching global AI mode:', e);
      return 'DAY';
    }
  }

  /**
   * Updates the global AI mode ('DAY' or 'NIGHT').
   */
  static async setGlobalAiMode(mode: SystemAiMode): Promise<void> {
    await prisma.systemEvent.create({
      data: {
        eventType: 'GLOBAL_AI_MODE',
        message: mode,
      },
    });
  }
}
