/* ============================== FoodLog client ============================== */

/* ------------------------------ i18n dictionary ---------------------------- */

const I18N = {
  en: {
    'app.tagline': 'Log your family\'s lunches & dinners, vote on the foods you loved, and remember every meal — without typing the same foods again and again.',
    'app.badge1': '📅 Week view', 'app.badge2': '🗳️ Food votes', 'app.badge3': '📊 Stats', 'app.badge4': '📖 Food memory',
    'app.foot': 'Made for families who love food 🧡',
    'ob.create': 'Create a family', 'ob.join': 'Join with a code',
    'ob.familyName': 'Family name', 'ob.familyName.ph': 'e.g. The Smiths',
    'ob.yourName': 'Your name', 'ob.yourName.ph': 'e.g. Sara',
    'ob.start': 'Start logging 🍽️',
    'ob.code': 'Family code', 'ob.code.ph': 'e.g. K7TM3P', 'ob.find': 'Find my family 🔍',
    'ob.err.name': 'Please enter your name.',
    'ob.err.code': 'Enter the 6-character family code.',
    'err.notFound': 'Family not found — double-check the code.',
    'welcome': 'Welcome, {name}! 🧡',
    'lunch': 'lunch', 'dinner': 'dinner',
    'nav.prev': 'Previous', 'nav.next': 'Next',
    'thisWeek': 'This week', 'weekOf': 'Week of {range}',
    'tapToday': ' · tap for today',
    'today': 'Today',
    'addFood': '＋ Add {slot}',
    'by': 'by {who}',
    'rateHint': 'tap a food to rate it 🗳️',
    'rateAria': 'Rate {v} of 10',
    'sheet.what': 'What did you eat?',
    'sheet.loggedBy': 'logged by {who}',
    'sheet.nothing': 'Nothing yet — pick or type foods below. You can add several!',
    'sheet.searchPh': 'Search or type a new food…',
    'sheet.mostUsed': 'Most used', 'sheet.matches': 'Matches',
    'sheet.addNew': 'Add “{q}” as new',
    'sheet.usedTimes': 'used ×{n}',
    'sheet.noMatches': 'No matches for “{q}”',
    'sheet.noFoodsYet': 'No foods in memory yet — type to add the first one!',
    'sheet.clear': 'Clear',
    'sheet.save': 'Save {slot}',
    'toast.mealSaved': 'Meal saved ✓', 'toast.mealCleared': 'Meal cleared',
    'rate.everyone': 'Everyone\'s vote', 'rate.notYet': '— not yet',
    'rate.none': 'No votes yet — be the first!',
    'rate.slideHint': 'Slide to rate 0–10',
    'rate.clear': 'Clear my vote',
    'rate.votesSoFar': (p) => `${p.n} vote${p.n === 1 ? '' : 's'} so far`,
    'rate.editMeal': '✏️ Edit meal',
    'who.title': 'Who\'s using this phone?',
    'who.sub': 'You can switch anytime by tapping the avatar.',
    'who.current': 'current', 'who.someone': '＋ Someone else — add me',
    'who.namePh': 'Your name…', 'who.addMe': 'Add me',
    'who.errName': 'Please enter a name',
    'who.hi': 'Hi {emoji} {name}!',
    'who.added': 'Added',
    'emoji.title': 'Change avatar',
    'emoji.sub': 'Pick an emoji for {name}',
    'emoji.changed': 'Avatar updated ✓',
    'foods.addPh': 'Add a food to the family memory…',
    'foods.add': 'Add', 'foods.searchPh': '🔍 Search your foods',
    'foods.used': (p) => `used ${p.n} time${p.n === 1 ? '' : 's'}`,
    'foods.empty': 'Your food memory is empty.<br>Foods you log will be remembered here.',
    'foods.noMatch': 'No foods match “{q}”.',
    'foods.toastAdded': '“{name}” added to your food memory 📖',
    'foods.errName': 'Type a food name first',
    'foods.rename': 'Rename', 'foods.delete': 'Delete',
    'foods.renameTitle': 'Rename food',
    'foods.renameLabel': 'Rename “{name}”? Past logs keep their old names.',
    'foods.renamePh': 'New name',
    'foods.toastRemoved': 'Removed from food memory',
    'prompt.cancel': 'Cancel', 'prompt.confirm': 'Confirm',
    'prompt.fillIn': 'Please fill this in.',
    'fam.code': '🔑 Family code',
    'fam.shareHint': 'Share this code so your family can join.',
    'fam.copyCode': 'Copy code', 'fam.copyLink': 'Copy link',
    'fam.codeCopied': 'Code copied! Share it with your family 🧡',
    'fam.linkCopied': 'Invite link copied!',
    'fam.copyFail': 'Copy failed — long-press to copy',
    'fam.members': '👨‍👩‍👧‍👦 Members · {n}',
    'fam.allTime': (p) => `${p.n} meal${p.n === 1 ? '' : 's'} logged all-time`,
    'fam.addMemberPh': 'Add a family member…',
    'fam.toastJoined': '{name} joined the family 👋',
    'fam.errName': 'Enter a name first',
    'fam.toastMemberRemoved': 'Member removed',
    'fam.removeTitle': 'Remove {name}?',
    'fam.removeLabel': 'Their votes will be removed too. Logged meals stay.',
    'fam.remove': 'Remove',
    'fam.settings': '⚙️ Settings',
    'fam.weekStart': 'Week starts on', 'fam.weekStartSub': 'Used by the week view',
    'fam.sat': 'Sat', 'fam.mon': 'Mon',
    'fam.youAre': 'You are',
    'fam.youAreSub': '{who} — tap your avatar to switch',
    'fam.youAreNone': 'Not set — tap your avatar to pick',
    'fam.language': 'Language', 'fam.theme': 'Theme',
    'theme.system': 'System', 'theme.light': 'Light', 'theme.dark': 'Dark',
    'fam.leave': '🚪 Switch to another family',
    'fam.delete': '🗑 Delete this family',
    'fam.delTitle': 'Delete this family?',
    'fam.delLabel': 'This permanently deletes all meals, votes and foods. Type the family code ({code}) to confirm.',
    'fam.delPh': 'Family code', 'fam.delBtn': 'Delete forever',
    'fam.delMismatch': 'That doesn\'t match the family code.',
    'fam.toastDeleted': 'Family deleted',
    'stats.week': 'Week', 'stats.month': 'Month',
    'stats.thisMonth': 'So far this month', 'stats.days': '{n} days',
    'stats.foodRating': 'Food rating',
    'stats.ratingSub': (p) => `${p.votes} food vote${p.votes === 1 ? '' : 's'} across ${p.meals} meal${p.meals === 1 ? '' : 's'}`,
    'stats.noVotes': 'No votes yet — tap a food to rate it',
    'stats.dinners': '🌙 Dinners', 'stats.lunches': '☀️ Lunches',
    'stats.daysSoFar': 'day{pl} so far', 'stats.inRange': 'day{pl} in range',
    'stats.trend': '📈 Food ratings',
    'stats.top': '🏆 Top foods', 'stats.fav': '💛 Favorite foods', 'stats.best': '⭐ Best dinner',
    'stats.activity': '👥 Family activity',
    'stats.emptyMeals': 'No meals logged in this range yet.',
    'stats.emptyVotes': 'No food ratings yet — tap a food in the week view and rate it!',
    'stats.emptyVotesRange': 'No food ratings in this range yet.',
    'stats.favSub': (p) => `${p.votes} vote${p.votes === 1 ? '' : 's'} · served ${p.count}×`,
    'stats.bestSub': '{face} {avg} average · {votes}',
    'stats.votes': (p) => `${p.n} vote${p.n === 1 ? '' : 's'}`,
    'stats.activityLine': (p) => `logged ${p.logs} meal${p.logs === 1 ? '' : 's'} · ${p.votes} vote${p.votes === 1 ? '' : 's'} · gives ${p.avg}★`,
    'stats.suggest': '💡 Suggestions',
    'stats.lovedTitle': '💛 Most loved',
    'stats.staleTitle': '🕰️ Not eaten recently',
    'stats.daysAgo': (p) => `${p.n} day${p.n === 1 ? '' : 's'} ago`,
    'stats.yesterday': 'yesterday',
    'stats.neverLogged': 'never logged',
    'stats.noLoved': 'No ratings yet — rate some foods!',
    'stats.allFresh': 'Everything else was eaten in the last 2 weeks 🎉',
    'aria.refresh': 'Refresh', 'aria.who': 'Who am I', 'aria.lang': 'Language', 'aria.remove': 'Remove',
    'toast.updated': 'Updated ✓',
    'boot': 'Setting the table…',
    'err.prefix': '⚠️ ',
  },
  fa: {
    'app.tagline': 'ناهار و شام خانواده را ثبت کنید، به غذاهای موردعلاقه‌تان امتیاز بدهید و هیچ غذایی را دوباره تایپ نکنید.',
    'app.badge1': '📅 نمای هفته', 'app.badge2': '🗳️ رأی به غذاها', 'app.badge3': '📊 آمار', 'app.badge4': '📖 حافظه غذاها',
    'app.foot': 'ساخته شده برای خانواده‌های اهل غذا 🧡',
    'ob.create': 'ساخت خانواده', 'ob.join': 'ورود با کد',
    'ob.familyName': 'نام خانواده', 'ob.familyName.ph': 'مثلاً خانواده ناظری',
    'ob.yourName': 'اسم شما', 'ob.yourName.ph': 'مثلاً سارا',
    'ob.start': 'شروع ثبت غذا 🍽️',
    'ob.code': 'کد خانواده', 'ob.code.ph': 'مثلاً K7TM3P', 'ob.find': 'پیدا کردن خانواده 🔍',
    'ob.err.name': 'لطفاً اسمتان را بنویسید.',
    'ob.err.code': 'کد ۶ کاراکتری خانواده را وارد کنید.',
    'err.notFound': 'خانواده پیدا نشد — کد را دوباره چک کنید.',
    'welcome': 'خوش آمدی، {name}! 🧡',
    'lunch': 'ناهار', 'dinner': 'شام',
    'nav.prev': 'قبلی', 'nav.next': 'بعدی',
    'thisWeek': 'این هفته', 'weekOf': 'هفتهٔ {range}',
    'tapToday': ' · برای امروز بزنید',
    'today': 'امروز',
    'addFood': '＋ افزودن {slot}',
    'by': 'ثبت توسط {who}',
    'rateHint': 'برای امتیاز دادن، روی یک غذا بزنید 🗳️',
    'rateAria': 'امتیاز {v} از ۱۰',
    'sheet.what': 'چه چیزی خوردید؟',
    'sheet.loggedBy': 'ثبت شده توسط {who}',
    'sheet.nothing': 'هنوز چیزی نیست — از پایین انتخاب یا تایپ کنید. می‌توانید چند غذا اضافه کنید!',
    'sheet.searchPh': 'جستجوی غذا یا تایپ غذای جدید…',
    'sheet.mostUsed': 'پرتکرارها', 'sheet.matches': 'نتایج',
    'sheet.addNew': 'افزودن «{q}» به‌عنوان غذای جدید',
    'sheet.usedTimes': '×{n} بار',
    'sheet.noMatches': 'نتیجه‌ای برای «{q}» پیدا نشد',
    'sheet.noFoodsYet': 'هنوز غذایی ثبت نشده — اولین را تایپ کنید!',
    'sheet.clear': 'پاک کردن',
    'sheet.save': 'ثبت {slot}',
    'toast.mealSaved': 'غذا ثبت شد ✓', 'toast.mealCleared': 'وعده پاک شد',
    'rate.everyone': 'رأی همه', 'rate.notYet': '— هنوز',
    'rate.none': 'هنوز رأیی نیست — اولین باشید!',
    'rate.slideHint': 'برای امتیاز ۰ تا ۱۰ بکشید',
    'rate.clear': 'حذف رأی من',
    'rate.votesSoFar': (p) => `تا حالا ${num(p.n)} رأی`,
    'rate.editMeal': '✏️ ویرایش وعده',
    'who.title': 'این گوشی مال کیست؟',
    'who.sub': 'هر وقت خواستید با زدن آواتار عوضش کنید.',
    'who.current': 'فعلی', 'who.someone': '＋ کس دیگری هستم — اضافه کنید',
    'who.namePh': 'اسمتان…', 'who.addMe': 'اضافهم کن',
    'who.errName': 'لطفاً یک اسم بنویسید',
    'who.hi': 'سلام {emoji} {name}!',
    'who.added': 'اضافه شد',
    'emoji.title': 'تغییر آواتار',
    'emoji.sub': 'یک ایموجی برای {name} انتخاب کنید',
    'emoji.changed': 'آواتار عوض شد ✓',
    'foods.addPh': 'افزودن غذا به حافظه خانواده…',
    'foods.add': 'افزودن', 'foods.searchPh': '🔍 جستجوی غذاها',
    'foods.used': (p) => `${num(p.n)} بار استفاده شده`,
    'foods.empty': 'حافظه غذاهای شما خالی است.<br>غذاهایی که ثبت کنید اینجا می‌مانند.',
    'foods.noMatch': 'غذایی با «{q}» پیدا نشد.',
    'foods.toastAdded': '«{name}» به حافظه غذاها اضافه شد 📖',
    'foods.errName': 'اول نام یک غذا را بنویسید',
    'foods.rename': 'تغییر نام', 'foods.delete': 'حذف',
    'foods.renameTitle': 'تغییر نام غذا',
    'foods.renameLabel': 'نام «{name}» عوض شود؟ ثبت‌های قبلی با نام قدیمی می‌مانند.',
    'foods.renamePh': 'نام جدید',
    'foods.toastRemoved': 'از حافظه غذاها حذف شد',
    'prompt.cancel': 'لغو', 'prompt.confirm': 'تایید',
    'prompt.fillIn': 'این قسمت را پر کنید.',
    'fam.code': '🔑 کد خانواده',
    'fam.shareHint': 'این کد را با خانواده به اشتراک بگذارید.',
    'fam.copyCode': 'کپی کد', 'fam.copyLink': 'کپی لینک',
    'fam.codeCopied': 'کد کپی شد! برای خانواده بفرستید 🧡',
    'fam.linkCopied': 'لینک دعوت کپی شد!',
    'fam.copyFail': 'کپی نشد — دستی کپی کنید',
    'fam.members': '👨‍👩‍👧‍👦 اعضا · {n}',
    'fam.allTime': (p) => `${num(p.n)} وعده ثبت‌شده از همیشه`,
    'fam.addMemberPh': 'افزودن عضو خانواده…',
    'fam.toastJoined': '{name} به خانواده اضافه شد 👋',
    'fam.errName': 'اول یک اسم بنویسید',
    'fam.toastMemberRemoved': 'عضو حذف شد',
    'fam.removeTitle': '{name} حذف شود؟',
    'fam.removeLabel': 'رأی‌هایش هم حذف می‌شود. وعده‌های ثبت‌شده می‌مانند.',
    'fam.remove': 'حذف',
    'fam.settings': '⚙️ تنظیمات',
    'fam.weekStart': 'شروع هفته از', 'fam.weekStartSub': 'استفاده شده در نمای هفته',
    'fam.sat': 'شنبه', 'fam.mon': 'دوشنبه',
    'fam.youAre': 'شما هستید',
    'fam.youAreSub': '{who} — برای تغییر، آواتار را بزنید',
    'fam.youAreNone': 'تنظیم نشده — برای انتخاب، آواتار را بزنید',
    'fam.language': 'زبان', 'fam.theme': 'تم',
    'theme.system': 'سیستم', 'theme.light': 'روشن', 'theme.dark': 'تیره',
    'fam.leave': '🚪 رفتن به خانواده دیگر',
    'fam.delete': '🗑 حذف این خانواده',
    'fam.delTitle': 'این خانواده حذف شود؟',
    'fam.delLabel': 'همه وعده‌ها، رأی‌ها و غذاها برای همیشه حذف می‌شوند. برای تایید، کد خانواده ({code}) را تایپ کنید.',
    'fam.delPh': 'کد خانواده', 'fam.delBtn': 'حذف برای همیشه',
    'fam.delMismatch': 'با کد خانواده یکسان نیست.',
    'fam.toastDeleted': 'خانواده حذف شد',
    'stats.week': 'هفته', 'stats.month': 'ماه',
    'stats.thisMonth': 'تا امروزِ این ماه', 'stats.days': '{n} روز',
    'stats.foodRating': 'امتیاز غذاها',
    'stats.ratingSub': (p) => `${num(p.votes)} رأی در ${num(p.meals)} وعده`,
    'stats.noVotes': 'هنوز رأیی نیست — روی یک غذا بزنید و امتیاز بدهید',
    'stats.dinners': '🌙 شام‌ها', 'stats.lunches': '☀️ ناهارها',
    'stats.daysSoFar': 'روز (تا امروز)', 'stats.inRange': 'روز در این بازه',
    'stats.trend': '📈 امتیاز غذاها',
    'stats.top': '🏆 غذاهای پرتکرار', 'stats.fav': '💛 غذاهای محبوب', 'stats.best': '⭐ بهترین شام',
    'stats.activity': '👥 فعالیت خانواده',
    'stats.emptyMeals': 'هنوز وعده‌ای در این بازه ثبت نشده.',
    'stats.emptyVotes': 'هنوز امتیازی ثبت نشده — در نمای هفته روی غذا بزنید!',
    'stats.emptyVotesRange': 'هنوز امتیازی در این بازه ثبت نشده.',
    'stats.favSub': (p) => `${num(p.votes)} رأی · ${num(p.count)} بار پخته شده`,
    'stats.bestSub': '{face} میانگین {avg} · {votes}',
    'stats.votes': (p) => `${num(p.n)} رأی`,
    'stats.activityLine': (p) => `${num(p.logs)} وعده ثبت · ${num(p.votes)} رأی · میانگین ${p.avg}★`,
    'stats.suggest': '💡 پیشنهاد غذا',
    'stats.lovedTitle': '💛 محبوب‌ترین‌ها',
    'stats.staleTitle': '🕰️ مدت‌هاست نخورده‌اید',
    'stats.daysAgo': (p) => `${num(p.n)} روز پیش`,
    'stats.yesterday': 'دیروز',
    'stats.neverLogged': 'تا حالا پخته نشده',
    'stats.noLoved': 'هنوز امتیازی نیست — به غذاها امتیاز بدهید!',
    'stats.allFresh': 'بقیه را این دو هفته اخیر خورده‌اید 🎉',
    'aria.refresh': 'به‌روزرسانی', 'aria.who': 'من کیستم', 'aria.lang': 'زبان', 'aria.remove': 'حذف',
    'toast.updated': 'به‌روز شد ✓',
    'boot': 'چیدن میز…',
    'err.prefix': '⚠️ ',
  },
};

