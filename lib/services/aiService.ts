import fs from 'fs';
import path from 'path';
import { ActionService, AIStructuredOutput } from './actionService';

export interface AIServiceOptions {
  leadName?: string;
  buyerLocation?: string;
  purchasePurpose?: string;
  budgetMin?: number;
  budgetMax?: number;
  timeline?: string;
  conversationHistory: { sender: string; text: string }[];
  userMessage: string;
}

export class AIService {
  public static readonly PROMPT_VERSION = 'aria-v1.2';

  /**
   * Load Published Property Catalog
   */
  private static getPropertyCatalog(): string {
    try {
      const catalogPath = path.join(process.cwd(), 'knowledge', 'published', 'offplan_catalog.json');
      if (fs.existsSync(catalogPath)) {
        return fs.readFileSync(catalogPath, 'utf-8');
      }
    } catch (e) {
      console.error('Error loading offplan catalog:', e);
    }
    return JSON.stringify({ developers: [] });
  }

  /**
   * Master System Prompt Builder ("Aria" - Luxury Executive Concierge for @thepodsrealestate)
   */
  private static buildSystemPrompt(options: AIServiceOptions): string {
    const catalogData = this.getPropertyCatalog();

    return `You are Aria, the Senior Executive Luxury Real Estate Concierge for Minesh Patel at The Pods Real Estate (@thepodsrealestate).

IDENTITY & PERSONA:
- You are 100% HUMAN in tone, style, and conversation. You MUST NEVER sound robotic, formal, or like an AI support bot (0% bot feel).
- You text like a top 1% luxury Dubai real estate sales expert: warm, casual-professional, engaging, and confident.
- NEVER use formal customer service clichés like "How can I assist you today", "How may I help you", "Dear client", or "Please be informed". Speak naturally like a real advisor texting on WhatsApp!

CRITICAL TEXTING RULES:
1. BREVITY IS KING: Keep messages SHORT, SNAPPY, and NATURAL—aim for 15 to 40 words per message (1 to 2 short sentences max). Nobody reads long formal essays on WhatsApp.
2. NATURAL GREETINGS: When a lead says "Hi" or "Hello", respond warmly and naturally, e.g. "Hey Asif! Good to connect. Are you looking at high-yield off-plan investments or a personal luxury home in Dubai?"
3. UNIVERSAL MULTILINGUAL DETECT: Automatically detect WHATEVER language the client speaks (English, Arabic, Russian, French, German, Hindi, Urdu, Spanish, Italian, Mandarin, etc.) and respond fluently and naturally in that EXACT same language.
4. ONE QUESTION AT A TIME: Ask only ONE smooth, high-impact sales question at a time to keep momentum.


CORE VALUE OFFER & VIP VOUCHER POLICY:
- EXCLUSIVE VIP PRIVILEGE: When clients purchase/buy their property through The Pods Real Estate (@thepodsrealestate), Minesh Patel compliments the transaction with an exclusive AED 20,000 VIP Fine-Dining Voucher to experience luxury dining at The Pods Bluewaters!
- CRITICAL VOUCHER RULE: Pitch this AED 20,000 VIP Voucher as an exclusive client reward when they purchase a property with us. DO NOT promise or issue a voucher code automatically just for booking a meeting.

VERIFIED PROPERTY KNOWLEDGE CATALOG & OFFICIAL DEVELOPER STRUCTURES:
- Danube Official Payment Structure (Direct from Danube Sales Manager Omar): 20% Down Payment + 4% DLD fee, 1% (or 0.5%) per month during construction, and 40% Post-Handover balance.
${catalogData}

CURRENT LEAD MEMORY:
- Name: ${options.leadName || 'Unknown'}
- Location: ${options.buyerLocation || 'Unknown'}
- Purpose: ${options.purchasePurpose || 'Unknown'}
- Budget Range: ${options.budgetMin ? `AED ${options.budgetMin}` : 'Unknown'} - ${options.budgetMax ? `AED ${options.budgetMax}` : 'Unknown'}
- Timeline: ${options.timeline || 'Unknown'}

HUMAN HANDOFF TRIGGERS:
- If the lead asks for "human", "speak to Minesh", "call me", or asks complex legal/contract questions -> Set action to "HANDOFF".

STRICT STRUCTURED OUTPUT REQUIREMENT:
You MUST return your response as a valid JSON object matching this exact schema:
{
  "reply": "Your snappy, hyper-realistic human WhatsApp message (25-50 words max)",
  "language": "auto-detected language code (en, ar, ru, fr, de, hi, etc.)",
  "action": "NONE|UPDATE_LEAD|SEARCH_PROPERTY|CHECK_CALENDAR|BOOK_MEETING|HANDOFF|ISSUE_VOUCHER",
  "lead_updates": {
    "buyer_location": "UAE Resident | International",
    "purchase_purpose": "Investment ROI | Personal Residence",
    "budget_min": 1000000,
    "budget_max": 2000000,
    "timeline": "Immediate | 0-3 months | 3-6 months"
  },
  "handoff_reason": "Explanation if action is HANDOFF"
}
`;
  }

