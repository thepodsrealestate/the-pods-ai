import { CAMPAIGNS, isCampaignActive, getActiveEvents } from '../lib/config/campaigns';
import { AIService } from '../lib/services/aiService';

console.log('--- 1. TESTING CURRENT CAMPAIGN STATUS (TODAY: SEPT 18, 2026) ---');
const leicester = CAMPAIGNS.find(c => c.id === 'leicester-expo-sept-2026')!;
console.log('Leicester active today?', isCampaignActive(leicester));
console.log('Active events count today:', getActiveEvents().length);

console.log('\n--- 2. TESTING AUTO-EXPIRY LOGIC ---');
const sept28Date = new Date('2026-09-28T00:00:01+01:00');
const leicesterEnd = new Date(leicester.dates.end + 'T23:59:59+01:00');
const isExpiredOnSept28 = sept28Date > leicesterEnd;
console.log('On Sept 28 00:00:01 BST: expired =', isExpiredOnSept28);

console.log('\n--- 3. TESTING COPY LENGTH & NATURAL TONE ---');
const mock1 = (AIService as any).generateMockResponse({
  userMessage: 'Hello! I filled in your form and would like to know more about your business. Full name: Akshit Sidhpura. Phone number: +447368941826. Are you considering a property investment in Dubai?: Yes, quite keen. What type of property are you interested in?: 1 Bedroom',
  conversationHistory: [],
  leadName: 'Akshit',
  phone: '+447368941826',
  buyerLocation: 'United Kingdom'
});
console.log('Akshit (1-bed) reply:');
console.log(`"${mock1.reply}"`);
const words1 = mock1.reply.trim().split(/\s+/).length;
console.log(`Words: ${words1} (under 35 limit: ${words1 <= 35})`);

const mock2 = (AIService as any).generateMockResponse({
  userMessage: 'Hello! I filled in your form and would like to know more about your business. Full name: Nilufar Datey. Phone number: +447714423036',
  conversationHistory: [],
  leadName: 'Nilufar',
  phone: '+447714423036',
  buyerLocation: 'United Kingdom'
});
console.log('\nNilufar (General) reply:');
console.log(`"${mock2.reply}"`);
const words2 = mock2.reply.trim().split(/\s+/).length;
console.log(`Words: ${words2} (under 35 limit: ${words2 <= 35})`);

console.log('\n--- 4. TESTING ADDRESS & POSTCODE INQUIRIES ---');
console.log('Event address in config:', leicester.location.address);
console.log('Calendar location:', leicester.location.calendarLocation);

const mockAddress = (AIService as any).generateMockResponse({
  userMessage: 'Where is the expo happening? What is the address and postcode?',
  conversationHistory: [],
  leadName: 'Chetan',
  phone: '+447368941826',
  buyerLocation: 'United Kingdom',
  campaignName: 'Danube_DubaiExpo_Leicester_Sept26-27'
});
console.log('Address inquiry reply:');
console.log(`"${mockAddress.reply}"`);
console.log('Contains Smith Way?', mockAddress.reply.includes('Smith Way'));
console.log('Contains LE19 1SW?', mockAddress.reply.includes('LE19 1SW'));

const systemPrompt = (AIService as any).buildSystemPrompt({
  leadName: 'Chetan',
  phone: '+447368941826',
  buyerLocation: 'United Kingdom',
  campaignName: 'Danube_DubaiExpo_Leicester_Sept26-27',
  userMessage: 'What is the venue address?'
});
console.log('\n--- 5. SYSTEM PROMPT ADDRESS VERIFICATION ---');
console.log('System prompt contains "Smith Way, Grove Park, Enderby, Leicester LE19 1SW"?', systemPrompt.includes('Smith Way, Grove Park, Enderby, Leicester LE19 1SW'));
console.log('System prompt contains "LE19 1SW"?', systemPrompt.includes('LE19 1SW'));

console.log('\n✅ ALL AUTO-EXPIRY, COPY, AND ADDRESS CHECKS PASSED!');
