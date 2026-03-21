# Summer Trip Planner 2026 Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Build a static two-page web app where 7 friends mark unavailable dates, generate share codes, and the organizer pastes all codes into a results page showing a heat map and top 5 best trip windows.

**Architecture:** Two standalone HTML pages (`index.html`, `results.html`) sharing a CSS file and three JS modules. All logic runs client-side; the share code encodes availability + reasons as a base62 string, no server needed.

**Tech Stack:** Pure HTML5, CSS3, vanilla JavaScript (ES6 modules). Node.js for running unit tests. Deployed via GitHub Pages.

---

## File Map

| File | Responsibility |
|------|---------------|
| `index.html` | Availability entry page (step 1: name picker, step 2: calendar + code gen) |
| `results.html` | Results page (code input, best windows, heat map) |
| `css/style.css` | All shared styles, CSS custom properties, responsive layout |
| `js/encode.js` | Encode/decode share codes (bitfield + reasons suffix). Pure functions, no DOM. |
| `js/algorithm.js` | Best windows algorithm. Pure functions, no DOM. |
| `js/calendar.js` | Calendar rendering, tap/drag handlers, reason popover — used by index.html |
| `js/app.js` | index.html orchestration: step transitions, generate-code button |
| `js/results.js` | results.html orchestration: decode codes, render best windows, heat map, tooltips |
| `tests/encode.test.js` | Node-runnable unit tests for encode.js |
| `tests/algorithm.test.js` | Node-runnable unit tests for algorithm.js |

---

## Task 1: Project Scaffold

**Files:**
- Create: `index.html`
- Create: `results.html`
- Create: `css/style.css`
- Create: `js/encode.js`
- Create: `js/algorithm.js`
- Create: `js/calendar.js`
- Create: `js/app.js`
- Create: `js/results.js`
- Create: `tests/encode.test.js`
- Create: `tests/algorithm.test.js`

- [ ] **Step 1: Create directory structure**

```bash
mkdir -p css js tests
```

- [ ] **Step 2: Create `css/style.css` with CSS custom properties**

```css
/* css/style.css */
:root {
  --coral: #ff7043;
  --coral-light: #ffccbc;
  --coral-dark: #bf360c;
  --cream: #fff9f0;
  --cream-dark: #fff3e0;
  --text: #3e2723;
  --text-muted: #8d6e63;
  --green-full: #43a047;
  --green-most: #66bb6a;
  --green-some: #a5d6a7;
  --green-light: #c8e6c9;
  --yellow: #ffb74d;
  --red-light: #ff7043;
  --red-full: #e53935;
  --radius: 12px;
  --radius-sm: 6px;
  --font: 'Inter', system-ui, sans-serif;
}

* { box-sizing: border-box; margin: 0; padding: 0; }

body {
  font-family: var(--font);
  background: var(--cream);
  color: var(--text);
  min-height: 100vh;
}

.header {
  background: var(--coral);
  color: white;
  padding: 14px 20px;
  display: flex;
  justify-content: space-between;
  align-items: center;
  font-weight: 700;
  font-size: 1rem;
  position: sticky;
  top: 0;
  z-index: 100;
}

.header a {
  color: var(--coral-light);
  text-decoration: none;
  font-size: 0.85rem;
  font-weight: 500;
}

.container {
  max-width: 480px;
  margin: 0 auto;
  padding: 24px 16px;
}

.btn {
  display: inline-block;
  background: var(--coral);
  color: white;
  border: none;
  border-radius: var(--radius-sm);
  padding: 12px 20px;
  font-size: 0.95rem;
  font-weight: 600;
  cursor: pointer;
  width: 100%;
  text-align: center;
}

.btn:hover { background: var(--coral-dark); }
.btn-outline {
  background: transparent;
  border: 2px solid var(--coral);
  color: var(--coral-dark);
}
```

- [ ] **Step 3: Create `index.html` shell**

```html
<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>Summer Trip 2026</title>
  <link rel="preconnect" href="https://fonts.googleapis.com">
  <link href="https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700&display=swap" rel="stylesheet">
  <link rel="stylesheet" href="css/style.css">
</head>
<body>
  <header class="header">
    <span>☀️ Summer Trip 2026</span>
    <a href="results.html">View Results →</a>
  </header>
  <main class="container" id="app">
    <!-- Step 1 and Step 2 rendered by app.js -->
  </main>
  <script type="module" src="js/app.js"></script>
</body>
</html>
```

- [ ] **Step 4: Create `results.html` shell**

```html
<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>Results — Summer Trip 2026</title>
  <link rel="preconnect" href="https://fonts.googleapis.com">
  <link href="https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700&display=swap" rel="stylesheet">
  <link rel="stylesheet" href="css/style.css">
</head>
<body>
  <header class="header">
    <span>☀️ Summer Trip 2026</span>
    <a href="index.html">← Back</a>
  </header>
  <main class="container" id="results-app">
    <!-- Rendered by results.js -->
  </main>
  <script type="module" src="js/results.js"></script>
</body>
</html>
```

- [ ] **Step 5: Create empty JS module stubs**

`js/encode.js`:
```js
// Encode/decode share codes
export function encode(unavailableDays, reasons) { return ''; }
export function decode(code) { return { unavailableDays: [], reasons: {} }; }
```

`js/algorithm.js`:
```js
// Best windows algorithm
export function bestWindows(codesData, topN = 5, minDays = 6) { return []; }
```

`js/calendar.js`, `js/app.js`, `js/results.js`: create as empty files with a single comment `// TODO`.

- [ ] **Step 6: Create empty test stubs**

