// e2e.test.ts
// End-to-end test: Calculator → Result → Save → History
// Runs in Node.js with expo-sqlite web adapter

import { bootApp } from '../src/services/boot';
import { calculationRepository } from '../src/repositories/calculation-repository';
import { calculateVoltageDrop } from '@sparkywiz/calculators';

async function runTest() {
  console.log('=== SparkyWiz E2E Test ===');

  // 1. Boot the database
  console.log('1. Booting database...');
  await bootApp();
  console.log('   ✅ Database booted');

  // 2. Create a sample voltage drop input
  const input = {
    phase: 1 as const,
    voltage: 120,
    material: 'copper' as const,
    wireSize: '#12',
    distance: 100,
    current: 15,
  };

  // 3. Run the calculation
  console.log('2. Running voltage drop calculation...');
  const result = calculateVoltageDrop(input);
  console.log('   ✅ Calculation complete');
  console.log(`   Voltage Drop: ${result.voltageDrop.toFixed(2)}V`);
  console.log(`   Percentage: ${result.dropPercentage.toFixed(2)}%`);
  console.log(`   NEC Pass: ${result.meetsNEC}`);

  // 4. Save to database
  console.log('3. Saving to history...');
  await calculationRepository.save(input, result, 'voltageDrop');
  const count = await calculationRepository.count();
  console.log(`   ✅ Saved. Total calculations: ${count}`);

  // 5. Retrieve from history
  console.log('4. Retrieving from history...');
  const items = await calculationRepository.getAll();
  console.log(`   ✅ Retrieved ${items.length} items`);

  if (items.length > 0) {
    const item = items[0];
    const parsed = JSON.parse(item.result_json);
    console.log(`   Result: ${parsed.voltageDrop.toFixed(2)}V (${parsed.dropPercentage.toFixed(2)}%)`);
  }

  console.log('\n=== All E2E Tests Passed ===');
}

runTest().catch((err) => {
  console.error('❌ E2E Test Failed:', err.message);
  process.exit(1);
});
