/**
 * Currency Service
 * Provides multi-currency pricing support with simulated exchange rates.
 */

const SUPPORTED_CURRENCIES = {
  INR: { symbol: '₹', name: 'Indian Rupee' },
  USD: { symbol: '$', name: 'US Dollar' },
  AED: { symbol: 'د.إ', name: 'UAE Dirham' },
  EUR: { symbol: '€', name: 'Euro' },
}

// Simulated exchange rates (base: INR)
const EXCHANGE_RATES = {
  INR: 1,
  USD: 0.012,
  AED: 0.044,
  EUR: 0.011,
}

class CurrencyService {
  getSupportedCurrencies() {
    return Object.entries(SUPPORTED_CURRENCIES).map(([code, data]) => ({
      code,
      ...data,
    }))
  }

  /**
   * Get exchange rate between two currencies.
   * @param {string} from - Source currency code
   * @param {string} to - Target currency code
   * @returns {number} Exchange rate
   */
  getExchangeRate(from, to) {
    if (!EXCHANGE_RATES[from] || !EXCHANGE_RATES[to]) {
      console.warn(`Unsupported currency: ${from} or ${to}`)
      return 1
    }
    // Convert from source to INR, then to target
    const inrValue = 1 / EXCHANGE_RATES[from]
    return inrValue * EXCHANGE_RATES[to]
  }

  /**
   * Convert price from one currency to another.
   * @param {number} amount
   * @param {string} from
   * @param {string} to
   * @returns {Object} { amount, symbol, formatted }
   */
  convertPrice(amount, from, to) {
    const rate = this.getExchangeRate(from, to)
    const convertedAmount = amount * rate
    const targetCurrency = SUPPORTED_CURRENCIES[to]

    return {
      amount: Math.round(convertedAmount * 100) / 100,
      symbol: targetCurrency?.symbol || '',
      formatted: `${targetCurrency?.symbol || ''}${convertedAmount.toFixed(2)}`,
    }
  }
}

export default new CurrencyService()