`tests/encode.test.js`:
```js
// Node-runnable tests — run with: node tests/encode.test.js
import { encode, decode } from '../js/encode.js';
let pass = 0, fail = 0;
function assert(desc, actual, expected) {
  if (JSON.stringify(actual) === JSON.stringify(expected)) { console.log('✓', desc); pass++; }
  else { console.error('✗', desc, '\n  got:', actual, '\n  expected:', expected); fail++; }
}
// Tests added in Task 2
console.log(`\n${pass} passed, ${fail} failed`);
```

`tests/algorithm.test.js`: same boilerplate, tests added in Task 3.

- [ ] **Step 7: Verify the pages open in a browser**

Open `index.html` in a browser (e.g., `open index.html` on Mac). You should see the orange header and a blank content area. No console errors.

- [ ] **Step 8: Commit**

```bash
git add .
git commit -m "scaffold: project structure, HTML shells, CSS foundation"
```

---

## Task 2: Encode/Decode Logic (TDD)

**Files:**
- Modify: `js/encode.js`
- Modify: `tests/encode.test.js`

Constants used throughout:
- Day 0 = May 1, 2026. Day 183 = Oct 31, 2026. Total = 184 days.
- Base62 alphabet: `0123456789ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz`
- Bitfield is exactly 31 base62 chars.
- Reasons suffix format: `<idx>:<text>` pairs separated by `|`, appended after `_` delimiter.

- [ ] **Step 1: Write failing tests for `encode` / `decode` round-trip**

Replace the `// Tests added in Task 2` comment in `tests/encode.test.js`:

```js
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
```

- [ ] **Step 2: Run tests and confirm they fail**

```bash
node --experimental-vm-modules tests/encode.test.js
```
Expected: errors about `encode` returning `''`.

- [ ] **Step 3: Implement `encode` and `decode` in `js/encode.js`**

```js
// js/encode.js
const BASE62 = '0123456789ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz';
const TOTAL_DAYS = 184; // May 1 – Oct 31, 2026
const BITFIELD_CHARS = 31; // ceil(184 * log2(2) / log2(62))

function bitsToBase62(bits) {
  // bits: Uint8Array of length 184 (one bit conceptually per day, packed)
  // Pack 184 bits into a BigInt, then base62-encode as exactly 31 chars
  let n = 0n;
  for (let i = 0; i < TOTAL_DAYS; i++) {
    if (bits[i]) n |= (1n << BigInt(TOTAL_DAYS - 1 - i));
  }
  let result = '';
  for (let i = 0; i < BITFIELD_CHARS; i++) {
    result = BASE62[Number(n % 62n)] + result;
    n /= 62n;
  }
  return result;
}

function base62ToBits(str) {
  let n = 0n;
  for (const ch of str) {
    const v = BASE62.indexOf(ch);
    if (v === -1) return null;
    n = n * 62n + BigInt(v);
  }
  const bits = new Array(TOTAL_DAYS).fill(0);
  for (let i = 0; i < TOTAL_DAYS; i++) {
    bits[TOTAL_DAYS - 1 - i] = Number((n >> BigInt(i)) & 1n);
  }
  return bits;
}

export function encode(unavailableDays, reasons) {
  // unavailableDays: sorted number[] of day indices (0–183)
  // reasons: { blockIndex: 'text', ... }
  const bits = new Array(TOTAL_DAYS).fill(0);
  for (const d of unavailableDays) bits[d] = 1;
  const bitfield = bitsToBase62(bits);

  const reasonEntries = Object.entries(reasons)
    .filter(([, v]) => v && v.trim())
    .map(([k, v]) => `${k}:${v.slice(0, 20).replace(/[_|]/g, '')}`);

  if (reasonEntries.length === 0) return bitfield;
  return `${bitfield}_${reasonEntries.join('|')}`;
}

export function decode(code) {
  try {
    const [bitfieldStr, reasonsSuffix] = code.split('_');
    if (bitfieldStr.length !== BITFIELD_CHARS) return { unavailableDays: [], reasons: {} };

    const bits = base62ToBits(bitfieldStr);
    if (!bits) return { unavailableDays: [], reasons: {} };

    const unavailableDays = bits.map((b, i) => b ? i : -1).filter(i => i !== -1);

    const reasons = {};
    if (reasonsSuffix) {
      for (const entry of reasonsSuffix.split('|')) {
        const colonIdx = entry.indexOf(':');
        if (colonIdx === -1) continue;
        const idx = parseInt(entry.slice(0, colonIdx), 10);
        const text = entry.slice(colonIdx + 1);
        if (!isNaN(idx)) reasons[idx] = text;
      }
    }
    return { unavailableDays, reasons };
  } catch {
    return { unavailableDays: [], reasons: {} };
  }
}
```

- [ ] **Step 4: Run tests and confirm they pass**

```bash
node --experimental-vm-modules tests/encode.test.js
```
Expected: `5 passed, 0 failed`

- [ ] **Step 5: Commit**

```bash
git add js/encode.js tests/encode.test.js
git commit -m "feat: encode/decode share codes with base62 bitfield + reasons"
```

---

## Task 3: Best Windows Algorithm (TDD)

**Files:**
- Modify: `js/algorithm.js`
- Modify: `tests/algorithm.test.js`

Input to `bestWindows`: array of decoded result objects `{ name, unavailableDays }`. Output: array of `{ startDay, endDay, length, score, peopleAvailable, totalPeople }` sorted best-first, max `topN`, min `minDays` length.

- [ ] **Step 1: Write failing tests in `tests/algorithm.test.js`**

```js
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
```

- [ ] **Step 2: Run tests and confirm they fail**

```bash
node --experimental-vm-modules tests/algorithm.test.js
```
Expected: failures because `bestWindows` returns `[]`.

