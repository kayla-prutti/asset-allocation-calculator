// Set crypto value round to 2 decimals
export function formatCrypto(value: number): string {
  return new Intl.NumberFormat("en-US", {
    minimumFractionDigits: 2,
    maximumFractionDigits: 8, // Crypto amounts can be smaller than 0.01, so show up to 8 decimal places.
  }).format(value);
}
