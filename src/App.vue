<script setup lang="ts">
import "./App.css";
import { computed, ref } from "vue";

import CurrencyInput from "./components/CurrencyInput/CurrencyInput.vue";
import AllocationCard from "./components/AllocationCard/AllocationCard.vue";
import { useExchangeRates } from "./composables/useExchangeRates";
import { calculateAllocation } from "./utils/calculateAllocation";
import { formatNumber } from "./utils/formatters";

const investmentAmount = ref<number | null>(null);

const { rates, error, loadRates } = useExchangeRates();

function resetInvestmentAmount() {
  investmentAmount.value = null;
}

const investmentAmountError = computed(() => {
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
          :error-message="investmentAmountError"
        />

        <button
          v-if="investmentAmount !== null"
          class="reset-button"
          type="button"
          @click="resetInvestmentAmount"
        >
          Reset
        </button>
      </div>

      <div class="right-column">
        <div v-if="error" class="exchange-rate-error" role="alert">
          <span class="error-icon" aria-hidden="true">!</span>
          <div>
            <p class="error-title">Unable to load crypto prices</p>
            <p class="error-message">{{ error }}</p>
            <button class="error-retry" type="button" @click="loadRates">
              Try again
            </button>
          </div>
        </div>

        <template v-else>
          <AllocationCard
            inputId="btc-allocation"
            label="70% BTC allocation"
            placeholder="Calculated amount"
            :value="allocation ? formatNumber(allocation.btcAmount, 2, 8) : ''"
          />

          <AllocationCard
            inputId="eth-allocation"
            label="30% ETH allocation"
            placeholder="Calculated amount"
            :value="allocation ? formatNumber(allocation.ethAmount, 2, 8) : ''"
          />
        </template>
      </div>
    </div>
  </main>
</template>
