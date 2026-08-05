import type { CryptoRates } from "@/types/exchangeRates";

export interface AllocationResult {
  btcAmount: number;
  ethAmount: number;
}

export function calculateAllocation(
  investmentAmount: number,
  rates: CryptoRates,
): AllocationResult {
  return {
    btcAmount: investmentAmount * 0.7 * rates.btc,
    ethAmount: investmentAmount * 0.3 * rates.eth,
  };
}
