import { useMemo, useState } from "react";
import "./AllocationSummary.css";
import AllocationChart from "@/components/AllocationChart/AllocationChart";
import AllocationLegend from "@/components/AllocationLegend/AllocationLegend";
import type { CryptoRates, CryptoSymbol, PortfolioAsset } from "@/types/exchangeRates";
import { formatNumber } from "@/utils/formatters";

interface AllocationSummaryProps {
  assets: PortfolioAsset[];
  investmentAmount: number | null;
  investmentAmountError: string;
  isIncomplete: boolean;
  rates: CryptoRates | null;
  error: string | null;
  lastUpdated: Date | null;
  currencyName: (symbol: CryptoSymbol) => string;
  onRetry: () => void;
}

const chartColors = ["#f37578", "#ffad7a", "#74d7e8", "#6fa0f4", "#8f83ee"];
function colorForIndex(index: number): string {
  return chartColors[index % chartColors.length] ?? "#8f83ee";
}

export default function AllocationSummary({
  assets,
  investmentAmount,
  investmentAmountError,
  isIncomplete,
  rates,
  error,
  lastUpdated,
  currencyName,
  onRetry,
}: AllocationSummaryProps) {
  const [activeSegmentIndex, setActiveSegmentIndex] = useState<number | null>(null);

  const chartSegments = useMemo(
    () =>
      assets
        .filter((asset) => asset.percentage > 0)
        .map((asset, index) => ({
          asset,
          index,
          color: colorForIndex(index),
        })),
    [assets],
  );

  const formattedUpdatedTime = lastUpdated
    ? new Intl.DateTimeFormat("en-US", { hour: "numeric", minute: "2-digit" }).format(lastUpdated)
    : "";

  function formattedCryptoAmount(asset: PortfolioAsset) {
    const rate = rates?.[asset.symbol];
    if (!rate || !investmentAmount || investmentAmountError) return "";
    const units = investmentAmount * (asset.percentage / 100) * rate;
    return `${formatNumber(units, 2, 8)} ${asset.symbol}`;
  }
  function formattedDollarAmount(asset: PortfolioAsset) {
    if (!investmentAmount || investmentAmountError) return "";
    return `$${formatNumber(investmentAmount * (asset.percentage / 100), 0, 2)} allocated`;
  }

  return (
    <section className="allocation-panel" aria-labelledby="allocation-heading">
      <div className="allocation-heading">
        <div>
          <p className="section-kicker">Your proposed mix</p>
          <h2 id="allocation-heading">Your crypto allocation</h2>
        </div>
        <span className={`live-status${error ? " unavailable" : ""}`}>
          <i aria-hidden="true"></i>
          {error ? "Prices unavailable" : "Live pricing"}
        </span>
      </div>
      {error ? (
        <div className="exchange-rate-error" role="alert">
          <span className="error-icon" aria-hidden="true">
            !
          </span>
          <div>
            <p className="error-title">We couldn&apos;t load the latest prices.</p>
            <p className="error-message">{error}</p>
            <button className="error-retry" type="button" onClick={onRetry}>
              Try again
            </button>
          </div>
        </div>
      ) : (
        <div className={`mix-content${isIncomplete ? " is-incomplete" : ""}`}>
          <div className="mix-overview">
            <AllocationChart
              segments={chartSegments}
              activeSegmentIndex={activeSegmentIndex}
              assetCount={assets.length}
              currencyName={currencyName}
              onShowSegment={setActiveSegmentIndex}
              onClearSegment={() => setActiveSegmentIndex(null)}
            />
            <AllocationLegend
              segments={chartSegments}
              activeSegmentIndex={activeSegmentIndex}
              currencyName={currencyName}
              formattedDollarAmount={formattedDollarAmount}
              formattedCryptoAmount={formattedCryptoAmount}
              onShowSegment={setActiveSegmentIndex}
              onClearSegment={() => setActiveSegmentIndex(null)}
            />
          </div>
          <div className="rate-footer">
            {formattedUpdatedTime && <p>Live prices updated {formattedUpdatedTime}</p>}
            <p>Illustrative allocation only. Not investment advice.</p>
          </div>
        </div>
      )}
    </section>
  );
}
