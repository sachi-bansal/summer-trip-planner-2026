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

let activeAbort = null; // module-level so it survives container replacement

export function renderCalendar(container, state, onDayToggle, onGestureEnd) {
  if (activeAbort) activeAbort.abort();
  const ctrl = new AbortController();
  activeAbort = ctrl;

  container.innerHTML = `
    <div class="calendar">
      ${MONTHS.map(m => renderMonth(m, state)).join('')}
    </div>`;
  attachDragHandlers(container, state, onDayToggle, onGestureEnd, ctrl.signal);
}

export function teardownCalendar() {
  if (activeAbort) { activeAbort.abort(); activeAbort = null; }
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

function attachDragHandlers(container, state, onDayToggle, onGestureEnd, signal) {
  let dragging = false;
  let markMode = null;
  let lastDay = null;

  function dayFromTarget(el) {
    const cell = el.closest('.day-cell:not(.empty)');
    return cell ? parseInt(cell.dataset.day, 10) : null;
  }

  function resetDrag() {
    if (dragging && lastDay !== null && onGestureEnd) {
      onGestureEnd(lastDay, markMode);
    }
    dragging = false;
    markMode = null;
    lastDay = null;
  }

  container.addEventListener('pointerdown', e => {
    const day = dayFromTarget(e.target);
    if (day == null) return;
    e.preventDefault(); // prevent touch scroll while selecting
    dragging = true;
    lastDay = day;
    markMode = state.unavailableDays.includes(day) ? 'unmark' : 'mark';
    onDayToggle(day, markMode);
    // Do NOT setPointerCapture — the day cell is destroyed on re-render,
    // which would fire pointercancel and kill the drag immediately.
  });

  // Listen on document so drag works even after the calendar re-renders
  document.addEventListener('pointermove', e => {
    if (!dragging) return;
    const el = document.elementFromPoint(e.clientX, e.clientY);
    if (!el) return;
    const day = dayFromTarget(el);
    if (day != null && day !== lastDay) { lastDay = day; onDayToggle(day, markMode); }
  }, { signal });

  document.addEventListener('pointerup', resetDrag, { signal });
  document.addEventListener('pointercancel', resetDrag, { signal });
}
