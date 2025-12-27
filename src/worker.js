/**
 * FoodLog — family meal logging on Cloudflare Workers + D1.
 *
 * Storage: five small relational tables in D1. The client fetches the whole
 * family as one JSON document, renders everything (week view, stats) locally,
 * and sends small targeted mutations. Every mutation returns the fresh family
 * document, so the client stays in sync with a single round trip.
 *
 * The schema is created automatically on first request (CREATE TABLE IF NOT
 * EXISTS), so `wrangler dev` and a fresh deploy both work with zero setup.
 */

class ApiError extends Error {
  constructor(message, status = 400) {
    super(message);
    this.status = status;
  }
}

const LIMITS = {
  familyName: 60,
  memberName: 30,
  foodName: 40,
  members: 12,
  foods: 300,
  itemsPerMeal: 8,
};

// Ambiguous characters (0/O, 1/I/L) removed so codes are easy to read aloud.
const CODE_ALPHABET = 'ABCDEFGHJKMNPQRSTUVWXYZ23456789';
const MEMBER_COLORS = [
  '#e8553f', '#d99a06', '#3f8f5f', '#5b8def',
  '#8b5cf6', '#db2777', '#0d9488', '#b45309',
];
const MEMBER_EMOJIS = ['👩', '👨', '🧑', '👵', '👴', '👦', '👧', '🦊', '🐻', '🐱', '🐼', '🦁'];

export default {
  async fetch(request, env) {
    const url = new URL(request.url);
    if (url.pathname.startsWith('/api/')) {
      try {
        return await handleApi(request, env, url);
      } catch (err) {
        if (err instanceof ApiError) return jsonResponse({ error: err.message }, err.status);
        console.error('FoodLog error:', err && err.stack ? err.stack : err);
        return jsonResponse({ error: 'Something went wrong on the server.' }, 500);
      }
    }
    return env.ASSETS.fetch(request);
  },
};

/* ---------------------------------- router --------------------------------- */

async function handleApi(request, env, url) {
  const db = env.FOODLOG_DB;
  if (!db) throw new ApiError('D1 database is not bound (FOODLOG_DB).', 500);
  await ensureSchema(db);

  const parts = url.pathname.split('/').filter(Boolean); // ['api', 'families', code, section, param, sub]
  const method = request.method.toUpperCase();
  const [, resource, code, section, param, sub] = parts;

  if (resource !== 'families') throw new ApiError('Not found.', 404);

  if (!code && method === 'POST') return createFamily(request, db);
  if (code && parts.length === 3) {
    if (method === 'GET') return jsonResponse(await loadFamilyJSON(db, code));
    if (method === 'PATCH') return updateFamily(request, db, code);
    if (method === 'DELETE') return deleteFamily(request, db, code);
  }
  if (section === 'members' && parts.length === 4 && method === 'POST') {
    return addMember(request, db, code);
  }
  if (section === 'members' && parts.length === 5 && method === 'PATCH') {
    return updateMember(request, db, code, param);
  }
  if (section === 'members' && parts.length === 5 && method === 'DELETE') {
    return removeMember(db, code, param);
  }
  if (section === 'meals' && parts.length === 6 && method === 'PUT') {
    return setMeal(request, db, code, param, sub);
  }
  if (section === 'meals' && parts.length === 6 && method === 'DELETE') {
    return clearMeal(db, code, param, sub);
  }
  if (section === 'votes' && parts.length === 4 && method === 'POST') {
    return setVote(request, db, code);
  }
  if (section === 'foods' && parts.length === 4 && method === 'POST') {
    return createFood(request, db, code);
  }
  if (section === 'foods' && parts.length === 5 && method === 'DELETE') {
    return deleteFood(db, code, param);
  }
  if (section === 'foods' && parts.length === 5 && method === 'PUT') {
    return renameFood(request, db, code, param);
  }

  throw new ApiError('Not found.', 404);
}

/* --------------------------------- handlers -------------------------------- */

