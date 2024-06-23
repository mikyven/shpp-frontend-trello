import { ReactElement, useState } from 'react';
import { ToastContainer, toast, Bounce } from 'react-toastify';
import api from '../../api/request';
import 'react-toastify/dist/ReactToastify.css';
import './Interceptors.scss';

export function Interceptors(): ReactElement {
  const [isLoading, setIsLoading] = useState(false);
  const [loadingProgress, setLoadingProgress] = useState(0);

  if (isLoading && loadingProgress < 100) {
    setTimeout(() => setLoadingProgress(loadingProgress + 5), 5);
  }

  api.interceptors.request.use((config) => {
    if (config.method === 'get') {
      setIsLoading(true);
    }
    return config;
  });

  api.interceptors.response.use(
    (response) => {
      setIsLoading(false);
      setLoadingProgress(0);
      return response;
    },
    (error) => {
      if (error instanceof Error) {
        // eslint-disable-next-line no-console
        console.log(error);
        toast.error(`${error.message} `, {
          position: 'bottom-left',
          autoClose: 2000,
          hideProgressBar: false,
          closeOnClick: true,
          pauseOnHover: true,
          draggable: true,
          theme: 'dark',
          transition: Bounce,
        });
      }
    }
  );

  return (
    <>
      {isLoading && (
        <div className="loading">
          <div className="progress-bar" style={{ width: `${loadingProgress}% ` }} />
        </div>
      )}
      <ToastContainer
        position="bottom-left"
        autoClose={2000}
        hideProgressBar={false}
        newestOnTop={false}
        closeOnClick
        rtl={false}
        pauseOnFocusLoss
        draggable
        pauseOnHover
        theme="dark"
        transition={Bounce}
      />
    </>
  );
}