- [ ] **Step 3: Implement `bestWindows` in `js/algorithm.js`**

```js
// js/algorithm.js
const TOTAL_DAYS = 184;

export function bestWindows(codesData, topN = 5, minDays = 6) {
  if (!codesData.length) return [];
  const n = codesData.length;

  // Build per-day availability count
  const available = new Array(TOTAL_DAYS).fill(n);
  for (const { unavailableDays } of codesData) {
    for (const d of unavailableDays) available[d]--;
  }

  // Enumerate all windows of length >= minDays, score = avg availability
  const candidates = [];
  for (let start = 0; start < TOTAL_DAYS; start++) {
    let sum = 0;
    for (let len = 1; start + len <= TOTAL_DAYS; len++) {
      sum += available[start + len - 1];
      if (len < minDays) continue;
      candidates.push({ startDay: start, length: len, sum });
    }
  }

  // Sort by average score descending
  candidates.sort((a, b) => (b.sum / b.length) - (a.sum / a.length));

  // Greedy non-overlapping selection
  const selected = [];
  const used = new Uint8Array(TOTAL_DAYS);
  for (const c of candidates) {
    if (selected.length >= topN) break;
    let overlaps = false;
    for (let d = c.startDay; d < c.startDay + c.length; d++) {
      if (used[d]) { overlaps = true; break; }
    }
    if (overlaps) continue;
    for (let d = c.startDay; d < c.startDay + c.length; d++) used[d] = 1;
    const score = Math.round((c.sum / (c.length * n)) * 100) / 100;
    selected.push({
      startDay: c.startDay,
      endDay: c.startDay + c.length - 1,
      length: c.length,
      score,
      peopleAvailable: Math.round(c.sum / c.length),
      totalPeople: n,
    });
  }
  return selected;
}
```

- [ ] **Step 4: Run tests and confirm they pass**

```bash
node --experimental-vm-modules tests/algorithm.test.js
```
Expected: `5 passed, 0 failed`

- [ ] **Step 5: Commit**

```bash
git add js/algorithm.js tests/algorithm.test.js
git commit -m "feat: best windows algorithm with greedy non-overlapping selection"
```

---

## Task 4: Step 1 — Name Picker UI

**Files:**
- Modify: `js/app.js`
- Modify: `css/style.css`

State lives in a module-level object in `app.js`:
```js
const state = { name: null, unavailableDays: [], reasons: {} };
```

- [ ] **Step 1: Add name-picker styles to `css/style.css`**

```css
/* Name picker */
.welcome { text-align: center; padding: 24px 0 16px; }
.welcome h2 { font-size: 1.3rem; color: var(--coral-dark); margin-bottom: 8px; }
.welcome p { color: var(--text-muted); font-size: 0.9rem; line-height: 1.5; }

.name-list { display: flex; flex-direction: column; gap: 10px; margin-top: 24px; }
.name-btn {
  background: white;
  border: 2px solid var(--coral-light);
  border-radius: var(--radius-sm);
  padding: 14px 16px;
  font-size: 1rem;
  color: var(--coral-dark);
  cursor: pointer;
  text-align: left;
  transition: background 0.15s, border-color 0.15s;
}
.name-btn:hover, .name-btn.selected {
  background: var(--coral);
  color: white;
  border-color: var(--coral);
}
```

- [ ] **Step 2: Implement Step 1 render in `js/app.js`**

```js
// js/app.js
import { encode } from './encode.js';
import { renderCalendar } from './calendar.js';

const NAMES = [
  'Navya Annam', 'Sachi Bansal', 'Alaka Gorur',
  'Riyana Patel', 'Shivangi Sharma', 'Natasha Shetty', 'Sirina Yeung'
];

const state = { name: null, unavailableDays: [], reasons: {} };
const app = document.getElementById('app');

function renderStep1() {
  app.innerHTML = `
    <div class="welcome">
      <h2>Plan our summer trip together!</h2>
      <p>Select your name, then tap the days you <strong>can't</strong> make it.<br>
      If a date isn't marked, you're assumed free.</p>
    </div>
    <div class="name-list">
      ${NAMES.map(n => `<button class="name-btn" data-name="${n}">${n}</button>`).join('')}
    </div>`;

  app.querySelectorAll('.name-btn').forEach(btn => {
    btn.addEventListener('click', () => {
      state.name = btn.dataset.name;
      state.unavailableDays = [];
      state.reasons = {};
      renderStep2();
    });
  });
}

function renderStep2() {
  // Implemented in Task 5
}

renderStep1();
export { state, renderStep1 };
```

- [ ] **Step 3: Open `index.html` in browser, verify name list renders and is clickable**

Expected: 7 name buttons visible, coral styling, hover state works. Clicking a name produces no error (step 2 is blank for now).

- [ ] **Step 4: Commit**

```bash
git add js/app.js css/style.css
git commit -m "feat: step 1 name picker UI"
```

---

## Task 5: Step 2 — Calendar Render + Single Tap

**Files:**
- Modify: `js/calendar.js`
- Modify: `js/app.js`
- Modify: `css/style.css`

The calendar renders 6 months (May–Oct 2026). Day index math: May 1 = 0, May 2 = 1, …, Oct 31 = 183.

Month data:
```
May:   days 0–30   (31 days, starts Wednesday = weekday index 3)
June:  days 31–60  (30 days, starts Saturday = 6)
July:  days 61–91  (31 days, starts Wednesday = 3) — NOTE: 2026 calendar
Aug:   days 92–122 (31 days, starts Saturday = 6)
Sep:   days 123–152(30 days, starts Tuesday = 2)
Oct:   days 153–183(31 days, starts Thursday = 4)
```

