<script setup lang="ts">
import InfoIcon from "@/shared/icons/InfoIcon/InfoIcon.vue";
import CheckboxInput from "@/shared/components/CheckboxInput/CheckboxInput.vue";
import ProfitTable from "@/components/ProfitTable/ProfitTable.vue";
import { areProfitsInOrder, addProfitsToOrder } from "@/store";
</script>

<template>
  <div class="bg-base-100 p-3">
    <header>
      <CheckboxInput
        :justifyBetween="true"
        :modelValue="areProfitsInOrder"
        @update:modelValue="addProfitsToOrder"
      >
        <div class="flex items-center justify-between">
          <h6 class="flex items-center gap-2">
            <InfoIcon class="w-4" />
            Take Profit
          </h6>
        </div>
      </CheckboxInput>
    </header>

    <div class="mt-4" v-if="areProfitsInOrder">
      <ProfitTable />
    </div>
  </div>
</template>
