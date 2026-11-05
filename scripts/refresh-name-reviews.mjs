// Refreshes the exact-text name reviews in the ignored local gate policy for the public files named on the command
// line, by the procedure in docs/PUBLISHING.md ("Maintain a Public Name Review"): after the changed text has been read
// and the owner's authorization still covers the name and its context, each named record gets the digest of the actual
// candidate, the current render() output for a generated page and the disk text for a source file, CRLF normalized to
// LF. Only the files named are touched; every other record is reported and left as it is, so this can never clear a
// hold in bulk. Prints file names and outcomes only, never a pattern or a reviewed name.
//
//   node scripts/refresh-name-reviews.mjs PROJECT.md content/portfolio.json index.html
//
// The owner runs it: the policy file is a security control, so an assistant stops at the hold and hands over the list.
import fs from 'node:fs';
import path from 'node:path';
import { createHash } from 'node:crypto';
import { fileURLToPath, pathToFileURL } from 'node:url';

const repo = path.dirname(path.dirname(fileURLToPath(import.meta.url)));
const named = new Set(process.argv.slice(2).map((file) => file.replaceAll('\\', '/')));
if (!named.size) { console.error('Name the public files whose reviews to refresh, as git lists them (for example PROJECT.md index.html).'); process.exit(2); }
const digestOf = (text) => createHash('sha256').update(Buffer.from(text.replaceAll('\r\n', '\n'))).digest('hex');

const { render } = await import(pathToFileURL(path.join(repo, 'render.mjs')).href);
const content = JSON.parse(fs.readFileSync(path.join(repo, 'content/portfolio.json'), 'utf8'));
const generated = render(content, repo);

const policyPath = path.join(repo, 'gate.local.json');
const raw = fs.readFileSync(policyPath, 'utf8');
const indent = /^\{\r?\n(\s+)"/.exec(raw)?.[1] ?? '  ';
const newline = raw.includes('\r\n') ? '\r\n' : '\n';
const policy = JSON.parse(raw);
let refreshed = 0;
const seen = new Set();
for (const review of policy.nameReviews ?? []) {
  seen.add(review.file);
  const onDisk = path.join(repo, review.file);
  const candidate = generated[review.file] ?? (fs.existsSync(onDisk) ? fs.readFileSync(onDisk, 'utf8') : null);
  if (candidate === null) { console.log(`${review.file}: no candidate text`); continue; }
  const digest = digestOf(candidate);
  if (digest === review.sha256) { console.log(`${review.file}: unchanged`); continue; }
  if (!named.has(review.file)) { console.log(`${review.file}: differs, not named, left alone`); continue; }
  review.sha256 = digest;
  refreshed++;
  console.log(`${review.file}: refreshed`);
}
for (const file of named) if (!seen.has(file)) console.log(`${file}: no name review on record`);
if (refreshed) {
  let out = JSON.stringify(policy, null, indent);
  if (newline === '\r\n') out = out.replaceAll('\n', '\r\n');
  fs.writeFileSync(policyPath, out + (raw.endsWith('\n') ? newline : ''));
}
console.log(`refreshed ${refreshed} record(s)`);
