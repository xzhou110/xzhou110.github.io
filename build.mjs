// Static build: validate the complete public candidate before replacing generated output.
import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';
import { render } from './render.mjs';
import { loadPolicy, publicFiles, stagedFiles, validateCandidate, publishGenerated } from './publication-gate.mjs';

const here = path.dirname(fileURLToPath(import.meta.url));
try {
  const policy = await loadPolicy(here);
  const content = JSON.parse(fs.readFileSync(path.join(here, 'content/portfolio.json'), 'utf8'));
  const args = process.argv.slice(2);
  const factsIndex = args.indexOf('--facts');
  const facts = new Map();
  // Only an explicitly supplied public snapshot is read; no private dashboard dependency.
  if (factsIndex !== -1) {
    if (!args[factsIndex + 1]) throw new Error('Missing public snapshot file.');
    const snapshot = JSON.parse(fs.readFileSync(args[factsIndex + 1], 'utf8'));
    for (const item of snapshot.projects || []) {
      if (item.github?.private === false) facts.set(item.name, { pushedAt: item.github.pushedAt });
    }
  }
  const output = render(content, here, (name) => facts.get(name));
  const files = publicFiles(here, policy);
  for (const [name, text] of Object.entries(output)) files.set(name, Buffer.from(text));
  validateCandidate(files, policy, content.forbiddenWords || []);
  if (args.includes('--check-staged')) {
    const staged = stagedFiles(here, policy);
    validateCandidate(staged, policy, content.forbiddenWords || []);
    const comparable = (bytes) => bytes.includes(0) ? bytes : Buffer.from(bytes.toString('utf8').replaceAll('\r\n', '\n'));
    if (staged.size !== files.size || [...files].some(([name, bytes]) => !staged.has(name) || !comparable(staged.get(name)).equals(comparable(bytes)))) {
      console.error('Publication blocked: staged content differs from the approved build. Stage the intended final files and recheck.');
      throw new Error('Staged tree mismatch');
    }
    console.log('Exact staged tree matches the approved build and passed publication checks.');
  } else {
    publishGenerated(here, output);
    console.log('Portfolio built: full candidate text and reviewed image hashes passed publication checks.');
  }
} catch {
  // Never echo parser/scanner inputs.
  console.error('Build stopped. Required policy, content, or validation failed; generated files were not approved.');
  process.exitCode = 1;
}
