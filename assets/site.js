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
const projects = [...document.querySelectorAll('.project')];
const filterButtons = [...document.querySelectorAll('[data-work-filter]')];
const jumpSelect = document.getElementById('project-jump');
const workCount = document.getElementById('work-count');
const expandAll = document.getElementById('expand-all');
const visibleCases = () => cases.filter((item) => !item.closest('.project').hidden);
function updateBulk() {
  if (!expandAll) return;
  const visible = visibleCases();
  expandAll.textContent = visible.length && visible.every((item) => item.open) ? 'Collapse All' : 'Expand All';
}
if (expandAll) {
  expandAll.hidden = false;
  expandAll.addEventListener('click', () => {
    const visible = visibleCases();
    const open = !visible.every((item) => item.open);
    visible.forEach((item) => { item.open = open; });
    updateBulk();
  });
  cases.forEach((item) => item.addEventListener('toggle', updateBulk));
}
let selectedGroup = 'all';
function applyFilter(group) {
  selectedGroup = filterButtons.some((button) => button.dataset.workFilter === group) ? group : 'all';
  projects.forEach((project) => { project.hidden = selectedGroup !== 'all' && project.dataset.group !== selectedGroup; });
  filterButtons.forEach((button) => button.setAttribute('aria-pressed', String(button.dataset.workFilter === selectedGroup)));
  const visible = projects.filter((project) => !project.hidden);
  if (workCount) workCount.textContent = selectedGroup === 'all' ? `Showing All ${projects.length} Projects` : `Showing ${visible.length} of ${projects.length} Projects`;
  if (jumpSelect) jumpSelect.value = '';
  updateBulk();
  queueSection();
}
function locationFor(group, hash) {
  const url = new URL(location.href);
  if (group === 'all') url.searchParams.delete('work');
  else url.searchParams.set('work', group);
  url.hash = hash;
  return url;
}
filterButtons.forEach((button) => button.addEventListener('click', () => {
  applyFilter(button.dataset.workFilter);
  history.pushState(null, '', locationFor(selectedGroup, 'work'));
}));
document.getElementById('project-jump-form')?.addEventListener('submit', (event) => {
  event.preventDefault();
  const project = projects.find((item) => item.id === jumpSelect.value);
  if (!project) return;
  if (project.hidden) applyFilter(project.dataset.group);
  jumpSelect.value = project.id;
  history.pushState(null, '', locationFor(selectedGroup, project.id));
  project.focus({ preventScroll: true });
  project.scrollIntoView({ block: 'start' });
});
function restoreLocation() {
  const url = new URL(location.href);
  const project = projects.find((item) => `#${item.id}` === url.hash);
  applyFilter(url.searchParams.get('work') || 'all');
  if (project?.hidden) applyFilter(project.dataset.group);
  if (jumpSelect && project) jumpSelect.value = project.id;
  let id;
  try { id = decodeURIComponent(url.hash.slice(1)); } catch { return; }
  const target = id && document.getElementById(id);
  if (target) requestAnimationFrame(() => target.scrollIntoView({ block: 'start' }));
}
document.querySelector('.work-tools')?.removeAttribute('hidden');
addEventListener('popstate', restoreLocation);
addEventListener('hashchange', restoreLocation);
const header = document.querySelector('.site-header');
function measureHeader() {
  if (header) root.style.setProperty('--nav-height', `${Math.ceil(header.getBoundingClientRect().height)}px`);
}
if (header && 'ResizeObserver' in window) new ResizeObserver(measureHeader).observe(header);
measureHeader();
const navLinks = [...document.querySelectorAll('.topbar nav a')];
const sections = [...document.querySelectorAll('main > section[id]')];
let scrollQueued = false;
function syncSection() {
  const boundary = (header?.getBoundingClientRect().height || 0) + 48;
  const atBottom = scrollY > 0 && scrollY + innerHeight >= document.documentElement.scrollHeight - 2;
  const current = atBottom ? sections.at(-1) : sections.filter((section) => section.getBoundingClientRect().top <= boundary).at(-1);
  navLinks.forEach((link) => {
    if (current && link.hash === `#${current.id}`) link.setAttribute('aria-current', 'location');
    else link.removeAttribute('aria-current');
  });
  scrollQueued = false;
}
function queueSection() { if (!scrollQueued) { scrollQueued = true; requestAnimationFrame(syncSection); } }
addEventListener('scroll', queueSection, { passive: true });
addEventListener('resize', () => { measureHeader(); queueSection(); });
restoreLocation();
syncSection();
