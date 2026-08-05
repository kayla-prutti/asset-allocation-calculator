import type {
  CoinbaseExchangeRatesResponse,
  CryptoRates,
} from "@/types/exchangeRates";

const EXCHANGE_RATES_URL =
  "https://api.coinbase.com/v2/exchange-rates?currency=USD";

export async function fetchCryptoRates(): Promise<CryptoRates> {
  // uncomment line 11 and comment line 12  to test failed API
  // const response = new Response(null, { status: 500 });
  const response = await fetch(EXCHANGE_RATES_URL);

  if (!response.ok) {
    throw new Error(`Unable to load exchange rates: ${response.status}`);
  }

  const result: CoinbaseExchangeRatesResponse = await response.json();

  const btc = Number(result.data.rates.BTC);
  const eth = Number(result.data.rates.ETH);

  if (!Number.isFinite(btc) || !Number.isFinite(eth)) {
    throw new Error("The exchange-rate response was invalid.");
  }

  return { btc, eth };
}
