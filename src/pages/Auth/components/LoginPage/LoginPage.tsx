import { ReactElement, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAppDispatch } from '../../../../store/hooks';
import { loginUser } from '../../../../store/slices/authSlice';

export function LoginPage(): ReactElement {
  const dispatch = useAppDispatch();
  const navigate = useNavigate();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [isShowingPassword, setIsShowingPassword] = useState(false);
  const [isShowingLoginError, setIsShowingLoginError] = useState(false);
  return (
    <form className="login-form" onSubmit={(e) => e.preventDefault()}>
      <h1>Вхід</h1>
      <label>
        Email
        <input onChange={(e) => setEmail(e.target.value)} />
      </label>
      <label>
        Пароль
        <input type={isShowingPassword ? 'text' : 'password'} onChange={(e) => setPassword(e.target.value)} />
        <label className="show-password-container">
          <input type="checkbox" onChange={(e) => setIsShowingPassword(e.target.checked)} />
          Показувати пароль
        </label>
        {isShowingLoginError && <div className="warning">Користувача з такою адресою чи паролем не знайдено</div>}
      </label>
      <button
        disabled={!email || !password}
        onClick={async () => {
          const response = await dispatch(loginUser({ email, password }));
          if (response.meta.requestStatus === 'fulfilled') {
            navigate('/');
          } else {
            setIsShowingLoginError(true);
          }
        }}
      >
        Увійти
      </button>
      <p>
        Ще немає акаунта?{' '}
        <a
          href="#"
          onClick={(e) => {
            e.preventDefault();
            navigate('/register');
          }}
        >
          Зареєструватись
        </a>
      </p>
    </form>
  );
}
