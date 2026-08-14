import { useMemo, type CSSProperties, type MouseEvent } from "react";
import "./AllocationChart.css";
import type { AllocationSegment, CryptoSymbol } from "@/types/exchangeRates";

interface AllocationChartProps {
  segments: AllocationSegment[];
  activeSegmentIndex: number | null;
  assetCount: number;
  currencyName: (symbol: CryptoSymbol) => string;
  onShowSegment: (index: number) => void;
  onClearSegment: () => void;
}

function polarPoint(angle: number, radius = 46) {
  const radians = (angle * Math.PI) / 180;
  return { x: 60 + radius * Math.cos(radians), y: 60 + radius * Math.sin(radians) };
}
function donutPath(startAngle: number, endAngle: number) {
  const sweep = endAngle - startAngle;
  if (sweep >= 359.999) return "M 60 14 A 46 46 0 1 1 59.999 14";
  const start = polarPoint(startAngle);
  const end = polarPoint(endAngle);
  return `M ${start.x} ${start.y} A 46 46 0 ${sweep > 180 ? 1 : 0} 1 ${end.x} ${end.y}`;
}

export default function AllocationChart({
  segments,
  activeSegmentIndex,
  assetCount,
  currencyName,
  onShowSegment,
  onClearSegment,
}: AllocationChartProps) {
  const chartPaths = useMemo(
    () =>
      segments.map((segment, index) => {
        const startAngle =
          -90 + segments.slice(0, index).reduce((sum, item) => sum + item.asset.percentage * 3.6, 0);
        const endAngle = startAngle + segment.asset.percentage * 3.6;
        return {
          ...segment,
          path: donutPath(startAngle, endAngle),
          midAngle: startAngle + (endAngle - startAngle) / 2,
        };
      }),
    [segments],
  );

  const activeSegment = useMemo(
    () => chartPaths.find((segment) => segment.index === activeSegmentIndex) ?? null,
    [chartPaths, activeSegmentIndex],
  );

  const tooltipStyle: CSSProperties = useMemo(() => {
    if (!activeSegment) return {};
    const point = polarPoint(activeSegment.midAngle, 55);
    return { left: `${(point.x / 120) * 100}%`, top: `${(point.y / 120) * 100}%` };
  }, [activeSegment]);

  function showSegmentAtPointer(event: MouseEvent<SVGSVGElement>) {
    const chart = event.currentTarget;
    const bounds = chart.getBoundingClientRect();
    const x = event.clientX - bounds.left - bounds.width / 2;
    const y = event.clientY - bounds.top - bounds.height / 2;
    const angle = (Math.atan2(y, x) * 180) / Math.PI;
    const percentageAtPointer = ((angle + 90 + 360) % 360) / 3.6;
    let accumulatedPercentage = 0;
    const segment = segments.find((item) => {
      accumulatedPercentage += item.asset.percentage;
      return percentageAtPointer <= accumulatedPercentage;
    });
    if (segment) onShowSegment(segment.index);
    else onClearSegment();
  }

  return (
    <div className="allocation-chart" onMouseLeave={onClearSegment}>
      <svg
        className="allocation-donut"
        viewBox="0 0 120 120"
        role="img"
        aria-label="Crypto allocation chart"
        onMouseMove={showSegmentAtPointer}
      >
        <circle className="allocation-donut-track" cx={60} cy={60} r={46} />
        {chartPaths.map((segment) => (
          <path
            key={segment.asset.id}
            className={`allocation-donut-segment${activeSegmentIndex === segment.index ? " active" : ""}`}
            d={segment.path}
            stroke={segment.color}
            tabIndex={0}
            aria-label={`${currencyName(segment.asset.symbol)}: ${segment.asset.percentage}%`}
            onMouseEnter={() => onShowSegment(segment.index)}
            onFocus={() => onShowSegment(segment.index)}
            onBlur={onClearSegment}
          />
        ))}
      </svg>
      {activeSegment && (
        <div className="chart-tooltip" role="tooltip" style={tooltipStyle}>
          <strong>{currencyName(activeSegment.asset.symbol)}</strong>
          <span>{activeSegment.asset.percentage}%</span>
        </div>
      )}
      <div className="allocation-chart-center">
        <strong>{assetCount}</strong>
        <span>assets</span>
      </div>
    </div>
  );
}
