// js/encode.js
const BASE62 = '0123456789ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz';
const TOTAL_DAYS = 184; // May 1 – Oct 31, 2026
const BITFIELD_CHARS = 31; // ceil(184 * log2(2) / log2(62))

function bitsToBase62(bits) {
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

function computeBlocks(days) {
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

export function encode(unavailableDays, reasons) {
  // unavailableDays: sorted number[] of day indices (0–183)
  // reasons: { blockStartDay: 'text', ... } — keyed by the block's first day
  const bits = new Array(TOTAL_DAYS).fill(0);
  for (const d of unavailableDays) bits[d] = 1;
  const bitfield = bitsToBase62(bits);

  const blocks = computeBlocks(unavailableDays);
  const reasonEntries = [];
  blocks.forEach((block, idx) => {
    const r = reasons[block.start];
    if (r && r.trim()) {
      reasonEntries.push(`${idx}:${r.slice(0, 20).replace(/[_|]/g, '')}`);
    }
  });

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
