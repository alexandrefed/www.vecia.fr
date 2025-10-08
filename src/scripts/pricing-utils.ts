import { currencyConfig, pricing, formatCurrency, getCurrencyByCountry, type CurrencyCode } from '../i18n/pricing';

/**
 * Detect user's currency based on IP geolocation with fallback chain
 * Fallback order: localStorage → IP API → browser language → EUR default
 */
export async function detectCurrency(): Promise<CurrencyCode> {
  try {
    // 1. Check localStorage for saved preference
    const saved = localStorage.getItem('vecia_currency');
    if (saved && saved in currencyConfig) {
      console.log('Currency from localStorage:', saved);
      return saved as CurrencyCode;
    }

    // 2. Detect via IP geolocation (ipapi.co - 1,000 req/day free)
    const response = await fetch('https://ipapi.co/json/', {
      headers: { 'Accept': 'application/json' },
    });

    if (response.ok) {
      const data = await response.json();
      const countryCode = data.country_code;
      console.log('Country detected:', countryCode);

      const currency = getCurrencyByCountry(countryCode);

      // Save to localStorage for future visits
      localStorage.setItem('vecia_currency', currency);

      return currency;
    }

    throw new Error('IP API request failed');
  } catch (error) {
    console.error('Currency detection failed:', error);

    // 3. Fallback to browser language
    const lang = navigator.language;
    if (lang.startsWith('fr')) return 'EUR';
    if (lang.includes('CH') || lang.startsWith('de-CH') || lang.startsWith('it-CH')) return 'CHF';
    if (lang.includes('AE') || lang.startsWith('ar-AE')) return 'AED';

    // 4. Default fallback
    return 'EUR';
  }
}

/**
 * Update all price elements on the page with detected currency
 */
export function updatePriceElements(currency: CurrencyCode) {
  console.log('Updating prices to currency:', currency);

  // Workshop price (Atelier Stratégique)
  const workshopEl = document.getElementById('workshopPrice');
  if (workshopEl) {
    workshopEl.textContent = formatCurrency(pricing[currency].workshop, currency);
  }

  // Tier 1 price
  const tier1El = document.getElementById('tier1Price');
  if (tier1El) {
    tier1El.textContent = formatCurrency(pricing[currency].tier1, currency);
  }

  // Tier 2 price
  const tier2El = document.getElementById('tier2Price');
  if (tier2El) {
    tier2El.textContent = formatCurrency(pricing[currency].tier2, currency);
  }

  // Tier 3 price
  const tier3El = document.getElementById('tier3Price');
  if (tier3El) {
    tier3El.textContent = formatCurrency(pricing[currency].tier3, currency);
  }

  // Update data attribute for potential styling
  document.body.setAttribute('data-currency', currency);
}
