import type { CryptoRates } from "@/types/exchangeRates";

interface CoinbaseExchangeRatesResponse {
  data: {
    currency: string;
    rates: Record<string, string>;
  };
}

const EXCHANGE_RATES_URL =
  "https://api.coinbase.com/v2/exchange-rates?currency=USD";

export async function fetchCryptoRates(): Promise<CryptoRates> {
  let response: Response;

  try {
    // uncomment line 18 and comment line 19  to test failed API
    // response = new Response(null, { status: 500 });
    response = await fetch(EXCHANGE_RATES_URL);
  } catch {
    throw new Error(
      "Unable to reach the pricing service. Check your connection, then try again."
    );
  }

  if (!response.ok) {
    throw new Error(
      `Due to issue with ${response.status} error.\nCheck your connection, then try again.`
    );
  }

  const result: CoinbaseExchangeRatesResponse = await response.json();

  const btc = Number(result.data.rates.BTC);
  const eth = Number(result.data.rates.ETH);

  if (!Number.isFinite(btc) || !Number.isFinite(eth)) {
    throw new Error("The exchange-rate response was invalid.");
  }

  return { btc, eth };
}
