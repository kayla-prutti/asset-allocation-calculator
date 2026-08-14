import type {
  CryptoCurrency,
  CryptoRates,
  CryptoSymbol,
} from "@/types/exchangeRates";

interface CoinbaseExchangeRatesResponse {
  data: {
    currency: string;
    rates: Record<string, string>;
  };
}

const EXCHANGE_RATES_URL =
  "https://api.coinbase.com/v2/exchange-rates?currency=USD";
const CRYPTO_CURRENCIES_URL = "https://api.coinbase.com/v2/currencies/crypto";

interface CoinbaseCryptoCurrency {
  code: string;
  name: string;
  color?: string;
  sort_index?: number;
}

export async function fetchCryptoCurrencies(): Promise<CryptoCurrency[]> {
  const [currenciesResponse, ratesResponse] = await Promise.all([
    fetch(CRYPTO_CURRENCIES_URL),
    fetch(EXCHANGE_RATES_URL),
  ]);

  if (!currenciesResponse.ok || !ratesResponse.ok) {
    throw new Error("Unable to load the available cryptocurrencies.");
  }

  const currenciesPayload:
    CoinbaseCryptoCurrency[] | { data: CoinbaseCryptoCurrency[] } =
    await currenciesResponse.json();
  const ratesPayload: CoinbaseExchangeRatesResponse =
    await ratesResponse.json();
  const currencies = Array.isArray(currenciesPayload)
    ? currenciesPayload
    : currenciesPayload.data;

  return currencies
    .filter((currency) =>
      Number.isFinite(Number(ratesPayload.data.rates[currency.code]))
    )
    .map((currency) => ({
      code: currency.code,
      name: currency.name,
      color: currency.color,
      sortIndex: currency.sort_index,
    }))
    .sort(
      (first, second) =>
        (first.sortIndex ?? 9999) - (second.sortIndex ?? 9999) ||
        first.name.localeCompare(second.name)
    );
}

export async function fetchCryptoRates(
  symbols: CryptoSymbol[]
): Promise<CryptoRates> {
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

  const parsedRates = Object.fromEntries(
    symbols.map((symbol) => [symbol, Number(result.data.rates[symbol])])
  ) as CryptoRates;

  if (symbols.some((symbol) => !Number.isFinite(parsedRates[symbol]))) {
    throw new Error("The exchange-rate response was invalid.");
  }

  return parsedRates;
}
