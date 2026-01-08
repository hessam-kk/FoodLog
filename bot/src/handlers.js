import { getChat, putChat, updateChat, getSession, putSession, clearSession } from './store.js';
import * as foodlog from './foodlog.js';
import * as tg from './telegram.js';
import { weekKeyboard, slotKeyboard, foodPickerKeyboard, whoamiKeyboard, foodsListKeyboard, langKeyboard, ratingGridKeyboard } from './keyboards.js';
import { weekMessageText, slotDetailText, foodPickerIntro, helpText } from './format.js';
import { todayStr, htmlEsc, dayLabel, slotLabel, slotIcon, foodEmoji, foodAvg, voteFace } from './util.js';
import { t, getLangFromChat, normalizeLang } from './i18n.js';

// ---------- helpers ----------

async function ensureFamily(env, chatId) {
  const chat = await getChat(env, chatId);
  if (!chat || !chat.familyCode) return null;
  try {
    const family = await foodlog.getFamily(env, chat.familyCode);
    return { chat, family };
  } catch (e) {
    return { chat, family: null, error: e.message };
  }
}

function langOf(chat) {
  return getLangFromChat(chat);
}

async function showWeek(env, chatId, anchorOverride) {
  const chat = await getChat(env, chatId);
  const lang = langOf(chat);
  if (!chat || !chat.familyCode) {
    await tg.sendMessage(env, chatId, t(lang, 'needCode'), { reply_markup: undefined });
    await putSession(env, chatId, { step: 'await_code' });
    return;
  }
  let family;
  try {
    family = await foodlog.getFamily(env, chat.familyCode);
  } catch (e) {
    await tg.sendMessage(env, chatId, t(lang, 'familyLoadFail', { code: htmlEsc(chat.familyCode), err: htmlEsc(e.message) }));
    return;
  }
  const anchor = anchorOverride || chat.weekAnchor || todayStr();
  await updateChat(env, chatId, { weekAnchor: anchor });
  const text = weekMessageText(family, anchor, lang);
  const kb = weekKeyboard(family, anchor, lang);
  await tg.sendMessage(env, chatId, text, { reply_markup: kb });
}

async function showWhoami(env, chatId) {
  const res = await ensureFamily(env, chatId);
  if (!res || !res.family) {
    await showWeek(env, chatId);
    return;
  }
  const { family, chat } = res;
  const lang = langOf(chat);
  const current = chat.memberId ? family.members.find((m) => m.id === chat.memberId) : null;
  let txt = t(lang, 'whoPick') + '\n';
  if (current) txt += t(lang, 'whoCurrent', { who: `${current.emoji} ${current.name}` }) + '\n';
  else txt += t(lang, 'whoNeed') + '\n';
  txt += `\n${t(lang, 'whoMembers', { family: htmlEsc(family.name) })}`;
  const kb = whoamiKeyboard(family, lang);
  await tg.sendMessage(env, chatId, txt, { reply_markup: kb });
}

async function showFoods(env, chatId) {
  const res = await ensureFamily(env, chatId);
  if (!res || !res.family) {
    await showWeek(env, chatId);
    return;
  }
  const { family, chat } = res;
  const lang = langOf(chat);
  if (!family.foods.length) {
    await tg.sendMessage(env, chatId, t(lang, 'foodsTitleEmpty'), { reply_markup: foodsListKeyboard(lang) });
    await putSession(env, chatId, { step: 'await_food_text' });
    return;
  }
  const top = [...family.foods].sort((a, b) => b.uses - a.uses).slice(0, 25);
  let txt = t(lang, 'foodsTitle', { n: String(family.foods.length) }) + '\n';
  txt += top.map((f) => `• ${htmlEsc(f.name)} — ${f.uses}×`).join('\n');
  if (family.foods.length > 25) txt += `\n${t(lang, 'foodsMore', { n: String(family.foods.length - 25) })}`;
  txt += t(lang, 'foodsHint');
  await tg.sendMessage(env, chatId, txt, { reply_markup: foodsListKeyboard(lang) });
  await putSession(env, chatId, { step: 'await_food_text' });
}

