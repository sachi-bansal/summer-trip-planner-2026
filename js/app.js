// js/app.js
import { encode, decode } from './encode.js';
import { renderCalendar, teardownCalendar } from './calendar.js';

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
      ${NAMES.map(n => {
        const isCurrent = n === state.name && state.unavailableDays.length > 0;
        return `<button class="name-btn${isCurrent ? ' has-dates' : ''}" data-name="${n}">
          <span>${n}</span>
          ${isCurrent ? '<span class="name-edit-tag">tap to edit</span>' : ''}
        </button>`;
      }).join('')}
    </div>
    <div class="edit-code-section">
      <div class="edit-code-label">Need to edit your dates?</div>
      <p class="edit-code-hint">Paste your previous code below — your calendar will reload with your old selections so you can adjust and regenerate.</p>
      <select id="edit-name-select">
        <option value="">Select your name...</option>
        ${NAMES.map(n => `<option value="${n}">${n}</option>`).join('')}
      </select>
      <div class="edit-code-row">
        <input type="text" id="edit-code-input" placeholder="Paste your code here..." spellcheck="false" autocomplete="off">
        <button id="edit-load-btn">Load</button>
      </div>
      <div id="edit-code-error" class="edit-code-error"></div>
    </div>`;

  app.querySelectorAll('.name-btn').forEach(btn => {
    btn.addEventListener('click', () => {
      const clicked = btn.dataset.name;
      if (clicked !== state.name) {
        state.unavailableDays = [];
        state.reasons = {};
      }
      state.name = clicked;
      renderStep2();
    });
  });

  document.getElementById('edit-load-btn').addEventListener('click', () => {
    const errEl = document.getElementById('edit-code-error');
    const name = document.getElementById('edit-name-select').value;
    const raw = document.getElementById('edit-code-input').value.trim();
    errEl.textContent = '';

    if (!name) { errEl.textContent = 'Please select your name.'; return; }
    if (!raw)  { errEl.textContent = 'Please paste your code.'; return; }

    const bitfieldPart = raw.split('_')[0];
    if (bitfieldPart.length !== 31 || /[^0-9A-Za-z]/.test(bitfieldPart)) {
      errEl.textContent = 'Invalid code — please check and re-paste.';
      return;
    }

    const result = decode(raw);
    state.name = name;
    state.unavailableDays = result.unavailableDays;
    state.reasons = result.reasons;
    renderStep2();
  });
}

function getBlocks(days) {
  if (!days.length) return [];
  const sorted = [...days].sort((a, b) => a - b);
  const blocks = [];
  let start = sorted[0], prev = sorted[0];
  for (let i = 1; i < sorted.length; i++) {
    if (sorted[i] === prev + 1) { prev = sorted[i]; }
    else { blocks.push({ start, end: prev }); start = prev = sorted[i]; }
  }
  blocks.push({ start, end: prev });
  return blocks;
}

function closePopover() {
  document.querySelector('.reason-popover')?.remove();
  document.querySelector('.reason-backdrop')?.remove();
}

function showReasonPopover(blockIndex, existingReason, onSave) {
  // Close any popover already open (prevents stacking on rapid taps)
  closePopover();

  const SUGGESTIONS = ['Wedding', 'Conference', 'Travel', 'Work', 'Other'];
  let current = existingReason || '';

  const el = document.createElement('div');
  el.className = 'reason-popover';
  el.innerHTML = `
    <h4>Reason? <span style="font-weight:400;color:var(--text-muted)">(optional)</span></h4>
    <div class="reason-chips">
      ${SUGGESTIONS.map(s => `<div class="chip${current === s ? ' selected' : ''}" data-val="${s}">${s}</div>`).join('')}
    </div>
    <input class="reason-input" maxlength="20" placeholder="Or type your own...">
    <div class="popover-actions">
      <button class="popover-dismiss">Skip</button>
      <button class="popover-save">Save</button>
    </div>`;

  const backdrop = document.createElement('div');
  backdrop.className = 'reason-backdrop';
  document.body.appendChild(backdrop);
  document.body.appendChild(el);

  function dismiss() { el.remove(); backdrop.remove(); }
  backdrop.addEventListener('click', () => { onSave(''); dismiss(); });

  el.style.left = '50%';
  el.style.top = '50%';
  el.style.transform = 'translate(-50%, -50%)';

  const input = el.querySelector('.reason-input');
  input.value = current;
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
    dismiss();
  });
  el.querySelector('.popover-dismiss').addEventListener('click', () => {
    onSave('');
    dismiss();
  });
}

function renderStep2() {
  closePopover();
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

  document.getElementById('back-btn').addEventListener('click', () => {
    closePopover();
    teardownCalendar();
    renderStep1();
  });

  function handleGestureEnd(lastDay, gestureMode) {
    if (gestureMode !== 'mark') return;
    if (!state.unavailableDays.length) return;
    const blocks = getBlocks(state.unavailableDays);
    const block = blocks.find(b => lastDay >= b.start && lastDay <= b.end);
    if (!block) return;
    const existingReason = state.reasons[block.start] || '';
    showReasonPopover(block.start, existingReason, (reason) => {
      if (reason) state.reasons[block.start] = reason;
      else delete state.reasons[block.start];
    });
  }

  function handleToggle(day, mode) {
    if (mode === 'mark' && !state.unavailableDays.includes(day)) {
      state.unavailableDays.push(day);
      state.unavailableDays.sort((a, b) => a - b);
    } else if (mode === 'unmark') {
      state.unavailableDays = state.unavailableDays.filter(d => d !== day);
    }
    // Update only the toggled cell — no full re-render, so drag state survives
    const cell = document.querySelector(`#cal-container [data-day="${day}"]`);
    if (cell) cell.classList.toggle('unavailable', mode === 'mark');
  }

  renderCalendar(document.getElementById('cal-container'), state, handleToggle, handleGestureEnd);

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

renderStep1();
export { state, renderStep1 };
