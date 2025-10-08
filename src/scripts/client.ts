/**
 * Client-side entry point for Vecia website
 *
 * This file bundles all client-side JavaScript including:
 * - Alpine.js initialization and plugins
 * - Dynamic pricing system
 * - Alpine.js components (lead capture form, etc.)
 *
 * Astro will automatically bundle this file and all its dependencies
 * into optimized production JavaScript in /_astro/*.js
 */

import Alpine from 'alpinejs';
import intersect from '@alpinejs/intersect';
import { detectCurrency, updatePriceElements } from './pricing-utils';

// Register Alpine.js plugins
Alpine.plugin(intersect);

// Register Alpine.js Lead Capture Form component
Alpine.data('leadCaptureForm', () => ({
  formData: {
    name: '',
    email: '',
    companySize: ''
  },
  loading: false,
  success: false,
  error: false,
  errorMessage: '',

  async submitForm() {
    // Reset states
    this.loading = true;
    this.error = false;
    this.success = false;
    this.errorMessage = '';

    try {
      // Get language from current page
      const lang = window.location.pathname.startsWith('/en') ? 'en' : 'fr';

      // Prepare data for submission
      const submissionData = {
        timestamp: new Date().toISOString(),
        name: this.formData.name,
        email: this.formData.email,
        companySize: this.formData.companySize,
        language: lang,
        source: document.referrer || 'Direct',
        utm_campaign: new URLSearchParams(window.location.search).get('utm_campaign') || '',
        utm_source: new URLSearchParams(window.location.search).get('utm_source') || '',
        utm_medium: new URLSearchParams(window.location.search).get('utm_medium') || '',
        page_url: window.location.href
      };

      // Google Apps Script webhook URL
      const WEBHOOK_URL = 'https://script.google.com/macros/s/AKfycby_23XSfxU0NBNgfbufOqhDa6ywjs34tjXp1-kEYLtNMauZiA2B64kzXUAKFKeRqB-VXA/exec';

      // Submit to webhook
      const response = await fetch(WEBHOOK_URL, {
        method: 'POST',
        mode: 'no-cors', // Required for Google Apps Script
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(submissionData)
      });

      // Note: With no-cors mode, we can't read the response
      // Assume success if no error was thrown
      this.success = true;
      this.loading = false;

      // Reset form after 2 seconds
      setTimeout(() => {
        this.formData = {
          name: '',
          email: '',
          companySize: ''
        };
      }, 2000);

      // Optional: Track conversion in analytics
      if (typeof window.plausible !== 'undefined') {
        window.plausible('Lead Capture', {
          props: { companySize: this.formData.companySize, lang }
        });
      }

    } catch (err) {
      console.error('Form submission error:', err);
      this.error = true;
      this.errorMessage = lang === 'fr'
        ? 'Une erreur s\'est produite. Veuillez réessayer.'
        : 'An error occurred. Please try again.';
      this.loading = false;
    }
  }
}));

// Make Alpine available globally (required for x-data, x-show, etc.)
window.Alpine = Alpine;

// Initialize Alpine.js
Alpine.start();

// Initialize dynamic pricing system
async function initPricing() {
  try {
    const currency = await detectCurrency();
    updatePriceElements(currency);
  } catch (error) {
    console.error('Failed to initialize pricing:', error);
    // Fallback to EUR if everything fails
    updatePriceElements('EUR');
  }
}

// Run pricing initialization when DOM is ready
if (document.readyState === 'loading') {
  document.addEventListener('DOMContentLoaded', initPricing);
} else {
  // DOM already loaded
  initPricing();
}

// Export for potential external access (optional)
export { Alpine };
