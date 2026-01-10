import { weekDates, addDays, slotIcon, foodEmoji, todayStr, voteFace, foodAvg, slotLabel } from './util.js';
import { t } from './i18n.js';

/** Main week grid: nav row + 7 rows of [day | lunch | dinner] + footer row — 3 columns */
export function weekKeyboard(family, anchor, lang = 'fa') {
  const dates = weekDates(anchor, family.weekStart);
  const today = todayStr();

  const prevAnchor = addDays(anchor, -7);
  const nextAnchor = addDays(anchor, 7);
  const rows = [];
  // nav: 3 columns as requested — prev | today | next, labels localized
  rows.push([
    { text: t(lang, 'prev'), callback_data: `nav:${prevAnchor}` },
    { text: t(lang, 'todayBtn'), callback_data: `nav:${today}` },
    { text: t(lang, 'next'), callback_data: `nav:${nextAnchor}` },
  ]);

  // Cell label: leading emoji is the food's average-score face when rated,
  // falling back to the food-category emoji when it has no votes yet.
  const cellText = (d, slot) => {
    const meal = (family.meals[d] || {})[slot];
    if (!meal || !meal.items.length) return `${slotIcon(slot)} ${t(lang, 'empty')}`;
    const parts = meal.items.slice(0, 2).map((it) => {
      const av = foodAvg(family, d, slot, it.id);
      return `${av != null ? voteFace(av) : foodEmoji(it.name)} ${it.name}`;
    });
    let body;
    if (meal.items.length === 1) {
      body = parts[0];
    } else {
      const joined = parts.join(' + ');
      body = joined.length > 26
        ? (lang === 'fa' ? `${meal.items.length} غذا` : `${meal.items.length} foods`)
        : joined;
    }
    return body.slice(0, 30);
  };

  // Per-day rows — 3 columns: [day] [lunch foods] [dinner foods]
  for (const d of dates) {
    const isToday = d === today;
    // day column — localized short weekday + day number
    const locale = lang === 'fa' ? 'fa-IR' : 'en';
    const dow = new Intl.DateTimeFormat(locale, { weekday: 'short' }).format(new Date(d + 'T12:00:00'));
    const dayNum = new Intl.DateTimeFormat(locale, { day: 'numeric' }).format(new Date(d + 'T12:00:00'));
    const dayText = `${dow} ${dayNum}${isToday ? ' ●' : ''}`.slice(0, 14);

    rows.push([
      { text: dayText, callback_data: 'noop' },
      { text: cellText(d, 'lunch'), callback_data: `slot:${d}:lunch` },
      { text: cellText(d, 'dinner'), callback_data: `slot:${d}:dinner` },
    ]);
  }

  // Footer: 3 columns as well
  rows.push([
    { text: t(lang, 'footerFoods'), callback_data: 'act:foods' },
    { text: t(lang, 'footerWho'), callback_data: 'act:whoami' },
    { text: t(lang, 'footerHelp'), callback_data: 'act:help' },
  ]);

  return { inline_keyboard: rows };
}

/** Detail for a filled/empty slot */
export function slotKeyboard(family, date, slot, anchor, lang = 'fa') {
  const meal = (family.meals[date] || {})[slot];
  const rows = [];

  if (!meal || !meal.items.length) {
    rows.push([{ text: t(lang, 'addFoods'), callback_data: `add:${date}:${slot}` }]);
    rows.push([{ text: t(lang, 'backToWeek'), callback_data: `nav:${anchor}` }]);
    return { inline_keyboard: rows };
  }

  // One row per food — tap to open the 0–10 rating grid for that food
  for (const it of meal.items) {
    rows.push([{ text: `${it.name.slice(0, 24)} 🗳`, callback_data: `vr:${date}:${slot}:${it.id}` }]);
  }

  rows.push([
    { text: t(lang, 'editFoods'), callback_data: `add:${date}:${slot}` },
    { text: t(lang, 'clear'), callback_data: `clear:${date}:${slot}` },
  ]);
  rows.push([{ text: t(lang, 'backToWeek'), callback_data: `nav:${anchor}` }]);
  return { inline_keyboard: rows };
}

