import type { CryptoCurrency, CryptoSymbol, PortfolioAsset } from "../types/exchangeRates";

export const MAX_INVESTMENT_AMOUNT = 1_000_000_000_000;

export function getCurrencyName(currencies: CryptoCurrency[], symbol: CryptoSymbol): string {
  return currencies.find((currency) => currency.code === symbol)?.name ?? symbol;
}

export function calculateTotalWeight(assets: PortfolioAsset[]): number {
  return Math.round(assets.reduce((total, asset) => total + asset.percentage, 0) * 100) / 100;
}

export function isSymbolTakenElsewhere(
  assets: PortfolioAsset[],
  index: number,
  symbol: CryptoSymbol,
): boolean {
  return assets.some((asset, itemIndex) => itemIndex !== index && asset.symbol === symbol);
}

export interface MixValidation {
  totalWeight: number;
  isComplete: boolean;
  isOverAllocated: boolean;
  errorMessage: string;
}

export function validateMix(assets: PortfolioAsset[]): MixValidation {
  const totalWeight = calculateTotalWeight(assets);
  const isOverAllocated = totalWeight > 100;
  const isComplete = totalWeight === 100;
  const errorMessage = isOverAllocated
    ? "Total allocation cannot exceed 100%."
    : !isComplete
      ? "Total allocation must equal 100%."
      : "";
  return { totalWeight, isComplete, isOverAllocated, errorMessage };
}
