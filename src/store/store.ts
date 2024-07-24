import { configureStore } from '@reduxjs/toolkit';
import cardModalReducer from './slices/cardModalSlice';
import boardReducer from './slices/boardSlice';
import listReducer from './slices/listSlice';
import authReducer from './slices/authSlice';
import { middleware } from './middleware';

export const store = configureStore({
  reducer: { cardModal: cardModalReducer, board: boardReducer, list: listReducer, auth: authReducer },
  middleware: (getDefaultMiddleware) => getDefaultMiddleware().concat(middleware),
});

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;