Verify the day-of-week starts using `new Date(2026, 4, 1).getDay()` etc. in the browser console before hardcoding.

- [ ] **Step 1: Add calendar styles to `css/style.css`**

```css
/* Step 2 header */
.step2-header { display: flex; align-items: center; gap: 12px; margin-bottom: 20px; }
.back-btn { background: none; border: none; color: var(--coral); cursor: pointer; font-size: 0.9rem; }

/* Calendar */
.calendar { display: flex; flex-direction: column; gap: 24px; }
.month-grid { background: white; border-radius: var(--radius); padding: 16px; }
.month-label { font-size: 0.85rem; font-weight: 700; color: var(--coral-dark); text-transform: uppercase; letter-spacing: 0.05em; margin-bottom: 10px; text-align: center; }
.weekday-row { display: grid; grid-template-columns: repeat(7, 1fr); text-align: center; margin-bottom: 4px; }
.weekday-row span { font-size: 0.7rem; color: var(--text-muted); font-weight: 600; }
.days-grid { display: grid; grid-template-columns: repeat(7, 1fr); gap: 3px; }
.day-cell {
  aspect-ratio: 1;
  display: flex; align-items: center; justify-content: center;
  border-radius: 4px;
  font-size: 0.8rem;
  cursor: pointer;
  user-select: none;
  -webkit-user-select: none;
  color: var(--text);
  background: var(--cream);
  border: 1.5px solid transparent;
  touch-action: none;
}
.day-cell:hover { border-color: var(--coral-light); }
.day-cell.unavailable { background: var(--coral); color: white; }
.day-cell.empty { cursor: default; background: transparent; }

/* Generate button area */
.generate-area { margin-top: 24px; }
.code-display {
  margin-top: 16px;
  background: white;
  border-radius: var(--radius-sm);
  padding: 16px;
  text-align: center;
  display: none;
}
.code-display.visible { display: block; }
.code-text {
  font-family: monospace;
  font-size: 0.9rem;
  word-break: break-all;
  background: var(--cream-dark);
  padding: 10px;
  border-radius: 4px;
  margin: 10px 0;
}
.code-instructions { font-size: 0.85rem; color: var(--text-muted); margin-top: 8px; }
```

- [ ] **Step 2: Implement calendar render in `js/calendar.js`**

```js
// js/calendar.js
const MONTHS = [
  { name: 'May',       days: 31, startOffset: new Date(2026, 4, 1).getDay(), dayOffset: 0   },
  { name: 'June',      days: 30, startOffset: new Date(2026, 5, 1).getDay(), dayOffset: 31  },
  { name: 'July',      days: 31, startOffset: new Date(2026, 6, 1).getDay(), dayOffset: 61  },
  { name: 'August',    days: 31, startOffset: new Date(2026, 7, 1).getDay(), dayOffset: 92  },
  { name: 'September', days: 30, startOffset: new Date(2026, 8, 1).getDay(), dayOffset: 123 },
  { name: 'October',   days: 31, startOffset: new Date(2026, 9, 1).getDay(), dayOffset: 153 },
];
const WEEKDAYS = ['Su', 'Mo', 'Tu', 'We', 'Th', 'Fr', 'Sa'];

export function renderCalendar(container, state, onDayToggle) {
  container.innerHTML = `
    <div class="calendar">
      ${MONTHS.map(m => renderMonth(m, state)).join('')}
    </div>`;
  attachDragHandlers(container, state, onDayToggle);
}

function renderMonth(month, state) {
  const cells = [];
  for (let i = 0; i < month.startOffset; i++) cells.push('<div class="day-cell empty"></div>');
  for (let d = 0; d < month.days; d++) {
    const dayIndex = month.dayOffset + d;
    const unavail = state.unavailableDays.includes(dayIndex);
    cells.push(`<div class="day-cell${unavail ? ' unavailable' : ''}" data-day="${dayIndex}">${d + 1}</div>`);
  }
  return `
    <div class="month-grid">
      <div class="month-label">${month.name} 2026</div>
      <div class="weekday-row">${WEEKDAYS.map(w => `<span>${w}</span>`).join('')}</div>
      <div class="days-grid">${cells.join('')}</div>
    </div>`;
}

function attachDragHandlers(container, state, onDayToggle) {
  let dragging = false;
  let markMode = null; // 'mark' or 'unmark'

  function dayFromTarget(el) {
    const cell = el.closest('.day-cell:not(.empty)');
    return cell ? parseInt(cell.dataset.day, 10) : null;
  }

  container.addEventListener('pointerdown', e => {
    const day = dayFromTarget(e.target);
    if (day == null) return;
    dragging = true;
    markMode = state.unavailableDays.includes(day) ? 'unmark' : 'mark';
    onDayToggle(day, markMode);
    e.target.setPointerCapture(e.pointerId);
  });

  container.addEventListener('pointermove', e => {
    if (!dragging) return;
    const day = dayFromTarget(document.elementFromPoint(e.clientX, e.clientY));
    if (day != null) onDayToggle(day, markMode);
  });

  container.addEventListener('pointerup', () => { dragging = false; markMode = null; });
}
```

- [ ] **Step 3: Wire up Step 2 in `js/app.js`**

Replace the `renderStep2` stub:

