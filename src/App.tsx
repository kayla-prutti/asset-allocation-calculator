import "./App.css";
import { useCallback, useEffect, useMemo, useState } from "react";
import PortfolioEditor from "@/components/PortfolioEditor/PortfolioEditor";
import AllocationSummary from "@/components/AllocationSummary/AllocationSummary";
import { useCryptoCurrencies } from "@/hooks/useCryptoCurrencies";
import { useExchangeRates } from "@/hooks/useExchangeRates";
import {
  MAX_INVESTMENT_AMOUNT,
  getCurrencyName,
  isSymbolTakenElsewhere,
  validateMix,
} from "@/utils/portfolio";
import type { CryptoCurrency, CryptoSymbol, PortfolioAsset } from "@/types/exchangeRates";

const fallbackCurrencies: CryptoCurrency[] = [
  { code: "BTC", name: "Bitcoin" },
  { code: "ETH", name: "Ethereum" },
  { code: "SOL", name: "Solana" },
  { code: "XRP", name: "XRP" },
  { code: "ADA", name: "Cardano" },
];
const defaultPortfolio = (): PortfolioAsset[] => [
  { id: "btc", symbol: "BTC", percentage: 50 },
  { id: "eth", symbol: "ETH", percentage: 50 },
];

function clampPercentage(value: number) {
  return Math.min(100, Math.max(0, Number.isFinite(value) ? value : 0));
}

function App() {
  const [investmentAmount, setInvestmentAmount] = useState<number | null>(null);
  const [assets, setAssets] = useState<PortfolioAsset[]>(defaultPortfolio());
  const { rates, error, lastUpdated, loadRates } = useExchangeRates();
  const { currencies } = useCryptoCurrencies();

  const assetCatalog = currencies.length ? currencies : fallbackCurrencies;
  const symbols = useMemo(() => assets.map((asset) => asset.symbol), [assets]);
  const symbolsKey = symbols.join(",");

  useEffect(() => {
    loadRates(symbols);
    // Depends on symbolsKey (not `assets`/`symbols` directly) so weight-only
    // edits don't retrigger a rate refetch — only an actual symbol change should.
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [symbolsKey, loadRates]);

  const resetInvestmentAmount = useCallback(() => setInvestmentAmount(null), []);
  const resetPortfolio = useCallback(() => setAssets(defaultPortfolio()), []);
  const currencyName = useCallback(
    (symbol: CryptoSymbol) => getCurrencyName(assetCatalog, symbol),
    [assetCatalog],
  );

  const setWeight = useCallback((index: number, requestedWeight: number) => {
    setAssets((current) => {
      if (!current[index]) return current;
      const nextPercentage = clampPercentage(requestedWeight);
      return current.map((asset, itemIndex) =>
        itemIndex === index ? { ...asset, percentage: nextPercentage } : asset,
      );
    });
  }, []);

  const selectAsset = useCallback((index: number, symbol: CryptoSymbol) => {
    setAssets((current) => {
      const existingAsset = current[index];
      if (!existingAsset) return current;
      if (isSymbolTakenElsewhere(current, index, symbol)) return current;
      return current.map((asset, itemIndex) =>
        itemIndex === index ? { ...asset, symbol } : asset,
      );
    });
  }, []);

  const addAsset = useCallback(() => {
    setAssets((current) => {
      if (current.length >= 5) return current;
      const nextSymbol = assetCatalog.find(
        (currency) => !current.some((asset) => asset.symbol === currency.code),
      )?.code;
      if (!nextSymbol) return current;
      return [
        ...current,
        { id: nextSymbol.toLowerCase() + "-" + Date.now(), symbol: nextSymbol, percentage: 0 },
      ];
    });
  }, [assetCatalog]);

  const removeAsset = useCallback((index: number) => {
    setAssets((current) =>
      current.length <= 2 ? current : current.filter((_, itemIndex) => itemIndex !== index),
    );
  }, []);

  const investmentAmountError = useMemo(() => {
    if (investmentAmount !== null && investmentAmount <= 0) {
      return "Enter an amount greater than $0.";
    }
    if (investmentAmount !== null && investmentAmount > MAX_INVESTMENT_AMOUNT) {
      return "Investment amount cannot exceed $1 trillion.";
    }
    return "";
  }, [investmentAmount]);

  const isMixInvalid = useMemo(() => !validateMix(assets).isComplete, [assets]);
  const isAllocationIncomplete = Boolean(investmentAmountError) || isMixInvalid || !investmentAmount;

  return (
    <main className="app-shell">
      <nav className="site-nav" aria-label="Primary navigation">
        <a className="brand" href="#calculator" aria-label="MyChain portfolio planner home">
          <svg className="brand-mark" viewBox="0 0 20 20" aria-hidden="true">
            <path className="brand-mark-left" d="M10 1 L2.21 5.5 L2.21 14.5 L10 19 Z" />
            <path className="brand-mark-right" d="M10 1 L17.79 5.5 L17.79 14.5 L10 19 Z" />
          </svg>
          <span>MyChain</span>
        </a>
        <span className="nav-context">Portfolio planner</span>
      </nav>
      <section id="calculator" className="hero" aria-labelledby="page-title">
        <div className="hero-copy">
          <p className="eyebrow">A deliberate starting point</p>
          <h1 id="page-title">
            Give every dollar
            <br />a clear role.
          </h1>
          <p className="hero-description">
            Build a personal crypto mix, then see exactly what your investment can buy.
          </p>
        </div>
        <div className="planner">
          <PortfolioEditor
            investmentAmount={investmentAmount}
            onInvestmentAmountChange={setInvestmentAmount}
            assets={assets}
            currencies={assetCatalog}
            investmentAmountError={investmentAmountError}
            onClearAmount={resetInvestmentAmount}
            onResetPortfolio={resetPortfolio}
            onSetWeight={setWeight}
            onSelectAsset={selectAsset}
            onAddAsset={addAsset}
            onRemoveAsset={removeAsset}
          />
          <AllocationSummary
            assets={assets}
            investmentAmount={investmentAmount}
            investmentAmountError={investmentAmountError}
            isIncomplete={isAllocationIncomplete}
            rates={rates}
            error={error}
            lastUpdated={lastUpdated}
            currencyName={currencyName}
            onRetry={() => loadRates(assets.map((asset) => asset.symbol))}
          />
        </div>
      </section>
    </main>
  );
}

export default App;
