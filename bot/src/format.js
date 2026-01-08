import { weekDates, weekRangeLabel, dayLabel, slotIcon, foodEmoji, foodAvg, mealAvg, fmt1, voteFace, todayStr, htmlEsc, slotLabel } from './util.js';
import { t } from './i18n.js';

export function weekMessageText(family, anchor, lang = 'fa') {
  const range = weekRangeLabel(anchor, family.weekStart, lang);
  const dates = weekDates(anchor, family.weekStart);
  const today = todayStr();
  const isCurrent = dates.includes(today);

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

  const weekTitle = isCurrent ? t(lang, 'thisWeek') : t(lang, 'weekOf', { range: htmlEsc(range) });
  const weekSpan = family.weekStart === 'sat' ? t(lang, 'satFri') : t(lang, 'monSun');
  let txt = `📅 <b>${htmlEsc(family.name)} — ${weekTitle}</b>`;
  if (isCurrent) txt += lang === 'fa' ? '  <i>(این هفته)</i>' : '  <i>(this week)</i>';
  txt += `\n<code>${htmlEsc(family.id)}</code> · ${htmlEsc(weekSpan)} · 👥 ${family.members.length} ${t(lang, 'members')}`;
  txt += `\n${mealCount} ${t(lang, 'meals')} · ${votes ? `${fmt1(avg)} ${voteFace(avg)} ${t(lang, 'avg')} (${votes} ${t(lang, 'votes')})` : t(lang, 'noVotes')}`;
  txt += `\n\n<b>${t(lang, 'tapHint')}</b>`;

  const blocks = [];
  for (const d of dates) {
    const isToday = d === today;
    const day = dayLabel(d, lang);
    const prefix = isToday ? '▶ ' : '  ';
    const todayMark = isToday ? ` · ${t(lang, 'today')}` : '';
    const header = `${prefix}<b>${htmlEsc(day)}${todayMark}</b>`;
    const slotLines = [];
    for (const slot of ['lunch', 'dinner']) {
      const meal = (family.meals[d] || {})[slot];
      const label = slotLabel(slot, lang);
      let content;
      if (!meal || !meal.items.length) {
        content = t(lang, 'empty');
      } else {
        content = meal.items.map((it) => {
          const av = foodAvg(family, d, slot, it.id);
          const score = av != null ? ` ${fmt1(av)}${voteFace(av)}` : '';
          return `${foodEmoji(it.name)} ${htmlEsc(it.name)}${score}`;
        }).join(' + ');
      }
      slotLines.push(`  ${slotIcon(slot)} ${label}: ${content}`);
    }
    blocks.push(`${header}\n${slotLines.join('\n')}`);
  }
  txt += `\n\n${blocks.join('\n\n')}`;
  txt += `\n\n<i>${t(lang, 'useNav')}</i>`;
  return txt;
}

export function slotDetailText(family, date, slot, memberId, lang = 'fa') {
  const meal = (family.meals[date] || {})[slot];
  const day = dayLabel(date, lang);
  const icon = slotIcon(slot);
  const sLabel = slotLabel(slot, lang);
  let txt = `${icon} <b>${htmlEsc(day)} — ${sLabel}</b>  <code>${date}</code>\n`;

  if (!meal || !meal.items.length) {
    txt += `\n<i>${t(lang, 'noMeal')}</i>\n${t(lang, 'noMealHint')}`;
    return txt;
  }

  if (meal.by) {
    const m = family.members.find((x) => x.id === meal.by);
    if (m) txt += `\n${t(lang, 'loggedBy')} ${m.emoji} ${htmlEsc(m.name)}`;
  }

  txt += `\n\n<b>${t(lang, 'foodsInMeal')}</b>`;
  for (const it of meal.items) {
    const av = foodAvg(family, date, slot, it.id);
    const em = foodEmoji(it.name);
    const score = av != null ? ` — ${t(lang, 'avg')} ${fmt1(av)} ${voteFace(av)}` : ` — ${t(lang, 'notRated')}`;
    txt += `\n• ${em} <b>${htmlEsc(it.name)}</b>${score}`;

    const votes = ((family.foodVotes[date] || {})[slot] || {})[it.id] || {};
    if (Object.keys(votes).length) {
      const details = Object.entries(votes).map(([mid, val]) => {
        const mm = family.members.find((x) => x.id === mid);
        const face = voteFace(val);
        const who = mm ? `${mm.emoji} ${htmlEsc(mm.name)}` : htmlEsc(mid.slice(0, 6));
        const you = mid === memberId ? (lang === 'fa' ? ' <i>(شما)</i>' : ' <i>(you)</i>') : '';
        return `${who}: ${face}${you}`;
      }).join(', ');
      txt += `\n  <i>${details}</i>`;
    } else {
      txt += `\n  <i>${t(lang, 'noVotesYet')}</i>`;
    }
  }

  const mv = mealAvg(family, date, slot);
  if (mv != null) txt += `\n\n${t(lang, 'mealAvg')} <b>${fmt1(mv)} ${voteFace(mv)}</b>`;

  if (meal.items.length > 1) {
    txt += `\n\n<i>${t(lang, 'multiHint')}</i>`;
  }

  txt += `\n\n<i>${t(lang, 'changeHint')}</i>`;
  return txt;
}

export function foodPickerIntro(date, slot, family, lang = 'fa') {
  const day = dayLabel(date, lang);
  const sLabel = slotLabel(slot, lang);
  return t(lang, 'pickerTitle', { day: htmlEsc(day), slot: sLabel });
}

export function helpText(lang = 'fa') {
  return [
    t(lang, 'helpTitle'),
    ``,
    t(lang, 'helpWeek'),
    t(lang, 'helpStart'),
    t(lang, 'helpWhoami'),
    t(lang, 'helpFoods'),
    t(lang, 'helpHelp'),
    t(lang, 'helpLang'),
    ``,
    t(lang, 'howTitle'),
    t(lang, 'how1'),
    t(lang, 'how2'),
    t(lang, 'how3'),
    t(lang, 'how4'),
    t(lang, 'how5'),
  ].join('\n');
}
