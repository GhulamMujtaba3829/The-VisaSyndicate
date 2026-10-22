export interface CurrencyConfig {
  code: string;
  symbol: string;
  name: string;
  rateFromPkr: number; // multiplier to convert from PKR to this currency
  flag: string;
  format: (amount: number) => string;
}

export const SUPPORTED_CURRENCIES: CurrencyConfig[] = [
  {
    code: 'PKR',
    symbol: 'Rs',
    name: 'Pakistani Rupee',
    rateFromPkr: 1.0,
    flag: '🇵🇰',
    format: (amt) => `Rs ${Math.round(amt).toLocaleString()}`,
  },
  {
    code: 'USD',
    symbol: '$',
    name: 'US Dollar',
    rateFromPkr: 0.0036, // approx 1 USD = ~278 PKR
    flag: '🇺🇸',
    format: (amt) => `$${(amt * 0.0036).toFixed(0)} USD`,
  },
  {
    code: 'GBP',
    symbol: '£',
    name: 'British Pound',
    rateFromPkr: 0.0028, // approx 1 GBP = ~355 PKR
    flag: '🇬🇧',
    format: (amt) => `£${(amt * 0.0028).toFixed(0)} GBP`,
  },
  {
    code: 'EUR',
    symbol: '€',
    name: 'Euro',
    rateFromPkr: 0.0033, // approx 1 EUR = ~303 PKR
    flag: '🇪🇺',
    format: (amt) => `€${(amt * 0.0033).toFixed(0)} EUR`,
  },
  {
    code: 'AED',
    symbol: 'AED',
    name: 'UAE Dirham',
    rateFromPkr: 0.0132,
    flag: '🇦🇪',
    format: (amt) => `AED ${Math.round(amt * 0.0132).toLocaleString()}`,
  },
  {
    code: 'CAD',
    symbol: 'C$',
    name: 'Canadian Dollar',
    rateFromPkr: 0.0049,
    flag: '🇨🇦',
    format: (amt) => `C$${(amt * 0.0049).toFixed(0)} CAD`,
  },
  {
    code: 'SAR',
    symbol: 'SAR',
    name: 'Saudi Riyal',
    rateFromPkr: 0.0135,
    flag: '🇸🇦',
    format: (amt) => `SAR ${Math.round(amt * 0.0135).toLocaleString()}`,
  },
  {
    code: 'AUD',
    symbol: 'A$',
    name: 'Australian Dollar',
    rateFromPkr: 0.0055,
    flag: '🇦🇺',
    format: (amt) => `A$${(amt * 0.0055).toFixed(0)} AUD`,
  },
];

export function convertPkrFee(pkrAmount: number, targetCurrencyCode: string): {
  amount: number;
  formatted: string;
  symbol: string;
  currency: CurrencyConfig;
} {
  const curr = SUPPORTED_CURRENCIES.find((c) => c.code === targetCurrencyCode) || SUPPORTED_CURRENCIES[0];
  const converted = Math.round(pkrAmount * curr.rateFromPkr);
  return {
    amount: converted,
    formatted: curr.format(pkrAmount),
    symbol: curr.symbol,
    currency: curr,
  };
}
