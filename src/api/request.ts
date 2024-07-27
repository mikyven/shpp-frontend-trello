import axios, { AxiosError } from 'axios';
import { api } from '../common/constants';

const instance = axios.create({
  baseURL: api.baseURL,
  headers: {
    'Content-Type': 'application/json',
    Authorization: `Bearer ${localStorage.getItem('token')}`,
  },
});

type RefreshResponse = { result: string; token: string; refreshToken: string } | undefined;

export const updateToken = (): void => {
  instance.defaults.headers.Authorization = `Bearer ${localStorage.getItem('token')}`;
};

export async function refreshToken(): Promise<void> {
  try {
    const response: RefreshResponse = await instance.post('/refresh', {
      refreshToken: localStorage.getItem('refreshToken'),
    });
    if (response && response.result === 'Authorized') {
      localStorage.setItem('token', response.token);
      localStorage.setItem('refreshToken', response.refreshToken);
    }
  } catch (error) {
    throw error as AxiosError;
  }
}

instance.interceptors.request.use((request) => {
  if (['/login', '/user'].includes(request.url || '')) {
    const updatedRequest = { ...request };
    updatedRequest.headers.Authorization = null;
    return updatedRequest;
  }
  return request;
});

instance.interceptors.response.use((res) => res.data);

export default instance;
