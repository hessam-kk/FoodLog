import { weekDates, weekRangeLabel, dayLabel, slotIcon, foodEmoji, foodAvg, mealAvg, fmt1, voteFace, todayStr, htmlEsc } from './util.js';

export function weekMessageText(family, anchor) {
  const range = weekRangeLabel(anchor, family.weekStart);
  const dates = weekDates(anchor, family.weekStart);
  const today = todayStr();
  const isCurrent = dates.includes(today);

  // Count meals + votes in this week for header stat
  let mealCount = 0;
  let sum = 0, votes = 0;
  for (const d of dates) {
    for (const slot of ['lunch', 'dinner']) {
      const meal = (family.meals[d] || {})[slot];
      if (meal) {
        mealCount++;
        for (const it of meal.items || []) {
          const vals = Object.values(((family.foodVotes[d] || {})[slot] || {})[it.id] || {});
          sum += vals.reduce((a, b) => a + b, 0);
          votes += vals.length;
        }
      }
    }
  }
  const avg = votes ? (sum / votes) : null;

  let txt = `📅 <b>${htmlEsc(family.name)} — Week of ${htmlEsc(range)}</b>`;
  if (isCurrent) txt += `  <i>(this week)</i>`;
  txt += `\n<code>${htmlEsc(family.id)}</code> · ${htmlEsc(family.weekStart === 'sat' ? 'Sat–Fri' : 'Mon–Sun')} · 👥 ${family.members.length} members`;
  txt += `\n${mealCount} meals · ${votes ? `${fmt1(avg)} ${voteFace(avg)} avg (${votes} votes)` : 'no votes yet'}`;
  txt += `\n\n<b>Tap a slot below</b> to log or rate. Empty slots show “—”.`;

  // Detail lines — compact but readable. Each day on its own line.
  const lines = [];
  for (const d of dates) {
    const isToday = d === today;
    const day = dayLabel(d);
    const prefix = isToday ? '▶ ' : '  ';
    const parts = [];
    for (const slot of ['lunch', 'dinner']) {
      const meal = (family.meals[d] || {})[slot];
      if (!meal || !meal.items.length) {
        parts.push(`${slotIcon(slot)} —`);
      } else {
        const chips = meal.items.map((it) => {
          const av = foodAvg(family, d, slot, it.id);
          const score = av != null ? ` ${fmt1(av)}${voteFace(av)}` : '';
          return `${foodEmoji(it.name)} ${htmlEsc(it.name)}${score}`;
        }).join(' + ');
        parts.push(`${slotIcon(slot)} ${chips}`);
      }
    }
    lines.push(`${prefix}<b>${htmlEsc(day)}${isToday ? ' · Today' : ''}</b> — ${parts.join('  |  ')}`);
  }
  txt += `\n\n${lines.join('\n')}`;

  txt += `\n\n<i>Use ◀ Prev / Next ▶ to change week. Tap any slot button below.</i>`;
  return txt;
}

export function slotDetailText(family, date, slot, memberId) {
  const meal = (family.meals[date] || {})[slot];
  const day = dayLabel(date);
  const icon = slotIcon(slot);
  let txt = `${icon} <b>${htmlEsc(day)} — ${slot}</b>  <code>${date}</code>\n`;

  if (!meal || !meal.items.length) {
    txt += `\n<i>No meal logged yet.</i>\nTap <b>➕ Add foods</b> to log this meal.`;
    return txt;
  }

  // Who logged
  if (meal.by) {
    const m = family.members.find((x) => x.id === meal.by);
    if (m) txt += `\nLogged by ${m.emoji} ${htmlEsc(m.name)}`;
  }

  txt += `\n\n<b>Foods in this meal:</b>`;
  for (const it of meal.items) {
    const av = foodAvg(family, date, slot, it.id);
    const em = foodEmoji(it.name);
    const score = av != null ? ` — avg ${fmt1(av)} ${voteFace(av)}` : ' — not rated yet';
    txt += `\n• ${em} <b>${htmlEsc(it.name)}</b>${score}`;

    const votes = ((family.foodVotes[date] || {})[slot] || {})[it.id] || {};
    if (Object.keys(votes).length) {
      const details = Object.entries(votes).map(([mid, val]) => {
        const mm = family.members.find((x) => x.id === mid);
        const face = val === 1 ? '😞' : val === 2 ? '😐' : '😋';
        const who = mm ? `${mm.emoji} ${htmlEsc(mm.name)}` : htmlEsc(mid.slice(0, 6));
        const you = mid === memberId ? ' <i>(you)</i>' : '';
        return `${who}: ${face}${you}`;
      }).join(', ');
      txt += `\n  <i>${details}</i>`;
    } else {
      txt += `\n  <i>no votes yet</i>`;
    }
  }

  const mv = mealAvg(family, date, slot);
  if (mv != null) txt += `\n\nMeal average: <b>${fmt1(mv)} ${voteFace(mv)}</b>`;

  if (meal.items.length > 1) {
    txt += `\n\n<i>Each food is rated separately — tap a rating below for that food.</i>`;
  }

  txt += `\n\n<i>Want to change the foods? Tap ➕ Edit foods. To remove the whole meal tap 🗑 Clear.</i>`;
  return txt;
}

export function foodPickerIntro(date, slot, family) {
  const day = dayLabel(date);
  return `✏️ <b>${htmlEsc(day)} — ${slot}</b>\nPick foods for this meal. Tap to toggle ✅. Use ➕ New food to add one not listed.\nWhen ready tap <b>✅ Done</b>.`;
}

export function helpText() {
  return [
    `🍲 <b>FoodLog Bot — commands</b>`,
    ``,
    `/week — show the main week message (tap any slot to log/rate)`,
    `/start &lt;CODE&gt; — link this chat to a family (6-char code)`,
    `/whoami — pick which family member you are (for votes)`,
    `/foods — list food memory &amp; add a new food`,
    `/help — this message`,
    ``,
    `<b>How it works</b>`,
    `• The main week message has a button for every lunch/dinner.`,
    `• Tap an <i>empty</i> slot → pick foods to log that meal.`,
    `• Tap a <i>filled</i> slot → see foods &amp; rate each one (😞😐😋).`,
    `• Use ◀ Prev / Next ▶ to browse weeks.`,
    `• Ratings need a member — set it with /whoami.`,
  ].join('\n');
}
