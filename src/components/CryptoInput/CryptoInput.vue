<script setup lang="ts">
import { computed, ref } from "vue";
import "./CryptoInput.css";
import { getCurrencyName, isSymbolTakenElsewhere, validateMix } from "../../utils/portfolio";
import type {
  CryptoCurrency,
  CryptoSymbol,
  PortfolioAsset,
} from "../../types/exchangeRates";

const props = defineProps<{
  assets: PortfolioAsset[];
  currencies: CryptoCurrency[];
}>();

const emit = defineEmits<{
  resetPortfolio: [];
  setWeight: [index: number, value: number];
  selectAsset: [index: number, symbol: CryptoSymbol];
  addAsset: [];
  removeAsset: [index: number];
}>();

const openAssetIndex = ref<number | null>(null);
const assetSearch = ref("");
const filteredCurrencies = computed(() => {
  const query = assetSearch.value.trim().toLowerCase();
  return query
    ? props.currencies.filter(
        (currency) =>
          currency.name.toLowerCase().includes(query) ||
          currency.code.toLowerCase().includes(query),
      )
    : props.currencies;
});
const mix = computed(() => validateMix(props.assets));

function currencyName(symbol: CryptoSymbol) {
  return getCurrencyName(props.currencies, symbol);
}
function isSelectedElsewhere(index: number, symbol: CryptoSymbol) {
  return isSymbolTakenElsewhere(props.assets, index, symbol);
}
function toggleAssetMenu(index: number) {
  openAssetIndex.value = openAssetIndex.value === index ? null : index;
  assetSearch.value = "";
}
function updateWeight(index: number, event: Event) {
  emit("setWeight", index, Number((event.target as HTMLInputElement).value));
}
function chooseAsset(index: number, symbol: CryptoSymbol) {
  if (!isSelectedElsewhere(index, symbol)) emit("selectAsset", index, symbol);
  openAssetIndex.value = null;
}
function removeAsset(index: number) {
  emit("removeAsset", index);
  openAssetIndex.value = null;
}
function resetPortfolio() {
  emit("resetPortfolio");
  openAssetIndex.value = null;
}
</script>

<template>
  <fieldset class="allocation-editor" :class="{ invalid: !mix.isComplete }" :aria-invalid="!mix.isComplete">
    <div class="mix-editor-heading"><legend>Choose your mix</legend><button class="reset-mix-button" type="button" @click="resetPortfolio">Reset mix</button></div>
    <p>Set each weight yourself. <strong class="mix-total" :class="{ incomplete: !mix.isComplete && !mix.isOverAllocated, over: mix.isOverAllocated }">{{ mix.totalWeight }}% total</strong></p>
    <div class="asset-picker-list">
      <div v-for="(asset, index) in assets" :key="asset.id" class="asset-picker-row" :class="{ 'is-removable': assets.length > 2, 'menu-open': openAssetIndex === index }">
        <div class="asset-select">
          <span>Crypto</span>
          <button :id="'asset-' + asset.id" class="asset-select-trigger" type="button" aria-haspopup="listbox" :aria-expanded="openAssetIndex === index" :aria-controls="'asset-options-' + asset.id" @click="toggleAssetMenu(index)" @keydown.escape="openAssetIndex = null">
            <span>{{ currencyName(asset.symbol) }}</span><small>{{ asset.symbol }}</small><i aria-hidden="true"></i>
          </button>
          <div v-if="openAssetIndex === index" class="asset-options">
            <input v-model="assetSearch" type="search" placeholder="Search assets" aria-label="Search cryptocurrencies" />
            <ul :id="'asset-options-' + asset.id" role="listbox" :aria-labelledby="'asset-' + asset.id">
              <li v-for="currency in filteredCurrencies" :key="currency.code" role="option" :aria-selected="asset.symbol === currency.code">
                <button type="button" :disabled="isSelectedElsewhere(index, currency.code)" @click="chooseAsset(index, currency.code)"><span>{{ currency.name }}</span><small>{{ currency.code }}</small></button>
              </li>
              <li v-if="filteredCurrencies.length === 0" class="no-assets">No assets found</li>
            </ul>
          </div>
        </div>
        <label class="weight-input" :for="'weight-' + asset.id"><span>Weight</span><span class="weight-control"><input :id="'weight-' + asset.id" type="number" inputmode="decimal" min="0" max="100" :value="asset.percentage" @input="updateWeight(index, $event)" /><b aria-hidden="true">%</b></span></label>
        <button v-if="assets.length > 2" class="remove-asset-button" type="button" :aria-label="'Remove ' + currencyName(asset.symbol)" @click="removeAsset(index)">×</button>
      </div>
    </div>
    <p v-if="mix.errorMessage" class="mix-error" role="alert">{{ mix.errorMessage }}</p>
    <button v-if="assets.length < 5" class="add-asset-button" type="button" @click="emit('addAsset')">+ Add another asset</button>
  </fieldset>
</template>
