# Curated Highlights

## Accepted Brief

On October 27, 2026, the owner requested a shorter Selected Work section that retains every project and can grow to tens or hundreds. After comparing designs, the owner selected Curated Highlights. The follow-up explicitly required one rich visual on each of the three highlighted apps and on every project reached through Explore All Projects, using the previous To-Do concept illustration as the example. Original project icons remain part of the accepted editorial style.

The audience is a prospective employer. The useful journey is: understand the focus, scan three different builds, open a relevant case, inspect decisions and evidence, then explore more work or get in touch. A visitor who does not enter the library reaches the rest of the portfolio without scrolling through the entire collection.

## Design and Trade-Offs

- The homepage has three cards: XuSeak To-Do, Car TCO Compare, and Multi-Agent Build Orchestrator. `startHere` is the single selection source for both these highlights and the hero links.
- Each card retains a screenshot or clearly labelled product/workflow illustration, the original app icon where available, a short purpose, and an honest release state. Icons do not replace the visual preview.
- Desktop uses three equal columns. Narrow screens put the preview beside the text to keep the overview compact. Full case pages enlarge the same visual for inspection.
- The full library has search, categories, counts, and six cards per page. Page size controls presentation, never the size of the collection. Search/filtering run over every entry before paging.
- Full cases have stable `/projects/<id>/` URLs. They preserve the existing problem, implementation, key decision, evidence date, limitations, stack, and available public proof links.
- Separate case pages introduce a navigation step. Contextual return links restore the search/category/page and matching card; browser history and reload preserve the collection state.
- JavaScript enhances search and state. Generated static library pages provide complete browsing and case links without it. A catalog-load failure leaves static browsing available with a retry control.

## Reproduce and Maintain

1. Edit only curated public content in `content/portfolio.json`. Every entry needs a stable slug, category, concise summary, honest status, full evidence, and either a reviewed screenshot or a labelled illustration. Keep private app data and employer material out of the source.
2. Select exactly three distinct existing IDs in `startHere`. Adding an entry to `featured` automatically includes it in the library, catalog, case output, and sitemap; it does not lengthen the homepage.
3. Shared visual/card/case rendering lives in `render-projects.mjs`; route and metadata generation lives in `render.mjs`. `render-utils.mjs` handles escaping and the supported public Markdown links. Existing screenshot and icon bytes are reused; changed images require renewed pixel and digest review.
4. The pure `assets/project-library.mjs` owns normalization, filtering, page selection, and URLs. `assets/library.js` adapts it to browser controls. `assets/projects.css` owns the compact cards and case layouts. The catalog is generated, never manually edited.
5. Run the existing test and publication check, inspect desktop and narrow-screen views, then validate the exact staged tree. Publish with normal hooks and verify the deployed routes and assets. See [Project Map](../PROJECT.md) and [Release Verification](RELEASE-VERIFICATION.md).

Generated output is not automatically deleted. Before removing or renaming a project, compare the existing `projects/` files with the keys returned by `render()`. Explicitly remove only obsolete generated pages, update highlight selections and references, and choose a redirect when an old public case URL should survive. Likewise remove obsolete numbered pages if the collection shrinks. Rebuild, inspect the final candidate and sitemap, and stage those deletions in the same release. The current eleven-project output has no orphan pages.

## Quality Bar

- Three homepage cards and exactly one rich preview on each; every library entry and case also has a preview. Original icons keep their colors and proportions.
- No evidence, limitations, release-state distinctions, or available public links disappear when content moves to case pages. Concept illustrations stay labelled as such.
- No clipped titles or horizontal page overflow at desktop and 360px/320px phone widths; visible keyboard focus and labelled theme/search/category controls.
- Search can find entries on later pages; empty results offer Clear; pagination is bounded; reload, Back, contextual return, and old homepage project links work.
- Every project remains reachable through static links. The complete collection can grow without increasing homepage card count or DOM size.
- Privacy checks still cover sources, generated cases, catalog, and assets. New generated text receives the same exact-content review rules as the homepage.

## Checks and Limits

The pure library tests cover a 307-entry synthetic catalog, including the final entry, normalization, empty results, invalid page state, and query preservation. Independent in-memory rendering also produced 307 case pages and 52 static library pages with only three homepage cards. This verifies collection handling and output generation; it is not a browser performance benchmark for hundreds of real projects.

The browser downloads the compact card catalog once when the library opens, then renders only the selected page. The homepage never fetches that catalog. For substantially larger collections, measure payload and interaction time before introducing a separate search index or server; neither is required by the current eleven-project collection.
