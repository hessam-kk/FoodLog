/**
 * Shared helpers — week math, formatting, scores.
 * Mirrors public/app.js but safe for Workers (no localStorage, no DOM).
 */

export function parseDate(s) {
  const [y, m, d] = s.split('-').map(Number);
  return new Date(y, m - 1, d);
}

export function toStr(d) {
  return `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, '0')}-${String(d.getDate()).padStart(2, '0')}`;
}

export function todayStr() {
  return toStr(new Date());
}

/** Current clock parts in the Tehran (Asia/Tehran, fixed UTC+3:30) time zone. */
export function tehranParts(now = new Date()) {
  const parts = new Intl.DateTimeFormat('en-GB', {
    timeZone: 'Asia/Tehran',
    year: 'numeric',
    month: '2-digit',
    day: '2-digit',
    hour: '2-digit',
    minute: '2-digit',
    hour12: false,
  }).formatToParts(now);
  const get = (type) => Number((parts.find((p) => p.type === type) || {}).value);
  return { year: get('year'), month: get('month'), day: get('day'), hour: get('hour'), minute: get('minute') };
}

/** Today's date string (YYYY-MM-DD) in Tehran time. */
export function tehranTodayStr(now = new Date()) {
  const { year, month, day } = tehranParts(now);
  return `${year}-${String(month).padStart(2, '0')}-${String(day).padStart(2, '0')}`;
}

export function addDays(s, n) {
  const d = parseDate(s);
  d.setDate(d.getDate() + n);
  return toStr(d);
}

/** Week dates for an anchor (any date inside the desired week). */
export function weekDates(anchor, weekStart) {
  const d = parseDate(anchor);
  const day = d.getDay(); // 0 Sun … 6 Sat
  const back = weekStart === 'sat' ? (day + 1) % 7 : (day + 6) % 7;
  const start = addDays(anchor, -back);
  return Array.from({ length: 7 }, (_, i) => addDays(start, i));
}

export function weekRangeLabel(anchor, weekStart, lang = 'fa') {
  const dates = weekDates(anchor, weekStart);
  const a = dates[0], b = dates[6];
  const loc = lang === 'fa' ? 'fa-IR' : 'en';
  const fmt = new Intl.DateTimeFormat(loc, { month: 'short', day: 'numeric' });
  return `${fmt.format(parseDate(a))} — ${fmt.format(parseDate(b))}`;
}

export function dayLabel(date, lang = 'fa') {
  const d = parseDate(date);
  const loc = lang === 'fa' ? 'fa-IR' : 'en';
  const dow = new Intl.DateTimeFormat(loc, { weekday: 'short' }).format(d);
  const day = new Intl.DateTimeFormat(loc, { day: 'numeric' }).format(d);
  return `${dow} ${day}`;
}

export function slotLabel(slot, lang = 'fa') {
  if (lang === 'fa') return slot === 'lunch' ? 'ناهار' : 'شام';
  return slot;
}

export function slotIcon(slot) {
  return slot === 'lunch' ? '☀️' : '🌙';
}

export function foodEmoji(name) {
  const n = String(name || '').toLowerCase();
  const map = [
    ['pizza', '🍕'], ['pasta', '🍝'], ['spaghetti', '🍝'], ['noodle', '🍜'], ['ramen', '🍜'],
    ['sushi', '🍣'], ['kebab', '🥙'], ['kabab', '🥙'], ['burger', '🍔'], ['chicken', '🍗'],
    ['steak', '🥩'], ['fish', '🐟'], ['soup', '🍲'], ['stew', '🥘'], ['curry', '🍛'],
    ['rice', '🍚'], ['polo', '🍚'], ['egg', '🍳'], ['omelette', '🍳'], ['salad', '🥗'],
    ['bread', '🍞'], ['cheese', '🧀'], ['potato', '🥔'], ['fries', '🍟'], ['fruit', '🍎'],
    ['پیتزا', '🍕'], ['پاستا', '🍝'], ['کباب', '🥙'], ['خورش', '🍲'], ['برنج', '🍚'],
    ['سالاد', '🥗'],
  ];
  for (const [kw, emoji] of map) if (n.includes(kw)) return emoji;
  return '🍽️';
}

export function avg(arr) {
  if (!arr || !arr.length) return null;
  return arr.reduce((a, b) => a + b, 0) / arr.length;
}

export function foodAvg(family, date, slot, foodId) {
  const vals = Object.values(((family.foodVotes || {})[date] || {})[slot] && family.foodVotes[date][slot][foodId] || {});
  return vals.length ? vals.reduce((a, b) => a + b, 0) / vals.length : null;
}

export function mealAvg(family, date, slot) {
  const meal = (family.meals[date] || {})[slot];
  if (!meal) return null;
  const avgs = meal.items.map((it) => foodAvg(family, date, slot, it.id)).filter((v) => v != null);
  return avgs.length ? avgs.reduce((a, b) => a + b, 0) / avgs.length : null;
}

export function fmt1(x) {
  if (x == null) return '—';
  return (Math.round(x * 10) / 10).toFixed(1);
}

// Scores are on a 0–10 scale; faces match the web slider vocabulary
// (🤮 0 · 😞 1–2 · 😟 3–4 · 😐 5–6 · 🙂 7–8 · 😋 9 · 🤩 10).
export function voteFace(avg) {
  if (avg == null) return '';
  if (avg >= 10) return '🤩';
  if (avg >= 8.5) return '😋';
  if (avg >= 6.5) return '🙂';
  if (avg >= 4.5) return '😐';
  if (avg >= 2.5) return '😟';
  if (avg >= 0.5) return '😞';
  return '🤮';
}

export function esc(s) {
  return String(s ?? '');
}

// Telegram MarkdownV2 or HTML escaping — we use HTML mode for messages.
export function htmlEsc(s) {
  return String(s ?? '').replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;');
}

export function shortName(s, n = 18) {
  const t = String(s || '').trim();
  return t.length > n ? t.slice(0, n - 1) + '…' : t;
}
