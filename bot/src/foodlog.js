/**
 * Thin client for the FoodLog HTTP API (src/worker.js routes).
 * All functions throw a user-facing Error on failure.
 */

function base(env) {
  const b = (env.FOODLOG_API_BASE || '').replace(/\/+$/, '');
  if (!b) throw new Error('FOODLOG_API_BASE is not configured.');
  return b;
}

async function req(env, path, opts = {}) {
  // Prefer service binding (env.FOODLOG) when available — avoids 1042 on .workers.dev fetches from the edge
  const fetcher = env.FOODLOG ? env.FOODLOG : null;
  let res;
  if (fetcher) {
    // Service binding expects a full URL but host is ignored — use a dummy origin
    const url = 'https://foodlog' + path;
    res = await fetcher.fetch(new Request(url, {
      method: opts.method || 'GET',
      headers: { 'content-type': 'application/json', ...(opts.headers || {}) },
      body: opts.body,
    }));
  } else {
    const url = base(env) + path;
    res = await fetch(url, {
      ...opts,
      headers: { 'content-type': 'application/json', ...(opts.headers || {}) },
    });
  }
  let data = null;
  try { data = await res.json(); } catch { /* ignore */ }
  if (!res.ok) {
    throw new Error((data && data.error) || `FoodLog ${res.status}`);
  }
  return data;
}

export async function getFamily(env, code) {
  return req(env, `/api/families/${String(code).toUpperCase()}`);
}

export async function addFood(env, code, name) {
  return req(env, `/api/families/${String(code).toUpperCase()}/foods`, {
    method: 'POST',
    body: JSON.stringify({ name }),
  });
}

export async function setMeal(env, code, date, slot, items, memberId) {
  // items: [{id?, name?}]
  return req(env, `/api/families/${String(code).toUpperCase()}/meals/${date}/${slot}`, {
    method: 'PUT',
    body: JSON.stringify({ items, memberId: memberId || undefined }),
  });
}

export async function clearMeal(env, code, date, slot) {
  return req(env, `/api/families/${String(code).toUpperCase()}/meals/${date}/${slot}`, {
    method: 'DELETE',
  });
}

export async function setVote(env, code, { date, slot, foodId, memberId, value }) {
  return req(env, `/api/families/${String(code).toUpperCase()}/votes`, {
    method: 'POST',
    body: JSON.stringify({ date, slot, foodId, memberId, value }),
  });
}
