# Lukas's Project Portfolio

Source of [xzhou110.github.io](https://xzhou110.github.io/): Selected Work, how I build, skills, and categorized earlier work. Public apps have demo/source links; public libraries and tools link to verified source. Private case studies use labelled illustrations and omit private repository links and account data.

| File | Purpose |
|---|---|
| `content/portfolio.json` | Curated public wording, section introductions, metadata descriptions, and approved public links |
| `render.mjs`, `render-projects.mjs`, `render-utils.mjs` | Static homepage, library pages, case studies, metadata, shared visual cards |
| `assets/site.css`, `assets/projects.css` | Tokens, responsive visual cards, light/charcoal themes |
| `assets/site.js` | Theme preference, section navigation, legacy destinations, contextual case return links |
| `assets/project-library.mjs`, `assets/library.js` | Pure search/pagination rules and browser adapter |
| `assets/project-catalog.json`, `projects/` | Generated public catalog, static library pages, and full case studies |
| `serve.mjs` | Local preview of public routes and assets on port 8141 |
| `assets/shots/` | Reviewed product previews |
| `assets/icons/` | Original product icons and a source/hash inventory; see `docs/ICON-SOURCES.md` |
| `assets/reviewed-images.json` | Hashes of visually reviewed public image bytes |
| `publication-gate.mjs` | Full candidate privacy checks; no sensitive diagnostics |
| `build.mjs` | Validate the complete candidate, then write generated pages |

Requires Node 20+ and the owner's configured privacy policy and global scanner. No package installation, external fonts, analytics, or runtime framework.

```sh
node --test
node build.mjs
```

The build stops when local protection is unavailable. `gate.local.json` is private and never checked in. Optional `--facts <public-snapshot.json>` adds only explicit public repository update facts; the default build reads no snapshot. `--no-shots` remains compatible, but screenshots are always reused. A changed image needs a fresh visual review before its digest is approved.

Preview with `node serve.mjs 8141` or the existing `project-portfolio` launch configuration. Check themes, narrow-screen previews, search/category controls, paging, empty results, case return links, browser back/reload, section navigation, and app/source links. Stage the final files and run `node build.mjs --check-staged` to check the exact index against the approved build. Authorized publication is a normal commit and push to `master` with hooks enabled; GitHub Pages serves the root. Verify the live result after publishing. The `garage/` redirect preserves older bookmarks.

The homepage presents three visual highlights selected by `startHere` in the curated content. `/projects/` contains all eleven case studies, with search, categories, and six visual cards per page. Full cases have their own URLs and retain the original evidence, decisions, and limitations. Static pagination and case links also work without JavaScript. The homepage does not grow when the collection grows; six cards is a page size, not a project limit. See [Curated Highlights](docs/CURATED-HIGHLIGHTS.md) for the accepted brief, reproduction steps, and removal/rename workflow.

See [Project Map](PROJECT.md), [Design](docs/DESIGN.md), [Copy Guide](docs/COPY-GUIDE.md), [Publishing](docs/PUBLISHING.md), and [Release Verification](docs/RELEASE-VERIFICATION.md).
