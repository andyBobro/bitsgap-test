<script setup lang="ts">
import ProfitTableInput from "./ProfitTableInput.vue";
import WarningIcon from "@/shared/icons/WarningIcon/WarningIcon.vue";
import { ProfitTableItem } from "@/utils/model";
import { idGen } from "@/utils/helpers";
import { QUOTE_CURRENCY, PERCENT } from "@/utils/constants";

interface Props extends ProfitTableItem {
  hasError?: boolean;
}

const props = withDefaults(defineProps<Props>(), {
  hasError: false,
});

const emit = defineEmits(["update:profitItem", "remove:profitItem"]);

function handleInput(name: string, payload: number) {
  emit("update:profitItem", {
    name,
    payload,
  });
}

function removeProfileItem() {
  emit("remove:profitItem");
}
</script>

<template>
  <tr
    class="border-b"
    :class="{
      'border-b-red-400': hasError,
      'border-b-base-400': !hasError,
    }"
  >
    <td class="px-1">
      <ProfitTableInput
        :id="`profit_${idGen()}`"
        :label="PERCENT"
        @blur:modelValue="handleInput('profit', $event)"
        :modelValue="props.profit"
      />
    </td>
    <td class="px-1">
      <ProfitTableInput
        :id="`targetPrice_${idGen()}`"
        :label="QUOTE_CURRENCY"
        @blur:modelValue="handleInput('targetPrice', $event)"
        :modelValue="props.targetPrice"
      />
    </td>
    <td class="px-1">
      <div class="flex items-center justify-between gap-1">
        <ProfitTableInput
          :id="`amountToSell_${idGen()}`"
          :label="PERCENT"
          @update:modelValue="handleInput('amountToSell', $event)"
          :modelValue="props.amountToSell"
        />
        <button @click="removeProfileItem" type="button">
          <WarningIcon />
        </button>
      </div>
    </td>
  </tr>
</template>