/** 0–10 rating grid for a single food */
export function ratingGridKeyboard(date, slot, foodId) {
  const mk = (n) => ({ text: `${voteFace(n)} ${n}`, callback_data: `v:${date}:${slot}:${foodId}:${n}` });
  const row0to5 = [0, 1, 2, 3, 4, 5].map(mk);
  const row6to10 = [6, 7, 8, 9, 10].map(mk);
  return { inline_keyboard: [row0to5, row6to10] };
}

/** Food multi-select picker for logging a meal */
export function foodPickerKeyboard(family, session, lang = 'fa') {
  const pageSize = 6;
  const foods = [...family.foods].sort((a, b) => b.uses - a.uses || a.name.localeCompare(b.name));
  const selected = new Set(session.selectedIds || []);
  const page = session.page || 0;
  const totalPages = Math.max(1, Math.ceil(foods.length / pageSize));
  const start = page * pageSize;
  const slice = foods.slice(start, start + pageSize);

  const rows = [];

  if (!foods.length) {
    rows.push([{ text: t(lang, 'noFoodsPicker'), callback_data: 'noop' }]);
  } else {
    // Two columns per row for food list
    for (let i = 0; i < slice.length; i += 2) {
      const row = [];
      for (let j = 0; j < 2; j++) {
        const f = slice[i + j];
        if (!f) break;
        const on = selected.has(f.id);
        const mark = on ? '✅' : '☐';
        // shorter label for two-column layout
        const label = `${mark} ${foodEmoji(f.name)} ${f.name}`.slice(0, 18);
        row.push({ text: label, callback_data: `pick:${f.id}` });
      }
      rows.push(row);
    }

    if (totalPages > 1) {
      const nav = [];
      if (page > 0) nav.push({ text: t(lang, 'prevPage'), callback_data: `pick:page:${page - 1}` });
      nav.push({ text: `${page + 1}/${totalPages}`, callback_data: 'noop' });
      if (page < totalPages - 1) nav.push({ text: t(lang, 'nextPage'), callback_data: `pick:page:${page + 1}` });
      rows.push(nav);
    }
  }

  rows.push([{ text: t(lang, 'newFood'), callback_data: 'pick:new' }]);

  const doneLabel = selected.size ? t(lang, 'doneCount', { n: String(selected.size) }) : t(lang, 'done');
  rows.push([
    { text: doneLabel, callback_data: 'pick:done' },
    { text: t(lang, 'cancel'), callback_data: 'pick:cancel' },
  ]);

  return { inline_keyboard: rows };
}

export function whoamiKeyboard(family, lang = 'fa') {
  const rows = family.members.map((m) => [
    { text: `${m.emoji} ${m.name}`, callback_data: `who:${m.id}` },
  ]);
  rows.push([{ text: t(lang, 'addMemberApp'), callback_data: 'noop' }]);
  // language switch row
  rows.push([
    { text: 'فارسی', callback_data: 'lang:fa' },
    { text: 'English', callback_data: 'lang:en' },
  ]);
  return { inline_keyboard: rows };
}

export function foodsListKeyboard(lang = 'fa') {
  return {
    inline_keyboard: [
      [{ text: t(lang, 'weekBtn'), callback_data: `nav:${todayStr()}` }],
    ],
  };
}

export function langKeyboard() {
  return {
    inline_keyboard: [
      [
        { text: 'فارسی', callback_data: 'lang:fa' },
        { text: 'English', callback_data: 'lang:en' },
      ],
    ],
  };
}

/** Reminder card — nudge a chat to log today's lunch/dinner. */
export function remindKeyboard(date, slot, lang = 'fa') {
  const label = slotLabel(slot, lang);
  return {
    inline_keyboard: [
      [
        { text: t(lang, 'remindAdd', { slot: label }), callback_data: `add:${date}:${slot}` },
        { text: t(lang, 'remindDone'), callback_data: `remind:done:${slot}` },
      ],
    ],
  };
}
