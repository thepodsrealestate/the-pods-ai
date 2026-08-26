export type AIAction =
  | 'NONE'
  | 'UPDATE_LEAD'
  | 'SEARCH_PROPERTY'
  | 'CHECK_CALENDAR'
  | 'BOOK_MEETING'
  | 'HANDOFF'
  | 'ISSUE_VOUCHER';

export interface AIStructuredOutput {
  reply: string;
  language: string;
  action: AIAction;
  lead_updates?: {
    buyer_location?: string;
    purchase_purpose?: string;
    budget_min?: number;
    budget_max?: number;
    timeline?: string;
    meeting_preference?: string;
    email?: string;
  };
  property_query?: {
    developer?: string;
    max_budget?: number;
    preferred_location?: string;
  };
  booking_details?: {
    date?: string;
    time?: string;
    preferred_date?: string;
    preferred_time?: string;
    email?: string;
    location?: string;
    project?: string;
  };
  handoff_reason?: string;
}

export class ActionService {
  /**
   * Validate & Parse AI Structured Output
   */
  static parseAIOutput(rawOutput: string): AIStructuredOutput {
    try {
      // Clean potential code block markdown wrappers
      let cleaned = rawOutput.trim();
      if (cleaned.startsWith('```json')) {
        cleaned = cleaned.replace(/^```json/, '').replace(/```$/, '').trim();
      } else if (cleaned.startsWith('```')) {
        cleaned = cleaned.replace(/^```/, '').replace(/```$/, '').trim();
      }

      const parsed: AIStructuredOutput = JSON.parse(cleaned);

      if (!parsed.reply || !parsed.action) {
        throw new Error('Invalid schema: missing reply or action fields');
      }

      // Format sanitation: strip unwanted markdown asterisks so text appears clean on WhatsApp
      parsed.reply = parsed.reply
        .replace(/\*\*([^*]+)\*\*/g, '$1')
        .replace(/\*([^*]+)\*/g, '$1')
        .replace(/^•\s*/gm, '')
        .replace(/^\*\s*/gm, '')
        .trim();

      return parsed;
    } catch (e: any) {
      console.warn('Fallback: AI output was not valid JSON, creating clean text response wrapper');
      const cleanReply = rawOutput
        .replace(/```[a-z]*/g, '')
        .replace(/\*\*([^*]+)\*\*/g, '$1')
        .replace(/\*([^*]+)\*/g, '$1')
        .trim();
      return {
        reply: cleanReply,
        language: 'en',
        action: 'NONE',
      };
    }
  }
}
