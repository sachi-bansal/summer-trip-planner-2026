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
