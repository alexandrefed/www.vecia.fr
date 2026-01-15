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

// =============================================================================
// AI TABS COMPONENT
// =============================================================================
// Moved from inline x-data due to Astro 5.16.x multi-line attribute bug

Alpine.data('aiTabs', () => ({
  activeTab: 0,
  totalTabs: 4,
  interval: null as ReturnType<typeof setTimeout> | null,
  progress: 0,
  progressInterval: null as ReturnType<typeof setInterval> | null,
  isPaused: false,
  isInView: false,

  startAutoRotate() {
    this.isPaused = false;
    // Clear existing intervals
    if (this.interval) clearTimeout(this.interval);
    if (this.progressInterval) clearInterval(this.progressInterval);

    // Calculate remaining time based on current progress
    const remainingProgress = 100 - this.progress;
    const remainingTime = (remainingProgress / 100) * 15000;

    // Progress bar animation (continue from current progress)
    this.progressInterval = setInterval(() => {
      this.progress += 100 / (15000 / 50); // Update every 50ms
      if (this.progress >= 100) {
        this.progress = 100;
      }
    }, 50);

    // Tab rotation after remaining time
    this.interval = setTimeout(() => {
      this.activeTab = (this.activeTab + 1) % this.totalTabs;
      this.progress = 0; // Reset progress when tab changes
      this.startAutoRotate(); // Restart with full cycle
    }, remainingTime);
  },

  stopAutoRotate() {
    this.isPaused = true;
    if (this.interval) clearTimeout(this.interval);
    if (this.progressInterval) clearInterval(this.progressInterval);
  },

  selectTab(index: number) {
    this.activeTab = index;
    this.progress = 0;
    this.stopAutoRotate();
    this.startAutoRotate();
  },

  nextTab() {
    this.activeTab = (this.activeTab + 1) % this.totalTabs;
    this.progress = 0;
    this.stopAutoRotate();
    this.startAutoRotate();
  },

  prevTab() {
    this.activeTab = (this.activeTab - 1 + this.totalTabs) % this.totalTabs;
    this.progress = 0;
    this.stopAutoRotate();
    this.startAutoRotate();
  }
}));

// =============================================================================
// PRODUCTS CAROUSEL COMPONENT
// =============================================================================
// Moved from inline x-data due to Astro 5.16.x multi-line attribute bug

Alpine.data('productsCarousel', () => ({
  currentIndex: 0,
  totalProducts: 8,
  isAnimating: false,
  touchStartX: 0,
  touchEndX: 0,
  isPaused: false,
  autoRotateInterval: null as ReturnType<typeof setInterval> | null,

  init() {
    // Start auto-rotation (every 4 seconds)
    this.startAutoRotate();

    // Keyboard navigation
    (this.$el as HTMLElement).addEventListener('keydown', (e: KeyboardEvent) => {
      if (e.key === 'ArrowLeft') {
        e.preventDefault();
        this.prev();
      } else if (e.key === 'ArrowRight') {
        e.preventDefault();
        this.next();
      }
    });

    // Touch events for mobile swipe + hold-to-pause
    (this.$el as HTMLElement).addEventListener('touchstart', (e: TouchEvent) => {
      this.touchStartX = e.changedTouches[0].screenX;
      this.isPaused = true; // Pause on touch
      this.stopAutoRotate();
    });

    (this.$el as HTMLElement).addEventListener('touchend', (e: TouchEvent) => {
      this.touchEndX = e.changedTouches[0].screenX;
      this.handleSwipe();
      this.isPaused = false; // Resume on release
      this.startAutoRotate();
    });

    // Pause on mouse hover (desktop)
    (this.$el as HTMLElement).addEventListener('mouseenter', () => {
      this.isPaused = true;
      this.stopAutoRotate();
    });

    (this.$el as HTMLElement).addEventListener('mouseleave', () => {
      this.isPaused = false;
      this.startAutoRotate();
    });
  },

  startAutoRotate() {
    if (this.autoRotateInterval) return; // Already running
    this.autoRotateInterval = setInterval(() => {
      if (!this.isPaused && !this.isAnimating) {
        this.next();
      }
    }, 4000);
  },

  stopAutoRotate() {
    if (this.autoRotateInterval) {
      clearInterval(this.autoRotateInterval);
      this.autoRotateInterval = null;
    }
  },

  getPosition(index: number): string {
    const diff = index - this.currentIndex;
    const total = this.totalProducts;

    // Normalize difference to handle circular array
    let normalizedDiff = diff;
    if (Math.abs(diff) > total / 2) {
      normalizedDiff = diff > 0 ? diff - total : diff + total;
    }

    if (normalizedDiff === 0) return 'center';
    if (normalizedDiff === -1) return 'left-near';
    if (normalizedDiff === 1) return 'right-near';
    if (normalizedDiff === -2) return 'left-far';
    if (normalizedDiff === 2) return 'right-far';
    return 'hidden';
  },

  prev() {
    if (this.isAnimating) return;
    this.isAnimating = true;
    this.currentIndex = (this.currentIndex - 1 + this.totalProducts) % this.totalProducts;
    setTimeout(() => { this.isAnimating = false; }, 500);
  },

  next() {
    if (this.isAnimating) return;
    this.isAnimating = true;
    this.currentIndex = (this.currentIndex + 1) % this.totalProducts;
    setTimeout(() => { this.isAnimating = false; }, 500);
  },

  goTo(index: number) {
    if (this.isAnimating || index === this.currentIndex) return;
    this.isAnimating = true;
    this.currentIndex = index;
    setTimeout(() => { this.isAnimating = false; }, 500);
  },

  handleSwipe() {
    const swipeThreshold = 50;
    const diff = this.touchStartX - this.touchEndX;

    if (Math.abs(diff) > swipeThreshold) {
      if (diff > 0) {
        this.next();
      } else {
        this.prev();
      }
    }
  }
}));