let lang = localStorage.getItem('foodlog.lang') || ((navigator.language || '').toLowerCase().startsWith('fa') ? 'fa' : 'en');
let theme = localStorage.getItem('foodlog.theme') || 'system';

function t(key, params = {}) {
  const val = (I18N[lang] && I18N[lang][key]) ?? I18N.en[key] ?? key;
  if (typeof val === 'function') return val(params);
  return val.replace(/\{(\w+)\}/g, (_, k) => params[k] ?? '');
}

function num(n) {
  return lang === 'fa' ? Number(n).toLocaleString('fa-IR') : String(n);
}

function fmt1(x) {
  if (x == null) return lang === 'fa' ? '—' : '—';
  return lang === 'fa'
    ? new Intl.NumberFormat('fa-IR', { minimumFractionDigits: 1, maximumFractionDigits: 1 }).format(x)
    : (Math.round(x * 10) / 10).toFixed(1);
}

let FMT = {};
function makeFormatters() {
  const loc = lang === 'fa' ? 'fa-IR' : undefined;
  FMT = {
    shortDate: new Intl.DateTimeFormat(loc, { month: 'short', day: 'numeric' }),
    dayNum: new Intl.DateTimeFormat(loc, { day: 'numeric' }),
    dowShort: new Intl.DateTimeFormat(loc, { weekday: 'short' }),
    dowLong: new Intl.DateTimeFormat(loc, { weekday: 'long' }),
    dowNarrow: new Intl.DateTimeFormat(loc, { weekday: 'narrow' }),
    monthYear: new Intl.DateTimeFormat(loc, { month: 'long', year: 'numeric' }),
    time: new Intl.DateTimeFormat(loc, { hour: 'numeric', minute: '2-digit' }),
  };
}

function applyLocale() {
  document.documentElement.lang = lang;
  document.documentElement.dir = lang === 'fa' ? 'rtl' : 'ltr';
  document.title = lang === 'fa' ? 'فودلاگ · غذاهای خانواده' : 'FoodLog · Family meals';
  makeFormatters();
}

const darkQuery = matchMedia('(prefers-color-scheme: dark)');
function applyTheme() {
  const dark = theme === 'dark' || (theme === 'system' && darkQuery.matches);
  document.documentElement.dataset.theme = dark ? 'dark' : 'light';
  document.getElementById('meta-theme')?.setAttribute('content', dark ? '#161110' : '#f7f2ea');
}
darkQuery.addEventListener?.('change', () => { if (theme === 'system') applyTheme(); });

function setLang(next) {
  lang = next;
  localStorage.setItem('foodlog.lang', lang);
  applyLocale();
  render();
}

function setTheme(next) {
  theme = next;
  localStorage.setItem('foodlog.theme', theme);
  applyTheme();
  renderPage();
}

applyLocale();
applyTheme();

/* -------------------------------- helpers --------------------------------- */

const $app = () => document.getElementById('app');

function esc(value) {
  return String(value ?? '').replace(/[&<>"']/g, (c) => ({
    '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;',
  })[c]);
}

function parseDate(s) {
  const [y, m, d] = s.split('-').map(Number);
  return new Date(y, m - 1, d);
}

function toStr(d) {
  return `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, '0')}-${String(d.getDate()).padStart(2, '0')}`;
}

function todayStr() {
  return toStr(new Date());
}

function addDays(s, n) {
  const d = parseDate(s);
  d.setDate(d.getDate() + n);
  return toStr(d);
}

function shiftMonth(anchor, delta) {
  const [y, m] = anchor.split('-').map(Number);
  const d = new Date(y, m - 1 + delta, 1);
  return `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, '0')}-01`;
}

function weekDates(anchor) {
  const d = parseDate(anchor);
  const day = d.getDay(); // 0 = Sun … 6 = Sat
  const back = family && family.weekStart === 'sat' ? (day + 1) % 7 : (day + 6) % 7;
  const start = addDays(anchor, -back);
  return Array.from({ length: 7 }, (_, i) => addDays(start, i));
}

function monthDates(anchor) {
  const [y, m] = anchor.split('-').map(Number);
  const last = new Date(y, m, 0).getDate();
  return Array.from({ length: last }, (_, i) => `${anchor.slice(0, 8)}${String(i + 1).padStart(2, '0')}`);
}

