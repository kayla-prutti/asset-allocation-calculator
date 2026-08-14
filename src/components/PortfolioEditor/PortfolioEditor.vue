<script setup lang="ts">
import { computed } from "vue";
import "./PortfolioEditor.css";
import CurrencyInput from "../CurrencyInput/CurrencyInput.vue";
import CryptoInput from "../CryptoInput/CryptoInput.vue";
import { MAX_INVESTMENT_AMOUNT } from "../../utils/portfolio";
import type {
  CryptoCurrency,
  CryptoSymbol,
  PortfolioAsset,
} from "../../types/exchangeRates";

const props = defineProps<{
  modelValue: number | null;
  assets: PortfolioAsset[];
  currencies: CryptoCurrency[];
  investmentAmountError: string;
}>();

const emit = defineEmits<{
  "update:modelValue": [value: number | null];
  clearAmount: [];
  resetPortfolio: [];
  setWeight: [index: number, value: number];
  selectAsset: [index: number, symbol: CryptoSymbol];
  addAsset: [];
  removeAsset: [index: number];
}>();

const investmentAmount = computed({
  get: () => props.modelValue,
  set: (value) => emit("update:modelValue", value),
});
</script>

<template>
  <section class="investment-panel" aria-labelledby="investment-heading">
    <div class="panel-heading"><div><p class="section-kicker">Build your portfolio</p><h2 id="investment-heading">Choose assets and amount</h2></div></div>
    <CurrencyInput v-model="investmentAmount" label="Investment amount" input-id="investment-amount" placeholder="0" currency-symbol="$" :max-amount="MAX_INVESTMENT_AMOUNT" :error-message="investmentAmountError">
      <template v-if="investmentAmount && investmentAmount > 0" #action>
        <button class="reset-button" type="button" @click="emit('clearAmount')">Clear amount</button>
      </template>
    </CurrencyInput>
    <p class="input-hint">Use the amount you are comfortable allocating today.</p>
    <CryptoInput :assets="assets" :currencies="currencies" @reset-portfolio="emit('resetPortfolio')" @set-weight="(index, value) => emit('setWeight', index, value)" @select-asset="(index, symbol) => emit('selectAsset', index, symbol)" @add-asset="emit('addAsset')" @remove-asset="(index) => emit('removeAsset', index)" />
  </section>
</template>
