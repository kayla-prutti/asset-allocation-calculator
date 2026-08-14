import "./AllocationLegend.css";
import type { AllocationSegment, CryptoSymbol, PortfolioAsset } from "@/types/exchangeRates";

interface AllocationLegendProps {
  segments: AllocationSegment[];
  activeSegmentIndex: number | null;
  currencyName: (symbol: CryptoSymbol) => string;
  formattedDollarAmount: (asset: PortfolioAsset) => string;
  formattedCryptoAmount: (asset: PortfolioAsset) => string;
  onShowSegment: (index: number) => void;
  onClearSegment: () => void;
}

export default function AllocationLegend({
  segments,
  activeSegmentIndex,
  currencyName,
  formattedDollarAmount,
  formattedCryptoAmount,
  onShowSegment,
  onClearSegment,
}: AllocationLegendProps) {
  return (
    <ul className="allocation-legend" aria-label="Crypto allocation breakdown">
      {segments.map((segment) => {
        const dollarAmount = formattedDollarAmount(segment.asset);
        const cryptoAmount = formattedCryptoAmount(segment.asset);
        return (
          <li key={segment.asset.id}>
            <button
              type="button"
              className={activeSegmentIndex === segment.index ? "active" : undefined}
              onMouseEnter={() => onShowSegment(segment.index)}
              onFocus={() => onShowSegment(segment.index)}
              onBlur={onClearSegment}
              onClick={() => onShowSegment(segment.index)}
            >
              <i style={{ backgroundColor: segment.color }} aria-hidden="true"></i>
              <span className="legend-asset">
                <b>{currencyName(segment.asset.symbol)}</b>
                {dollarAmount && <small>{dollarAmount}</small>}
              </span>
              {cryptoAmount && <strong>{cryptoAmount}</strong>}
            </button>
          </li>
        );
      })}
    </ul>
  );
}
