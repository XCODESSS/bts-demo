# shadcn/ui integration

Added by explicit user request on 2026-10-28. This is the actual shadcn/ui component source distribution model, not a renamed custom card library.

## Sources and setup

Vendored from the official **new-york-v4** registry:

- `https://ui.shadcn.com/r/styles/new-york-v4/card.json` → `src/components/ui/card.tsx`
- `https://ui.shadcn.com/r/styles/new-york-v4/skeleton.json` → `src/components/ui/skeleton.tsx`
- `https://ui.shadcn.com/r/styles/new-york-v4/tabs.json` → `src/components/ui/tabs.tsx`
- `https://ui.shadcn.com/r/styles/new-york-v4/accordion.json` → `src/components/ui/accordion.tsx` (local SVG chevron instead of adding an icon dependency)

Source formatting/type imports were adapted locally; `cn` is re-exported through `src/lib/utils.ts`, as supported by the manual installation guide. Tabs retain the Radix primitive and shadcn variant/utility implementation. `components.json` documents aliases and the stylesheet for future additions.

Manual installation documentation: `https://ui.shadcn.com/docs/installation/manual`.
Tailwind setup: `https://tailwindcss.com/docs/installation/using-postcss`.
Preflight rationale: `https://tailwindcss.com/docs/preflight`.

Installed exact versions: `cn` 0.5.0, `class-variance-authority` 0.7.1, `radix-ui` 1.8.1, `tw-animate-css` 1.4.0, and build-only `tailwindcss` / `@tailwindcss/postcss` 4.3.3. npm reported zero known vulnerabilities at installation.

Existing CSS Modules remain authoritative. `src/styles/shadcn.css` imports Tailwind theme/utilities **without Preflight**, preventing an unrelated reset of existing typography, buttons and admin forms. UI colour tokens use `--ui-*` names to avoid overwriting the site's existing `--muted` text colour and gold `--accent`. No framework, backend, product schema or authentication migration was made.

## Usage

- Customer-experience preview cards use shadcn Card / CardContent / CardFooter, with explicit sample-review labels rather than false verified claims.
- `ScrollSection` keeps real section structure server-rendered and uses `tw-animate-css` for one-time viewport reveals. Product photographs retain native lazy loading. Whole-section Skeleton replacement was removed after it caused measurable anchor-navigation drift; the vendored Skeleton primitive remains available but is no longer used to gate homepage content.
- Scent navigation uses shadcn/Radix Tabs with an additional measured green indicator, smooth physical-coordinate movement in LTR/RTL, keyboard support and a green hover wash.
- Product descriptions and selected notes use shadcn/Radix Accordion, including presence-aware height animations on both opening and closing. The branded content duration is 320 ms; reduced motion remains instant. Both panels can be toggled independently.
- System reduced-motion settings suppress pulses and transitions. The former Pause animations button was removed by user instruction.

## License

Upstream license: `https://github.com/shadcn-ui/ui/blob/main/LICENSE.md`.

MIT License

Copyright (c) 2023 shadcn

Permission is hereby granted, free of charge, to any person obtaining a copy
of this software and associated documentation files (the "Software"), to deal
in the Software without restriction, including without limitation the rights
to use, copy, modify, merge, publish, distribute, sublicense, and/or sell
copies of the Software, and to permit persons to whom the Software is
furnished to do so, subject to the following conditions:

The above copyright notice and this permission notice shall be included in all
copies or substantial portions of the Software.

THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR
IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY,
FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE
AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER
LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM,
OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN THE
SOFTWARE.