// Scores are on a 0–10 scale. Faces map proportionally to the old 1–3 buckets:
// 0–2.5 😞 (old 1), 2.5–7.5 😐 (old 2), 7.5+ 😋 (old 3).
function voteFace(avg) {
  return avg >= 7.5 ? '😋' : avg >= 2.5 ? '😐' : '😞';
}

// Finer 5-step face scale used by the rating slider.
const SLIDER_FACES = ['😞', '😟', '😐', '🙂', '😋'];
function sliderFace(v) {
  return SLIDER_FACES[Math.max(0, Math.min(4, Math.floor(v / 2)))];
}

// Continuous 0→10 tint (bad → mid → good theme colors) via CSS color-mix,
// so close averages like 5.5 vs 5.8 stay visually distinguishable.
function scoreGrad(avg) {
  if (avg == null) return '';
  const x = Math.max(0, Math.min(10, avg));
  const [a, b] = x < 5 ? ['--bad', '--mid'] : ['--mid', '--good'];
  const p = Math.round(Math.max(0, Math.min(100, ((x - (x < 5 ? 0 : 5)) / 5) * 100)));
  return `--ca:var(${a});--cb:var(${b});--cp:${p}%`;
}

const EMOJI_CHOICES = [
  '👩', '👨', '🧑', '👵', '👴', '👦',
  '👧', '🧒', '👶', '🧔', '👸', '🤴',
  '🕵️', '💁', '🧜', '🧚', '🦸', '🦹',
  '🤠', '👨‍🍳', '👩‍🍳', '🥷', '🧙', '🤵',
  '🦊', '🐻', '🐱', '🐶', '🐼', '🦁',
  '🐨', '🐯', '🐵', '🐸', '🐙', '🦄',
  '🐢', '🦉', '🐝', '🦋', '🐳', '🦜',
];

const FOOD_EMOJI = [
  ['pizza', '🍕'], ['pasta', '🍝'], ['spaghetti', '🍝'], ['macaroni', '🍝'], ['lasagna', '🍝'],
  ['noodle', '🍜'], ['ramen', '🍜'], ['pho', '🍜'], ['sushi', '🍣'], ['kebab', '🥙'],
  ['kabab', '🥙'], ['kabob', '🥙'], ['joojeh', '🍗'], ['gyros', '🥙'], ['wrap', '🌯'],
  ['burrito', '🌯'], ['taco', '🌮'], ['burger', '🍔'], ['sandwich', '🥪'], ['panini', '🥪'],
  ['chicken', '🍗'], ['turkey', '🍗'], ['steak', '🥩'], ['fish', '🐟'], ['salmon', '🐟'],
  ['shrimp', '🦐'], ['prawn', '🦐'], ['crab', '🦀'], ['meatball', '🍖'], ['lamb', '🍖'],
  ['pork', '🍖'], ['beef', '🥩'], ['ghormeh', '🍲'], ['khoresh', '🍲'], ['soup', '🍲'],
  ['stew', '🥘'], ['curry', '🍛'], ['rice', '🍚'], ['pilaf', '🍚'], ['polo', '🍚'],
  ['dumpling', '🥟'], ['pancake', '🥞'], ['waffle', '🧇'], ['porridge', '🥣'],
  ['oat', '🥣'], ['cereal', '🥣'], ['egg', '🍳'], ['omelette', '🍳'], ['omelet', '🍳'],
  ['salad', '🥗'], ['caesar', '🥗'], ['fattoush', '🥗'], ['bread', '🍞'], ['cheese', '🧀'],
  ['potato', '🥔'], ['mash', '🥔'], ['fries', '🍟'], ['lentil', '🫘'], ['bean', '🫘'],
  ['mushroom', '🍄'], ['broccoli', '🥦'], ['spinach', '🥬'], ['yogurt', '🥛'],
  ['apple', '🍎'], ['banana', '🍌'], ['orange', '🍊'], ['grape', '🍇'], ['berry', '🫐'],
  ['fruit', '🍎'], ['toast', '🍞'], ['bagel', '🥯'], ['croissant', '🥐'],
  // Persian keywords
  ['پیتزا', '🍕'], ['پاستا', '🍝'], ['ماکارونی', '🍝'], ['لازانیا', '🍝'], ['نودل', '🍜'],
  ['رامن', '🍜'], ['سوشی', '🍣'], ['کباب', '🥙'], ['جوجه', '🍗'], ['مرغ', '🍗'],
  ['استیک', '🥩'], ['ماهی', '🐟'], ['میگو', '🦐'], ['خورش', '🍲'], ['قرمه', '🍲'],
  ['سوپ', '🍲'], ['خوراک', '🥘'], ['برنج', '🍚'], ['پلو', '🍚'], ['دلمه', '🥟'],
  ['املت', '🍳'], ['تخم', '🍳'], ['سالاد', '🥗'], ['نان', '🍞'], ['پنیر', '🧀'],
  ['عدس', '🫘'], ['لوبیا', '🫘'], ['ماست', '🥛'], ['سیبزمینی', '🥔'], ['سیب زمینی', '🥔'],
];

function foodEmoji(name) {
  const n = String(name || '').toLowerCase();
  for (const [kw, emoji] of FOOD_EMOJI) {
    if (n.includes(kw)) return emoji;
  }
  return '🍽️';
}

/* --------------------------------- state ---------------------------------- */

const LS_CODE = 'foodlog.code';
const LS_ME = 'foodlog.me';

let family = null;
let meId = localStorage.getItem(LS_ME) || null;
let tab = 'week';
let nav = { week: todayStr(), stats: todayStr() };
let statsMode = 'week';
let foodsQuery = '';
let sheet = null;
let onboarding = { mode: 'create', prefill: '', error: '' };
let lastFetch = 0;

function me() {
  return (family && meId && family.members.find((m) => m.id === meId)) || null;
}

function memberById(id) {
  return (family && family.members.find((m) => m.id === id)) || { id, name: '—', emoji: '👤', color: '#a2937f' };
}

/* ---------------------------------- api ----------------------------------- */

async function api(path, { method = 'GET', body } = {}) {
  const res = await fetch('/api/families' + path, {
    method,
    headers: body !== undefined ? { 'content-type': 'application/json' } : undefined,
    body: body !== undefined ? JSON.stringify(body) : undefined,
  });
  let data = null;
  try { data = await res.json(); } catch { /* non-JSON error */ }
  if (!res.ok) {
    throw Object.assign(new Error((data && data.error) || `Request failed (${res.status})`), { status: res.status });
  }
  return data;
}

async function loadFamily(silent = false) {
  const code = localStorage.getItem(LS_CODE);
  if (!code) { family = null; render(); return; }
  family = await api('/' + code);
  lastFetch = Date.now();
  if (meId && !family.members.some((m) => m.id === meId)) meId = null;
  if (!silent) render();
  return family;
}

// Optimistic mutation: apply locally, then replace with the authoritative
// document the server returns. On failure, roll back by refetching.
// Resolves to true when the mutation reached the server.
async function mutate(path, method, body, optimisticFn) {
  let snapshot = family;
  if (optimisticFn) {
    try {
      family = optimisticFn(structuredClone(family));
      render();
    } catch { family = snapshot; }
  }
  try {
    family = await api(`/${family.id}${path}`, { method, body });
    lastFetch = Date.now();
    render();
    return true;
  } catch (err) {
    toast(t('err.prefix') + err.message);
    try { family = await api('/' + snapshot.id); render(); } catch { family = snapshot; render(); }
    return false;
  }
}

/* ------------------------------ week rendering ---------------------------- */

function rangeNavHtml(title, sub, prevAct, nextAct, tapToToday) {
  const mainAttrs = tapToToday ? ' data-act="go-today"' : '';
  return `
    <div class="card range-nav">
      <button class="nav-arrow" data-act="${prevAct}" aria-label="${t('nav.prev')}">‹</button>
      <div class="range-main"${mainAttrs} style="${tapToToday ? 'cursor:pointer' : ''}">
        <div class="range-title">${title}</div>
        <div class="range-sub">${sub}${tapToToday ? t('tapToday') : ''}</div>
      </div>
      <button class="nav-arrow" data-act="${nextAct}" aria-label="${t('nav.next')}">›</button>
    </div>`;
}

function weekRangeHtml() {
  const dates = weekDates(nav.week);
  const today = todayStr();
  const isCurrent = dates.includes(today);
  const range = `${FMT.shortDate.format(parseDate(dates[0]))} – ${FMT.shortDate.format(parseDate(dates[6]))}`;
  const title = isCurrent ? t('thisWeek') : t('weekOf', { range });
  return rangeNavHtml(title, range, 'prev-week', 'next-week', !isCurrent);
}

function foodVotesFor(date, slot, foodId) {
  return ((family.foodVotes || {})[date] || {})[slot] && family.foodVotes[date][slot][foodId] || {};
}

function scoreBadge(avg) {
  const cls = avg >= 2.5 ? 'f3' : avg >= 1.5 ? 'f2' : 'f1'; // fallback when color-mix unsupported
  return `<span class="chip-score grad ${cls}" style="${scoreGrad(avg)}">${voteFace(avg)} ${fmt1(avg)}</span>`;
}

// Chips for one meal's items. Interactive chips (week view) open the rating
// sheet; static ones (stats) just show the score badge.
function mealItemsHtml(date, slot, meal, interactive = true) {
  const items = (meal && meal.items) || [];
  if (!items.length) return `<button class="add-chip">${t('addFood', { slot: t(slot) })}</button>`;
  return items.map((it) => {
    const vals = Object.values(foodVotesFor(date, slot, it.id));
    const avg = vals.length ? vals.reduce((a, b) => a + b, 0) / vals.length : null;
    const score = avg != null ? scoreBadge(avg) : '';
    const inner = `<span class="chip-emoji">${foodEmoji(it.name)}</span><span class="chip-name">${esc(it.name)}</span>${score}`;
    if (interactive) {
      return `<button class="food-chip ${slot}" data-act="rate-food" data-date="${date}" data-slot="${slot}" data-food="${esc(it.id)}" data-name="${esc(it.name)}">${inner}</button>`;
    }
    return `<span class="food-chip ${slot}">${inner}</span>`;
  }).join('');
}

function mealRowHtml(date, slot) {
  const meal = (family.meals[date] || {})[slot];
  const by = meal && meal.by ? memberById(meal.by) : null;
  const anyRating = (meal && meal.items || []).some((it) => Object.keys(foodVotesFor(date, slot, it.id)).length > 0);
  const hint = meal && !anyRating
    ? `<div class="meal-by">${t('rateHint')}</div>`
    : '';
  return `
    <div class="meal-row" data-act="open-meal" data-date="${date}" data-slot="${slot}">
      <div class="meal-tag ${slot}">
        <span class="tag-icon">${slot === 'lunch' ? '☀️' : '🌙'}</span>
        <span>${t(slot)}</span>
      </div>
      <div class="meal-body">
        <div class="meal-items">${mealItemsHtml(date, slot, meal)}</div>
        ${by ? `<div class="meal-by">${t('by', { who: `${by.emoji} ${esc(by.name)}` })}</div>` : ''}
        ${hint}
      </div>
    </div>`;
}

function dayCardHtml(date) {
  const m = family.meals[date] || {};
  const isToday = date === todayStr();
  return `
    <div class="day-card card ${isToday ? 'today' : ''}">
      <div class="day-head">
        <span class="day-dow">${FMT.dowShort.format(parseDate(date))}</span>
        <span class="day-date">${FMT.shortDate.format(parseDate(date))}</span>
        ${isToday ? `<span class="today-pill">${t('today')}</span>` : ''}
      </div>
      ${mealRowHtml(date, 'lunch')}
      ${mealRowHtml(date, 'dinner')}
    </div>`;
}

