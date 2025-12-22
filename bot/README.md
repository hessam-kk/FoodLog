# FoodLog Telegram Bot (Cloudflare Worker — webhook)

A Telegram bot that talks to the FoodLog API (`src/worker.js`) and mirrors the week view inside Telegram.

## What it does

- **Main week message** — a single message whose **inline buttons are the week**. 7 rows × 2 slots (☀️ lunch / 🌙 dinner). Each button shows the day + foods or “— empty”. Tap any slot:
  - **Empty** → pick foods to log that meal (dynamic multi-select with ✅ toggles).
  - **Filled** → see the foods in that meal, per-food average scores, who voted, and **vote per food** (😞 1 / 😐 2 / 😋 3). You can also edit the meal (same picker) or clear it.
  - Handles **multiple foods in one slot** — each food has its own 3 rating buttons and its own average.
- **Prev / Next / Today** — inline nav edits the main message in place. Week math respects `weekStart` (Mon / Sat) from the family doc.
- **Dynamic inline buttons everywhere** — week grid, food multi-select (with pagination + “➕ New food” typed free-text), per-food vote rows, and footer shortcuts.
- **/whoami** — pick which family member you are (required for voting and for crediting meal logs).
- **/foods** — lists food memory and lets you add a new food by just sending its name.
- **/start CODE** — link this chat to a 6-char family code (also accepts a bare code). The linkage + week anchor + draft meal are stored per-chat in KV (falls back to in-memory when no KV).
- **Other** — `/help`, `/week`, `/start`, bare-code linking, member-aware vote display (“you”), 8-foods-per-meal limit, and graceful API error messages.

## Layout

```
bot/
  wrangler.toml            Worker config (see KV setup below)
  .dev.vars.example        → copy to .dev.vars with BOT_TOKEN etc.
  src/
    index.js               Fetch handler + webhook secret check
    handlers.js            Commands + callback router + slot/meal/vote flows
    keyboards.js           Dynamic inline_keyboard builders (week, detail, picker)
    format.js              HTML message builders (week text, slot detail, help)
    foodlog.js             FoodLog API client (getFamily, setMeal, setVote, addFood)
    telegram.js            Telegram Bot API (sendMessage, editMessage, answerCallback)
    store.js               KV-backed per-chat link + session store (+ in-memory fallback)
    util.js                Date/week, scores, emoji helpers (mirrors public/app.js)
  scripts/
    setup-webhook.mjs      Registers the webhook (with secret_token)
    dev-poll.mjs           Local polling bridge (no public URL needed)
```

## Setup

### 1. Create the bot

Talk to [@BotFather](https://t.me/BotFather) → `/newbot` → copy the token.

### 2. Configure

```bash
cp bot/.dev.vars.example bot/.dev.vars
# edit bot/.dev.vars:
BOT_TOKEN=123456:ABC-...
WEBHOOK_SECRET=random-string
FOODLOG_API_BASE=https://foodlog.YOUR.workers.dev   # or http://127.0.0.1:8787 for local
```

For deploys, set secrets:

```bash
cd bot
npx wrangler secret put BOT_TOKEN
npx wrangler secret put WEBHOOK_SECRET
# FOODLOG_API_BASE is a plain var in wrangler.toml
```

### 3. (Optional but recommended) KV for persistence

The bot stores per-chat state in KV so it survives restarts. Without it, an in-memory fallback works but resets on deploy.

```bash
cd bot
npx wrangler kv namespace create BOT_KV
npx wrangler kv namespace create BOT_KV --preview
# paste the ids into wrangler.toml kv_namespaces (uncomment)
```

### 4. Deploy the bot Worker

```bash
cd bot
npx wrangler deploy
# note the URL, e.g. https://foodlog-telegram-bot.YOUR.workers.dev
```

### 5. Register the webhook

```bash
# with the helper (reads .dev.vars)
node bot/scripts/setup-webhook.mjs https://foodlog-telegram-bot.YOUR.workers.dev/telegram/webhook

# or manually:
curl -X POST https://api.telegram.org/bot$BOT_TOKEN/setWebhook \
  -H 'content-type: application/json' \
  -d '{"url":"https://.../telegram/webhook","secret_token":"YOUR_WEBHOOK_SECRET"}'
```

Alternative: hit the Worker itself:

```
GET https://foodlog-telegram-bot.YOUR.workers.dev/setup-webhook?url=https://.../telegram/webhook&secret=YOUR_WEBHOOK_SECRET
```

Health check:

```
GET https://foodlog-telegram-bot.YOUR.workers.dev/
GET https://foodlog-telegram-bot.YOUR.workers.dev/health
```

### 6. Use it on Telegram

- `/start K7TM3P` (or just send `K7TM3P`)
- `/whoami` → pick your member
- `/week` → the main message appears; tap any slot
- Empty slot → picker: toggle foods ✅, `➕ New food` (then type the name), `✅ Done`
- Filled slot → tap 😞/😐/😋 under the food you want to rate (requires `/whoami`)
- `◀ Prev` / `Next ▶` / `Today` edits the week in place

## Local testing without a public URL

Telegram webhooks need HTTPS. For local dev, use the polling bridge instead of a webhook:

```bash
# terminal A — FoodLog API
npm run dev                                  # :8787

# terminal B — bot Worker
cd bot
npx wrangler dev --port 8788                 # :8788 (or let it pick a port)

# terminal C — bridge (polls Telegram, forwards to local bot)
# make sure .dev.vars points LOCAL_WEBHOOK to the bot's local URL
node bot/scripts/dev-poll.mjs --local http://127.0.0.1:8788/telegram/webhook
```

The bridge first deletes any webhook so `getUpdates` works, then forwards every update to your local Worker (with the secret header if set).

## Notes

- `FOODLOG_API_BASE` must be reachable from the bot Worker (public URL after you deploy the main FoodLog Worker, or a tunnel/local URL for dev).
- Per-food votes require `memberId` — the bot prompts for `/whoami` if missing.
- The slot detail message is a **new** message (so the main week grid stays). Prev/Next edits the main grid message; votes edit the detail message.
- Telegram `callback_data` is kept under 64 bytes (`nav:YYYY-MM-DD`, `slot:DATE:slot`, `v:DATE:slot:foodId:1..3`, `pick:...`, etc.).
