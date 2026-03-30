---
status: resolved
trigger: "vps-deploy-pipeline-broken: Docker build on VPS doesn't include content collection entries, deploy workflow builds from extracted artifacts, container needs Traefik support"
created: 2026-03-30T00:00:00Z
updated: 2026-03-30T10:00:00Z
---

## Current Focus
<!-- OVERWRITE on each update - reflects NOW -->

hypothesis: CONFIRMED AND RESOLVED

Root cause was confirmed: docker compose down silently failed (container not tracked by compose), docker compose up failed with name conflict, old October 2025 container kept running with empty content-modules.

Fix is committed, live container is healthy, all blog pages return 200.

next_action: archive session

## Symptoms
<!-- Written during gathering, then IMMUTABLE -->

expected: After git push to main, CI/CD deploys working website with all pages functional
actual: Blog pages crash with RenderUndefinedEntryError (content not found). The ArticleFooter config import fix IS in the new build, but blog content markdown files aren't included in the Docker image.
errors: |
  RenderUndefinedEntryError
    at renderEntry (file:///app/server/chunks/_astro_content_BoY29TzL.mjs:283:11)
    at file:///app/server/pages/blog/_---slug_.astro.mjs:29:29
  This means the Astro SSR content collection can't find the blog entries at runtime.
reproduction: Visit any blog post URL after a fresh deploy
started: After switching from nginx to Traefik reverse proxy; docker-compose was updated with Traefik labels but Dockerfile and deploy workflow may need fixes.

## Eliminated
<!-- APPEND only - prevents re-investigating -->

- hypothesis: Missing markdown source files in Docker image (Dockerfile doesn't COPY src/)
  evidence: Local build produces empty content-modules too; blog data IS in _astro_data-layer-content chunk; pre-rendered HTML exists. The content loader pre-renders at build time, not at runtime.
  timestamp: 2026-03-30T08:00:00Z

- hypothesis: Astro 5 glob() loader breaks SSR (content-modules always empty)
  evidence: content-modules IS empty in SSR builds but that's correct — Astro 5 with server output pre-renders the markdown HTML into the data-layer-content chunk instead. The empty content-modules only causes RenderUndefinedEntryError when entries lack the pre-rendered html property.
  timestamp: 2026-03-30T08:00:00Z

## Evidence
<!-- APPEND only - facts discovered -->

- timestamp: 2026-03-30T08:00:00Z
  checked: Running container on VPS (/app layout)
  found: Container had /app/server and /app/client, NOT /app/dist/server — meaning it was built from the stale VPS Dockerfile (COPY ./server ./server), not the repo Dockerfile (COPY --from=builder /app/dist ./dist)
  implication: The correct image from CI was loaded but the old container was never stopped

- timestamp: 2026-03-30T08:01:00Z
  checked: deploy.yml workflow logs for latest run (23729626670)
  found: "level=warning msg='Warning: No resource found to remove for project vecia-website'" then "Error response from daemon: Conflict. The container name '/vecia-website' is already in use"
  implication: docker compose down silently failed (container started manually, not tracked by compose), docker compose up failed with conflict error — old container kept running

- timestamp: 2026-03-30T08:02:00Z
  checked: content-modules chunk in VPS running container
  found: const contentModules = new Map(); — empty, 73 bytes. No entries.
  implication: Old image from October build with no pre-rendered HTML — every blog render() call throws RenderUndefinedEntryError

- timestamp: 2026-03-30T08:03:00Z
  checked: Local build content-modules
  found: Also empty — this is CORRECT for Astro 5 SSR. Blog data pre-rendered HTML is in _astro_data-layer-content chunk. Local test returns HTTP 200 for /blog/pourquoi-vecia
  implication: The fix is not about content-modules — it's about deploying the CORRECT image

- timestamp: 2026-03-30T08:04:00Z
  checked: VPS after manually loading tar.gz + docker stop/rm + docker compose up
  found: Container uses CMD ["node","./dist/server/entry.mjs"] (correct). HTTP 200 on /blog/pourquoi-vecia, /blog/claude-guide-debutant, /en/blog/claude-beginner-guide. No errors in logs.
  implication: Fix confirmed working

- timestamp: 2026-03-30T10:00:00Z
  checked: VPS live container state after fix committed
  found: CMD=["node","./dist/server/entry.mjs"], Status=running, Health=healthy. HTTP 200 on homepage, all 3 blog pages tested. vecia.fr and www.vecia.fr return 200 via Traefik. deploy.yml has fix committed at 9c0234f.
  implication: Pipeline is fully functional. Warning "Entry blog → en/mcps-indispensables was not found" is a non-blocking 404 (the English counterpart is named essential-mcps, not mcps-indispensables).

## Resolution
<!-- OVERWRITE as understanding evolves -->

root_cause: deploy.yml used `docker compose down` to stop the container before deploying the new image. The container was originally started outside of compose context (manually or from a previous workflow that ran on the VPS), so compose reported "No resource found to remove" and silently skipped teardown. The subsequent `docker compose up -d` then failed with a name conflict because the old container was still running. The workflow reported success because the old container still passed health checks. The old container was built from a stale VPS Dockerfile (October 2025) that copied pre-built artifacts without blog content pre-rendering, causing RenderUndefinedEntryError on every blog page visit.

fix: |
  1. Updated .github/workflows/deploy.yml: Added `docker stop vecia-website && docker rm vecia-website` (by name, not via compose) BEFORE docker compose up. This works regardless of how the container was originally started (commits 9c0234f and f2ecf25).
  2. Updated deploy.yml: Removed nginx cache clearing and certbot renewal steps (nginx is gone, Traefik handles TLS).
  3. Updated deploy.yml: Added blog page health check in Verify Deployment step to catch this class of failure early.
  4. Added Cleanup VPS Stale Artifacts step to remove old VPS Dockerfile that was causing confusion.
  5. Manually reloaded the correct tar.gz image and restarted the container to fix the live breakage immediately.

verification: "HTTP 200 on /blog/pourquoi-vecia, /blog/claude-guide-debutant, /en/blog/claude-beginner-guide, homepage, vecia.fr and www.vecia.fr via Traefik. Container CMD is correct (./dist/server/entry.mjs). Health status: healthy. No RenderUndefinedEntryError in logs."
files_changed: [".github/workflows/deploy.yml"]