async function createFamily(request, db) {
  const body = await readJson(request);
  const name = clean(body.name, LIMITS.familyName) || 'My Family';
  const memberName = clean(body.memberName, LIMITS.memberName) || 'Me';
  const weekStart = body.weekStart === 'sat' ? 'sat' : 'mon';

  let id = null;
  for (let attempt = 0; attempt < 6; attempt++) {
    const candidate = makeCode();
    const existing = await db.prepare('SELECT id FROM families WHERE id = ?').bind(candidate).first();
    if (!existing) { id = candidate; break; }
  }
  if (!id) throw new ApiError('Could not allocate a family code — please retry.', 500);

  const creator = {
    id: randomId('m'),
    name: memberName,
    emoji: MEMBER_EMOJIS[0],
    color: MEMBER_COLORS[0],
  };
  await db.batch([
    db.prepare('INSERT INTO families (id, name, week_start, created_at) VALUES (?, ?, ?, ?)')
      .bind(id, name, weekStart, Date.now()),
    db.prepare('INSERT INTO members (id, family_id, name, emoji, color, created_at) VALUES (?, ?, ?, ?, ?, ?)')
      .bind(creator.id, id, creator.name, creator.emoji, creator.color, Date.now()),
  ]);

  return jsonResponse({
    id,
    name,
    weekStart,
    createdAt: Date.now(),
    members: [creator],
    foods: [],
    meals: {},
    foodVotes: {},
  }, 201);
}

async function updateFamily(request, db, code) {
  const body = await readJson(request);
  const family = await requireFamily(db, code);
  const updates = [];
  const values = [];
  if (body.name !== undefined) {
    const name = clean(body.name, LIMITS.familyName);
    if (name) { updates.push('name = ?'); values.push(name); }
  }
  if (body.weekStart !== undefined) {
    updates.push('week_start = ?');
    values.push(body.weekStart === 'sat' ? 'sat' : 'mon');
  }
  if (updates.length) {
    values.push(family.id);
    await db.prepare(`UPDATE families SET ${updates.join(', ')} WHERE id = ?`).bind(...values).run();
  }
  return jsonResponse(await loadFamilyJSON(db, family.id));
}

async function deleteFamily(request, db, code) {
  const body = await readJson(request);
  const family = await requireFamily(db, code);
  const confirm = typeof body.confirm === 'string' ? body.confirm.trim().toUpperCase() : '';
  if (confirm !== family.id) {
    throw new ApiError('Type the family code exactly to confirm deletion.', 400);
  }
  await db.batch([
    db.prepare('DELETE FROM families WHERE id = ?').bind(family.id),
    db.prepare('DELETE FROM members WHERE family_id = ?').bind(family.id),
    db.prepare('DELETE FROM foods WHERE family_id = ?').bind(family.id),
    db.prepare('DELETE FROM meals WHERE family_id = ?').bind(family.id),
    db.prepare('DELETE FROM food_votes WHERE family_id = ?').bind(family.id),
  ]);
  return jsonResponse({ ok: true });
}

async function addMember(request, db, code) {
  const body = await readJson(request);
  const name = clean(body.name, LIMITS.memberName);
  if (!name) throw new ApiError('Please enter a name.');

  const family = await requireFamily(db, code);
  const count = await db.prepare('SELECT COUNT(*) AS n FROM members WHERE family_id = ?')
    .bind(family.id).first();
  if (count.n >= LIMITS.members) {
    throw new ApiError(`A family can have at most ${LIMITS.members} members.`);
  }
  const idx = count.n;
  const emoji = typeof body.emoji === 'string' && body.emoji.trim() ? body.emoji.slice(0, 4) : MEMBER_EMOJIS[idx % MEMBER_EMOJIS.length];
  await db.prepare('INSERT INTO members (id, family_id, name, emoji, color, created_at) VALUES (?, ?, ?, ?, ?, ?)')
    .bind(randomId('m'), family.id, name, emoji, MEMBER_COLORS[idx % MEMBER_COLORS.length], Date.now())
    .run();
  return jsonResponse(await loadFamilyJSON(db, family.id));
}

