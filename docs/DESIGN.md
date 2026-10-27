# Portfolio Design

## Shared Foundation

The owner's approved preferences provide a reusable visual language: calm light surfaces, charcoal dark mode, restrained teal, system typography, thin borders, 16px cards, and a consistent spacing scale. Local CSS tokens carry these choices without a private app or snapshot dependency.

## Public Audience Adaptation

- The header wordmark uses the full curated name, Xu Zhou (Lukas), matching the page identity and linking back to the top. It is separate from the browser favicon. Avoid an unexplained nickname-only brand or decorative trailing punctuation.
- Lead with the value Lukas brings, followed immediately by shipped work.
- Keep each product's image, purpose, capabilities, and live/source links visible. Detailed evidence lives in a native, keyboard-accessible disclosure, collapsed initially.
- Selected Work can include public apps and private/local tooling. Use a labelled workflow or capability illustration where a real screenshot would expose private content. Omit unavailable app/source links and preserve a useful native case-study control. Status is stated without inventing a public demo or complete integration.
- Prefer Selected Work over Selected Projects: it accommodates products, tools, and workflows. Group by purpose (Consumer Apps, AI Tools, Knowledge & Productivity), not the overlapping skills used to build them. AI, Data Science & Product is the owner-selected positioning, reflected in the hero, descriptions, and skill order. The end-to-end headline expresses the outcome.
- Offer all eleven projects initially, with category filters to shorten the list and a native Jump to Project selector for direct access. Announce result counts, expose pressed states, preserve category/project URLs and browser history, and reveal a selected project even when it belongs to another category. Bulk expansion affects visible cards only. Keep all content readable without JavaScript and printable regardless of the active filter.
- Keep the section menu visible while scrolling, indicate the current section, and include Contact plus a footer Back to Top. Measure the responsive header so anchor targets clear it. Keep controls usable on narrow screens without horizontal scrolling.
- Pair Jump to Project with Go. A native selector can emit change events while someone uses arrow keys; moving focus immediately interrupts browsing its options. Move focus and scroll only on submission. Preserve unrelated URL parameters when writing filter or project destinations.
- Present a short three-step approach and four capability groups. Keep framework lists within the product evidence and supporting stack sentence.
- Group historical experiments by subject in collapsed categories with readable project names.
- Label both Light and Dark choices. Respect the OS initially, persist explicit choices, preserve visible focus, and respect reduced motion.
- Use a 1160px canvas and 16px body text; collapse columns on narrow screens. Links wrap instead of truncating.

## October 27 Editorial Direction

The owner chose the editorial showcase over a minimal project gallery after seeing both beside the existing design. A deep green introduction gives the page a distinct identity; three starting links guide a hiring reader toward mobile product delivery, data modeling, and AI workflows. A full-width mobile case study leads into a two-column gallery. Narrow screens use one column and retain the suggested starting points.

Release states and one key decision are visible before opening a case study. New mobile cases use labelled concept illustrations; their appearance is not presented as a device screenshot. Existing public screenshots retain their reviewed bytes. The contact section explicitly invites conversations about AI, data science, and product work.

The useful journey is: understand Lukas's focus, choose one of three relevant projects, inspect a decision and its evidence, then open public proof or get in touch. See [Refresh Brief](REFRESH-2026-10-27.md) for the reproducible method and selection rationale.

The owner accepted this build on October 27 and requested the projects' original icons. Use the configured product assets beside project names, in relevant starting links, and within applicable concept/workflow previews. Preserve their colors and proportions; keep text labels visible and icon alt text empty when the adjacent name already labels the project. Nine original marks are available; two unbranded tools remain text-led. See [Icon Sources](ICON-SOURCES.md) for source paths, exact hashes, intake review, and update procedure.

## Content and Privacy

No private operational status, dashboard content, invented traction, or inferred availability badges. Project evidence keeps its original date. Images remain reviewed previews, and estimates stay labelled. Only the visitor's theme preference is stored locally.

An owner-approved public project name may have an exact-text exception in the ignored local publication policy. That exception is tied to one public file's reviewed text hash and the precise name. New or modified text must be reviewed again; every other privacy rule and the global scanner still inspect the original content.

Keep a public case study as a separate, curated artifact. Explain the problem, decisions, implementation, evidence date, and limitations using original illustrative visuals where needed. Permission to describe a personal project does not authorize publishing its repository, runtime data, or notes. Employer material is excluded entirely. See [Publishing](PUBLISHING.md) for review maintenance.
