import { useCallback, useEffect, useState } from "react";
import { fetchCryptoCurrencies } from "@/services/coinbaseApi";
import type { CryptoCurrency } from "@/types/exchangeRates";

export function useCryptoCurrencies() {
  const [currencies, setCurrencies] = useState<CryptoCurrency[]>([]);
  const [error, setError] = useState<string | null>(null);

  const loadCurrencies = useCallback(() => {
    return fetchCryptoCurrencies().then(
      (result) => {
        setCurrencies(result);
        setError(null);
      },
      (requestError: unknown) => {
        setError(
          requestError instanceof Error
            ? requestError.message
            : "Unable to load the available cryptocurrencies.",
        );
      },
    );
  }, []);

  useEffect(() => {
    loadCurrencies();
  }, [loadCurrencies]);

  return { currencies, error, loadCurrencies };
}
