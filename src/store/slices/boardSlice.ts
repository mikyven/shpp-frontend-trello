import { PayloadAction, createAsyncThunk, createSlice } from '@reduxjs/toolkit';
import { TBoard, HomeBoard } from '../../common/types/types';
import api from '../../api/request';

export interface BoardState {
  board: TBoard | null;
  boards: HomeBoard[];
  currentRequests: Record<string, string>;
}

const initialState: BoardState = {
  board: null,
  boards: [],
  currentRequests: {},
};

export const createNewBoard = createAsyncThunk(
  'board/createNewBoard',
  async ({ title, background }: Record<string, string>) => api.post(`/board`, { title, custom: { background } })
);

const fetchBoard = async (boardId: string): Promise<TBoard> => api.get(`/board/${boardId}`) as unknown as TBoard;

export const updateBoard = createAsyncThunk('board/updateBoard', fetchBoard);
export const getBoardData = createAsyncThunk('board/getBoardData', fetchBoard);

export const getBoards = createAsyncThunk(
  'board/getBoards',
  async () => ((await api.get('/board')) as unknown as { boards: HomeBoard[] }).boards
);

export const editBoardData = createAsyncThunk(
  'board/editBoardData',
  async ({ boardId, obj }: { boardId: string; obj: Partial<TBoard> }) => api.put(`/board/${boardId}`, obj)
);

export const deleteBoard = createAsyncThunk('board/deleteBoard', async (boardId: string) =>
  api.delete(`/board/${boardId}`)
);

export const boardSlice = createSlice({
  name: 'board',
  initialState,
  reducers: {
    addRequestStatus: (state, action: PayloadAction<string>) => {
      state.currentRequests = {
        ...state.currentRequests,
        [action.payload.slice(0, action.payload.lastIndexOf('/'))]: action.payload.split('/')[2],
      };
    },
    clearRequests: (state) => {
      state.currentRequests = {};
    },
  },
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

export const { addRequestStatus, clearRequests } = boardSlice.actions;

export default boardSlice.reducer;
