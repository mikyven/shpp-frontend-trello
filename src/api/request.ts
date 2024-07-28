import axios from 'axios';
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

async function refreshToken(): Promise<void> {
  const storedRefreshToken = localStorage.getItem('refreshToken');
  if (!storedRefreshToken) throw new Error();
  const response: RefreshResponse = await instance.post('/refresh', {
    refreshToken: storedRefreshToken,
  });
  if (response && response.result === 'Authorized') {
    localStorage.setItem('token', response.token);
    localStorage.setItem('refreshToken', response.refreshToken);
    window.location.href = '/';
  } else {
    throw new Error();
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

instance.interceptors.response.use(
  (res) => res.data,
  (error) => {
    if (error.response && error.response.status === 401) {
      refreshToken().catch(() => {
        localStorage.clear();
        window.location.href = '/login';
      });
    }
  }
);

export default instance;
