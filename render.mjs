import fs from 'node:fs';
import path from 'node:path';
import { createHash } from 'node:crypto';

export const esc = (s) => String(s ?? '').replace(/[&<>"']/g, (c) => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' }[c]));
const md = (s) => esc(s).replace(/\*\*(.+?)\*\*/g, '<b>$1</b>').replace(/`([^`]+)`/g, '<code>$1</code>').replace(/\[([^\]]+)\]\((https?:[^)]+|mailto:[^)]+)\)/g, '<a href="$2">$1</a>');
const themeInit = `(function(){var t;try{t=localStorage.getItem('theme')}catch(e){}if(t!=='light'&&t!=='dark')t=matchMedia('(prefers-color-scheme: dark)').matches?'dark':'light';document.documentElement.dataset.theme=t})();`;

export function render(c, here, repoFact = () => null) {
  const version = (file) => createHash('sha256').update(fs.readFileSync(path.join(here, file))).digest('hex').slice(0, 12);
  const styles = `assets/site.css?v=${version('assets/site.css')}`;
  const script = `assets/site.js?v=${version('assets/site.js')}`;
  const head = (title, description, prefix = '') => `<meta charset="utf-8"><meta name="viewport" content="width=device-width, initial-scale=1">
<title>${esc(title)}</title><meta name="description" content="${esc(description)}">
<meta name="theme-color" content="#f4f5f2"><link rel="icon" href="${prefix}assets/favicon.svg" type="image/svg+xml">
<script>${themeInit}</script><link rel="stylesheet" href="${prefix}${styles}"><script src="${prefix}${script}" defer></script>`;
  const cards = c.featured.map((p, i) => {
    const shot = `assets/shots/${p.id}.png`;
    if (p.screenshot && !fs.existsSync(path.join(here, shot))) throw new Error(`Missing reviewed screenshot: ${shot}`);
    const dims = { width: 1280, height: 800, ...p.shot };
    const f = repoFact(p.id);
    return `<article class="project" id="${esc(p.id)}" aria-labelledby="title-${esc(p.id)}">
  <div class="project-top">
    ${p.screenshot ? `<figure class="shot"><img src="${shot}" alt="${esc(p.title)} interface preview" width="${dims.width}" height="${dims.height}" ${i ? 'loading="lazy"' : 'fetchpriority="high"'}></figure>` : ''}
    <div><p class="category">${esc(p.category)}</p><div class="project-title"><h3 id="title-${esc(p.id)}">${esc(p.title)}</h3><span class="project-number">0${i + 1}</span></div>
      <p class="tag">${md(p.oneLiner)}</p><ul class="chips">${p.highlights.map((s) => `<li>${esc(s)}</li>`).join('')}</ul>
      <div class="actions"><a class="button" href="${esc(p.live)}" aria-label="Open App: ${esc(p.title)}">Open App <span aria-hidden="true">&nbsp;↗</span></a><a class="source" href="${esc(p.repo)}" aria-label="View Source: ${esc(p.title)}">View Source <span aria-hidden="true">↗</span></a></div>
    </div>
  </div>
  <details class="case-study"><summary>Read Case Study<span class="sr-only">: ${esc(p.title)}</span></summary><div class="detail"><dl>
    <dt>Problem</dt><dd>${md(p.problem)}</dd><dt>What I Built</dt><dd>${md(p.built)}</dd>
    <dt>How It Works</dt><dd>${md(p.how)}</dd><dt>Where It Stands</dt><dd>${md(p.outcome)}</dd>
    <dt>Evidence and Limits</dt><dd><ul>${p.honest.map((h) => `<li>${md(h)}</li>`).join('')}</ul></dd>
    <dt>Product Stack</dt><dd>${p.stack.map(esc).join(' · ')}</dd>
    ${f?.pushedAt ? `<dt>Repository Updated</dt><dd>${esc(String(f.pushedAt).slice(0, 10))} (recorded in the supplied facts snapshot)</dd>` : ''}
  </dl>${p.caption || p.caveat ? `<p class="caveat">${md([p.caption, p.caveat].filter(Boolean).join(' '))}</p>` : ''}</div></details>
</article>`;
  }).join('\n');
  const history = c.history.filter((era) => era.items.length).map((era) => `<details class="era"><summary><h3>${esc(era.era)}</h3><span class="count">${era.items.length} ${era.items.length === 1 ? 'Project' : 'Projects'}</span></summary><div class="era-body">${era.note ? `<p>${md(era.note)}</p>` : ''}<ul>${era.items.map((item) => `<li><a href="https://github.com/${esc(c.handle)}/${esc(item.repo)}">${esc(item.name || item.repo)} <span aria-hidden="true">↗</span></a><p>${md(item.line)}</p></li>`).join('')}</ul></div></details>`).join('\n');
  const contact = `<a class="button primary" href="mailto:${esc(c.links.email)}">Get in Touch <span aria-hidden="true">&nbsp;↗</span></a><a class="button" href="${esc(c.links.github)}">GitHub <span aria-hidden="true">&nbsp;↗</span></a>${c.links.linkedin ? `<a class="button" href="${esc(c.links.linkedin)}">LinkedIn</a>` : ''}`;
  const html = `<!doctype html>
<html lang="en"><head>${head(`${c.name} — ${c.headline}`, c.tagline)}
<meta property="og:title" content="${esc(c.name)} — ${esc(c.headline)}"><meta property="og:description" content="${esc(c.tagline)}">
<meta property="og:image" content="${esc(c.siteUrl)}assets/shots/car-tco-compare.png"><meta property="og:type" content="website"><meta property="og:url" content="${esc(c.siteUrl)}"><link rel="canonical" href="${esc(c.siteUrl)}">
</head><body><a class="skip" href="#main">Skip to Content</a>
<header class="shell topbar" id="top"><a class="brand" href="#top" aria-label="Lukas, Back to Top">Lukas<span aria-hidden="true">.</span></a>
<nav aria-label="Portfolio Sections"><a href="#work">Work</a><a href="#how">Approach</a><a href="#skills">Skills</a><a href="#history">History</a></nav>
<div class="theme-picker" role="group" aria-label="Color Theme"><button type="button" data-set-theme="light" aria-pressed="false">Light</button><button type="button" data-set-theme="dark" aria-pressed="false">Dark</button></div></header>
<div class="shell hero"><div><p class="eyebrow">${esc(c.name)} · Product, Data & AI</p><h1>${esc(c.headline)}</h1><p class="bio">${md(c.bio)}</p><div class="actions"><a class="button primary" href="#work">Explore My Work <span aria-hidden="true">&nbsp;↓</span></a><a class="button" href="mailto:${esc(c.links.email)}">Get in Touch</a></div></div>
<aside class="intro-note" aria-label="At a Glance"><p><strong>From Decision to Product</strong>Product direction, data models, app architecture, and launch.</p><p><strong>Built with AI Agents</strong>I direct the work, review the decisions, and verify the result.</p></aside></div>
<main class="shell" id="main"><section class="section" id="work" aria-labelledby="work-heading"><div class="section-head"><div><h2 id="work-heading">Shipped Products</h2><p>Useful tools for real decisions. Open an app, or expand a case study for the thinking behind it.</p></div><button class="button" id="expand-all" type="button" hidden>Expand All</button></div><div class="products">${cards}</div><p class="evidence-date">Project evidence recorded ${esc(c.evidenceAsOf)}. Screenshots are previews; cost figures are estimates.</p></section>
<section class="section" id="how" aria-labelledby="how-heading"><div class="section-head"><div><h2 id="how-heading">How I Build</h2><p>${esc(c.howIBuild.intro)}</p></div></div><div class="approach">${c.howIBuild.steps.map((step, i) => `<article><span class="step">0${i + 1}</span><h3>${esc(step.title)}</h3><p>${md(step.body)}</p></article>`).join('')}</div></section>
<section class="section" id="skills" aria-labelledby="skills-heading"><div class="section-head"><div><h2 id="skills-heading">What I Bring</h2><p>Product judgment, a data science foundation, and hands-on experience building with AI.</p></div></div><div class="skills">${Object.entries(c.skills).map(([title, items]) => `<article><h3>${esc(title)}</h3><ul>${items.map((item) => `<li>${esc(item)}</li>`).join('')}</ul></article>`).join('')}</div><p class="stacks">${esc(c.stacks)}</p></section>
<section class="section" id="history" aria-labelledby="history-heading"><div class="section-head"><div><h2 id="history-heading">Earlier Work</h2><p>The experiments and data projects behind how I think today. Browse by category.</p></div></div><div class="history">${history}</div></section>
<section class="contact" aria-labelledby="contact-heading"><div><h2 id="contact-heading">Let’s Build Something Useful</h2><p>Happy to walk through the products, the decisions, and what I learned.</p></div><div class="actions">${contact}</div></section></main>
<footer class="shell"><p>${esc(c.name)} · <a href="mailto:${esc(c.links.email)}">${esc(c.links.email)}</a></p><p>${md(c.footer)} · Updated ${esc(c.updated)}.</p></footer></body></html>\n`;
  const notFound = `<!doctype html><html lang="en"><head>${head(`Page Not Found — ${c.name}`, 'Return to the portfolio.', '/')}</head><body><main class="shell error-page"><p class="eyebrow">404</p><h1>Page Not Found</h1><p>That page does not exist.</p><div class="actions"><a class="button primary" href="${esc(c.siteUrl)}">Back to the Portfolio</a></div></main></body></html>\n`;
  return { 'index.html': html.replace(/^[\t ]+$/gm, ''), '404.html': notFound, '.nojekyll': '', 'robots.txt': `User-agent: *\nAllow: /\nSitemap: ${c.siteUrl}sitemap.xml\n`, 'sitemap.xml': `<?xml version="1.0" encoding="UTF-8"?>\n<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9"><url><loc>${esc(c.siteUrl)}</loc><lastmod>${esc(c.updated)}</lastmod></url></urlset>\n` };
}
