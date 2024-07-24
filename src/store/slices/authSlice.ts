import { createAsyncThunk, createSlice } from '@reduxjs/toolkit';
import api, { updateToken } from '../../api/request';

export const loginUser = createAsyncThunk('auth/loginUser', async (user: { email: string; password: string }) => {
  const response = await api.post('/login', user);
  if (!response) throw new Error();
  return response;
});

export const registerUser = createAsyncThunk(
  'auth/registerUser',
  async (user: { email: string; password: string }, thunkAPI) => {
    const response: { result: string } = await api.post('/user', user);
    if (response.result === 'Created') {
      thunkAPI.dispatch(loginUser(user));
    } else {
      throw new Error();
    }
  }
);

export const authSlice = createSlice({
  name: 'auth',
  initialState: {},
  reducers: {},
  extraReducers: (builder) => {
    builder.addCase(loginUser.fulfilled, (_, action) => {
      const payload = action.payload as unknown as { token: string; refreshToken: string };
      localStorage.setItem('token', payload.token);
      localStorage.setItem('refreshToken', payload.refreshToken);
      updateToken();
    });
  },
});

export default authSlice.reducer;
