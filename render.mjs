import fs from 'node:fs';
import path from 'node:path';
import { createHash } from 'node:crypto';

import { esc, md } from './render-utils.mjs';
import { projectRenderer, renderLibrary } from './render-projects.mjs';
import { PAGE_SIZE } from './assets/project-library.mjs';
export { esc } from './render-utils.mjs';
const themeInit = `(function(){var t;try{t=localStorage.getItem('theme')}catch(e){}if(t!=='light'&&t!=='dark')t=matchMedia('(prefers-color-scheme: dark)').matches?'dark':'light';document.documentElement.dataset.theme=t})();`;

export function render(c, here, repoFact = () => null) {
  const groups = c.workGroups;
  if (!Array.isArray(groups) || new Set(groups.map((group) => group.id)).size !== groups.length || c.featured.some((project) => !groups.some((group) => group.id === project.group))) throw new Error('Invalid work categories.');
  const version = (file) => createHash('sha256').update(fs.readFileSync(path.join(here, file))).digest('hex').slice(0, 12);
  const styles = `assets/site.css?v=${version('assets/site.css')}`;
  const script = `assets/site.js?v=${version('assets/site.js')}`;
  const projectIcon = (project, size = 44) => project?.icon ? `<img class="project-icon" src="${esc(project.icon)}?v=${version(project.icon)}" width="${size}" height="${size}" alt="" decoding="async">` : '';
  const head = (title, description, prefix = '/') => `<meta charset="utf-8"><meta name="viewport" content="width=device-width, initial-scale=1">
<title>${esc(title)}</title><meta name="description" content="${esc(description)}">
<meta name="theme-color" content="#f7f7f2"><link rel="icon" href="${prefix}assets/favicon.svg" type="image/svg+xml">
<script>${themeInit}</script><link rel="stylesheet" href="${prefix}${styles}"><link rel="stylesheet" href="/assets/projects.css?v=${version('assets/projects.css')}"><script src="${prefix}${script}" defer></script>`;
  if (c.featured.some(p => !/^[a-z0-9]+(?:-[a-z0-9]+)*$/.test(p.id)) || new Set(c.featured.map(p=>p.id)).size !== c.featured.length) throw new Error('Invalid project identities.');
  const highlights = c.startHere.map(route => c.featured.find(p=>p.id===route.id));
  if (highlights.length !== 3 || highlights.some(p=>!p) || new Set(highlights.map(p=>p.id)).size !== 3) throw new Error('Choose three distinct highlighted projects.');
  const project = projectRenderer(c, here, version, repoFact);
  const entries = c.featured.map(p=>({id:p.id,group:p.group,searchText:[p.title,p.oneLiner,p.category,p.status,...p.stack].join(' '),html:project.card(p)}));
  const catalog = JSON.stringify({groups,projects:entries});
  const catalogVersion = createHash('sha256').update(catalog).digest('hex').slice(0,12);
  const cards = highlights.map(project.card).join('\n');
  const history = c.history.filter((era) => era.items.length).map((era) => `<details class="era"><summary><h3>${esc(era.era)}</h3><span class="count">${era.items.length} ${era.items.length === 1 ? 'Project' : 'Projects'}</span></summary><div class="era-body">${era.note ? `<p>${md(era.note)}</p>` : ''}<ul>${era.items.map((item) => `<li><a href="https://github.com/${esc(c.handle)}/${esc(item.repo)}">${esc(item.name || item.repo)} <span aria-hidden="true">↗</span></a><p>${md(item.line)}</p></li>`).join('')}</ul></div></details>`).join('\n');
  const contact = `<a class="button primary" href="mailto:${esc(c.links.email)}">Get in Touch <span aria-hidden="true">&nbsp;↗</span></a><a class="button" href="${esc(c.links.github)}">GitHub <span aria-hidden="true">&nbsp;↗</span></a>${c.links.linkedin ? `<a class="button" href="${esc(c.links.linkedin)}">LinkedIn</a>` : ''}`;
  const html = `<!doctype html>
<html lang="en"><head>${head(`${c.name} — ${c.headline}`, c.tagline)}
<meta property="og:title" content="${esc(c.name)} — ${esc(c.headline)}"><meta property="og:description" content="${esc(c.tagline)}">
<meta property="og:image" content="${esc(c.siteUrl)}assets/shots/car-tco-compare.png"><meta property="og:type" content="website"><meta property="og:url" content="${esc(c.siteUrl)}"><link rel="canonical" href="${esc(c.siteUrl)}">
</head><body id="top"><a class="skip" href="#main">Skip to Content</a>
<header class="site-header"><div class="shell topbar"><a class="brand" href="#top" aria-label="${esc(c.name)}, Back to Top">${esc(c.name)}</a>
<nav aria-label="Portfolio Sections"><a href="#work">Work</a><a href="#how">Approach</a><a href="#skills">Skills</a><a href="#history">History</a><a href="#contact">Contact</a></nav>
<div class="theme-picker" role="group" aria-label="Color Theme"><button type="button" data-set-theme="light" aria-pressed="false">Light</button><button type="button" data-set-theme="dark" aria-pressed="false">Dark</button></div></div></header>
<div class="hero-band"><div class="shell hero"><div><p class="eyebrow">${esc(c.positioning)}</p><h1>${esc(c.headline).replace('. ', '.<br>')}</h1><p class="bio">${md(c.bio)}</p><div class="actions"><a class="button primary" href="#work">Explore Selected Work <span aria-hidden="true">&nbsp;↓</span></a><a class="hero-contact" href="mailto:${esc(c.links.email)}">Get in Touch <span aria-hidden="true">↗</span></a></div></div>
<aside class="intro-note" aria-label="Suggested Starting Points"><p class="small-label">Three Places to Start</p>${c.startHere.map((route, i) => `<a class="start-link" href="/projects/${esc(route.id)}/"><span class="start-index">0${i + 1}</span><span><small>${esc(route.label)}</small><strong class="start-project">${projectIcon(c.featured.find(p => p.id === route.id), 28)}<span>${esc(route.description)}</span></strong><span class="start-detail">${esc(route.detail)}</span></span><span class="start-arrow" aria-hidden="true">↗</span></a>`).join('')}</aside></div><div class="shell hero-foot"><span>Independent Projects by Xu Zhou (Lukas)</span><span>Mobile · Web · Desktop · Developer Tools</span></div></div>
<main class="shell" id="main"><section class="section" id="work" aria-labelledby="work-heading"><div class="section-head"><div><p class="section-kicker">A Few Places to Start</p><h2 id="work-heading">Selected Work</h2><p>Three builds across mobile products, data, and AI workflows. Open a project for its decisions and evidence.</p></div></div><div class="project-grid highlights-grid">${cards}</div><div class="library-cta"><a class="button primary" href="/projects/">Explore All ${c.featured.length} Projects <span aria-hidden="true">↗</span></a><p>Consumer Apps · AI Tools · Knowledge &amp; Productivity</p></div></section>
<script type="application/json" id="project-ids">${JSON.stringify(c.featured.map(p=>p.id))}</script>
<section class="section" id="how" aria-labelledby="how-heading"><div class="section-head"><div><h2 id="how-heading">How I Build</h2><p>${esc(c.howIBuild.intro)}</p></div></div><div class="approach">${c.howIBuild.steps.map((step, i) => `<article><span class="step">0${i + 1}</span><h3>${esc(step.title)}</h3><p>${md(step.body)}</p></article>`).join('')}</div></section>
<section class="section" id="skills" aria-labelledby="skills-heading"><div class="section-head"><div><h2 id="skills-heading">What I Bring</h2><p>Hands-on experience building with AI, a data science foundation, and product judgment.</p></div></div><div class="skills">${Object.entries(c.skills).map(([title, items]) => `<article><h3>${esc(title)}</h3><ul>${items.map((item) => `<li>${esc(item)}</li>`).join('')}</ul></article>`).join('')}</div><p class="stacks">${esc(c.stacks)}</p></section>
<section class="section" id="history" aria-labelledby="history-heading"><div class="section-head"><div><h2 id="history-heading">Earlier Work</h2><p>The experiments and data projects behind how I think today. Browse by category.</p></div></div><div class="history">${history}</div></section>
<section class="contact" id="contact" aria-labelledby="contact-heading"><div><p class="section-kicker">Continue the Conversation</p><h2 id="contact-heading">Let’s Build Something Useful</h2><p>${esc(c.contactIntro)}</p></div><div class="actions">${contact}</div></section></main>
<footer class="shell"><a class="back-top" href="#top">Back to Top ↑</a><p>${esc(c.name)} · <a href="mailto:${esc(c.links.email)}">${esc(c.links.email)}</a></p><p>${md(c.footer)} · Updated ${esc(c.updated)}.</p></footer></body></html>\n`;
  const notFound = `<!doctype html><html lang="en"><head>${head(`Page Not Found — ${c.name}`, 'Return to the portfolio.', '/')}</head><body><main class="shell error-page"><p class="eyebrow">404</p><h1>Page Not Found</h1><p>That page does not exist.</p><div class="actions"><a class="button primary" href="${esc(c.siteUrl)}">Back to the Portfolio</a></div></main></body></html>\n`;
  const output = { 'index.html': html.replace(/^[\t ]+$/gm, ''), '404.html': notFound, '.nojekyll': '', 'robots.txt': `User-agent: *\nAllow: /\nSitemap: ${c.siteUrl}sitemap.xml\n`, 'assets/project-catalog.json': catalog };
  const page = (title, description, body, route, scripts='') => `<!doctype html><html lang="en"><head>${head(title, description)}<link rel="canonical" href="${esc(c.siteUrl+route)}"><meta property="og:title" content="${esc(title)}"><meta property="og:description" content="${esc(description)}">${scripts}</head><body id="top"><a class="skip" href="#main">Skip to Content</a><header class="site-header"><div class="shell topbar"><a class="brand" href="/">${esc(c.name)}</a><nav aria-label="Portfolio Sections"><a href="/projects/" aria-current="page">Work</a><a href="/#how">Approach</a><a href="/#skills">Skills</a><a href="/#contact">Contact</a></nav><div class="theme-picker" role="group" aria-label="Color Theme"><button type="button" data-set-theme="light" aria-pressed="false">Light</button><button type="button" data-set-theme="dark" aria-pressed="false">Dark</button></div></div></header><main class="shell collection-page" id="main">${body}</main><footer class="shell"><a href="/#contact">Get in Touch</a><p>${esc(c.name)} · Independent Projects</p></footer></body></html>\n`;
  const routes = [''];
  for (let number=1;number<=Math.max(1,Math.ceil(entries.length/PAGE_SIZE));number++) {
    const route = number===1?'projects/':`projects/page/${number}/`;
    routes.push(route);
    const scripts = `<script type="module" src="/assets/library.js?v=${version('assets/library.js')}"></script>`;
    output[route+'index.html']=page('All Projects — '+c.name,'Browse the full collection of products, AI tools, and knowledge systems.',renderLibrary(c,entries,number,catalogVersion,version('assets/project-library.mjs')),route,scripts);
  }
  for (const p of c.featured) {
    const route = `projects/${p.id}/`;
    routes.push(route);
    output[route+'index.html']=page(p.title+' — '+c.name,p.oneLiner,project.detail(p),route);
  }
  output['sitemap.xml']=`<?xml version="1.0" encoding="UTF-8"?>\n<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">${routes.map(route=>`<url><loc>${esc(c.siteUrl+route)}</loc><lastmod>${esc(c.updated)}</lastmod></url>`).join('')}</urlset>\n`;
  return output;
}
