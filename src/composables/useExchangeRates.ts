import { ref } from "vue";
import { fetchCryptoRates } from "@/services/coinbaseApi";
import type { CryptoRates, CryptoSymbol } from "@/types/exchangeRates";

export function useExchangeRates() {
  const rates = ref<CryptoRates | null>(null);
  const error = ref<string | null>(null);
  const lastUpdated = ref<Date | null>(null);
  async function loadRates(symbols: CryptoSymbol[]) {
    try {
      rates.value = await fetchCryptoRates(symbols);
      error.value = null;
      lastUpdated.value = new Date();
    } catch (requestError) {
      error.value =
        requestError instanceof Error
          ? requestError.message
          : "Unable to load exchange rates.";
    }
  }

  return { rates, error, lastUpdated, loadRates };
}
