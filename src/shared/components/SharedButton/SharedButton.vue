<script setup lang="ts">
import { computed, PropType } from "vue";

const props = defineProps({
  type: {
    type: String as PropType<"submit" | "reset" | "button" | undefined>,
    default: "button",
  },
  variant: {
    type: String as PropType<"accent" | "primary">,
    default: "primary",
  },
  outline: {
    type: Boolean,
    default: false,
  },
  fullWidth: {
    type: Boolean,
    default: false,
  },
});

const styleClasses = computed(() => {
  return {
    "w-full": props.fullWidth,
    "h-12 bg-crusta-400 text-white hover:bg-crusta-500 focus-visible:outline-crusta-400":
      props.variant === "accent",
    "bg-white ring-1 ring-inset ring-crusta-400 text-crusta-400 hover:bg-crusta-500 hover:text-white focus-visible:outline-crusta-400":
      props.variant === "accent" && props.outline,
    "h-10 bg-eastern-blue-600 text-white hover:bg-eastern-blue-700 focus-visible:outline-eastern-blue-600":
      props.variant === "primary",
    "bg-white ring-1 ring-inset ring-eastern-blue-600 text-eastern-blue-600 hover:bg-eastern-blue-700 hover:text-white focus-visible:outline-eastern-blue-600":
      props.variant === "accent" && props.outline,
  };
});
</script>

<template>
  <button
    :type="type"
    class="flex items-center justify-center px-4 font-medium shadow-sm transition-colors duration-150 ease-in-out focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2"
    :class="styleClasses"
  >
    <slot></slot>
  </button>
</template>