// =============================================================================
// NEWSLETTER POPUP COMPONENT
// =============================================================================
// Moved from inline x-data due to Astro 5.16.x multi-line attribute bug

Alpine.data('newsletterPopup', () => ({
  show: false,
  dismissed: false,
  email: '',
  submitted: false,
  webhookUrl: (window as any).__VECIA_NEWSLETTER_WEBHOOK__ || 'https://srvdev2025.taildb74a2.ts.net/webhook/vecia-newsletter',

  init() {
    // Check if user dismissed before
    const dismissed = localStorage.getItem('newsletter-dismissed');
    const dismissedTime = localStorage.getItem('newsletter-dismissed-time');

    if (dismissed && dismissedTime) {
      const daysSinceDismissed = (Date.now() - parseInt(dismissedTime)) / (1000 * 60 * 60 * 24);
      if (daysSinceDismissed < 30) {
        this.dismissed = true;
        return;
      }
    }

    // Show after 30 seconds
    setTimeout(() => {
      if (!this.dismissed) {
        this.show = true;
        // Track popup shown event
        if (typeof window.gtag !== 'undefined') {
          window.gtag('event', 'newsletter_popup_shown', {
            event_category: 'engagement',
            event_label: 'auto_trigger'
          });
        }
      }
    }, 30000);

    // Show on exit intent (desktop only)
    if (window.innerWidth > 768) {
      document.addEventListener('mouseleave', (e: MouseEvent) => {
        if (e.clientY < 10 && !this.dismissed && !this.show) {
          this.show = true;
          // Track exit intent trigger
          if (typeof window.gtag !== 'undefined') {
            window.gtag('event', 'newsletter_popup_shown', {
              event_category: 'engagement',
              event_label: 'exit_intent'
            });
          }
        }
      });
    }
  },

  close() {
    this.show = false;
    localStorage.setItem('newsletter-dismissed', 'true');
    localStorage.setItem('newsletter-dismissed-time', Date.now().toString());
    this.dismissed = true;

    // Track dismissal
    if (typeof window.gtag !== 'undefined') {
      window.gtag('event', 'newsletter_popup_dismissed', {
        event_category: 'engagement',
        event_label: 'user_close'
      });
    }
  },

  async handleSubmit() {
    if (!this.email) return;

    // Email validation (RFC 5322 simplified)
    const emailRegex = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;
    if (!emailRegex.test(this.email) || this.email.length > 255) {
      alert('Veuillez saisir une adresse email valide.');
      return;
    }

    // Rate limiting (max 3 submissions per hour)
    const now = Date.now();
    const hourAgo = now - (60 * 60 * 1000);
    const historyJson = localStorage.getItem('vecia-newsletter-submissions');
    let history: number[] = historyJson ? JSON.parse(historyJson) : [];

    history = history.filter(timestamp => timestamp > hourAgo);

    if (history.length >= 3) {
      const oldestSubmission = Math.min.apply(null, history);
      const minutesUntilReset = Math.ceil((oldestSubmission + (60 * 60 * 1000) - now) / (60 * 1000));
      alert('Limite atteinte. Réessayez dans ' + minutesUntilReset + ' minute(s).');
      return;
    }

    history.push(now);
    localStorage.setItem('vecia-newsletter-submissions', JSON.stringify(history));

    // Input sanitization
    const sanitizedEmail = this.email.trim().slice(0, 255);

    // Generate unique event ID for Meta CAPI deduplication
    const eventId = 'vecia_' + Date.now() + '_' + Math.random().toString(36).substring(2, 11);

    // Track newsletter signup attempt in GA4
    if (typeof window.gtag !== 'undefined') {
      window.gtag('event', 'newsletter_signup_attempt', {
        event_category: 'conversion',
        event_label: 'popup_modal',
        value: 1
      });
    }

    // Prepare data for n8n/Odoo
    const submissionData = {
      timestamp: new Date().toISOString(),
      event_id: eventId,
      formType: 'newsletter',
      email: sanitizedEmail,
      language: window.location.pathname.startsWith('/en') ? 'en' : 'fr',
      source: document.referrer || 'Direct',
      trigger: 'popup_modal',
      utm_campaign: new URLSearchParams(window.location.search).get('utm_campaign') || '',
      utm_source: new URLSearchParams(window.location.search).get('utm_source') || '',
      utm_medium: new URLSearchParams(window.location.search).get('utm_medium') || '',
      page_url: window.location.href,
      page_title: document.title,
    };

    // Send to n8n webhook (connects to Odoo Email Marketing)
    try {
      const response = await fetch(this.webhookUrl, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(submissionData)
      });

      if (!response.ok) {
        console.warn('[Newsletter] Webhook failed:', response.status);
      } else {
        console.log('[Newsletter] Successfully sent to n8n/Odoo');
      }
    } catch (error) {
      console.warn('[Newsletter] Webhook error:', error);
      // Continue to show success (don't block user experience for webhook failure)
    }

    // Track conversion in Meta Pixel with event_id for CAPI deduplication
    if (typeof window.fbq !== 'undefined') {
      window.fbq('track', 'Lead', {
        content_name: 'Newsletter Signup',
        content_category: 'Newsletter',
        event_id: eventId,
      });
      console.log('[Meta Pixel] Newsletter Lead tracked with event_id:', eventId);
    }

    // Track conversion in LinkedIn
    if (typeof window.lintrk !== 'undefined') {
      window.lintrk('track', { conversion_id: 'newsletter_signup' });
      console.log('[LinkedIn] Newsletter conversion tracked');
    }

    // Show success state
    this.submitted = true;

    // Close after 2 seconds
    setTimeout(() => {
      this.close();
    }, 2000);
  }
}));

