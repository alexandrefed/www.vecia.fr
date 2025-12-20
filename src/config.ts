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
    title: 'Vecia - AI Automation Agency',
    description: 'Implémentez l\'IA, Économisez Plus de 20h par Semaine, et Accélerez votre croissance',
    url: import.meta.env.PUBLIC_SITE_URL || 'https://vecia.com',
    author: 'Vecia Team',
  },

  calcom: {
    bookingUrl: import.meta.env.PUBLIC_CAL_COM_URL || 'https://cal.vecia.fr/team/vecia/consultation',
  },

  social: {
    linkedin: 'https://www.linkedin.com/company/vecia',
  },

  contact: {
    email: 'contact@vecia.com',
  },

  // Legacy Google Sheets webhook (backup)
  googleSheets: {
    webhookUrl: 'https://script.google.com/macros/s/AKfycby_23XSfxU0NBNgfbufOqhDa6ywjs34tjXp1-kEYLtNMauZiA2B64kzXUAKFKeRqB-VXA/exec',
  },

  // n8n webhook endpoints (primary - connects to Odoo CRM via Tailscale Funnel)
  n8n: {
    leadWebhookUrl: import.meta.env.PUBLIC_N8N_LEAD_WEBHOOK || 'https://srvdev2025.taildb74a2.ts.net/webhook/vecia-lead',
    newsletterWebhookUrl: import.meta.env.PUBLIC_N8N_NEWSLETTER_WEBHOOK || 'https://srvdev2025.taildb74a2.ts.net/webhook/vecia-newsletter',
  },
} as const;
