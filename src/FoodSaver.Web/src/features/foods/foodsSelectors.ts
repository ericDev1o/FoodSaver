import { createSelector } from '@reduxjs/toolkit';

import type { RootState } from '../../store';
import type { Food } from '../types';

export const selectFoods = (state: RootState) => state.foods.foods;
export const selectSearchQuery = (state: RootState) => state.foods.searchQuery;
export const selectFilter = (state: RootState) => state.foods.filter;
export const selectSort = (state: RootState) => state.foods.sort;
export const selectUndoAction = (state: RootState) => state.foods.undoAction;

export const selectVisibleFoods = createSelector(
  [selectFoods, selectSearchQuery, selectFilter, selectSort],
  (foods, searchQuery, filter, sort) => {
    const today = normalizeDate(new Date());

    let result = foods.filter(f =>
      f.name.toLowerCase().startsWith(searchQuery.toLowerCase())
    );

    switch (filter) {
      case 'expiringToday':
        result = result.filter(f =>
          isToday(normalizeDate(f.expiryDate), today)
        );
        break;

      case 'expiringSoon':
        result = result.filter(f =>
          isExpiringSoon(normalizeDate(f.expiryDate), today)
        );
        break;

      case 'lowStock':
        result = result.filter(isLowStock);
        break;
    }

    switch (sort) {
      case 'nameAsc':
        return [...result].sort((a, b) => a.name.localeCompare(b.name));

      case 'nameDesc':
        return [...result].sort((a, b) => b.name.localeCompare(a.name));

      case 'expiryAsc':
      default:
        return [...result].sort(
          (a, b) => a.expiryDate.localeCompare(b.expiryDate)
        );
    } 
  }
);

export const selectLowStockFoods = createSelector(
  [selectFoods],
  foods => foods.filter(isLowStock)
);

function isLowStock(food: Food): boolean { 
  return food.quantity === 1; 
}

function normalizeDate(date: string | Date): Date {
  const d = new Date(date);
  d.setHours(0, 0, 0, 0);
  return d;
};

function isToday(expiry: Date, today: Date): boolean {
  return expiry.getTime() === today.getTime();
}

function isExpiringSoon(expiry: Date, today: Date): boolean {
  const diff = (expiry.getTime() - today.getTime()) / (1000 * 60 * 60 * 24);
  return diff >= 0 && diff <= 3;
};