---
name: project-portfolio
formerly: [portfolio]
summary: Public employer-facing portfolio with three visual highlights, an eleven-project searchable library, full case studies, and a full candidate publication gate
status: live
live: https://xzhou110.github.io/
repo: https://github.com/xzhou110/xzhou110.github.io
updated: 2026-10-27
started: 2026-10-01
category: products
phase: polishing
next: Keep curated highlights, project evidence, visuals, and original product icons current as the collection grows
---

# Project Portfolio

## Summary

Lukas's public portfolio: selected consumer apps, AI workflows, local tools, data science, and earlier experiments. Curated public content generates a static site with no runtime dependencies or private data integration.

## Key Facts

| Item | Value |
|---|---|
| App Title | Xu Zhou (Lukas) — Project Portfolio |
| Folder / Launch Configuration | `project-portfolio` |
| Stack | Node 20+ generator; HTML, CSS, JavaScript |
| Preview | Existing `project-portfolio` launch configuration, port 8141 |
| Build | `node build.mjs` (reuses reviewed screenshots) |
| Tests | `node --test` |
| Deployment | GitHub Pages, `master` branch, repository root |
| Public URL | https://xzhou110.github.io/ |
| Cost | Static GitHub Pages hosting; no paid service required |

## Key Things to Know

- Edit wording and the three `startHere` selections in `content/portfolio.json`; layout in `render.mjs` and `render-projects.mjs`; presentation in `assets/site.css` and `assets/projects.css`. The pure library engine is `assets/project-library.mjs`, with browser adaptation in `assets/library.js`. Generated HTML and `assets/project-catalog.json` are not editing sources.
- Owner-selected Curated Highlights builds on the editorial direction: deep green introduction, warm light surfaces, charcoal dark mode, and three visual cards. Those same three projects appear in the suggested starting links. System fonts and restrained accents keep it readable.
- Every highlight and library card retains a rich screenshot or labelled illustration, its original icon where available, a short purpose, and release state. Full visuals, decisions, evidence, limitations, and available app/source links live on static case-study pages. History categories remain collapsed. Light/Dark controls are labelled and persist the visitor's choice.
- Owner accepted the editorial build on October 27 and requested each project's own icon. Nine projects use their existing product marks beside the name and in applicable starting links/illustrations. Two tools without dedicated artwork remain text-led. Sources and exact imported hashes are recorded in `assets/icons/sources.json`; see [Icon Sources](docs/ICON-SOURCES.md) before updating them. Builds use reviewed local copies only, never sibling repositories or remote hotlinks.
- Selected Work shows three curated highlights: XuSeak To-Do, Car TCO Compare, and Multi-Agent Build Orchestrator. Explore All Projects opens the complete eleven-case library: five Consumer Apps, three AI Tools, and three Knowledge & Productivity projects. The homepage height stays bounded as the library grows.
- Public app links remain limited to the three released web apps. Public source links also include Local App Kit and AI Usage Tracker, whose visibility was verified. Private cases use labelled concept or workflow illustrations, without account data, private source, personal notes, or the unlisted game tester link. TestFlight and App Review are explicitly separate from a public store release.
- `/projects/` provides search, category filtering, result counts, and six cards per page. Six is a display batch, never a collection cap. Filtering runs across the full catalog before pagination. Query/category/page URLs survive reload and history; a case study's Back to All Projects link restores the collection context. Static `/projects/page/<n>/` pages and `/projects/<id>/` cases remain browseable without JavaScript. Legacy homepage project/filter links redirect to the new destinations.
- The sticky section menu links Work, Approach, Skills, History, and Contact, with a measured header offset that keeps anchor targets visible on narrow screens. Back to Top follows the contact section.
- Skills describe Lukas's capabilities; product stacks describe the software. Do not imply independent mastery of every framework used by coding agents.
- Positioning is AI, Data Science & Product, chosen by the owner for the employer-facing portfolio. Use that order in the introduction, descriptions, and capability groups, with delivery skills following them. Keep purpose-based project categories separate. The short positioning label lives in the curated content file.
- Historical evidence has its own date. Updating the design does not refresh test counts, costs, or product claims.
- Existing screenshots are reviewed public previews. Changed PNG bytes require a fresh visual privacy review and an updated `assets/reviewed-images.json` digest. Text scanning does not inspect pixels.
- `gate.local.json` and `facts.local.json` are private, ignored files. Missing/invalid policy or missing scanner coverage blocks builds. Never commit either file or disable hooks.
- `publication-gate.mjs` checks the entire candidate public file set, including sources and assets, before replacing generated pages. Findings reveal only file and rule.
- The existing private-name rule stays enabled. The owner's explicit approval to name X Command Center is recorded in ignored local policy as `nameReviews`: the exact name, public file, and SHA-256 of its reviewed text (LF line endings). Only a standalone name rule can qualify, never combined or broader expressions. A changed file invalidates the exception. It never exempts other pattern matches, credentials, personal values, paths, or images. Refresh this narrow review only after reviewing the changed public text; never remove the underlying rule.
- Optional `--facts <public-snapshot.json>` reads only explicit public repository update facts (`private: false`). Default builds read no snapshot. Curated links are intentionally public; adding a new link requires checking its visibility.
- `/garage/` intentionally redirects to `/car-shopping/`, preserving search and hash.
- `/xuseak-todo/` hosts XuSeak To-Do's privacy policy and support pages (`xuseak-todo/privacy/`, `xuseak-todo/support/`, hand-written, self-contained HTML; source text in the app's `docs/store/`): the addresses in the app's Settings › About and its App Store listing. Owner-approved and published 2026-10-25. A brand domain may take them over later; these stay as forwarders because installed apps keep the links.
- `.claude/launch.json` is ignored (2026-10-25): it holds machine paths and names a private project, and the preview and the X Command Center read it from disk, never from GitHub. The gate held it; it had been tracked in this public repository since 2026-10-22 by a session that never ran the gate.
- `package.json` holds scripts only (`test`, `check` = tests plus the full candidate gate), so the machine's global pre-push hook runs the gate before every push; a push can no longer go around it by mistake.
- Disclose AI use together with the verification: every "built with AI" claim pairs with one concrete thing that was rejected or caught and the check that caught it. Employers assume AI is in the loop and grade judgment; hiding it is the red flag.
- Public proof does not require public source: a case study shows the problem, the decisions, an illustrative visual and dated limitations, reviewed independently of the private project. Repository visibility and the public description are separate decisions.

