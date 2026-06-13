import { createSelector } from '@reduxjs/toolkit';

import { 
  selectFoods, 
  selectVisibleFoods 
} from '../foods/foodsSelectors';

import type { Food } from '../types';

export const selectTotalFoods = createSelector(
  [selectVisibleFoods],
  foods => foods.length
);

export const selectTotalQuantity = createSelector(
  [selectVisibleFoods],
  foods => foods.reduce(
    (total, food) => total + food.quantity,
    0
  )
);

export const selectExpiringTodayCount = createSelector(
  [selectVisibleFoods],
  foods => {
    const today = new Date();
    today.setHours(0, 0, 0, 0);

    return foods.filter(food => {
      const expiry = new Date(food.expiryDate);
      expiry.setHours(0, 0, 0, 0);

      return expiry.getTime() === today.getTime();
    }).length;
  }
);

export const selectExpiringSoonCount = createSelector(
  [selectVisibleFoods],
  foods => {
    const today = new Date();
    today.setHours(0, 0, 0, 0);

    return foods.filter(food => {
      const expiry = new Date(food.expiryDate);
      expiry.setHours(0, 0, 0, 0);

      const diff =
        (expiry.getTime() - today.getTime()) /
        (1000 * 60 * 60 * 24);

      return diff >= 0 && diff <= 3;
    }).length;
  }
);

export const selectNextExpiringFood = createSelector(
  [selectFoods],
  foods => {
    if (foods.length === 0) return null;

    return [...foods].sort(
      (a, b) => new Date(a.expiryDate).getTime() - new Date(b.expiryDate).getTime()
    )[0];
  }
);

export const selectOldestFoodDate = createSelector(
  [selectNextExpiringFood],
  oldestFood => {
    if(! oldestFood) 
      return null;
    return new Date(oldestFood.expiryDate);
  }
);

export const isExpiringSoon = (food: Food) => {
  const today = new Date();
  today.setHours(0, 0, 0, 0);

  const expiry = new Date(food.expiryDate);
  expiry.setHours(0, 0, 0, 0);

  const diff =
    (expiry.getTime() - today.getTime()) /
    (1000 * 60 * 60 * 24);

  return diff >= 0 && diff <= 3;
};

export const selectExpiringSoonFoods = createSelector(
  [selectFoods],
  foods => foods.filter(isExpiringSoon)
);

export const selectExpiringSoonSummary = createSelector(
  [selectFoods, selectExpiringSoonFoods],
  (foods, soonFoods) => ({
    percentage:
      foods.length === 0
        ? 0
        : Math.round((soonFoods.length / foods.length) * 100),
    count: soonFoods.length,
    total: foods.length
  })
);