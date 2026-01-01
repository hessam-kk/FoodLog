/* End-to-end API test against the local dev server. Run: node scripts/api-test.mjs */
const BASE = 'http://127.0.0.1:8787';

let passed = 0;
let failed = 0;

function check(name, cond, extra = '') {
  if (cond) { passed++; console.log(`  ✓ ${name}`); }
  else { failed++; console.log(`  ✗ ${name} ${extra}`); }
}

async function api(path, { method = 'GET', body } = {}) {
  const res = await fetch(BASE + '/api/families' + path, {
    method,
    headers: body !== undefined ? { 'content-type': 'application/json' } : undefined,
    body: body !== undefined ? JSON.stringify(body) : undefined,
  });
  const data = await res.json().catch(() => null);
  return { status: res.status, data };
}

console.log('1) create family');
let r = await api('', { method: 'POST', body: { name: 'Test Family', memberName: 'Mom' } });
check('status 201', r.status === 201, `got ${r.status}`);
check('6-char code', /^[A-Z2-9]{6}$/.test(r.data.id), r.data.id);
check('has creator member', r.data.members.length === 1 && r.data.members[0].name === 'Mom');
const code = r.data.id;
const mom = r.data.members[0].id;
console.log(`   code=${code}`);

console.log('2) add member');
r = await api(`/${code}/members`, { method: 'POST', body: { name: 'Dad' } });
check('member added', r.data.members.length === 2 && r.data.members[1].name === 'Dad');
const dad = r.data.members[1].id;
r = await api(`/${code}/members`, { method: 'POST', body: { name: '' } });
check('empty name rejected', r.status === 400, `got ${r.status}`);

console.log('3) log lunch with two foods (multi-food meal)');
const today = new Date();
const date = `${today.getFullYear()}-${String(today.getMonth() + 1).padStart(2, '0')}-${String(today.getDate()).padStart(2, '0')}`;
r = await api(`/${code}/meals/${date}/lunch`, { method: 'PUT', body: { items: [{ name: 'Pizza' }, { name: 'Pasta' }], memberId: mom } });
check('meal saved with 2 items', r.data.meals[date]?.lunch?.items?.length === 2);
check('foods remembered', r.data.foods.length === 2, JSON.stringify(r.data.foods));
check('uses counted', r.data.foods.every((f) => f.uses === 1));

console.log('4) case-insensitive food dedupe');
r = await api(`/${code}/meals/${date}/dinner`, { method: 'PUT', body: { items: [{ name: 'pizza' }, { name: 'Kebab' }], memberId: mom } });
check('pizza reused, not duplicated', r.data.foods.length === 3, JSON.stringify(r.data.foods.map((f) => f.name)));
check('pizza uses bumped to 2', r.data.foods.find((f) => f.name === 'Pizza').uses === 2);
const pizzaId = r.data.foods.find((f) => f.name === 'Pizza').id;
const kebabId = r.data.foods.find((f) => f.name === 'Kebab').id;

console.log('5) invalid meal input');
r = await api(`/${code}/meals/not-a-date/lunch`, { method: 'PUT', body: { items: [] } });
check('bad date rejected', r.status === 400);
r = await api(`/${code}/meals/${date}/breakfast`, { method: 'PUT', body: { items: [] } });
check('bad slot rejected', r.status === 400);

console.log('6) per-food votes (cast, change, toggle off, validation)');
r = await api(`/${code}/votes`, { method: 'POST', body: { date, slot: 'dinner', foodId: pizzaId, memberId: mom, value: 3 } });
check('mom rated pizza 3', r.data.foodVotes?.[date]?.dinner?.[pizzaId]?.[mom] === 3);
r = await api(`/${code}/votes`, { method: 'POST', body: { date, slot: 'dinner', foodId: pizzaId, memberId: dad, value: 1 } });
check('dad rated pizza 1', r.data.foodVotes[date].dinner[pizzaId][dad] === 1);
r = await api(`/${code}/votes`, { method: 'POST', body: { date, slot: 'dinner', foodId: pizzaId, memberId: dad, value: 2 } });
check('dad changed to 2', r.data.foodVotes[date].dinner[pizzaId][dad] === 2);
r = await api(`/${code}/votes`, { method: 'POST', body: { date, slot: 'dinner', foodId: pizzaId, memberId: 'm_nope', value: 2 } });
check('unknown member rejected', r.status === 400);
r = await api(`/${code}/votes`, { method: 'POST', body: { date, slot: 'dinner', foodId: pizzaId, memberId: dad, value: 4 } });
check('value 4 rejected', r.status === 400);
r = await api(`/${code}/votes`, { method: 'POST', body: { date, slot: 'dinner', foodId: 'f_nope', memberId: mom, value: 2 } });
check('food not in meal rejected', r.status === 400);
const tomorrow = new Date(Date.now() + 86400000);
const tdate = `${tomorrow.getFullYear()}-${String(tomorrow.getMonth() + 1).padStart(2, '0')}-${String(tomorrow.getDate()).padStart(2, '0')}`;
r = await api(`/${code}/votes`, { method: 'POST', body: { date: tdate, slot: 'dinner', foodId: pizzaId, memberId: mom, value: 2 } });
check('vote without meal rejected', r.status === 400);
r = await api(`/${code}/votes`, { method: 'POST', body: { date, slot: 'dinner', foodId: pizzaId, memberId: dad, value: null } });
check('dad vote removed', r.data.foodVotes[date].dinner[pizzaId][dad] === undefined);
r = await api(`/${code}/votes`, { method: 'POST', body: { date, slot: 'dinner', foodId: pizzaId, memberId: dad, value: 2 } });

