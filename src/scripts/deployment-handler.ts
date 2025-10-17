/**
 * Deployment Handler - Handles stale asset references after deployment
 *
 * Problem: When Vite builds run, they generate content-hashed filenames (e.g., about.BSELGt1H.css).
 * Due to Vite's non-deterministic hashing, each build can produce different hashes even with
 * identical source code. When a new deployment occurs, users with cached HTML may reference
 * old asset hashes that no longer exist, resulting in 404 errors.
 *
 * Solution: Listen for Vite's preloadError event, which fires when dynamic imports or
 * preloaded assets fail to load (typically 404s). When detected, automatically reload
 * the page to fetch fresh HTML with correct asset hashes.
 *
 * Reference: https://vitejs.dev/guide/build.html#load-error-handling
 *
 * Cache Strategy:
 * - HTML: Cache-Control: no-cache (always revalidate)
 * - Assets: Cache-Control: max-age=31536000, immutable (cache forever)
 *
 * This pattern is recommended by Vite for production deployments to handle
 * asset hash changes gracefully without manual user intervention.
 */

window.addEventListener('vite:preloadError', (event) => {
  console.warn('[Deployment] Detected stale assets after deployment, reloading page...');
  console.debug('[Deployment] Error event:', event);

  // Reload the page to fetch fresh HTML with updated asset hashes
  window.location.reload();
});

// Log handler registration in development for debugging
if (import.meta.env.DEV) {
  console.log('[Deployment] Vite preload error handler registered');
}
