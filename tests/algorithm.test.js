// Node-runnable tests — run with: node tests/algorithm.test.js
import { bestWindows } from '../js/algorithm.js';
let pass = 0, fail = 0;
function assert(desc, actual, expected) {
  if (JSON.stringify(actual) === JSON.stringify(expected)) { console.log('✓', desc); pass++; }
  else { console.error('✗', desc, '\n  got:', JSON.stringify(actual), '\n  expected:', JSON.stringify(expected)); fail++; }
}

// No codes → no windows
assert('no codes returns empty', bestWindows([], 5, 6), []);

// Single person available all days → first result is a long window
{
  const results = bestWindows([{ name: 'Alice', unavailableDays: [] }], 5, 6);
  assert('all-available first window starts at 0', results[0].startDay, 0);
  assert('all-available first window length >= 6', results[0].length >= 6, true);
  assert('all-available first window score is 1.0', results[0].score, 1.0);
}

// Windows are non-overlapping
{
  const results = bestWindows([{ name: 'Alice', unavailableDays: [] }], 5, 6);
  for (let i = 1; i < results.length; i++) {
    const prev = results[i - 1];
    const curr = results[i];
    assert(`window ${i} does not overlap ${i-1}`,
      curr.startDay >= prev.startDay + prev.length, true);
  }
}

// Person unavailable on days 0–5 → window not starting at 0
{
  const results = bestWindows([{ name: 'Alice', unavailableDays: [0,1,2,3,4,5] }], 1, 6);
  assert('unavailable days excluded from best window', results[0].startDay >= 6, true);
}

// Returns at most topN results
{
  const results = bestWindows([{ name: 'Alice', unavailableDays: [] }], 3, 6);
  assert('respects topN', results.length <= 3, true);
}

console.log(`\n${pass} passed, ${fail} failed`);
