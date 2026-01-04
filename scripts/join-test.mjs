/* Second-user join flow: invite link → who sheet → add yourself → vote on existing dinner. */
import { chromium } from 'playwright-core';

const browser = await chromium.launch({ channel: 'chrome', headless: true });
try {
  // First user creates a family with a dinner.
  const p1 = await browser.newPage({ viewport: { width: 390, height: 844 } });
  p1.setDefaultTimeout(5000);
  await p1.goto('http://127.0.0.1:8787/');
  await p1.waitForSelector('.onboard');
  await p1.fill('#ob-family', 'Share Fam');
  await p1.fill('#ob-name', 'Sara');
  await p1.click('[data-act="ob-create"]');
  await p1.waitForSelector('.tabbar');
  await p1.click('.day-card.today [data-act="open-meal"][data-slot="dinner"]');
  await p1.waitForSelector('#suggest-input');
  await p1.fill('#suggest-input', 'Pizza');
  await p1.press('#suggest-input', 'Enter');
  await p1.click('[data-act="save-meal"]');
  await p1.waitForTimeout(500);
  // Sara rates her dinner pizza 😋 (3) before sharing the code.
  await p1.click('.day-card.today [data-slot="dinner"] .food-chip');
  await p1.waitForSelector('#sheet .rate-hero');
  await p1.click('#sheet [data-act="vote"][data-value="3"]');
  await p1.waitForTimeout(500);
  await p1.click('[data-act="sheet-close"]');
  await p1.waitForTimeout(300);
  const code = await p1.locator('.code-chars').first().textContent().then((t) => t.trim()).catch(() => null);
  if (!code) {
    await p1.click('[data-act="tab"][data-tab="family"]');
    await p1.waitForTimeout(300);
  }
  const familyCode = code || (await p1.locator('.code-chars').textContent()).trim();
  console.log('family code:', familyCode);
  await p1.close();

  // Second user opens the invite link (#CODE) in a fresh context.
  const p2 = await browser.newPage({ viewport: { width: 390, height: 844 } });
  p2.setDefaultTimeout(5000);
  await p2.goto(`http://127.0.0.1:8787/#${familyCode}`);
  await p2.waitForSelector('.tabbar', { timeout: 8000 });
  await p2.waitForTimeout(400);
  const whoShown = await p2.locator('#sheet .suggest-row').count();
  console.log('who-sheet rows visible:', whoShown);

  // "Someone else — add me" → type name → Add me
  await p2.click('[data-act="who-add"]');
  await p2.waitForSelector('#who-name');
  await p2.fill('#who-name', 'Dad');
  await p2.click('[data-act="who-add-save"]');
  await p2.waitForTimeout(600);

  const avatar = await p2.locator('.avatar-btn').textContent();
  console.log('p2 avatar:', avatar.trim());

  // Dad opens the same pizza's rating sheet and votes 😐 (2)
  await p2.click('.day-card.today [data-slot="dinner"] .food-chip');
  await p2.waitForSelector('#sheet .rate-hero');
  await p2.click('#sheet [data-act="vote"][data-value="2"]');
  await p2.waitForTimeout(600);
  const badge = await p2.locator('.day-card.today [data-slot="dinner"] .chip-score').first().textContent();
  const sheetAvg = await p2.locator('#sheet .rate-num').textContent();
  console.log('chip badge after Dad votes 2 (Sara voted 3):', badge.trim(), '| sheet avg:', sheetAvg.trim());

  const ok = avatar.includes('👨') && badge.trim().includes('2.5');
  console.log(ok ? 'JOIN FLOW: PASS' : 'JOIN FLOW: FAIL');
  process.exitCode = ok ? 0 : 1;
} catch (e) {
  console.error('join probe failed:', e.message);
  process.exitCode = 1;
} finally {
  await browser.close();
}
