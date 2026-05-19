export type Food = {
  id: string;
  name: string;
  expiryDate: string;
  isConsumed: boolean;
  quantity: number;
};

export type CreateFoodRequest = {
  name: string;
  expiryDate: string;
  quantity: number;
};