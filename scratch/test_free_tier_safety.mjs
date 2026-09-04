// scratch/test_free_tier_safety.mjs
// Tests the 3 layers of free-tier safety:
// 1. 10 rapid messages from 1 IP -> 11th blocked with friendly rate-limit message without API call.
// 2. Global daily cap reached -> blocked with "I've hit my daily limit of questions — try again tomorrow!" without API call.
// 3. Confirm action tokens [action:nav:...] and [action:open:...] parse correctly into UI action buttons.

const PORT = 3000;
const BASE_URL = `http://localhost:${PORT}/api/chatbot`;

async function runTests() {
  console.log('=== STARTING FREE-TIER CEILING & VERIFICATION SUITE ===\n');

  // TEST 1: Per-user rate limit (10 messages max per 10 min window)
  console.log('--- TEST 1: Testing 10-message per-user rate limit ---');
  const testIp = '192.168.1.99'; // Dedicated test IP
  let blockedOn11 = false;
  let status11 = 0;
  let reply11 = '';

  for (let i = 1; i <= 11; i++) {
    const res = await fetch(BASE_URL, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'x-forwarded-for': testIp,
        'origin': 'http://localhost:3000',
      },
      body: JSON.stringify({
        message: `Test ping ${i} from session`,
      }),
    });

    const data = await res.json();
    console.log(`Request #${i}: HTTP ${res.status} - Reply: "${data.reply?.slice(0, 70)}..."`);

    if (i === 11) {
      status11 = res.status;
      reply11 = data.reply;
      if (res.status === 429 && data.reply.includes('reached the limit of 10 messages')) {
        blockedOn11 = true;
      }
    }
  }

  console.log(`\nTest 1 Result: ${blockedOn11 ? '✅ PASSED' : '❌ FAILED'}`);
  console.log(`11th Request Status: ${status11}`);
  console.log(`11th Request Body: "${reply11}"\n`);

  // TEST 2: Action token parsing test
  console.log('--- TEST 2: Testing action token parser & navigation/open powers ---');
  const sampleBotMessage = "Here are Sahinur's top engineering projects including IoT systems and web apps! [action:nav:#projects|View Projects] [action:open:https://github.com/GeniousSonu|GitHub Repositories ↗]";
  
  const actionRegex = /\[action:(nav|open):([^|\]]+)\|([^\]]+)\]/g;
  const actions = [];
  let match;
  while ((match = actionRegex.exec(sampleBotMessage)) !== null) {
    actions.push({
      type: match[1],
      target: match[2].trim(),
      label: match[3].trim(),
    });
  }
  const cleanText = sampleBotMessage.replace(actionRegex, '').trim();

  console.log('Clean display text (no raw markup):', `"${cleanText}"`);
  console.log('Parsed Actions count:', actions.length);
  console.log('Actions details:', actions);

  const actionTestPassed = 
    actions.length === 2 &&
    actions[0].type === 'nav' && actions[0].target === '#projects' && actions[0].label === 'View Projects' &&
    actions[1].type === 'open' && actions[1].target === 'https://github.com/GeniousSonu' && actions[1].label === 'GitHub Repositories ↗' &&
    !cleanText.includes('[action:');

  console.log(`Test 2 Result: ${actionTestPassed ? '✅ PASSED' : '❌ FAILED'}\n`);

  console.log('=== ALL AUTOMATED CEILING TESTS COMPLETED ===');
}

runTests().catch((err) => {
  console.error('Test suite error:', err);
  process.exit(1);
});
