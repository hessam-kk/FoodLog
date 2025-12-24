import { getChat, putChat, updateChat, getSession, putSession, clearSession } from './store.js';
import * as foodlog from './foodlog.js';
import * as tg from './telegram.js';
import { weekKeyboard, slotKeyboard, foodPickerKeyboard, whoamiKeyboard, foodsListKeyboard } from './keyboards.js';
import { weekMessageText, slotDetailText, foodPickerIntro, helpText } from './format.js';
import { todayStr, weekDates, htmlEsc } from './util.js';

// ---------- helpers ----------

async function ensureFamily(env, chatId) {
  const chat = await getChat(env, chatId);
  if (!chat || !chat.familyCode) return null;
  try {
    const family = await foodlog.getFamily(env, chat.familyCode);
    return { chat, family };
  } catch (e) {
    // Family code invalid (maybe deleted). Tell user.
    return { chat, family: null, error: e.message };
  }
}

async function showWeek(env, chatId, anchorOverride) {
  const chat = await getChat(env, chatId);
  if (!chat || !chat.familyCode) {
    await tg.sendMessage(env, chatId,
      `👋 Welcome to <b>FoodLog</b>!\n\nThis chat isn't linked yet.\nSend your <b>6-character family code</b> (e.g. <code>K7TM3P</code>) or use <code>/start CODE</code>.\nYou can find the code in the FoodLog app under Family.`,
      { reply_markup: undefined });
    // Put into await_code state so a plain code message will link.
    await putSession(env, chatId, { step: 'await_code' });
    return;
  }
  let family;
  try {
    family = await foodlog.getFamily(env, chat.familyCode);
  } catch (e) {
    await tg.sendMessage(env, chatId, `⚠️ Couldn't load family <code>${htmlEsc(chat.familyCode)}</code>: ${htmlEsc(e.message)}\nSend a new code with <code>/start CODE</code> or tap /help.`);
    return;
  }
  const anchor = anchorOverride || chat.weekAnchor || todayStr();
  // Persist anchor so Back buttons return to the same week
  await updateChat(env, chatId, { weekAnchor: anchor });
  const text = weekMessageText(family, anchor);
  const kb = weekKeyboard(family, anchor);
  await tg.sendMessage(env, chatId, text, { reply_markup: kb });
}

async function showWhoami(env, chatId) {
  const res = await ensureFamily(env, chatId);
  if (!res || !res.family) {
    await showWeek(env, chatId);
    return;
  }
  const { family, chat } = res;
  const current = chat.memberId ? family.members.find((m) => m.id === chat.memberId) : null;
  let txt = `👤 <b>Who are you?</b>\n`;
  if (current) txt += `Currently: ${current.emoji} <b>${htmlEsc(current.name)}</b> — tap another to switch.\n`;
  else txt += `Pick your member — votes will be recorded under that name.\n`;
  txt += `\n<i>Members in ${htmlEsc(family.name)}:</i>`;
  const kb = whoamiKeyboard(family);
  await tg.sendMessage(env, chatId, txt, { reply_markup: kb });
}

async function showFoods(env, chatId) {
  const res = await ensureFamily(env, chatId);
  if (!res || !res.family) {
    await showWeek(env, chatId);
    return;
  }
  const { family } = res;
  if (!family.foods.length) {
    await tg.sendMessage(env, chatId,
      `📖 <b>Food memory is empty</b>\nFoods you log will be remembered here.\n\nSend a food name to add it, e.g. “<i>ghormeh sabzi</i>”.`,
      { reply_markup: foodsListKeyboard() });
    await putSession(env, chatId, { step: 'await_food_text' });
    return;
  }
  // List top foods by uses (limit to 20 for readability)
  const top = [...family.foods].sort((a, b) => b.uses - a.uses).slice(0, 25);
  let txt = `📖 <b>Food memory — ${family.foods.length} foods</b>\n`;
  txt += top.map((f) => `• ${htmlEsc(f.name)} — used ${f.uses}×`).join('\n');
  if (family.foods.length > 25) txt += `\n<i>…and ${family.foods.length - 25} more</i>`;
  txt += `\n\nSend a food name to add it, or tap Week to go back.`;
  await tg.sendMessage(env, chatId, txt, { reply_markup: foodsListKeyboard() });
  await putSession(env, chatId, { step: 'await_food_text' });
}

// ---------- message handler ----------

