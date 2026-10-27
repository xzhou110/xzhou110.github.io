// Pure collection rules shared by the static build and the browser.
export const PAGE_SIZE = 6;
export const normalize = (value) => String(value ?? '').normalize('NFKD').replace(/[\u0300-\u036f]/g, '').toLowerCase().trim();

export function readState(url, groups, fallbackPage = 1) {
  const category = url.searchParams.get('category') || url.searchParams.get('work') || 'all';
  const rawPage = url.searchParams.get('page') || fallbackPage;
  const number = Number(rawPage);
  return {
    category: groups.some(group => group.id === category) ? category : 'all',
    query: (url.searchParams.get('q') || '').trim(),
    page: Number.isSafeInteger(number) && number > 0 ? number : 1,
  };
}

export function selectProjects(projects, state, pageSize = PAGE_SIZE) {
  const terms = normalize(state.query).split(/\s+/).filter(Boolean);
  const matches = projects.filter(project => (state.category === 'all' || project.group === state.category)
    && terms.every(term => normalize(project.searchText).includes(term)));
  const pages = Math.max(1, Math.ceil(matches.length / pageSize));
  const page = Math.min(Math.max(1, state.page), pages);
  const start = (page - 1) * pageSize;
  return { items: matches.slice(start, start + pageSize), total: matches.length, page, pages, start: matches.length ? start + 1 : 0, end: Math.min(start + pageSize, matches.length) };
}

export function libraryURL(state, base) {
  const url = new URL(base);
  url.pathname = '/projects/';
  for (const key of ['category', 'work', 'q', 'page', 'collection']) url.searchParams.delete(key);
  if (state.category !== 'all') url.searchParams.set('category', state.category);
  if (state.query) url.searchParams.set('q', state.query);
  if (state.page > 1) url.searchParams.set('page', String(state.page));
  url.hash = '';
  return url;
}

export function projectURL(id, collectionURL) {
  const url = new URL(collectionURL);
  url.pathname = `/projects/${id}/`;
  url.searchParams.set('collection', '1');
  url.hash = '';
  return url;
}