async function showLangPicker(env, chatId) {
  const chat = await getChat(env, chatId);
  const lang = langOf(chat);
  const cur = lang === 'fa' ? t(lang, 'currentLangFa') : t(lang, 'currentLangEn');
  await tg.sendMessage(env, chatId, `${t(lang, 'langPick')} (${cur})`, { reply_markup: langKeyboard() });
}

// ---------- message handler ----------

export async function handleMessage(env, msg) {
  const chatId = msg.chat.id;
  const textRaw = (msg.text || '').trim();
  const text = textRaw;
  let session = await getSession(env, chatId);
  let chatForLang = await getChat(env, chatId);
  const lang = langOf(chatForLang);

  // language switch via text? handle /lang first before sessions so it can cancel
  if (text.startsWith('/lang') || text.startsWith('/language') || text.startsWith('/زبان')) {
    const parts = text.split(/\s+/);
    const arg = normalizeLang(parts[1] || '');
    if (arg === 'fa' || arg === 'en') {
      await updateChat(env, chatId, { lang: arg });
      await tg.sendMessage(env, chatId, arg === 'fa' ? t('fa', 'langSwitchedFa') : t('en', 'langSwitchedEn'));
      await clearSession(env, chatId);
      // refresh week in new lang if linked
      const c = await getChat(env, chatId);
      if (c && c.familyCode) await showWeek(env, chatId);
      return;
    }
    await clearSession(env, chatId);
    await showLangPicker(env, chatId);
    return;
  }

  // Session: awaiting family code
  if (session && session.step === 'await_code') {
    const code = text.toUpperCase().replace(/\s+/g, '');
    if (!/^[A-Z0-9]{6}$/.test(code)) {
      await tg.sendMessage(env, chatId, t(lang, 'badCode'));
      return;
    }
    try {
      const family = await foodlog.getFamily(env, code);
      await putChat(env, chatId, { familyCode: family.id, memberId: null, memberName: null, weekAnchor: todayStr(), lang: lang });
      await clearSession(env, chatId);
      await tg.sendMessage(env, chatId, t(lang, 'linkedInfo', { name: htmlEsc(family.name), id: family.id, members: String(family.members.length), foods: String(family.foods.length) }));
      await showWhoami(env, chatId);
      await showWeek(env, chatId, todayStr());
    } catch (e) {
      await tg.sendMessage(env, chatId, `⚠️ ${htmlEsc(e.message)}`);
    }
    return;
  }

  // Session: awaiting new food name during meal picker
  if (session && session.step === 'await_new_food_picker') {
    const name = text.trim();
    if (!name || name.startsWith('/')) {
      await tg.sendMessage(env, chatId, t(lang, 'sendFoodName'));
      return;
    }
    const res = await ensureFamily(env, chatId);
    if (!res || !res.family) { await clearSession(env, chatId); return; }
    const curLang = langOf(res.chat);
    try {
      const updated = await foodlog.addFood(env, res.chat.familyCode, name);
      const created = updated.foods.find((f) => f.name.toLowerCase() === name.toLowerCase()) || updated.foods[0];
      const newSelected = [...(session.selectedIds || [])];
      if (created && !newSelected.includes(created.id)) {
        if (newSelected.length >= 8) {
          await tg.sendMessage(env, chatId, t(curLang, 'addedButFull', { name: htmlEsc(name) }));
        } else {
          newSelected.push(created.id);
        }
      }
      const nextSession = { step: 'pick_foods', date: session.date, slot: session.slot, selectedIds: newSelected, page: session.page || 0, anchor: session.anchor };
      await putSession(env, chatId, nextSession);
      await tg.sendMessage(env, chatId, t(curLang, 'addedMemory', { name: htmlEsc(name) }));
      const fam2 = updated;
      const intro = foodPickerIntro(session.date, session.slot, fam2, curLang);
      const kb = foodPickerKeyboard(fam2, nextSession, curLang);
      await tg.sendMessage(env, chatId, intro, { reply_markup: kb });
    } catch (e) {
      await tg.sendMessage(env, chatId, `⚠️ ${htmlEsc(e.message)}`);
    }
    return;
  }

  // Session: awaiting food name via /foods list
  if (session && session.step === 'await_food_text') {
    if (text.toLowerCase() === 'cancel' || text === '✕ Cancel' || text.startsWith('/')) {
      await clearSession(env, chatId);
      // fall through
    } else {
      const name = text.trim();
      if (!name) {
        await tg.sendMessage(env, chatId, t(lang, 'sendFoodName'));
        return;
      }
      const res = await ensureFamily(env, chatId);
      if (!res || !res.family) { await clearSession(env, chatId); return; }
      const curLang = langOf(res.chat);
      try {
        await foodlog.addFood(env, res.chat.familyCode, name);
        await tg.sendMessage(env, chatId, t(curLang, 'addedMemory', { name: htmlEsc(name) }) + ' 📖');
        await tg.sendMessage(env, chatId, t(curLang, 'sendAnother'));
      } catch (e) {
        await tg.sendMessage(env, chatId, `⚠️ ${htmlEsc(e.message)}`);
      }
      return;
    }
  }

  // ----- commands -----
  if (text.startsWith('/start')) {
    const parts = text.split(/\s+/);
    const arg = (parts[1] || '').toUpperCase().trim();
    if (arg) {
      if (!/^[A-Z0-9]{6}$/.test(arg)) {
        await tg.sendMessage(env, chatId, t(lang, 'badCodeArg'));
        return;
      }
      try {
        const family = await foodlog.getFamily(env, arg);
        const existing = await getChat(env, chatId);
        await putChat(env, chatId, { familyCode: family.id, memberId: null, memberName: null, weekAnchor: todayStr(), lang: langOf(existing) });
        await clearSession(env, chatId);
        await tg.sendMessage(env, chatId, t(lang, 'linked', { name: htmlEsc(family.name), id: family.id }));
        await showWhoami(env, chatId);
        await showWeek(env, chatId, todayStr());
      } catch (e) {
        await tg.sendMessage(env, chatId, `⚠️ ${htmlEsc(e.message)}`);
      }
    } else {
      const chat = await getChat(env, chatId);
      const curLang = langOf(chat);
      if (chat && chat.familyCode) {
        await tg.sendMessage(env, chatId, `Linked to <code>${htmlEsc(chat.familyCode)}</code>. Use <code>/start CODE</code> to switch.`);
        await showWeek(env, chatId);
      } else {
        await tg.sendMessage(env, chatId, t(curLang, 'needCode'));
        await putSession(env, chatId, { step: 'await_code' });
      }
    }
    return;
  }

  if (text.startsWith('/week') || text.startsWith('/meals') || text.startsWith('/هفته')) {
    await clearSession(env, chatId);
    await showWeek(env, chatId);
    return;
  }

  if (text.startsWith('/help') || text.startsWith('/راهنما')) {
    await tg.sendMessage(env, chatId, helpText(lang));
    return;
  }

  if (text.startsWith('/whoami') || text.startsWith('/who')) {
    await showWhoami(env, chatId);
    return;
  }

  if (text.startsWith('/foods') || text.startsWith('/food') || text.startsWith('/غذا')) {
    await showFoods(env, chatId);
    return;
  }

  // Bare 6-char code without /start
  if (/^[A-Za-z0-9]{6}$/.test(text.trim())) {
    const code = text.trim().toUpperCase();
    try {
      const family = await foodlog.getFamily(env, code);
      const existing = await getChat(env, chatId);
      await putChat(env, chatId, { familyCode: family.id, memberId: null, memberName: null, weekAnchor: todayStr(), lang: langOf(existing) });
      await clearSession(env, chatId);
      await tg.sendMessage(env, chatId, t(lang, 'linked', { name: htmlEsc(family.name), id: family.id }));
      await showWhoami(env, chatId);
      await showWeek(env, chatId, todayStr());
    } catch (e) {
      await tg.sendMessage(env, chatId, `⚠️ ${htmlEsc(e.message)}`);
    }
    return;
  }

  // Fallback
  const chat = await getChat(env, chatId);
  const curLang = langOf(chat);
  if (!chat || !chat.familyCode) {
    await tg.sendMessage(env, chatId, t(curLang, 'needCode'));
  } else {
    await tg.sendMessage(env, chatId, t(curLang, 'helpFallback'));
  }
}

