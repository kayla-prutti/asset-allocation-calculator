import { onMounted, ref } from "vue";
import { fetchCryptoRates } from "@/services/coinbaseApi";
import type { CryptoRates } from "@/types/exchangeRates";

export function useExchangeRates() {
  const rates = ref<CryptoRates | null>(null);
  const error = ref<string | null>(null);

  // TODO: Add a loading state to the "Try Again" button if API requests become noticeably slow.
  // Not adding a loading state here for now - a fast request would just flash on/off.
  async function loadRates() {
    error.value = null;

    try {
      rates.value = await fetchCryptoRates();
    } catch (requestError) {
      error.value =
        requestError instanceof Error
          ? requestError.message
          : "Unable to load exchange rates.";
    }
  }

  onMounted(loadRates);

  return { rates, error, loadRates };
}
