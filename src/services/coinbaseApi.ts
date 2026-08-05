import type {
  CoinbaseExchangeRatesResponse,
  CryptoRates,
} from "@/types/exchangeRates";

const EXCHANGE_RATES_URL =
  "https://api.coinbase.com/v2/exchange-rates?currency=USD";

export async function fetchCryptoRates(): Promise<CryptoRates> {
  const response = await fetch(EXCHANGE_RATES_URL);

  if (!response.ok) {
    throw new Error(`Unable to load exchange rates: ${response.status}`);
  }

  const result: CoinbaseExchangeRatesResponse = await response.json();

  const btc = Number(result.data.rates.BTC);
  const eth = Number(result.data.rates.ETH);

  return { btc, eth };
}
