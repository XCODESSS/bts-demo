# Demo Planning Findings

Observed: 2026-10-26. Read-only inspection unless stated otherwise. Historical reports are not fresh test results.

## Workspace reality

`D:/Bts-demo` initially contained only `PROJECT_CONTEXT.md`; `git status` reported no Git repository. No app, dependencies, tests or deployment existed. Current new files are planning documents only. Do not claim a running demo, passing tests or completed asset preparation.

## Reusable data and actual file coverage

Sources inspected: `D:/perfume-search/README.md`, `docs/implementation-status.md`, `docs/catalogue-audit.md`, `docs/catalogue-quality.json`, `site/data/catalogue.js`, `package.json` and asset folders.

A read-only Node inspection of the actual exported array verified:

- 608 records and 608 unique IDs across 117 brands.
- 541 records classified as perfume.
- 602 referenced local image files; none of those file references was missing.
- Image statuses: 602 `reference`, 6 `needs-confirmation`.
- Existing price currency: INR, unsuitable as a supposed client AED price.
- A preliminary filter for perfume + exact match + photo + positive single size + non-quarantined notes yielded 392 candidates across 101 brands (95 Men, 66 Women, 230 Unisex, 1 Unverified). This is not the final eligible/curated pool: unresolved warnings, conditions, duplicate identities and visuals still need review.

Implication: curate 100 records from the normalized export rather than re-extracting the workbook or rebuilding the prior research pipeline. Never copy existing price/source objects wholesale.

The source README warns that its root contains supplier workbooks/private data and must never be published. Source docs report 46 tests passed on October 24; those tests were not rerun here and do not prove this new demo works.

## Photo permission versus representation

Source metadata says all 602 photos are reference-only and original publication rights were unconfirmed. The user subsequently explicitly confirmed permission to publish the existing photos in this planning conversation. Record this as user-provided permission; do not rewrite historical source metadata or claim independent license verification.

A reference photo is still not proof of supplied size, edition, retail packaging, authenticity or Beyond the Space stock. Preserve truthful demo/reference disclosure.

## Logo inspection

Opened the supplied image directly: `C:/Users/SHREYARTH/OneDrive/ドキュメント/WhatsApp Image 2026-10-26 at 4.10.44 PM.jpeg`.

It is a 736 × 1600 social-profile screenshot, not a clean logo file. The central circular artwork shows a champagne BS monogram and script brand name on deep teal. Teal sampled inside the logo is RGB (7, 54, 60), hex `#07363C`.

Approximate artwork crop: `(127, 462, 611, 946)`. It must be visually checked after cropping; no asset was created during planning. Reusing the full screenshot would expose irrelevant mobile/profile UI.

## Local tooling

Read-only commands verified Node 22.23.4, npm 10.9.9, Python 3.12.6 and Pillow availability. Existing browser executables:

- `C:/Program Files/Google/Chrome/Application/chrome.exe`
- `C:/Program Files (x86)/Microsoft/Edge/Application/msedge.exe`

Implication: browser testing can use installed Chrome (`channel: 'chrome'`) without downloading or touching a personal browser profile. Browser launch itself has not been tested for this project.

Registry observations on October 26: Next 16.4.3 requires Node >=20.9; React 19.3.1; Vitest 5.0.5 requires Node ^22.12 or compatible newer supported versions; Playwright 1.64.1 requires Node >=20; TypeScript registry latest is 7.0.2. Pin TypeScript to the mature 5.x line for this demo rather than adopting a new major unnecessarily. These are planning-time observations, not installed dependencies.

## Frontend skill discovery

Selected **Anthropic `frontend-design`**, official source `anthropics/skills`.

- Skill: https://github.com/anthropics/skills/blob/main/skills/frontend-design/SKILL.md
- Discovery page: https://skills.sh/anthropics/skills/frontend-design
- Source metadata: https://api.github.com/repos/anthropics/skills
- Search surfaced approximately 1.0M installs; GitHub API reported 183,877 repository stars at inspection. Popularity is a discovery signal, not a quality guarantee.

Read the full skill via the raw official file. Applied guidance: define a compact token system before code, ground hero/type/layout in the subject and supplied logo, spend visual boldness in one place, avoid generic template decoration, write useful honest copy, respect reduced motion and review real screenshots. Its example premise about prior client rejection is generic skill framing, not a fact about this client.

No skill was installed globally or into this project. The implementation plan references the official skill for later reuse, subject to reviewing its then-current contents. Optional future installation command: `npx skills add https://github.com/anthropics/skills --skill frontend-design` (not run).

## Official technical sources consulted

- https://nextjs.org/docs/app/getting-started/installation — manual installation, Node requirements, direct ESLint invocation; Next 16 build does not automatically lint.
- https://nextjs.org/docs/app/guides/internationalization — locale segment, root layout nested under the locale, dictionaries and `generateStaticParams`.
- https://nextjs.org/docs/app/api-reference/file-conventions/page — await `params` and `searchParams` in current App Router pages.
- https://nextjs.org/docs/app/api-reference/config/next-config-js/redirects — root `/` to `/en` temporary redirect in config.
- https://playwright.dev/docs/browsers — installed Chrome/Edge channels, no browser installation necessary for that route.

Implication: use `[locale]/layout.tsx` as the root layout, explicit locale validation and simple dictionaries; do not nest an extra `<html>` inside a generated root layout. Use normal Next build/start rather than static export, since query-backed catalogue pages and the root redirect are convenient here.
