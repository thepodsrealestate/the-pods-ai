import { LeadService } from '../lib/services/leadService';
import { AIService } from '../lib/services/aiService';
import { CalendarService } from '../lib/services/calendarService';
import { VoucherService } from '../lib/services/voucherService';

async function runPhase2Tests() {
  console.log('--------------------------------------------------');
  console.log('🚀 RUNNING PHASE 2 WHATSAPP & AI CONCIERGE TEST SUITE');
  console.log('--------------------------------------------------');

  // TEST 1: Lead Phone Normalization
  const rawPhone = '0501234567';
  const normalized = LeadService.normalizePhone(rawPhone);
  console.log(`[TEST 1] Phone Normalization: ${rawPhone} -> ${normalized}`);
  if (normalized !== '+971501234567') throw new Error('Phone normalization failed');

  // TEST 2: AI Property Catalog Response (Danube)
  const aiDanube = await AIService.generateResponse({
    conversationHistory: [],
    userMessage: 'Tell me about Danube 1% monthly payment plan',
  });
  console.log('\n[TEST 2] Danube AI Query Result:');
  console.log(`  - Reply: "${aiDanube.reply}"`);
  console.log(`  - Action: ${aiDanube.action}`);
  if (!aiDanube.reply.toLowerCase().includes('danube')) throw new Error('Danube AI match failed');

  // TEST 3: Human Handoff Trigger
  const aiHandoff = await AIService.generateResponse({
    conversationHistory: [],
    userMessage: 'I want to speak to Minesh Patel right now',
  });
  console.log('\n[TEST 3] Human Handoff Query Result:');
  console.log(`  - Reply: "${aiHandoff.reply}"`);
  console.log(`  - Action: ${aiHandoff.action}`);
  if (aiHandoff.action !== 'HANDOFF') throw new Error('Human handoff trigger failed');

  // TEST 4: Voucher Code Generation
  const voucherCode = VoucherService.generateVoucherCode();
  console.log(`\n[TEST 4] Cryptographic VIP Voucher Code: ${voucherCode}`);
  if (!voucherCode.startsWith('POD-VIP-')) throw new Error('Voucher format invalid');

  console.log('\n--------------------------------------------------');
  console.log('✅ ALL PHASE 2 AUTOMATED INTEGRATION TESTS PASSED!');
  console.log('--------------------------------------------------');
}

runPhase2Tests().catch((err) => {
  console.error('❌ Test Failure:', err);
  process.exit(1);
});
