import { ReactElement, useState } from 'react';

type Props = {
  loginUser: (user: { email: string; password: string }) => Promise<void>;
  showError: boolean;
  goToRegisterPage: () => void;
};

export function LoginPage({ loginUser, showError, goToRegisterPage }: Props): ReactElement {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [isShowingPassword, setIsShowingPassword] = useState(false);

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
        {showError && <div className="warning">Користувача з такою адресою чи паролем не знайдено</div>}
      </label>
      <button disabled={!email || !password} onClick={() => loginUser({ email, password })}>
        Увійти
      </button>
      <p>
        Ще немає акаунта?{' '}
        <a
          href="#"
          onClick={(e) => {
            e.preventDefault();
            goToRegisterPage();
          }}
        >
          Зареєструватись
        </a>
      </p>
    </form>
  );
}
