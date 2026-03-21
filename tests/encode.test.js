// Node-runnable tests — run with: node tests/encode.test.js
import { encode, decode } from '../js/encode.js';
let pass = 0, fail = 0;
function assert(desc, actual, expected) {
  if (JSON.stringify(actual) === JSON.stringify(expected)) { console.log('✓', desc); pass++; }
  else { console.error('✗', desc, '\n  got:', actual, '\n  expected:', expected); fail++; }
}
// Tests added in Task 2
console.log(`\n${pass} passed, ${fail} failed`);
