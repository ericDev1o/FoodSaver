import { 
    type PayloadAction,
    createSlice
} from '@reduxjs/toolkit';

import type { 
    Food, 
    UndoAction 
} from '../types';

export type FoodsFilter = 'allFresh' | 'expiringSoon' | 'expiringToday';

export type FoodsSort = 'expiryAsc' | 'nameAsc' | 'nameDesc';

export type FoodsState = {
    foods: Food[];
    searchQuery: string;
    filter: FoodsFilter;
    sort: FoodsSort;
    undoAction: UndoAction | null;
}

const initialState: FoodsState = { 
    foods: [],
    searchQuery: '',
    filter: 'allFresh',
    sort: 'expiryAsc',
    undoAction: null 
};

export const foodsSlice = createSlice({
    name: 'foods',
    initialState,
    reducers: {
        setSearchQuery: (state, action: PayloadAction<string>) => {
            state.searchQuery = action.payload;
        },
        setFilterType: (state, action: PayloadAction<FoodsState["filter"]>) => {
            state.filter = action.payload;
        },
        setSortType: (state, action: PayloadAction<FoodsState["sort"]>) => {
            state.sort = action.payload;
        },
        addFood: (state, action: PayloadAction<Food>) => {
            state.foods.push(action.payload);
        },
        consumeFood: (state, action: PayloadAction<{ id: string; qty: number }>) => {
            const food = state.foods.find(f => f.id === action.payload.id);
            if (!food) return;

            state.undoAction = {
                foodId: action.payload.id,
                previousQuantity: food.quantity,
                qty: action.payload.qty
            };
        },
        undoFoodAction: (state) => {
            state.undoAction = null;
        },
        confirmFoodAction: (state) => {
            const undoAction = state.undoAction;

            if (! undoAction) return;

            state.foods = state.foods
                .map(f =>
                f.id === undoAction.foodId
                    ? { ...f, quantity: Math.max(0, f.quantity - undoAction.qty) }
                    : f
                )
                .filter(f => f.quantity > 0);

            state.undoAction = null;
        }
    }
});

export const { 
    setSearchQuery,
    setFilterType,
    setSortType,
    addFood,
    consumeFood,
    undoFoodAction,
    confirmFoodAction
} = foodsSlice.actions;

export default foodsSlice.reducer;