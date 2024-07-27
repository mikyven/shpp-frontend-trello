import { ReactElement } from 'react';
import { useNavigate } from 'react-router-dom';
import { SubmitHandler, useForm } from 'react-hook-form';
import { PasswordStrengthBar, checkPasswordStrength } from '../PasswordStrengthBar/PasswordStrengthBar';
import { emailRegEx } from '../../../../common/constants/regex';
import { registerUser } from '../../../../store/slices/authSlice';
import { useAppDispatch } from '../../../../store/hooks';
import { requiredField } from '../../../../utils/requiredField';

type Inputs = {
  email: string;
  password: string;
  repeatedPassword: string;
};

export function RegisterPage(): ReactElement {
  const dispatch = useAppDispatch();
  const navigate = useNavigate();
  const {
    register,
    watch,
    handleSubmit,
    formState: { errors },
  } = useForm<Inputs>();
  const enteredPassword = watch('password');
  const passwordStrength = checkPasswordStrength(enteredPassword || '');

  const submit: SubmitHandler<Inputs> = async ({ email, password }): Promise<void> => {
    dispatch(registerUser({ email, password }));
  };

  return (
    <form className="registration-form" onSubmit={handleSubmit(submit)}>
      <h1>Реєстрація</h1>
      <label>
        Email
        <input
          {...register('email', { ...requiredField, pattern: { value: emailRegEx, message: 'Email не є валідним' } })}
        />
        {errors.email && <div className="warning">{errors.email.message}</div>}
      </label>
      <label>
        Пароль{' '}
        <input
          {...register('password', { ...requiredField, validate: { checkStrength: () => passwordStrength.value > 1 } })}
          type="password"
        />
        <PasswordStrengthBar strength={passwordStrength} />
        {errors.password && <div className="warning">{errors.password.message}</div>}
      </label>
      <label>
        Повторіть пароль
        <input
          {...register('repeatedPassword', {
            ...requiredField,
            validate: {
              checkAccuracy: (_, formValues) =>
                formValues.repeatedPassword === formValues.password || 'Паролі не збігаються!',
            },
          })}
          type="password"
        />
        {errors.repeatedPassword && <div className="warning">{errors.repeatedPassword.message}</div>}
      </label>
      <button type="submit">Зареєструватись</button>
      <p>
        Вже є аккаунт?{' '}
        <a
          href="#"
          onClick={(e) => {
            e.preventDefault();
            navigate('/login');
          }}
        >
          Увійти
        </a>
      </p>
    </form>
  );
}
