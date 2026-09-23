# Vecia Website (Astro) — vecia.fr

Astro-based site for Vecia (vecia-website-v5, Astro 4.x+). Server-first architecture,
static generation by default, islands for interactivity.

## Area
Vecia

## Routing Table

| Task | Go to | Read |
|---|---|---|
| Astro framework reference | `docs/ASTRO_REFERENCE.md` | full file |
| Quick start / common commands | `docs/astro-quick-start.md` | — |
| Integrations (UI frameworks, adapters) | `docs/astro-integrations.md` | — |
| Deployment (platform-specific) | `docs/astro-deployment.md` | — |
| VPS deployment + GitHub Actions CI/CD | `docs/vps-deployment-github-actions.md` | — |
| Creating specialized Claude Code agents | `docs/claude-code-agents.md` | — |
| i18n | `docs/ASTRO-I18N-REFERENCE.md` | — |
| Tailwind CSS v4 config | `docs/TAILWIND-REFERENCE.md` | — |
| Alpine.js interactive patterns | `docs/ALPINEJS-REFERENCE.md` | `docs/ALPINEJS-USAGE-GUIDE.md` |
| V5 implementation roadmap | `docs/IMPLEMENTATION-PLAN.md` | — |
| Homepage FR/EN content source | `docs/TEXT-EXTRACTION-Homepage.md` | — |
| 2025 best-practices updates | `docs/2025-UPDATES.md` | — |
| This project's Astro code patterns, style, structure | `docs/ASTRO-CODE-PATTERNS.md` | full file |
| Claude Code workflow (phase protocol, debugging, testing) | `docs/CLAUDE-CODE-WORKFLOW.md` | full file |
| Phase checklist (open before ANY phase) | `docs/PHASE-CHECKLIST.md` | full file |
| Git workflow, commit conventions | `docs/GIT-WORKFLOW.md` | `docs/GIT-QUICK-START.md` |
| Blog pipeline | `docs/BLOG-WORKFLOW.md` | `docs/BLOG-AGENT-QUICK-REFERENCE.md` |
| Research + decisions | `docs/research/` + `docs/decisions/` | INDEX.md first |

## Essential Commands

```bash
npm run dev              # dev server, http://localhost:4321
npm run build             # production build
npm run preview           # preview production build
npm run astro check       # type checking
npx astro add <name>      # add an integration
npx @astrojs/upgrade      # upgrade Astro + integrations
```

## Docs Convention

Research + decisions: `docs/research/` + `docs/decisions/` — INDEX.md in each. See ADR 0000 in unified-memory.

---

Rewritten 2026-09-23 (ICM migration, task `c1a473f7`) from a 514-line reference
document with zero routing rows into this router; its full content moved verbatim
into `docs/ASTRO-CODE-PATTERNS.md` and `docs/CLAUDE-CODE-WORKFLOW.md` — nothing
was dropped, only relocated.
