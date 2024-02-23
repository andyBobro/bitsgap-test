<script setup lang="ts">
import { computed } from "vue";
import NumberInput from "@/shared/components/NumberInput/NumberInput.vue";
import TakeProfit from "@/components/TakeProfit.vue";
import Button from "@/shared/components/SharedButton/SharedButton.vue";
import { BASE_CURRENCY, QUOTE_CURRENCY } from "@/utils/constants";
import {
  price,
  setPrice,
  amount,
  setAmount,
  setTotal,
  activeOrderSide,
  setOrderSide,
  total,
  validate,
} from "@/store";
import PlaceOrderTypeSwitch from "@/components/PlaceOrderTypeSwitch.vue";
import InfoIcon from "@/shared/icons/InfoIcon/InfoIcon.vue";

const submitButtonText = computed(() => {
  return activeOrderSide.value === "buy"
    ? `Buy ${BASE_CURRENCY}`
    : `Sell ${BASE_CURRENCY}`;
});

const submit = () => {
  console.log("submit");
  validate();
};
</script>

<template>
  <form method="post" @submit.prevent="submit" class="grid gap-4">
    <div>
      <div class="flex items-center gap-2">
        <span class="text-sm text-base-600">Market direction</span>
        <InfoIcon class="size-4" />
      </div>

      <PlaceOrderTypeSwitch
        class="mt-2"
        :modelValue="activeOrderSide"
        @update:modelValue="setOrderSide($event)"
      />
    </div>
    <div>
      <NumberInput
        id="price"
        :label="`Price, ${QUOTE_CURRENCY}`"
        :modelValue="price"
        @update:modelValue="setPrice($event)"
        autofocus
      />
    </div>
    <div>
      <NumberInput
        id="amount"
        :label="`Amount, ${BASE_CURRENCY}`"
        :modelValue="amount"
        @update:modelValue="setAmount($event)"
      />
    </div>
    <div>
      <NumberInput
        id="total"
        :label="`Total, ${QUOTE_CURRENCY}`"
        :modelValue="total"
        @update:modelValue="setTotal($event)"
      />
    </div>

    <TakeProfit />

    <div>
      <Button type="submit" variant="accent" :full-width="true">
        {{ submitButtonText }}
      </Button>
    </div>
  </form>
</template>
