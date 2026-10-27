# Project Icon Sources

## Owner Direction

October 27, 2026: “I like your build. for many of the project, they have their own icon, make sure use those.” The editorial design is accepted. Project recognition should carry through from the original app to this showcase.

Use each project's current configured product icon, preserving its artwork and colors. Do not substitute a generic illustration symbol, framework logo, or maker logo for an available product mark. A project with no dedicated icon stays text-led. The workflow/concept previews still explain the work; the icon identifies which project it is.

## Source Inventory

Paths below are relative to the corresponding source project's root. The portfolio project IDs connect this table to the curated titles. Exact source and imported SHA-256 hashes live in [sources.json](../assets/icons/sources.json).

| Portfolio Project ID | Original Asset | Portfolio Copy |
|---|---|---|
| xuseak-to-do | `assets/folded-check-icon.png` | `assets/icons/xuseak-to-do.png` |
| car-tco-compare | `app/public/favicon.svg` | `assets/icons/car-tco-compare.svg` |
| dream-laws | `assets/icon.png` | `assets/icons/dream-laws.png` |
| creator-advisors | `app/public/favicon.svg` | `assets/icons/creator-advisors.svg` |
| car-shopping | `app/public/favicon.svg` | `assets/icons/car-shopping.svg` |
| apartment-shopping | `app/public/favicon.svg` | `assets/icons/apartment-shopping.svg` |
| ai-usage-tracker | `desktop/app-icon.svg` | `assets/icons/ai-usage-tracker.svg` |
| project-workspace | `favicon.svg` | `assets/icons/project-workspace.svg` |
| knowledge-learning-system | `site/public/icon.svg` | `assets/icons/knowledge-learning-system.svg` |

Multi-Agent Build Orchestrator and Local App Kit had no dedicated product icon in their source trees at this review. Their names and existing architecture/workflow illustrations remain intact.

## Reproduction and Update Procedure

1. Check the source project's app configuration, HTML favicon reference, or desktop icon declaration. Use the configured production asset, not a development badge or unused concept.
2. Inspect raster pixels and SVG source. Check for personal data, embedded metadata, scripts, and external references before copying an asset into this public repository. The source project is unchanged.
3. Copy the asset to `assets/icons/`. Apply the shared icon metadata-cleaning procedure at intake. This import found no AI tags or other removable metadata; all nine copies matched their source bytes exactly.
4. Record the source-relative path and hashes in `assets/icons/sources.json`. After visual review, add the approved digest to `assets/reviewed-images.json`. A known public project name inside SVG metadata still receives the same narrow, exact-content review as other public text.
5. Set the curated project's `icon` path in `content/portfolio.json`. The renderer uses that single path for the card, starting link, and applicable illustration. Content-derived asset versions invalidate stale browser caches when icon bytes change.
6. Inspect desktop and narrow screens in both themes, then run the existing tests, full candidate publication gate, and exact staged-tree check. After Pages deploys, compare the icon files and generated page with the approved output.

No icon was redrawn or generated for this change. The build reads only checked-in, reviewed assets and does not reach into private source repositories. Source changes are adopted deliberately through this procedure.

## Quality Bar and Learning

- Icons appear at 44px beside project names, 28px in suggested starting links, and smaller within previews. Keep the original aspect ratio and color; do not recolor them to match the portfolio.
- Visible names remain the primary labels. Adjacent icons have empty alt text to avoid repeating the same name to a screen reader. Explicit image dimensions reserve space before loading.
- Keep long titles readable and avoid horizontal overflow at narrow widths. Missing artwork does not justify inventing a replacement brand.
- A polished showcase still needs the product's existing identity. Check branding sources at the start of a portfolio refresh, alongside screenshots and release evidence. This preference is also recorded in the shared frontend design guidance.
