import { createAsyncThunk, createSlice, PayloadAction } from '@reduxjs/toolkit';
import { ICard, RequestCard } from '../../common/interfaces/ICard';
import api from '../../api/request';
import { getBoard } from './boardSlice';

export interface CardModalState {
  isMounted: boolean;
  data: (ICard & { list: { id: number; title: string } }) | null;
}

const initialState: CardModalState = {
  isMounted: false,
  data: null,
};

type CardEditData = {
  title: string;
  boardId: string;
  cardId: number | string;
  listId: number;
  description: string;
};

export const cardModalSlice = createSlice({
  name: 'cardModal',
  initialState,
  reducers: {
    changeVisibility: (state, action: PayloadAction<boolean>) => {
      state.isMounted = action.payload;
    },
    changeCardData: (state, action: PayloadAction<CardModalState['data'] | null>) => {
      state.data = action.payload;
    },
  },
});

export const { changeVisibility, changeCardData } = cardModalSlice.actions;

export const changeCardTitle = createAsyncThunk(
  'cardModal/changeTitle',
  async (data: Omit<CardEditData, 'description'>, thunkAPI) => {
    const { title, boardId, cardId, listId } = data;
    await api.put(`/board/${boardId}/card/${cardId}`, { title, list_id: listId });
    const state = (thunkAPI.getState() as { cardModal: CardModalState }).cardModal.data;
    if (state) thunkAPI.dispatch(changeCardData({ ...state, title }));
  }
);

export const changeCardDescription = createAsyncThunk(
  'cardModal/changeDescription',
  async (data: Omit<CardEditData, 'title'>, thunkAPI) => {
    const { description, boardId, cardId, listId } = data;
    await api.put(`/board/${boardId}/card/${cardId}`, { description, list_id: listId });
    const state = (thunkAPI.getState() as { cardModal: CardModalState }).cardModal.data;
    if (state) thunkAPI.dispatch(changeCardData({ ...state, description }));
  }
);

export const deleteCard = createAsyncThunk(
  'cardModal/deleteCard',
  async (data: { boardId: string; cardId: number }) => {
    const { boardId, cardId } = data;
    await api.delete(`/board/${boardId}/card/${cardId}`);
  }
);

export const moveCard = createAsyncThunk(
  'cardModal/moveCard',
  async (
    data: {
      boardId: string[];
      cardId: string;
      listId: string;
      position: number;
      cards?: RequestCard[];
      card?: CardModalState['data'];
    },
    thunkAPI
  ) => {
    const { boardId, cardId, listId, position, cards, card } = data;

    if (boardId.length === 1) {
      const cardsArr = [...(cards || []), { id: +cardId, position, list_id: +listId }];
      await api.put(`/board/${boardId}/card`, cardsArr).then(() => {
        thunkAPI.dispatch(getBoard({ id: boardId[0] }));
      });
    } else if (card) {
      const oldCards = cards?.filter((i) => i.list_id !== +listId);
      await api.delete(`/board/${boardId[0]}/card/${cardId}`);
      await api.put(`/board/${boardId[0]}/card`, oldCards);
      await api
        .post(`/board/${boardId[1]}/card`, {
          title: card.title,
          position: card.position,
          list_id: +listId,
          description: card.description,
        })
        .then(() => {
          thunkAPI.dispatch(getBoard({ id: boardId[0] }));
          thunkAPI.dispatch(changeVisibility(false));
          thunkAPI.dispatch(changeCardData(null));
        });
    }
  }
);

export default cardModalSlice.reducer;
