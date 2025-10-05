export const currencyConfig = {
  EUR: {
    symbol: '€',
    code: 'EUR',
    name: 'Euro',
    position: 'after', // €1,234
    countries: ['FR', 'DE', 'IT', 'ES', 'NL', 'BE', 'AT', 'PT', 'IE', 'FI', 'GR'],
  },
  CHF: {
    symbol: 'CHF',
    code: 'CHF',
    name: 'Swiss Franc',
    position: 'before', // CHF 1,234
    countries: ['CH'],
  },
  AED: {
    symbol: 'AED',
    code: 'AED',
    name: 'UAE Dirham',
    position: 'before', // AED 1,234
    countries: ['AE'],
  },
  USD: {
    symbol: '$',
    code: 'USD',
    name: 'US Dollar',
    position: 'before', // $1,234
    countries: ['US', 'GB', 'CA', 'AU'], // Default for English-speaking countries
  },
} as const;

export type CurrencyCode = keyof typeof currencyConfig;

// Pricing based on currency (simplified - adjust to your actual pricing)
export const pricing = {
  EUR: {
    starter: 997,
    professional: 1997,
    enterprise: 4997,
  },
  CHF: {
    starter: 1097,
    professional: 2197,
    enterprise: 5497,
  },
  AED: {
    starter: 3997,
    professional: 7997,
    enterprise: 19997,
  },
  USD: {
    starter: 1097,
    professional: 2197,
    enterprise: 5497,
  },
} as const;

// Format currency value based on currency config
export function formatCurrency(amount: number, currency: CurrencyCode): string {
  const config = currencyConfig[currency];
  const formatted = amount.toLocaleString('en-US'); // Format with commas

  if (config.position === 'before') {
    return `${config.symbol} ${formatted}`;
  } else {
    return `${formatted} ${config.symbol}`;
  }
}

// Get currency by country code
export function getCurrencyByCountry(countryCode: string): CurrencyCode {
  for (const [currency, config] of Object.entries(currencyConfig)) {
    if (config.countries.includes(countryCode.toUpperCase())) {
      return currency as CurrencyCode;
    }
  }
  return 'EUR'; // Default fallback
}