export async function handleMessage(env, msg) {
  const chatId = msg.chat.id;
  const textRaw = (msg.text || '').trim();
  const text = textRaw;
  let session = await getSession(env, chatId);

  // Session: awaiting family code (from /start without arg or welcome)
  if (session && session.step === 'await_code') {
    const code = text.toUpperCase().replace(/\s+/g, '');
    if (!/^[A-Z0-9]{6}$/.test(code)) {
      await tg.sendMessage(env, chatId, `That doesn't look like a 6-character code. Try again (e.g. <code>K7TM3P</code>), or use <code>/start CODE</code>.`);
      return;
    }
    try {
      const family = await foodlog.getFamily(env, code);
      await putChat(env, chatId, { familyCode: family.id, memberId: null, memberName: null, weekAnchor: todayStr() });
      await clearSession(env, chatId);
      await tg.sendMessage(env, chatId, `✅ Linked to <b>${htmlEsc(family.name)}</b> (<code>${family.id}</code>) — ${family.members.length} members, ${family.foods.length} foods.`);
      // Prompt whoami
      await showWhoami(env, chatId);
      await showWeek(env, chatId, todayStr());
    } catch (e) {
      await tg.sendMessage(env, chatId, `⚠️ ${htmlEsc(e.message)}\nDouble-check the code and try again.`);
    }
    return;
  }

  // Session: awaiting new food name during meal picker (typed manually)
  if (session && session.step === 'await_new_food_picker') {
    const name = text.trim();
    if (!name || name.startsWith('/')) {
      await tg.sendMessage(env, chatId, `Please send a food name, or use /help to cancel.`);
      return;
    }
    const res = await ensureFamily(env, chatId);
    if (!res || !res.family) { await clearSession(env, chatId); return; }
    try {
      // Persist new food to memory, then select it
      const updated = await foodlog.addFood(env, res.chat.familyCode, name);
      const created = updated.foods.find((f) => f.name.toLowerCase() === name.toLowerCase()) || updated.foods[0];
      // Restore picker session, adding this food id
      const newSelected = [...(session.selectedIds || [])];
      if (created && !newSelected.includes(created.id)) {
        if (newSelected.length >= 8) {
          await tg.sendMessage(env, chatId, `⚠️ A meal can have at most 8 foods. Added “${htmlEsc(name)}” to memory but not auto-selected — deselect one first.`);
        } else {
          newSelected.push(created.id);
        }
      }
      const nextSession = { step: 'pick_foods', date: session.date, slot: session.slot, selectedIds: newSelected, page: session.page || 0, anchor: session.anchor };
      await putSession(env, chatId, nextSession);
      await tg.sendMessage(env, chatId,
        `✅ Added “${htmlEsc(name)}” to memory.`,
      );
      // Re-show picker as a new message with updated family
      const fam2 = updated;
      const intro = foodPickerIntro(session.date, session.slot, fam2);
      const kb = foodPickerKeyboard(fam2, nextSession);
      await tg.sendMessage(env, chatId, intro, { reply_markup: kb });
    } catch (e) {
      await tg.sendMessage(env, chatId, `⚠️ Couldn't add food: ${htmlEsc(e.message)}`);
    }
    return;
  }

  // Session: awaiting food name via /foods list
  if (session && session.step === 'await_food_text') {
    // Allow "cancel" keywords
    if (text.toLowerCase() === 'cancel' || text === '✕ Cancel' || text.startsWith('/')) {
      await clearSession(env, chatId);
      // fall through to command handling
    } else {
      const name = text.trim();
      if (!name) {
        await tg.sendMessage(env, chatId, `Please send a food name, or type /help.`);
        return;
      }
      const res = await ensureFamily(env, chatId);
      if (!res || !res.family) { await clearSession(env, chatId); return; }
      try {
        const updated = await foodlog.addFood(env, res.chat.familyCode, name);
        await tg.sendMessage(env, chatId, `✅ “${htmlEsc(name)}” added to food memory 📖`);
        // Keep session open for more adds, or clear? Keep open for convenience.
        await tg.sendMessage(env, chatId, `Send another food name, or tap /week to see the week view.`);
        // Don't clear — allow multiple adds
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
        await tg.sendMessage(env, chatId, `Usage: <code>/start CODE</code> — e.g. <code>/start K7TM3P</code>\nOr just send the 6-character code.`);
        return;
      }
      try {
        const family = await foodlog.getFamily(env, arg);
        await putChat(env, chatId, { familyCode: family.id, memberId: null, memberName: null, weekAnchor: todayStr() });
        await clearSession(env, chatId);
        await tg.sendMessage(env, chatId, `✅ Linked to <b>${htmlEsc(family.name)}</b> (<code>${family.id}</code>).`);
        await showWhoami(env, chatId);
        await showWeek(env, chatId, todayStr());
      } catch (e) {
        await tg.sendMessage(env, chatId, `⚠️ ${htmlEsc(e.message)}`);
      }
    } else {
      // No arg — show linkage prompt + current week if already linked
      const chat = await getChat(env, chatId);
      if (chat && chat.familyCode) {
        await tg.sendMessage(env, chatId, `Linked to <code>${htmlEsc(chat.familyCode)}</code>. Use <code>/start CODE</code> to switch family, or tap below.`);
        await showWeek(env, chatId);
      } else {
        await tg.sendMessage(env, chatId, `👋 Send your <b>6-character family code</b> (e.g. <code>K7TM3P</code>) or use <code>/start CODE</code>.\nFind it in the FoodLog app → Family.`);
        await putSession(env, chatId, { step: 'await_code' });
      }
    }
    return;
  }

  if (text.startsWith('/week') || text.startsWith('/meals')) {
    await clearSession(env, chatId);
    await showWeek(env, chatId);
    return;
  }

  if (text.startsWith('/help')) {
    await tg.sendMessage(env, chatId, helpText());
    return;
  }

  if (text.startsWith('/whoami') || text.startsWith('/who')) {
    await showWhoami(env, chatId);
    return;
  }

  if (text.startsWith('/foods') || text.startsWith('/food')) {
    await showFoods(env, chatId);
    return;
  }

  // Bare 6-char code without /start
  if (/^[A-Za-z0-9]{6}$/.test(text.trim())) {
    const code = text.trim().toUpperCase();
    try {
      const family = await foodlog.getFamily(env, code);
      await putChat(env, chatId, { familyCode: family.id, memberId: null, memberName: null, weekAnchor: todayStr() });
      await clearSession(env, chatId);
      await tg.sendMessage(env, chatId, `✅ Linked to <b>${htmlEsc(family.name)}</b> (<code>${family.id}</code>).`);
      await showWhoami(env, chatId);
      await showWeek(env, chatId, todayStr());
    } catch (e) {
      await tg.sendMessage(env, chatId, `⚠️ ${htmlEsc(e.message)}`);
    }
    return;
  }

  // Fallback: show help hint or week
  const chat = await getChat(env, chatId);
  if (!chat || !chat.familyCode) {
    await tg.sendMessage(env, chatId, `Send your family code or use <code>/start CODE</code>. Try /help for commands.`);
  } else {
    await tg.sendMessage(env, chatId, `I didn't understand that. Try /week to see meals, or /help for all commands.`);
  }
}

