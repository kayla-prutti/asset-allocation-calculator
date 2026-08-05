export interface CoinbaseExchangeRatesResponse {
  data: {
    currency: string;
    rates: Record<string, string>;
  };
}

export interface CryptoRates {
  btc: number;
  eth: number;
}
