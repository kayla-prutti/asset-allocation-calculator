<script setup lang="ts">
import "./AllocationLegend.css";
import type { AllocationSegment, CryptoSymbol, PortfolioAsset } from "../../types/exchangeRates";

defineProps<{
  segments: AllocationSegment[];
  activeSegmentIndex: number | null;
  currencyName: (symbol: CryptoSymbol) => string;
  formattedDollarAmount: (asset: PortfolioAsset) => string;
  formattedCryptoAmount: (asset: PortfolioAsset) => string;
}>();

const emit = defineEmits<{
  showSegment: [index: number];
  clearSegment: [];
}>();
</script>

<template>
  <ul class="allocation-legend" aria-label="Crypto allocation breakdown">
    <li v-for="segment in segments" :key="segment.asset.id"><button type="button" :class="{ active: activeSegmentIndex === segment.index }" @mouseenter="emit('showSegment', segment.index)" @focus="emit('showSegment', segment.index)" @blur="emit('clearSegment')" @click="emit('showSegment', segment.index)"><i :style="{ backgroundColor: segment.color }" aria-hidden="true"></i><span class="legend-asset"><b>{{ currencyName(segment.asset.symbol) }}</b><small v-if="formattedDollarAmount(segment.asset)">{{ formattedDollarAmount(segment.asset) }}</small></span><strong v-if="formattedCryptoAmount(segment.asset)">{{ formattedCryptoAmount(segment.asset) }}</strong></button></li>
  </ul>
</template>
