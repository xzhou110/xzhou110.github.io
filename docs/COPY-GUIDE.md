# Employer-Facing Copy

## Accepted Direction

On October 27, 2026, the owner accepted the Curated Highlights layout and asked to optimize the framing and wording so the work is presented effectively to future employers. This pass keeps that layout, the visual previews, original icons, and project selection.

The positioning remains **AI, Data Science & Product**. The headline, **From Problem to Product**, introduces the connection between the work: identify a useful problem, make product and technical decisions, build with AI assistance, and check the result. The biography names concrete uses and distinguishes Lukas's product direction and release decisions from AI-assisted implementation.

## Writing Rules

- Write card summaries around the user's task: plan a day, compare cars, coordinate agents, or trace ideas to sources. Keep them short enough to scan beside a visual.
- Use the case introduction to explain the product and its distinguishing behavior. Keep implementation details in the case body.
- Show ownership through specific choices and responsibilities. Keep AI assistance explicit; retain concrete examples of reviews catching defects.
- Prefer delivery facts over conclusions such as “This project demonstrates…” or “It shows how…”. Readers can assess the evidence themselves.
- Preserve release boundaries, evidence dates, limitations, public-link availability, and the distinction between illustration and screenshot. A wording refresh does not revalidate an app.
- Describe observational data work as prediction or exploration of patterns. Do not imply that regression or topic modeling establishes causality.
- Keep capabilities separate from the technologies listed in a project. Do not add seniority, employment history, framework mastery, business traction, or measured impact without evidence.
- Make actions clear: View Case Study opens the explanation; Open App and View Source remain separate actions inside the case. The contact copy invites a conversation about a team's problems and relevant opportunities.

## Reproduction Brief

> Refine this portfolio for a prospective employer while preserving the accepted Curated Highlights layout and every visual. Use the curated source as the factual boundary. Make the first screen explain the work and Lukas's contribution, write project summaries around useful tasks, simplify jargon in case introductions, and retain specific decisions and verification. Remove vague self-assessment and causal overstatement. Preserve identities, project order, release states, dates, limitations, links, and image bytes. Keep AI, Data Science & Product as the positioning. Review the result at desktop and narrow-phone widths, and publish only through the existing privacy checks.

## Source and Checks

`content/portfolio.json` owns the headline, biography, section introductions, contact heading, skills, project copy, and search/share descriptions. The renderer now reads the existing `workIntro` field instead of duplicating its wording. Small structural labels remain in the render modules. The generated catalog and case pages are rebuilt from this source.

For this text-focused change, review the source diff and affected rendered pages, including the longer case-study action on narrow cards. Run the mandatory candidate and staged publication checks and the normal pre-push check. Verify the deployed text and affected assets after Pages completes. No new behavior tests or full QA sweep are needed. Dated results belong in [Release Verification](RELEASE-VERIFICATION.md).
