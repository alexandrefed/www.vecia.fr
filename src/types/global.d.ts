/**
 * Global TypeScript declarations for Vecia website
 *
 * Extends the Window interface with third-party analytics libraries
 * that are loaded via script tags in the browser.
 */

// Google Analytics gtag.js
interface GtagEvent {
  event_category?: string;
  event_label?: string;
  value?: number;
  page_path?: string;
  page_title?: string;
  page_location?: string;
  [key: string]: unknown;
}

type GtagConfigParams = {
  page_path?: string;
  page_title?: string;
  anonymize_ip?: boolean;
  [key: string]: unknown;
};

type GtagConsentParams = {
  ad_storage?: 'granted' | 'denied';
  analytics_storage?: 'granted' | 'denied';
  ad_user_data?: 'granted' | 'denied';
  ad_personalization?: 'granted' | 'denied';
  wait_for_update?: number;
};

declare function gtag(
  command: 'config',
  targetId: string,
  config?: GtagConfigParams
): void;
declare function gtag(
  command: 'event',
  action: string,
  params?: GtagEvent
): void;
declare function gtag(
  command: 'consent',
  action: 'default' | 'update',
  params: GtagConsentParams
): void;
declare function gtag(command: 'js', date: Date): void;
declare function gtag(command: 'set', params: Record<string, unknown>): void;

// Meta Pixel (Facebook)
interface FbqEvent {
  content_name?: string;
  content_category?: string;
  content_type?: string;
  content_ids?: string[];
  value?: number;
  currency?: string;
  event_id?: string;
  [key: string]: unknown;
}

declare function fbq(
  command: 'init',
  pixelId: string,
  advancedMatching?: Record<string, string>
): void;
declare function fbq(
  command: 'track',
  eventName: string,
  params?: FbqEvent
): void;
declare function fbq(
  command: 'trackCustom',
  eventName: string,
  params?: FbqEvent
): void;
declare function fbq(
  command: 'consent',
  action: 'grant' | 'revoke'
): void;

// LinkedIn Insight Tag
interface LinkedInTrackParams {
  conversion_id?: string;
  [key: string]: unknown;
}

declare function lintrk(command: 'track', params?: LinkedInTrackParams): void;

// Plausible Analytics
type PlausibleEventOptions = {
  props?: Record<string, string | number | boolean>;
  callback?: () => void;
  revenue?: { currency: string; amount: number };
};

declare function plausible(
  eventName: string,
  options?: PlausibleEventOptions
): void;

// Extend Window interface
declare global {
  interface Window {
    // Google Analytics
    gtag: typeof gtag;
    dataLayer: unknown[];

    // Meta Pixel
    fbq: typeof fbq;
    _fbq: typeof fbq;

    // LinkedIn Insight Tag
    lintrk: typeof lintrk;
    _linkedin_data_partner_ids?: string[];

    // Plausible Analytics
    plausible: typeof plausible;

    // Vecia custom config (for SSR hydration)
    __VECIA_CONFIG__?: {
      n8nLeadWebhook?: string;
      n8nNewsletterWebhook?: string;
      [key: string]: unknown;
    };

    // Newsletter webhook URL
    __VECIA_NEWSLETTER_WEBHOOK__?: string;

    // Alpine.js global instance
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    Alpine: any;
  }
}

export {};
