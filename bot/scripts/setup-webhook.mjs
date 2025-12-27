#!/usr/bin/env node
/**
 * Register the Telegram webhook.
 * Usage:
 *   node scripts/setup-webhook.mjs https://foodlog-telegram-bot.YOUR.workers.dev/telegram/webhook
 *
 * Reads BOT_TOKEN and WEBHOOK_SECRET from:
 *   - env vars, or
 *   - bot/.dev.vars (KEY=VALUE lines)
 *
 * If WEBHOOK_SECRET is set, it's sent as Telegram's secret_token (also verified by the Worker).
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

const url = process.argv[2];
if (!url) {
  console.error('Usage: node scripts/setup-webhook.mjs https://YOUR_BOT.workers.dev/telegram/webhook');
  process.exit(1);
}
const token = process.env.BOT_TOKEN || process.env.TELEGRAM_BOT_TOKEN;
const secret = process.env.WEBHOOK_SECRET || '';
if (!token) {
  console.error('Set BOT_TOKEN (or TELEGRAM_BOT_TOKEN) in env or bot/.dev.vars');
  process.exit(1);
}
const api = `https://api.telegram.org/bot${token}/setWebhook`;
const body = { url, allowed_updates: ['message', 'callback_query'], drop_pending_updates: false };
if (secret) body.secret_token = secret;
console.log(`→ setWebhook ${url}${secret ? ' (with secret_token)' : ''}`);
const res = await fetch(api, { method: 'POST', headers: { 'content-type': 'application/json' }, body: JSON.stringify(body) });
const data = await res.json();
console.log(JSON.stringify(data, null, 2));
if (!data.ok) process.exit(1);
console.log('✅ Webhook set. Send /start to your bot on Telegram.');
