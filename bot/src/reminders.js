/**
 * Scheduled reminders — nudge every linked chat to log today's lunch/dinner.
 * Invoked from the Worker's `scheduled` handler (cron triggers in wrangler.jsonc).
 * Dates/slots follow the Tehran (Asia/Tehran, UTC+3:30) time zone.
 *
 * The family API is checked first: chats whose meal for the slot is already
 * logged are skipped silently (one meal is shared per family), the rest get
 * a nudge with quick actions.
 */

import { listChats } from './store.js';
import * as tg from './telegram.js';
import * as foodlog from './foodlog.js';
import { remindKeyboard } from './keyboards.js';
import { t, getLangFromChat } from './i18n.js';
import { tehranTodayStr, slotLabel } from './util.js';

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
  let skipped = 0;
  for (const { chatId, data } of linked) {
    const family = families.get(data.familyCode);
    if (!family) continue;

    const meal = (family.meals[date] || {})[slot];
    if (meal && meal.items && meal.items.length) {
      skipped++; // already logged — don't nag
      continue;
    }

    const lang = getLangFromChat(data);
    const label = slotLabel(slot, lang);
    try {
      await tg.sendMessage(env, chatId, t(lang, 'remind', { slot: label }), {
        reply_markup: remindKeyboard(date, slot, lang),
      });
      sent++;
    } catch (e) {
      console.error(`reminder ${slot} → chat ${chatId} failed`, e && e.message ? e.message : e);
    }
  }
  return { ok: true, slot, date, sent, skipped };
}
