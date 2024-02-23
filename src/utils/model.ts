export type OrderSide = "buy" | "sell";

export interface ProfitTableItem {
  profit: number;
  targetPrice: number;
  amountToSell: number;
}

export interface ProfitItemEvent {
  name: keyof ProfitTableItem;
  payload: number;
}
