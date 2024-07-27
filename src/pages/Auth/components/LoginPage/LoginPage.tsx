import { ReactElement, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { SubmitHandler, useForm } from 'react-hook-form';
import { useAppDispatch } from '../../../../store/hooks';
import { loginUser } from '../../../../store/slices/authSlice';
import { emailRegEx } from '../../../../common/constants/regex';
import { requiredField } from '../../../../utils/requiredField';

type Inputs = {
  email: string;
  password: string;
};

export function LoginPage(): ReactElement {
  const dispatch = useAppDispatch();
  const navigate = useNavigate();
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<Inputs>();
  const [isShowingPassword, setIsShowingPassword] = useState(false);
  const [isShowingLoginError, setIsShowingLoginError] = useState(false);

  const submit: SubmitHandler<Inputs> = async ({ email, password }): Promise<void> => {
    const response = await dispatch(loginUser({ email, password }));
    if (response.meta.requestStatus === 'fulfilled') {
      navigate('/');
    } else {
      setIsShowingLoginError(true);
    }
  };

  return (
    <form className="login-form" onSubmit={handleSubmit(submit)}>
      <h1>Вхід</h1>
      <label>
        Email
        <input
          {...register('email', { ...requiredField, pattern: { value: emailRegEx, message: 'Email не є валідним' } })}
        />
        {errors?.email && <div className="warning">{errors.email.message}</div>}
      </label>
      <label>
        Пароль
        <input {...register('password', requiredField)} type={isShowingPassword ? 'text' : 'password'} />
        <label className="show-password-container">
          <input type="checkbox" onChange={(e) => setIsShowingPassword(e.target.checked)} />
          Показувати пароль
        </label>
        {isShowingLoginError && <div className="warning">Користувача з такою адресою чи паролем не знайдено</div>}
      </label>
      <button type="submit">Увійти</button>
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