function viewWeek() {
  const dates = weekDates(nav.week);
  return `
    ${weekRangeHtml()}
    <div style="display:flex;flex-direction:column;gap:12px">
      ${dates.map(dayCardHtml).join('')}
    </div>`;
}

/* ----------------------------- stats rendering ---------------------------- */

function statsFor(dates) {
  const stats = {
    lunches: 0, dinners: 0,
    voteSum: 0, voteCount: 0,
    foodStats: new Map(),
    memberLogs: new Map(), memberVotes: new Map(), memberVoteSum: new Map(),
    best: null,
  };
  for (const m of family.members) {
    stats.memberLogs.set(m.id, 0);
    stats.memberVotes.set(m.id, 0);
    stats.memberVoteSum.set(m.id, 0);
  }
  for (const date of dates) {
    const m = family.meals[date] || {};
    for (const slot of ['lunch', 'dinner']) {
      const meal = m[slot];
      if (!meal) continue;
      if (slot === 'lunch') stats.lunches++;
      else stats.dinners++;
      if (meal.by && stats.memberLogs.has(meal.by)) {
        stats.memberLogs.set(meal.by, stats.memberLogs.get(meal.by) + 1);
      }
      for (const it of meal.items || []) {
        const key = it.name.toLowerCase();
        const cur = stats.foodStats.get(key) || { name: it.name, count: 0, voteSum: 0, voteCount: 0 };
        cur.count++;
        for (const [mid, val] of Object.entries(foodVotesFor(date, slot, it.id))) {
          cur.voteSum += val;
          cur.voteCount++;
          stats.voteSum += val;
          stats.voteCount++;
          if (stats.memberVotes.has(mid)) {
            stats.memberVotes.set(mid, stats.memberVotes.get(mid) + 1);
            stats.memberVoteSum.set(mid, stats.memberVoteSum.get(mid) + val);
          }
        }
        stats.foodStats.set(key, cur);
      }
    }
    // Best dinner = dinner with the highest average across its food ratings.
    if (m.dinner) {
      let sum = 0, count = 0;
      for (const it of m.dinner.items || []) {
        const vals = Object.values(foodVotesFor(date, 'dinner', it.id));
        sum += vals.reduce((a, b) => a + b, 0);
        count += vals.length;
      }
      if (count && (!stats.best || sum / count > stats.best.avg)) {
        stats.best = { date, items: m.dinner.items, avg: sum / count, count };
      }
    }
  }
  stats.avg = stats.voteCount ? stats.voteSum / stats.voteCount : null;
  const foods = [...stats.foodStats.values()];
  stats.topFoods = foods
    .slice()
    .sort((a, b) => b.count - a.count || a.name.localeCompare(b.name))
    .slice(0, 6);
  const rated = foods
    .filter((f) => f.voteCount > 0)
    .sort((a, b) => (b.voteSum / b.voteCount) - (a.voteSum / a.voteCount) || b.voteCount - a.voteCount);
  const strong = rated.filter((f) => f.voteCount >= 2);
  stats.favorites = (strong.length ? strong : rated).slice(0, 5);
  return stats;
}

function dayRating(date) {
  let sum = 0, count = 0;
  const m = family.meals[date] || {};
  for (const slot of ['lunch', 'dinner']) {
    for (const it of (m[slot] && m[slot].items) || []) {
      const vals = Object.values(foodVotesFor(date, slot, it.id));
      sum += vals.reduce((a, b) => a + b, 0);
      count += vals.length;
    }
  }
  return count ? sum / count : null;
}

function trendHtml(dates) {
  const columns = [];
  if (statsMode === 'week') {
    for (const date of dates) {
      columns.push({
        label: FMT.dowNarrow.format(parseDate(date)),
        avg: dayRating(date),
      });
    }
  } else {
    for (let i = 0; i < dates.length; i += 7) {
      const chunk = dates.slice(i, i + 7);
      let sum = 0, count = 0;
      for (const date of chunk) {
        const avg = dayRating(date);
        if (avg != null) { sum += avg; count++; }
      }
      columns.push({
        label: `${FMT.dayNum.format(parseDate(chunk[0]))}–${FMT.dayNum.format(parseDate(chunk[chunk.length - 1]))}`,
        avg: count ? sum / count : null,
      });
    }
  }
  return `
    <div class="trend">
      <div class="trend-grid" aria-hidden="true"><i></i><i></i><i></i></div>
      ${columns.map((c) => `
        <div class="trend-col">
          <span class="trend-val">${c.avg == null ? '' : fmt1(c.avg)}</span>
          <div class="trend-bar ${c.avg == null ? 'zero' : 'grad'}" style="height:${c.avg == null ? 4 : Math.max(4, Math.round((c.avg / 10) * 96))}px;${c.avg == null ? '' : scoreGrad(c.avg)}"></div>
          <span class="trend-day">${esc(c.label)}</span>
        </div>`).join('')}
    </div>`;
}

function topFoodsHtml(stats) {
  if (!stats.topFoods.length) {
    return `<div class="empty-note"><span class="big">🍳</span>${t('stats.emptyMeals')}</div>`;
  }
  const max = stats.topFoods[0].count;
  return `
    <div class="bar-list">
      ${stats.topFoods.map((f, i) => `
        <div class="bar-row">
          <span class="bar-rank">${lang === 'fa' ? num(i + 1) : i + 1}</span>
          <span class="bar-emoji">${foodEmoji(f.name)}</span>
          <div class="bar-main">
            <div class="bar-top">
              <span class="bar-name">${esc(f.name)}</span>
              <span style="display:flex;align-items:center;gap:6px">
                ${f.voteCount ? scoreBadge(f.voteSum / f.voteCount) : ''}
                <span class="bar-count">×${lang === 'fa' ? num(f.count) : f.count}</span>
              </span>
            </div>
            <div class="bar-track"><div class="bar-fill" style="width:${(f.count / max) * 100}%"></div></div>
          </div>
        </div>`).join('')}
    </div>`;
}

function favoritesHtml(stats) {
  if (!stats.favorites.length) {
    return `<div class="empty-note">${t('stats.emptyVotes')}</div>`;
  }
  return `
    <div class="member-rows">
      ${stats.favorites.map((f) => `
        <div class="member-row">
          <span class="food-emoji">${foodEmoji(f.name)}</span>
          <div class="member-main">
            <div class="member-name">${esc(f.name)}</div>
            <div class="member-stats">${t('stats.favSub', { votes: f.voteCount, count: f.count })}</div>
          </div>
          ${scoreBadge(f.voteSum / f.voteCount)}
        </div>`).join('')}
    </div>`;
}

function bestDinnerHtml(stats) {
  if (!stats.best) {
    return `<div class="empty-note"><span class="big">🍽️</span>${t('stats.emptyVotesRange')}</div>`;
  }
  const b = stats.best;
  return `
    <div class="best-card-date">${FMT.dowShort.format(parseDate(b.date))} · ${FMT.shortDate.format(parseDate(b.date))}</div>
    <div class="meal-items" style="margin:10px 0 8px">
      ${mealItemsHtml(b.date, 'dinner', { items: b.items }, false)}
    </div>
    <div class="member-stats">${t('stats.bestSub', { face: voteFace(b.avg), avg: fmt1(b.avg), votes: t('stats.votes', { n: b.count }) })}</div>`;
}

function activityHtml(stats) {
  return `
    <div class="member-rows">
      ${family.members.map((m) => {
        const logs = stats.memberLogs.get(m.id) || 0;
        const votes = stats.memberVotes.get(m.id) || 0;
        const sum = stats.memberVoteSum.get(m.id) || 0;
        const avg = votes ? sum / votes : null;
        return `
          <div class="member-row">
            <span class="member-avatar" style="--member-color:${esc(m.color)}">${m.emoji}</span>
            <div class="member-main">
              <div class="member-name">${esc(m.name)}${m.id === meId ? '<span class="you-pill">You</span>' : ''}</div>
              <div class="member-stats">${t('stats.activityLine', { logs, votes, avg: avg != null ? fmt1(avg) : '—' })}</div>
            </div>
          </div>`;
      }).join('')}
    </div>`;
}

/* --------------------------- suggestions (stats) -------------------------- */

// All-time aggregation per food id: how often / how well liked / last eaten.
function computeSuggestions() {
  const agg = new Map();
  for (const [date, slots] of Object.entries(family.meals)) {
    for (const slot of ['lunch', 'dinner']) {
      const meal = slots[slot];
      if (!meal) continue;
      for (const it of meal.items || []) {
        let cur = agg.get(it.id);
        if (!cur) {
          cur = { name: it.name, count: 0, voteSum: 0, voteCount: 0, last: null };
          agg.set(it.id, cur);
        }
        cur.count++;
        if (!cur.last || date > cur.last) cur.last = date;
        for (const val of Object.values(foodVotesFor(date, slot, it.id))) {
          cur.voteSum += val;
          cur.voteCount++;
        }
      }
    }
  }

  // Most loved = highest average rating all-time (min. 1 vote), votes as tiebreak.
  const loved = [...agg.entries()]
    .filter(([, f]) => f.voteCount > 0)
    .sort((a, b) => (b[1].voteSum / b[1].voteCount) - (a[1].voteSum / a[1].voteCount) || b[1].voteCount - a[1].voteCount)
    .slice(0, 5)
    .map(([id, f]) => ({ id, ...f, avg: f.voteSum / f.voteCount }));

  // Stale = in food memory but not logged in the last 14 days (or never logged).
  const cutoff = addDays(todayStr(), -14);
  const stale = family.foods
    .map((f) => {
      const st = agg.get(f.id);
      return { id: f.id, name: f.name, count: st ? st.count : 0, last: st ? st.last : null };
    })
    .filter((f) => !f.last || f.last < cutoff)
    .sort((a, b) => {
      if (a.last && b.last) return a.last < b.last ? -1 : 1;
      if (a.last) return -1; // eaten-before before never-logged
      if (b.last) return 1;
      return b.count - a.count || a.name.localeCompare(b.name);
    })
    .slice(0, 5);

  return { loved, stale };
}

function lastEatenLabel(last) {
  if (!last) return t('stats.neverLogged');
  const today = todayStr();
  if (last === today) return t('today');
  if (last === addDays(today, -1)) return t('stats.yesterday');
  const days = Math.round((parseDate(today) - parseDate(last)) / 86400000);
  return t('stats.daysAgo', { n: days });
}

function suggestionsHtml() {
  const { loved, stale } = computeSuggestions();
  const head = (txt) => `<div class="suggest-head">${esc(txt)}</div>`;

  let html = head(t('stats.lovedTitle'));
  html += loved.length ? `
    <div class="member-rows" style="margin-top:8px">
      ${loved.map((f) => `
        <div class="member-row">
          <span class="food-emoji">${foodEmoji(f.name)}</span>
          <div class="member-main">
            <div class="member-name">${esc(f.name)}</div>
            <div class="member-stats">${t('stats.votes', { n: lang === 'fa' ? num(f.voteCount) : f.voteCount })} · ${t('foods.used', { n: f.count })}</div>
          </div>
          ${scoreBadge(f.avg)}
        </div>`).join('')}
    </div>` : `<div class="empty-note" style="margin-top:6px">${t('stats.noLoved')}</div>`;

  html += head(t('stats.staleTitle'));
  html += stale.length ? `
    <div class="member-rows" style="margin-top:8px">
      ${stale.map((f) => `
        <div class="member-row">
          <span class="food-emoji">${foodEmoji(f.name)}</span>
          <div class="member-main">
            <div class="member-name">${esc(f.name)}</div>
            <div class="member-stats">${lastEatenLabel(f.last)}</div>
          </div>
          <span class="bar-count">×${lang === 'fa' ? num(f.count) : f.count}</span>
        </div>`).join('')}
    </div>` : `<div class="empty-note" style="margin-top:6px">${t('stats.allFresh')}</div>`;

  return html;
}

