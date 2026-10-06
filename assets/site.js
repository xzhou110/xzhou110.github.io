const root = document.documentElement;
const themeButtons = document.querySelectorAll('[data-set-theme]');
function syncTheme() {
  themeButtons.forEach((button) => button.setAttribute('aria-pressed', String(button.dataset.setTheme === root.dataset.theme)));
  document.querySelector('meta[name="theme-color"]')?.setAttribute('content', root.dataset.theme === 'dark' ? '#16181c' : '#f4f5f2');
}
themeButtons.forEach((button) => button.addEventListener('click', () => {
  root.dataset.theme = button.dataset.setTheme;
  try { localStorage.setItem('theme', root.dataset.theme); } catch { /* Theme still works without storage. */ }
  syncTheme();
}));
syncTheme();
const preference = matchMedia('(prefers-color-scheme: dark)');
preference.addEventListener('change', () => {
  try { if (['light', 'dark'].includes(localStorage.getItem('theme'))) return; } catch { /* Follow the system. */ }
  root.dataset.theme = preference.matches ? 'dark' : 'light';
  syncTheme();
});
const cases = [...document.querySelectorAll('details.case-study')];
const expandAll = document.getElementById('expand-all');
if (expandAll) {
  expandAll.hidden = false;
  const update = () => { expandAll.textContent = cases.every((item) => item.open) ? 'Collapse All' : 'Expand All'; };
  expandAll.addEventListener('click', () => {
    const open = !cases.every((item) => item.open);
    cases.forEach((item) => { item.open = open; });
    update();
  });
  cases.forEach((item) => item.addEventListener('toggle', update));
}
const navLinks = [...document.querySelectorAll('.topbar nav a')];
const sections = [...document.querySelectorAll('main > section[id]')];
let scrollQueued = false;
function syncSection() {
  const boundary = Math.min(180, innerHeight * .25);
  const current = sections.filter((section) => section.getBoundingClientRect().top <= boundary).at(-1);
  navLinks.forEach((link) => {
    if (current && link.hash === `#${current.id}`) link.setAttribute('aria-current', 'location');
    else link.removeAttribute('aria-current');
  });
  scrollQueued = false;
}
function queueSection() { if (!scrollQueued) { scrollQueued = true; requestAnimationFrame(syncSection); } }
addEventListener('scroll', queueSection, { passive: true });
addEventListener('resize', queueSection);
syncSection();
