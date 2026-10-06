import fs from 'node:fs';
import path from 'node:path';
import os from 'node:os';
import { createHash } from 'node:crypto';
import { execFileSync } from 'node:child_process';
import { pathToFileURL } from 'node:url';

const sha256 = (bytes) => createHash('sha256').update(bytes).digest('hex');
// Independent of whether the owner's identity profile currently includes an address.
const streetAddress = /\b\d{1,6}\s+(?:[A-Za-z][\w'-]*\s+){1,5}(?:Street|St|Avenue|Ave|Road|Rd|Drive|Dr|Boulevard|Blvd|Lane|Ln|Court|Ct|Way|Place|Pl|Terrace|Ter|Circle|Cir|Parkway|Pkwy|Highway|Hwy)\b/i;
function fail(file, rule) {
  console.error(`Publication blocked: ${file} [${rule}] (value hidden)`);
  throw new Error('Publication blocked');
}
export function parsePatterns(text) {
  const patterns = JSON.parse(text).patterns;
  if (!Array.isArray(patterns) || !patterns.length || patterns.some((p) => typeof p !== 'string' || !p.trim())) throw new Error('Invalid local policy');
  return patterns.map((p) => new RegExp(p, 'i'));
}
export function assertCoverage(status) {
  if (!/[1-9]\d* credential rules/.test(status) || !/[1-9]\d* file-name rules/.test(status) || !/[1-9]\d* never-commit paths/.test(status) || !/personal phone number/.test(status) || !/\([1-9]\d* identity file/.test(status)) throw new Error('Required scanner coverage is unavailable');
}
export async function loadPolicy(here) {
  let patterns;
  try { patterns = parsePatterns(fs.readFileSync(path.join(here, 'gate.local.json'), 'utf8')); }
  catch { fail('gate.local.json', 'missing-or-invalid-policy'); }
  const candidates = ['.claude', '.codex'].map((folder) => path.join(os.homedir(), folder, 'git-hooks/secret-scan.mjs'));
  const scannerPath = candidates.find((candidate) => fs.existsSync(candidate));
  if (!scannerPath || process.env.SKIP_SECRET_SCAN) fail('publication-gate.mjs', 'required-scanner-unavailable');
  let scanner;
  try {
    const status = execFileSync(process.execPath, [scannerPath, '--status'], { encoding: 'utf8', windowsHide: true, stdio: ['ignore', 'pipe', 'pipe'] });
    assertCoverage(status);
    scanner = await import(pathToFileURL(scannerPath).href);
    if (!scanner.PERSONAL_RULES?.length || typeof scanner.scanPath !== 'function' || typeof scanner.scanText !== 'function') throw new Error('Scanner unavailable');
  } catch { fail('publication-gate.mjs', 'required-scanner-coverage'); }
  return { patterns, scanner };
}
export function publicFiles(here, policy) {
  const names = execFileSync('git', ['-c', `safe.directory=${here.replaceAll('\\', '/')}`, 'ls-files', '--cached', '--others', '--exclude-standard', '-z'], { cwd: here, encoding: 'utf8' }).split('\0').filter(Boolean);
  const files = new Map();
  for (const name of new Set(names)) {
    if (/^(?:gate|facts)\.local\.json$|(?:^|\/)\.env(?:\.|$)|(?:^|\/)(?:local|private)\//i.test(name)) fail(name, 'private-file');
    if (policy.scanner.scanPath(name).length) fail(name, 'protected-path');
    const full = path.resolve(here, name);
    if (!full.startsWith(path.resolve(here) + path.sep)) fail(name, 'outside-project');
    if (!fs.existsSync(full)) continue;
    if (fs.lstatSync(full).isSymbolicLink() || !fs.lstatSync(full).isFile()) fail(name, 'unsupported-file-type');
    files.set(name, fs.readFileSync(full));
  }
  return files;
}
export function stagedFiles(here, policy) {
  const git = (args, encoding) => execFileSync('git', ['-c', `safe.directory=${here.replaceAll('\\', '/')}`, ...args], { cwd: here, encoding });
  const names = git(['ls-files', '--cached', '-z'], 'utf8').split('\0').filter(Boolean);
  const files = new Map();
  for (const name of names) {
    if (policy.scanner.scanPath(name).length || /^(?:gate|facts)\.local\.json$|(?:^|\/)(?:local|private)\//i.test(name)) fail(name, 'private-file');
    files.set(name, git(['show', `:${name}`]));
  }
  return files;
}
export function validateCandidate(files, policy, forbiddenWords = []) {
  let reviewed;
  try { reviewed = JSON.parse(files.get('assets/reviewed-images.json').toString('utf8')); }
  catch { fail('assets/reviewed-images.json', 'missing-image-review'); }
  for (const [name, bytes] of files) {
    if (policy.scanner.scanPath(name).length) fail(name, 'protected-path');
    if (/\.png$/i.test(name)) {
      if (reviewed[name] !== sha256(bytes)) fail(name, 'image-needs-visual-review');
      continue;
    }
    if (bytes.includes(0)) fail(name, 'unreviewed-binary');
    const text = bytes.toString('utf8');
    if (policy.patterns.some((re) => re.test(text))) fail(name, 'local-privacy-pattern');
    if (streetAddress.test(text)) fail(name, 'street-address-pattern');
    if (/\b[A-Za-z]:[\\/]|file:\/\/\//.test(text)) fail(name, 'machine-path');
    if (policy.scanner.scanText(text, name).length) fail(name, 'credential-or-personal-value');
    if (/\.html$/i.test(name) && forbiddenWords.some((word) => new RegExp(word, 'i').test(text))) fail(name, 'editorial-exclusion');
  }
}
export function publishGenerated(here, output) {
  // Called only after checking the complete in-memory candidate. No network image fetching during builds.
  for (const [name, text] of Object.entries(output)) {
    const target = path.join(here, name);
    fs.writeFileSync(`${target}.tmp`, text, 'utf8');
    fs.renameSync(`${target}.tmp`, target);
  }
}
