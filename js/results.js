// js/results.js
import { decode } from './encode.js';
import { bestWindows } from './algorithm.js';

const NAMES = [
  'Navya Annam', 'Sachi Bansal', 'Alaka Gorur',
  'Riyana Patel', 'Shivangi Sharma', 'Natasha Shetty', 'Sirina Yeung'
];

const app = document.getElementById('results-app');
const codesMap = {}; // name -> decoded { unavailableDays, reasons, _raw, _error }

const START = new Date(2026, 4, 1); // May 1
function dayToDate(d) {
  const dt = new Date(START);
  dt.setDate(dt.getDate() + d);
  return dt.toLocaleDateString('en-US', { month: 'short', day: 'numeric' });
}

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
      const bitfieldPart = raw.split('_')[0];
      const _error = bitfieldPart.length !== 31 || /[^0-9A-Za-z]/.test(bitfieldPart);
      codesMap[name] = { ...result, _raw: raw, _error };
      render();
    });
  });

  renderWindows();
  renderHeatmap();
}

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

function renderHeatmap() { /* Task 9 */ }

render();
export { codesMap, NAMES };
