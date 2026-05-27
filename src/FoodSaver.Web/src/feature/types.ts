export type Food = {
  id: string;
  name: string;
  expiryDate: string;
  isConsumed: boolean;
  quantity: number;
};

export type CreateFoodRequest = {
  name: string;
  expiryDate: string; // ISO 8601 date (yyyy-mm-dd)
  quantity: number;
};

export type UndoAction = {
  foodId: string;
  previousQuantity: number;
  previousIsConsumed: boolean;
};