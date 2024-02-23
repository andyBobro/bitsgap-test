<script setup lang="ts">
import { idGen } from "@/utils/helpers";

interface Props {
  modelValue: boolean;
  id?: string;
  reverse?: boolean;
  justifyBetween?: boolean;
}

defineOptions({
  inheritAttrs: false,
});

const props = withDefaults(defineProps<Props>(), {
  id: idGen(),
  reverse: false,
  justifyBetween: false,
});

const emit = defineEmits(["update:modelValue"]);

function handleInput(e: Event) {
  emit("update:modelValue", (e.target as HTMLInputElement).checked);
}
</script>

<template>
  <div class="relative">
    <input
      class="invisible absolute left-0 top-0 h-[1px] w-[1px] opacity-0"
      v-bind="{ ...$attrs }"
      :id="props.id"
      :checked="props.modelValue"
      @input="handleInput"
      type="checkbox"
    />
    <label
      class="flex items-center"
      :class="{
        'flex-row-reverse': props.reverse,
        'justify-between': props.justifyBetween,
      }"
      :for="props.id"
    >
      <div>
        <slot />
      </div>
      <div
        class="flex h-6 w-[42px] rounded-xl p-[3px] transition-all"
        :class="{
          'bg-eastern-blue-600': props.modelValue,
          'bg-base-500': !props.modelValue,
        }"
      >
        <div
          class="h-[18px] w-[18px] rounded-full bg-white shadow-[-1px_1px_4px_0_#00000040] transition-all"
          :class="{
            'translate-x-0': !props.modelValue,
            'translate-x-full': props.modelValue,
          }"
        ></div>
      </div>
    </label>
  </div>
</template>
