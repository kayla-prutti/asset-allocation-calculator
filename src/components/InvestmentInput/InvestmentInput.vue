<script setup lang="ts">
import { ref } from "vue";
import "./InvestmentInput.css";

defineProps<{
  modelValue: number | null;
  errorMessage?: string;
}>();

const emit = defineEmits<{
  "update:modelValue": [value: number | null];
}>();

const displayValue = ref("");

function updateValue(event: Event) {
  const input = event.target as HTMLInputElement;

  // Allow only numbers and one decimal point
  let cleanedValue = input.value.replace(/,/g, "").replace(/[^\d.]/g, "");

  const [integerPart = "", ...decimalParts] = cleanedValue.split(".");
  const decimalPart = decimalParts.join("").slice(0, 2); // only do 2 decimal since USD normally uses cents

  // Format the whole-number section with commas
  const formattedInteger = integerPart
    ? Number(integerPart).toLocaleString("en-US")
    : "";

  // Preserve the decimal point while the user is typing
  const hasDecimal = cleanedValue.includes(".");

  displayValue.value = hasDecimal
    ? `${formattedInteger}.${decimalPart}`
    : formattedInteger;

  // Replace anything invalid that may have been pasted or typed
  input.value = displayValue.value;

  if (!integerPart && !decimalPart) {
    emit("update:modelValue", null);
    return;
  }

  const numericValue = Number(
    `${integerPart || "0"}${hasDecimal ? `.${decimalPart}` : ""}`,
  );

  emit(
    "update:modelValue",
    Number.isFinite(numericValue) ? numericValue : null,
  );
}
</script>

<template>
  <div class="field">
    <label for="investment-amount">Investable assets</label>

    <div class="currency-input" :class="{ invalid: Boolean(errorMessage) }">
      <span aria-hidden="true">$</span>

      <input
        id="investment-amount"
        type="text"
        inputmode="decimal"
        placeholder="Please input amount"
        autocomplete="off"
        :value="displayValue"
        :aria-invalid="Boolean(errorMessage)"
        :aria-describedby="errorMessage ? 'investment-error' : undefined"
        @input="updateValue"
      />
    </div>

    <p v-if="errorMessage" id="investment-error" class="error">
      {{ errorMessage }}
    </p>
  </div>
</template>
