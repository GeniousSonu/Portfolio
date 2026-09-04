// scratch/test_dual_model_routing.mjs
// Verifies dual-model routing:
// 1. Personal / FAQ query -> Routes to Gemini
// 2. General query -> Routes to OpenRouter (google/gemma-4-26b-a4b-it:free)

const PORT = 3000;
const BASE_URL = `http://localhost:${PORT}/api/chatbot`;

async function testRouting() {
  console.log('=== STARTING DUAL-MODEL ROUTING TEST ===\n');

  // 1. Test Personal Query (FAQ matched -> Gemini)
  console.log('--- TEST 1: Personal / Portfolio Query ---');
  const personalQuery = 'Tell me about Sahinur IoT patent for vaccines';
  const res1 = await fetch(BASE_URL, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'origin': 'http://localhost:3000',
      'x-forwarded-for': '172.16.0.1',
    },
    body: JSON.stringify({ message: personalQuery }),
  });

  const data1 = await res1.json();
  console.log('Query:', personalQuery);
  console.log('Status:', res1.status);
  console.log('Response:', data1.reply);
  console.log('--- TEST 1 DONE ---\n');

  // 2. Test General Query (No FAQ matched -> OpenRouter Gemma)
  console.log('--- TEST 2: General / Off-topic Query ---');
  const generalQuery = 'How many r are in the word strawberry? Explain briefly.';
  const res2 = await fetch(BASE_URL, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'origin': 'http://localhost:3000',
      'x-forwarded-for': '172.16.0.2',
    },
    body: JSON.stringify({ message: generalQuery }),
  });

  const data2 = await res2.json();
  console.log('Query:', generalQuery);
  console.log('Status:', res2.status);
  console.log('Response:', data2.reply);
  console.log('--- TEST 2 DONE ---\n');

  // 3. Test General Query asking about the meaning of life
  console.log('--- TEST 3: General Query (Meaning of Life) ---');
  const generalQuery2 = 'What is the meaning of life?';
  const res3 = await fetch(BASE_URL, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'origin': 'http://localhost:3000',
      'x-forwarded-for': '172.16.0.3',
    },
    body: JSON.stringify({ message: generalQuery2 }),
  });

  const data3 = await res3.json();
  console.log('Query:', generalQuery2);
  console.log('Status:', res3.status);
  console.log('Response:', data3.reply);
  console.log('--- TEST 3 DONE ---\n');

  console.log('=== DUAL-MODEL ROUTING TESTS FINISHED ===');
}

testRouting().catch((err) => {
  console.error('Test error:', err);
  process.exit(1);
});
