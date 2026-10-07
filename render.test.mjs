import test from 'node:test';
import assert from 'node:assert/strict';
import fs from 'node:fs';
import { fileURLToPath } from 'node:url';
import { render } from './render.mjs';

const here = fileURLToPath(new URL('.', import.meta.url));
const content = JSON.parse(fs.readFileSync(new URL('content/portfolio.json', import.meta.url), 'utf8'));
const html = render(content, here)['index.html'];
test('case-study-only projects do not fabricate source or demo destinations', () => {
  for (const id of ['multi-agent-build-orchestrator', 'ai-usage-tracker', 'project-workspace', 'knowledge-learning-system']) {
    const card = html.match(new RegExp(`<article class="project" id="${id}"[\\s\\S]+?</article>`))?.[0];
    assert(card);
    assert.doesNotMatch(card, /href=|<img|undefined|null/);
    assert.match(card, /<details class="case-study"><summary>Read Case Study/);
    assert.match(card, /illustration/i);
    assert.match(card, /2026-10-06/);
  }
});
test('existing public apps retain demos and source actions', () => {
  assert.equal((html.match(/aria-label="Open App:/g) || []).length, 3);
  assert.equal((html.match(/aria-label="View Source:/g) || []).length, 3);
  assert.equal((html.match(/<details class="case-study">/g) || []).length, 7);
  assert.match(html, />Selected Work</);
  assert.doesNotMatch(html, /Shipped Products|<details[^>]*\bopen\b/);
});

test('every project belongs to a category and has a valid jump destination', () => {
  for (const group of content.workGroups) {
    const projects = content.featured.filter((project) => project.group === group.id);
    assert(projects.length > 0);
    assert.match(html, new RegExp(`data-work-filter="${group.id}" aria-pressed="false"`));
    for (const project of projects) {
      assert.match(html, new RegExp(`id="${project.id}" data-group="${group.id}"`));
      assert.match(html, new RegExp(`<option value="${project.id}">`));
    }
  }
  assert.match(html, /<div class="work-tools" hidden>/);
  assert.match(html, /id="work-count" role="status" aria-live="polite"/);
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
  assert.match(html, /2026-10-01/);
  assert.match(html, /Awaiting Live Data/);
  assert.match(html, /Setup Pending/);
  assert.match(html, /incomplete integrations/);
  assert.match(html, /no account or usage data/);
});
