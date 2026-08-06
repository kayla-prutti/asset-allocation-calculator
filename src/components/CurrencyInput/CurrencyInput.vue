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
} = defineProps<{
  modelValue: number | null;
  label: string;
  inputId: string;
  placeholder: string;
  currencySymbol: string;
  errorMessage?: string;
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

function updateValue(event: Event) {
  const input = event.target as HTMLInputElement;
  const formattedValue = formatCurrencyInput(input.value);

  displayValue.value = formattedValue.displayValue;
  input.value = displayValue.value;
  emit("update:modelValue", formattedValue.numericValue);
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
    <label :for="inputId">{{ label }}</label>

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

    <p v-if="errorMessage" :id="`${inputId}-error`" class="currency-error">
      {{ errorMessage }}
    </p>
  </div>
</template>
