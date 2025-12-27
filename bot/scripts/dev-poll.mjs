#!/usr/bin/env node
/**
 * Local polling bridge — lets you test the bot without a public webhook URL.
 *
 * It long-polls Telegram's getUpdates and forwards each update to your local
 * Worker's webhook endpoint (default http://127.0.0.1:8787/telegram/webhook).
 *
 * Usage:
 *   1. Terminal A: npm run dev  (or wrangler dev in bot/ — defaults to :8787 or :8788)
 *   2. Terminal B: node scripts/dev-poll.mjs
 *      Options via env / .dev.vars or flags:
 *        --local http://127.0.0.1:8788/telegram/webhook
 *        --secret mysecret   (must match WEBHOOK_SECRET)
 *
 * Press Ctrl+C to stop. Run `deleteWebhook` first so polling works.
 */
import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const botDir = path.resolve(__dirname, '..');

function loadDevVars() {
  const p = path.join(botDir, '.dev.vars');
  if (!fs.existsSync(p)) return;
  for (const line of fs.readFileSync(p, 'utf8').split('\n')) {
    const m = line.match(/^\s*([A-Za-z_][A-Za-z0-9_]*)\s*=\s*(.*)\s*$/);
    if (!m) continue;
    const k = m[1];
    let v = m[2].trim();
    if ((v.startsWith('"') && v.endsWith('"')) || (v.startsWith("'") && v.endsWith("'"))) v = v.slice(1, -1);
    if (!(k in process.env)) process.env[k] = v;
  }
}
loadDevVars();

function arg(name, fallback) {
  const i = process.argv.indexOf(name);
  if (i !== -1 && process.argv[i + 1]) return process.argv[i + 1];
  return fallback;
}

const token = process.env.BOT_TOKEN || process.env.TELEGRAM_BOT_TOKEN;
if (!token) { console.error('Set BOT_TOKEN in env or bot/.dev.vars'); process.exit(1); }

const localUrl = arg('--local', process.env.LOCAL_WEBHOOK || 'http://127.0.0.1:8787/telegram/webhook');
const secret = arg('--secret', process.env.WEBHOOK_SECRET || '');
const apiBase = `https://api.telegram.org/bot${token}`;

console.log(`→ Deleting webhook so polling works…`);
{
  const r = await fetch(`${apiBase}/deleteWebhook`, { method: 'POST', headers: { 'content-type': 'application/json' }, body: JSON.stringify({ drop_pending_updates: false }) });
  const j = await r.json();
  console.log(`  deleteWebhook: ${JSON.stringify(j)}`);
}

let offset = 0;
console.log(`→ Polling Telegram, forwarding to ${localUrl}${secret ? ' (with secret)' : ''}`);
console.log(`  Ctrl+C to stop.`);

while (true) {
  try {
    const res = await fetch(`${apiBase}/getUpdates`, {
      method: 'POST',
      headers: { 'content-type': 'application/json' },
      body: JSON.stringify({ offset, timeout: 25, allowed_updates: ['message', 'callback_query'] }),
    });
    const data = await res.json();
    if (!data.ok) {
      console.error('getUpdates error', data);
      await new Promise((r) => setTimeout(r, 3000));
      continue;
    }
    for (const upd of data.result || []) {
      offset = upd.update_id + 1;
      console.log(`  ↳ #${upd.update_id} ${upd.message ? `msg: ${upd.message.text || ''}`.slice(0, 80) : upd.callback_query ? `cb: ${upd.callback_query.data}` : '?'}`);
      // Forward to local worker
      const target = secret ? `${localUrl}${localUrl.includes('?') ? '&' : '?'}secret=${encodeURIComponent(secret)}` : localUrl;
      const headers = { 'content-type': 'application/json' };
      if (secret) headers['x-telegram-bot-api-secret-token'] = secret;
      const fwd = await fetch(target, { method: 'POST', headers, body: JSON.stringify(upd) });
      const t = await fwd.text();
      console.log(`    → local ${fwd.status} ${t.slice(0, 200)}`);
    }
  } catch (e) {
    console.error('poll error', e.message);
    await new Promise((r) => setTimeout(r, 3000));
  }
}
