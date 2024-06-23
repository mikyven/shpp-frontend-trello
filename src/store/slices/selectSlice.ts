import { PayloadAction, createSlice } from '@reduxjs/toolkit';
import { IList } from '../../common/interfaces/IList';
import { IBoard } from './boardSlice';
import { RequestCard } from '../../common/interfaces/ICard';

export interface SelectState {
  board: IBoard | null;
  list: IList | null;
  position: number | null;
  cardsToBeUpdated: RequestCard[];
}

const initialState: SelectState = {
  board: null,
  list: null,
  position: null,
  cardsToBeUpdated: [],
};

export const selectState = createSlice({
  name: 'select',
  initialState,
  reducers: {
    changeCurBoard: (state, action: PayloadAction<IBoard>) => {
      state.board = action.payload;
    },
    changeCurList: (state, action: PayloadAction<IList>) => {
      state.list = action.payload;
    },
    changeCurPosition: (state, action: PayloadAction<number>) => {
      state.position = action.payload;
    },
    changeCardsToBeUpdated: (state, action: PayloadAction<SelectState['cardsToBeUpdated']>) => {
      state.cardsToBeUpdated = action.payload;
    },
    resetSelectedData: (state) => {
      state.board = null;
      state.list = null;
      state.position = null;
      state.cardsToBeUpdated = [];
    },
  },
});

export const { changeCurBoard, changeCurList, changeCurPosition, changeCardsToBeUpdated, resetSelectedData } =
  selectState.actions;

export default selectState.reducer;
