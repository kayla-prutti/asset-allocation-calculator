import { onMounted, ref } from "vue";
import { fetchCryptoRates } from "@/services/coinbaseApi";
import type { CryptoRates } from "@/types/exchangeRates";

export function useExchangeRates() {
  const rates = ref<CryptoRates | null>(null);
  const error = ref<string | null>(null);
  // A loading state is intentionally omitted because fast requests would create
  // a distracting flash without giving the user useful feedback.
  async function loadRates() {
    try {
      rates.value = await fetchCryptoRates();
      error.value = null;
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
