import { useCallback, useState } from "react";
import { fetchCryptoRates } from "@/services/coinbaseApi";
import type { CryptoRates, CryptoSymbol } from "@/types/exchangeRates";

export function useExchangeRates() {
  const [rates, setRates] = useState<CryptoRates | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [lastUpdated, setLastUpdated] = useState<Date | null>(null);

  const loadRates = useCallback(async (symbols: CryptoSymbol[]) => {
    try {
      setRates(await fetchCryptoRates(symbols));
      setError(null);
      setLastUpdated(new Date());
    } catch (requestError) {
      setError(
        requestError instanceof Error
          ? requestError.message
          : "Unable to load exchange rates.",
      );
    }
  }, []);

  return { rates, error, lastUpdated, loadRates };
}