console.log('7) food memory management');
r = await api(`/${code}/foods`, { method: 'POST', body: { name: 'salAD' } });
check('quick-added salad (canonical casing)', r.data.foods.some((f) => f.name === 'salAD'));
r = await api(`/${code}/foods`, { method: 'POST', body: { name: 'Salad' } });
check('duplicate add is no-op', r.data.foods.filter((f) => f.name.toLowerCase() === 'salad').length === 1);
const saladId = r.data.foods.find((f) => f.name.toLowerCase() === 'salad').id;
r = await api(`/${code}/foods/${saladId}`, { method: 'PUT', body: { name: 'Garden Salad' } });
check('renamed', r.data.foods.some((f) => f.name === 'Garden Salad'));
r = await api(`/${code}/foods/${saladId}`, { method: 'DELETE' });
check('deleted', !r.data.foods.some((f) => f.id === saladId));
check('meal snapshots intact', r.data.meals[date].lunch.items.length === 2);

console.log('8) re-log dinner + stale rating cleanup');
await api(`/${code}/votes`, { method: 'POST', body: { date, slot: 'dinner', foodId: kebabId, memberId: dad, value: 1 } });
r = await api(`/${code}/meals/${date}/dinner`, { method: 'PUT', body: { items: [{ id: pizzaId }, { name: 'pizza' }], memberId: dad } });
check('id + dup name collapse to one item', r.data.meals[date].dinner.items.length === 1);
check('logged-by recorded', r.data.meals[date].dinner.by === dad);
check("kebab's stale rating removed", r.data.foodVotes?.[date]?.dinner?.[kebabId] === undefined, JSON.stringify(r.data.foodVotes?.[date]));
check("pizza's ratings kept", r.data.foodVotes[date].dinner[pizzaId][dad] === 2);
r = await api(`/${code}/meals/${date}/dinner`, { method: 'DELETE' });
check('clearing a meal clears its ratings', r.data.foodVotes?.[date]?.dinner === undefined);
r = await api(`/${code}/meals/${date}/dinner`, { method: 'PUT', body: { items: [{ id: pizzaId }], memberId: mom } });
await api(`/${code}/votes`, { method: 'POST', body: { date, slot: 'dinner', foodId: pizzaId, memberId: mom, value: 3 } });
await api(`/${code}/votes`, { method: 'POST', body: { date, slot: 'dinner', foodId: pizzaId, memberId: dad, value: 2 } });

console.log('9) family settings + guards');
r = await api(`/${code}`, { method: 'PATCH', body: { weekStart: 'sat', name: 'Renamed Family' } });
check('weekStart + name updated', r.data.weekStart === 'sat' && r.data.name === 'Renamed Family');
r = await api(`/${code}/members/${dad}`, { method: 'PATCH', body: { emoji: '🐼' } });
check('member emoji updated', (r.data.members.find((m) => m.id === dad) || {}).emoji === '🐼');
r = await api(`/${code}/members/m_nope`, { method: 'PATCH', body: { emoji: '🐼' } });
check('unknown member patch → 404', r.status === 404);
r = await api(`/${code}/members/${dad}`, { method: 'PATCH', body: { emoji: '   ' } });
check('blank emoji rejected', r.status === 400);
r = await api(`/${code}`, { method: 'DELETE', body: { confirm: 'wrong' } });
check('wrong confirm rejected', r.status === 400);
r = await api(`/${code}/members/${mom}`, { method: 'DELETE' });
check('mom removed (dad remains)', r.data && r.data.members.length === 1);
r = await api(`/${code}`);
const remainingVotes = (r.data.foodVotes[date] || {}).dinner || {};
check("removed member's ratings cleaned, dad's kept", remainingVotes[pizzaId]?.[mom] === undefined && remainingVotes[pizzaId]?.[dad] === 2);
r = await api(`/${code}/members/${dad}`, { method: 'DELETE' });
check('last member protected', r.status === 400);

console.log('10) delete family');
r = await api(`/${code}`, { method: 'DELETE', body: { confirm: code } });
check('deleted with code confirm', r.status === 200);
r = await api(`/${code}`);
check('family gone', r.status === 404);

console.log(`\n${passed} passed, ${failed} failed`);
process.exit(failed ? 1 : 0);
