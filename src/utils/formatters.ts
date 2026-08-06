export function formatNumber(
  value: number,
  minimumFractionDigits: number,
  maximumFractionDigits: number
): string {
  return new Intl.NumberFormat("en-US", {
    minimumFractionDigits,
    maximumFractionDigits,
  }).format(value);
}
