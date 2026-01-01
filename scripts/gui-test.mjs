/* GUI walkthrough of the FoodLog app at mobile viewport, saving screenshots. */
import { chromium } from 'playwright-core';
import { mkdirSync } from 'node:fs';

const SHOTS = 'gui-test-screenshots';
mkdirSync(SHOTS, { recursive: true });

const browser = await chromium.launch({ channel: 'chrome', headless: true });
const page = await browser.newPage({
  viewport: { width: 390, height: 844 },
  deviceScaleFactor: 2,
});
page.setDefaultTimeout(6000);

const shot = (name, opts) => page.screenshot({ path: `${SHOTS}/${name}.png`, ...opts });
let step = 0;
const snap = async (label, opts) => shot(`t${String(++step).padStart(2, '0')}_${label}`, opts);

try {
  // 1 — onboarding
  await page.goto('http://127.0.0.1:8787/');
  await page.waitForSelector('.onboard');
  await snap('onboarding');

  // 2 — create a family
  await page.fill('#ob-family', 'The Nazaris');
  await page.fill('#ob-name', 'Sara');
  await page.click('[data-act="ob-create"]');
  await page.waitForSelector('.tabbar');
  await page.waitForTimeout(400);
  await snap('week_empty');

  // 3 — log today's lunch (multi-food): open sheet
  await page.click('.day-card.today [data-act="open-meal"][data-slot="lunch"]');
  await page.waitForSelector('#suggest-input');
  await page.waitForTimeout(350);
  await snap('meal_sheet_open');

  // type a new food — "Add as new" row + Enter
  await page.fill('#suggest-input', 'Pizza');
  await page.waitForTimeout(200);
  await page.press('#suggest-input', 'Enter');
  await page.fill('#suggest-input', 'Pasta');
  await page.waitForTimeout(200);
  await page.press('#suggest-input', 'Enter');
  await page.waitForTimeout(200);
  await snap('meal_sheet_two_foods');

  await page.click('[data-act="save-meal"]');
  await page.waitForTimeout(500);
  await snap('week_lunch_logged');

  // 4 — log today's dinner; Pizza should now autocomplete from memory
  await page.click('.day-card.today [data-act="open-meal"][data-slot="dinner"]');
  await page.waitForSelector('#suggest-input');
  await page.fill('#suggest-input', 'piz');
  await page.waitForTimeout(250);
  await snap('dinner_autocomplete');
  await page.press('#suggest-input', 'Enter'); // picks suggested existing Pizza
  await page.fill('#suggest-input', 'Kebab');
  await page.press('#suggest-input', 'Enter');
  await page.click('[data-act="save-meal"]');
  await page.waitForTimeout(500);

  // 5 — rate the dinner food per-food: tap the Pizza chip → rating sheet
  await page.click('.day-card.today [data-slot="dinner"] .food-chip');
  await page.waitForSelector('#sheet .rate-hero');
  await page.waitForTimeout(350);
  await snap('rate_sheet_open');
  await page.click('#sheet [data-act="vote"][data-value="3"]');
  await page.waitForTimeout(500);
  await snap('rate_sheet_voted');
  const badge = await page.locator('.day-card.today [data-slot="dinner"] .chip-score').first().textContent().catch(() => null);
  console.log('chip score badge after vote:', badge && badge.trim());
  await page.click('[data-act="sheet-close"]');
  await page.waitForTimeout(400);
  await snap('week_dinner_voted', { fullPage: true });

  // 6 — log yesterday's meals too (for stats variety)
  const yesterdayRow = page.locator('.day-card:not(.today) [data-act="open-meal"][data-slot="dinner"]').first();
  await yesterdayRow.click();
  await page.waitForSelector('#suggest-input');
  await page.fill('#suggest-input', 'Ghormeh Sabzi');
  await page.press('#suggest-input', 'Enter');
  await page.click('[data-act="save-meal"]');
  await page.waitForTimeout(450);

  // 7 — stats
  await page.click('[data-act="tab"][data-tab="stats"]');
  await page.waitForTimeout(350);
  await snap('stats_week', { fullPage: true });
  await page.click('[data-act="stats-mode"][data-mode="month"]');
  await page.waitForTimeout(300);
  await snap('stats_month');

  // 8 — foods memory
  await page.click('[data-act="tab"][data-tab="foods"]');
  await page.waitForTimeout(300);
  await snap('foods_list');
  await page.fill('#foods-search', 'piz');
  await page.waitForTimeout(250);
  await snap('foods_search');

  // 9 — family tab
  await page.click('[data-act="tab"][data-tab="family"]');
  await page.waitForTimeout(300);
  await snap('family');

  // change a member's avatar emoji
  await page.click('.member-avatar.avatar-edit');
  await page.waitForSelector('.emoji-grid');
  await page.waitForTimeout(350);
  await snap('emoji_sheet');
  await page.click('.emoji-cell[data-emoji="🐼"]');
  await page.waitForTimeout(500);
  const avatarNow = await page.locator('.member-avatar.avatar-edit').first().textContent();
  const topAvatar = await page.locator('.avatar-btn').textContent();
  console.log('member emoji now:', avatarNow.trim(), '| topbar avatar:', topAvatar.trim());

  // 10 — who-am-I sheet
  await page.click('[data-act="who"]');
  await page.waitForTimeout(400);
  await snap('who_sheet');

  console.log('GUI walkthrough complete:', step, 'screenshots in', SHOTS);
} catch (err) {
  await shot('FAILURE').catch(() => {});
  console.error('FAILED at step', step, '—', err.message);
  process.exitCode = 1;
} finally {
  await browser.close();
}
