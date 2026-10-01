# xzhou110.github.io

Source of [xzhou110.github.io](https://xzhou110.github.io/), a one-page portfolio: shipped products, how they were built, skills, history.

- `content/portfolio.json` — the curated content (the only file to edit for wording).
- `build.mjs` — generates `index.html`: merges the content with a facts snapshot (live status, language, last push of public repos, passed with `--facts`), takes screenshots of the live apps with headless Chrome, and refuses to write if a privacy gate trips (local paths, private repo names, forbidden words) or a secret scanner flags the output.
- `assets/` — favicon and the generated screenshots.
- `index.html`, `404.html`, `robots.txt`, `sitemap.xml`, `.nojekyll` — what GitHub Pages serves.

Build: `node build.mjs --facts <snapshot.json>` (`--no-shots` reuses existing screenshots). No dependencies beyond Node 20+ and Chrome.