async function updateMember(request, db, code, memberId) {
  const body = await readJson(request);
  const family = await requireFamily(db, code);
  const updates = [];
  const values = [];
  if (body.emoji !== undefined) {
    // One grapheme cluster (emoji with ZWJ/modifiers) is at most a few chars.
    const emoji = typeof body.emoji === 'string' ? body.emoji.replace(/\s+/g, ' ').trim().slice(0, 8) : '';
    if (!emoji) throw new ApiError('Pick an emoji.');
    updates.push('emoji = ?');
    values.push(emoji);
  }
  if (body.name !== undefined) {
    const name = clean(body.name, LIMITS.memberName);
    if (name) { updates.push('name = ?'); values.push(name); }
  }
  if (!updates.length) throw new ApiError('Nothing to update.');
  values.push(family.id, memberId);
  const res = await db.prepare(`UPDATE members SET ${updates.join(', ')} WHERE family_id = ? AND id = ?`)
    .bind(...values).run();
  if (res.meta.changes === 0) throw new ApiError('Member not found.', 404);
  return jsonResponse(await loadFamilyJSON(db, family.id));
}

async function removeMember(db, code, memberId) {
  const family = await requireFamily(db, code);
  const count = await db.prepare('SELECT COUNT(*) AS n FROM members WHERE family_id = ?')
    .bind(family.id).first();
  if (count.n <= 1) throw new ApiError('A family needs at least one member.');
  const del = await db.batch([
    db.prepare('DELETE FROM members WHERE family_id = ? AND id = ?').bind(family.id, memberId),
    db.prepare('DELETE FROM food_votes WHERE family_id = ? AND member_id = ?').bind(family.id, memberId),
  ]);
  if (del[0].meta.changes === 0) throw new ApiError('Member not found.', 404);
  return jsonResponse(await loadFamilyJSON(db, family.id));
}

async function setMeal(request, db, code, date, slot) {
  assertDate(date);
  assertSlot(slot);
  const body = await readJson(request);
  const incoming = Array.isArray(body.items) ? body.items.slice(0, LIMITS.itemsPerMeal) : [];

  const family = await requireFamily(db, code);
  const existingFoods = (await db.prepare('SELECT id, name, uses FROM foods WHERE family_id = ?')
    .bind(family.id).all()).results;

  // Resolve items against the family's food memory; loggers may pass existing
  // food ids, existing names (case-insensitive), or brand-new names.
  const resolved = [];
  const newFoods = [];
  const useIncrements = new Set();
  for (const item of incoming) {
    let food = null;
    if (item && typeof item.id === 'string') {
      food = existingFoods.find((f) => f.id === item.id) || null;
    }
    const name = clean(item && item.name, LIMITS.foodName);
    if (!food && name) {
      food = existingFoods.find((f) => f.name.toLowerCase() === name.toLowerCase()) || null;
    }
    if (!food && name) {
      if (existingFoods.length + newFoods.length < LIMITS.foods) {
        food = { id: randomId('f'), name, uses: 0, isNew: true };
        newFoods.push(food);
      } else {
        food = { id: randomId('f'), name, uses: 0, isNew: true }; // snapshot only, memory is full
      }
    }
    if (!food) continue;
    if (resolved.some((r) => r.id === food.id || r.name.toLowerCase() === food.name.toLowerCase())) continue;
    resolved.push({ id: food.id, name: food.name });
    useIncrements.add(food.id);
  }

  const stmts = [];
  for (const food of newFoods) {
    if (existingFoods.length >= LIMITS.foods) break;
    stmts.push(db.prepare('INSERT INTO foods (id, family_id, name, uses, created_at) VALUES (?, ?, ?, 0, ?)')
      .bind(food.id, family.id, food.name, Date.now()));
    existingFoods.push(food);
  }
  for (const foodId of useIncrements) {
    stmts.push(db.prepare('UPDATE foods SET uses = uses + 1 WHERE family_id = ? AND id = ?')
      .bind(family.id, foodId));
  }

  if (resolved.length === 0) {
    stmts.push(db.prepare('DELETE FROM meals WHERE family_id = ? AND date = ? AND slot = ?')
      .bind(family.id, date, slot));
    stmts.push(db.prepare('DELETE FROM food_votes WHERE family_id = ? AND date = ? AND slot = ?')
      .bind(family.id, date, slot));
  } else {
    let by = null;
    if (typeof body.memberId === 'string') {
      const member = await db.prepare('SELECT id FROM members WHERE family_id = ? AND id = ?')
        .bind(family.id, body.memberId).first();
      by = member ? member.id : null;
    }
    stmts.push(db.prepare(`INSERT INTO meals (family_id, date, slot, items, by_member_id, updated_at)
      VALUES (?, ?, ?, ?, ?, ?)
      ON CONFLICT(family_id, date, slot) DO UPDATE SET
        items = excluded.items, by_member_id = excluded.by_member_id, updated_at = excluded.updated_at`)
      .bind(family.id, date, slot, JSON.stringify(resolved), by, Date.now()));
    // Drop ratings for foods that are no longer part of this meal.
    const ids = resolved.map((r) => r.id);
    stmts.push(db.prepare(
      `DELETE FROM food_votes WHERE family_id = ? AND date = ? AND slot = ? AND food_id NOT IN (${ids.map(() => '?').join(',')})`)
      .bind(family.id, date, slot, ...ids));
  }

  await db.batch(stmts);
  return jsonResponse(await loadFamilyJSON(db, family.id));
}

