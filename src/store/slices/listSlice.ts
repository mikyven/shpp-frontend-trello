import { createAsyncThunk, createSlice, PayloadAction } from '@reduxjs/toolkit';
import api from '../../api/request';
import { updateBoard } from './boardSlice';
import { TCard, TList, MoveRequestCard, PostRequestCard } from '../../common/types/types';

export interface ListState {
  curCard: TCard | null;
  isDropped: boolean;
  originalCards: MoveRequestCard[];
}

const initialState: ListState = {
  curCard: null,
  isDropped: false,
  originalCards: [],
};

export const createNewList = createAsyncThunk(
  'list/createNewList',
  async (data: { id: string; title: string; position: number }, thunkAPI) => {
    const { id, title, position } = data;
    await api.post(`/board/${id}/list`, { title, position });
    thunkAPI.dispatch(updateBoard(id));
  }
);

export const editListData = createAsyncThunk(
  'list/editListData',
  async (data: { boardId: string; listId: number; obj: Partial<TList> }, thunkAPI) => {
    const { boardId, listId, obj } = data;
    await api.put(`/board/${boardId}/list/${listId}`, obj);
    thunkAPI.dispatch(updateBoard(boardId));
  }
);

export const deleteList = createAsyncThunk(
  'list/deleteList',
  async (data: { boardId: string; listId: number; movedLists: { id: number; position: number }[] }, thunkAPI) => {
    const { boardId, listId, movedLists } = data;
    await api.delete(`/board/${boardId}/list/${listId}`);
    await api.put(`/board/${boardId}/list`, movedLists);
    thunkAPI.dispatch(updateBoard(boardId));
  }
);

export const createNewCard = createAsyncThunk(
  'list/createNewCard',
  async (data: { boardId: string; card: PostRequestCard }, thunkAPI) => {
    const { boardId, card } = data;
    await api.post(`/board/${boardId}/card`, card);
    thunkAPI.dispatch(updateBoard(boardId));
  }
);

export const DnDMoveCard = createAsyncThunk(
  'list/moveCard',
  async (data: { boardId: string; cards: MoveRequestCard[] }, thunkAPI) => {
    const { boardId, cards } = data;
    await api.put(`/board/${boardId}/card`, cards);
    thunkAPI.dispatch(updateBoard(boardId));
  }
);

export const listSlice = createSlice({
  name: 'list',
  initialState,
  reducers: {
    setCurCard: (state, action: PayloadAction<TCard>) => {
      state.curCard = action.payload;
    },
    setIsDropped: (state, action: PayloadAction<boolean>) => {
      state.isDropped = action.payload;
    },
    setOriginalCards: (state, action: PayloadAction<MoveRequestCard[]>) => {
      state.originalCards = action.payload;
    },
    resetData: (state) => {
      state.curCard = null;
      state.isDropped = false;
      state.originalCards = [];
    },
  },
});

export const { setCurCard, setIsDropped, setOriginalCards, resetData } = listSlice.actions;

export default listSlice.reducer;
