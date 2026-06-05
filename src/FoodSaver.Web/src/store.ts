import { configureStore } from '@reduxjs/toolkit';

import searchReducer from './features/search/searchSlice';

export const foodSaverStore = configureStore({
    reducer: {
        search: searchReducer
    }
});

export type RootState = ReturnType<
    typeof foodSaverStore.getState
>;

export type AppDispatch =
    typeof foodSaverStore.dispatch;