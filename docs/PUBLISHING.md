# Portfolio Publishing

The public artifact is a curated case study, independent of its subject's repository and private runtime data. Only explicitly approved names, descriptions, evidence, public links, and reviewed images belong here. A private repository does not make a deployed page private. Employer material is excluded, including summaries.

## Publication Boundary

The gate checks all candidate public files, including source, documentation, untracked non-ignored files, companion pages, and generated output. It checks the exact staged blobs again before commit. Private policy and review records stay in ignored `gate.local.json`; never print its patterns or copy protected values into documentation. Missing policy or scanner coverage stops publication. Keep global hooks enabled.

Text scanning cannot inspect image pixels. Changed PNGs need visual privacy review and an updated digest in `assets/reviewed-images.json`. Unknown binaries remain blocked.

## Retake a Screenshot

The build never fetches screenshots. When a public app changes, retake its preview by hand with the headless Chrome command the first build used (from `build.mjs` in commit `ff247cf`), so size and framing match the other previews: 1280 by 800, the viewport is the image, scrollbars hidden. Run Google Chrome's own `chrome.exe` (in its Program Files folder) and write to a temporary folder first, with a throwaway profile:

```sh
chrome.exe --headless=new --disable-gpu --no-first-run --no-default-browser-check --user-data-dir=<temp>/portfolio-chrome-profile --hide-scrollbars --window-size=1280,800 --virtual-time-budget=8000 --screenshot=<temp>/<id>.png <live app URL>
```

Look at the image beside the one it replaces (no personal data, only the app's own demo content, nothing the case no longer claims), copy it to `assets/shots/<id>.png`, put its SHA-256 in `assets/reviewed-images.json`, and show the owner both images before publishing. First used this way on 2026-11-12 for Car TCO Compare.

## Maintain a Public Name Review

An owner may authorize a case-study name that an older private-name rule still blocks. Keep the rule. A local `nameReviews` entry contains `file`, `name`, and `sha256`, and applies only to that literal in that file's exact reviewed UTF-8 text, with CRLF normalized to LF.

1. Read the changed public text and verify the owner's authorization still covers the name and context. A matching title alone does not approve the surrounding content.
2. Resolve the actual candidate. For generated pages, use the current `render()` output, including current asset versions; do not review stale HTML on disk. Source and generated files each require their own record.
3. Refresh only the affected file/name record after review. Retain all original patterns and unrelated records. Do not bulk-refresh hashes as a way to clear a hold. `node scripts/refresh-name-reviews.mjs <file...>` does exactly this for the files named, against the actual candidate (render output for generated pages), and reports every other record without touching it; the owner runs it, since the policy file is a security control an assistant stops at (2026-11-05).
4. Run the full candidate gate, stage the final files, and run `node build.mjs --check-staged`. Any intervening content change requires review again.
5. Commit and push normally. Confirm the deployment commit and compare the affected live assets with the approved output.

Only a standalone literal-name rule qualifies, with the implementation's limited word-boundary and space/hyphen variants. Broad regexes and alternatives cannot receive exceptions: regex iteration can miss overlapping alternatives after an approved match. Other pattern matches, credentials, personal values, addresses, paths, and image rules always inspect the original content.

## Verification Scope

Use read-back and diff checks for documentation changes, plus the mandatory publication gate. Navigation changes need keyboard selection and Go, cross-category jumps, direct URLs, reload/Back, measured sticky offsets, narrow-screen overflow, both themes, and the affected live behavior. Gate changes require targeted privacy tests and independent review. See the dated [Release Verification](RELEASE-VERIFICATION.md) rather than treating past test results as a guarantee for new changes.
