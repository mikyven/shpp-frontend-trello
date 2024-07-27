import { Middleware } from '@reduxjs/toolkit';
import { addRequestStatus, updateBoard } from './slices/boardSlice';

// eslint-disable-next-line @typescript-eslint/no-explicit-any
export const middleware: Middleware<any, any, any> =
  ({ dispatch }) =>
  (next) =>
  (action) => {
    type LazyActionType = {
      type: string;
      meta: { arg: { boardId?: string; boardIds?: string[] }; requestStatus: string };
    };
    const lazyAction = action as LazyActionType;

    if (lazyAction.meta) {
      dispatch(addRequestStatus(lazyAction.type));
      if (
        lazyAction.meta.requestStatus === 'fulfilled' &&
        !['getBoardData', 'getBoards', 'updateBoard', 'deleteBoard', 'loginUser', 'registerUser'].includes(
          lazyAction.type.split('/')[1]
        )
      ) {
        const boardId = lazyAction.meta.arg.boardId as string;
        const boardIds = lazyAction.meta.arg.boardIds as string[] | undefined;
        dispatch(updateBoard(boardIds ? boardIds[0] : boardId));
      }
    }

    return next(action);
  };
