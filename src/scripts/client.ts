/**
 * Client-side entry point for the Vecia site.
 *
 * Starts Alpine.js (navigation menus, comments) and the stale-asset handler.
 * Astro bundles this into /_astro/*.js.
 */

import Alpine from 'alpinejs';
import intersect from '@alpinejs/intersect';
import './deployment-handler'; // Handle stale assets after deployment

Alpine.plugin(intersect);

// Make Alpine available globally (required for x-data, x-show, etc.)
window.Alpine = Alpine;

Alpine.start();

export { Alpine };
