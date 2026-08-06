<script setup lang="ts">
import "./AllocationCard.css";

defineProps<{
  label: string;
  inputId: string;
  placeholder: string;
  value: string;
}>();
</script>

<template>
  <div class="allocation-field">
    <label :for="inputId">{{ label }}</label>

    <div class="allocation-input" aria-live="polite" aria-atomic="true">
      <input
        :id="inputId"
        type="text"
        :placeholder="placeholder"
        :value="value"
        readonly
      />
    </div>
  </div>
</template>