```js
function renderStep2() {
  app.innerHTML = `
    <div class="step2-header">
      <button class="back-btn" id="back-btn">← Change name</button>
      <span style="color:var(--text-muted);font-size:0.9rem">Marking as <strong>${state.name}</strong></span>
    </div>
    <div id="cal-container"></div>
    <div class="generate-area">
      <button class="btn" id="gen-btn">Generate My Code ✓</button>
      <div class="code-display" id="code-display">
        <div style="font-weight:600;color:var(--coral-dark)">Your share code:</div>
        <div class="code-text" id="code-text"></div>
        <button class="btn" id="copy-btn">Copy Code</button>
        <div class="code-instructions">Text this code to Sachi! 📲</div>
      </div>
    </div>`;

  document.getElementById('back-btn').addEventListener('click', renderStep1);

  renderCalendar(document.getElementById('cal-container'), state, (day, mode) => {
    if (mode === 'mark' && !state.unavailableDays.includes(day)) {
      state.unavailableDays.push(day);
      state.unavailableDays.sort((a, b) => a - b);
    } else if (mode === 'unmark') {
      state.unavailableDays = state.unavailableDays.filter(d => d !== day);
    }
    renderCalendar(document.getElementById('cal-container'), state, arguments.callee);
    // Note: reason popover added in Task 6
  });

  document.getElementById('gen-btn').addEventListener('click', () => {
    const code = encode(state.unavailableDays, state.reasons);
    document.getElementById('code-text').textContent = code;
    document.getElementById('code-display').classList.add('visible');
  });

  document.getElementById('copy-btn').addEventListener('click', () => {
    navigator.clipboard.writeText(document.getElementById('code-text').textContent);
    document.getElementById('copy-btn').textContent = 'Copied! ✓';
    setTimeout(() => { document.getElementById('copy-btn').textContent = 'Copy Code'; }, 2000);
  });
}
```

Note: `arguments.callee` won't work in strict modules — replace with a named reference. Refactor `onDayToggle` as a named function `handleToggle` in `renderStep2` scope and pass it consistently.

- [ ] **Step 4: Test manually in browser**

1. Open `index.html`, pick a name → calendar appears for May–Oct 2026
2. Tap a few days → they turn coral/red
3. Tap same day again → it un-marks
4. Click "Generate My Code" → a 31-char code appears
5. Click "Copy Code" → button says "Copied! ✓"

- [ ] **Step 5: Commit**

```bash
git add js/calendar.js js/app.js css/style.css
git commit -m "feat: step 2 calendar render and single-tap marking"
```

---

## Task 6: Drag Gestures + Reason Popover

**Files:**
- Modify: `js/calendar.js`
- Modify: `js/app.js`
- Modify: `css/style.css`

Drag is already wired via pointer events in Task 5. This task adds the reason popover that appears after each gesture completes.

- [ ] **Step 1: Add popover styles to `css/style.css`**

```css
/* Reason popover */
.reason-popover {
  position: fixed;
  background: white;
  border-radius: var(--radius);
  box-shadow: 0 4px 20px rgba(0,0,0,0.15);
  padding: 16px;
  z-index: 200;
  width: 280px;
  max-width: 90vw;
}
.reason-popover h4 { font-size: 0.9rem; color: var(--coral-dark); margin-bottom: 10px; }
.reason-chips { display: flex; flex-wrap: wrap; gap: 6px; margin-bottom: 10px; }
.chip {
  background: var(--cream-dark);
  border: 1.5px solid var(--coral-light);
  border-radius: 20px;
  padding: 4px 12px;
  font-size: 0.8rem;
  color: var(--coral-dark);
  cursor: pointer;
}
.chip:hover, .chip.selected { background: var(--coral); color: white; border-color: var(--coral); }
.reason-input {
  width: 100%;
  border: 1.5px solid var(--coral-light);
  border-radius: var(--radius-sm);
  padding: 8px 10px;
  font-size: 0.85rem;
  outline: none;
  margin-bottom: 10px;
}
.reason-input:focus { border-color: var(--coral); }
.popover-actions { display: flex; gap: 8px; }
.popover-actions button { flex: 1; padding: 8px; border-radius: var(--radius-sm); font-size: 0.85rem; font-weight: 600; cursor: pointer; border: none; }
.popover-save { background: var(--coral); color: white; }
.popover-dismiss { background: var(--cream-dark); color: var(--text-muted); }
```

- [ ] **Step 2: Implement `showReasonPopover` in `js/app.js`**

Add this function to `app.js` (called after a drag/tap gesture completes):

```js
function showReasonPopover(blockIndex, existingReason, onSave) {
  const SUGGESTIONS = ['Wedding', 'Conference', 'Travel', 'Work', 'Other'];
  let current = existingReason || '';

  const el = document.createElement('div');
  el.className = 'reason-popover';
  el.innerHTML = `
    <h4>Reason? <span style="font-weight:400;color:var(--text-muted)">(optional)</span></h4>
    <div class="reason-chips">
      ${SUGGESTIONS.map(s => `<div class="chip${current === s ? ' selected' : ''}" data-val="${s}">${s}</div>`).join('')}
    </div>
    <input class="reason-input" maxlength="20" placeholder="Or type your own..." value="${current}">
    <div class="popover-actions">
      <button class="popover-dismiss">Skip</button>
      <button class="popover-save">Save</button>
    </div>`;

  // Position near center of screen (safe for mobile)
  el.style.left = '50%';
  el.style.top = '50%';
  el.style.transform = 'translate(-50%, -50%)';
  document.body.appendChild(el);

  const input = el.querySelector('.reason-input');
  el.querySelectorAll('.chip').forEach(chip => {
    chip.addEventListener('click', () => {
      el.querySelectorAll('.chip').forEach(c => c.classList.remove('selected'));
      chip.classList.add('selected');
      input.value = chip.dataset.val;
      current = chip.dataset.val;
    });
  });
  input.addEventListener('input', () => {
    current = input.value;
    el.querySelectorAll('.chip').forEach(c => c.classList.remove('selected'));
  });

  el.querySelector('.popover-save').addEventListener('click', () => {
    onSave(current.trim());
    el.remove();
  });
  el.querySelector('.popover-dismiss').addEventListener('click', () => {
    onSave('');
    el.remove();
  });
}
```

