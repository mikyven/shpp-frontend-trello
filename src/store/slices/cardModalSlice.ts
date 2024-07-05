import { createAsyncThunk, createSlice, PayloadAction } from '@reduxjs/toolkit';
import api from '../../api/request';
import { TCard, MoveRequestCard } from '../../common/types/types';

export interface CardModalState {
  isModalOpen: boolean;
  data: (TCard & { list: { id: number; title: string } }) | null;
}

const initialState: CardModalState = {
  isModalOpen: false,
  data: null,
};

type ChangeValuesData = {
  boardId: string;
  cardId: number;
  listId: number;
  changedValue: Partial<TCard>;
};

type DeleteData = {
  boardId: string;
  cardId: number;
  movedCards: MoveRequestCard[];
};

type MoveData = {
  boardIds: string[];
  cardId: string;
  listId: string;
  position: number;
  cards?: MoveRequestCard[];
  card?: CardModalState['data'];
};

export const changeCardValues = createAsyncThunk(
  'cardModal/changeValues',
  async ({ boardId, cardId, listId, changedValue }: ChangeValuesData) => {
    await api.put(`/board/${boardId}/card/${cardId}`, { list_id: listId, ...changedValue });
    return changedValue;
  }
);

export const deleteCard = createAsyncThunk(
  'cardModal/deleteCard',
  async ({ boardId, cardId, movedCards }: DeleteData) => {
    await api.delete(`/board/${boardId}/card/${cardId}`);
    await api.put(`/board/${boardId}/card`, movedCards);
  }
);

export const moveCard = createAsyncThunk(
  'cardModal/moveCard',
  async ({ boardIds, cardId, listId, position, cards, card }: MoveData) => {
    if (boardIds.length === 1) {
      await api.put(`/board/${boardIds[0]}/card`, cards?.concat({ id: +cardId, position, list_id: +listId }));
    } else if (boardIds.length > 1 && card) {
      const oldListCards = cards?.filter((i) => i.list_id !== +listId);
      await api.delete(`/board/${boardIds[0]}/card/${cardId}`);
      await api.put(`/board/${boardIds[0]}/card`, oldListCards);
      await api.post(`/board/${boardIds[1]}/card`, {
        title: card.title,
        position,
        list_id: +listId,
        description: card.description,
      });
      return false;
    }
    return true;
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
      state.isModalOpen = action.payload;
    });
  },
});

export const { changeModalVisibility, changeCardData } = cardModalSlice.actions;

export default cardModalSlice.reducer;
