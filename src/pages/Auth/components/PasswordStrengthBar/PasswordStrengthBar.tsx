import { ReactElement } from 'react';
import './PasswordStrengthBar.scss';
import { symbolRegEx } from '../../../../common/constants/regex';

export function checkPasswordStrength(password: string): { value: number; message: string } {
  const lowercase = /[a-z]/.test(password);
  const uppercase = /[A-Z]/.test(password);
  const number = /\d/.test(password);
  const symbol = symbolRegEx.test(password);
  const strengthTypes: string[] = ['Дуже слабкий', 'Слабкий', 'Хороший', 'Надійний'];

  let value = 0;
  let message = '';

  if (password.length < 6) message = 'В паролі має бути не менше 6 символів';
  else if (!lowercase) message = 'Пароль має містити малі літери';
  else if (!uppercase) message = 'Пароль має містити великі літери';
  else {
    value = [number, symbol, password.length >= 10].filter((i) => !!i).length;
    message = strengthTypes[value];
  }

  return { value, message };
}

type Props = {
  strength: { value: number; message: string };
};

export function PasswordStrengthBar({ strength }: Props): ReactElement {
  const strengthBars: ReactElement[] = [];

  for (let i = 0; i < 4; i++) {
    strengthBars[i] = <div key={i} className={strength.value >= i ? 'active' : ''} />;
  }

  return (
    <div className="password-strength-bar">
      <div className="bars-container">{strengthBars}</div>
      {strength.message}
    </div>
  );
}
