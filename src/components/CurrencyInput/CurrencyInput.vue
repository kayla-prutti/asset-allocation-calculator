<script setup lang="ts">
import { ref } from "vue";
import "./CurrencyInput.css";

withDefaults(
  defineProps<{
    modelValue: number | null;
    label?: string;
    inputId?: string;
    placeholder?: string;
    currencySymbol?: string;
    errorMessage?: string;
  }>(),
  {
    label: "Amount",
    inputId: "currency-amount",
    placeholder: "Enter an amount",
    currencySymbol: "$",
  },
);

const emit = defineEmits<{
  "update:modelValue": [value: number | null];
}>();

const displayValue = ref("");

function updateValue(event: Event) {
  const input = event.target as HTMLInputElement;

  // Allow digits and one decimal point.
  const cleanedValue = input.value.replace(/,/g, "").replace(/[^\d.]/g, "");
  const [integerPart = "", ...decimalParts] = cleanedValue.split(".");
  const decimalPart = decimalParts.join("").slice(0, 2);
  const formattedInteger = integerPart
    ? Number(integerPart).toLocaleString("en-US")
    : "";
  const hasDecimal = cleanedValue.includes(".");

  displayValue.value = hasDecimal
    ? `${formattedInteger}.${decimalPart}`
    : formattedInteger;
  input.value = displayValue.value;

  if (!integerPart && !decimalPart) {
    emit("update:modelValue", null);
    return;
  }

  const numericValue = Number(
    `${integerPart || "0"}${hasDecimal ? `.${decimalPart}` : ""}`,
  );

  emit("update:modelValue", Number.isFinite(numericValue) ? numericValue : null);
}
</script>

<template>
  <div class="field">
    <label :for="inputId">{{ label }}</label>

    <div class="currency-input" :class="{ invalid: Boolean(errorMessage) }">
      <span aria-hidden="true">{{ currencySymbol }}</span>

      <input
        :id="inputId"
        type="text"
        inputmode="decimal"
        :placeholder="placeholder"
        autocomplete="off"
        :value="displayValue"
        :aria-invalid="Boolean(errorMessage)"
        :aria-describedby="errorMessage ? `${inputId}-error` : undefined"
        @input="updateValue"
      />
    </div>

    <p v-if="errorMessage" :id="`${inputId}-error`" class="error">
      {{ errorMessage }}
    </p>
  </div>
</template>
