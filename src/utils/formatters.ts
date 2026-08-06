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
  const cleanedValue = value.replace(/,/g, "").replace(/[^\d.]/g, "");
  const hasDecimal = cleanedValue.includes(".");
  const [integerPart = "", decimalPart = ""] = cleanedValue.split(".");
  const limitedDecimal = decimalPart.slice(0, 2);

  // hasDecimal is tracked separately from integerPart/decimalPart so a
  // trailing "5." still displays as typed, instead of reverting to "5".
  // e.g. typing ".1" should show "0.1", not ".1".
  // (formatOnBlur in CurrencyInput.vue cleans up a dangling "." once they blur away.)
  const wholePart = integerPart || (hasDecimal ? "0" : "");
  if (!wholePart) {
    return { displayValue: "", numericValue: null };
  }

  const formattedWhole = Number(wholePart).toLocaleString("en-US");
  // string value, ex: "1,025.35"
  const displayValue = hasDecimal
    ? `${formattedWhole}.${limitedDecimal}`
    : formattedWhole;

  // number value, ex: 1025.35
  const numericValue = Number(
    hasDecimal ? `${wholePart}.${limitedDecimal}` : wholePart
  );

  return { displayValue, numericValue };
}
