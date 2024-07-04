import { ReactElement, useEffect, useState } from 'react';
import './Auth.scss';
import { useNavigate } from 'react-router-dom';
import { RegistrationForm } from './components/RegistrationForm/RegistrationForm';
import { LoginPage } from './components/LoginPage/LoginPage';
import api from '../../api/request';

export function Auth(): ReactElement {
  const navigate = useNavigate();
  const [curPage, setCurPage] = useState('login');
  const [isShowingLoginError, setIsShowingLoginError] = useState(false);

  useEffect(() => {
    if (localStorage.getItem('token')) {
      navigate('/');
    }
  }, []);

  useEffect(() => {
    setIsShowingLoginError(false);
  }, [curPage]);

  async function loginUser(user: { email: string; password: string }): Promise<void> {
    const response: { result: string; token: string; refreshToken: string } | undefined = await api.post(
      '/login',
      user
    );
    if (response && response.result === 'Authorized') {
      localStorage.setItem('token', response.token);
      localStorage.setItem('refreshToken', response.refreshToken);
      api.defaults.headers.Authorization = `Bearer ${response.token}`;
      navigate('/');
    } else setIsShowingLoginError(true);
  }

  async function registerUser(user: { email: string; password: string }): Promise<void> {
    const response: { result: string } = await api.post('/user', user);
    if (response.result === 'Created') {
      loginUser(user);
    }
  }

  return (
    <div className="auth">
      {curPage === 'login' && (
        <LoginPage
          loginUser={loginUser}
          showError={isShowingLoginError}
          goToRegisterPage={() => setCurPage('register')}
        />
      )}
      {curPage === 'register' && (
        <RegistrationForm registerUser={registerUser} goToLoginPage={() => setCurPage('login')} />
      )}
    </div>
  );
}
