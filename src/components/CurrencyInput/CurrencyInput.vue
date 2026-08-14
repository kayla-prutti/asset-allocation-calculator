<script setup lang="ts">
import { ref, watch, nextTick } from "vue";
import "./CurrencyInput.css";
import { formatCurrencyInput, formatNumber } from "@/utils/formatters";

const {
  modelValue,
  label,
  inputId,
  placeholder,
  currencySymbol,
  errorMessage,
  maxAmount,
} = defineProps<{
  modelValue: number | null;
  label: string;
  inputId: string;
  placeholder: string;
  currencySymbol: string;
  errorMessage?: string;
  maxAmount?: number;
}>();

const emit = defineEmits<{
  "update:modelValue": [value: number | null];
}>();

const displayValue = ref("");
const inputElement = ref<HTMLInputElement | null>(null);

watch(
  () => modelValue,
  async (value) => {
    if (value === null) {
      displayValue.value = "";
      await nextTick();
      inputElement.value?.focus();
    }
  }
);

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

function updateValue(event: Event) {
  const input = event.target as HTMLInputElement;
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

  displayValue.value = nextValue.displayValue;
  input.value = displayValue.value;

  if (!shouldCapValue) {
    const nextCursorPosition = positionAfterDigits(displayValue.value, digitsBeforeCursor);
    input.setSelectionRange(nextCursorPosition, nextCursorPosition);
  }

  emit("update:modelValue", nextValue.numericValue);
}

function formatOnBlur() {
  if (!displayValue.value) return;

  const [, decimalPart = ""] = displayValue.value.split(".");
  const hasDecimalDigits = decimalPart.length > 0;
  const numericValue = Number(displayValue.value.replace(/,/g, ""));

  if (Number.isFinite(numericValue)) {
    displayValue.value = formatNumber(
      numericValue,
      hasDecimalDigits ? 2 : 0,
      2
    );
  }
}
</script>

<template>
  <div class="currency-field">
    <div class="currency-field-heading">
      <label :for="inputId">{{ label }}</label>
      <slot name="action" />
    </div>

    <div class="currency-input" :class="{ invalid: Boolean(errorMessage) }">
      <span aria-hidden="true">{{ currencySymbol }}</span>

      <input
        ref="inputElement"
        :id="inputId"
        type="text"
        inputmode="decimal"
        :placeholder="placeholder"
        autocomplete="off"
        :value="displayValue"
        :aria-invalid="Boolean(errorMessage)"
        :aria-describedby="errorMessage ? `${inputId}-error` : undefined"
        @input="updateValue"
        @blur="formatOnBlur"
      />
    </div>

    <p
      v-if="errorMessage"
      :id="`${inputId}-error`"
      class="currency-error"
      aria-live="polite"
      aria-atomic="true"
    >
      {{ errorMessage }}
    </p>
  </div>
</template>
