import { ReactElement } from 'react';
import './ErrorPage.scss';
import { useNavigate } from 'react-router-dom';

export function ErrorPage(): ReactElement {
  const navigate = useNavigate();

  return (
    <div className="error-page">
      <h1>404</h1>
      <p className="not-found">Page not found</p>
      <p className="links">
        Go{' '}
        <a
          href="#"
          onClick={(e) => {
            e.preventDefault();
            navigate('/');
          }}
        >
          home
        </a>
      </p>
    </div>
  );
}
