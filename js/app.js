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

  function handleToggle(day, mode) {
    if (mode === 'mark' && !state.unavailableDays.includes(day)) {
      state.unavailableDays.push(day);
      state.unavailableDays.sort((a, b) => a - b);
    } else if (mode === 'unmark') {
      state.unavailableDays = state.unavailableDays.filter(d => d !== day);
    }
    renderCalendar(document.getElementById('cal-container'), state, handleToggle);
    // Note: reason popover added in Task 6
  }

  renderCalendar(document.getElementById('cal-container'), state, handleToggle);

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
