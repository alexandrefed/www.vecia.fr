/**
 * Client-side entry point for Vecia website
 *
 * This file bundles all client-side JavaScript including:
 * - Alpine.js initialization and plugins
 * - Dynamic pricing system
 * - Alpine.js components (lead capture form, etc.)
 * - Deployment error handling (asset hash changes)
 * - n8n webhook integration for Odoo CRM
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

// =============================================================================
// WEBHOOK CONFIGURATION
// =============================================================================

// n8n webhook URL (connects to Odoo CRM)
// Can be overridden via window.__VECIA_CONFIG__ for SSR hydration
const N8N_LEAD_WEBHOOK = (window as any).__VECIA_CONFIG__?.n8nLeadWebhook
  || 'https://srvdev2025.taildb74a2.ts.net/webhook/vecia-lead';

// Legacy Google Sheets webhook (fallback)
const GOOGLE_SHEETS_WEBHOOK = 'https://script.google.com/macros/s/AKfycby_23XSfxU0NBNgfbufOqhDa6ywjs34tjXp1-kEYLtNMauZiA2B64kzXUAKFKeRqB-VXA/exec';

// Generate unique event ID for Meta CAPI deduplication
const generateEventId = (): string => {
  return `vecia_${Date.now()}_${Math.random().toString(36).substring(2, 11)}`;
};

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

    // Get language from current page (defined outside try for catch block access)
    const lang = window.location.pathname.startsWith('/en') ? 'en' : 'fr';

    try {
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

      // Generate unique event ID for Meta CAPI deduplication
      const eventId = generateEventId();

      // Prepare data for submission (using sanitized inputs)
      const submissionData = {
        timestamp: new Date().toISOString(),
        event_id: eventId, // For Meta CAPI deduplication
        formType: 'lead-capture',
        name: sanitizedName, // 🔒 Sanitized
        email: sanitizedEmail, // 🔒 Sanitized
        companySize: this.formData.companySize,
        language: lang,
        source: document.referrer || 'Direct',
        utm_campaign: new URLSearchParams(window.location.search).get('utm_campaign') || '',
        utm_source: new URLSearchParams(window.location.search).get('utm_source') || '',
        utm_medium: new URLSearchParams(window.location.search).get('utm_medium') || '',
        utm_content: new URLSearchParams(window.location.search).get('utm_content') || '',
        utm_term: new URLSearchParams(window.location.search).get('utm_term') || '',
        page_url: window.location.href,
        page_title: document.title,
        user_agent: navigator.userAgent,
      };

      // Submit to n8n webhook (primary - connects to Odoo CRM)
      try {
        const n8nResponse = await fetch(N8N_LEAD_WEBHOOK, {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify(submissionData)
        });

        if (!n8nResponse.ok) {
          console.warn('[Lead Form] n8n webhook failed, falling back to Google Sheets');
          throw new Error('n8n webhook failed');
        }

        console.log('[Lead Form] Successfully sent to n8n/Odoo');
      } catch (n8nError) {
        // Fallback to Google Sheets if n8n fails
        console.warn('[Lead Form] Falling back to Google Sheets:', n8nError);
        await fetch(GOOGLE_SHEETS_WEBHOOK, {
          method: 'POST',
          mode: 'no-cors',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify(submissionData)
        });
      }

      this.success = true;
      this.loading = false;

      // Track conversion in Meta Pixel with event_id for CAPI deduplication
      if (typeof window.fbq !== 'undefined') {
        window.fbq('track', 'Lead', {
          content_name: 'Lead Capture Form',
          content_category: 'Lead Generation',
          event_id: eventId, // Same ID sent to server for deduplication
        });
        console.log('[Meta Pixel] Lead tracked with event_id:', eventId);
      }

      // Track conversion in LinkedIn
      if (typeof window.lintrk !== 'undefined') {
        window.lintrk('track', { conversion_id: 'lead_generated' });
        console.log('[LinkedIn] Lead conversion tracked');
      }

      // Reset form after 2 seconds
      setTimeout(() => {
        this.formData = {
          name: '',
          email: '',
          companySize: ''
        };
      }, 2000);

      // Optional: Track conversion in Plausible
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

      // Generate unique event ID for Meta CAPI deduplication
      const eventId = generateEventId();

      // Prepare data for submission
      const submissionData = {
        timestamp: new Date().toISOString(),
        event_id: eventId, // For Meta CAPI deduplication
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
        utm_content: new URLSearchParams(window.location.search).get('utm_content') || '',
        utm_term: new URLSearchParams(window.location.search).get('utm_term') || '',
        page_url: window.location.href,
        page_title: document.title,
        user_agent: navigator.userAgent,
      };

      // Submit to n8n webhook (primary - connects to Odoo CRM)
      try {
        const n8nResponse = await fetch(N8N_LEAD_WEBHOOK, {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify(submissionData)
        });

        if (!n8nResponse.ok) {
          console.warn('[Get Started Form] n8n webhook failed, falling back to Google Sheets');
          throw new Error('n8n webhook failed');
        }

        console.log('[Get Started Form] Successfully sent to n8n/Odoo');
      } catch (n8nError) {
        // Fallback to Google Sheets if n8n fails
        console.warn('[Get Started Form] Falling back to Google Sheets:', n8nError);
        await fetch(GOOGLE_SHEETS_WEBHOOK, {
          method: 'POST',
          mode: 'no-cors',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify(submissionData)
        });
      }

      // Success
      this.success = true;
      this.loading = false;

      // Track conversion in Meta Pixel with event_id for CAPI deduplication
      if (typeof window.fbq !== 'undefined') {
        window.fbq('track', 'Lead', {
          content_name: 'Get Started Form',
          content_category: 'Lead Generation',
          value: submissionData.budget === '20k+' ? 20000 : submissionData.budget === '10k-20k' ? 15000 : 5000,
          currency: 'EUR',
          event_id: eventId,
        });
        console.log('[Meta Pixel] Lead tracked with event_id:', eventId);
      }

      // Track conversion in LinkedIn
      if (typeof window.lintrk !== 'undefined') {
        window.lintrk('track', { conversion_id: 'lead_generated' });
        console.log('[LinkedIn] Lead conversion tracked');
      }

      // Track conversion in Plausible
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

// =============================================================================
// BILAN IA FORM (vecia-audit-ia integration)
// =============================================================================

// vecia-audit-ia API URL (port 9421 local, Tailscale Funnel prod)
const BILAN_API_URL = (window as any).__VECIA_CONFIG__?.bilanApiUrl
  || (window.location.hostname === 'localhost'
    ? 'http://localhost:9421/form/submit'
    : 'https://srvdev2025.taildb74a2.ts.net:8443/form/submit');

// Register Alpine.js Bilan Form component (single-page form)
console.log('[Alpine] Registering bilanForm component');
Alpine.data('bilanForm', () => ({
  init() {
    console.log('[bilanForm] init() called - component is working!');
    console.log('[bilanForm] formData:', this.formData);
  },
  formData: {
    first_name: '',
    last_name: '',
    email: '',
    company_name: '',
    website: '',
    role: '',
    activity_description: '',
    sector: '',
    company_size: '',
    ai_maturity: 1,
    tools: '',
    tools_occasional: '',
    repetitive_process: '',
    ai_objectives: '',
    priority_decisionnel: 0,   // 0-5 rating
    priority_operationnel: 0,  // 0-5 rating
    priority_commercial: 0,    // 0-5 rating
    gdpr_consent: false
  },
  loading: false,
  success: false,
  error: false,
  errorMessage: '',

  async submitForm() {
    this.loading = true;
    this.error = false;
    this.errorMessage = '';

    const lang = window.location.pathname.startsWith('/en') ? 'en' : 'fr';

    try {
      // Rate limiting check
      const rateLimit = checkRateLimit('vecia-audit-submissions');
      if (!rateLimit.allowed) {
        this.error = true;
        this.errorMessage = lang === 'fr'
          ? `Limite atteinte. Réessayez dans ${rateLimit.message.match(/\d+/)?.[0]} minute(s).`
          : rateLimit.message;
        this.loading = false;
        return;
      }

      // Input sanitization - concatenate first + last name
      const sanitizedFirstName = sanitizeInput(this.formData.first_name);
      const sanitizedLastName = sanitizeInput(this.formData.last_name);
      const sanitizedName = `${sanitizedFirstName} ${sanitizedLastName}`.trim();
      const sanitizedEmail = sanitizeInput(this.formData.email);

      // Email validation
      if (!isValidEmail(sanitizedEmail)) {
        this.error = true;
        this.errorMessage = lang === 'fr'
          ? 'Veuillez saisir une adresse email valide.'
          : 'Please enter a valid email address.';
        this.loading = false;
        return;
      }

      // Ensure website has protocol (or empty string if empty - backend will handle)
      let website = this.formData.website.trim();
      if (website && !website.startsWith('http://') && !website.startsWith('https://')) {
        website = 'https://' + website;
      }

      // Prepare data for vecia-audit-ia API
      const submissionData = {
        contact_name: sanitizedName,
        email: sanitizedEmail,
        company_name: sanitizeInput(this.formData.company_name),
        website: website,
        role: this.formData.role ? sanitizeInput(this.formData.role) : null,
        activity_description: this.formData.activity_description ? this.formData.activity_description.trim().slice(0, 2000) : null,
        sector: this.formData.sector || null,
        company_size: this.formData.company_size || null,
        ai_maturity: this.formData.ai_maturity,
        tools: this.formData.tools ? this.formData.tools.trim().slice(0, 500) : null,
        tools_occasional: this.formData.tools_occasional ? this.formData.tools_occasional.trim().slice(0, 500) : null,
        repetitive_process: this.formData.repetitive_process ? this.formData.repetitive_process.trim().slice(0, 2000) : null,
        ai_objectives: this.formData.ai_objectives ? this.formData.ai_objectives.trim().slice(0, 2000) : null,
        ai_priority: (() => {
          const priorities = [
            this.formData.priority_decisionnel > 0 ? `decisionnel:${this.formData.priority_decisionnel}` : null,
            this.formData.priority_operationnel > 0 ? `operationnel:${this.formData.priority_operationnel}` : null,
            this.formData.priority_commercial > 0 ? `commercial:${this.formData.priority_commercial}` : null,
          ].filter(Boolean) as string[];
          return priorities.length > 0 ? priorities : null;
        })(),
      };

      console.log('[Bilan Form] Submitting to vecia-audit-ia:', submissionData);

      // Submit to vecia-audit-ia API
      const response = await fetch(BILAN_API_URL, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(submissionData)
      });

      const result = await response.json();

      if (!response.ok || !result.success) {
        throw new Error(result.message || 'API error');
      }

      console.log('[Bilan Form] Success! Lead ID:', result.lead_id);

      // Success
      this.success = true;
      this.loading = false;

      // Generate event ID for tracking
      const eventId = generateEventId();

      // Track conversion in Meta Pixel
      if (typeof window.fbq !== 'undefined') {
        window.fbq('track', 'Lead', {
          content_name: 'AI Bilan Form',
          content_category: 'Lead Generation',
          event_id: eventId,
        });
        console.log('[Meta Pixel] Bilan lead tracked');
      }

      // Track conversion in LinkedIn
      if (typeof window.lintrk !== 'undefined') {
        window.lintrk('track', { conversion_id: 'lead_generated' });
        console.log('[LinkedIn] Bilan lead tracked');
      }

      // Track conversion in Plausible
      if (typeof window.plausible !== 'undefined') {
        window.plausible('AI Bilan Lead', {
          props: {
            sector: this.formData.sector,
            companySize: this.formData.company_size,
            aiMaturity: this.formData.ai_maturity,
            lang
          }
        });
      }

    } catch (err) {
      console.error('[Bilan Form] Submission error:', err);
      this.error = true;
      this.errorMessage = lang === 'fr'
        ? 'Une erreur s\'est produite. Veuillez réessayer.'
        : 'An error occurred. Please try again.';
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

    // Get language from current page (defined outside try for catch block access)
    const lang = window.location.pathname.startsWith('/en') ? 'en' : 'fr';

    try {
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

      // Generate unique event ID for Meta CAPI deduplication
      const eventId = generateEventId();

      // Prepare data for submission
      const submissionData = {
        timestamp: new Date().toISOString(),
        event_id: eventId, // For Meta CAPI deduplication
        formType: 'contact',
        name: sanitizedName,
        email: sanitizedEmail,
        company: sanitizedCompany || 'Non spécifié',
        message: sanitizedMessage,
        language: lang,
        source: document.referrer || 'Direct',
        utm_campaign: new URLSearchParams(window.location.search).get('utm_campaign') || '',
        utm_source: new URLSearchParams(window.location.search).get('utm_source') || '',
        utm_medium: new URLSearchParams(window.location.search).get('utm_medium') || '',
        page_url: window.location.href,
        page_title: document.title,
        user_agent: navigator.userAgent,
      };

      // Submit to n8n webhook (primary - connects to Odoo CRM)
      try {
        const n8nResponse = await fetch(N8N_LEAD_WEBHOOK, {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify(submissionData)
        });

        if (!n8nResponse.ok) {
          console.warn('[Contact Form] n8n webhook failed, falling back to Google Sheets');
          throw new Error('n8n webhook failed');
        }

        console.log('[Contact Form] Successfully sent to n8n/Odoo');
      } catch (n8nError) {
        // Fallback to Google Sheets if n8n fails
        console.warn('[Contact Form] Falling back to Google Sheets:', n8nError);
        await fetch(GOOGLE_SHEETS_WEBHOOK, {
          method: 'POST',
          mode: 'no-cors',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify(submissionData)
        });
      }

      // Success
      this.success = true;
      this.loading = false;

      // Track conversion in Meta Pixel with event_id for CAPI deduplication
      if (typeof window.fbq !== 'undefined') {
        window.fbq('track', 'Lead', {
          content_name: 'Contact Form',
          content_category: 'Lead Generation',
          event_id: eventId,
        });
        console.log('[Meta Pixel] Lead tracked with event_id:', eventId);
      }

      // Track conversion in LinkedIn
      if (typeof window.lintrk !== 'undefined') {
        window.lintrk('track', { conversion_id: 'lead_generated' });
        console.log('[LinkedIn] Lead conversion tracked');
      }

      // Reset form after 3 seconds
      setTimeout(() => {
        this.formData = {
          name: '',
          email: '',
          company: '',
          message: ''
        };
      }, 3000);

      // Track conversion in Plausible
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
console.log('[Alpine] Starting Alpine.js');
Alpine.start();
console.log('[Alpine] Alpine.js started');

// Note: Dynamic pricing system is initialized in pricing.ts
// It handles:
// - localStorage-first currency detection
// - IP geolocation API with retry logic
// - Browser language fallback
// - Manual currency switcher

// Export for potential external access (optional)
export { Alpine, detectCurrency, updatePriceElements };
