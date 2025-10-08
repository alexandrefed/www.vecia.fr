/**
 * Dynamic Currency Pricing - 2025 Best Practices
 *
 * Privacy-First Approach:
 * 1. localStorage (user preference) - FIRST
 * 2. IP Geolocation API (ipapi.co) - FALLBACK
 * 3. Browser language detection - SECOND FALLBACK
 * 4. Default currency (EUR) - FINAL FALLBACK
 *
 * GDPR Compliance:
 * - IP detection used only for UX (not tracking)
 * - User has full control (manual switcher)
 * - No data sent to third parties
 * - Transparent implementation
 */

import { pricing, currencyConfig, type CurrencyCode, formatCurrency, getCurrencyByCountry } from '../i18n/pricing';

// Constants
const STORAGE_KEY = 'vecia_currency';
const API_TIMEOUT = 5000; // 5 seconds
const MAX_RETRIES = 3;
const RETRY_DELAY = 1000; // 1 second

/**
 * Detect currency using privacy-first fallback chain
 * @returns Promise<CurrencyCode>
 */
async function detectCurrency(): Promise<CurrencyCode> {
  try {
    // STEP 1: Check localStorage (user preference)
    const savedCurrency = localStorage.getItem(STORAGE_KEY);
    if (savedCurrency && isValidCurrency(savedCurrency)) {
      console.log('[Pricing] Using saved currency preference:', savedCurrency);
      return savedCurrency as CurrencyCode;
    }

    // STEP 2: Try IP Geolocation with retry logic
    const ipCurrency = await detectByIP();
    if (ipCurrency) {
      console.log('[Pricing] Currency detected by IP:', ipCurrency);
      // Cache the result
      localStorage.setItem(STORAGE_KEY, ipCurrency);
      return ipCurrency;
    }

    // STEP 3: Fallback to browser language
    const langCurrency = detectByLanguage();
    if (langCurrency) {
      console.log('[Pricing] Currency detected by browser language:', langCurrency);
      localStorage.setItem(STORAGE_KEY, langCurrency);
      return langCurrency;
    }

    // STEP 4: Default fallback
    console.log('[Pricing] Using default currency: EUR');
    return 'EUR';

  } catch (error) {
    console.error('[Pricing] Error detecting currency:', error);
    return 'EUR'; // Safe default
  }
}

/**
 * Detect currency by IP geolocation (with retry + timeout)
 * @returns Promise<CurrencyCode | null>
 */
async function detectByIP(): Promise<CurrencyCode | null> {
  let lastError: Error | null = null;

  for (let attempt = 1; attempt <= MAX_RETRIES; attempt++) {
    try {
      console.log(`[Pricing] IP detection attempt ${attempt}/${MAX_RETRIES}`);

      // Create AbortController for timeout (2025 pattern)
      const controller = new AbortController();
      const timeoutId = setTimeout(() => controller.abort(), API_TIMEOUT);

      try {
        const response = await fetch('https://ipapi.co/json/', {
          signal: controller.signal,
          headers: {
            'Accept': 'application/json',
          },
        });

        clearTimeout(timeoutId);

        if (!response.ok) {
          throw new Error(`API responded with status: ${response.status}`);
        }

        const data = await response.json();

        // Check for API error
        if (data.error) {
          throw new Error(`API error: ${data.reason || 'Unknown error'}`);
        }

        const countryCode = data.country_code;

        if (countryCode) {
          const currency = getCurrencyByCountry(countryCode);
          return currency;
        }

        throw new Error('No country code in response');

      } catch (fetchError) {
        clearTimeout(timeoutId);
        throw fetchError;
      }

    } catch (error) {
      lastError = error as Error;

      // Check if it's a timeout
      if (error instanceof Error && error.name === 'AbortError') {
        console.warn(`[Pricing] Attempt ${attempt} timed out`);
      } else {
        console.warn(`[Pricing] Attempt ${attempt} failed:`, error);
      }

      // Wait before retry (exponential backoff)
      if (attempt < MAX_RETRIES) {
        const delay = RETRY_DELAY * Math.pow(2, attempt - 1);
        console.log(`[Pricing] Retrying in ${delay}ms...`);
        await sleep(delay);
      }
    }
  }

  console.error('[Pricing] All IP detection attempts failed:', lastError);
  return null;
}

