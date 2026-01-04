/* Verify per-food stats render correct numbers: favorites card, badges, activity. */
import { chromium } from 'playwright-core';

const browser = await chromium.launch({ channel: 'chrome', headless: true });
const page = await browser.newPage({ viewport: { width: 390, height: 844 } });
page.setDefaultTimeout(6000);
const text = async (sel) => (await page.locator(sel).allTextContents()).map((t) => t.replace(/\s+/g, ' ').trim());

try {
  await page.goto('http://127.0.0.1:8787/');
  await page.waitForSelector('.onboard');
  await page.fill('#ob-family', 'Stats Fam');
  await page.fill('#ob-name', 'Sara');
  await page.click('[data-act="ob-create"]');
  await page.waitForSelector('.tabbar');
  await page.waitForTimeout(300);

  // lunch: pasta. dinner: pizza + kebab
  await page.click('.day-card.today [data-act="open-meal"][data-slot="lunch"]');
  await page.waitForSelector('#suggest-input');
  await page.fill('#suggest-input', 'Pasta');
  await page.press('#suggest-input', 'Enter');
  await page.click('[data-act="save-meal"]');
  await page.waitForTimeout(400);

  await page.click('.day-card.today [data-act="open-meal"][data-slot="dinner"]');
  await page.waitForSelector('#suggest-input');
  await page.fill('#suggest-input', 'Pizza');
  await page.press('#suggest-input', 'Enter');
  await page.fill('#suggest-input', 'Kebab');
  await page.press('#suggest-input', 'Enter');
  await page.click('[data-act="save-meal"]');
  await page.waitForTimeout(400);

  // rate pizza 3, kebab 1, pasta 2
  for (const [name, v] of [['Pizza', '3'], ['Kebab', '1'], ['Pasta', '2']]) {
    await page.click(`.day-card.today .food-chip[data-name="${name}"]`);
    await page.waitForSelector('#sheet .rate-hero');
    await page.click(`#sheet [data-act="vote"][data-value="${v}"]`);
    await page.waitForTimeout(450);
    await page.click('[data-act="sheet-close"]');
    await page.waitForTimeout(250);
  }

  // stats
  await page.click('[data-act="tab"][data-tab="stats"]');
  await page.waitForTimeout(400);

  console.log('rating card:', await text('.stat-card.wide .stat-sub'), '| avg:', await text('.stat-card.wide .stat-value'));
  console.log('favorites:', await text('.card:has(.card-title:text("Favorite foods")) .member-name, .card:has(.card-title:text("Favorite foods")) .chip-score'));
  console.log('top foods rows:', await text('.bar-row .bar-name, .bar-row .chip-score'));
  console.log('best dinner:', await text('.best-card-date, .card:has(.best-card-date) .member-stats'));
  console.log('activity:', await text('.card:has(.card-title:text("Family activity")) .member-stats'));
  console.log('trend values:', await text('.trend-val'));
} catch (e) {
  console.error('stats check failed:', e.message);
  process.exitCode = 1;
} finally {
  await browser.close();
}
