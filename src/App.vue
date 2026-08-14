<script setup lang="ts">
import "./App.css";
import { computed, ref, watch } from "vue";
import PortfolioEditor from "./components/PortfolioEditor/PortfolioEditor.vue";
import AllocationSummary from "./components/AllocationSummary/AllocationSummary.vue";
import { useCryptoCurrencies } from "./composables/useCryptoCurrencies";
import { useExchangeRates } from "./composables/useExchangeRates";
import {
  MAX_INVESTMENT_AMOUNT,
  getCurrencyName,
  isSymbolTakenElsewhere,
  validateMix,
} from "./utils/portfolio";
import type {
  CryptoCurrency,
  CryptoSymbol,
  PortfolioAsset,
} from "./types/exchangeRates";

const fallbackCurrencies: CryptoCurrency[] = [
  { code: "BTC", name: "Bitcoin" },
  { code: "ETH", name: "Ethereum" },
  { code: "SOL", name: "Solana" },
  { code: "XRP", name: "XRP" },
  { code: "ADA", name: "Cardano" },
];
const defaultPortfolio = (): PortfolioAsset[] => [
  { id: "btc", symbol: "BTC", percentage: 50 },
  { id: "eth", symbol: "ETH", percentage: 50 },
];
const investmentAmount = ref<number | null>(null);
const assets = ref<PortfolioAsset[]>(defaultPortfolio());
const { rates, error, lastUpdated, loadRates } = useExchangeRates();
const { currencies } = useCryptoCurrencies();

const assetCatalog = computed(() =>
  currencies.value.length ? currencies.value : fallbackCurrencies
);

watch(
  () => assets.value.map((asset) => asset.symbol),
  (symbols) => loadRates(symbols),
  { immediate: true }
);

function resetInvestmentAmount() {
  investmentAmount.value = null;
}
function resetPortfolio() {
  assets.value = defaultPortfolio();
}
function currencyName(symbol: CryptoSymbol) {
  return getCurrencyName(assetCatalog.value, symbol);
}
function clampPercentage(value: number) {
  return Math.min(100, Math.max(0, Number.isFinite(value) ? value : 0));
}

function setWeight(index: number, requestedWeight: number) {
  const asset = assets.value[index];
  if (!asset) return;
  // Mutates the existing asset in place (rather than replacing the array
  // element) so this doesn't retrigger the symbols watch below, which only
  // needs to refetch rates when a symbol changes, not on every weight edit.
  asset.percentage = clampPercentage(requestedWeight);
}

function selectAsset(index: number, symbol: CryptoSymbol) {
  const existingAsset = assets.value[index];
  if (!existingAsset) return;
  if (!isSymbolTakenElsewhere(assets.value, index, symbol)) {
    assets.value[index] = { ...existingAsset, symbol };
  }
}
function addAsset() {
  const nextSymbol = assetCatalog.value.find(
    (currency) => !assets.value.some((asset) => asset.symbol === currency.code)
  )?.code;
  if (!nextSymbol || assets.value.length >= 5) return;
  assets.value = [
    ...assets.value,
    {
      id: nextSymbol.toLowerCase() + "-" + Date.now(),
      symbol: nextSymbol,
      percentage: 0,
    },
  ];
}
function removeAsset(index: number) {
  if (assets.value.length <= 2) return;
  assets.value = assets.value.filter((_, itemIndex) => itemIndex !== index);
}

const investmentAmountError = computed(() => {
  if (investmentAmount.value !== null && investmentAmount.value <= 0) {
    return "Enter an amount greater than $0.";
  }
  if (
    investmentAmount.value !== null &&
    investmentAmount.value > MAX_INVESTMENT_AMOUNT
  ) {
    return "Investment amount cannot exceed $1 trillion.";
  }
  return "";
});
const isMixInvalid = computed(() => !validateMix(assets.value).isComplete);
const isAllocationIncomplete = computed(
  () =>
    !!investmentAmountError.value ||
    isMixInvalid.value ||
    !investmentAmount.value
);
</script>

<template>
  <main class="app-shell">
    <nav class="site-nav" aria-label="Primary navigation">
      <a
        class="brand"
        href="#calculator"
        aria-label="MyChain portfolio planner home"
      >
        <svg class="brand-mark" viewBox="0 0 20 20" aria-hidden="true">
          <path
            class="brand-mark-left"
            d="M10 1 L2.21 5.5 L2.21 14.5 L10 19 Z"
          />
          <path
            class="brand-mark-right"
            d="M10 1 L17.79 5.5 L17.79 14.5 L10 19 Z"
          />
        </svg>
        <span>MyChain</span>
      </a>
      <span class="nav-context">Portfolio planner</span>
    </nav>
    <section id="calculator" class="hero" aria-labelledby="page-title">
      <div class="hero-copy">
        <p class="eyebrow">A deliberate starting point</p>
        <h1 id="page-title">Give every dollar<br />a clear role.</h1>
        <p class="hero-description">
          Build a personal crypto mix, then see exactly what your investment can
          buy.
        </p>
      </div>
      <div class="planner">
        <PortfolioEditor
          v-model="investmentAmount"
          :assets="assets"
          :currencies="assetCatalog"
          :investment-amount-error="investmentAmountError"
          @clear-amount="resetInvestmentAmount"
          @reset-portfolio="resetPortfolio"
          @set-weight="setWeight"
          @select-asset="selectAsset"
          @add-asset="addAsset"
          @remove-asset="removeAsset"
        />
        <AllocationSummary
          :assets="assets"
          :investment-amount="investmentAmount"
          :investment-amount-error="investmentAmountError"
          :is-incomplete="isAllocationIncomplete"
          :rates="rates"
          :error="error"
          :last-updated="lastUpdated"
          :currency-name="currencyName"
          @retry="loadRates(assets.map((asset) => asset.symbol))"
        />
      </div>
    </section>
  </main>
</template>
