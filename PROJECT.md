---
name: project-portfolio
formerly: [portfolio]
summary: Public portfolio page for future employers at xzhou110.github.io — curated, employer-facing content merged with observed public facts into one static page, with a privacy gate before every build
status: live
live: https://xzhou110.github.io/
repo: https://github.com/xzhou110/xzhou110.github.io
updated: 2026-10-02
category: products
phase: polishing
next: repo hygiene pass (descriptions, topics, licenses on garage and apartment-shopping, AI-disclosure line in the comparator README, archive tutorial repos, profile bio and pins)
---

# project-portfolio — the public page for employers

## 1. Summary
xzhou's GitHub user site (`xzhou110.github.io`) had been an untouched Jekyll "Poole" template since 2018 while three real consumer products shipped under it as project Pages. This project turns the user site into a one-page portfolio aimed at hiring managers: who he is, the shipped products with live demos and screenshots, how he builds (AI-agent crews with real engineering discipline), skills, and a decade of history by era. Content is curated by hand in `content/portfolio.json`; a generator merges observed public facts and screenshots and refuses to write anything that trips the privacy gate.

## 2. Key facts
| | |
|---|---|
| **Kind** | web page (static, one file + assets) · generator script |
| **Stack** | Node 24 generator (`build.mjs`, no deps), headless Chrome for screenshots, vanilla HTML/CSS; GitHub Pages serves `master` root (legacy build; `.nojekyll` once published) |
| **Run** | `node build.mjs --facts <snapshot.json>` (`--no-shots` reuses screenshots) · preview: any static server on the folder (launch config `project-portfolio` → http://localhost:8141/) |
| **Deploy** | commit `index.html` + `assets/` to `master` and push → live at https://xzhou110.github.io/ within ~1 min. **Publishing is a human gate** — never push without xzhou's explicit go. |
| **Data / backends** | `content/portfolio.json` (declared) · a facts snapshot passed with `--facts` (observed: live status, language, last push; public repos only; never committed) · headless Chrome. $0. |
| **Related** | garage, apartment-shopping, car-tco-compare (the featured products) · the GitHub profile (bio, pinned repos, descriptions — part of the same first impression) |
| **Started · last major change** | 2026-10-01 · 2026-10-01 |

## 3. Key things to know
- **Public by intent.** Nothing goes on this page that isn't already public or explicitly written for it. The generator never reads learnings, sessions or private project data; it links only to repos the facts snapshot marks public.
- **The privacy gate is a build failure, not a warning.** `build.mjs` refuses to write if the HTML contains the employer name, a local path, vault internals, a private repo name or link, or any `forbiddenWords`; then the global secret scanner runs on the output. A failed gate leaves the previous `index.html` untouched.
- **Site-specific gate patterns live in `gate.local.json`** (gitignored, never published): the names that must never appear on the page. Without it the build still runs the generic rules and prints a warning, so a fresh clone gets a weaker gate — recreate the file before publishing from another machine.
- **Facts only, no invented metrics.** No user counts, revenue or impact numbers unless measured. Placeholder cost rates stay labelled "Est."; the noncommercial license and third-party data sources are stated, not hidden.
- **Employment hygiene.** The day job is at most a title line; no "open to work" banner while employed; employer material never appears (see the global rule). Side-project IP/moonlighting clauses are xzhou's to check.
- **Screenshots are observed facts too.** They are taken from the live URLs at build time (1280×800, headless Chrome with an isolated profile — Edge hands off to a running instance and writes nothing). Re-run the build after an app changes.
- Declared content changes = edit `content/portfolio.json` → `node build.mjs` → preview → commit. Observed facts refresh from the snapshot passed at build time.

## 4. Details
### How it works
`build.mjs` reads `content/portfolio.json`, loads the public subset of the facts snapshot (language, last push, live status), screenshots each featured app, renders the page from a template function, runs the privacy gate and the secret scanner, and writes `index.html` atomically.
```
project-portfolio/         (= the xzhou110.github.io repo, branch master)
├─ build.mjs               generator + template + privacy gate
├─ content/portfolio.json  curated content (headline, bio, featured cards, how-I-build, skills, history)
├─ assets/                 favicon.svg · shots/<app>.png (generated)
├─ index.html              generated — the page GitHub Pages serves
└─ PROJECT.md
```
### How to work on it
Edit content → `node build.mjs` → open the `project-portfolio` launch config → check both themes, mobile width, every link, the screenshots → show xzhou → on explicit go: commit + push `master` → verify https://xzhou110.github.io/ returns the new page (curl 200 + title).

### Current state & open items
Published 2026-10-01 after a research pass (repo tiers, app deep-reads, a judged positioning panel, hiring-manager criteria, a privacy and employment-risk review) and three owner revisions. Open: GitHub profile hygiene (bio, pinned repos, missing descriptions on 7 repos, profile README); LICENSE files for garage and apartment-shopping; an AI-disclosure line in the comparator README; archiving the tutorial repos; optional privacy-friendly analytics; whether to add a LinkedIn link once titles and dates match.

### Change highlights
- 2026-10-02 — Local folder and project renamed `portfolio` → `project-portfolio`; `formerly: [portfolio]` keeps history recorded under the old name with this project. The GitHub repo keeps its name, which Pages requires for a user site.
- 2026-10-01 — Published: the 2018 Poole template replaced by the generated page; three content revisions with the owner; the facts source became a `--facts` argument so the public repo names nothing private.

## 5. Pointers
- The synthesized content lives in `content/portfolio.json`; the page's wording was checked against a completeness critic before the first publish (facts only, no overclaims).
