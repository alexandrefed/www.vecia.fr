# GSD Debug Knowledge Base

Resolved debug sessions. Used by `gsd-debugger` to surface known-pattern hypotheses at the start of new investigations.

---

## vps-deploy-pipeline-broken — docker compose down silently fails when container was started outside compose context
- **Date:** 2026-03-30
- **Error patterns:** RenderUndefinedEntryError, content not found, blog pages crash, container name conflict, No resource found to remove, docker compose down fails, stale container, old image running
- **Root cause:** `docker compose down` silently reported "No resource found to remove" because the running container was started outside compose context (manually or by an older workflow). `docker compose up -d` then failed with a container name conflict, leaving the old stale container running. The old container was built from an October 2025 VPS Dockerfile (artifacts without blog pre-rendering), causing RenderUndefinedEntryError on all blog pages.
- **Fix:** Replace `docker compose down` with explicit `docker stop <name> && docker rm <name>` (by container name) before `docker compose up -d`. This works regardless of how the container was originally started.
- **Files changed:** .github/workflows/deploy.yml
---

