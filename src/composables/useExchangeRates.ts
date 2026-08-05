import { onMounted, ref } from "vue";
import { fetchCryptoRates } from "@/services/coinbaseApi";
import type { CryptoRates } from "@/types/exchangeRates";

export function useExchangeRates() {
  const rates = ref<CryptoRates | null>(null);

  onMounted(async () => {
    try {
      rates.value = await fetchCryptoRates();
    } catch {
      rates.value = null;
    }
  });

  return { rates };
}