async function clearMeal(db, code, date, slot) {
  assertDate(date);
  assertSlot(slot);
  const family = await requireFamily(db, code);
  await db.batch([
    db.prepare('DELETE FROM meals WHERE family_id = ? AND date = ? AND slot = ?')
      .bind(family.id, date, slot),
    db.prepare('DELETE FROM food_votes WHERE family_id = ? AND date = ? AND slot = ?')
      .bind(family.id, date, slot),
  ]);
  return jsonResponse(await loadFamilyJSON(db, family.id));
}

async function setVote(request, db, code) {
  const body = await readJson(request);
  assertDate(body.date);
  assertSlot(body.slot);
  const foodId = body.foodId;
  if (typeof foodId !== 'string' || !foodId) throw new ApiError('Missing food to rate.');

  const family = await requireFamily(db, code);
  const member = body.memberId && typeof body.memberId === 'string'
    ? await db.prepare('SELECT id FROM members WHERE family_id = ? AND id = ?')
        .bind(family.id, body.memberId).first()
    : null;
  if (!member) throw new ApiError('Pick who you are before voting.');

  // The food must be part of that meal — you rate what was actually served.
  const meal = await db.prepare('SELECT items FROM meals WHERE family_id = ? AND date = ? AND slot = ?')
    .bind(family.id, body.date, body.slot).first();
  if (!meal) throw new ApiError('Log the meal first — then rate its foods.');
  let contains = false;
  try { contains = JSON.parse(meal.items).some((it) => it.id === foodId); } catch { contains = false; }
  if (!contains) throw new ApiError('That food is not part of this meal.');

  if (body.value === null || body.value === undefined) {
    await db.prepare('DELETE FROM food_votes WHERE family_id = ? AND date = ? AND slot = ? AND food_id = ? AND member_id = ?')
      .bind(family.id, body.date, body.slot, foodId, member.id).run();
  } else {
    const value = Number(body.value);
    if (![1, 2, 3].includes(value)) throw new ApiError('Vote must be 1, 2 or 3.');
    await db.prepare(`INSERT INTO food_votes (family_id, date, slot, food_id, member_id, value) VALUES (?, ?, ?, ?, ?, ?)
      ON CONFLICT(family_id, date, slot, food_id, member_id) DO UPDATE SET value = excluded.value`)
      .bind(family.id, body.date, body.slot, foodId, member.id, value).run();
  }
  return jsonResponse(await loadFamilyJSON(db, family.id));
}

