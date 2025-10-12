/**
 * API Route: GET /api/health.json
 *
 * Simple health check endpoint to verify Node.js server is running.
 * Used by deployment verification and monitoring systems.
 *
 * Returns:
 * - status: "ok" if server is healthy
 * - timestamp: Current ISO timestamp
 * - node_env: Environment mode (production/development)
 * - uptime: Server uptime in seconds
 */

import type { APIRoute } from 'astro';

// Disable prerendering for dynamic health check
export const prerender = false;

export const GET: APIRoute = async () => {
  return new Response(
    JSON.stringify({
      status: 'ok',
      timestamp: new Date().toISOString(),
      node_env: import.meta.env.MODE,
      uptime: process.uptime(),
    }),
    {
      status: 200,
      headers: {
        'Content-Type': 'application/json',
        'Cache-Control': 'no-store, no-cache, must-revalidate',
      },
    }
  );
};
