/**
 * Low-level Telegram Bot API via fetch — no dependencies.
 */

function token(env) {
  const t = env.BOT_TOKEN || env.TELEGRAM_BOT_TOKEN;
  if (!t) throw new Error('BOT_TOKEN is not set.');
  return t;
}

export async function tg(env, method, body) {
  const url = `https://api.telegram.org/bot${token(env)}/${method}`;
  const res = await fetch(url, {
    method: 'POST',
    headers: { 'content-type': 'application/json' },
    body: JSON.stringify(body),
  });
  const data = await res.json().catch(() => ({}));
  if (!res.ok || !data.ok) {
    // Log but don't throw for send failures that are non-critical; throw otherwise.
    const msg = (data && data.description) || `Telegram ${method} ${res.status}`;
    throw new Error(msg);
  }
  return data.result;
}

export async function sendMessage(env, chatId, text, opts = {}) {
  return tg(env, 'sendMessage', {
    chat_id: String(chatId),
    text,
    parse_mode: opts.parse_mode || 'HTML',
    disable_web_page_preview: true,
    reply_markup: opts.reply_markup,
    ...opts.extra,
  });
}

export async function editMessage(env, chatId, messageId, text, replyMarkup) {
  return tg(env, 'editMessageText', {
    chat_id: String(chatId),
    message_id: Number(messageId),
    text,
    parse_mode: 'HTML',
    disable_web_page_preview: true,
    reply_markup: replyMarkup,
  });
}

export async function answerCallback(env, callbackId, opts = {}) {
  return tg(env, 'answerCallbackQuery', {
    callback_query_id: callbackId,
    ...opts,
  });
}

export async function setWebhook(env, webhookUrl, secretToken) {
  return tg(env, 'setWebhook', {
    url: webhookUrl,
    secret_token: secretToken || undefined,
    allowed_updates: ['message', 'callback_query'],
    drop_pending_updates: false,
  });
}

export async function deleteWebhook(env) {
  return tg(env, 'deleteWebhook', { drop_pending_updates: true });
}

export async function getMe(env) {
  return tg(env, 'getMe', {});
}
