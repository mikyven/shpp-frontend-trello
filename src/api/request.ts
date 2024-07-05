import axios from 'axios';
import { api } from '../common/constants';

const instance = axios.create({
  baseURL: api.baseURL,
  headers: {
    'Content-Type': 'application/json',
    Authorization: `Bearer ${localStorage.getItem('token')}`,
  },
});

async function updateToken(): Promise<void> {
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
    if (error.response.status === 401 && error.config.url !== '/login') {
      if (localStorage.getItem('token') === null) {
        window.location.href = '/login';
      } else
        updateToken().catch(() => {
          localStorage.clear();
          window.location.href = '/login';
        });
    } else if ([403, 404].includes(error.response.status)) {
      window.location.href = '/';
    }
  }
);

export default instance;
