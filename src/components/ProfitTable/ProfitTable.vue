<script setup lang="ts">
import { profits, profitByIndex, targetPriceByIndex } from "@/store";
import { QUOTE_CURRENCY } from "@/utils/constants";
import { ProfitItemEvent } from "@/utils/model";
import ProfitTableRow from "@/components/ProfitTable/ProfitTableRow.vue";
import ErrorMessage from "@/components/ErrorMessage.vue";
import {
  initProfits,
  addProfitItem,
  editProfitItem,
  removeProfitItem,
  profitsCount,
  maxProfitsCount,
  canAddProfit,
  projectedProfit,
  activeOrderSide,
  firstError,
} from "@/store/index";
import AddIcon from "@/shared/icons/AddIcon/AddIcon.vue";
import { computed, onMounted } from "vue";

const cols = computed(() => ({
  profit: {
    text: "Profit",
    name: "profit",
  },
  targetPrice: {
    text: "Target price",
    name: "targetPrice",
  },
  amountToSell: {
    text: `Amount to ${activeOrderSide.value === "buy" ? "sell" : "buy"}`,
    name: "amountToSell",
  },
}));

onMounted(() => {
  initProfits();
});

function editAndRecalc(i: number, { name, payload }: ProfitItemEvent): void {
  editProfitItem(i, { name, payload });
  if (name === "profit") {
    editProfitItem(i, { name: "targetPrice", payload: targetPriceByIndex(i) });
  }

  if (name === "targetPrice") {
    editProfitItem(i, { name: "profit", payload: profitByIndex(i) });
  }
}
</script>

<template>
  <div>
    <table class="w-full table-fixed">
      <thead>
        <tr>
          <th class="w-1/6 pb-4 text-left text-xs font-normal text-base-600">
            {{ cols.profit.text }}
          </th>
          <th class="w-3/6 pb-4 text-left text-xs font-normal text-base-600">
            {{ cols.targetPrice.text }}
          </th>
          <th class="w-2/6 pb-4 text-left text-xs font-normal text-base-600">
            {{ cols.amountToSell.text }}
          </th>
        </tr>
      </thead>
      <tbody>
        <ProfitTableRow
          :targetPrice="item.targetPrice"
          :profit="item.profit"
          :amountToSell="item.amountToSell"
          @remove:profitItem="removeProfitItem(i)"
          @update:profitItem="editAndRecalc(i, $event)"
          v-for="(item, i) in profits"
          :key="JSON.stringify({ item, i })"
          :hasError="i === firstError?.index"
        />
      </tbody>
    </table>

    <ErrorMessage v-if="firstError" class="mt-3">
      {{ firstError?.text }}
    </ErrorMessage>

    <button
      type="button"
      class="mt-4 flex items-center gap-2 text-xs text-eastern-blue-600"
      v-if="canAddProfit"
      @click="addProfitItem"
    >
      <AddIcon />
      {{ `Add profit target ${profitsCount}/${maxProfitsCount}` }}
    </button>

    <div class="mt-4 flex justify-between gap-1 text-sm">
      <span class="text-base-600"> Projected profit </span>
      <span class="flex-grow border-b border-dashed border-b-base-500"></span>
      <span>
        {{ projectedProfit }}
        <span class="text-base-600">
          {{ QUOTE_CURRENCY }}
        </span>
      </span>
    </div>
  </div>
</template>
