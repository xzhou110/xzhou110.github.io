import test from 'node:test';
import assert from 'node:assert/strict';
import fs from 'node:fs';
import os from 'node:os';
import path from 'node:path';
import { createHash } from 'node:crypto';
import { execFileSync, spawnSync } from 'node:child_process';
import { parsePatterns, assertCoverage, validateCandidate, publicFiles, stagedFiles } from './publication-gate.mjs';

const policy = {
  patterns: [/SYNTHETIC_PRIVATE_MARKER/i],
  scanner: {
    scanPath: (file) => file.startsWith('restricted/') ? [{ rule: 'synthetic protected path' }] : [],
    scanText: (text) => text.includes('SYNTHETIC_SECRET_MARKER') ? [{ rule: 'synthetic credential' }] : [],
  },
};
const files = (extra = {}) => new Map(Object.entries({ 'assets/reviewed-images.json': '{}', 'index.html': '<h1>Public</h1>', ...extra }).map(([name, value]) => [name, Buffer.from(value)]));
function removeFixture(dir) {
  const resolved = path.resolve(dir);
  assert.equal(path.dirname(resolved), path.resolve(os.tmpdir()));
  assert.match(path.basename(resolved), /^portfolio-(?:gate|build)-/);
  fs.rmSync(resolved, { recursive: true, force: true });
}
test('invalid and missing local patterns fail closed', () => {
  for (const value of ['', '{}', '{"patterns":[]}', '{"patterns":[""]}', '{"patterns":["["]}']) assert.throws(() => parsePatterns(value));
  assert.equal(parsePatterns('{"patterns":["blocked"]}').length, 1);
});
test('coverage requires credentials, paths, and armed personal protection', () => {
  const valid = '11 credential rules, 3 file-name rules, 1 never-commit paths; personal values: personal phone number (1 identity file)';
  assert.doesNotThrow(() => assertCoverage(valid));
  for (const [before, after] of [['11 credential', '0 credential'], ['1 never-commit', '0 never-commit'], ['personal phone number', 'none armed'], ['1 identity', '0 identity']]) assert.throws(() => assertCoverage(valid.replace(before, after)));
});
test('public sources, companion pages, and scripts receive privacy checks', () => {
  for (const name of ['README.md', '404.html', 'assets/site.js']) {
    assert.throws(() => validateCandidate(files({ [name]: 'SYNTHETIC_PRIVATE_MARKER' }), policy));
    assert.throws(() => validateCandidate(files({ [name]: 'SYNTHETIC_SECRET_MARKER' }), policy));
  }
  assert.doesNotThrow(() => validateCandidate(files(), policy));
});
test('failures identify file and rule without echoing protected input', (t) => {
  const messages = [];
  t.mock.method(console, 'error', (message) => messages.push(message));
  assert.throws(() => validateCandidate(files({ 'notes.md': 'SYNTHETIC_PRIVATE_MARKER' }), policy));
  assert.match(messages.join(''), /notes.md.*local-privacy-pattern/);
  assert.doesNotMatch(messages.join(''), /SYNTHETIC_PRIVATE_MARKER/);
});
test('PNG changes require review of exact bytes; unknown binary is blocked', () => {
  const bytes = Buffer.from([137, 80, 78, 71, 0]);
  const digest = createHash('sha256').update(bytes).digest('hex');
  const candidate = files({ 'assets/reviewed-images.json': JSON.stringify({ 'assets/demo.png': digest }), 'assets/demo.png': bytes });
  assert.doesNotThrow(() => validateCandidate(candidate, policy));
  candidate.set('assets/demo.png', Buffer.from([137, 80, 78, 71, 0, 1]));
  assert.throws(() => validateCandidate(candidate, policy));
  assert.throws(() => validateCandidate(files({ 'unknown.bin': bytes }), policy));
});
test('editorial exclusions apply to pages, and machine paths cannot publish', () => {
  assert.throws(() => validateCandidate(files({ 'index.html': 'excluded copy' }), policy, ['excluded copy']));
  assert.doesNotThrow(() => validateCandidate(files({ 'content.json': 'excluded copy' }), policy, ['excluded copy']));
  assert.throws(() => validateCandidate(files({ 'notes.md': ['D:', '/', 'private-location'].join('') }), policy));
});
test('street-address-shaped text is blocked even without an identity address field', () => {
  for (const suffix of ['Street', 'Rd', 'Avenue', 'Way', 'Blvd']) {
    const address = ['123', 'Example', suffix].join(' ');
    assert.throws(() => validateCandidate(files({ 'notes.md': address }), policy));
  }
});
test('candidate inventory includes untracked public files and excludes local ignored files', () => {
  const dir = fs.mkdtempSync(path.join(os.tmpdir(), 'portfolio-gate-'));
  try {
    execFileSync('git', ['init', '-q', dir]);
    fs.writeFileSync(path.join(dir, '.gitignore'), 'gate.local.json\n');
    fs.writeFileSync(path.join(dir, 'gate.local.json'), 'private');
    fs.writeFileSync(path.join(dir, 'notes.md'), 'public');
    const candidate = publicFiles(dir, policy);
    assert(candidate.has('notes.md'));
    assert(!candidate.has('gate.local.json'));
    fs.writeFileSync(path.join(dir, 'notes.md'), 'SYNTHETIC_PRIVATE_MARKER');
    execFileSync('git', ['add', 'notes.md'], { cwd: dir });
    fs.writeFileSync(path.join(dir, 'notes.md'), 'sanitized working copy');
    const staged = stagedFiles(dir, policy);
    staged.set('assets/reviewed-images.json', Buffer.from('{}'));
    assert.throws(() => validateCandidate(staged, policy));
    fs.mkdirSync(path.join(dir, 'restricted'));
    fs.writeFileSync(path.join(dir, 'restricted', 'notes.md'), 'blocked');
    assert.throws(() => publicFiles(dir, policy));
  } finally { removeFixture(dir); }
});
test('real build with missing policy fails without replacing an existing page', () => {
  const dir = fs.mkdtempSync(path.join(os.tmpdir(), 'portfolio-build-'));
  try {
    for (const file of ['build.mjs', 'render.mjs', 'publication-gate.mjs']) fs.copyFileSync(new URL(file, import.meta.url), path.join(dir, file));
    fs.writeFileSync(path.join(dir, 'index.html'), 'previous approved page');
    const run = spawnSync(process.execPath, ['build.mjs'], { cwd: dir, encoding: 'utf8' });
    assert.equal(run.status, 1);
    assert.equal(fs.readFileSync(path.join(dir, 'index.html'), 'utf8'), 'previous approved page');
    assert.match(run.stderr, /missing-or-invalid-policy/);
  } finally { removeFixture(dir); }
});
