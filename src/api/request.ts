import axios from 'axios';
import { api } from '../common/constants';

const instance = axios.create({
  baseURL: api.baseURL,
  headers: {
    'Content-Type': 'application/json',
    Authorization: `Bearer ${localStorage.getItem('token')}`,
  },
});

export const updateToken = (): void => {
  instance.defaults.headers.Authorization = `Bearer ${localStorage.getItem('token')}`;
};

async function refreshToken(): Promise<void> {
  type Response = { result: string; token: string; refreshToken: string } | undefined;
  const response: Response = await instance.post('/refresh', {
    refreshToken: localStorage.getItem('refreshToken'),
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
    if (error.response.status === 401 && localStorage.getItem('token')) {
      refreshToken().catch(() => {
        localStorage.clear();
        window.location.href = '/login';
      });
    }
  }
);

export default instance;
