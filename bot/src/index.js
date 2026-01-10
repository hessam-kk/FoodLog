/**
 * FoodLog Telegram bot — Cloudflare Worker + webhook.
 *
 * - Verifies X-Telegram-Bot-Api-Secret-Token when WEBHOOK_SECRET is set.
 * - Routes Telegram updates to handlers (messages + callbacks).
 * - Health + webhook setup helpers.
 */

import { handleMessage, handleCallback } from './handlers.js';
import { setWebhook, getMe } from './telegram.js';
import { sendMealReminder } from './reminders.js';
import { tehranParts } from './util.js';

/** Map a scheduled run to the meal slot (Tehran time) — 15:00 lunch, 22:00 dinner. */
function reminderSlot(event, now) {
  // Prefer the cron expression that triggered the event (wrangler config is UTC).
  const cron = (event && event.cron) || '';
  if (cron.includes('30 11')) return 'lunch';   // 11:30 UTC = 15:00 Tehran
  if (cron.includes('30 18')) return 'dinner';  // 18:30 UTC = 22:00 Tehran
  // Fallback: derive from the actual Tehran clock (robust to cron changes / manual runs).
  const { hour } = tehranParts(now);
  if (hour === 15) return 'lunch';
  if (hour === 22) return 'dinner';
  return null;
}

export default {
  async scheduled(event, env, ctx) {
    const slot = reminderSlot(event, new Date());
    if (!slot) return;
    ctx.waitUntil(sendMealReminder(env, slot));
  },

  async fetch(request, env) {
    const url = new URL(request.url);

    // Health / root
    if (request.method === 'GET' && (url.pathname === '/' || url.pathname === '/health')) {
      let me = null;
      try { me = await getMe(env); } catch {}
      return json({ ok: true, bot: me ? `@${me.username}` : null, webhook: url.origin + '/telegram/webhook' });
    }

    // Telegram webhook — POST /telegram/webhook
    if (url.pathname === '/telegram/webhook') {
      if (request.method !== 'POST') return json({ error: 'Use POST.' }, 405);

      // Secret check (set when you register the webhook with secret_token)
      if (env.WEBHOOK_SECRET) {
        const got = request.headers.get('x-telegram-bot-api-secret-token');
        // Also allow ?secret=… for tunnels/manual testing
        const qs = url.searchParams.get('secret');
        if (got !== env.WEBHOOK_SECRET && qs !== env.WEBHOOK_SECRET) {
          return json({ error: 'Bad secret' }, 401);
        }
      }

      let update;
      try {
        update = await request.json();
      } catch {
        return json({ error: 'Invalid JSON' }, 400);
      }

      // Handle without awaiting the Telegram round-trips? We must await so the
      // Worker stays alive until replies are sent (waitUntil even better).
      // Use executionCtx.waitUntil if available.
      const handle = async () => {
        try {
          if (update.callback_query) {
            await handleCallback(env, update.callback_query);
          } else if (update.message) {
            await handleMessage(env, update.message);
          }
        } catch (err) {
          console.error('bot handle error', err && err.stack ? err.stack : err);
        }
      };

      // Cloudflare Workers: fetch handler may receive `ctx` as 2nd context in newer runtimes,
      // but our signature is (request, env). Use `env` for bindings and fallback to global waitUntil if present.
      // To stay compatible, try to use `globalThis` waitUntil via `request.cf`? Simple: await.
      await handle();
      return json({ ok: true });
    }



    // Convenience: GET /setup-webhook?url=https://bot.example.workers.dev/telegram/webhook
    // Protected by WEBHOOK_SECRET as query (?secret=...). Useful without the local script.
    if (url.pathname === '/setup-webhook' && request.method === 'GET') {
      const target = url.searchParams.get('url');
      const secret = url.searchParams.get('secret');
      if (env.WEBHOOK_SECRET && secret !== env.WEBHOOK_SECRET) return json({ error: 'Bad secret' }, 401);
      if (!target) return json({ error: 'Pass ?url=https://.../telegram/webhook' }, 400);
      const res = await setWebhook(env, target, env.WEBHOOK_SECRET || undefined);
      return json({ ok: true, res });
    }

    return json({ error: 'Not found' }, 404);
  },
};

function json(data, status = 200) {
  return new Response(JSON.stringify(data, null, 2), {
    status,
    headers: { 'content-type': 'application/json; charset=utf-8' },
  });
}