- [ ] **Step 3: Compute block index and trigger popover after gesture**

In `renderStep2`, update the `pointerup` flow: after a tap or drag completes, compute which contiguous block was just modified and call `showReasonPopover`. A contiguous block is a maximal run of consecutive `unavailableDays` indices. Block index = position of that block in the sorted list of blocks.

Add a helper:
```js
function getBlocks(days) {
  if (!days.length) return [];
  const sorted = [...days].sort((a,b)=>a-b);
  const blocks = [];
  let start = sorted[0], prev = sorted[0];
  for (let i = 1; i < sorted.length; i++) {
    if (sorted[i] === prev + 1) { prev = sorted[i]; }
    else { blocks.push({ start, end: prev }); start = prev = sorted[i]; }
  }
  blocks.push({ start, end: prev });
  return blocks;
}
```

After the `pointerup` in `calendar.js` fires `onGestureEnd(lastDayTouched)` callback (add this callback to `attachDragHandlers`), call `showReasonPopover` in `app.js` passing the block index containing `lastDayTouched` and the existing reason for that block (if any).

- [ ] **Step 4: Test manually**

1. Tap a single day → popover appears
2. Pick "Wedding" chip → input fills with "Wedding"
3. Click Save → popover dismisses, reason stored in `state.reasons`
4. Drag across 3 days → popover appears once for that block
5. Click Skip → popover dismisses, no reason stored

- [ ] **Step 5: Commit**

```bash
git add js/app.js js/calendar.js css/style.css
git commit -m "feat: reason popover after tap/drag with quick suggestions"
```

---

## Task 7: Results Page — Code Input + Decode

**Files:**
- Modify: `js/results.js`
- Modify: `css/style.css`

- [ ] **Step 1: Add results-page styles to `css/style.css`**

```css
/* Results page */
.section-label { font-size: 0.75rem; font-weight: 700; text-transform: uppercase; letter-spacing: 0.07em; color: var(--coral-dark); margin-bottom: 10px; }
.codes-panel { background: white; border-radius: var(--radius); padding: 16px; margin-bottom: 20px; }
.codes-panel summary { cursor: pointer; font-weight: 600; color: var(--coral-dark); list-style: none; }
.codes-panel summary::before { content: '+ '; }
details[open] summary::before { content: '− '; }
.code-input-row { display: flex; flex-direction: column; gap: 6px; margin-top: 14px; }
.code-field { display: flex; gap: 6px; align-items: center; }
.code-field label { font-size: 0.8rem; color: var(--text-muted); min-width: 110px; }
.code-field input {
  flex: 1; border: 1.5px solid var(--coral-light); border-radius: var(--radius-sm);
  padding: 7px 10px; font-size: 0.78rem; font-family: monospace; outline: none;
}
.code-field input:focus { border-color: var(--coral); }
.code-field input.error { border-color: var(--red-full); }
.code-field .error-msg { font-size: 0.7rem; color: var(--red-full); }
.status-bar { font-size: 0.82rem; color: var(--text-muted); margin-bottom: 16px; text-align: center; }
```

- [ ] **Step 2: Implement `js/results.js` with code input and decode**

```js
// js/results.js
import { decode } from './encode.js';
import { bestWindows } from './algorithm.js';

const NAMES = [
  'Navya Annam', 'Sachi Bansal', 'Alaka Gorur',
  'Riyana Patel', 'Shivangi Sharma', 'Natasha Shetty', 'Sirina Yeung'
];

const app = document.getElementById('results-app');
const codesMap = {}; // name -> decoded { unavailableDays, reasons }

function render() {
  const loaded = NAMES.filter(n => codesMap[n]);
  app.innerHTML = `
    <details class="codes-panel" ${loaded.length < 7 ? 'open' : ''}>
      <summary>Add / update codes</summary>
      <div class="code-input-row">
        ${NAMES.map(name => `
          <div class="code-field">
            <label>${name.split(' ')[0]}</label>
            <div style="flex:1">
              <input type="text" data-name="${name}" placeholder="Paste code..."
                value="${codesMap[name]?._raw || ''}"
                class="${codesMap[name]?._error ? 'error' : ''}">
              ${codesMap[name]?._error ? '<div class="error-msg">Invalid code — please check and re-paste</div>' : ''}
            </div>
          </div>`).join('')}
      </div>
    </details>
    <div class="status-bar">
      ${loaded.length === 7
        ? '✅ All 7 codes entered'
        : `Showing results for <strong>${loaded.length} of 7</strong> people — add more codes to refine`}
    </div>
    <div id="windows-section"></div>
    <div id="heatmap-section"></div>`;

  app.querySelectorAll('.code-field input').forEach(input => {
    input.addEventListener('change', () => {
      const name = input.dataset.name;
      const raw = input.value.trim();
      if (!raw) { delete codesMap[name]; render(); return; }
      const result = decode(raw);
      codesMap[name] = { ...result, _raw: raw, _error: result.unavailableDays.length === 0 && raw.length > 0 && raw.length !== 31 };
      render();
    });
  });

  renderWindows();
  renderHeatmap();
}

function renderWindows() { /* Task 8 */ }
function renderHeatmap() { /* Task 9 */ }

render();
export { codesMap, NAMES };
```

- [ ] **Step 3: Test manually**

Open `results.html`. Paste a valid code from index.html into one field. Status bar updates to "1 of 7". Paste an invalid string → red error label appears.

- [ ] **Step 4: Commit**

```bash
git add js/results.js css/style.css
git commit -m "feat: results page code input with decode and validation"
```

---