// ---------- callback handler ----------

export async function handleCallback(env, cb) {
  const chatId = cb.message.chat.id;
  const messageId = cb.message.message_id;
  const data = cb.data || '';
  const callbackId = cb.id;
  const chatForLang = await getChat(env, chatId);
  const lang = langOf(chatForLang);

  const answer = (opts) => tg.answerCallback(env, callbackId, opts).catch(() => {});

  if (data === 'noop') { await answer(); return; }

  // language switch
  if (data.startsWith('lang:')) {
    const newLang = normalizeLang(data.slice(5));
    await updateChat(env, chatId, { lang: newLang });
    try { await tg.editMessage(env, chatId, messageId, newLang === 'fa' ? t('fa','langSwitchedFa') : t('en','langSwitchedEn'), undefined); } catch {}
    await answer({ text: newLang === 'fa' ? 'فارسی' : 'English' });
    const c = await getChat(env, chatId);
    if (c && c.familyCode) await showWeek(env, chatId, c.weekAnchor || todayStr());
    return;
  }

  if (data === 'act:help') {
    await tg.sendMessage(env, chatId, helpText(lang));
    await answer();
    return;
  }
  if (data === 'act:whoami') {
    await showWhoami(env, chatId);
    await answer();
    return;
  }
  if (data === 'act:foods') {
    await showFoods(env, chatId);
    await answer();
    return;
  }

  if (data.startsWith('nav:')) {
    const anchor = data.slice(4);
    const safe = /^\d{4}-\d{2}-\d{2}$/.test(anchor) ? anchor : todayStr();
    const chat = await getChat(env, chatId);
    const curLang = langOf(chat);
    if (!chat || !chat.familyCode) { await answer({ text: t(curLang, 'needFamily'), show_alert: true }); return; }
    try {
      const family = await foodlog.getFamily(env, chat.familyCode);
      await updateChat(env, chatId, { weekAnchor: safe });
      const text = weekMessageText(family, safe, curLang);
      const kb = weekKeyboard(family, safe, curLang);
      await tg.editMessage(env, chatId, messageId, text, kb);
      await answer();
    } catch (e) {
      await answer({ text: e.message.slice(0, 200), show_alert: true });
    }
    return;
  }

  if (data.startsWith('slot:')) {
    const parts = data.split(':');
    if (parts.length !== 3) { await answer(); return; }
    const date = parts[1];
    const slot = parts[2];
    const res = await ensureFamily(env, chatId);
    if (!res || !res.family) { await answer({ text: t(lang, 'needFamily'), show_alert: true }); return; }
    const { family, chat } = res;
    const curLang = langOf(chat);
    const anchor = chat.weekAnchor || date;
    const txt = slotDetailText(family, date, slot, chat.memberId, curLang);
    const kb = slotKeyboard(family, date, slot, anchor, curLang);
    await tg.sendMessage(env, chatId, txt, { reply_markup: kb });
    await answer();
    return;
  }

  if (data.startsWith('add:')) {
    const parts = data.split(':');
    if (parts.length !== 3) { await answer(); return; }
    const date = parts[1];
    const slot = parts[2];
    const res = await ensureFamily(env, chatId);
    if (!res || !res.family) { await answer({ text: t(lang, 'needFamily'), show_alert: true }); return; }
    const { family, chat } = res;
    const curLang = langOf(chat);
    const meal = (family.meals[date] || {})[slot];
    const selected = meal ? meal.items.map((it) => it.id) : [];
    const session = { step: 'pick_foods', date, slot, selectedIds: selected, page: 0, anchor: chat.weekAnchor || date };
    await putSession(env, chatId, session);
    const intro = foodPickerIntro(date, slot, family, curLang);
    const kb = foodPickerKeyboard(family, session, curLang);
    await tg.sendMessage(env, chatId, intro, { reply_markup: kb });
    await answer();
    return;
  }

  if (data.startsWith('pick:')) {
    const sub = data.slice(5);
    let session = await getSession(env, chatId);
    if (!session || session.step !== 'pick_foods') {
      await answer({ text: t(lang, 'pickerExpired'), show_alert: true });
      return;
    }
    const res = await ensureFamily(env, chatId);
    if (!res || !res.family) { await answer({ text: t(lang, 'familyLoadFail', { code: '', err: '' }), show_alert: true }); return; }
    let family = res.family;
    const curLang = langOf(res.chat);
    const date = session.date;
    const slot = session.slot;

    if (sub === 'done') {
      if (!session.selectedIds || !session.selectedIds.length) {
        await answer({ text: t(curLang, 'needPick'), show_alert: true });
        return;
      }
      const items = [];
      for (const id of session.selectedIds) {
        let f = family.foods.find((x) => x.id === id);
        if (!f) {
          try { family = await foodlog.getFamily(env, res.chat.familyCode); f = family.foods.find((x) => x.id === id); } catch {}
        }
        if (f) items.push({ id: f.id, name: f.name });
        else {
          const m = (res.family.meals[date] || {})[slot];
          const it = m && m.items.find((x) => x.id === id);
          if (it) items.push({ id: it.id, name: it.name });
        }
      }
      if (!items.length) {
        await answer({ text: t(curLang, 'needPick'), show_alert: true });
        return;
      }
      try {
        const updated = await foodlog.setMeal(env, res.chat.familyCode, date, slot, items, res.chat.memberId || undefined);
        await clearSession(env, chatId);
        const confirmText = t(curLang, 'saved', { date, slot: slot === 'lunch' ? t(curLang,'lunch') : t(curLang,'dinner'), items: items.map((it) => htmlEsc(it.name)).join(' + ') });
        try { await tg.editMessage(env, chatId, messageId, confirmText, undefined); } catch { await tg.sendMessage(env, chatId, confirmText); }
        await answer({ text: curLang === 'fa' ? 'ذخیره شد ✓' : 'Meal saved ✓' });
        const txt = slotDetailText(updated, date, slot, res.chat.memberId, curLang);
        const kb = slotKeyboard(updated, date, slot, session.anchor || date, curLang);
        await tg.sendMessage(env, chatId, txt, { reply_markup: kb });
      } catch (e) {
        await answer({ text: e.message.slice(0, 200), show_alert: true });
        await tg.sendMessage(env, chatId, `${t(curLang,'saveFail', { err: htmlEsc(e.message) })}`);
      }
      return;
    }

    if (sub === 'cancel') {
      await clearSession(env, chatId);
      try { await tg.editMessage(env, chatId, messageId, t(curLang, 'cancelled'), undefined); } catch {}
      await tg.sendMessage(env, chatId, t(curLang, 'cancelledHint'));
      await answer();
      return;
    }

    if (sub === 'new') {
      await putSession(env, chatId, { ...session, step: 'await_new_food_picker' });
      await tg.sendMessage(env, chatId, t(curLang, 'sendNewFood'));
      await answer();
      return;
    }

    if (sub.startsWith('page:')) {
      const page = parseInt(sub.slice(5), 10);
      if (Number.isNaN(page)) { await answer(); return; }
      const next = { ...session, page };
      await putSession(env, chatId, next);
      const kb = foodPickerKeyboard(family, next, curLang);
      const intro = foodPickerIntro(date, slot, family, curLang);
      try { await tg.editMessage(env, chatId, messageId, intro, kb); } catch {}
      await answer();
      return;
    }

    const foodId = sub;
    const exists = family.foods.some((f) => f.id === foodId) || ((family.meals[date] || {})[slot] && family.meals[date][slot].items.some((it) => it.id === foodId));
    if (!exists) {
      await answer({ text: t(curLang, 'invalidFood'), show_alert: true });
      return;
    }
    let selected = [...(session.selectedIds || [])];
    if (selected.includes(foodId)) selected = selected.filter((x) => x !== foodId);
    else {
      if (selected.length >= 8) {
        await answer({ text: t(curLang, 'maxFoods'), show_alert: true });
        return;
      }
      selected.push(foodId);
    }
    const next = { ...session, selectedIds: selected };
    await putSession(env, chatId, next);
    const kb = foodPickerKeyboard(family, next, curLang);
    const intro2 = foodPickerIntro(date, slot, family, curLang);
    try { await tg.editMessage(env, chatId, messageId, intro2, kb); } catch {}
    await answer();
    return;
  }

  // Open the 0–10 rating grid for one food: vr:DATE:slot:foodId
  if (data.startsWith('vr:')) {
    const parts = data.split(':');
    if (parts.length !== 4) { await answer(); return; }
    const date = parts[1];
    const slot = parts[2];
    const foodId = parts[3];
    const res = await ensureFamily(env, chatId);
    if (!res || !res.family) { await answer({ text: t(lang, 'needFamily'), show_alert: true }); return; }
    const { family, chat } = res;
    const curLang = langOf(chat);
    const meal = (family.meals[date] || {})[slot];
    const it = meal && meal.items.find((x) => x.id === foodId);
    if (!it) { await answer({ text: t(curLang, 'invalidFood'), show_alert: true }); return; }
    const av = foodAvg(family, date, slot, foodId);
    const day = dayLabel(date, curLang);
    const sLabel = slotLabel(slot, curLang);
    const txt = `${slotIcon(slot)} ${foodEmoji(it.name)} <b>${htmlEsc(it.name)}</b>\n${day} — ${sLabel}\n\n${t(curLang, 'avg')}: <b>${av != null ? `${av.toFixed(1)} / 10` : t(curLang, 'notRated')}</b>\n\n${t(curLang, 'rateGridHint')}`;
    await tg.sendMessage(env, chatId, txt, { reply_markup: ratingGridKeyboard(date, slot, foodId) });
    await answer();
    return;
  }

  if (data.startsWith('v:')) {
    const parts = data.split(':');
    if (parts.length !== 5) { await answer(); return; }
    const date = parts[1];
    const slot = parts[2];
    const foodId = parts[3];
    const value = parseInt(parts[4], 10);
    const chat = await getChat(env, chatId);
    const curLang = langOf(chat);
    if (!chat || !chat.familyCode) { await answer({ text: t(curLang, 'needFamily'), show_alert: true }); return; }
    if (!chat.memberId) {
      await answer({ text: t(curLang, 'needWhoForVote'), show_alert: true });
      await tg.sendMessage(env, chatId, t(curLang, 'needWhoForVote2'));
      return;
    }
    if (!Number.isInteger(value) || value < 0 || value > 10) { await answer({ text: 'Invalid vote', show_alert: true }); return; }
    try {
      const updated = await foodlog.setVote(env, chat.familyCode, { date, slot, foodId, memberId: chat.memberId, value });
      const txt = slotDetailText(updated, date, slot, chat.memberId, curLang);
      const kb = slotKeyboard(updated, date, slot, chat.weekAnchor || date, curLang);
      try { await tg.editMessage(env, chatId, messageId, txt, kb); } catch { /* rating-grid message can't host detail keyboard — ignore */ }
      await answer({ text: t(curLang, 'rated', { face: voteFace(value), v: String(value) }) });
    } catch (e) {
      await answer({ text: e.message.slice(0, 200), show_alert: true });
    }
    return;
  }

  if (data.startsWith('clear:')) {
    const parts = data.split(':');
    if (parts.length !== 3) { await answer(); return; }
    const date = parts[1];
    const slot = parts[2];
    const chat = await getChat(env, chatId);
    const curLang = langOf(chat);
    if (!chat || !chat.familyCode) { await answer({ text: t(curLang, 'needFamily'), show_alert: true }); return; }
    try {
      const updated = await foodlog.clearMeal(env, chat.familyCode, date, slot);
      const txt = slotDetailText(updated, date, slot, chat.memberId, curLang);
      const kb = slotKeyboard(updated, date, slot, chat.weekAnchor || date, curLang);
      try { await tg.editMessage(env, chatId, messageId, txt, kb); } catch { await tg.sendMessage(env, chatId, txt, { reply_markup: kb }); }
      await answer({ text: t(curLang, 'cleared') });
    } catch (e) {
      await answer({ text: e.message.slice(0, 200), show_alert: true });
    }
    return;
  }

  if (data.startsWith('who:')) {
    const memberId = data.slice(4);
    const res = await ensureFamily(env, chatId);
    if (!res || !res.family) { await answer({ text: 'Family not found', show_alert: true }); return; }
    const member = res.family.members.find((m) => m.id === memberId);
    if (!member) { await answer({ text: 'Member not found', show_alert: true }); return; }
    await updateChat(env, chatId, { memberId: member.id, memberName: member.name });
    const curLang = langOf(res.chat);
    try { await tg.editMessage(env, chatId, messageId, t(curLang, 'youAre', { who: `${member.emoji} ${member.name}` }), undefined); } catch {}
    await answer({ text: member.name });
    await showWeek(env, chatId, res.chat.weekAnchor || todayStr());
    return;
  }

  await answer();
}
