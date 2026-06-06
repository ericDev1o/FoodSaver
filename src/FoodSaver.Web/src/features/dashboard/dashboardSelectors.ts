import { createSelector } from '@reduxjs/toolkit';

import { selectVisibleFoods } from '../foods/foodsSelectors';

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

export const selectNextExpiryFood = createSelector(
  [selectVisibleFoods],
  foods => {
    if (foods.length === 0) {
      return null;
    }

    return [...foods].sort(
      (a, b) =>
        a.expiryDate.localeCompare(
          b.expiryDate
        )
    )[0];
  }
);