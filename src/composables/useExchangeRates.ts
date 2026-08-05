import { onMounted, ref } from "vue";
import { fetchCryptoRates } from "@/services/coinbaseApi";
import type { CryptoRates } from "@/types/exchangeRates";

export function useExchangeRates() {
  const rates = ref<CryptoRates | null>(null);
  const isLoading = ref(false);
  const error = ref<string | null>(null);
  const lastUpdated = ref<Date | null>(null);

  async function loadRates() {
    isLoading.value = true;
    error.value = null;

    try {
      rates.value = await fetchCryptoRates();
      lastUpdated.value = new Date();
    } catch (unknownError) {
      error.value =
        unknownError instanceof Error
          ? unknownError.message
          : "Something went wrong while loading rates.";
    } finally {
      isLoading.value = false;
    }
  }

  onMounted(loadRates);

  return {
    rates,
    isLoading,
    error,
    lastUpdated,
    loadRates,
  };
}