## Task 8: Results Page — Best Windows Section

**Files:**
- Modify: `js/results.js`
- Modify: `css/style.css`

- [ ] **Step 1: Add best-windows card styles to `css/style.css`**

```css
/* Best windows */
.windows-section { margin-bottom: 28px; }
.window-card {
  background: white;
  border-left: 4px solid var(--coral-light);
  border-radius: var(--radius-sm);
  padding: 12px 14px;
  margin-bottom: 8px;
  display: flex;
  justify-content: space-between;
  align-items: center;
}
.window-card.rank-1 { border-left-color: var(--coral); background: var(--cream-dark); }
.window-date { font-weight: 600; color: var(--text); font-size: 0.95rem; }
.window-meta { font-size: 0.78rem; color: var(--text-muted); margin-top: 2px; }
.window-badge { font-size: 0.75rem; font-weight: 700; color: var(--coral); }
.window-score { font-size: 0.85rem; font-weight: 600; color: var(--coral-dark); }
```

- [ ] **Step 2: Implement `renderWindows` in `js/results.js`**

Add a `dayToDate` helper:
```js
const START = new Date(2026, 4, 1); // May 1
function dayToDate(d) {
  const dt = new Date(START);
  dt.setDate(dt.getDate() + d);
  return dt.toLocaleDateString('en-US', { month: 'short', day: 'numeric' });
}
```

