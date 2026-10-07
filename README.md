# Lukas's Project Portfolio

Source of [xzhou110.github.io](https://xzhou110.github.io/): Selected Work, how I build, skills, and categorized earlier work. Public apps have demo/source links; owner-approved tooling case studies use labelled illustrations and omit repository links and account data.

| File | Purpose |
|---|---|
| `content/portfolio.json` | Curated public wording and approved public links |
| `render.mjs` | Semantic static HTML and metadata |
| `assets/site.css` | Tokens, responsive layout, light/charcoal themes |
| `assets/site.js` | Theme preference, category filters, project jumps, visible case-study bulk control, sticky section navigation |
| `assets/shots/` | Reviewed product previews |
| `assets/reviewed-images.json` | Hashes of visually reviewed public image bytes |
| `publication-gate.mjs` | Full candidate privacy checks; no sensitive diagnostics |
| `build.mjs` | Validate the complete candidate, then write generated pages |

Requires Node 20+ and the owner's configured privacy policy and global scanner. No package installation, external fonts, analytics, or runtime framework.

```sh
node --test
node build.mjs
```

The build stops when local protection is unavailable. `gate.local.json` is private and never checked in. Optional `--facts <public-snapshot.json>` adds only explicit public repository update facts; the default build reads no snapshot. `--no-shots` remains compatible, but screenshots are always reused. A changed image needs a fresh visual review before its digest is approved.

Preview using a static server or the existing `project-portfolio` launch configuration. Check themes, narrow screens, disclosures, filters, project jumps, browser back/reload, section navigation, and app/source links. Stage the final files and run `node build.mjs --check-staged` to check the exact index against the approved build. Authorized publication is a normal commit and push to `master` with hooks enabled; GitHub Pages serves the root. Verify the live result after publishing. The `garage/` redirect preserves older bookmarks.

See [Project Map](PROJECT.md) and [Design](docs/DESIGN.md).
