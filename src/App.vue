<script setup lang="ts">
import "./App.css";
import { computed, ref } from "vue";

import CurrencyInput from "./components/CurrencyInput/CurrencyInput.vue";
import AllocationCard from "./components/AllocationCard/AllocationCard.vue";
import { useExchangeRates } from "./composables/useExchangeRates";
import { calculateAllocation } from "./utils/calculateAllocation";
import { formatCrypto } from "./utils/formatters";

const investmentAmount = ref<number | null>(null);

const { rates } = useExchangeRates();

const inputError = computed(() => {
  if (investmentAmount.value === null) return "";

  if (investmentAmount.value <= 0) {
    return "Please enter an amount greater than 0.";
  }

  return "";
});

const allocation = computed(() => {
  if (!rates.value || !investmentAmount.value) {
    return null;
  }

  return calculateAllocation(investmentAmount.value, rates.value);
});
</script>

<template>
  <main class="container">
    <h1>Asset allocation calculator</h1>

    <div class="calculator">
      <div class="left-column">
        <CurrencyInput
          v-model="investmentAmount"
          label="Investable assets"
          input-id="investment-amount"
          placeholder="Please input amount"
          currency-symbol="$"
          :error-message="inputError"
        />
      </div>

      <div class="right-column">
        <AllocationCard
          inputId="btc-allocation"
          label="70% BTC allocation"
          placeholder="Calculated amount"
          :value="allocation ? formatCrypto(allocation.btcAmount) : ''"
        />

        <AllocationCard
          inputId="eth-allocation"
          label="30% ETH allocation"
          placeholder="Calculated amount"
          :value="allocation ? formatCrypto(allocation.ethAmount) : ''"
        />
      </div>
    </div>
  </main>
</template>
