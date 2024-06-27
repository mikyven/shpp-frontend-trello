import { createAsyncThunk, createSlice } from '@reduxjs/toolkit';
import { TBoard, HomeBoard } from '../../common/types/types';
import api from '../../api/request';

export interface BoardState {
  board: TBoard | null;
  boards: HomeBoard[];
}

const initialState: BoardState = {
  board: null,
  boards: [],
};

export const createNewBoard = createAsyncThunk(
  'board/createNewBoard',
  async (data: { title: string; background: string }) => api.put(`/board`, data)
);

const fetchBoard = async (id: string): Promise<TBoard> => {
  const board: TBoard = await api.get(`/board/${id}`);
  return board;
};

export const updateBoard = createAsyncThunk('board/updateBoard', fetchBoard);
export const getBoardData = createAsyncThunk('board/getBoardData', fetchBoard);

export const getBoards = createAsyncThunk('board/getBoards', async () => {
  const { boards }: { boards: HomeBoard[] } = await api.get('/board');
  return boards;
});

export const editBoardData = createAsyncThunk(
  'board/editBoardData',
  async (data: { id: string; obj: Partial<TBoard> }, thunkAPI) => {
    const { id, obj } = data;
    await api.put(`/board/${id}`, obj);
    thunkAPI.dispatch(updateBoard(id));
  }
);

export const deleteBoard = createAsyncThunk('board/deleteBoard', async (id: string) => api.delete(`/board/${id}`));

export const boardSlice = createSlice({
  name: 'board',
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    builder.addCase(updateBoard.fulfilled, (state, action) => {
      state.board = action.payload;
    });
    builder.addCase(getBoards.fulfilled, (state, action) => {
      state.boards = action.payload;
    });
    builder.addCase(deleteBoard.fulfilled, (state) => {
      state.board = null;
      state.boards = [];
    });
  },
});

export default boardSlice.reducer;
