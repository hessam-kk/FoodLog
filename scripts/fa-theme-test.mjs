/* Persian (RTL) + theme tests: FA onboarding → week view → rating → stats; theme override. */
import { chromium } from 'playwright-core';
import { mkdirSync } from 'node:fs';

mkdirSync('gui-test-screenshots', { recursive: true });
const browser = await chromium.launch({ channel: 'chrome', headless: true });

let failures = 0;
const check = (name, cond, extra = '') => {
  console.log(`${cond ? '  ✓' : '  ✗'} ${name}${cond ? '' : ' ' + extra}`);
  if (!cond) failures++;
};

// ---- Persian flow ----
{
  const page = await browser.newPage({
    viewport: { width: 390, height: 844 },
    locale: 'fa-IR',
  });
  page.setDefaultTimeout(6000);
  await page.addInitScript(() => localStorage.setItem('foodlog.lang', 'fa'));
  try {
    await page.goto('http://127.0.0.1:8787/');
    await page.waitForSelector('.onboard');
    check('fa: dir=rtl on html', await page.evaluate(() => document.documentElement.dir) === 'rtl');
    check('fa: lang=fa', await page.evaluate(() => document.documentElement.lang) === 'fa');
    check('fa: font is Vazirmatn', (await page.evaluate(() => getComputedStyle(document.body).fontFamily)).includes('Vazirmatn'));
    check('fa: font file loaded', await page.evaluate(() => document.fonts.check('16px Vazirmatn')));
    await page.screenshot({ path: 'gui-test-screenshots/fa01_onboarding.png' });
    check('fa: create button translated', (await page.textContent('[data-act="ob-mode"][data-mode="create"]')).includes('ساخت'));

    await page.fill('#ob-family', 'خانواده ناظری');
    await page.fill('#ob-name', 'سارا');
    await page.click('[data-act="ob-create"]');
    await page.waitForSelector('.tabbar');
    await page.waitForTimeout(400);
    check('fa: today pill Persian', (await page.textContent('.day-card.today .today-pill')).includes('امروز'));
    check('fa: Jalali date shown', /[\u06F0-\u06F9]/.test(await page.textContent('.day-card.today .day-date')));

    // log a Persian dinner: کباب برنج
    await page.click('.day-card.today [data-act="open-meal"][data-slot="dinner"]');
    await page.waitForSelector('#suggest-input');
    await page.fill('#suggest-input', 'کباب کوبیده');
    await page.press('#suggest-input', 'Enter');
    await page.fill('#suggest-input', 'برنج');
    await page.press('#suggest-input', 'Enter');
    await page.click('[data-act="save-meal"]');
    await page.waitForTimeout(500);
    const chips = await page.textContent('.day-card.today [data-slot="dinner"]');
    check('fa: Persian chips saved', chips.includes('کباب') && chips.includes('برنج'));
    await page.screenshot({ path: 'gui-test-screenshots/fa02_week.png', fullPage: true });

    // rate the kebab → badge with Persian digits
    await page.click('.day-card.today .food-chip[data-name="کباب کوبیده"]');
    await page.waitForSelector('#sheet .rate-hero');
    await page.click('#sheet [data-act="vote"][data-value="3"]');
    await page.waitForTimeout(500);
    const badge = await page.textContent('.day-card.today .chip-score');
    check('fa: badge uses Persian digits', /[۳]/.test(badge), badge.trim());
    await page.screenshot({ path: 'gui-test-screenshots/fa03_rate_sheet.png' });
    await page.click('[data-act="sheet-close"]');
    await page.waitForTimeout(300);

    // stats in Persian
    await page.click('[data-act="tab"][data-tab="stats"]');
    await page.waitForTimeout(400);
    const favTitle = await page.textContent('.card-title');
    check('fa: stats translated', (await page.locator('.card-title').allTextContents()).some((x) => x.includes('غذاهای محبوب')));
    await page.screenshot({ path: 'gui-test-screenshots/fa04_stats.png', fullPage: true });

    // switch language via topbar → back to EN
    await page.click('[data-act="toggle-lang"]');
    await page.waitForTimeout(300);
    check('fa→en: dir flips to ltr', await page.evaluate(() => document.documentElement.dir) === 'ltr');
    check('fa→en: stats title English', (await page.locator('.card-title').allTextContents()).some((x) => x.includes('Favorite foods')));
    await page.click('[data-act="toggle-lang"]');
    await page.waitForTimeout(300);
  } catch (e) {
    console.error('fa flow failed:', e.message);
    failures++;
  } finally {
    await page.close();
  }
}

// ---- Theme override: OS dark + forced light ----
{
  const page = await browser.newPage({
    viewport: { width: 390, height: 844 },
    colorScheme: 'dark',
  });
  page.setDefaultTimeout(6000);
  try {
    await page.goto('http://127.0.0.1:8787/');
    await page.waitForSelector('.onboard');
    check('theme: follows OS dark by default', await page.evaluate(() => document.documentElement.dataset.theme) === 'dark');
    await page.screenshot({ path: 'gui-test-screenshots/th01_dark_auto.png' });

    // force light through Settings → but onboarding has no settings; set storage + reload
    await page.evaluate(() => localStorage.setItem('foodlog.theme', 'light'));
    await page.reload();
    await page.waitForSelector('.onboard');
    check('theme: forced light wins over OS dark', await page.evaluate(() => document.documentElement.dataset.theme) === 'light');
    const bg = await page.evaluate(() => getComputedStyle(document.body).backgroundColor);
    check('theme: light background applied', bg === 'rgb(247, 242, 234)', bg);
    await page.screenshot({ path: 'gui-test-screenshots/th02_forced_light.png' });

    // toggle to dark via UI: create family, open Family tab, press تیره/Dark
    await page.fill('#ob-family', 'Theme Fam');
    await page.fill('#ob-name', 'Sara');
    await page.click('[data-act="ob-create"]');
    await page.waitForSelector('.tabbar');
    await page.click('[data-act="tab"][data-tab="family"]');
    await page.waitForTimeout(300);
    await page.click('[data-act="set-theme"][data-theme="dark"]');
    await page.waitForTimeout(300);
    check('theme: dark via settings', await page.evaluate(() => document.documentElement.dataset.theme) === 'dark');
    await page.screenshot({ path: 'gui-test-screenshots/th03_settings_dark.png' });
  } catch (e) {
    console.error('theme flow failed:', e.message);
    failures++;
  } finally {
    await page.close();
  }
}

await browser.close();
console.log(failures ? `FA/THEME TESTS: ${failures} FAILED` : 'FA/THEME TESTS: ALL PASS');
process.exit(failures ? 1 : 0);
