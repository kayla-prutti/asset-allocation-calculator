import type { CryptoRates } from "@/types/exchangeRates";

export interface AllocationResult {
  btcUsd: number;
  ethUsd: number;
  btcAmount: number;
  ethAmount: number;
}

export function calculateAllocation(
  investmentAmount: number,
  rates: CryptoRates,
): AllocationResult {
  const btcUsd = investmentAmount * 0.7;
  const ethUsd = investmentAmount * 0.3;

  return {
    btcUsd,
    ethUsd,
    btcAmount: btcUsd * rates.btc,
    ethAmount: ethUsd * rates.eth,
  };
}