// =============================================================================
// BUSINESS CASES COMPONENT
// =============================================================================
// Moved from inline x-data due to Astro 5.16.x multi-line attribute bug

Alpine.data('businessCases', () => ({
  activeTab: 0,
  enteringSlide: null as number | null,
  touchStartX: 0,
  touchEndX: 0,

  selectTab(index: number) {
    this.activeTab = index;

    // Mobile: scroll horizontal container
    if (window.innerWidth <= 768) {
      const container = (this.$refs as Record<string, HTMLElement>).mobileContainer;
      if (container) {
        const cardWidth = container.offsetWidth;
        container.scrollTo({
          left: cardWidth * index,
          behavior: 'smooth'
        });
      }
    } else {
      // Desktop: scroll to sticky panel
      const targetPanel = (this.$refs as Record<string, HTMLElement>)['panel' + index];
      if (targetPanel) {
        targetPanel.scrollIntoView({
          behavior: 'smooth',
          block: 'center'
        });
      }
    }
  },

  setEntering(index: number) {
    this.enteringSlide = index;
  },

  setActive(index: number) {
    this.activeTab = index;
    this.enteringSlide = null;
  },

  setExiting(index: number) {
    if (this.activeTab === index) {
      this.enteringSlide = null;
    }
  },

  handleMobileScroll() {
    if (window.innerWidth <= 768) {
      const container = (this.$refs as Record<string, HTMLElement>).mobileContainer;
      if (container) {
        const cardWidth = container.offsetWidth;
        const scrollLeft = container.scrollLeft;
        const newIndex = Math.round(scrollLeft / cardWidth);
        this.activeTab = newIndex;
      }
    }
  }
}));

// =============================================================================
// IMPACT COUNTERS COMPONENT (BentoGrid)
// =============================================================================
// Moved from inline x-data due to Astro 5.16.x multi-line attribute bug

Alpine.data('impactCounters', () => ({
  costReduction: 0,
  timeSaved: 0,
  salesGrowth: 0,
  hasAnimated: false,

  init() {
    // Use IntersectionObserver to trigger animation when visible
    new IntersectionObserver((entries) => {
      if (entries[0].isIntersecting) {
        this.animateCounters();
      }
    }, { threshold: 0.5 }).observe(this.$el as HTMLElement);
  },

  animateCounters() {
    if (this.hasAnimated) return;
    this.hasAnimated = true;

    // Animate cost reduction to 30
    const costInterval = setInterval(() => {
      if (this.costReduction >= 30) {
        this.costReduction = 30;
        clearInterval(costInterval);
      } else {
        this.costReduction += 2;
      }
    }, 50);

    // Animate time saved to 15
    const timeInterval = setInterval(() => {
      if (this.timeSaved >= 15) {
        this.timeSaved = 15;
        clearInterval(timeInterval);
      } else {
        this.timeSaved += 1;
      }
    }, 100);

    // Animate sales growth to 35
    const salesInterval = setInterval(() => {
      if (this.salesGrowth >= 35) {
        this.salesGrowth = 35;
        clearInterval(salesInterval);
      } else {
        this.salesGrowth += 2;
      }
    }, 50);
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
