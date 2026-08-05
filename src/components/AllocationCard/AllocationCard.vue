<script setup lang="ts">
import "./AllocationCard.css";

defineProps<{
  title: string;
  value: string;
}>();
</script>

<template>
  <div class="allocation-field">
    <label>{{ title }}</label>

    <div class="allocation-input">
      <input type="text" :value="value" readonly />
    </div>
  </div>
</template>
