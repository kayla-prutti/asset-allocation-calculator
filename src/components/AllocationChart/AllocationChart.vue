<script setup lang="ts">
import { computed } from "vue";
import "./AllocationChart.css";
import type { AllocationSegment, CryptoSymbol } from "../../types/exchangeRates";

const props = defineProps<{
  segments: AllocationSegment[];
  activeSegmentIndex: number | null;
  assetCount: number;
  currencyName: (symbol: CryptoSymbol) => string;
}>();

const emit = defineEmits<{
  showSegment: [index: number];
  clearSegment: [];
}>();

const chartPaths = computed(() => {
  let startAngle = -90;
  return props.segments.map((segment) => {
    const endAngle = startAngle + segment.asset.percentage * 3.6;
    const path = donutPath(startAngle, endAngle);
    const midAngle = startAngle + (endAngle - startAngle) / 2;
    startAngle = endAngle;
    return { ...segment, path, midAngle };
  });
});
const activeSegment = computed(
  () => chartPaths.value.find((segment) => segment.index === props.activeSegmentIndex) ?? null,
);
const tooltipStyle = computed(() => {
  if (!activeSegment.value) return {};
  const point = polarPoint(activeSegment.value.midAngle, 55);
  return { left: `${(point.x / 120) * 100}%`, top: `${(point.y / 120) * 100}%` };
});

function polarPoint(angle: number, radius = 46) {
  const radians = (angle * Math.PI) / 180;
  return { x: 60 + radius * Math.cos(radians), y: 60 + radius * Math.sin(radians) };
}
function donutPath(startAngle: number, endAngle: number) {
  const sweep = endAngle - startAngle;
  if (sweep >= 359.999) return "M 60 14 A 46 46 0 1 1 59.999 14";
  const start = polarPoint(startAngle);
  const end = polarPoint(endAngle);
  return `M ${start.x} ${start.y} A 46 46 0 ${sweep > 180 ? 1 : 0} 1 ${end.x} ${end.y}`;
}
function showSegmentAtPointer(event: MouseEvent) {
  const chart = event.currentTarget as SVGElement;
  const bounds = chart.getBoundingClientRect();
  const x = event.clientX - bounds.left - bounds.width / 2;
  const y = event.clientY - bounds.top - bounds.height / 2;
  const angle = (Math.atan2(y, x) * 180) / Math.PI;
  const percentageAtPointer = ((angle + 90 + 360) % 360) / 3.6;
  let accumulatedPercentage = 0;
  const segment = props.segments.find((item) => {
    accumulatedPercentage += item.asset.percentage;
    return percentageAtPointer <= accumulatedPercentage;
  });
  if (segment) emit("showSegment", segment.index);
  else emit("clearSegment");
}
</script>

<template>
  <div class="allocation-chart" @mouseleave="emit('clearSegment')">
    <svg class="allocation-donut" viewBox="0 0 120 120" role="img" aria-label="Crypto allocation chart" @mousemove="showSegmentAtPointer">
      <circle class="allocation-donut-track" cx="60" cy="60" r="46" />
      <path v-for="segment in chartPaths" :key="segment.asset.id" class="allocation-donut-segment" :class="{ active: activeSegmentIndex === segment.index }" :d="segment.path" :stroke="segment.color" tabindex="0" :aria-label="`${currencyName(segment.asset.symbol)}: ${segment.asset.percentage}%`" @mouseenter="emit('showSegment', segment.index)" @focus="emit('showSegment', segment.index)" @blur="emit('clearSegment')" />
    </svg>
    <div v-if="activeSegment" class="chart-tooltip" role="tooltip" :style="tooltipStyle"><strong>{{ currencyName(activeSegment.asset.symbol) }}</strong><span>{{ activeSegment.asset.percentage }}%</span></div>
    <div class="allocation-chart-center"><strong>{{ assetCount }}</strong><span>assets</span></div>
  </div>
</template>
