import { configureStore } from '@reduxjs/toolkit';

import searchReducer from './features/foods/foodsSlice';

export const foodSaverStore = configureStore({
    reducer: {
        foods: searchReducer
    }
});

export type RootState = ReturnType<
    typeof foodSaverStore.getState
>;

export type AppDispatch =
    typeof foodSaverStore.dispatch;