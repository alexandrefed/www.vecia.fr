# Context: vecia.fr (crew site)

vecia.fr is the front door of a small crew that builds AI systems and shows the work. English at `/`, French under `/fr/`. Each person has a page at `<name>.vecia.fr` served by this same app. No selling machinery: no forms, no pixels, no calculators.

## Where things live

| What | Where |
|---|---|
| Public copy (nav, home, office hours, labels), EN and FR | `src/i18n/en/site.ts`, `src/i18n/fr/site.ts` (FR typed as `SiteCopy`; strings the builder added carry `// TODO-COPY`) |
| Legal texts (privacy, terms, cookies, AI ethics) | `src/i18n/{en,fr}/legal.ts` through `src/i18n/ui.ts`; pages in `src/pages/` (EN) and `src/pages/fr/` |
| People (one file each, frontmatter only) | `src/content/people/*.md` |
| Notes, cases, log (language = `en/` or `fr/` folder) | `src/content/{notes,cases,log}/` ; helpers in `src/lib/content.ts` |
| Page bodies shared by EN and FR | `src/components/views/*.astro`; pages are thin wrappers |
| Host routing (`<name>.vecia.fr`), legacy redirects, CSP | `src/middleware.ts` (`sequence(hostRouter, legacyRedirects, securityHeaders)`) |
| Redirect map for retired pages | `redirects` in `astro.config.mjs`; old blog URLs in `legacyRedirects` in `src/middleware.ts` |
| Person URLs (subdomain in production, `/people/<name>/` in dev) | `src/lib/people.ts` |
| Feeds | `src/pages/rss.xml.ts`, `feed.json.ts`, `llms.txt.ts` (items from `src/lib/feed.ts`) |
| Deploy | `Dockerfile` (Node 24), `.github/workflows/deploy.yml` |

## Collections

`people`, `notes` (claim, verdict, evidence, updates, archive flag), `cases`, `log` (weekly workbench, shown at `/workshop`). Comments (`src/components/blog/Comments*.astro`, `src/lib/supabase*.ts`, `src/pages/api/comments/`) are parked: not rendered on any page until a later phase replaces them.

## Rules

- Public prose is approved by Alexandre in a PR. Never rewrite copy in `site.ts` or `people/*.md` without that.
- Private harvest material never enters this public repo.
- `/alexandre-tree` is printed on a QR code: it must keep redirecting to `https://alexandre.vecia.fr/`.

## Plan and tasks

Plan: `~/.claude/plans/hey-i-have-abandoned-linear-tulip.md`. Tasks: f912599f, d36e8d86, 31164267, 4d9145da.
