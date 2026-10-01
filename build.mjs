// portfolio/build.mjs — generates the public portfolio page (xzhou110.github.io). Node ≥ 20, no dependencies.
//
// Declared content (curated, employer-facing) lives in content/portfolio.json. Observed facts (live URL
// status, repo language / last push / stars) come from a facts snapshot passed with --facts <path> —
// PUBLIC repos only (the snapshot's shape: {projects:[{name, live, github:{private,pushedAt,language,url}, url:{ok,code}}], historical:[...]}). Screenshots are taken with headless Chrome. The output is a single static index.html
// plus assets/, served by GitHub Pages with no build step on GitHub's side.
//
// Privacy gate: the page can only contain what this script explicitly writes. Before writing, the HTML is
// checked against FORBIDDEN patterns (employer name, private repo names, local paths, session titles) and
// the global secret scanner; any hit aborts the build.
//
// Usage: node build.mjs [--facts <snapshot.json>] [--no-shots]
import fs from 'node:fs';
import path from 'node:path';
import os from 'node:os';
import { execFileSync, spawnSync } from 'node:child_process';
import { fileURLToPath } from 'node:url';

const HERE = path.dirname(fileURLToPath(import.meta.url));
const ARGS = process.argv.slice(2);
const argv = new Set(ARGS);
const argFacts = ARGS.includes('--facts') ? ARGS[ARGS.indexOf('--facts') + 1] : null;
const content = JSON.parse(fs.readFileSync(path.join(HERE, 'content', 'portfolio.json'), 'utf8'));
const cfg = content.build || {};
const STATE_PATH = argFacts || cfg.factsSnapshot || path.join(HERE, 'facts.local.json'); // never committed; pass --facts to point at your snapshot
const CHROME = cfg.chrome || 'C:/Program Files/Google/Chrome/Application/chrome.exe';
const SCANNER = cfg.secretScanner || path.join(os.homedir(), '.claude', 'git-hooks', 'secret-scan.mjs'); // the global git-hooks scanner, when installed
const OUT = path.join(HERE, 'index.html');
const SHOTS = path.join(HERE, 'assets', 'shots');

