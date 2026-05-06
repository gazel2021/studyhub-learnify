/**
 * Local currency configuration per country.
 * Rates are USD → local (approximate display rates; replace with live rates when backend is available).
 */
import { usdToPi, PI_RATE_USD } from "./pi";

export interface CurrencyInfo {
  code: string; // ISO 4217 (or "PI")
  symbol: string;
  rate: number; // 1 USD = rate * code
  arName: string;
  enName: string;
  frName: string;
}

export const COUNTRY_CURRENCY: Record<string, string> = {
  EG: "EGP",
  SA: "SAR",
  AE: "AED",
  JO: "JOD",
  MA: "MAD",
  DZ: "DZD",
  TN: "TND",
  QA: "QAR",
  KW: "KWD",
  OM: "OMR",
  BH: "BHD",
  IQ: "IQD",
  YE: "YER",
  LB: "LBP",
  SY: "SYP",
  PS: "ILS",
  LY: "LYD",
  SD: "SDG",
  GLOBAL: "USD",
};

export const CURRENCIES: Record<string, CurrencyInfo> = {
  USD: { code: "USD", symbol: "$", rate: 1, arName: "دولار أمريكي", enName: "US Dollar", frName: "Dollar US" },
  EGP: { code: "EGP", symbol: "ج.م", rate: 47.5, arName: "جنيه مصري", enName: "Egyptian Pound", frName: "Livre égyptienne" },
  SAR: { code: "SAR", symbol: "ر.س", rate: 3.75, arName: "ريال سعودي", enName: "Saudi Riyal", frName: "Riyal saoudien" },
  AED: { code: "AED", symbol: "د.إ", rate: 3.67, arName: "درهم إماراتي", enName: "UAE Dirham", frName: "Dirham émirati" },
  JOD: { code: "JOD", symbol: "د.أ", rate: 0.71, arName: "دينار أردني", enName: "Jordanian Dinar", frName: "Dinar jordanien" },
  MAD: { code: "MAD", symbol: "د.م", rate: 9.95, arName: "درهم مغربي", enName: "Moroccan Dirham", frName: "Dirham marocain" },
  DZD: { code: "DZD", symbol: "د.ج", rate: 134, arName: "دينار جزائري", enName: "Algerian Dinar", frName: "Dinar algérien" },
  TND: { code: "TND", symbol: "د.ت", rate: 3.12, arName: "دينار تونسي", enName: "Tunisian Dinar", frName: "Dinar tunisien" },
  QAR: { code: "QAR", symbol: "ر.ق", rate: 3.64, arName: "ريال قطري", enName: "Qatari Riyal", frName: "Riyal qatari" },
  KWD: { code: "KWD", symbol: "د.ك", rate: 0.31, arName: "دينار كويتي", enName: "Kuwaiti Dinar", frName: "Dinar koweïtien" },
  OMR: { code: "OMR", symbol: "ر.ع", rate: 0.38, arName: "ريال عماني", enName: "Omani Rial", frName: "Rial omanais" },
  BHD: { code: "BHD", symbol: "د.ب", rate: 0.38, arName: "دينار بحريني", enName: "Bahraini Dinar", frName: "Dinar bahreïni" },
  IQD: { code: "IQD", symbol: "د.ع", rate: 1310, arName: "دينار عراقي", enName: "Iraqi Dinar", frName: "Dinar irakien" },
  YER: { code: "YER", symbol: "ر.ي", rate: 250, arName: "ريال يمني", enName: "Yemeni Rial", frName: "Rial yéménite" },
  LBP: { code: "LBP", symbol: "ل.ل", rate: 89500, arName: "ليرة لبنانية", enName: "Lebanese Pound", frName: "Livre libanaise" },
  SYP: { code: "SYP", symbol: "ل.س", rate: 13000, arName: "ليرة سورية", enName: "Syrian Pound", frName: "Livre syrienne" },
  ILS: { code: "ILS", symbol: "₪", rate: 3.7, arName: "شيكل", enName: "Israeli Shekel", frName: "Shekel" },
  LYD: { code: "LYD", symbol: "د.ل", rate: 4.85, arName: "دينار ليبي", enName: "Libyan Dinar", frName: "Dinar libyen" },
  SDG: { code: "SDG", symbol: "ج.س", rate: 600, arName: "جنيه سوداني", enName: "Sudanese Pound", frName: "Livre soudanaise" },
  PI: { code: "PI", symbol: "π", rate: 1 / PI_RATE_USD, arName: "عملة Pi", enName: "Pi Coin", frName: "Pi Coin" },
};

export function currencyForCountry(country: string): CurrencyInfo {
  const code = COUNTRY_CURRENCY[country] || "USD";
  return CURRENCIES[code] || CURRENCIES.USD;
}

export function convertFromUsd(usd: number, code: string): number {
  if (code === "PI") return usdToPi(usd);
  const c = CURRENCIES[code] || CURRENCIES.USD;
  const v = usd * c.rate;
  // smart precision
  if (v >= 1000) return Math.round(v);
  if (v >= 10) return +v.toFixed(2);
  return +v.toFixed(2);
}

export function formatCurrency(usd: number, code: string, lang: "ar" | "en" | "fr" = "ar"): string {
  const c = CURRENCIES[code] || CURRENCIES.USD;
  const value = convertFromUsd(usd, code);
  // Always use Latin digits (French formatting) per user request
  const formatted = new Intl.NumberFormat("fr-FR", {
    maximumFractionDigits: value >= 1000 ? 0 : 2,
  }).format(value);
  if (code === "USD") return `$${formatted}`;
  if (code === "PI") return `${formatted} π`;
  return `${formatted} ${c.symbol}`;
}
