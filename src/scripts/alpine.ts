import Alpine from 'alpinejs';
import intersect from '@alpinejs/intersect';

// Register Intersect plugin
Alpine.plugin(intersect);

// Register Lead Capture Form component
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

      // TODO: Replace with actual Google Apps Script webhook URL
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

// Initialize Alpine.js
window.Alpine = Alpine;
Alpine.start();
