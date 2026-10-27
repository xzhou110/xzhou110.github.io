import fs from 'node:fs';
import path from 'node:path';
import { esc, md } from './render-utils.mjs';
import { PAGE_SIZE, selectProjects } from './assets/project-library.mjs';

function illustration(visual, icon) {
  if (visual.kind === 'product') return `<div class="illustration product-illustration"><div class="phone-preview"><div class="phone-top"><span class="phone-brand">${icon}<span>XuSeak To-Do</span></span><span>◌</span></div><p class="phone-date">A Little Space for What Matters</p><strong class="phone-title">Today</strong><div class="sample-tasks">${visual.items.map((item, i) => `<div><span class="task-circle${i === 0 ? ' completed' : ''}">${i === 0 ? '✓' : ''}</span>${esc(item)}</div>`).join('')}</div><div class="phone-tabs"><span>Today</span><span>To-Do</span><span>Habits</span><span>Ideas</span></div></div><div class="product-annotation"><span class="small-label">Designed Around the Day</span><strong>${esc(visual.title)}</strong><p>Plan. Act. Make Room.</p><span class="annotation-pill">Works Offline</span></div></div>`;
  if (visual.kind === 'game') return `<div class="illustration game-illustration"><div class="game-brand">${icon}<p class="small-label">Dream Laws</p></div><strong>${esc(visual.title)}</strong><div class="game-cards">${visual.steps.map((step, i) => `<div><span>${['I', 'II', 'III'][i]}</span><b>${esc(step)}</b></div>`).join('')}</div></div>`;
  const body = visual.kind === 'workflow'
    ? `<ol class="workflow-steps">${visual.steps.map((step, i) => `<li><span>${String(i + 1).padStart(2, '0')}</span>${esc(step)}</li>`).join('')}</ol>`
    : `<ul class="connection-rows">${visual.rows.map(row => `<li><strong>${esc(row.name)}</strong><span>${esc(row.state)}</span></li>`).join('')}</ul>`;
  return `<div class="illustration"><div class="illustration-heading">${icon || '<span class="illustration-mark">↳</span>'}<strong>${esc(visual.title)}</strong></div>${body}</div>`;
}

export function projectRenderer(c, here, version, repoFact) {
  const icon = (p, size = 36) => p.icon ? `<img class="project-icon" src="/${esc(p.icon)}?v=${version(p.icon)}" width="${size}" height="${size}" alt="" decoding="async" loading="lazy">` : '';
  const preview = (p) => {
    const caption = p.screenshot ? 'Public App Preview' : p.visual?.caption;
    if (!caption) throw new Error('Every project needs a reviewed visual.');
    let art;
    if (p.screenshot) {
      const shot = `assets/shots/${p.id}.png`;
      if (!fs.existsSync(path.join(here, shot))) throw new Error('Missing reviewed screenshot.');
      art = `<div class="preview-image"><img src="/${shot}" width="1280" height="800" alt="${esc(p.title)} interface preview" loading="lazy" decoding="async"></div>`;
    } else {
      // A scalable image-shaped view of the existing HTML illustration. No raster copy or new artwork.
      art = `<svg class="preview-illustration" viewBox="0 0 560 360" role="img" aria-label="${esc(p.title)}: ${esc(p.visual.title)}" focusable="false"><foreignObject width="560" height="360"><div xmlns="http://www.w3.org/1999/xhtml" class="preview-art" aria-hidden="true">${illustration(p.visual, icon(p, 32))}</div></foreignObject></svg>`;
    }
    return `<figure class="project-preview">${art}<figcaption>${esc(caption)}</figcaption></figure>`;
  };
  const card = (p) => `<article class="project-card" id="${esc(p.id)}" data-group="${esc(p.group)}"><a class="preview-link" href="/projects/${esc(p.id)}/" aria-label="Explore ${esc(p.title)}">${preview(p)}</a><div class="card-copy"><div class="project-title">${icon(p)}<h3><a href="/projects/${esc(p.id)}/">${esc(p.title)}</a></h3></div><p class="card-summary">${esc(p.summary || p.oneLiner)}</p><div class="card-bottom"><p class="project-status">${esc(p.status)}</p><a class="explore-link" href="/projects/${esc(p.id)}/" aria-label="Read Case Study: ${esc(p.title)}">View Case Study <span aria-hidden="true">↗</span></a></div></div></article>`;
  const evidence = (p) => {
    const fact = repoFact(p.id);
    return `<div class="detail"><dl><dt>Problem</dt><dd>${md(p.problem)}</dd><dt>What I Built</dt><dd>${md(p.built)}</dd><dt>How It Works</dt><dd>${md(p.how)}</dd><dt>Where It Stands</dt><dd>${md(p.outcome)}</dd><dt>Evidence and Limits</dt><dd><ul>${p.honest.map(h => `<li>${md(h)}</li>`).join('')}</ul></dd><dt>Product Stack</dt><dd>${p.stack.map(esc).join(' · ')}</dd><dt>Evidence As Of</dt><dd>${esc(p.evidenceAsOf || c.evidenceAsOf)}</dd>${fact?.pushedAt ? `<dt>Repository Updated</dt><dd>${esc(String(fact.pushedAt).slice(0, 10))} (recorded in the supplied facts snapshot)</dd>` : ''}</dl>${p.caption || p.caveat ? `<p class="caveat">${md([p.caption,p.caveat].filter(Boolean).join(' '))}</p>` : ''}</div>`;
  };
  const detail = (p) => `<a class="back-link" id="case-back" href="/#work">← Back to Selected Work</a><article class="case-page" data-project="${esc(p.id)}"><div class="case-hero"><div><p class="section-kicker">${esc(p.category)}</p><div class="case-title">${icon(p,48)}<h1>${esc(p.title)}</h1></div><p class="project-status">${esc(p.status)}</p><p class="case-intro">${md(p.oneLiner)}</p>${p.format?`<p class="project-format">${esc(p.format)}</p>`:''}<div class="actions">${p.live?`<a class="button primary" href="${esc(p.live)}" aria-label="Open App: ${esc(p.title)}">Open App ↗</a>`:''}${p.repo?`<a class="button" href="${esc(p.repo)}" aria-label="View Source: ${esc(p.title)}">View Source ↗</a>`:''}</div></div>${preview(p)}</div><p class="case-decision"><strong>Key Decision</strong>${esc(p.decision)}</p><h2>The Case Study</h2>${evidence(p)}</article><div class="actions"><a class="button" href="/projects/">Explore All ${c.featured.length} Projects</a><a class="button primary" href="mailto:${esc(c.links.email)}">Get in Touch ↗</a></div>`;
  return { card, detail };
}

