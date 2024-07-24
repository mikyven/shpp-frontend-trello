import { ReactElement, useEffect } from 'react';
import './Auth.scss';
import { Outlet, useNavigate } from 'react-router-dom';

export function Auth(): ReactElement {
  const navigate = useNavigate();

  useEffect(() => {
    if (localStorage.getItem('token')) {
      navigate('/');
    }
  }, []);

  return (
    <div className="auth">
      <Outlet />
    </div>
  );
}