/**
 * Detect currency by browser language
 * @returns CurrencyCode | null
 */
function detectByLanguage(): CurrencyCode | null {
  try {
    const lang = navigator.language || navigator.languages?.[0];

    if (!lang) return null;

    // Language to country mapping
    const langMap: Record<string, string> = {
      'fr': 'FR',
      'fr-FR': 'FR',
      'fr-BE': 'BE',
      'fr-CH': 'CH',
      'de': 'DE',
      'de-DE': 'DE',
      'de-CH': 'CH',
      'it': 'IT',
      'it-CH': 'CH',
      'ar-AE': 'AE',
      'en-GB': 'GB',
      'en-US': 'US',
    };

    // Try exact match first
    if (langMap[lang]) {
      return getCurrencyByCountry(langMap[lang]);
    }

    // Try language prefix (e.g., 'fr' from 'fr-CA')
    const langPrefix = lang.split('-')[0];
    if (langMap[langPrefix]) {
      return getCurrencyByCountry(langMap[langPrefix]);
    }

    // Try region suffix (e.g., 'CH' from 'de-CH')
    const region = lang.split('-')[1];
    if (region) {
      return getCurrencyByCountry(region);
    }

    return null;
  } catch (error) {
    console.error('[Pricing] Error detecting language:', error);
    return null;
  }
}

/**
 * Update all price elements in the DOM
 * @param currency CurrencyCode
 */
function updatePriceElements(currency: CurrencyCode): void {
  try {
    console.log('[Pricing] Updating prices to:', currency);

    const priceMap: Record<string, keyof typeof pricing[CurrencyCode]> = {
      'workshopPrice': 'workshop',
      'tier1Price': 'tier1',
      'tier2Price': 'tier2',
      'tier3Price': 'tier3',
    };

    // Update each price element
    Object.entries(priceMap).forEach(([elementId, priceKey]) => {
      const element = document.getElementById(elementId);
      if (element) {
        const amount = pricing[currency][priceKey];
        element.textContent = formatCurrency(amount, currency);
      }
    });

    // Update body data attribute (for CSS styling if needed)
    document.body.setAttribute('data-currency', currency);

    console.log('[Pricing] Prices updated successfully');
  } catch (error) {
    console.error('[Pricing] Error updating price elements:', error);
  }
}

/**
 * Initialize currency switcher if present
 */
function initCurrencySwitcher(): void {
  const switcher = document.getElementById('currency-switcher') as HTMLSelectElement;

  if (!switcher) return;

  // Set current currency in dropdown
  const currentCurrency = localStorage.getItem(STORAGE_KEY) || 'EUR';
  switcher.value = currentCurrency;

  // Handle manual currency change
  switcher.addEventListener('change', (e) => {
    const newCurrency = (e.target as HTMLSelectElement).value as CurrencyCode;

    if (isValidCurrency(newCurrency)) {
      console.log('[Pricing] User changed currency to:', newCurrency);
      localStorage.setItem(STORAGE_KEY, newCurrency);
      updatePriceElements(newCurrency);
    }
  });
}

/**
 * Validate currency code
 * @param code string
 * @returns boolean
 */
function isValidCurrency(code: string): boolean {
  return ['EUR', 'CHF', 'AED', 'USD'].includes(code);
}

/**
 * Sleep utility for retry delays
 * @param ms number
 * @returns Promise<void>
 */
function sleep(ms: number): Promise<void> {
  return new Promise(resolve => setTimeout(resolve, ms));
}

/**
 * Initialize pricing system
 */
async function initPricing(): Promise<void> {
  try {
    console.log('[Pricing] Initializing...');

    // Detect and set currency
    const currency = await detectCurrency();
    updatePriceElements(currency);

    // Initialize manual switcher
    initCurrencySwitcher();

    console.log('[Pricing] Initialization complete');
  } catch (error) {
    console.error('[Pricing] Initialization failed:', error);
    // Fallback to EUR and update display
    updatePriceElements('EUR');
  }
}

// Run when DOM is ready
if (document.readyState === 'loading') {
  document.addEventListener('DOMContentLoaded', initPricing);
} else {
  initPricing();
}

// Export for manual control if needed
export { detectCurrency, updatePriceElements };