export function renderLibrary(c, cards, page, catalogVersion, engineVersion) {
  const result = selectProjects(cards, {category:'all',query:'',page});
  const pagePath = n => n === 1 ? '/projects/' : `/projects/page/${n}/`;
  return `<a class="back-link" href="/#work">← Back to the Portfolio</a><section id="project-library" data-page="${page}" aria-labelledby="library-heading"><div class="section-head"><div><p class="section-kicker">The Full Collection</p><h1 id="library-heading">All Projects</h1><p>${esc(c.libraryIntro)}</p></div></div><form id="library-search" class="library-tools" hidden role="search"><label>Search Projects<input type="search" name="q" id="project-search" autocomplete="off"></label><label>Category<select name="category" id="project-category"><option value="all">All Categories (${c.featured.length})</option>${c.workGroups.map(g=>`<option value="${esc(g.id)}">${esc(g.label)} (${c.featured.filter(p=>p.group===g.id).length})</option>`).join('')}</select></label><button type="submit" class="button">Search</button><button type="button" id="clear-search" class="button">Clear</button></form><p id="library-notice" class="library-notice" role="status"></p><div class="library-meta"><p id="library-count" role="status" aria-live="polite">${result.start}–${result.end} of ${result.total} Projects</p><span>Curated Order</span></div><div class="project-grid library-grid" id="project-results">${result.items.map(p=>p.html).join('\n')}</div><p id="no-results" class="empty-results" hidden>No projects match this search. Try a broader term or clear the filters.</p><nav class="pagination" id="library-pagination" aria-label="Project Pages">${page>1?`<a class="button" rel="prev" href="${pagePath(page-1)}">← Previous</a>`:'<span></span>'}<span>Page ${page} of ${result.pages}</span>${page<result.pages?`<a class="button" rel="next" href="${pagePath(page+1)}">Next →</a>`:'<span></span>'}</nav><noscript><p class="library-notice">Use Previous and Next to browse every project. Search requires JavaScript.</p></noscript></section><script id="library-config" type="application/json">${JSON.stringify({catalog:`/assets/project-catalog.json?v=${catalogVersion}`,engine:`/assets/project-library.mjs?v=${engineVersion}`})}</script>`;
}
