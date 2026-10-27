const config = JSON.parse(document.getElementById('library-config').textContent);
const container = document.getElementById('project-library');
const form = document.getElementById('library-search');
const notice = document.getElementById('library-notice');
const results = document.getElementById('project-results');
const pagination = document.getElementById('library-pagination');
const search = document.getElementById('project-search');
const category = document.getElementById('project-category');
let starting = false;

async function startLibrary() {
  if (starting) return;
  starting = true;
  notice.textContent = 'Preparing Search…';
  try {
    const [engine, response] = await Promise.all([import(config.engine), fetch(config.catalog)]);
    if (!response.ok) throw new Error('Catalog unavailable');
    const catalog = await response.json();
    if (!Array.isArray(catalog.projects) || !Array.isArray(catalog.groups)
      || catalog.projects.some(p => typeof p.html !== 'string' || typeof p.searchText !== 'string')) throw new Error('Invalid catalog');
    const { readState, selectProjects, libraryURL, projectURL } = engine;
    let state = readState(new URL(location.href), catalog.groups, Number(container.dataset.page));
    const linkFor = (page) => libraryURL({ ...state, page }, location.href);
    function render({ focus = false, write = false, replace = false } = {}) {
      const selected = selectProjects(catalog.projects, state);
      state.page = selected.page;
      const url = libraryURL(state, location.href);
      if (write) history[replace ? 'replaceState' : 'pushState'](null, '', url);
      search.value = state.query;
      category.value = state.category;
      // HTML is generated and publication-reviewed alongside these static pages.
      results.innerHTML = selected.items.map(p => p.html).join('');
      results.querySelectorAll('a').forEach(link => {
        const id = link.closest('.project-card').id;
        link.href = projectURL(id, url);
      });
      document.getElementById('library-count').textContent = selected.total ? `${selected.start}–${selected.end} of ${selected.total} ${selected.total === 1 ? 'Project' : 'Projects'}` : 'No Matching Projects';
      document.getElementById('no-results').hidden = selected.total > 0;
      pagination.replaceChildren();
      function pageLink(label, number) {
        if (number < 1 || number > selected.pages) return document.createElement('span');
        const a = document.createElement('a');
        a.className = 'button'; a.textContent = label; a.href = linkFor(number);
        a.addEventListener('click', event => {
          if (event.button !== 0 || event.metaKey || event.ctrlKey || event.shiftKey || event.altKey) return;
          event.preventDefault(); state.page = number; render({focus:true,write:true});
        });
        return a;
      }
      const label = document.createElement('span'); label.textContent = `Page ${selected.page} of ${selected.pages}`;
      pagination.append(pageLink('← Previous', selected.page - 1), label, pageLink('Next →', selected.page + 1));
      if (focus) {
        const target = results.querySelector('a') || document.getElementById('clear-search');
        target.focus({preventScroll:true});
        document.getElementById('library-count').scrollIntoView({block:'start'});
      }
    }
    function restore() {
      const url = new URL(location.href);
      state = readState(url,catalog.groups,Number(url.pathname.match(/\/page\/(\d+)\//)?.[1] || 1));
      const target = catalog.projects.find(p => `#${p.id}` === url.hash);
      if (target) {
        const matches = selectProjects(catalog.projects,state,Math.max(1,catalog.projects.length)).items;
        const index = matches.findIndex(p=>p.id===target.id);
        if (index>=0) state.page=Math.floor(index/engine.PAGE_SIZE)+1;
        else { state={category:'all',query:'',page:Math.floor(catalog.projects.indexOf(target)/engine.PAGE_SIZE)+1}; }
      }
      render();
      if (target) requestAnimationFrame(()=>document.getElementById(target.id)?.scrollIntoView({block:'start'}));
    }
    form.addEventListener('submit',event=>{event.preventDefault();state={category:category.value,query:search.value.trim(),page:1};render({focus:true,write:true});});
    category.addEventListener('change',()=>{state={category:category.value,query:search.value.trim(),page:1};render({write:true});category.focus();});
    document.getElementById('clear-search').addEventListener('click',()=>{state={category:'all',query:'',page:1};render({write:true});search.focus();});
    addEventListener('popstate',restore);
    addEventListener('hashchange',restore);
    form.hidden = false; notice.textContent = ''; restore();
  } catch {
    notice.textContent = 'Search is unavailable. You can still browse every project with Previous and Next. ';
    const retry = document.createElement('button'); retry.className='button';retry.textContent='Retry Search';
    retry.addEventListener('click',startLibrary);notice.append(retry);
    starting = false;
  }
}
startLibrary();
