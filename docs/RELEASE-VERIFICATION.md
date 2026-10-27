# Release Verification

## October 27, 2026: Editorial Showcase

This refresh adds four case studies and changes presentation and wording while retaining the existing navigation and publication architecture. The owner selected the editorial direction after reviewing a comparison mockup.

- Seventeen Node tests passed, covering render destinations, category integrity, incomplete integrations, and publication protections. Expected masked rejection messages in the privacy tests are test fixtures, not release holds.
- Browser checks covered 1280px desktop, 800px tablet, and 360px/320px phone viewports. Checked both themes, reload persistence, visible-only bulk expansion, keyboard disclosure activation, keyboard selection retaining focus, cross-category Go, direct hero links, browser Back, and settled sticky-header offsets. No horizontal overflow or illustration overflow was found at the tested widths.
- All three retained screenshot assets loaded. Their bytes were unchanged. Product/game illustrations are labelled and use fictional content. Captured browser error/warning logs were empty during the exercised flows.
- Independent semantic review of the four new case studies found no material status, privacy, or attribution issue. It checked the separation of TestFlight/App Review from public release and the absence of private source and unlisted tester links.
- All three public app links returned 200 with the expected app titles. Repository metadata verified the public status of the five linked featured sources and the eight earlier-work destinations.
- Workspace references, the launcher, collector registrations, existing support/privacy pages, and legacy redirect were inspected. The project map and workspace index describe the same eleven-project showcase.

Publication and exact live-asset verification are recorded below after deployment. Underlying app tests and native-device acceptance were not rerun for this portfolio refresh.

## October 6, 2026: Categorized Work and Navigation

Deployed implementation: `7177d00cebf59d78f6eebed869c4f7a1c1b0489a` on the existing GitHub Pages user site. This is evidence for that revision, not a claim about future edits.

- Seven case studies: three Consumer Apps, two AI Tools, and two Knowledge & Productivity entries. All start collapsed; four capability/workflow illustrations expose no private destinations or runtime content.
- All 17 Node tests passed. Tests cover rendering, category integrity, publication coverage, exact-content name reviews, and rejection of broader or overlapping regex alternatives.
- Browser checks passed for all category filters, visible-only bulk expansion, cross-category Go, keyboard arrow selection retaining focus, direct project URLs, reload, browser Back, sticky sections, Contact, and the 404 page. Existing public app/source actions remained available.
- Desktop and 320px mobile layouts were checked in light and dark themes, including expanded case studies. No horizontal overflow or captured browser warnings/errors were observed. The header offset kept the tested destination visible after scrolling settled.
- Independent content review found no privacy blocker. Its keyboard-selection finding was fixed with explicit Go. Independent security review found an overlapping-regex issue; the dedicated-name-rule restriction and regression tests resolved it. The follow-up review reported no remaining blocker within that scope.
- The entire candidate and exact staged tree passed the privacy gate. A clean temporary checkout with the owner's ignored local policy reproduced the approved HTML, CSS, and JavaScript.
- GitHub Pages reported the exact commit built. Live `index.html`, `404.html`, `assets/site.css`, and `assets/site.js` matched the local release bytes. Live category filtering and project navigation were exercised.

Repository visibility was not changed. Checks did not expose private source or notes, inspect protected identity files directly, or prove every operating-system/browser combination. Responsive checks are evidence for the tested widths, not exhaustive accessibility certification. Documentation-only follow-ups preserve the application assets and rerun the publication gate.
