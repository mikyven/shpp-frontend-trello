import { ReactElement, useEffect, useState } from 'react';
import { PasswordStrengthBar, checkPasswordStrength } from '../PasswordStrengthBar/PasswordStrengthBar';

export function RegistrationForm({
  registerUser,
  goToLoginPage,
}: {
  registerUser: (user: { email: string; password: string }) => Promise<void>;
  goToLoginPage: () => void;
}): ReactElement {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [repeatedPassword, setRepeatedPassword] = useState('');

  const [isShowingEmailWarning, setIsShowingEmailWarning] = useState(false);
  const [isShowingRepeatedPasswordWarning, setIsShowingRepeatedPasswordWarning] = useState(false);

  const passwordStrength = checkPasswordStrength(password);
  const emailRegEx = /^\w+@[a-zA-Z_]+\.[a-zA-Z_]+$/;

  const isPasswordSafe = passwordStrength.value > 1;
  const isPasswordRepeatedCorrectly = repeatedPassword === password;
  const isEmailValid = emailRegEx.test(email);

  const isButtonDisabled = !isEmailValid || !isPasswordSafe || !isPasswordRepeatedCorrectly;

  useEffect(() => setIsShowingEmailWarning(!isEmailValid), [email]);

  useEffect(
    () => setIsShowingRepeatedPasswordWarning(!!email && !!password && !isPasswordRepeatedCorrectly),
    [repeatedPassword]
  );

  return (
    <form className="registration-form" onSubmit={(e) => e.preventDefault()}>
      <h1>Реєстрація</h1>
      <label>
        Email
        <input onChange={(e) => setEmail(e.target.value)} />
        {isShowingEmailWarning && <div className="warning">Email не є валідним!</div>}
      </label>
      <label>
        Пароль <input type="password" value={password} onChange={(e) => setPassword(e.target.value)} />
        <PasswordStrengthBar strength={passwordStrength} />
      </label>
      <label>
        Повторіть пароль
        <input type="password" value={repeatedPassword} onChange={(e) => setRepeatedPassword(e.target.value)} />
        {isShowingRepeatedPasswordWarning && <div className="warning">Паролі не збігаються!</div>}
      </label>
      <button onClick={() => registerUser({ email, password })} disabled={isButtonDisabled}>
        Зареєструватись
      </button>
      <p>
        Вже є аккаунт?{' '}
        <a
          href="#"
          onClick={(e) => {
            e.preventDefault();
            goToLoginPage();
          }}
        >
          Увійти
        </a>
      </p>
    </form>
  );
}
