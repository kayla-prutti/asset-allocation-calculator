<script setup lang="ts">
import { computed, ref } from "vue";
import "./AllocationSummary.css";
import AllocationChart from "../AllocationChart/AllocationChart.vue";
import AllocationLegend from "../AllocationLegend/AllocationLegend.vue";
import type { CryptoRates, CryptoSymbol, PortfolioAsset } from "../../types/exchangeRates";
import { formatNumber } from "../../utils/formatters";

const props = defineProps<{
  assets: PortfolioAsset[];
  investmentAmount: number | null;
  investmentAmountError: string;
  isIncomplete: boolean;
  rates: CryptoRates | null;
  error: string | null;
  lastUpdated: Date | null;
  currencyName: (symbol: CryptoSymbol) => string;
}>();

const emit = defineEmits<{ retry: [] }>();

const chartColors = ["#f37578", "#ffad7a", "#74d7e8", "#6fa0f4", "#8f83ee"];
const activeSegmentIndex = ref<number | null>(null);
function colorForIndex(index: number): string {
  return chartColors[index % chartColors.length] ?? "#8f83ee";
}
const chartSegments = computed(() =>
  props.assets
    .filter((asset) => asset.percentage > 0)
    .map((asset, index) => ({
      asset,
      index,
      color: colorForIndex(index),
    })),
);
const formattedUpdatedTime = computed(() =>
  props.lastUpdated
    ? new Intl.DateTimeFormat("en-US", { hour: "numeric", minute: "2-digit" }).format(props.lastUpdated)
    : "",
);
function formattedCryptoAmount(asset: PortfolioAsset) {
  const rate = props.rates?.[asset.symbol];
  if (!rate || !props.investmentAmount || props.investmentAmountError) return "";
  const units = props.investmentAmount * (asset.percentage / 100) * rate;
  return `${formatNumber(units, 2, 8)} ${asset.symbol}`;
}
function formattedDollarAmount(asset: PortfolioAsset) {
  if (!props.investmentAmount || props.investmentAmountError) return "";
  return `$${formatNumber(props.investmentAmount * (asset.percentage / 100), 0, 2)} allocated`;
}
function showSegment(index: number) {
  activeSegmentIndex.value = index;
}
function clearSegment() {
  activeSegmentIndex.value = null;
}
</script>

<template>
  <section class="allocation-panel" aria-labelledby="allocation-heading">
    <div class="allocation-heading"><div><p class="section-kicker">Your proposed mix</p><h2 id="allocation-heading">Your crypto allocation</h2></div><span class="live-status" :class="{ unavailable: error }"><i aria-hidden="true"></i>{{ error ? "Prices unavailable" : "Live pricing" }}</span></div>
    <div v-if="error" class="exchange-rate-error" role="alert"><span class="error-icon" aria-hidden="true">!</span><div><p class="error-title">We couldn't load the latest prices.</p><p class="error-message">{{ error }}</p><button class="error-retry" type="button" @click="emit('retry')">Try again</button></div></div>
    <template v-else>
      <div class="mix-content" :class="{ 'is-incomplete': isIncomplete }">
        <div class="mix-overview">
          <AllocationChart :segments="chartSegments" :active-segment-index="activeSegmentIndex" :asset-count="assets.length" :currency-name="currencyName" @show-segment="showSegment" @clear-segment="clearSegment" />
          <AllocationLegend :segments="chartSegments" :active-segment-index="activeSegmentIndex" :currency-name="currencyName" :formatted-dollar-amount="formattedDollarAmount" :formatted-crypto-amount="formattedCryptoAmount" @show-segment="showSegment" @clear-segment="clearSegment" />
        </div>
        <div class="rate-footer"><p v-if="formattedUpdatedTime">Live prices updated {{ formattedUpdatedTime }}</p><p>Illustrative allocation only. Not investment advice.</p></div>
      </div>
    </template>
  </section>
</template>
