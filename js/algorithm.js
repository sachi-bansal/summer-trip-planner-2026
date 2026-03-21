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
