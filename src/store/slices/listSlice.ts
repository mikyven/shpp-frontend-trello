import { createAsyncThunk, createSlice, PayloadAction } from '@reduxjs/toolkit';
import api from '../../api/request';
import { TCard, TList, MoveRequestCard, PostRequestCard } from '../../common/types/types';

export interface ListState {
  currentCard: TCard | null;
  isDropped: boolean;
  originalCards: MoveRequestCard[];
}

const initialState: ListState = {
  currentCard: null,
  isDropped: false,
  originalCards: [],
};

type CreateListData = {
  boardId: string;
  title: string;
  position: number;
};
type EditListData = {
  boardId: string;
  listId: number;
  obj: Partial<TList>;
};
type DeleteListData = {
  boardId: string;
  listId: number;
  movedLists: { id: number; position: number }[];
};
type CreateCardData = {
  boardId: string;
  card: PostRequestCard;
};
type MoveCardData = {
  boardId: string;
  cards: MoveRequestCard[];
};

export const createNewList = createAsyncThunk(
  'list/createNewList',
  async ({ boardId, title, position }: CreateListData) => api.post(`/board/${boardId}/list`, { title, position })
);

export const editList = createAsyncThunk('list/editList', async ({ boardId, listId, obj }: EditListData) =>
  api.put(`/board/${boardId}/list/${listId}`, obj)
);

export const deleteList = createAsyncThunk(
  'list/deleteList',
  async ({ boardId, listId, movedLists }: DeleteListData) => {
    await api.delete(`/board/${boardId}/list/${listId}`);
    await api.put(`/board/${boardId}/list`, movedLists);
  }
);

export const createNewCard = createAsyncThunk('list/createNewCard', async ({ boardId, card }: CreateCardData) =>
  api.post(`/board/${boardId}/card`, card)
);

export const DnDMoveCard = createAsyncThunk('list/moveCard', async ({ boardId, cards }: MoveCardData) =>
  api.put(`/board/${boardId}/card`, cards)
);

export const listSlice = createSlice({
  name: 'list',
  initialState,
  reducers: {
    setCurCard: (state, action: PayloadAction<TCard>) => {
      state.currentCard = action.payload;
    },
    setIsDropped: (state, action: PayloadAction<boolean>) => {
      state.isDropped = action.payload;
    },
    setOriginalCards: (state, action: PayloadAction<MoveRequestCard[]>) => {
      state.originalCards = action.payload;
    },
    resetData: (state) => {
      state.currentCard = null;
      state.isDropped = false;
      state.originalCards = [];
    },
  },
});

export const { setCurCard, setIsDropped, setOriginalCards, resetData } = listSlice.actions;

export default listSlice.reducer;
