import { onMounted, ref } from "vue";
import { fetchCryptoCurrencies } from "@/services/coinbaseApi";
import type { CryptoCurrency } from "@/types/exchangeRates";

export function useCryptoCurrencies() {
  const currencies = ref<CryptoCurrency[]>([]);
  const error = ref<string | null>(null);

  async function loadCurrencies() {
    try {
      currencies.value = await fetchCryptoCurrencies();
      error.value = null;
    } catch (requestError) {
      error.value =
        requestError instanceof Error
          ? requestError.message
          : "Unable to load the available cryptocurrencies.";
    }
  }

  onMounted(loadCurrencies);

  return { currencies, error, loadCurrencies };
}
