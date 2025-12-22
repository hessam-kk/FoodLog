# 🍲 FoodLog — Family meal tracker on Cloudflare Workers

A beautiful, mobile-first app for families to log **lunches and dinners**, **vote on dinners** (1 bad → 3 good), and see **weekly & monthly statistics** — with a shared **food memory** so you never re-type the same meals.

Built as a single Cloudflare Worker with **D1** (SQLite) storage and static assets served from the edge. No build step, no frontend framework.

## Features

- 👨‍👩‍👧‍👦 **Families & members** — create a family, share the 6-character join code (or invite link), everyone logs together.
- 📅 **Week view** — every day shows lunch and dinner; tap a meal to log it. Weeks can start on Saturday or Monday.
- 🍕🍝 **Multiple foods per meal** — log "pizza + pasta" for one lunch with food chips.
- 🗳️ **Per-food votes** — every member rates every food 😞 / 😐 / 😋 (1–3), lunch or dinner. Each food chip shows its live average score; tap a chip to open the rating sheet with everyone's votes.
- 📖 **Food memory** — every food you log is remembered per family. The meal editor autocompletes from it (ranked by how often you use it), so repeat diets are one tap away.
- 📊 **Statistics** — average food rating, meals logged, daily/weekly rating trend, top foods with their scores, favorite foods, best dinner, and per-member activity, for any week or month.
- 🇬🇧🇮🇷 **English + فارسی** — full translation with RTL layout, Jalali (Persian) calendar dates and Persian digits in FA mode, powered by the bundled [Vazirmatn](public/fonts/) font (self-hosted, no external requests). Switch anytime from the top bar or Settings.
- 🌗 **Light / Dark / System theme** — follows your OS by default, or pin it in Settings.
- 📱 **Mobile-first UI** — bottom tab bar, bottom sheets, optimistic updates, toasts, safe-area aware.

## Quick start (local)

```bash
npm install
npm run dev
```

Open http://localhost:8787 — local D1 is simulated automatically and the schema is created on first request. Nothing else to configure.

## Deploy to Cloudflare

1. Log in and create the D1 database (one time):

   ```bash
   npx wrangler login
   npx wrangler d1 create foodlog
   ```

2. Copy the printed `database_id` into `wrangler.jsonc` (replace `PASTE_YOUR_D1_DATABASE_ID_HERE`).

3. Deploy:

   ```bash
   npm run deploy
   ```

Tables are created automatically on the first API request — no migration step needed.

## How storage works (and stays small)

Everything lives in five tiny tables: `families`, `members`, `foods`, `meals`, `food_votes`.

- The client fetches **one family document** (`GET /api/families/:code`) and renders everything — week view, stats, search — locally. Statistics are computed on the device, never on the server.
- Every mutation (`PUT` a meal, cast a vote, add a member, …) is a small targeted SQL write and returns the fresh family document, so the client stays in sync with exactly **one request per action**.
- Meal items store a name snapshot, so renaming or deleting a food in the memory never corrupts history.

## API

| Method | Path | Purpose |
| --- | --- | --- |
| `POST` | `/api/families` | Create family (`{name, memberName, weekStart?}`) |
| `GET` | `/api/families/:code` | Full family document |
| `PATCH` | `/api/families/:code` | Update name / week start |
| `DELETE` | `/api/families/:code` | Delete family (`{confirm: code}`) |
| `POST` | `/api/families/:code/members` | Add member |
| `DELETE` | `/api/families/:code/members/:id` | Remove member (and their votes) |
| `PUT` | `/api/families/:code/meals/:date/:slot` | Log meal (`{items:[{id?, name?}], memberId?}`) |
| `DELETE` | `/api/families/:code/meals/:date/:slot` | Clear a meal |
| `POST` | `/api/families/:code/votes` | Rate a food (`{date, slot, foodId, memberId, value: 1..3\|null}`) |
| `POST` | `/api/families/:code/foods` | Add food to memory |
| `PUT` | `/api/families/:code/foods/:id` | Rename food |
| `DELETE` | `/api/families/:code/foods/:id` | Remove food from memory |

## Project layout

```
src/worker.js        Worker: routing, validation, D1 access, JSON API
public/index.html    SPA shell (applies saved language/theme before paint)
public/app.js        Views, state, i18n (EN/FA), optimistic mutations
public/styles.css    Mobile-first design system (light/dark, RTL, Vazirmatn)
public/fonts/        Vazirmatn variable font (OFL license)
public/icon.svg      App icon / favicon
wrangler.jsonc       Worker + assets + D1 binding
```
