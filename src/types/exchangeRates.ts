export type CryptoSymbol = string;

export type CryptoRates = Partial<Record<CryptoSymbol, number>>;

export interface CryptoCurrency {
  code: CryptoSymbol;
  name: string;
  color?: string;
  sortIndex?: number;
}

export interface PortfolioAsset {
  id: string;
  symbol: CryptoSymbol;
  percentage: number;
}

export interface AllocationSegment {
  asset: PortfolioAsset;
  index: number;
  color: string;
}