function viewStats() {
  const dates = statsMode === 'week' ? weekDates(nav.stats) : monthDates(nav.stats);
  const stats = statsFor(dates);
  const today = todayStr();
  const isCurrent = dates.includes(today);
  const daysSoFar = isCurrent ? dates.filter((d) => d <= today).length : dates.length;
  const title = statsMode === 'week'
    ? (isCurrent ? t('thisWeek') : t('weekOf', { range: FMT.shortDate.format(parseDate(dates[0])) }))
    : FMT.monthYear.format(parseDate(nav.stats));
  const sub = statsMode === 'week'
    ? `${FMT.shortDate.format(parseDate(dates[0]))} – ${FMT.shortDate.format(parseDate(dates[6]))}`
    : (isCurrent ? t('stats.thisMonth') : t('stats.days', { n: lang === 'fa' ? num(dates.length) : dates.length }));
  const mealsTotal = stats.dinners + stats.lunches;

  return `
    <div class="seg">
      <button class="seg-btn ${statsMode === 'week' ? 'on' : ''}" data-act="stats-mode" data-mode="week">${t('stats.week')}</button>
      <button class="seg-btn ${statsMode === 'month' ? 'on' : ''}" data-act="stats-mode" data-mode="month">${t('stats.month')}</button>
    </div>
    ${rangeNavHtml(title, sub, 'prev-range', 'next-range', statsMode === 'week' && !isCurrent)}
    <div class="stat-grid">
      <div class="card stat-card wide">
        <span class="stat-emoji">${stats.avg != null ? voteFace(stats.avg) : '🍽️'}</span>
        <div>
          <div class="stat-label">${t('stats.foodRating')}</div>
          <div class="stat-value">${fmt1(stats.avg)}<span class="unit">/ ${lang === 'fa' ? '۱۰' : '10'}</span></div>
          <div class="stat-sub">${stats.voteCount ? t('stats.ratingSub', { votes: stats.voteCount, meals: mealsTotal }) : t('stats.noVotes')}</div>
        </div>
      </div>
      <div class="card stat-card">
        <div class="stat-label">${t('stats.dinners')}</div>
        <div class="stat-value">${lang === 'fa' ? num(stats.dinners) : stats.dinners}<span class="unit">/ ${lang === 'fa' ? num(daysSoFar) : daysSoFar}</span></div>
        <div class="stat-sub">${isCurrent ? t('stats.daysSoFar') : t('stats.inRange')}</div>
      </div>
      <div class="card stat-card">
        <div class="stat-label">${t('stats.lunches')}</div>
        <div class="stat-value">${lang === 'fa' ? num(stats.lunches) : stats.lunches}<span class="unit">/ ${lang === 'fa' ? num(daysSoFar) : daysSoFar}</span></div>
        <div class="stat-sub">${isCurrent ? t('stats.daysSoFar') : t('stats.inRange')}</div>
      </div>
    </div>
    <div class="card">
      <div class="card-title">${t('stats.trend')}</div>
      ${trendHtml(dates)}
    </div>
    <div class="card">
      <div class="card-title">${t('stats.top')}</div>
      ${topFoodsHtml(stats)}
    </div>
    <div class="card">
      <div class="card-title">${t('stats.fav')}</div>
      ${favoritesHtml(stats)}
    </div>
    <div class="card">
      <div class="card-title">${t('stats.suggest')}</div>
      ${suggestionsHtml()}
    </div>
    <div class="card">
      <div class="card-title">${t('stats.best')}</div>
      ${bestDinnerHtml(stats)}
    </div>
    <div class="card">
      <div class="card-title">${t('stats.activity')}</div>
      ${activityHtml(stats)}
    </div>`;
}

/* ----------------------------- foods rendering ---------------------------- */

function foodsRowsHtml() {
  const q = foodsQuery.trim().toLowerCase();
  const foods = family.foods
    .filter((f) => !q || f.name.toLowerCase().includes(q))
    .slice()
    .sort((a, b) => b.uses - a.uses || a.name.localeCompare(b.name));
  if (!family.foods.length) {
    return `<div class="empty-note"><span class="big">📖</span>${t('foods.empty')}</div>`;
  }
  if (!foods.length) {
    return `<div class="empty-note">${t('foods.noMatch', { q: esc(foodsQuery) })}</div>`;
  }
  return foods.map((f) => `
    <div class="food-row">
      <span class="food-emoji">${foodEmoji(f.name)}</span>
      <div class="food-name">
        <div class="f-name">${esc(f.name)}</div>
        <div class="f-uses">${t('foods.used', { n: f.uses || 0 })}</div>
      </div>
      <button class="mini-btn" data-act="food-rename" data-id="${esc(f.id)}" data-name="${esc(f.name)}" aria-label="${t('foods.rename')}">✏️</button>
      <button class="mini-btn danger" data-act="food-del" data-id="${esc(f.id)}" aria-label="${t('foods.delete')}">🗑</button>
    </div>`).join('');
}

function viewFoods() {
  return `
    <div class="add-bar">
      <input id="foods-new" class="text-input" placeholder="${t('foods.addPh')}" maxlength="40">
      <button class="btn primary" style="flex:0 0 auto" data-act="food-add">${t('foods.add')}</button>
    </div>
    <div class="card">
      <input id="foods-search" class="text-input" placeholder="${t('foods.searchPh')}" value="${esc(foodsQuery)}">
      <div id="foods-list" style="margin-top:8px">${foodsRowsHtml()}</div>
    </div>`;
}

/* ---------------------------- family rendering ---------------------------- */

function viewFamily() {
  const logsAllTime = new Map();
  for (const m of family.members) logsAllTime.set(m.id, 0);
  for (const day of Object.values(family.meals)) {
    for (const slot of ['lunch', 'dinner']) {
      const meal = day[slot];
      if (meal && meal.by && logsAllTime.has(meal.by)) {
        logsAllTime.set(meal.by, logsAllTime.get(meal.by) + 1);
      }
    }
  }
  const meMember = me();
  return `
    <div class="card">
      <div class="card-title">${t('fam.code')}</div>
      <div class="code-box">
        <div class="code-main">
          <div class="code-chars">${esc(family.id)}</div>
          <div class="code-hint">${t('fam.shareHint')}</div>
        </div>
        <button class="btn ghost small" data-act="copy-code">${t('fam.copyCode')}</button>
        <button class="btn ghost small" data-act="copy-link">${t('fam.copyLink')}</button>
      </div>
    </div>
    <div class="card">
      <div class="card-title">${t('fam.members', { n: lang === 'fa' ? num(family.members.length) : family.members.length })}</div>
      <div class="member-rows">
        ${family.members.map((m) => `
          <div class="member-row">
            <button class="member-avatar avatar-edit" data-act="member-emoji" data-id="${esc(m.id)}" style="--member-color:${esc(m.color)}" aria-label="${t('emoji.title')}">${m.emoji}</button>
            <div class="member-main">
              <div class="member-name">${esc(m.name)}${m.id === meId ? '<span class="you-pill">You</span>' : ''}</div>
              <div class="member-stats">${t('fam.allTime', { n: logsAllTime.get(m.id) || 0 })}</div>
            </div>
            ${family.members.length > 1 ? `
              <button class="mini-btn danger" data-act="member-del" data-id="${esc(m.id)}" data-name="${esc(m.name)}" aria-label="${t('aria.remove')}">✕</button>` : ''}
          </div>`).join('')}
      </div>
      <div class="add-bar" style="margin-top:12px">
        <input id="member-new" class="text-input" placeholder="${t('fam.addMemberPh')}" maxlength="30">
        <button class="btn primary" style="flex:0 0 auto" data-act="member-add">${t('foods.add')}</button>
      </div>
    </div>
    <div class="card">
      <div class="card-title">${t('fam.settings')}</div>
      <div class="settings-row">
        <div>
          <div class="settings-label">${t('fam.weekStart')}</div>
          <div class="settings-sub">${t('fam.weekStartSub')}</div>
        </div>
        <div class="seg" style="flex:0 0 auto;width:170px">
          <button class="seg-btn ${family.weekStart === 'sat' ? 'on' : ''}" data-act="weekstart" data-ws="sat">${t('fam.sat')}</button>
          <button class="seg-btn ${family.weekStart === 'mon' ? 'on' : ''}" data-act="weekstart" data-ws="mon">${t('fam.mon')}</button>
        </div>
      </div>
      <div class="settings-row">
        <div>
          <div class="settings-label">${t('fam.language')}</div>
        </div>
        <div class="seg" style="flex:0 0 auto;width:170px">
          <button class="seg-btn ${lang === 'en' ? 'on' : ''}" data-act="set-lang" data-lang="en">English</button>
          <button class="seg-btn ${lang === 'fa' ? 'on' : ''}" data-act="set-lang" data-lang="fa">فارسی</button>
        </div>
      </div>
      <div class="settings-row">
        <div>
          <div class="settings-label">${t('fam.theme')}</div>
        </div>
        <div class="seg" style="flex:0 0 auto;width:220px">
          <button class="seg-btn ${theme === 'system' ? 'on' : ''}" data-act="set-theme" data-theme="system">${t('theme.system')}</button>
          <button class="seg-btn ${theme === 'light' ? 'on' : ''}" data-act="set-theme" data-theme="light">${t('theme.light')}</button>
          <button class="seg-btn ${theme === 'dark' ? 'on' : ''}" data-act="set-theme" data-theme="dark">${t('theme.dark')}</button>
        </div>
      </div>
      <div class="settings-row">
        <div>
          <div class="settings-label">${t('fam.youAre')}</div>
          <div class="settings-sub">${meMember ? t('fam.youAreSub', { who: `${meMember.emoji} ${esc(meMember.name)}` }) : t('fam.youAreNone')}</div>
        </div>
      </div>
    </div>
    <div class="card danger-zone">
      <button class="btn ghost" data-act="leave">${t('fam.leave')}</button>
      <button class="btn danger" data-act="delete-family">${t('fam.delete')}</button>
    </div>`;
}

/* ------------------------------- app shell -------------------------------- */

const TAB_ICONS = {
  week: '<svg viewBox="0 0 24 24"><rect x="3" y="5" width="18" height="16" rx="3.5"/><path d="M8 3v4M16 3v4M3 10h18"/></svg>',
  stats: '<svg viewBox="0 0 24 24"><path d="M5 20v-7M12 20V5M19 20v-10"/><path d="M3 20h18"/></svg>',
  foods: '<svg viewBox="0 0 24 24"><path d="M4 12h16a8 8 0 0 1-16 0Z"/><path d="M9 8c0-1.5 1-2 1-3.5M14 8c0-1.5 1-2 1-3.5"/></svg>',
  family: '<svg viewBox="0 0 24 24"><circle cx="9" cy="8" r="3"/><circle cx="17" cy="10" r="2.4"/><path d="M3.5 19c.5-3 2.4-5 5.5-5s5 2 5.5 5M15.5 19c.2-2 1.3-3.7 3-3.7s2.5 1.3 3 3.7"/></svg>',
};
const TAB_LABELS = () => ({
  week: lang === 'fa' ? 'هفته' : 'Week',
  stats: lang === 'fa' ? 'آمار' : 'Stats',
  foods: lang === 'fa' ? 'غذاها' : 'Foods',
  family: lang === 'fa' ? 'خانواده' : 'Family',
});

