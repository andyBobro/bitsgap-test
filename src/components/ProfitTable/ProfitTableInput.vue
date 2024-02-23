<script setup lang="ts">
defineOptions({
  inheritAttrs: false,
});

defineProps({
  id: {
    type: String,
    default: undefined,
  },
  label: {
    type: String,
    default: undefined,
  },
  modelValue: {
    type: Number,
    default: NaN,
  },
  hasError: {
    type: Boolean,
    default: false,
  },
});

const emit = defineEmits(["update:modelValue", "blur:modelValue"]);

function handleInput(event: Event) {
  const target = event.target as HTMLInputElement;

  emit("update:modelValue", parseFloat(target.value));
}

function handleBlur(event: Event) {
  const target = event.target as HTMLInputElement;

  emit("blur:modelValue", parseFloat(target.value));
}
</script>

<template>
  <div class="flex items-center justify-start gap-1">
    <div class="relative text-sm">
      <input
        :id="id"
        type="number"
        class="remove-arrow absolute top-0 w-full appearance-none border-0 bg-base-100 p-0 text-base-950 focus:outline-none"
        :class="{
          'text-red-400': hasError,
        }"
        v-bind="$attrs"
        :value="modelValue || 0"
        @input="handleInput($event)"
        @blur="handleBlur($event)"
      />
      <pre class="relative -z-10 -translate-y-full opacity-0">{{
        modelValue || 0
      }}</pre>
    </div>

    <label
      v-if="label"
      :for="id"
      class="text-sm"
      :class="{
        'text-red-400': hasError,
        'text-base-600': !hasError,
      }"
    >
      {{ label }}
    </label>
  </div>
</template>

<style scoped>
.remove-arrow::-webkit-inner-spin-button,
.remove-arrow::-webkit-outer-spin-button {
  -webkit-appearance: none;
  margin: 0;
}

.remove-arrow {
  -moz-appearance: textfield;
}
</style>
