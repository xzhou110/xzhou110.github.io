# Portfolio Design

## Shared Foundation

The owner's approved preferences provide a reusable visual language: calm light surfaces, charcoal dark mode, restrained teal, system typography, thin borders, 16px cards, and a consistent spacing scale. Local CSS tokens carry these choices without a private app or snapshot dependency.

## Public Audience Adaptation

- The header wordmark uses the full curated name, Xu Zhou (Lukas), matching the page identity and linking back to the top. It is separate from the browser favicon. Avoid an unexplained nickname-only brand or decorative trailing punctuation.
- Lead with the value Lukas brings, followed immediately by shipped work.
- Keep each product's image, purpose, capabilities, and live/source links visible. Detailed evidence lives in a native, keyboard-accessible disclosure, collapsed initially.
- Selected Work can include public apps and private/local tooling. Use a labelled workflow or capability illustration where a real screenshot would expose private content. Omit unavailable app/source links and preserve a useful native case-study control. Status is stated without inventing a public demo or complete integration.
- Prefer Selected Work over Selected Projects: it accommodates products, tools, and workflows. Group by purpose (Consumer Apps, AI Tools, Knowledge & Productivity), not the overlapping skills used to build them. Product, AI & Data remains the overall positioning.
- Offer all seven projects initially, with category filters to shorten the list and a native Jump to Project selector for direct access. Announce result counts, expose pressed states, preserve category/project URLs and browser history, and reveal a selected project even when it belongs to another category. Bulk expansion affects visible cards only. Keep all content readable without JavaScript and printable regardless of the active filter.
- Keep the section menu visible while scrolling, indicate the current section, and include Contact plus a footer Back to Top. Measure the responsive header so anchor targets clear it. Keep controls usable on narrow screens without horizontal scrolling.
- Pair Jump to Project with Go. A native selector can emit change events while someone uses arrow keys; moving focus immediately interrupts browsing its options. Move focus and scroll only on submission. Preserve unrelated URL parameters when writing filter or project destinations.
- Present a short three-step approach and four capability groups. Keep framework lists within the product evidence and supporting stack sentence.
- Group historical experiments by subject in collapsed categories with readable project names.
- Label both Light and Dark choices. Respect the OS initially, persist explicit choices, preserve visible focus, and respect reduced motion.
- Use a 1160px canvas and 16px body text; collapse columns on narrow screens. Links wrap instead of truncating.

## Content and Privacy

No private operational status, dashboard content, invented traction, or inferred availability badges. Project evidence keeps its original date. Images remain reviewed previews, and estimates stay labelled. Only the visitor's theme preference is stored locally.

An owner-approved public project name may have an exact-text exception in the ignored local publication policy. That exception is tied to one public file's reviewed text hash and the precise name. New or modified text must be reviewed again; every other privacy rule and the global scanner still inspect the original content.

Keep a public case study as a separate, curated artifact. Explain the problem, decisions, implementation, evidence date, and limitations using original illustrative visuals where needed. Permission to describe a personal project does not authorize publishing its repository, runtime data, or notes. Employer material is excluded entirely. See [Publishing](PUBLISHING.md) for review maintenance.
