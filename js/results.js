// js/results.js
import { decode } from './encode.js';
import { bestWindows } from './algorithm.js';

const NAMES = [
  'Navya Annam', 'Sachi Bansal', 'Alaka Gorur',
  'Riyana Patel', 'Shivangi Sharma', 'Natasha Shetty', 'Sirina Yeung'
];

const app = document.getElementById('results-app');
const codesMap = {}; // name -> decoded { unavailableDays, reasons, _raw, _error }

function escapeHtml(str) {
  return str.replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;')
            .replace(/"/g, '&quot;').replace(/'/g, '&#39;');
}

const START = new Date(2026, 4, 1); // May 1
function dayToDate(d) {
  const dt = new Date(START);
  dt.setDate(dt.getDate() + d);
  return dt.toLocaleDateString('en-US', { month: 'short', day: 'numeric' });
}

function render() {
  const loaded = NAMES.filter(n => codesMap[n] && !codesMap[n]._error);
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
          <span>${name.split(' ')[0]} ${unavail ? '— unavailable' + (reason ? ` · <em>${escapeHtml(reason)}</em>` : '') : '— free'}</span>
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

render();
export { codesMap, NAMES };
