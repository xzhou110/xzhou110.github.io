import test from 'node:test';
import assert from 'node:assert/strict';
import fs from 'node:fs';
import { fileURLToPath } from 'node:url';
import { render } from './render.mjs';

const here = fileURLToPath(new URL('.', import.meta.url));
const content = JSON.parse(fs.readFileSync(new URL('content/portfolio.json', import.meta.url), 'utf8'));
const output = render(content, here);
const html = output['index.html'];
const detail = id => output[`projects/${id}/index.html`];
test('case-study-only projects do not fabricate source or demo destinations', () => {
  for (const id of ['dream-laws', 'creator-advisors', 'multi-agent-build-orchestrator', 'project-workspace', 'knowledge-learning-system']) {
    const card = detail(id);
    assert(card);
    assert.doesNotMatch(card, /aria-label="(?:Open App|View Source):|assets\/shots\/|undefined|null/);
    assert.match(card, /The Case Study/);
    assert.match(card, /illustration/i);
    assert.match(card, /2026-10-27/);
  }
});
// Released on the App Store on 2026-11-05: the one public destination is the listing; the source stays private.
test('XuSeak To-Do links to its App Store page and to nothing else', () => {
  const card = detail('xuseak-to-do');
  assert(card);
  assert.match(card, /href="https:\/\/apps\.apple\.com\/us\/app\/xuseak-to-do\/id6825624634"/);
  assert.match(card, /aria-label="Open App: XuSeak To-Do"/);
  assert.doesNotMatch(card, /aria-label="View Source:|assets\/shots\/|undefined|null/);
  assert.match(card, /On the App Store/);
  assert.match(card, /illustration/i);
  assert.match(card, /2026-11-05/);
});
test('existing public apps retain demos and source actions', () => {
  const cases = content.featured.map(p=>detail(p.id)).join('');
  assert.equal((cases.match(/aria-label="Open App:/g) || []).length, 4);
  assert.equal((cases.match(/aria-label="View Source:/g) || []).length, 5);
  assert.equal((cases.match(/class="case-page"/g) || []).length, 11);
  assert.match(html, />Selected Work</);
  assert.doesNotMatch(html, /Shipped Products|<details[^>]*\bopen\b/);
});

test('every project has a visual, a complete case and a reachable static library destination', () => {
  const library=output['projects/index.html']+output['projects/page/2/index.html'];
  const catalog=JSON.parse(output['assets/project-catalog.json']);
  assert.equal(catalog.projects.length,11);
  for (const group of content.workGroups) {
    const projects = content.featured.filter((project) => project.group === group.id);
    assert(projects.length > 0);
    for (const project of projects) {
      assert.match(library, new RegExp(`id="${project.id}" data-group="${group.id}"`));
      assert.match(library, new RegExp(`href="/projects/${project.id}/"`));
      assert.match(detail(project.id), /class="project-preview"/);
      assert.match(catalog.projects.find(p=>p.id===project.id).html, /class="project-preview"/);
    }
  }
  assert.equal((html.match(/class="project-card"/g)||[]).length,3);
  assert.equal((html.match(/class="project-preview"/g)||[]).length,3);
  assert.match(library, /id="library-count" role="status" aria-live="polite"/);
  assert.match(html, /href="#contact"/);
  assert.match(html, /id="contact"/);
});

test('invalid category mappings fail the build instead of hiding projects', () => {
  const invalid = structuredClone(content);
  invalid.featured[0].group = 'missing';
  assert.throws(() => render(invalid, here), /Invalid work categories/);
  const duplicate = structuredClone(content);
  duplicate.workGroups.push(duplicate.workGroups[0]);
  assert.throws(() => render(duplicate, here), /Invalid work categories/);
});
test('dates and unfinished provider integrations remain explicit', () => {
  const html = detail('ai-usage-tracker');
  assert.match(html, /2026-10-27/);
  assert.match(html, /Awaiting Live Data/);
  assert.match(html, /Setup Pending/);
  assert.match(html, /incomplete integrations/);
  assert.match(html, /no account or usage data/);
});

test('the owner\'s email address is never written into a page; Get in Touch carries its parts for a click', () => {
  const pages = Object.entries(output).filter(([name]) => name.endsWith('.html'));
  assert(pages.length > 10);
  for (const [name, page] of pages) {
    assert.doesNotMatch(page, /mailto:/i, name);
    assert.doesNotMatch(page, /[A-Za-z0-9._%+-]+@[A-Za-z0-9.-]+\.[a-z]{2,}/, name);
  }
  const mail = content.links.mail;
  assert.equal(mail.tag, 'portfolio');
  const attrs = 'data-mail-user="' + mail.user + '" data-mail-tag="portfolio" data-mail-domain="' + mail.domain + '"';
  assert.equal(html.split(attrs).length - 1, 2);
  assert.equal(detail('xuseak-to-do').split(attrs).length - 1, 1);
  assert.match(html, /<footer class="shell">[^]*?<a href="https:\/\/www\.linkedin\.com\/in\/[^"]+">LinkedIn<\/a>/);
  const script = fs.readFileSync(new URL('assets/site.js', import.meta.url), 'utf8');
  assert.match(script, /data-mail-user/);
});