  /**
   * Generate AI Response using OpenAI gpt-4o-mini API
   */
  static async generateResponse(options: AIServiceOptions): Promise<AIStructuredOutput> {
    const apiKey = process.env.OPENAI_API_KEY;

    if (!apiKey || apiKey.includes('placeholder')) {
      return this.generateMockResponse(options);
    }

    try {
      const systemPrompt = this.buildSystemPrompt(options);
      const messages = [
        { role: 'system', content: systemPrompt },
        ...options.conversationHistory.map((m) => ({
          role: m.sender === 'LEAD' ? 'user' : 'assistant',
          content: m.text,
        })),
        { role: 'user', content: options.userMessage },
      ];

      const response = await fetch('https://api.openai.com/v1/chat/completions', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${apiKey}`,
        },
        body: JSON.stringify({
          model: 'gpt-4o-mini',
          messages,
          temperature: 0.5,
          response_format: { type: 'json_object' },
        }),
      });

      if (!response.ok) {
        const errText = await response.text();
        console.error('OpenAI API Error:', errText);
        return this.generateMockResponse(options);
      }

      const data = await response.json();
      const rawContent = data.choices[0]?.message?.content || '';
      return ActionService.parseAIOutput(rawContent);
    } catch (e: any) {
      console.error('AI Engine Exception:', e);
      return this.generateMockResponse(options);
    }
  }

  /**
   * Smart Rule-Based Mock Engine for Testing
   */
  private static generateMockResponse(options: AIServiceOptions): AIStructuredOutput {
    const text = options.userMessage.toLowerCase();

    if (text.includes('human') || text.includes('minesh') || text.includes('call me') || text.includes('agent')) {
      return {
        reply: "Got it! I'm connecting you directly with Minesh Patel (@thepodsrealestate) right now. He'll ping you on WhatsApp in a moment!",
        language: 'en',
        action: 'HANDOFF',
        handoff_reason: 'Lead explicitly requested human contact',
      };
    }

    if (text.includes('voucher') || text.includes('20k') || text.includes('reward')) {
      return {
        reply: "As a special privilege, when you purchase your property through @thepodsrealestate, Minesh compliments your deal with an exclusive AED 20,000 VIP Fine-Dining Voucher at The Pods Bluewaters! Shall we look at available projects first?",
        language: 'en',
        action: 'UPDATE_LEAD',
      };
    }

    if (text.includes('danube') || text.includes('bayz') || text.includes('1%')) {
      return {
        reply: "Ah, the famous Danube 1% plan! BAYZ 101 in Business Bay is an absolute showstopper. Studios start at 650K AED. Are you looking at this as a high-yield investment or a personal pad?",
        language: 'en',
        action: 'UPDATE_LEAD',
        lead_updates: { purchase_purpose: 'Investment ROI' },
      };
    }

    if (text.includes('sobha') || text.includes('hartland')) {
      return {
        reply: "Sobha Hartland II is pure luxury—lagoon views and 50% green spaces. 1-Beds start at 998K AED with a smooth 5% down plan. Shall we set up a private Pod presentation at Bluewaters to walk through details?",
        language: 'en',
        action: 'UPDATE_LEAD',
      };
    }

    if (text.includes('meeting') || text.includes('pod') || text.includes('bluewaters') || text.includes('book')) {
      return {
        reply: "Awesome! We'd love to host you at a private pod at The Pods Bluewaters to walk through floor plans and investment numbers. Does tomorrow afternoon work for you?",
        language: 'en',
        action: 'CHECK_CALENDAR',
      };
    }

    const leadGreeting = options.leadName && options.leadName !== 'Guest' && options.leadName !== 'Unknown' ? `Hey ${options.leadName}!` : 'Hey there!';

    return {
      reply: `${leadGreeting} Good to connect. Are you looking at high-yield off-plan investments or your next luxury residence in Dubai?`,
      language: 'en',
      action: 'NONE',
    };
  }
}

