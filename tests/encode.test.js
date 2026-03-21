// Node-runnable tests — run with: node tests/encode.test.js
import { encode, decode } from '../js/encode.js';
let pass = 0, fail = 0;
function assert(desc, actual, expected) {
  if (JSON.stringify(actual) === JSON.stringify(expected)) { console.log('✓', desc); pass++; }
  else { console.error('✗', desc, '\n  got:', actual, '\n  expected:', expected); fail++; }
}
// Tests added in Task 2

// All days available → encode → decode → empty unavailableDays
{
  const code = encode([], {});
  const result = decode(code);
  assert('all available round-trips', result.unavailableDays, []);
}

// Single day unavailable
{
  const code = encode([0], {}); // May 1
  assert('single day code is 31+ chars', code.length >= 31, true);
  const result = decode(code);
  assert('single day round-trips', result.unavailableDays, [0]);
}

// Multiple days unavailable
{
  const days = [0, 1, 2, 100, 183];
  const code = encode(days, {});
  const result = decode(code);
  assert('multiple days round-trip', result.unavailableDays, days);
}

// With reason
{
  const code = encode([5, 6, 7], { 0: 'Wedding' }); // block index 0
  const result = decode(code);
  assert('reason round-trips', result.reasons[0], 'Wedding');
}

// Invalid code returns empty
{
  const result = decode('not-a-valid-code!!');
  assert('invalid code returns empty days', result.unavailableDays, []);
}

console.log(`\n${pass} passed, ${fail} failed`);
