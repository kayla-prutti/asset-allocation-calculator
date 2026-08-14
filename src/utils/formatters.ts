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

export interface CurrencyInputValue {
  displayValue: string;
  numericValue: number | null;
}

export function formatCurrencyInput(value: string): CurrencyInputValue {
  // A decimal point isn't allowed until a digit (including "0") precedes it,
  // e.g. typing "." alone is dropped instead of becoming "0.".
  const cleanedValue = value
    .replace(/,/g, "")
    .replace(/[^\d.]/g, "")
    .replace(/^\.+/, "");
  const hasDecimal = cleanedValue.includes(".");
  const [integerPart = "", decimalPart = ""] = cleanedValue.split(".");
  const limitedDecimal = decimalPart.slice(0, 2);

  if (!integerPart) {
    return { displayValue: "", numericValue: null };
  }

  const formattedWhole = Number(integerPart).toLocaleString("en-US");
  // string value, ex: "1,025.35"
  const displayValue = hasDecimal
    ? `${formattedWhole}.${limitedDecimal}`
    : formattedWhole;

  // number value, ex: 1025.35
  const numericValue = Number(
    hasDecimal ? `${integerPart}.${limitedDecimal}` : integerPart
  );

  return { displayValue, numericValue };
}
