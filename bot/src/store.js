/**
 * KV-backed per-chat storage with in-memory fallback (for local dev without KV).
 * Keys:
 *   chat:<chatId>    -> { familyCode, memberId, memberName, weekAnchor }
 *   session:<chatId> -> { step, date, slot, selectedIds, page, awaitNewFood, ... }
 */

const MEM = typeof globalThis !== 'undefined' ? (globalThis.__BOT_MEM ??= new Map()) : new Map();
if (typeof globalThis !== 'undefined') globalThis.__BOT_MEM = MEM;

function kv(env) {
  return env && env.BOT_KV ? env.BOT_KV : null;
}

function keyChat(chatId) { return `chat:${chatId}`; }
function keySession(chatId) { return `session:${chatId}`; }

async function kvGet(env, key) {
  const k = kv(env);
  if (k) {
    const v = await k.get(key);
    return v ? JSON.parse(v) : null;
  }
  const v = MEM.get(key);
  return v ? JSON.parse(v) : null;
}

async function kvPut(env, key, obj) {
  const s = JSON.stringify(obj);
  const k = kv(env);
  if (k) await k.put(key, s);
  else MEM.set(key, s);
}

async function kvDel(env, key) {
  const k = kv(env);
  if (k) await k.delete(key);
  else MEM.delete(key);
}

// ---- chat linkage ----

export async function getChat(env, chatId) {
  return (await kvGet(env, keyChat(chatId))) || null;
}

export async function putChat(env, chatId, data) {
  await kvPut(env, keyChat(chatId), data);
}

export async function updateChat(env, chatId, patch) {
  const cur = (await getChat(env, chatId)) || {};
  const next = { ...cur, ...patch };
  await putChat(env, chatId, next);
  return next;
}

// ---- session (draft meal etc.) ----

export async function getSession(env, chatId) {
  return (await kvGet(env, keySession(chatId))) || null;
}

export async function putSession(env, chatId, data) {
  await kvPut(env, keySession(chatId), data);
}

export async function clearSession(env, chatId) {
  await kvDel(env, keySession(chatId));
}
