/**
 * Site-wide Configuration
 *
 * Centralized configuration for URLs, contact info, and external services.
 * Uses environment variables for deployable settings.
 *
 * Usage:
 *   import { config } from './config';
 *   console.log(config.site.url);
 */

export const config = {
  site: {
    title: 'Vecia',
    description: 'Field notes on what AI is actually good and bad at, case files of real deployments told from the moment they broke, and a weekly log of the workbench.',
    url: import.meta.env.PUBLIC_SITE_URL || 'https://vecia.fr',
    author: 'Alexandre Fedotov',
  },

  calcom: {
    bookingUrl: import.meta.env.PUBLIC_CAL_COM_URL || 'https://cal.vecia.fr/alexandre/rendez-vous',
  },

  social: {
    linkedin: 'https://www.linkedin.com/company/vecia',
  },

  contact: {
    email: 'contact@vecia.fr',
  },

} as const;
