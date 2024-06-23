import { configureStore } from '@reduxjs/toolkit';
import cardModalReducer from './slices/cardModalSlice';
import boardReducer from './slices/boardSlice';
import selectReducer from './slices/selectSlice';

export const store = configureStore({
  reducer: { cardModal: cardModalReducer, board: boardReducer, select: selectReducer },
});

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;