const esc = (s) => String(s ?? '').replace(/[&<>"']/g, (c) => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' }[c]));
const md = (s) => esc(s).replace(/\*\*(.+?)\*\*/g, '<b>$1</b>').replace(/`([^`]+)`/g, '<code>$1</code>').replace(/\[([^\]]+)\]\((https?:[^)]+)\)/g, '<a href="$2" target="_blank" rel="noopener">$1</a>');

// ---------- observed facts: public subset of the facts snapshot ----------
let state = null;
try { state = JSON.parse(fs.readFileSync(STATE_PATH, 'utf8')); } catch { console.warn(`no facts snapshot at ${STATE_PATH} — observed facts (live status, language, last push) will be blank`); }
const publicRepos = new Map();
const privateNames = new Set();
if (state) {
  for (const p of state.projects || []) {
    if (p.github && p.github.private) privateNames.add(p.name);
    if (p.github && !p.github.private) publicRepos.set(p.name, { pushedAt: p.github.pushedAt, language: p.github.language, url: p.github.url, live: p.live, up: p.url ? p.url.ok : null, code: p.url ? p.url.code : null });
    else if (!p.github) privateNames.add(p.name); // no public record → treat as private
  }
  for (const h of state.historical || []) {
    if (h.private) privateNames.add(h.name);
    else publicRepos.set(h.name, { pushedAt: h.pushedAt, language: h.language, url: h.url, stars: h.stars });
  }
}
const repoFact = (name) => publicRepos.get(name) || null;

// ---------- screenshots ----------
// The viewport IS the screenshot, so a per-app `shot.height` crops away card bodies that would expose
// addresses, phone numbers or the owner's search area — these are single-user tools seeded with real listings.
function screenshot(url, file, shot = {}) {
  if (argv.has('--no-shots')) return fs.existsSync(file);
  fs.mkdirSync(path.dirname(file), { recursive: true });
  const profile = path.join(process.env.TEMP || HERE, 'portfolio-chrome-profile');
  const w = shot.width || cfg.shotWidth || 1280, h = shot.height || cfg.shotHeight || 800;
  const r = spawnSync(CHROME, ['--headless=new', '--disable-gpu', '--no-first-run', '--no-default-browser-check', `--user-data-dir=${profile}`, '--hide-scrollbars', `--window-size=${w},${h}`, `--virtual-time-budget=${cfg.shotBudgetMs || 8000}`, `--screenshot=${file}`, url], { encoding: 'utf8', timeout: 60000, windowsHide: true });
  const ok = fs.existsSync(file) && fs.statSync(file).size > 10000;
  console.log(`  shot ${ok ? 'ok ' : 'FAILED'} ${url} → ${path.relative(HERE, file)}${ok ? ` (${Math.round(fs.statSync(file).size / 1024)} KB)` : ' ' + (r.stderr || '').split('\n').slice(-2).join(' ')}`);
  return ok;
}

// ---------- page ----------
function card(p) {
  const f = repoFact(p.id) || {};
  const shot = p.screenshot ? path.join(SHOTS, `${p.id}.png`) : null;
  const dims = Object.assign({ width: cfg.shotWidth || 1280, height: cfg.shotHeight || 800 }, p.shot || {});
  const hasShot = shot && screenshot(p.live, shot, dims);
  const liveNote = f.up === true ? 'live' : f.up === false ? 'currently down' : 'live';
  // Each product is a <details>: tucked in by default (visual, title, one-liner, stack, links), the case study inside.
  return `<details class="project" id="${esc(p.id)}">
    <summary>
      ${hasShot ? `<figure class="shot"><img src="assets/shots/${esc(p.id)}.png" alt="${esc(p.title)} — screenshot" loading="lazy" width="${dims.width}" height="${dims.height}">${p.caption ? `<figcaption>${md(p.caption)}</figcaption>` : ''}</figure>` : ''}
      <div class="body">
        <h3>${esc(p.title)} <span class="status">${esc(liveNote)}</span></h3>
        <p class="tag">${md(p.oneLiner)}</p>
        ${p.stack && p.stack.length ? `<ul class="chips">${p.stack.map((s) => `<li>${esc(s)}</li>`).join('')}</ul>` : ''}
        <p class="links"><a href="${esc(p.live)}" target="_blank" rel="noopener">Open the app ↗</a>${p.repo ? ` · <a href="${esc(p.repo)}" target="_blank" rel="noopener">Source${f.language ? ` (${esc(f.language)})` : ''} ↗</a>` : ''}${f.pushedAt ? ` <span class="muted">· updated ${esc(String(f.pushedAt).slice(0, 7))}</span>` : ''}<span class="more" aria-hidden="true"></span></p>
      </div>
    </summary>
    <div class="detail">
      <dl>
        <dt>Problem</dt><dd>${md(p.problem)}</dd>
        <dt>What I built</dt><dd>${md(p.built)}</dd>
        <dt>How</dt><dd>${md(p.how)}</dd>
        ${p.outcome ? `<dt>Where it stands</dt><dd>${md(p.outcome)}</dd>` : ''}
        ${p.honest && p.honest.length ? `<dt>Kept honest by</dt><dd><ul class="honest">${p.honest.map((h) => `<li>${md(h)}</li>`).join('')}</ul></dd>` : ''}
      </dl>
      ${p.caveat ? `<p class="caveat">${md(p.caveat)}</p>` : ''}
    </div></details>`;
}

function history() {
  return (content.history || []).map((era) => `<section class="era"><h3>${esc(era.era)} <span class="muted">${esc(era.years)}</span></h3>${era.note ? `<p class="muted">${md(era.note)}</p>` : ''}<ul>${(era.items || []).map((it) => {
    const f = repoFact(it.repo) || {};
    const link = f.url || (it.repo ? `https://github.com/${content.handle}/${it.repo}` : null);
    return `<li>${link ? `<a href="${esc(link)}" target="_blank" rel="noopener">${esc(it.name || it.repo)}</a>` : esc(it.name)}${f.language ? ` <span class="muted">${esc(f.language)}</span>` : ''} — ${md(it.line)}</li>`;
  }).join('')}</ul></section>`).join('');
}

function page() {
  const c = content;
  const featured = (c.featured || []).map(card).join('');
  const hib = c.howIBuild || null;
  const skills = c.skills || {};
  const links = c.links || {};
  const ogShot = (c.featured || []).find((p) => p.screenshot && fs.existsSync(path.join(SHOTS, `${p.id}.png`)));
  return `<!doctype html>
<html lang="en">
<head>
<meta charset="utf-8">
<meta name="viewport" content="width=device-width, initial-scale=1">
<title>${esc(c.name)} — ${esc(c.headline)}</title>
<meta name="description" content="${esc(c.tagline)}">
<meta property="og:title" content="${esc(c.name)} — ${esc(c.headline)}">
<meta property="og:description" content="${esc(c.tagline)}">
${ogShot ? `<meta property="og:image" content="${esc(c.siteUrl)}assets/shots/${esc(ogShot.id)}.png">` : ''}
<meta property="og:type" content="website">
<meta property="og:url" content="${esc(c.siteUrl)}">
<link rel="canonical" href="${esc(c.siteUrl)}">
<meta name="theme-color" content="#1f4fd1">
<link rel="icon" href="assets/favicon.svg" type="image/svg+xml">
<script>(function(){try{var t=localStorage.getItem('theme');if(t!=='light'&&t!=='dark'){t=matchMedia('(prefers-color-scheme: dark)').matches?'dark':'light'}document.documentElement.dataset.theme=t}catch(e){}})();</script>
<style>
:root{--ink:#172033;--muted:#5b6678;--line:#e3e8ef;--surface:#fff;--bg:#f6f8fb;--accent:#1f4fd1;--accent-ink:#fff;--chip:#eef2f8;--good:#157a3a;--radius:14px;--max:1040px}
:root[data-theme=dark]{--ink:#e8edf4;--muted:#a7b1c0;--line:#2a3442;--surface:#141b26;--bg:#0e131b;--accent:#6b93ff;--accent-ink:#0e131b;--chip:#1d2634;--good:#5fd38a}
*{box-sizing:border-box}html{scroll-behavior:smooth}
body{margin:0;background:var(--bg);color:var(--ink);font:16px/1.6 -apple-system,BlinkMacSystemFont,"Segoe UI",Roboto,Helvetica,Arial,sans-serif}
a{color:var(--accent);text-decoration:none}a:hover{text-decoration:underline}
main{max-width:var(--max);margin:0 auto;padding:0 22px 80px}
header.hero{max-width:var(--max);margin:0 auto;padding:56px 22px 28px;display:grid;gap:14px}
.hero h1{margin:0;font-size:clamp(28px,4.5vw,42px);letter-spacing:-.02em;line-height:1.15}
.hero .headline{font-size:clamp(18px,2.4vw,22px);color:var(--muted);margin:0}
.hero .bio{max-width:720px;margin:6px 0 0;font-size:17px}
.hero nav{display:flex;flex-wrap:wrap;gap:10px 18px;align-items:center;font-weight:600}
.hero nav .theme{margin-left:auto;font:inherit;background:none;border:1px solid var(--line);border-radius:999px;padding:4px 12px;color:var(--muted);cursor:pointer}
h2{font-size:13px;letter-spacing:.08em;text-transform:uppercase;color:var(--muted);margin:46px 0 16px;display:flex;align-items:center;gap:10px}
h2::after{content:"";flex:1;height:1px;background:var(--line)}
.project{background:var(--surface);border:1px solid var(--line);border-radius:var(--radius);padding:18px;margin-bottom:18px;box-shadow:0 1px 2px rgba(20,30,45,.04),0 10px 30px rgba(20,30,45,.05)}
.project>summary{display:grid;grid-template-columns:minmax(0,1.05fr) minmax(0,1fr);gap:22px;cursor:pointer;list-style:none}
.project>summary::-webkit-details-marker{display:none}
.project .more::before{content:"Read the case study ▾";color:var(--accent);font-weight:600;margin-left:auto;white-space:nowrap}
.project[open] .more::before{content:"Tuck it away ▴"}
.project .links{display:flex;flex-wrap:wrap;gap:4px 10px;align-items:center}
.project .detail{margin-top:16px;padding-top:16px;border-top:1px solid var(--line)}
.section-head{display:flex;align-items:center;gap:12px}.section-head h2{flex:1}.section-head button{font:inherit;font-size:12.5px;font-weight:600;color:var(--muted);background:none;border:1px solid var(--line);border-radius:999px;padding:3px 11px;cursor:pointer}.section-head button:hover{color:var(--accent);border-color:var(--accent)}
.project .shot{margin:0}.project .shot img{display:block;width:100%;height:auto;border-radius:10px;border:1px solid var(--line)}
.project figcaption{font-size:12.5px;color:var(--muted);margin-top:6px}
.honest{margin:0;padding-left:18px}.honest li{margin:2px 0}
.hero .current{margin:0;color:var(--muted);font-size:15px}
.project h3{margin:0 0 4px;font-size:21px;display:flex;align-items:center;gap:10px;flex-wrap:wrap}
.project .status{font-size:11px;letter-spacing:.06em;text-transform:uppercase;color:var(--good);border:1px solid currentColor;border-radius:999px;padding:1px 8px}
.project .tag{margin:0 0 10px;color:var(--muted)}
.project dl{margin:0;display:grid;grid-template-columns:auto 1fr;gap:6px 12px;font-size:15px}
.project dt{color:var(--muted);font-weight:600;white-space:nowrap}.project dd{margin:0}
.chips{list-style:none;padding:0;margin:12px 0 0;display:flex;flex-wrap:wrap;gap:6px}
.chips li{font-size:12.5px;background:var(--chip);border-radius:999px;padding:2px 10px;color:var(--muted)}
.links{margin:12px 0 0;font-weight:600}.muted{color:var(--muted);font-weight:400}
.caveat{margin:10px 0 0;font-size:13px;color:var(--muted);border-left:3px solid var(--line);padding-left:10px}
.how{background:var(--surface);border:1px solid var(--line);border-radius:var(--radius);padding:20px 22px}
.how p{margin:0 0 12px}.how ul{margin:0;padding-left:20px}.how li{margin:4px 0}
.era{margin-bottom:18px}.era h3{margin:0 0 4px;font-size:17px}.era ul{margin:6px 0 0;padding-left:20px}.era li{margin:4px 0}
.skills{display:grid;grid-template-columns:repeat(auto-fit,minmax(min(240px,100%),1fr));gap:14px}
.skills div{background:var(--surface);border:1px solid var(--line);border-radius:var(--radius);padding:14px 16px}
.skills h3{margin:0 0 6px;font-size:14px;color:var(--muted);text-transform:uppercase;letter-spacing:.06em}
.skills ul{margin:0;padding-left:18px}
.stacks{margin:12px 0 0;font-size:14px}
footer{color:var(--muted);font-size:14px;margin-top:40px;border-top:1px solid var(--line);padding-top:16px}
@media (max-width:760px){.project>summary{grid-template-columns:1fr}.project dl{grid-template-columns:1fr;gap:2px 0}.project dt{margin-top:6px}}
@media (prefers-reduced-motion:reduce){html{scroll-behavior:auto}}
</style>
</head>
<body>
<header class="hero">
  <nav aria-label="Links">${links.github ? `<a href="${esc(links.github)}" target="_blank" rel="noopener">GitHub</a>` : ''}${links.linkedin ? `<a href="${esc(links.linkedin)}" target="_blank" rel="noopener">LinkedIn</a>` : ''}${links.email ? `<a href="mailto:${esc(links.email)}">Email</a>` : ''}<a href="#work">Work</a><a href="#history">History</a><button class="theme" type="button" id="theme">◐ theme</button></nav>
  <h1>${esc(c.name)}</h1>
  <p class="headline">${esc(c.headline)}</p>
  <p class="bio">${md(c.bio)}</p>
  ${c.current ? `<p class="current">${md(c.current)}</p>` : ''}
</header>
<main>
  <div class="section-head"><h2 id="work">Shipped products</h2><button type="button" id="expand-all">Expand all</button></div>
  ${featured}
  ${hib ? `<h2 id="how">${esc(hib.heading)}</h2><section class="how">${(hib.paragraphs || []).map((p) => `<p>${md(p)}</p>`).join('')}${hib.bullets && hib.bullets.length ? `<ul>${hib.bullets.map((b) => `<li>${md(b)}</li>`).join('')}</ul>` : ''}</section>` : ''}
  ${Object.keys(skills).length ? `<h2 id="skills">Skills</h2><section class="skills">${Object.entries(skills).map(([k, v]) => `<div><h3>${esc(k)}</h3><ul>${v.map((x) => `<li>${esc(x)}</li>`).join('')}</ul></div>`).join('')}</section>${c.stacks ? `<p class="stacks muted">${md(c.stacks)}</p>` : ''}` : ''}
  <h2 id="history">History</h2>
  ${history()}
  <footer>${md(c.footer || '')}${c.updated ? ` <span class="muted">Last updated ${esc(c.updated)}; counts and links are as of that date.</span>` : ''}</footer>
</main>
<script>document.getElementById('theme').onclick=function(){var r=document.documentElement,t=r.dataset.theme==='dark'?'light':'dark';r.dataset.theme=t;try{localStorage.setItem('theme',t)}catch(e){}};
document.querySelectorAll('.project summary a').forEach(function(a){a.addEventListener('click',function(e){e.stopPropagation()})});
var xa=document.getElementById('expand-all');if(xa){xa.onclick=function(){var ds=document.querySelectorAll('details.project'),open=![].every.call(ds,function(d){return d.open});ds.forEach(function(d){d.open=open});xa.textContent=open?'Collapse all':'Expand all'}}</script>
</body>
</html>
`;
}

// ---------- privacy gate ----------
function gate(html) {
  const problems = [];
  let local = []; try { local = JSON.parse(fs.readFileSync(path.join(HERE, 'gate.local.json'), 'utf8')).patterns.map((p) => [new RegExp(p, 'i'), 'local gate pattern']); } catch { console.warn('no gate.local.json — only the generic gate rules apply'); }
  const forbidden = [
    ...local,
    [/\\\\/, 'backslash path'],
    [/\bclaude-ai-summary\b/, 'vault internals'],
  ];
  const where = (re) => { const m = re.exec(html); if (!m) return ''; const i = m.index; return ` …${html.slice(Math.max(0, i - 60), i + 60).replace(/\s+/g, ' ')}…`; };
  for (const [re, why] of forbidden) if (re.test(html)) problems.push(`${why}: ${re}${where(re)}`);
  for (const name of privateNames) { const re = new RegExp(`github\\.com/${content.handle}/${name}\\b`, 'i'); if (re.test(html)) problems.push(`link to private repo: ${name}${where(re)}`); }
  for (const w of content.forbiddenWords || []) { const re = new RegExp(w, 'i'); if (re.test(html)) problems.push(`forbidden word: ${w}${where(re)}`); }
  return problems;
}

// ---------- main ----------
console.log('portfolio build');
const html = page();
const problems = gate(html);
if (problems.length) { console.error('PRIVACY GATE FAILED — nothing written:\n  ' + problems.join('\n  ')); process.exit(1); }
fs.writeFileSync(OUT + '.tmp', html, 'utf8'); fs.renameSync(OUT + '.tmp', OUT);
// companions GitHub Pages serves from the root: no Jekyll processing, a sitemap, robots, a plain 404
fs.writeFileSync(path.join(HERE, '.nojekyll'), '');
fs.writeFileSync(path.join(HERE, 'robots.txt'), `User-agent: *\nAllow: /\nSitemap: ${content.siteUrl}sitemap.xml\n`);
fs.writeFileSync(path.join(HERE, 'sitemap.xml'), `<?xml version="1.0" encoding="UTF-8"?>\n<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9"><url><loc>${content.siteUrl}</loc>${content.updated ? `<lastmod>${content.updated}</lastmod>` : ''}</url></urlset>\n`);
fs.writeFileSync(path.join(HERE, '404.html'), `<!doctype html><html lang="en"><head><meta charset="utf-8"><meta name="viewport" content="width=device-width, initial-scale=1"><title>Not found — ${esc(content.name)}</title><style>body{font:16px/1.6 -apple-system,BlinkMacSystemFont,"Segoe UI",Roboto,Helvetica,Arial,sans-serif;max-width:640px;margin:80px auto;padding:0 22px;color:#172033}a{color:#1f4fd1}</style></head><body><h1>Not found</h1><p>That page does not exist. <a href="${esc(content.siteUrl)}">Back to the portfolio</a>.</p></body></html>\n`);
if (fs.existsSync(SCANNER)) {
  try { execFileSync(process.execPath, [SCANNER, '--files', OUT], { stdio: 'inherit' }); } catch { console.error('secret scanner flagged the output — fix before publishing'); process.exit(1); }
} else console.warn(`  secret scanner not found at ${path.relative(HERE, SCANNER)} — skipped (set build.secretScanner in content/portfolio.json)`);
console.log(`  wrote ${path.relative(HERE, OUT)} (${Math.round(html.length / 1024)} KB) · ${(content.featured || []).length} featured · ${(content.history || []).reduce((n, e) => n + (e.items || []).length, 0)} history items · gate clean`);