Replace `renderWindows`:
```js
function renderWindows() {
  const loaded = NAMES.filter(n => codesMap[n] && !codesMap[n]._error);
  const section = document.getElementById('windows-section');
  if (!loaded.length) {
    section.innerHTML = '<p style="color:var(--text-muted);text-align:center;padding:20px 0">Enter codes above to see the best trip windows.</p>';
    return;
  }
  const data = loaded.map(name => ({ name, unavailableDays: codesMap[name].unavailableDays }));
  const windows = bestWindows(data, 5, 6);

  section.innerHTML = `
    <div class="windows-section">
      <div class="section-label">🏆 Best Windows for Your Trip</div>
      ${windows.length === 0
        ? '<p style="color:var(--text-muted)">No 6+ day windows found where most people are free.</p>'
        : windows.map((w, i) => `
        <div class="window-card ${i === 0 ? 'rank-1' : ''}">
          <div>
            <div class="window-date">${dayToDate(w.startDay)} – ${dayToDate(w.endDay)}</div>
            <div class="window-meta">${w.length} days · ${w.peopleAvailable}/${w.totalPeople} people free</div>
          </div>
          <div class="window-badge">${i === 0 ? '★ Best' : `#${i + 1}`}</div>
        </div>`).join('')}
    </div>`;
}
```

- [ ] **Step 3: Test manually**

Generate codes for 2–3 people from index.html, paste into results.html. Best windows cards appear, ranked correctly. "★ Best" appears on rank 1.

- [ ] **Step 4: Commit**

```bash
git add js/results.js css/style.css
git commit -m "feat: best trip windows display on results page"
```

---

## Task 9: Results Page — Heat Map + Day Tooltip

**Files:**
- Modify: `js/results.js`
- Modify: `css/style.css`

- [ ] **Step 1: Add heat map styles to `css/style.css`**

```css
/* Heat map */
.heatmap-section { margin-bottom: 32px; }
.heatmap-month { background: white; border-radius: var(--radius); padding: 14px; margin-bottom: 16px; }
.heatmap-days { display: grid; grid-template-columns: repeat(7, 1fr); gap: 3px; }
.hm-cell {
  aspect-ratio: 1; border-radius: 3px; cursor: pointer;
  display: flex; align-items: center; justify-content: center;
  font-size: 0.65rem; font-weight: 500; color: rgba(0,0,0,0.5);
  position: relative;
}
.hm-cell.empty { background: transparent; cursor: default; }

/* Tooltip */
.hm-tooltip {
  position: fixed; background: white; border-radius: var(--radius-sm);
  box-shadow: 0 4px 16px rgba(0,0,0,0.15); padding: 12px 14px;
  z-index: 300; min-width: 180px; max-width: 260px;
  font-size: 0.8rem;
}
.hm-tooltip h5 { color: var(--coral-dark); margin-bottom: 8px; font-size: 0.82rem; }
.hm-tooltip-row { display: flex; align-items: center; gap: 6px; margin-bottom: 4px; }
.hm-tooltip-row .dot { width: 8px; height: 8px; border-radius: 50%; flex-shrink: 0; }
```

- [ ] **Step 2: Implement `renderHeatmap` in `js/results.js`**

```js
function heatColor(available, total) {
  if (total === 0) return '#e0e0e0';
  const ratio = available / total;
  if (ratio === 1) return '#43a047';
  if (ratio >= 0.85) return '#66bb6a';
  if (ratio >= 0.7) return '#a5d6a7';
  if (ratio >= 0.5) return '#ffb74d';
  if (ratio >= 0.3) return '#ff7043';
  return '#e53935';
}

function renderHeatmap() {
  const section = document.getElementById('heatmap-section');
  const loaded = NAMES.filter(n => codesMap[n] && !codesMap[n]._error);
  if (!loaded.length) { section.innerHTML = ''; return; }

  const MONTHS = [
    { name: 'May',       days: 31, dayOffset: 0,   startOffset: new Date(2026,4,1).getDay() },
    { name: 'June',      days: 30, dayOffset: 31,  startOffset: new Date(2026,5,1).getDay() },
    { name: 'July',      days: 31, dayOffset: 61,  startOffset: new Date(2026,6,1).getDay() },
    { name: 'August',    days: 31, dayOffset: 92,  startOffset: new Date(2026,7,1).getDay() },
    { name: 'September', days: 30, dayOffset: 123, startOffset: new Date(2026,8,1).getDay() },
    { name: 'October',   days: 31, dayOffset: 153, startOffset: new Date(2026,9,1).getDay() },
  ];
  const WEEKDAYS = ['Su','Mo','Tu','We','Th','Fr','Sa'];

  section.innerHTML = `
    <div class="heatmap-section">
      <div class="section-label">Group Calendar</div>
      ${MONTHS.map(m => {
        const cells = [];
        for (let i = 0; i < m.startOffset; i++) cells.push('<div class="hm-cell empty"></div>');
        for (let d = 0; d < m.days; d++) {
          const dayIdx = m.dayOffset + d;
          const availCount = loaded.filter(n => !codesMap[n].unavailableDays.includes(dayIdx)).length;
          const color = heatColor(availCount, loaded.length);
          cells.push(`<div class="hm-cell" data-day="${dayIdx}" style="background:${color}">${d+1}</div>`);
        }
        return `
          <div class="heatmap-month">
            <div class="month-label">${m.name} 2026</div>
            <div class="weekday-row">${WEEKDAYS.map(w=>`<span>${w}</span>`).join('')}</div>
            <div class="heatmap-days">${cells.join('')}</div>
          </div>`;
      }).join('')}
    </div>`;

  section.querySelectorAll('.hm-cell[data-day]').forEach(cell => {
    cell.addEventListener('click', (e) => {
      document.querySelector('.hm-tooltip')?.remove();
      const dayIdx = parseInt(cell.dataset.day, 10);
      const dt = new Date(2026, 4, 1);
      dt.setDate(dt.getDate() + dayIdx);
      const label = dt.toLocaleDateString('en-US', { month: 'short', day: 'numeric', weekday: 'short' });

      const rows = loaded.map(name => {
        const unavail = codesMap[name].unavailableDays.includes(dayIdx);
        const blocks = getBlocks(codesMap[name].unavailableDays);
        const blockIdx = blocks.findIndex(b => dayIdx >= b.start && dayIdx <= b.end);
        const reason = blockIdx !== -1 ? codesMap[name].reasons[blockIdx] : null;
        return `<div class="hm-tooltip-row">
          <div class="dot" style="background:${unavail ? '#e53935' : '#43a047'}"></div>
          <span>${name.split(' ')[0]} ${unavail ? '— unavailable' + (reason ? ` · <em>${reason}</em>` : '') : '— free'}</span>
        </div>`;
      }).join('');

      const tip = document.createElement('div');
      tip.className = 'hm-tooltip';
      tip.innerHTML = `<h5>${label}</h5>${rows}`;
      tip.style.left = Math.min(e.clientX + 10, window.innerWidth - 280) + 'px';
      tip.style.top = Math.min(e.clientY + 10, window.innerHeight - 200) + 'px';
      document.body.appendChild(tip);
      setTimeout(() => document.addEventListener('click', () => tip.remove(), { once: true }), 0);
    });
  });
}

// Helper needed by renderHeatmap tooltip
function getBlocks(days) {
  if (!days.length) return [];
  const sorted = [...days].sort((a,b)=>a-b);
  const blocks = [];
  let start = sorted[0], prev = sorted[0];
  for (let i = 1; i < sorted.length; i++) {
    if (sorted[i] === prev + 1) { prev = sorted[i]; }
    else { blocks.push({ start, end: prev }); start = prev = sorted[i]; }
  }
  blocks.push({ start, end: prev });
  return blocks;
}
```

- [ ] **Step 3: Test manually**

Paste 3–4 codes into results.html. Heat map renders May–Oct with color gradient. Click a green day → tooltip shows everyone free. Click a red day → tooltip shows who's unavailable with their reason if set.

- [ ] **Step 4: Commit**

```bash
git add js/results.js css/style.css
git commit -m "feat: heat map calendar with day tooltip on results page"
```

---

## Task 10: GitHub Pages + Final Polish

**Files:**
- Modify: `index.html`, `results.html` (meta tags, favicon)
- Create: `.github/workflows/pages.yml` (optional — only if manual push to `main` doesn't trigger Pages automatically)

- [ ] **Step 1: Add meta tags and mobile polish to both HTML files**

Add inside `<head>` of both pages:
```html
<meta name="description" content="Plan our summer trip — mark your unavailable dates and find when everyone is free.">
<meta name="theme-color" content="#ff7043">
<link rel="apple-touch-icon" href="https://fav.farm/🌴">
<link rel="icon" href="https://fav.farm/🌴">
```

- [ ] **Step 2: Enable GitHub Pages in repo settings**

1. Go to `https://github.com/sachi-bansal/summer-trip-planner-2026/settings/pages`
2. Under **Source**, select **Deploy from a branch**
3. Select branch: `main`, folder: `/ (root)`
4. Click Save
5. Wait ~60 seconds — site will be live at `https://sachi-bansal.github.io/summer-trip-planner-2026`

- [ ] **Step 3: Push all changes and verify live site**

```bash
git push origin main
```

Open `https://sachi-bansal.github.io/summer-trip-planner-2026` on your phone and on Mac. Verify:
- [ ] Name picker renders correctly
- [ ] Calendar tapping works on mobile (touch)
- [ ] Code generates and copies
- [ ] Results page loads codes and shows heat map

- [ ] **Step 4: Final commit**

```bash
git add .
git commit -m "chore: meta tags, favicon, GitHub Pages setup"
git push origin main
```

---

## Running Tests

```bash
# Encoding tests
node --experimental-vm-modules tests/encode.test.js

# Algorithm tests
node --experimental-vm-modules tests/algorithm.test.js
```

Expected output: all tests passing with `✓` marks.
