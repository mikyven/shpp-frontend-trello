import { createAsyncThunk, createSlice, PayloadAction } from '@reduxjs/toolkit';
import api from '../../api/request';
import { updateBoard } from './boardSlice';
import { TCard, MoveRequestCard } from '../../common/types/types';

export interface CardModalState {
  isModalOpen: boolean;
  data: (TCard & { list: { id: number; title: string } }) | null;
}

const initialState: CardModalState = {
  isModalOpen: false,
  data: null,
};

export const changeCardValues = createAsyncThunk(
  'cardModal/changeValues',
  async (
    data: {
      boardId: string;
      cardId: number;
      listId: number;
      changedValue: Partial<TCard>;
    },
    thunkAPI
  ) => {
    const { boardId, cardId, listId, changedValue } = data;
    await api.put(`/board/${boardId}/card/${cardId}`, { list_id: listId, ...changedValue });
    thunkAPI.dispatch(updateBoard(boardId));
    return changedValue;
  }
);

export const deleteCard = createAsyncThunk(
  'cardModal/deleteCard',
  async (data: { boardId: string; cardId: number; movedCards: MoveRequestCard[] }, thunkAPI) => {
    const { boardId, cardId, movedCards } = data;
    await api.delete(`/board/${boardId}/card/${cardId}`);
    await api.put(`/board/${data.boardId}/card`, movedCards);
    thunkAPI.dispatch(updateBoard(boardId));
  }
);

export const moveCard = createAsyncThunk(
  'cardModal/moveCard',
  async (
    data: {
      boardIds: string[];
      cardId: string;
      listId: string;
      position: number;
      cards?: MoveRequestCard[];
      card?: CardModalState['data'];
    },
    thunkAPI
  ) => {
    const { boardIds, cardId, listId, position, cards, card } = data;

    if (boardIds.length === 1) {
      const cardsArr = [...(cards || []), { id: +cardId, position, list_id: +listId }];
      await api.put(`/board/${boardIds[0]}/card`, cardsArr);
      thunkAPI.dispatch(updateBoard(boardIds[0]));
    } else if (boardIds.length > 1 && card) {
      const oldCards = cards?.filter((i) => i.list_id !== +listId);
      await api.delete(`/board/${boardIds[0]}/card/${cardId}`);
      await api.put(`/board/${boardIds[0]}/card`, oldCards);
      await api.post(`/board/${boardIds[1]}/card`, {
        title: card.title,
        position,
        list_id: +listId,
        description: card.description,
      });
      thunkAPI.dispatch(updateBoard(boardIds[0]));
      return true;
    }
    return false;
  }
);

export const cardModalSlice = createSlice({
  name: 'cardModal',
  initialState,
  reducers: {
    changeModalVisibility: (state, action: PayloadAction<boolean>) => {
      state.isModalOpen = action.payload;
    },
    changeCardData: (state, action: PayloadAction<CardModalState['data'] | null>) => {
      state.data = action.payload;
    },
  },
  extraReducers: (builder) => {
    builder.addCase(changeCardValues.fulfilled, (state, action) => {
      if (state.data) state.data = { ...state.data, ...action.payload };
    });
    builder.addCase(deleteCard.fulfilled, (state) => {
      state.isModalOpen = false;
    });
    builder.addCase(moveCard.fulfilled, (state, action) => {
      if (action.payload) state.isModalOpen = false;
    });
  },
});

export const { changeModalVisibility, changeCardData } = cardModalSlice.actions;

export default cardModalSlice.reducer;