// ---------- callback handler ----------

export async function handleCallback(env, cb) {
  const chatId = cb.message.chat.id;
  const messageId = cb.message.message_id;
  const data = cb.data || '';
  const callbackId = cb.id;

  // Always answer quickly to remove spinner; we may answer with text later.
  const answer = (opts) => tg.answerCallback(env, callbackId, opts).catch(() => {});

  // Quick noop
  if (data === 'noop') { await answer(); return; }

  // Footer quick actions
  if (data === 'act:help') {
    await tg.sendMessage(env, chatId, helpText());
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

  // Week navigation: nav:YYYY-MM-DD
  if (data.startsWith('nav:')) {
    const anchor = data.slice(4);
    // anchor should be YYYY-MM-DD; fallback to today if malformed
    const safe = /^\d{4}-\d{2}-\d{2}$/.test(anchor) ? anchor : todayStr();
    const chat = await getChat(env, chatId);
    if (!chat || !chat.familyCode) { await answer({ text: 'Link a family first: /start CODE', show_alert: true }); return; }
    try {
      const family = await foodlog.getFamily(env, chat.familyCode);
      await updateChat(env, chatId, { weekAnchor: safe });
      const text = weekMessageText(family, safe);
      const kb = weekKeyboard(family, safe);
      await tg.editMessage(env, chatId, messageId, text, kb);
      await answer();
    } catch (e) {
      await answer({ text: e.message.slice(0, 200), show_alert: true });
    }
    return;
  }

  // Slot tap: slot:YYYY-MM-DD:slot
  if (data.startsWith('slot:')) {
    const parts = data.split(':'); // ['slot','2024-08-12','lunch']
    if (parts.length !== 3) { await answer(); return; }
    const date = parts[1];
    const slot = parts[2];
    const res = await ensureFamily(env, chatId);
    if (!res || !res.family) { await answer({ text: 'Link a family first', show_alert: true }); return; }
    const { family, chat } = res;
    const anchor = chat.weekAnchor || date;
    const txt = slotDetailText(family, date, slot, chat.memberId);
    const kb = slotKeyboard(family, date, slot, anchor);
    await tg.sendMessage(env, chatId, txt, { reply_markup: kb });
    await answer();
    return;
  }

  // Start add/edit: add:DATE:slot
  if (data.startsWith('add:')) {
    const parts = data.split(':');
    if (parts.length !== 3) { await answer(); return; }
    const date = parts[1];
    const slot = parts[2];
    const res = await ensureFamily(env, chatId);
    if (!res || !res.family) { await answer({ text: 'Link a family first', show_alert: true }); return; }
    const { family, chat } = res;
    const meal = (family.meals[date] || {})[slot];
    const selected = meal ? meal.items.map((it) => it.id) : [];
    const session = { step: 'pick_foods', date, slot, selectedIds: selected, page: 0, anchor: chat.weekAnchor || date };
    await putSession(env, chatId, session);
    const intro = foodPickerIntro(date, slot, family);
    const kb = foodPickerKeyboard(family, session);
    await tg.sendMessage(env, chatId, intro, { reply_markup: kb });
    await answer();
    return;
  }

  // Food picker: pick:...
  if (data.startsWith('pick:')) {
    const sub = data.slice(5);
    let session = await getSession(env, chatId);
    if (!session || session.step !== 'pick_foods') {
      await answer({ text: 'This picker has expired — tap the slot again.', show_alert: true });
      return;
    }
    const res = await ensureFamily(env, chatId);
    if (!res || !res.family) { await answer({ text: 'Family not found', show_alert: true }); return; }
    let family = res.family;
    const date = session.date;
    const slot = session.slot;

    if (sub === 'done') {
      if (!session.selectedIds || !session.selectedIds.length) {
        await answer({ text: 'Pick at least one food first.', show_alert: true });
        return;
      }
      // Resolve items (id + name). New foods created via await_new_food_picker have already been added.
      const items = [];
      for (const id of session.selectedIds) {
        let f = family.foods.find((x) => x.id === id);
        if (!f) {
          // Maybe it's a food that was just created but family is stale — refetch?
          try { family = await foodlog.getFamily(env, res.chat.familyCode); f = family.foods.find((x) => x.id === id); } catch {}
        }
        if (f) items.push({ id: f.id, name: f.name });
        else {
          // Fallback: try from current meal items snapshot
          const m = (res.family.meals[date] || {})[slot];
          const it = m && m.items.find((x) => x.id === id);
          if (it) items.push({ id: it.id, name: it.name });
        }
      }
      if (!items.length) {
        await answer({ text: 'No valid foods selected.', show_alert: true });
        return;
      }
      try {
        const updated = await foodlog.setMeal(env, res.chat.familyCode, date, slot, items, res.chat.memberId || undefined);
        await clearSession(env, chatId);
        // Try to edit the picker message to confirm
        const confirmText = `✅ Saved <b>${htmlEsc(date)} ${slot}</b>: ${items.map((it) => htmlEsc(it.name)).join(' + ')}`;
        try { await tg.editMessage(env, chatId, messageId, confirmText, undefined); } catch { await tg.sendMessage(env, chatId, confirmText); }
        await answer({ text: 'Meal saved ✓' });
        // Also send updated slot detail so voting can begin immediately
        const txt = slotDetailText(updated, date, slot, res.chat.memberId);
        const kb = slotKeyboard(updated, date, slot, session.anchor || date);
        await tg.sendMessage(env, chatId, txt, { reply_markup: kb });
      } catch (e) {
        await answer({ text: e.message.slice(0, 200), show_alert: true });
        await tg.sendMessage(env, chatId, `⚠️ Couldn't save meal: ${htmlEsc(e.message)}`);
      }
      return;
    }

    if (sub === 'cancel') {
      await clearSession(env, chatId);
      try { await tg.editMessage(env, chatId, messageId, `✕ Cancelled.`, undefined); } catch {}
      await tg.sendMessage(env, chatId, `Cancelled. Tap a slot button from the week view to try again.`);
      await answer();
      return;
    }

    if (sub === 'new') {
      // Switch session to await text input for new food
      await putSession(env, chatId, { ...session, step: 'await_new_food_picker' });
      await tg.sendMessage(env, chatId, `Send the <b>new food name</b> (e.g. <i>kebab</i>). The picker will re-appear after.`);
      await answer();
      return;
    }

    if (sub.startsWith('page:')) {
      const page = parseInt(sub.slice(5), 10);
      if (Number.isNaN(page)) { await answer(); return; }
      const next = { ...session, page };
      await putSession(env, chatId, next);
      const kb = foodPickerKeyboard(family, next);
      const intro = foodPickerIntro(date, slot, family);
      try { await tg.editMessage(env, chatId, messageId, intro, kb); } catch {}
      await answer();
      return;
    }

    // Otherwise it's a food id toggle
    const foodId = sub;
    // Verify id exists in foods or current meal
    const exists = family.foods.some((f) => f.id === foodId) || ((family.meals[date] || {})[slot] && family.meals[date][slot].items.some((it) => it.id === foodId));
    if (!exists) {
      await answer({ text: 'Food not found (maybe removed).', show_alert: true });
      return;
    }
    let selected = [...(session.selectedIds || [])];
    if (selected.includes(foodId)) selected = selected.filter((x) => x !== foodId);
    else {
      if (selected.length >= 8) {
        await answer({ text: 'A meal can have at most 8 foods.', show_alert: true });
        return;
      }
      selected.push(foodId);
    }
    const next = { ...session, selectedIds: selected };
    await putSession(env, chatId, next);
    const kb = foodPickerKeyboard(family, next);
    const intro2 = foodPickerIntro(date, slot, family);
    try { await tg.editMessage(env, chatId, messageId, intro2, kb); } catch {}
    await answer();
    return;
  }

  // Vote: v:DATE:slot:foodId:1|2|3
  if (data.startsWith('v:')) {
    const parts = data.split(':');
    // v:2025-08-21:lunch:f_abc:3  -> 5 parts
    if (parts.length !== 5) { await answer(); return; }
    const date = parts[1];
    const slot = parts[2];
    const foodId = parts[3];
    const value = parseInt(parts[4], 10);
    const chat = await getChat(env, chatId);
    if (!chat || !chat.familyCode) { await answer({ text: 'Link a family first', show_alert: true }); return; }
    if (!chat.memberId) {
      await answer({ text: 'Pick who you are first: /whoami', show_alert: true });
      await tg.sendMessage(env, chatId, `⚠️ To vote, first set who you are with /whoami — then tap the rating again.`);
      return;
    }
    if (![1, 2, 3].includes(value)) { await answer({ text: 'Invalid vote', show_alert: true }); return; }
    try {
      const updated = await foodlog.setVote(env, chat.familyCode, { date, slot, foodId, memberId: chat.memberId, value });
      const txt = slotDetailText(updated, date, slot, chat.memberId);
      const kb = slotKeyboard(updated, date, slot, chat.weekAnchor || date);
      try { await tg.editMessage(env, chatId, messageId, txt, kb); } catch { await tg.sendMessage(env, chatId, txt, { reply_markup: kb }); }
      const faces = { 1: '😞', 2: '😐', 3: '😋' };
      await answer({ text: `Rated ${faces[value]} (${value}/3)` });
    } catch (e) {
      await answer({ text: e.message.slice(0, 200), show_alert: true });
    }
    return;
  }

  // Clear meal: clear:DATE:slot
  if (data.startsWith('clear:')) {
    const parts = data.split(':');
    if (parts.length !== 3) { await answer(); return; }
    const date = parts[1];
    const slot = parts[2];
    const chat = await getChat(env, chatId);
    if (!chat || !chat.familyCode) { await answer({ text: 'Link a family first', show_alert: true }); return; }
    try {
      const updated = await foodlog.clearMeal(env, chat.familyCode, date, slot);
      const txt = slotDetailText(updated, date, slot, chat.memberId);
      const kb = slotKeyboard(updated, date, slot, chat.weekAnchor || date);
      try { await tg.editMessage(env, chatId, messageId, txt, kb); } catch { await tg.sendMessage(env, chatId, txt, { reply_markup: kb }); }
      await answer({ text: 'Meal cleared' });
    } catch (e) {
      await answer({ text: e.message.slice(0, 200), show_alert: true });
    }
    return;
  }

  // Whoami pick: who:memberId
  if (data.startsWith('who:')) {
    const memberId = data.slice(4);
    const res = await ensureFamily(env, chatId);
    if (!res || !res.family) { await answer({ text: 'Family not found', show_alert: true }); return; }
    const member = res.family.members.find((m) => m.id === memberId);
    if (!member) { await answer({ text: 'Member not found', show_alert: true }); return; }
    await updateChat(env, chatId, { memberId: member.id, memberName: member.name });
    try { await tg.editMessage(env, chatId, messageId, `✅ You are <b>${member.emoji} ${htmlEsc(member.name)}</b>. Votes & meal logs will be under that name.\n\nTap /week to see meals.`, undefined); } catch {}
    await answer({ text: `You are ${member.name}` });
    // Optionally refresh week view so member context is clear
    await showWeek(env, chatId, res.chat.weekAnchor || todayStr());
    return;
  }

  await answer();
}
