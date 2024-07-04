import { Middleware } from '@reduxjs/toolkit';
import { setIsLoading } from './slices/boardSlice';

export const middleware: Middleware =
  ({ dispatch }) =>
  (next) =>
  (action) => {
    type LazyActionType = { type: string; meta: { requestStatus: string } };
    const lazyAction = action as LazyActionType;

    if (
      lazyAction.meta &&
      lazyAction.meta.requestStatus === 'pending' &&
      !['getBoards', 'updateBoard'].includes(lazyAction.type.split('/')[1])
    ) {
      dispatch(setIsLoading(true));
    }

    return next(action);
  };