function render() {
  if (!family) { renderOnboarding(); return; }
  const meMember = me();
  const labels = TAB_LABELS();
  $app().innerHTML = `
    <div class="shell">
      <header class="topbar">
        <div class="brand">
          <div class="brand-logo">🍲</div>
          <div class="brand-text">
            <div class="brand-title">FoodLog</div>
            <div class="brand-family">${esc(family.name)}</div>
          </div>
        </div>
        <div class="topbar-actions">
          <button class="icon-btn lang-btn" data-act="toggle-lang" aria-label="${t('aria.lang')}">${lang === 'fa' ? 'EN' : 'فا'}</button>
          <button class="icon-btn" data-act="refresh" aria-label="${t('aria.refresh')}">
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
              <path d="M20 11a8 8 0 1 0-1.7 6"/><path d="M20 4v7h-7"/>
            </svg>
          </button>
          <button class="avatar-btn" data-act="who" style="--member-color:${meMember ? esc(meMember.color) : 'var(--muted)'}" aria-label="${t('aria.who')}">
            ${meMember ? meMember.emoji : '👤'}
          </button>
        </div>
      </header>
      <main class="page" id="page"></main>
      <nav class="tabbar">
        ${['week', 'stats', 'foods', 'family'].map((k) => `
          <button class="tab-btn ${tab === k ? 'on' : ''}" data-act="tab" data-tab="${k}">
            ${TAB_ICONS[k]}<span class="tab-label">${labels[k]}</span>
          </button>`).join('')}
      </nav>
      <div class="backdrop" id="backdrop" data-act="sheet-close"></div>
      <div class="sheet" id="sheet"></div>
      <div class="toast" id="toast"></div>
    </div>`;
  renderPage();
  if (sheet) renderSheet();
}

function renderPage() {
  const page = document.getElementById('page');
  if (!page) return;
  if (tab === 'week') page.innerHTML = viewWeek();
  else if (tab === 'stats') page.innerHTML = viewStats();
  else if (tab === 'foods') page.innerHTML = viewFoods();
  else page.innerHTML = viewFamily();
}

/* ------------------------------ onboarding -------------------------------- */

function renderOnboarding() {
  const ob = onboarding;
  $app().innerHTML = `
    <div class="onboard">
      <div class="hero">
        <div class="hero-logo">🍲</div>
        <h1>FoodLog</h1>
        <p class="tagline">${t('app.tagline')}</p>
        <div class="hero-badges">
          <span class="hero-badge">${t('app.badge1')}</span>
          <span class="hero-badge">${t('app.badge2')}</span>
          <span class="hero-badge">${t('app.badge3')}</span>
          <span class="hero-badge">${t('app.badge4')}</span>
        </div>
      </div>
      <div class="card onboard-card">
        <div class="seg onboard-seg">
          <button class="seg-btn ${ob.mode === 'create' ? 'on' : ''}" data-act="ob-mode" data-mode="create">${t('ob.create')}</button>
          <button class="seg-btn ${ob.mode === 'join' ? 'on' : ''}" data-act="ob-mode" data-mode="join">${t('ob.join')}</button>
        </div>
        <div class="onboard-lang-hint">
          <button class="seg-btn" data-act="toggle-lang">${lang === 'fa' ? 'English' : 'فارسی'}</button>
        </div>
        <div id="ob-body">${obBodyHtml()}</div>
        <div class="form-error" id="ob-error">${esc(ob.error)}</div>
      </div>
      <p class="onboard-foot">${t('app.foot')}</p>
    </div>
    <div class="toast" id="toast"></div>`;
  const first = document.getElementById(ob.mode === 'create' ? 'ob-family' : 'ob-code');
  if (first) first.focus();
}

function obBodyHtml() {
  if (onboarding.mode === 'create') {
    return `
      <label>${t('ob.familyName')}
        <input id="ob-family" class="text-input" placeholder="${t('ob.familyName.ph')}" maxlength="60">
      </label>
      <label>${t('ob.yourName')}
        <input id="ob-name" class="text-input" placeholder="${t('ob.yourName.ph')}" maxlength="30">
      </label>
      <button class="btn primary" data-act="ob-create">${t('ob.start')}</button>`;
  }
  return `
    <label>${t('ob.code')}
      <input id="ob-code" class="text-input" placeholder="${t('ob.code.ph')}" maxlength="6" autocapitalize="characters" value="${esc(onboarding.prefill)}">
    </label>
    <button class="btn primary" data-act="ob-join">${t('ob.find')}</button>`;
}

async function obCreate() {
  const name = document.getElementById('ob-family').value;
  const memberName = document.getElementById('ob-name').value;
  if (!memberName.trim()) { onboarding.error = t('ob.err.name'); renderOnboarding(); return; }
  try {
    family = await api('', { method: 'POST', body: { name, memberName } });
    afterFamilyConnected(family.members[0].id);
  } catch (err) {
    onboarding.error = err.message;
    renderOnboarding();
  }
}

async function obJoin() {
  const code = document.getElementById('ob-code').value.trim().toUpperCase();
  if (!code) { onboarding.error = t('ob.err.code'); renderOnboarding(); return; }
  try {
    family = await api('/' + code);
    afterFamilyConnected(null);
  } catch (err) {
    onboarding.error = err.status === 404 ? t('err.notFound') : err.message;
    onboarding.prefill = code;
    renderOnboarding();
  }
}

function afterFamilyConnected(preferredMeId) {
  localStorage.setItem(LS_CODE, family.id);
  location.hash = '';
  meId = preferredMeId;
  if (!meId || !family.members.some((m) => m.id === meId)) {
    meId = family.members.length === 1 ? family.members[0].id : null;
  }
  if (meId) localStorage.setItem(LS_ME, meId);
  lastFetch = Date.now();
  render();
  if (!meId) openSheet({ kind: 'who' });
  else toast(t('welcome', { name: me().name }));
}

/* --------------------------------- sheet ---------------------------------- */

function openSheet(next) {
  sheet = next;
  renderSheet();
}

function closeSheet() {
  sheet = null;
  document.getElementById('backdrop')?.classList.remove('show');
  const el = document.getElementById('sheet');
  if (el) el.classList.remove('show');
}

function renderSheet() {
  const el = document.getElementById('sheet');
  if (!el || !sheet) return;
  if (sheet.kind === 'meal') el.innerHTML = mealSheetHtml();
  else if (sheet.kind === 'who') el.innerHTML = whoSheetHtml();
  else if (sheet.kind === 'rate') el.innerHTML = rateSheetHtml();
  else if (sheet.kind === 'emoji') el.innerHTML = emojiSheetHtml();
  else if (sheet.kind === 'prompt') el.innerHTML = promptSheetHtml();
  requestAnimationFrame(() => {
    document.getElementById('backdrop')?.classList.add('show');
    el.classList.add('show');
  });
  if (sheet.kind === 'meal') {
    setTimeout(() => document.getElementById('suggest-input')?.focus(), 140);
  } else if (sheet.kind === 'prompt') {
    setTimeout(() => {
      const input = document.getElementById('prompt-input');
      input?.focus();
      input?.select();
    }, 140);
  }
}

function mealSheetHtml() {
  const { date, slot } = sheet;
  const existing = (family.meals[date] || {})[slot];
  const by = existing && existing.by ? memberById(existing.by) : null;
  return `
    <div class="sheet-grab"></div>
    <div class="sheet-head">
      <div style="flex:1;min-width:0">
        <div class="sheet-title">${FMT.dowLong.format(parseDate(date))} ${slot === 'lunch' ? '☀️' : '🌙'} · ${FMT.shortDate.format(parseDate(date))}</div>
        <div class="sheet-sub">${existing ? t('sheet.loggedBy', { who: `${by.emoji} ${esc(by.name)}` }) : t('sheet.what')}</div>
      </div>
      <button class="sheet-close" data-act="sheet-close">✕</button>
    </div>
    <div class="sheet-scroll">
      <div class="selected-chips" id="sel-chips">${selectedChipsHtml()}</div>
      <div class="field">
        <input id="suggest-input" class="text-input" placeholder="${t('sheet.searchPh')}"
          autocomplete="off" value="${esc(sheet.query)}" maxlength="40">
      </div>
      <div class="suggest-list" id="suggest-list">${suggestListHtml()}</div>
    </div>
    <div class="sheet-actions">
      ${sheet.items.length || existing ? `<button class="btn ghost" data-act="clear-meal">${t('sheet.clear')}</button>` : ''}
      <button class="btn primary" data-act="save-meal">${t('sheet.save', { slot: `${t(slot)} ${slot === 'lunch' ? '☀️' : '🌙'}` })}</button>
    </div>`;
}

function selectedChipsHtml() {
  if (!sheet.items.length) return `<span class="empty-note" style="padding:2px 0">${t('sheet.nothing')}</span>`;
  return sheet.items.map((it, i) => `
    <span class="sel-chip">
      <span>${foodEmoji(it.name)}</span>${esc(it.name)}
      <button class="chip-x" data-act="chip-remove" data-idx="${i}" aria-label="${t('foods.delete')}">✕</button>
    </span>`).join('');
}

function suggestListHtml() {
  buildSuggestions();
  if (!sheet._suggest.length) {
    return `<div class="empty-note">${sheet.query ? t('sheet.noMatches', { q: esc(sheet.query) }) : t('sheet.noFoodsYet')}</div>`;
  }
  const rows = sheet._suggest.map((s, i) => {
    if (s.type === 'new') {
      return `
        <button class="suggest-row add-new" data-act="suggest-new">
          <span class="s-emoji">＋</span>
          <span class="s-name">${t('sheet.addNew', { q: esc(s.name) })}</span>
        </button>`;
    }
    return `
      <button class="suggest-row" data-act="suggest-pick" data-idx="${i}">
        <span class="s-emoji">${foodEmoji(s.name)}</span>
        <span class="s-name">${esc(s.name)}</span>
        <span class="s-uses">${s.uses ? t('sheet.usedTimes', { n: s.uses }) : ''}</span>
      </button>`;
  });
  const label = sheet.query.trim() ? t('sheet.matches') : t('sheet.mostUsed');
  return `<div class="suggest-label">${label}</div>${rows.join('')}`;
}

function buildSuggestions() {
  const q = sheet.query.trim().toLowerCase();
  const selectedIds = new Set(sheet.items.map((i) => i.id).filter(Boolean));
  const selectedNames = new Set(sheet.items.map((i) => i.name.toLowerCase()));
  const pool = family.foods.filter((f) => !selectedIds.has(f.id) && !selectedNames.has(f.name.toLowerCase()));
  let list;
  if (!q) {
    list = pool.slice(0, 10);
  } else {
    list = pool
      .map((f) => ({
        f,
        score: f.name.toLowerCase().startsWith(q) ? 2 : f.name.toLowerCase().includes(q) ? 1 : 0,
      }))
      .filter((x) => x.score > 0)
      .sort((a, b) => b.score - a.score || b.f.uses - a.f.uses || a.f.name.localeCompare(b.f.name))
      .slice(0, 8)
      .map((x) => x.f);
  }
  const foodEntries = list.map((f) => ({ type: 'food', id: f.id, name: f.name, uses: f.uses || 0 }));
  const exactExists = family.foods.some((f) => f.name.toLowerCase() === q) || selectedNames.has(q);
  const newEntry = q && !exactExists ? [{ type: 'new', name: sheet.query.trim() }] : [];
  // With matches on screen, Enter should pick the best match — so the
  // "add as new" row goes after the matches; with no matches it leads.
  sheet._suggest = foodEntries.length ? [...foodEntries, ...newEntry] : newEntry;
}

