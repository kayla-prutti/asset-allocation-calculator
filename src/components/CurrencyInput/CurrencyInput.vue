<script setup lang="ts">
import { ref, watch, nextTick } from "vue";
import "./CurrencyInput.css";

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
  const cleanedValue = input.value.replace(/,/g, "").replace(/[^\d.]/g, "");
  const [integerPart = "", decimalPart = ""] = cleanedValue.split(".");
  const hasDecimal = cleanedValue.includes(".");
  const limitedDecimal = decimalPart.slice(0, 2);
  // convert integerPart to a number and add commas.
  const formattedInteger = integerPart
    ? Number(integerPart).toLocaleString("en-US")
    : "";

  displayValue.value = hasDecimal
    ? `${formattedInteger}.${limitedDecimal}`
    : formattedInteger;

  // update HTML input element
  input.value = displayValue.value;

  const numericValue = Number(
    `${integerPart || "0"}${hasDecimal ? `.${limitedDecimal}` : ""}`
  );

  // Send the new value to the parent through v-model.
  emit("update:modelValue", displayValue.value ? numericValue : null);
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
      />
    </div>

    <p v-if="errorMessage" :id="`${inputId}-error`" class="currency-error">
      {{ errorMessage }}
    </p>
  </div>
</template>
