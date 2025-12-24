import { weekDates, addDays, slotIcon, foodEmoji, todayStr } from './util.js';

/** Main week grid: nav row + 7 rows of [lunch, dinner] + footer row */
export function weekKeyboard(family, anchor) {
  const dates = weekDates(anchor, family.weekStart);
  const today = todayStr();

  // Nav row
  const prevAnchor = addDays(anchor, -7);
  const nextAnchor = addDays(anchor, 7);
  const rows = [];
  rows.push([
    { text: '◀ Prev', callback_data: `nav:${prevAnchor}` },
    { text: 'Today', callback_data: `nav:${today}` },
    { text: 'Next ▶', callback_data: `nav:${nextAnchor}` },
  ]);

  // Per-day rows — each day: two buttons (lunch / dinner)
  for (const d of dates) {
    const isToday = d === today;
    // Short day label: e.g. "Mon 12"
    const dow = new Intl.DateTimeFormat('en', { weekday: 'short' }).format(new Date(d + 'T12:00:00'));
    const dayNum = String(new Date(d + 'T12:00:00').getDate());
    const dayLabel = `${dow} ${dayNum}${isToday ? ' ●' : ''}`;

    const row = [];
    for (const slot of ['lunch', 'dinner']) {
      const meal = (family.meals[d] || {})[slot];
      let label;
      if (!meal || !meal.items.length) {
        label = `${dayLabel} ${slotIcon(slot)} —`;
      } else if (meal.items.length === 1) {
        const it = meal.items[0];
        label = `${dayLabel} ${slotIcon(slot)} ${foodEmoji(it.name)} ${it.name}`.slice(0, 30);
      } else {
        label = `${dayLabel} ${slotIcon(slot)} ${meal.items.length} foods`.slice(0, 30);
      }
      row.push({ text: label, callback_data: `slot:${d}:${slot}` });
    }
    rows.push(row);
  }

  // Footer: quick actions
  rows.push([
    { text: '📖 Foods', callback_data: 'act:foods' },
    { text: '👤 Who am I', callback_data: 'act:whoami' },
    { text: '❓ Help', callback_data: 'act:help' },
  ]);

  return { inline_keyboard: rows };
}

/** Detail for a filled/empty slot */
export function slotKeyboard(family, date, slot, anchor) {
  const meal = (family.meals[date] || {})[slot];
  const rows = [];

  if (!meal || !meal.items.length) {
    rows.push([{ text: '➕ Add foods', callback_data: `add:${date}:${slot}` }]);
    rows.push([{ text: '◀ Back to week', callback_data: `nav:${anchor}` }]);
    return { inline_keyboard: rows };
  }

  // Per-food vote rows: one row per food with 3 vote buttons
  for (const it of meal.items) {
    const short = it.name.slice(0, 12);
    rows.push([
      { text: `${short} 😞`, callback_data: `v:${date}:${slot}:${it.id}:1` },
      { text: `${short} 😐`, callback_data: `v:${date}:${slot}:${it.id}:2` },
      { text: `${short} 😋`, callback_data: `v:${date}:${slot}:${it.id}:3` },
    ]);
  }

  rows.push([
    { text: '➕ Edit foods', callback_data: `add:${date}:${slot}` },
    { text: '🗑 Clear', callback_data: `clear:${date}:${slot}` },
  ]);
  rows.push([{ text: '◀ Back to week', callback_data: `nav:${anchor}` }]);
  return { inline_keyboard: rows };
}

/** Food multi-select picker for logging a meal */
export function foodPickerKeyboard(family, session) {
  const pageSize = 6;
  const foods = [...family.foods].sort((a, b) => b.uses - a.uses || a.name.localeCompare(b.name));
  const selected = new Set(session.selectedIds || []);
  const page = session.page || 0;
  const totalPages = Math.max(1, Math.ceil(foods.length / pageSize));
  const start = page * pageSize;
  const slice = foods.slice(start, start + pageSize);

  const rows = [];

  if (!foods.length) {
    rows.push([{ text: 'No foods yet — tap ➕ New food', callback_data: 'noop' }]);
  } else {
    for (const f of slice) {
      const on = selected.has(f.id);
      const mark = on ? '✅' : '☐';
      const label = `${mark} ${foodEmoji(f.name)} ${f.name}`.slice(0, 32);
      rows.push([{ text: label, callback_data: `pick:${f.id}` }]);
    }

    // Pagination if needed
    if (totalPages > 1) {
      const nav = [];
      if (page > 0) nav.push({ text: '‹ Prev', callback_data: `pick:page:${page - 1}` });
      nav.push({ text: `${page + 1}/${totalPages}`, callback_data: 'noop' });
      if (page < totalPages - 1) nav.push({ text: 'Next ›', callback_data: `pick:page:${page + 1}` });
      rows.push(nav);
    }
  }

  rows.push([{ text: '➕ New food', callback_data: 'pick:new' }]);

  const doneLabel = selected.size ? `✅ Done (${selected.size})` : '✅ Done';
  rows.push([
    { text: doneLabel, callback_data: 'pick:done' },
    { text: '✕ Cancel', callback_data: 'pick:cancel' },
  ]);

  return { inline_keyboard: rows };
}

export function whoamiKeyboard(family) {
  const rows = family.members.map((m) => [
    { text: `${m.emoji} ${m.name}`, callback_data: `who:${m.id}` },
  ]);
  rows.push([{ text: '➕ Add member (in app)', callback_data: 'noop' }]);
  return { inline_keyboard: rows };
}

export function foodsListKeyboard() {
  return {
    inline_keyboard: [
      [{ text: '📅 Week view', callback_data: `nav:${todayStr()}` }],
    ],
  };
}
