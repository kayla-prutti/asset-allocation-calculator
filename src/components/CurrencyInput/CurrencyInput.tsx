import { useEffect, useRef, useState, type ChangeEvent, type ReactNode } from "react";
import "./CurrencyInput.css";
import { formatCurrencyInput, formatNumber } from "@/utils/formatters";

interface CurrencyInputProps {
  modelValue: number | null;
  onChange: (value: number | null) => void;
  label: string;
  inputId: string;
  placeholder: string;
  currencySymbol: string;
  errorMessage?: string;
  maxAmount?: number;
  action?: ReactNode;
}

function countDigitsBefore(value: string, position: number) {
  return (value.slice(0, position).match(/[\d.]/g) ?? []).length;
}
function positionAfterDigits(value: string, digitCount: number) {
  let seen = 0;
  for (let index = 0; index < value.length; index++) {
    if (seen >= digitCount) return index;
    if (/[\d.]/.test(value.charAt(index))) seen++;
  }
  return value.length;
}

export default function CurrencyInput({
  modelValue,
  onChange,
  label,
  inputId,
  placeholder,
  currencySymbol,
  errorMessage,
  maxAmount,
  action,
}: CurrencyInputProps) {
  // Typed-in display text; once the parent clears modelValue back to null
  // (e.g. "Clear amount"), the input renders empty regardless of this value.
  const [typedDisplayValue, setTypedDisplayValue] = useState("");
  const displayValue = modelValue === null ? "" : typedDisplayValue;
  const inputRef = useRef<HTMLInputElement | null>(null);
  const isFirstRender = useRef(true);

  useEffect(() => {
    if (isFirstRender.current) {
      isFirstRender.current = false;
      return;
    }
    if (modelValue === null) {
      inputRef.current?.focus();
    }
  }, [modelValue]);

  function updateValue(event: ChangeEvent<HTMLInputElement>) {
    const input = event.target;
    const previousValue = input.value;
    const cursorPosition = input.selectionStart ?? previousValue.length;
    const digitsBeforeCursor = countDigitsBefore(previousValue, cursorPosition);

    const formattedValue = formatCurrencyInput(previousValue);
    const shouldCapValue =
      maxAmount !== undefined &&
      formattedValue.numericValue !== null &&
      formattedValue.numericValue > maxAmount;
    const nextValue = shouldCapValue
      ? formatCurrencyInput(String(maxAmount))
      : formattedValue;

    setTypedDisplayValue(nextValue.displayValue);
    input.value = nextValue.displayValue;

    if (!shouldCapValue) {
      const nextCursorPosition = positionAfterDigits(nextValue.displayValue, digitsBeforeCursor);
      input.setSelectionRange(nextCursorPosition, nextCursorPosition);
    }

    onChange(nextValue.numericValue);
  }

  function formatOnBlur() {
    if (!displayValue) return;

    const [, decimalPart = ""] = displayValue.split(".");
    const hasDecimalDigits = decimalPart.length > 0;
    const numericValue = Number(displayValue.replace(/,/g, ""));

    if (Number.isFinite(numericValue)) {
      setTypedDisplayValue(formatNumber(numericValue, hasDecimalDigits ? 2 : 0, 2));
    }
  }

  return (
    <div className="currency-field">
      <div className="currency-field-heading">
        <label htmlFor={inputId}>{label}</label>
        {action}
      </div>

      <div className={`currency-input${errorMessage ? " invalid" : ""}`}>
        <span aria-hidden="true">{currencySymbol}</span>

        <input
          ref={inputRef}
          id={inputId}
          type="text"
          inputMode="decimal"
          placeholder={placeholder}
          autoComplete="off"
          value={displayValue}
          aria-invalid={Boolean(errorMessage)}
          aria-describedby={errorMessage ? `${inputId}-error` : undefined}
          onChange={updateValue}
          onBlur={formatOnBlur}
        />
      </div>

      {errorMessage && (
        <p id={`${inputId}-error`} className="currency-error" aria-live="polite" aria-atomic="true">
          {errorMessage}
        </p>
      )}
    </div>
  );
}
