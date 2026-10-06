---
name: project-portfolio
formerly: [portfolio]
summary: Public employer-facing portfolio with compact visual product cards, expandable case studies, categorized history, and a full candidate publication gate
status: live
live: https://xzhou110.github.io/
repo: https://github.com/xzhou110/xzhou110.github.io
updated: 2026-10-06
started: 2026-10-01
category: products
phase: polishing
next: Owner feedback on the refreshed portfolio
---

# Project Portfolio

## Summary

Lukas's public portfolio: shipped consumer products, product judgment, AI-assisted building, data science, and earlier experiments. Curated public content generates a static site with no runtime dependencies or private data integration.

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

- Edit wording in `content/portfolio.json`, layout in `render.mjs`, presentation in `assets/site.css`, and interactions in `assets/site.js`. Generated HTML is not an editing source.
- Calm light surfaces, charcoal dark mode, restrained teal, system fonts, readable headings, and thin card borders adapt the owner's shared design preferences without importing private dashboard data or code.
- Product previews, purpose, and app/source links stay visible. Case studies and history categories start collapsed. Light/Dark controls are labelled and persist the visitor's choice.
- Skills describe Lukas's capabilities; product stacks describe the software. Do not imply independent mastery of every framework used by coding agents.
- Historical evidence has its own date. Updating the design does not refresh test counts, costs, or product claims.
- Existing screenshots are reviewed public previews. Changed PNG bytes require a fresh visual privacy review and an updated `assets/reviewed-images.json` digest. Text scanning does not inspect pixels.
- `gate.local.json` and `facts.local.json` are private, ignored files. Missing/invalid policy or missing scanner coverage blocks builds. Never commit either file or disable hooks.
- `publication-gate.mjs` checks the entire candidate public file set, including sources and assets, before replacing generated pages. Findings reveal only file and rule.
- Optional `--facts <public-snapshot.json>` reads only explicit public repository update facts (`private: false`). Default builds read no snapshot. Curated links are intentionally public; adding a new link requires checking its visibility.
- `/garage/` intentionally redirects to `/car-shopping/`, preserving search and hash.

## Details

### Build and Publish

1. Update source and review any changed imagery.
2. Run `node --test`, then `node build.mjs` on the configured owner machine. A fresh clone needs the owner's local policy and protected scanner configuration; it must not silently use weaker checks.
3. Check desktop/mobile, both themes, keyboard disclosures, product links, and the generated 404 page.
4. Stage the intended final files, then run `node build.mjs --check-staged`. This checks the exact index bytes and requires them to match the approved build. Commit and push with global hooks enabled. All committed sources are public, even when not linked from the homepage.
5. Wait for Pages and verify the live page and deployed assets match the approved build.

The generator retains `--no-shots` compatibility as a harmless argument. Screenshots are never fetched or overwritten automatically. A conservative street-address pattern check supplements the identity-backed scanner, including when an identity profile has no street address configured; manual content and image review remain necessary.

### Dependencies and References

The workspace project index, shared launch configuration, and personal project registry reference this folder. The public repository keeps the user-site name required by GitHub Pages. No path, port, repository, or deployment change accompanied this redesign.

### Change Highlights

- 2026-10-06: Refreshed hierarchy, light/charcoal themes, compact cards, accessible disclosures, concise approach/skills, categorized history, and matching 404. Removed the coursework skill and stale pipeline claims. Expanded checks to the full candidate tree with required policy/scanner coverage and reviewed image hashes.
- 2026-10-06: Featured Car Shopping name and links updated; legacy redirect retained.
- 2026-10-02: Local project renamed from `portfolio`; historical alias preserved.
- 2026-10-01: Replaced the old template with the public portfolio.

## Pointers

- [README](README.md) — source map and build requirements.
- [Design](docs/DESIGN.md) — reusable design decisions and portfolio adaptations.
