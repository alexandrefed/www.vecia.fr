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

// Extend Window interface
declare global {
  interface Window {
    // Google Analytics
    gtag: typeof gtag;
    dataLayer: unknown[];

    // Alpine.js global instance
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    Alpine: any;
  }
}

export {};
