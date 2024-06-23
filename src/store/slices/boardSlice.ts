import { createAsyncThunk, createSlice, PayloadAction } from '@reduxjs/toolkit';
import { IList } from '../../common/interfaces/IList';
import api from '../../api/request';
import { ICard, RequestCard } from '../../common/interfaces/ICard';

export interface IBoard {
  id: number;
  title: string;
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  custom: Record<any, any>;
  lists: IList[];
}

export interface IHomeBoard {
  id: number;
  title: string;
  custom: Record<string, unknown>;
}

export interface BoardState {
  board: IBoard | null;
  boards: IHomeBoard[];
  lists: IList[];
  originalCards: RequestCard[];
  curCard: ICard | null;
  isDropped: boolean;
}

const initialState: BoardState = {
  board: null,
  boards: [],
  lists: [],
  originalCards: [],
  curCard: null,
  isDropped: false,
};

export const boardSlice = createSlice({
  name: 'board',
  initialState,
  reducers: {
    setBoard: (state, action: PayloadAction<IBoard>) => {
      state.board = action.payload;
    },
    setBoards: (state, action: PayloadAction<IHomeBoard[]>) => {
      state.boards = action.payload;
    },
    setLists: (state, action: PayloadAction<IList[]>) => {
      state.lists = action.payload;
    },
    setOriginalCards: (state, action: PayloadAction<RequestCard[]>) => {
      state.originalCards = action.payload;
    },
    setCurCard: (state, action: PayloadAction<ICard>) => {
      state.curCard = action.payload;
    },
    setIsDropped: (state, action: PayloadAction<boolean>) => {
      state.isDropped = action.payload;
    },
  },
});

export const { setBoard, setBoards, setLists, setOriginalCards, setCurCard, setIsDropped } = boardSlice.actions;

export const getBoard = createAsyncThunk('board/getBoard', async (data: { id: string }, thunkAPI) => {
  const { id } = data;
  const board: IBoard = await api.get(`/board/${id}`);
  thunkAPI.dispatch(setBoard(board));
  thunkAPI.dispatch(setLists(board.lists));
  return board;
});

export const getBoardData = createAsyncThunk('board/getBoardData', async (data: { id: string }) => {
  const { id } = data;
  const board: IBoard = await api.get(`/board/${id}`);
  return board;
});

export const getBoards = createAsyncThunk('board/getBoards', async (_, thunkAPI) => {
  const { boards }: { boards: IHomeBoard[] } = await api.get('/board');
  thunkAPI.dispatch(setBoards(boards));
  return boards;
});

export default boardSlice.reducer;