function refreshMealSheetBody() {
  const chips = document.getElementById('sel-chips');
  const input = document.getElementById('suggest-input');
  const list = document.getElementById('suggest-list');
  if (chips) chips.innerHTML = selectedChipsHtml();
  if (input) input.value = sheet.query;
  if (list) list.innerHTML = suggestListHtml();
}

function pickSuggestion(index) {
  const entry = sheet._suggest[index];
  if (!entry) return;
  sheet.items.push(entry.type === 'new' ? { name: entry.name } : { id: entry.id, name: entry.name });
  sheet.query = '';
  refreshMealSheetBody();
  document.getElementById('suggest-input')?.focus();
}

function addNewFoodFromQuery() {
  const name = sheet.query.trim();
  if (!name) return;
  sheet.items.push({ name });
  sheet.query = '';
  refreshMealSheetBody();
  document.getElementById('suggest-input')?.focus();
}

function openMealSheet(date, slot) {
  const existing = (family.meals[date] || {})[slot];
  openSheet({
    kind: 'meal',
    date,
    slot,
    items: existing ? existing.items.map(({ id, name }) => ({ id, name })) : [],
    query: '',
  });
}

function saveMeal() {
  const { date, slot, items } = sheet;
  closeSheet();
  mutate(`/meals/${date}/${slot}`, 'PUT', { items, memberId: meId || undefined }, (f) => {
    f.meals[date] ??= {};
    if (items.length) {
      f.meals[date][slot] = { items, by: meId, at: Date.now() };
    } else {
      delete f.meals[date][slot];
      if (!Object.keys(f.meals[date]).length) delete f.meals[date];
    }
    return f;
  }).then((ok) => { if (ok) toast(t('toast.mealSaved')); });
}

function clearMealSheet() {
  const { date, slot } = sheet;
  closeSheet();
  if ((family.meals[date] || {})[slot]) {
    mutate(`/meals/${date}/${slot}`, 'DELETE', undefined, (f) => {
      if (f.meals[date]) {
        delete f.meals[date][slot];
        if (!Object.keys(f.meals[date]).length) delete f.meals[date];
      }
      if (f.foodVotes && f.foodVotes[date]) {
        delete f.foodVotes[date][slot];
        if (!Object.keys(f.foodVotes[date]).length) delete f.foodVotes[date];
      }
      return f;
    }).then((ok) => { if (ok) toast(t('toast.mealCleared')); });
  }
}

/* --------------------------- per-food rating sheet ------------------------ */

function rateSheetHtml() {
  const { date, slot, foodId, name } = sheet;
  const votes = foodVotesFor(date, slot, foodId);
  const vals = Object.values(votes);
  const count = vals.length;
  const avg = count ? vals.reduce((a, b) => a + b, 0) / count : null;
  const myVote = meId ? votes[meId] : undefined;
  return `
    <div class="sheet-grab"></div>
    <div class="sheet-head">
      <div style="flex:1;min-width:0">
        <div class="sheet-title">${foodEmoji(name)} ${esc(name)}</div>
        <div class="sheet-sub">${FMT.dowLong.format(parseDate(date))} ${t(slot)} · ${FMT.shortDate.format(parseDate(date))}</div>
      </div>
      <button class="sheet-close" data-act="sheet-close">✕</button>
    </div>
    <div class="sheet-scroll">
      <div class="rate-hero">
        <span class="rate-emoji">${count ? voteFace(avg) : '🍽️'}</span>
        <div>
          <div class="rate-num">${fmt1(avg)}<span class="rate-denom">/ ${lang === 'fa' ? '۱۰' : '10'}</span></div>
          <div class="stat-sub">${count ? t('rate.votesSoFar', { n: count }) : t('rate.none')}</div>
        </div>
      </div>
      <div>
        <div class="suggest-label" style="padding:0 0 6px">${t('rate.everyone')}</div>
        <div class="rate-members">
          ${family.members.map((m) => {
            const v = votes[m.id];
            return `
              <div class="rate-member ${m.id === meId ? 'me-row' : ''}">
                <span class="member-avatar" style="--member-color:${esc(m.color)}">${m.emoji}</span>
                <span class="rm-name">${esc(m.name)}${m.id === meId ? '<span class="you-pill">You</span>' : ''}</span>
                ${v != null
                  ? `<span class="rate-m-face f${voteFace(v) === '😋' ? 3 : voteFace(v) === '😐' ? 2 : 1}">${voteFace(v)} ${lang === 'fa' ? num(v) : v}</span>`
                  : `<span class="rate-m-none">${t('rate.notYet')}</span>`}
              </div>`;
          }).join('')}
        </div>
      </div>
      <div class="vote-slider">
        <div class="vs-head">
          <span class="vs-value" id="vs-value">${myVote != null ? `${sliderFace(myVote)} ${lang === 'fa' ? num(myVote) : myVote}` : t('rate.slideHint')}</span>
          ${myVote != null ? `<button class="mini-btn" data-act="vote-clear" aria-label="${t('rate.clear')}">✕</button>` : ''}
        </div>
        <input type="range" id="vote-range" min="0" max="10" step="1" value="${myVote ?? 5}"
          aria-label="${t('rateAria', { v: myVote != null ? (lang === 'fa' ? num(myVote) : myVote) : 5 })}">
        <div class="vs-faces" aria-hidden="true">
          ${SLIDER_FACES.map((f) => `<span class="vs-face${myVote != null && SLIDER_FACES.indexOf(sliderFace(myVote)) === SLIDER_FACES.indexOf(f) ? ' on' : ''}">${f}</span>`).join('')}
        </div>
        <div class="vs-scale"><span>${SLIDER_FACES[0]} ${lang === 'fa' ? '۰' : '0'}</span><span>${SLIDER_FACES[2]} ${lang === 'fa' ? '۵' : '5'}</span><span>🤩 ${lang === 'fa' ? '۱۰' : '10'}</span></div>
      </div>
    </div>
    <div class="sheet-actions">
      <button class="btn ghost" data-act="edit-this-meal">${t('rate.editMeal')}</button>
    </div>`;
}

function castFoodVote(value) {
  if (!me()) { openSheet({ kind: 'who' }); return; }
  const { date, slot, foodId } = sheet;
  const current = foodVotesFor(date, slot, foodId)[meId];
  const next = current === value ? null : value;
  mutate('/votes', 'POST', { date, slot, foodId, memberId: meId, value: next }, (f) => {
    f.foodVotes ??= {};
    f.foodVotes[date] ??= {};
    f.foodVotes[date][slot] ??= {};
    if (next == null) {
      delete f.foodVotes[date][slot][foodId][meId];
    } else {
      (f.foodVotes[date][slot][foodId] ??= {})[meId] = next;
    }
    if (f.foodVotes[date][slot][foodId] && !Object.keys(f.foodVotes[date][slot][foodId]).length) delete f.foodVotes[date][slot][foodId];
    if (!Object.keys(f.foodVotes[date][slot]).length) delete f.foodVotes[date][slot];
    if (!Object.keys(f.foodVotes[date]).length) delete f.foodVotes[date];
    return f;
  });
}

/* ------------------------------ emoji picker ------------------------------ */

function emojiSheetHtml() {
  const member = memberById(sheet.memberId);
  return `
    <div class="sheet-grab"></div>
    <div class="sheet-head">
      <div style="flex:1;min-width:0">
        <div class="sheet-title">${t('emoji.title')}</div>
        <div class="sheet-sub">${t('emoji.sub', { name: esc(member.name) })}</div>
      </div>
      <button class="sheet-close" data-act="sheet-close">✕</button>
    </div>
    <div class="sheet-scroll">
      <div class="emoji-grid">
        ${EMOJI_CHOICES.map((e) => `
          <button class="emoji-cell ${member.emoji === e ? 'on' : ''}" data-act="emoji-pick" data-emoji="${e}" aria-label="${e}">${e}</button>`).join('')}
      </div>
    </div>`;
}

function pickEmoji(emoji) {
  const memberId = sheet.memberId;
  closeSheet();
  mutate(`/members/${memberId}`, 'PATCH', { emoji }, (f) => {
    const m = f.members.find((x) => x.id === memberId);
    if (m) m.emoji = emoji;
    return f;
  }).then((ok) => { if (ok) toast(t('emoji.changed')); });
}

/* ------------------------------ who / prompt ------------------------------ */

function whoSheetHtml() {
  return `
    <div class="sheet-grab"></div>
    <div class="sheet-head">
      <div style="flex:1">
        <div class="sheet-title">${t('who.title')}</div>
        <div class="sheet-sub">${t('who.sub')}</div>
      </div>
      <button class="sheet-close" data-act="sheet-close">✕</button>
    </div>
    <div class="sheet-scroll">
      <div class="suggest-list" style="min-height:0">
        ${family.members.map((m) => `
          <button class="suggest-row" data-act="who-pick" data-id="${esc(m.id)}">
            <span class="s-emoji" style="border:2.5px solid ${esc(m.color)};border-radius:50%">${m.emoji}</span>
            <span class="s-name">${esc(m.name)}</span>
            ${m.id === meId ? `<span class="s-uses">${t('who.current')}</span>` : ''}
          </button>`).join('')}
      </div>
      ${sheet.adding ? `
        <div class="add-bar">
          <input id="who-name" class="text-input" placeholder="${t('who.namePh')}" maxlength="30">
          <button class="btn primary" style="flex:0 0 auto" data-act="who-add-save">${t('who.addMe')}</button>
        </div>`
      : `
        <button class="suggest-row add-new" data-act="who-add">
          <span class="s-emoji">＋</span>
          <span class="s-name">${t('who.someone')}</span>
        </button>`}
    </div>`;
}

async function whoAddSave() {
  const name = (document.getElementById('who-name')?.value || '').trim();
  if (!name) { toast(t('who.errName')); return; }
  const before = new Set(family.members.map((m) => m.id));
  try {
    family = await api(`/${family.id}/members`, { method: 'POST', body: { name } });
    const added = family.members.find((m) => !before.has(m.id));
    meId = added ? added.id : null;
    if (meId) localStorage.setItem(LS_ME, meId);
    closeSheet();
    render();
    toast(me() ? t('welcome', { name: me().name }) : t('who.added'));
  } catch (err) {
    toast(t('err.prefix') + err.message);
  }
}

function promptSheetHtml() {
  const p = sheet;
  return `
    <div class="sheet-grab"></div>
    <div class="sheet-head">
      <div style="flex:1">
        <div class="sheet-title">${esc(p.title)}</div>
        ${p.label ? `<div class="sheet-sub">${esc(p.label)}</div>` : ''}
      </div>
      <button class="sheet-close" data-act="sheet-close">✕</button>
    </div>
    <div class="sheet-scroll">
      <input id="prompt-input" class="text-input" placeholder="${esc(p.placeholder || '')}" value="${esc(p.value || '')}" autocapitalize="characters">
      <div class="form-error" id="prompt-err"></div>
    </div>
    <div class="sheet-actions">
      <button class="btn ghost" data-act="sheet-close">${t('prompt.cancel')}</button>
      <button class="btn ${p.danger ? 'danger' : 'primary'}" data-act="prompt-confirm">${esc(p.confirmText || t('prompt.confirm'))}</button>
    </div>`;
}

