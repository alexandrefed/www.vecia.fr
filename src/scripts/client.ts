/**
 * Client-side entry point for Vecia website
 *
 * This file bundles all client-side JavaScript including:
 * - Alpine.js initialization and plugins
 * - Dynamic pricing system
 * - Alpine.js components (lead capture form, etc.)
 * - Deployment error handling (asset hash changes)
 *
 * Astro will automatically bundle this file and all its dependencies
 * into optimized production JavaScript in /_astro/*.js
 */

import Alpine from 'alpinejs';
import intersect from '@alpinejs/intersect';
import { detectCurrency, updatePriceElements } from './pricing';
import './deployment-handler'; // Handle stale assets after deployment

// Register Alpine.js plugins
Alpine.plugin(intersect);

// Input sanitization helper
const sanitizeInput = (input: string): string => {
  return input
    .trim()
    .replace(/[<>]/g, '') // Remove HTML brackets
    .replace(/['"]/g, '') // Remove quotes
    .slice(0, 255); // Max length 255 chars
};

// Email validation (RFC 5322 simplified)
const isValidEmail = (email: string): boolean => {
  const emailRegex = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;
  return emailRegex.test(email) && email.length <= 255;
};

// Rate limiting helper (max 3 submissions per hour)
const checkRateLimit = (key: string): { allowed: boolean; message: string } => {
  const now = Date.now();
  const hourAgo = now - (60 * 60 * 1000);

  // Get submission history
  const historyJson = localStorage.getItem(key);
  let history: number[] = historyJson ? JSON.parse(historyJson) : [];

  // Filter out submissions older than 1 hour
  history = history.filter(timestamp => timestamp > hourAgo);

  // Check if limit exceeded
  if (history.length >= 3) {
    const oldestSubmission = Math.min(...history);
    const minutesUntilReset = Math.ceil((oldestSubmission + (60 * 60 * 1000) - now) / (60 * 1000));
    return {
      allowed: false,
      message: `Rate limit exceeded. Please try again in ${minutesUntilReset} minute${minutesUntilReset > 1 ? 's' : ''}.`
    };
  }

  // Add current submission to history
  history.push(now);
  localStorage.setItem(key, JSON.stringify(history));

  return { allowed: true, message: '' };
};

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

      // 🔒 Security: Rate limiting check
      const rateLimit = checkRateLimit('vecia-lead-submissions');
      if (!rateLimit.allowed) {
        this.error = true;
        this.errorMessage = lang === 'fr'
          ? `Limite atteinte. Réessayez dans ${rateLimit.message.match(/\d+/)?.[0]} minute(s).`
          : rateLimit.message;
        this.loading = false;
        return;
      }

      // 🔒 Security: Input sanitization
      const sanitizedName = sanitizeInput(this.formData.name);
      const sanitizedEmail = sanitizeInput(this.formData.email);

      // 🔒 Security: Email validation
      if (!isValidEmail(sanitizedEmail)) {
        this.error = true;
        this.errorMessage = lang === 'fr'
          ? 'Veuillez saisir une adresse email valide.'
          : 'Please enter a valid email address.';
        this.loading = false;
        return;
      }

      // 🔒 Security: Name length validation
      if (sanitizedName.length < 2 || sanitizedName.length > 100) {
        this.error = true;
        this.errorMessage = lang === 'fr'
          ? 'Le nom doit contenir entre 2 et 100 caractères.'
          : 'Name must be between 2 and 100 characters.';
        this.loading = false;
        return;
      }

      // Prepare data for submission (using sanitized inputs)
      const submissionData = {
        timestamp: new Date().toISOString(),
        name: sanitizedName, // 🔒 Sanitized
        email: sanitizedEmail, // 🔒 Sanitized
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

// Register Alpine.js Multi-Step Form component
Alpine.data('multiStepForm', () => ({
  currentStep: 1,
  formData: {
    goal: '',
    companySize: '',
    industry: '',
    pain: '',
    budget: '',
    timeline: '',
    name: '',
    email: '',
    company: ''
  },
  loading: false,
  success: false,
  error: false,
  errorMessage: '',

  nextStep() {
    if (this.currentStep < 4) {
      this.currentStep++;
    }
  },

  prevStep() {
    if (this.currentStep > 1) {
      this.currentStep--;
    }
  },

  async submitForm() {
    this.loading = true;
    this.error = false;
    this.errorMessage = '';

    try {
      const lang = window.location.pathname.startsWith('/en') ? 'en' : 'fr';

      // Rate limiting check
      const rateLimit = checkRateLimit('vecia-getstarted-submissions');
      if (!rateLimit.allowed) {
        this.error = true;
        this.errorMessage = lang === 'fr'
          ? `Limite atteinte. Réessayez dans ${rateLimit.message.match(/\d+/)?.[0]} minute(s).`
          : rateLimit.message;
        this.loading = false;
        return;
      }

      // Input sanitization
      const sanitizedName = sanitizeInput(this.formData.name);
      const sanitizedEmail = sanitizeInput(this.formData.email);
      const sanitizedCompany = sanitizeInput(this.formData.company);
      const sanitizedPain = this.formData.pain.trim().slice(0, 2000);

      // Email validation
      if (!isValidEmail(sanitizedEmail)) {
        this.error = true;
        this.errorMessage = lang === 'fr'
          ? 'Veuillez saisir une adresse email valide.'
          : 'Please enter a valid email address.';
        this.loading = false;
        return;
      }

      // Name length validation
      if (sanitizedName.length < 2 || sanitizedName.length > 100) {
        this.error = true;
        this.errorMessage = lang === 'fr'
          ? 'Le nom doit contenir entre 2 et 100 caractères.'
          : 'Name must be between 2 and 100 characters.';
        this.loading = false;
        return;
      }

      // Prepare data for submission
      const submissionData = {
        timestamp: new Date().toISOString(),
        formType: 'get-started',
        goal: this.formData.goal,
        companySize: this.formData.companySize,
        industry: this.formData.industry,
        pain: sanitizedPain,
        budget: this.formData.budget,
        timeline: this.formData.timeline,
        name: sanitizedName,
        email: sanitizedEmail,
        company: sanitizedCompany || 'Non spécifié',
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
      await fetch(WEBHOOK_URL, {
        method: 'POST',
        mode: 'no-cors',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(submissionData)
      });

      // Success
      this.success = true;
      this.loading = false;

      // Track conversion in analytics
      if (typeof window.plausible !== 'undefined') {
        window.plausible('Get Started Lead', {
          props: {
            goal: this.formData.goal,
            companySize: this.formData.companySize,
            budget: this.formData.budget,
            lang
          }
        });
      }

    } catch (err) {
      console.error('Multi-step form submission error:', err);
      this.error = true;
      this.errorMessage = window.location.pathname.startsWith('/en')
        ? 'An error occurred. Please try again.'
        : 'Une erreur s\'est produite. Veuillez réessayer.';
      this.loading = false;
    }
  }
}));

// Register Alpine.js Contact Form component
Alpine.data('contactForm', () => ({
  formData: {
    name: '',
    email: '',
    company: '',
    message: ''
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

      // Rate limiting check
      const rateLimit = checkRateLimit('vecia-contact-submissions');
      if (!rateLimit.allowed) {
        this.error = true;
        this.errorMessage = lang === 'fr'
          ? `Limite atteinte. Réessayez dans ${rateLimit.message.match(/\d+/)?.[0]} minute(s).`
          : rateLimit.message;
        this.loading = false;
        return;
      }

      // Input sanitization
      const sanitizedName = sanitizeInput(this.formData.name);
      const sanitizedEmail = sanitizeInput(this.formData.email);
      const sanitizedCompany = sanitizeInput(this.formData.company);
      const sanitizedMessage = this.formData.message.trim().slice(0, 5000); // Allow longer messages

      // Email validation
      if (!isValidEmail(sanitizedEmail)) {
        this.error = true;
        this.errorMessage = lang === 'fr'
          ? 'Veuillez saisir une adresse email valide.'
          : 'Please enter a valid email address.';
        this.loading = false;
        return;
      }

      // Name length validation
      if (sanitizedName.length < 2 || sanitizedName.length > 100) {
        this.error = true;
        this.errorMessage = lang === 'fr'
          ? 'Le nom doit contenir entre 2 et 100 caractères.'
          : 'Name must be between 2 and 100 characters.';
        this.loading = false;
        return;
      }

      // Message length validation
      if (sanitizedMessage.length < 10) {
        this.error = true;
        this.errorMessage = lang === 'fr'
          ? 'Le message doit contenir au moins 10 caractères.'
          : 'Message must be at least 10 characters.';
        this.loading = false;
        return;
      }

      // Prepare data for submission
      const submissionData = {
        timestamp: new Date().toISOString(),
        formType: 'contact',
        name: sanitizedName,
        email: sanitizedEmail,
        company: sanitizedCompany || 'Non spécifié',
        message: sanitizedMessage,
        language: lang,
        source: document.referrer || 'Direct',
        page_url: window.location.href
      };

      // Google Apps Script webhook URL
      const WEBHOOK_URL = 'https://script.google.com/macros/s/AKfycby_23XSfxU0NBNgfbufOqhDa6ywjs34tjXp1-kEYLtNMauZiA2B64kzXUAKFKeRqB-VXA/exec';

      // Submit to webhook
      await fetch(WEBHOOK_URL, {
        method: 'POST',
        mode: 'no-cors',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(submissionData)
      });

      // Success (with no-cors, assume success if no error)
      this.success = true;
      this.loading = false;

      // Reset form after 3 seconds
      setTimeout(() => {
        this.formData = {
          name: '',
          email: '',
          company: '',
          message: ''
        };
      }, 3000);

      // Track conversion in analytics
      if (typeof window.plausible !== 'undefined') {
        window.plausible('Contact Form', { props: { lang } });
      }

    } catch (err) {
      console.error('Contact form submission error:', err);
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

// Note: Dynamic pricing system is initialized in pricing.ts
// It handles:
// - localStorage-first currency detection
// - IP geolocation API with retry logic
// - Browser language fallback
// - Manual currency switcher

// Export for potential external access (optional)
export { Alpine, detectCurrency, updatePriceElements };
