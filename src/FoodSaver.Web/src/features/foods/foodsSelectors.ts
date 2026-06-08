import { createSelector } from '@reduxjs/toolkit';

import type { RootState } from '../../store';
import type { Food } from '../types';
import type { 
  FoodsFilter, 
  FoodsSort 
} from './foodsSlice';

export const selectFoods = (state: RootState) => state.foods.foods;
export const selectSearchQuery = (state: RootState) => state.foods.searchQuery;
export const selectFilter = (state: RootState) => state.foods.filter;
export const selectSort = (state: RootState) => state.foods.sort;
export const selectUndoAction = (state: RootState) => state.foods.undoAction;

export const selectVisibleFoods = createSelector(
  [selectFoods, selectSearchQuery, selectFilter, selectSort],
  (foods, searchQuery, filter, sort) => {
    const applyFilter = (foods: Food[], filter: FoodsFilter): Food[] => {
      const today = new Date();
      today.setHours(0, 0, 0, 0);

      switch (filter) {
        case 'expiringToday':
          return foods.filter(f => {
            const expiry = new Date(f.expiryDate);
            expiry.setHours(0, 0, 0, 0);
            return (
              expiry.getFullYear() === today.getFullYear() &&
              expiry.getMonth() === today.getMonth() &&
              expiry.getDate() === today.getDate()
            );
          });

        case 'expiringSoon':
          return foods.filter(f => {
            const expiry = new Date(f.expiryDate);
            expiry.setHours(0, 0, 0, 0);
            const diff = (expiry.getTime() - today.getTime()) / (1000 * 60 * 60 * 24);
            return diff >= 0 && diff <= 3; // today and next 3 days
          });

        case 'allFresh':
        default:
          return foods;
      }
    };

    const applySort = (foods: Food[], sort: FoodsSort): Food[] => {
      const sorted = [...foods];

      switch (sort) {
        case 'nameAsc':
          return sorted.sort((a, b) =>
            a.name.localeCompare(b.name)
          );

        case 'nameDesc':
          return sorted.sort((a, b) =>
            b.name.localeCompare(a.name)
          );

        case 'expiryAsc':
        default:
          return sorted.sort((a, b) =>
            a.expiryDate.localeCompare(b.expiryDate)
          );
      }
    };

    const searched = foods.filter((f: { name: string; }): boolean =>
      f.name.toLowerCase().startsWith(searchQuery.toLowerCase())
    );

    return applySort(applyFilter(searched, filter), sort);
  }
);