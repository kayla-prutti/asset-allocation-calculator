import { onMounted, ref } from "vue";
import { fetchCryptoRates } from "@/services/coinbaseApi";
import type { CryptoRates } from "@/types/exchangeRates";

export function useExchangeRates() {
  const rates = ref<CryptoRates | null>(null);
  const error = ref<string | null>(null);

  onMounted(async () => {
    try {
      rates.value = await fetchCryptoRates();
    } catch (requestError) {
      error.value =
        requestError instanceof Error
          ? requestError.message
          : "Unable to load exchange rates.";
    }
  });

  return { rates, error };
}
