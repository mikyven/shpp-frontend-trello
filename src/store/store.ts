import { configureStore } from '@reduxjs/toolkit';
import cardModalReducer from './slices/cardModalSlice';
import boardReducer from './slices/boardSlice';
import listReducer from './slices/listSlice';

export const store = configureStore({
  reducer: { cardModal: cardModalReducer, board: boardReducer, list: listReducer },
});

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;
