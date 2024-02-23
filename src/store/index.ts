import { computed, reactive, watch, type ComputedRef } from "vue";
import { OrderSide, ProfitTableItem, ProfitItemEvent } from "@/utils/model";

type ProfitError = {
  index: number | null;
  text: string;
} | null;

interface State {
  activeOrderSide: OrderSide;
  price: number;
  amount: number;
  profitsInOrder: boolean;
  profits: ProfitTableItem[];
  readonly maxProfits: number;
  errors: ProfitError[];
}

const MAX_PROFITS = 5;

// STATE
export const state: State = reactive({
  activeOrderSide: "buy",
  price: 10000,
  amount: 2,
  profitsInOrder: false,
  profits: [],
  maxProfits: MAX_PROFITS,
  errors: [],
});

// GETTERS
export const profits = computed(() => state.profits);
export const activeOrderSide = computed(() => state.activeOrderSide);
export const total = computed(() => state.price * state.amount);
export const price = computed(() => state.price);
export const amount = computed(() => state.amount);
export const areProfitsInOrder = computed(() => state.profitsInOrder);
const nextProfitCols: ComputedRef<ProfitTableItem> = computed(() => {
  if (profits.value.length === 0) {
    return {
      profit: 2,
      targetPrice: Math.round(
        activeOrderSide.value === "buy"
          ? price.value * (1 + 2 / 100)
          : price.value * (1 - 2 / 100),
      ),
      amountToSell: 100,
    };
  }
  const lastProfitValue = profits.value[profits.value.length - 1];
  const profitValue = lastProfitValue.profit + 2;
  return {
    profit: lastProfitValue.profit + 2,
    targetPrice: Math.round(
      activeOrderSide.value === "buy"
        ? price.value * (1 + profitValue / 100)
        : price.value * (1 - profitValue / 100),
    ),
    amountToSell: 20,
  };
});
export const maxProfitsCount = computed(() => state.maxProfits);
export const profitsCount = computed(() => profits.value.length);
export const canAddProfit = computed(
  () => profitsCount.value < state.maxProfits,
);

const maxAmountIndex = computed(() => {
  let max = 0;
  let index = 0;

  profits.value.forEach((profit: ProfitTableItem, i: number) => {
    if (profit.amountToSell > max) {
      max = profit.amountToSell;
      index = i;
    }
  });

  return index;
});

const totalProfitAmounts = computed(() => {
  return profits.value.reduce((acc: number, profit: ProfitTableItem) => {
    return acc + profit.amountToSell;
  }, 0);
});

export const projectedProfit = computed(() => {
  const result = profits.value.reduce(
    (acc: number, profit: ProfitTableItem) => {
      let res = 0;

      if (activeOrderSide.value === "buy") {
        res =
          (profit.targetPrice - price.value) *
          amount.value *
          (profit.amountToSell / 100);
      } else {
        res =
          (price.value - profit.targetPrice) *
          amount.value *
          (profit.amountToSell / 100);
      }

      return acc + res;
    },
    0,
  );

  return Math.round(result);
});

const profitOver500 = computed(() => {
  const hasError =
    profits.value.reduce((acc: number, item: ProfitTableItem) => {
      return acc + item.profit;
    }, 0) > 500;

  if (hasError) {
    return {
      index: null,
      text: "Maximum profit sum is 500%",
    };
  }

  return null;
});

const lowProfit = computed(() => {
  const index = profits.value.findIndex((item) => {
    return item.profit <= 0.01;
  });

  if (index >= 0) {
    return {
      index,
      text: "Minimum value is 0.01%",
    };
  }

  return null;
});

const profitSortOrder = computed(() => {
  const mappedProfits = profits.value.map((item) => item.profit);
  const profitsValsSorted = [...mappedProfits].sort((a, b) => {
    return b - a > 0 ? -1 : 1;
  });
  const hasError =
    JSON.stringify(mappedProfits) !== JSON.stringify(profitsValsSorted);

  if (hasError) {
    return {
      index: null,
      text: "Each target's profit should be greater than the previous one",
    };
  }

  return null;
});

const lowTargetPrice = computed(() => {
  const index = profits.value.findIndex((item) => {
    return item.targetPrice < 0;
  });

  if (index >= 0) {
    return {
      index,
      text: "Price must be greater than 0",
    };
  }

  return null;
});

const amountsSum = computed(() => {
  return profits.value.reduce(
    (acc: number, profit: ProfitTableItem) => acc + profit.amountToSell,
    0,
  );
});

const lowAmounts = computed(() => {
  const hasError = amountsSum.value < 100;

  if (hasError) {
    return {
      index: null,
      text: `${amountsSum.value} out of 100% selected. Please increase by ${100 - amountsSum.value}`,
    };
  }

  return null;
});

const highAmounts = computed(() => {
  const hasError = amountsSum.value > 100;

  if (hasError) {
    return {
      index: null,
      text: `${amountsSum.value} out of 100% selected. Please decrease by ${100 - amountsSum.value}`,
    };
  }

  return null;
});

const errorsArr = computed(() => {
  const rules = [
    profitOver500.value,
    lowProfit.value,
    profitSortOrder.value,
    lowTargetPrice.value,
    lowAmounts.value,
    highAmounts.value,
  ];

  return rules.filter((item) => !!item);
});

export const firstError = computed(() => state.errors[0]);

// WATCHERS
watch(
  () => activeOrderSide.value,
  () => {
    recalcProfits();
  },
);

// METHODS
export function addProfitsToOrder(value: boolean): void {
  state.profitsInOrder = value;
}

export function setOrderSide(side: OrderSide): void {
  state.activeOrderSide = side;
}

export function setPrice(price: number): void {
  const val = price;
  if (isNaN(val)) {
    state.price = 0;
  } else {
    state.price = val;
  }
}
export function setAmount(amount: number): void {
  state.amount = amount;
}
export function setTotal(total: number): void {
  state.amount = state.price > 0 ? total / state.price : 0;
}

export function initProfits() {
  state.profits = [];
  addProfitItem();
}

function recalcProfits() {
  // eslint-disable-next-line no-use-before-define
  // @ts-ignore
  profits.value.forEach((profit, i) => {
    editProfitItem(i, {
      name: "targetPrice",
      payload: targetPriceByIndex(i),
    });
  });
}

export function addProfitItem() {
  state.profits.push(nextProfitCols.value);
  if (totalProfitAmounts.value > 100) {
    const over100Diff = totalProfitAmounts.value - 100;
    editProfitItem(maxAmountIndex.value, {
      name: "amountToSell",
      payload: profits.value[maxAmountIndex.value].amountToSell - over100Diff,
    });
  }
}

export function editProfitItem(index: number, e: ProfitItemEvent) {
  state.profits[index][e.name] = e.payload;
}

export function removeProfitItem(index: number) {
  state.profits.splice(index, 1);
}

export function profitByIndex(index: number): number {
  const profit = profits.value[index];
  let result = 0;

  if (activeOrderSide.value === "buy") {
    result = (profit.targetPrice - price.value) / price.value;
  } else {
    result = (price.value - profit.targetPrice) / price.value;
  }

  return result * 100;
}

export function targetPriceByIndex(index: number): number {
  const profit = profits.value[index];
  let result = 0;

  if (activeOrderSide.value === "buy") {
    result = (profit.profit * price.value) / 100 + price.value;
  } else {
    result = price.value - (profit.profit * price.value) / 100;
  }

  return result;
}

export function validate() {
  state.errors = errorsArr.value;

  if (!state.errors.length) {
    console.log("valid!");
  }
}