async function createFood(request, db, code) {
  const body = await readJson(request);
  const name = clean(body.name, LIMITS.foodName);
  if (!name) throw new ApiError('Please enter a food name.');
  const family = await requireFamily(db, code);
  const existing = await db.prepare('SELECT id FROM foods WHERE family_id = ? AND lower(name) = lower(?)')
    .bind(family.id, name).first();
  if (existing) return jsonResponse(await loadFamilyJSON(db, family.id)); // already remembered — dedupe silently
  const count = await db.prepare('SELECT COUNT(*) AS n FROM foods WHERE family_id = ?')
    .bind(family.id).first();
  if (count.n >= LIMITS.foods) throw new ApiError('Food memory is full (300 foods).');
  await db.prepare('INSERT INTO foods (id, family_id, name, uses, created_at) VALUES (?, ?, ?, 0, ?)')
    .bind(randomId('f'), family.id, name, Date.now()).run();
  return jsonResponse(await loadFamilyJSON(db, family.id));
}

async function deleteFood(db, code, foodId) {
  const family = await requireFamily(db, code);
  const res = await db.prepare('DELETE FROM foods WHERE family_id = ? AND id = ?')
    .bind(family.id, foodId).run();
  if (res.meta.changes === 0) throw new ApiError('Food not found.', 404);
  // Logged meals keep their name snapshots, so history stays intact.
  return jsonResponse(await loadFamilyJSON(db, family.id));
}

async function renameFood(request, db, code, foodId) {
  const body = await readJson(request);
  const name = clean(body.name, LIMITS.foodName);
  if (!name) throw new ApiError('Please enter a food name.');
  const family = await requireFamily(db, code);
  const res = await db.prepare('UPDATE foods SET name = ? WHERE family_id = ? AND id = ?')
    .bind(name, family.id, foodId).run();
  if (res.meta.changes === 0) throw new ApiError('Food not found.', 404);
  return jsonResponse(await loadFamilyJSON(db, family.id));
}

/* ------------------------------ data assembly ------------------------------ */

async function requireFamily(db, code) {
  const row = await db.prepare('SELECT id FROM families WHERE id = ?')
    .bind(String(code).toUpperCase()).first();
  if (!row) throw new ApiError('Family not found. Double-check the code.', 404);
  return row;
}

// One batched read assembles the full family document the client expects.
async function loadFamilyJSON(db, code) {
  const family = await db
    .prepare('SELECT id, name, week_start, created_at FROM families WHERE id = ?')
    .bind(String(code).toUpperCase()).first();
  if (!family) throw new ApiError('Family not found. Double-check the code.', 404);

  const [members, foods, meals, votes] = await db.batch([
    db.prepare('SELECT id, name, emoji, color FROM members WHERE family_id = ? ORDER BY created_at, rowid')
      .bind(family.id),
    db.prepare('SELECT id, name, uses FROM foods WHERE family_id = ? ORDER BY uses DESC, name COLLATE NOCASE')
      .bind(family.id),
    db.prepare('SELECT date, slot, items, by_member_id, updated_at FROM meals WHERE family_id = ?')
      .bind(family.id),
    db.prepare('SELECT date, slot, food_id, member_id, value FROM food_votes WHERE family_id = ?')
      .bind(family.id),
  ]);

  const mealsObj = {};
  for (const row of meals.results) {
    (mealsObj[row.date] ??= {})[row.slot] = {
      items: JSON.parse(row.items),
      by: row.by_member_id,
      at: row.updated_at,
    };
  }
  const foodVotesObj = {};
  for (const row of votes.results) {
    (((foodVotesObj[row.date] ??= {})[row.slot] ??= {})[row.food_id] ??= {})[row.member_id] = row.value;
  }

  return {
    id: family.id,
    name: family.name,
    weekStart: family.week_start,
    createdAt: family.created_at,
    members: members.results,
    foods: foods.results,
    meals: mealsObj,
    foodVotes: foodVotesObj,
  };
}

