/**
 * Scheduled reminders — nudge every linked chat about today's lunch/dinner.
 * Invoked from the Worker's `scheduled` handler (cron triggers in wrangler.jsonc).
 * Dates/slots follow the Tehran (Asia/Tehran, UTC+3:30) time zone.
 *
 * Behavior per chat:
 *   - Meal not logged yet            → ask to log it (➕ Log / ✅ Logged buttons).
 *   - Meal logged, member hasn't voted → ask that member to rate the foods.
 *   - Meal logged, member voted      → skip silently (that member is done).
 * Votes are per member: every family member rates the meal's foods individually.
 */

import { listChats } from './store.js';
import * as tg from './telegram.js';
import * as foodlog from './foodlog.js';
import { remindKeyboard, voteRemindKeyboard } from './keyboards.js';
import { t, getLangFromChat } from './i18n.js';
import { tehranTodayStr, slotLabel, foodEmoji, htmlEsc } from './util.js';

export async function sendMealReminder(env, slot) {
  const date = tehranTodayStr();
  const chats = await listChats(env);
  const linked = chats.filter(({ data }) => data && data.familyCode);

  // All chats of a family share the same meal state — load each family once.
  const families = new Map();
  for (const code of new Set(linked.map(({ data }) => data.familyCode))) {
    try {
      families.set(code, await foodlog.getFamily(env, code));
    } catch (e) {
      families.set(code, null);
      console.error(`reminder ${slot}: family ${code} could not be loaded:`, e && e.message ? e.message : e);
    }
  }

  let sent = 0;
  let voteSent = 0;
  let skipped = 0;
  for (const { chatId, data } of linked) {
    const family = families.get(data.familyCode);
    if (!family) continue;

    const lang = getLangFromChat(data);
    const label = slotLabel(slot, lang);
    const meal = (family.meals[date] || {})[slot];

    // Meal not logged yet — nudge to log it.
    if (!meal || !meal.items.length) {
      try {
        await tg.sendMessage(env, chatId, t(lang, 'remind', { slot: label }), {
          reply_markup: remindKeyboard(date, slot, lang),
        });
        sent++;
      } catch (e) {
        console.error(`reminder ${slot} → chat ${chatId} failed`, e && e.message ? e.message : e);
      }
      continue;
    }

    // Meal logged — nudge this member to rate unless they already voted.
    const memberId = data.memberId;
    const votes = ((family.foodVotes || {})[date] || {})[slot] || {};
    const voted = memberId != null && meal.items.some((it) => (votes[it.id] || {})[memberId] != null);
    if (voted) {
      skipped++; // this member already rated — no notification
      continue;
    }

    const foodsText = meal.items.map((it) => `${foodEmoji(it.name)} ${htmlEsc(it.name)}`).join(' + ');
    let txt = t(lang, 'remindVote', { slot: label, foods: foodsText });
    if (!memberId) txt += t(lang, 'remindVoteWho');
    try {
      await tg.sendMessage(env, chatId, txt, { reply_markup: voteRemindKeyboard(date, slot, meal.items) });
      voteSent++;
    } catch (e) {
      console.error(`vote reminder ${slot} → chat ${chatId} failed`, e && e.message ? e.message : e);
    }
  }
  return { ok: true, slot, date, sent, voteSent, skipped };
}