## Details

### Build and Publish

1. Update source and review any changed imagery.
2. Run `node --test`, then `node build.mjs` on the configured owner machine. A fresh clone needs the owner's local policy and protected scanner configuration; it must not silently use weaker checks.
3. Check desktop/mobile visuals, both themes, keyboard search/category controls, pagination, empty results and Clear, case-study return links, browser back/reload, old project URLs, sticky navigation, product links, and the generated 404 page.
4. Stage the intended final files, then run `node build.mjs --check-staged`. This checks the exact index bytes and requires them to match the approved build. Commit and push with global hooks enabled. All committed sources are public, even when not linked from the homepage.
5. Wait for Pages and verify the live page and deployed assets match the approved build.

The generator retains `--no-shots` compatibility as a harmless argument. Screenshots are never fetched or overwritten automatically. A conservative street-address pattern check supplements the identity-backed scanner, including when an identity profile has no street address configured; manual content and image review remain necessary.

### Dependencies and References

The workspace project index, shared launch configuration, and personal project registry reference this folder. The public repository keeps the user-site name required by GitHub Pages. No path, port, repository, or deployment change accompanied this redesign.

The workspace index, launcher, collector registrations, repository-name exception, support/privacy page paths, and legacy redirect were checked during the October 27 refresh. The index description now reflects the bounded homepage and full library. The ignored launcher uses this project's `serve.mjs` on the existing port so nested cases and static library pages are served; it exposes only public output and assets. Generated workspace snapshots remain the collector's output.

### Change Highlights

- 2026-10-27: Owner selected Curated Highlights and required a rich visual on every highlight and library card. Added a three-card homepage, searchable paginated library, and full static case studies; retained original icons, evidence, and legacy destinations. See [Curated Highlights](docs/CURATED-HIGHLIGHTS.md) for the method, scaling checks, and future removal workflow.

- 2026-10-27: Added nine original project icons after source, image, and metadata review; retained the accepted layout. Recorded the source inventory and the owner's icon-reuse preference.
- 2026-10-27: Owner chose the editorial showcase direction. Added four evidence-based case studies, refreshed project framing and release states, added two verified public source links, and replaced the long uniform list with a lead project and visual gallery. Removed stale metric and operating-cost claims. See the refresh brief and verification record.
- 2026-10-25: Published XuSeak To-Do's privacy policy and support pages under `xuseak-todo/`. The gate held `.claude/launch.json`, which is now untracked and ignored, and `package.json` opts the repository into the pre-push `check` gate.
- 2026-10-06: Added approved X Command Center and Wisdom & Knowledge Base case studies; grouped seven projects by purpose with category filters, cross-category jumps, sticky section navigation, and Back to Top.
- 2026-10-06: Renamed the showcase Selected Work and added two sanitized tooling case studies, conditional app/source links, labelled illustrations, and per-project evidence dates.
- 2026-10-06: Refreshed hierarchy, light/charcoal themes, compact cards, accessible disclosures, concise approach/skills, categorized history, and matching 404. Removed the coursework skill and stale pipeline claims. Expanded checks to the full candidate tree with required policy/scanner coverage and reviewed image hashes.
- 2026-10-06: Featured Car Shopping name and links updated; legacy redirect retained.
- 2026-10-02: Local project renamed from `portfolio`; historical alias preserved.
- 2026-10-01: Replaced the old template with the public portfolio.

## Pointers

- [README](README.md) — source map and build requirements.
- [Design](docs/DESIGN.md) — reusable design decisions and portfolio adaptations.
- [Curated Highlights](docs/CURATED-HIGHLIGHTS.md) — accepted layout, visual requirements, source map, scaling, and maintenance.
- [Publishing](docs/PUBLISHING.md) — maintain exact-content name reviews without weakening privacy checks.
- [Release Verification](docs/RELEASE-VERIFICATION.md) — dated evidence for the deployed navigation release.
- [October Refresh](docs/REFRESH-2026-10-27.md) — request, design choice, selection rationale, reproduction brief, and quality bar.
