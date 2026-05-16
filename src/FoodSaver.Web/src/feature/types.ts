export type Food = {
  id: string;
  name: string;
  expiryDate: string;
  isConsumed: boolean;
};

export type CreateFoodRequest = {
  name: string;
  expiryDate: string;
};