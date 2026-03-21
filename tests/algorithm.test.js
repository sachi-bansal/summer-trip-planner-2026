// Node-runnable tests — run with: node tests/algorithm.test.js
import { bestWindows } from '../js/algorithm.js';
let pass = 0, fail = 0;
function assert(desc, actual, expected) {
  if (JSON.stringify(actual) === JSON.stringify(expected)) { console.log('✓', desc); pass++; }
  else { console.error('✗', desc, '\n  got:', actual, '\n  expected:', expected); fail++; }
}
// Tests added in Task 3
console.log(`\n${pass} passed, ${fail} failed`);