async function promptConfirm() {
  const p = sheet;
  const value = (document.getElementById('prompt-input')?.value || '').trim();
  if (p.requireMatch && value.toUpperCase() !== p.requireMatch) {
    document.getElementById('prompt-err').textContent = t('fam.delMismatch');
    return;
  }
  if (!value && !p.allowEmpty) {
    document.getElementById('prompt-err').textContent = t('prompt.fillIn');
    return;
  }
  const onConfirm = p.onConfirm;
  closeSheet();
  if (onConfirm) await onConfirm(value);
}

/* ------------------------------- food actions ----------------------------- */

async function addFoodQuick() {
  const input = document.getElementById('foods-new');
  const name = (input?.value || '').trim();
  if (!name) { toast(t('foods.errName')); return; }
  input.value = '';
  try {
    family = await api(`/${family.id}/foods`, { method: 'POST', body: { name } });
    renderPage();
    toast(t('foods.toastAdded', { name }));
  } catch (err) {
    toast(t('err.prefix') + err.message);
  }
}

function promptRenameFood(id, currentName) {
  openSheet({
    kind: 'prompt',
    title: t('foods.renameTitle'),
    label: t('foods.renameLabel', { name: currentName }),
    value: currentName,
    placeholder: t('foods.renamePh'),
    confirmText: t('foods.rename'),
    allowEmpty: false,
    onConfirm: (name) => mutate(`/foods/${id}`, 'PUT', { name }),
  });
}

function deleteFoodAction(id) {
  mutate(`/foods/${id}`, 'DELETE', undefined, (f) => {
    f.foods = f.foods.filter((x) => x.id !== id);
    return f;
  }).then((ok) => { if (ok) toast(t('foods.toastRemoved')); });
}

/* ------------------------------ member actions ---------------------------- */

async function addMemberInline() {
  const input = document.getElementById('member-new');
  const name = (input?.value || '').trim();
  if (!name) { toast(t('fam.errName')); return; }
  input.value = '';
  try {
    family = await api(`/${family.id}/members`, { method: 'POST', body: { name } });
    renderPage();
    toast(t('fam.toastJoined', { name }));
  } catch (err) {
    toast(t('err.prefix') + err.message);
  }
}

function removeMemberAction(id, name) {
  openSheet({
    kind: 'prompt',
    title: t('fam.removeTitle', { name }),
    label: t('fam.removeLabel'),
    placeholder: '',
    confirmText: t('fam.remove'),
    danger: true,
    allowEmpty: true,
    onConfirm: () => mutate(`/members/${id}`, 'DELETE', undefined, (f) => {
      f.members = f.members.filter((m) => m.id !== id);
      for (const day of Object.values(f.foodVotes || {})) {
        for (const slot of Object.values(day)) {
          for (const food of Object.values(slot)) delete food[id];
        }
      }
      if (meId === id) meId = null;
      return f;
    }).then((ok) => { if (ok) toast(t('fam.toastMemberRemoved')); }),
  });
}

function patchWeekStart(ws) {
  mutate('', 'PATCH', { weekStart: ws }, (f) => { f.weekStart = ws; return f; });
}

function promptDeleteFamily() {
  openSheet({
    kind: 'prompt',
    title: t('fam.delTitle'),
    label: t('fam.delLabel', { code: family.id }),
    placeholder: t('fam.delPh'),
    confirmText: t('fam.delBtn'),
    danger: true,
    requireMatch: family.id,
    onConfirm: () => api(`/${family.id}`, { method: 'DELETE', body: { confirm: family.id } })
      .then(() => {
        localStorage.removeItem(LS_CODE);
        localStorage.removeItem(LS_ME);
        family = null;
        meId = null;
        onboarding = { mode: 'create', prefill: '', error: '' };
        render();
        toast(t('fam.toastDeleted'));
      })
      .catch((err) => toast(t('err.prefix') + err.message)),
  });
}

function leaveFamily() {
  localStorage.removeItem(LS_CODE);
  localStorage.removeItem(LS_ME);
  family = null;
  meId = null;
  onboarding = { mode: 'create', prefill: '', error: '' };
  render();
}

/* -------------------------------- clipboard ------------------------------- */

async function copyText(text, message) {
  try {
    await navigator.clipboard.writeText(text);
    toast(message);
  } catch {
    const ta = document.createElement('textarea');
    ta.value = text;
    document.body.appendChild(ta);
    ta.select();
    try { document.execCommand('copy'); toast(message); } catch { toast(t('fam.copyFail')); }
    ta.remove();
  }
}

/* ---------------------------------- toast --------------------------------- */

let toastTimer = null;
function toast(message) {
  const el = document.getElementById('toast');
  if (!el) return;
  el.textContent = message;
  el.classList.add('show');
  clearTimeout(toastTimer);
  toastTimer = setTimeout(() => el.classList.remove('show'), 2400);
}

/* ------------------------------- event wiring ----------------------------- */

const ACTIONS = {
  tab: (el) => { tab = el.dataset.tab; render(); },
  'prev-week': () => { nav.week = addDays(nav.week, -7); renderPage(); },
  'next-week': () => { nav.week = addDays(nav.week, 7); renderPage(); },
  'go-today': () => { nav.week = todayStr(); nav.stats = todayStr(); renderPage(); },
  'stats-mode': (el) => { statsMode = el.dataset.mode; renderPage(); },
  'prev-range': () => {
    if (statsMode === 'week') nav.stats = addDays(nav.stats, -7);
    else nav.stats = shiftMonth(nav.stats, -1);
    renderPage();
  },
  'next-range': () => {
    if (statsMode === 'week') nav.stats = addDays(nav.stats, 7);
    else nav.stats = shiftMonth(nav.stats, 1);
    renderPage();
  },
  'open-meal': (el) => openMealSheet(el.dataset.date, el.dataset.slot),
  'rate-food': (el) => openSheet({
    kind: 'rate',
    date: el.dataset.date,
    slot: el.dataset.slot,
    foodId: el.dataset.food,
    name: el.dataset.name,
  }),
  vote: (el) => castFoodVote(Number(el.dataset.value)),
  'vote-clear': () => castFoodVote(null),
  'edit-this-meal': () => openMealSheet(sheet.date, sheet.slot),
  'save-meal': saveMeal,
  'clear-meal': clearMealSheet,
  'sheet-close': closeSheet,
  'suggest-pick': (el) => pickSuggestion(Number(el.dataset.idx)),
  'suggest-new': addNewFoodFromQuery,
  'chip-remove': (el) => {
    sheet.items.splice(Number(el.dataset.idx), 1);
    refreshMealSheetBody();
  },
  refresh: () => loadFamily().then(() => toast(t('toast.updated'))).catch((e) => toast(t('err.prefix') + e.message)),
  who: () => openSheet({ kind: 'who' }),
  'who-pick': (el) => {
    meId = el.dataset.id;
    localStorage.setItem(LS_ME, meId);
    closeSheet();
    render();
    toast(t('who.hi', { emoji: me().emoji, name: me().name }));
  },
  'who-add': () => { sheet.adding = true; renderSheet(); setTimeout(() => document.getElementById('who-name')?.focus(), 80); },
  'who-add-save': whoAddSave,
  'member-emoji': (el) => openSheet({ kind: 'emoji', memberId: el.dataset.id }),
  'emoji-pick': (el) => pickEmoji(el.dataset.emoji),
  'food-add': addFoodQuick,
  'food-rename': (el) => promptRenameFood(el.dataset.id, el.dataset.name),
  'food-del': (el) => deleteFoodAction(el.dataset.id),
  'member-add': addMemberInline,
  'member-del': (el) => removeMemberAction(el.dataset.id, el.dataset.name),
  weekstart: (el) => patchWeekStart(el.dataset.ws),
  'toggle-lang': () => setLang(lang === 'fa' ? 'en' : 'fa'),
  'set-lang': (el) => setLang(el.dataset.lang),
  'set-theme': (el) => setTheme(el.dataset.theme),
  'copy-code': () => copyText(family.id, t('fam.codeCopied')),
  'copy-link': () => copyText(`${location.origin}/#${family.id}`, t('fam.linkCopied')),
  leave: leaveFamily,
  'delete-family': promptDeleteFamily,
  'prompt-confirm': promptConfirm,
  'ob-mode': (el) => { onboarding.mode = el.dataset.mode; onboarding.error = ''; renderOnboarding(); },
  'ob-create': obCreate,
  'ob-join': obJoin,
};

document.addEventListener('click', (e) => {
  const el = e.target.closest('[data-act]');
  if (!el) return;
  const action = ACTIONS[el.dataset.act];
  if (action) action(el);
});

document.addEventListener('input', (e) => {
  const tEl = e.target;
  if (tEl.id === 'suggest-input' && sheet?.kind === 'meal') {
    sheet.query = tEl.value;
    document.getElementById('suggest-list').innerHTML = suggestListHtml();
  } else if (tEl.id === 'foods-search') {
    foodsQuery = tEl.value;
    const list = document.getElementById('foods-list');
    if (list) list.innerHTML = foodsRowsHtml();
  } else if (tEl.id === 'vote-range' && sheet?.kind === 'rate') {
    const v = Number(tEl.value);
    const label = document.getElementById('vs-value');
    if (label) label.textContent = `${sliderFace(v)} ${lang === 'fa' ? num(v) : v}`;
    const idx = Math.max(0, Math.min(4, Math.floor(v / 2)));
    document.querySelectorAll('.vs-face').forEach((el, i) => el.classList.toggle('on', i === idx));
  }
});

// Commit the slider vote when the user releases it.
document.addEventListener('change', (e) => {
  if (e.target.id === 'vote-range' && sheet?.kind === 'rate') {
    castFoodVote(Number(e.target.value));
  }
});

document.addEventListener('keydown', (e) => {
  if (e.key !== 'Enter') return;
  const id = e.target.id;
  if (id === 'suggest-input' && sheet?.kind === 'meal') {
    e.preventDefault();
    if (sheet._suggest[0]) {
      if (sheet._suggest[0].type === 'new') addNewFoodFromQuery();
      else pickSuggestion(0);
    }
  } else if (id === 'foods-new') {
    e.preventDefault();
    addFoodQuick();
  } else if (id === 'member-new') {
    e.preventDefault();
    addMemberInline();
  } else if (id === 'who-name') {
    e.preventDefault();
    whoAddSave();
  } else if (id === 'prompt-input') {
    e.preventDefault();
    promptConfirm();
  } else if (id === 'ob-family' || id === 'ob-name') {
    e.preventDefault();
    if (onboarding.mode === 'create') obCreate();
  } else if (id === 'ob-code') {
    e.preventDefault();
    if (onboarding.mode === 'join') obJoin();
  }
});

document.addEventListener('visibilitychange', () => {
  if (document.visibilityState === 'visible' && family && Date.now() - lastFetch > 20000) {
    loadFamily(true).catch(() => {});
  }
});

/* ---------------------------------- boot ---------------------------------- */

(async function init() {
  const fromHash = location.hash.replace(/^#/, '').trim().toUpperCase();
  const code = localStorage.getItem(LS_CODE) || fromHash;
  if (!code) { renderOnboarding(); return; }
  $app().innerHTML = `<div class="skeleton-page"><span class="spin" style="font-size:26px">🍲</span>&nbsp;${t('boot')}</div>`;
  try {
    family = await api('/' + code);
    localStorage.setItem(LS_CODE, family.id);
    if (meId && !family.members.some((m) => m.id === meId)) meId = null;
    lastFetch = Date.now();
    render();
    if (!meId) openSheet({ kind: 'who' });
  } catch (err) {
    localStorage.removeItem(LS_CODE);
    onboarding = {
      mode: 'join',
      prefill: fromHash || '',
      error: fromHash ? t('err.notFound') : '',
    };
    renderOnboarding();
  }
})();