/* --------------------------------- helpers --------------------------------- */

const SCHEMA = [
  `CREATE TABLE IF NOT EXISTS families (
    id TEXT PRIMARY KEY,
    name TEXT NOT NULL,
    week_start TEXT NOT NULL DEFAULT 'mon',
    created_at INTEGER NOT NULL
  )`,
  `CREATE TABLE IF NOT EXISTS members (
    id TEXT PRIMARY KEY,
    family_id TEXT NOT NULL,
    name TEXT NOT NULL,
    emoji TEXT NOT NULL DEFAULT '🧑',
    color TEXT NOT NULL DEFAULT '#e8553f',
    created_at INTEGER NOT NULL
  )`,
  'CREATE INDEX IF NOT EXISTS idx_members_family ON members(family_id)',
  `CREATE TABLE IF NOT EXISTS foods (
    id TEXT PRIMARY KEY,
    family_id TEXT NOT NULL,
    name TEXT NOT NULL,
    uses INTEGER NOT NULL DEFAULT 0,
    created_at INTEGER NOT NULL
  )`,
  'CREATE INDEX IF NOT EXISTS idx_foods_family ON foods(family_id)',
  `CREATE TABLE IF NOT EXISTS meals (
    family_id TEXT NOT NULL,
    date TEXT NOT NULL,
    slot TEXT NOT NULL,
    items TEXT NOT NULL,
    by_member_id TEXT,
    updated_at INTEGER NOT NULL,
    PRIMARY KEY (family_id, date, slot)
  )`,
  `CREATE TABLE IF NOT EXISTS food_votes (
    family_id TEXT NOT NULL,
    date TEXT NOT NULL,
    slot TEXT NOT NULL,
    food_id TEXT NOT NULL,
    member_id TEXT NOT NULL,
    value INTEGER NOT NULL,
    PRIMARY KEY (family_id, date, slot, food_id, member_id)
  )`,
  // pre-release schema: the old meal-level votes table is replaced by food_votes
  'DROP TABLE IF EXISTS votes',
];

let schemaPromise = null;
function ensureSchema(db) {
  schemaPromise ??= db.batch(SCHEMA.map((sql) => db.prepare(sql)))
    .catch((err) => { schemaPromise = null; throw err; });
  return schemaPromise;
}

function jsonResponse(data, status = 200) {
  return new Response(JSON.stringify(data), {
    status,
    headers: { 'content-type': 'application/json; charset=utf-8', 'cache-control': 'no-store' },
  });
}

async function readJson(request) {
  try {
    return await request.json();
  } catch {
    throw new ApiError('Invalid JSON body.');
  }
}

function clean(value, max) {
  if (typeof value !== 'string') return '';
  return value.replace(/\s+/g, ' ').trim().slice(0, max);
}

function randomId(prefix, len = 10) {
  const bytes = crypto.getRandomValues(new Uint8Array(len));
  let out = '';
  for (const b of bytes) out += b.toString(36).padStart(2, '0');
  return `${prefix}_${out.slice(0, len)}`;
}

function makeCode() {
  const bytes = crypto.getRandomValues(new Uint8Array(6));
  return Array.from(bytes, (b) => CODE_ALPHABET[b % CODE_ALPHABET.length]).join('');
}

function assertDate(date) {
  if (typeof date !== 'string' || !/^\d{4}-\d{2}-\d{2}$/.test(date)) {
    throw new ApiError('Date must be YYYY-MM-DD.');
  }
  const [y, m, d] = date.split('-').map(Number);
  const dt = new Date(y, m - 1, d);
  if (dt.getFullYear() !== y || dt.getMonth() !== m - 1 || dt.getDate() !== d) {
    throw new ApiError('Invalid date.');
  }
}

function assertSlot(slot) {
  if (slot !== 'lunch' && slot !== 'dinner') throw new ApiError('Slot must be lunch or dinner.');
}
