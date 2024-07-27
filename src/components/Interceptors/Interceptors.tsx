import { ReactElement, useEffect } from 'react';
import { ToastContainer, toast, Bounce } from 'react-toastify';
import { Oval } from 'react-loader-spinner';
import { Outlet, useNavigate } from 'react-router-dom';
import { AxiosError } from 'axios';
import api, { refreshToken } from '../../api/request';
import 'react-toastify/dist/ReactToastify.css';
import './Interceptors.scss';
import { useAppDispatch, useAppSelector } from '../../store/hooks';
import { clearRequests } from '../../store/slices/boardSlice';

export function Interceptors(): ReactElement {
  const navigate = useNavigate();
  const dispatch = useAppDispatch();
  const { currentRequests } = useAppSelector((state) => state.board);

  useEffect(() => {
    api.interceptors.response.use(
      (response) => {
        if (Object.values(currentRequests).every((i) => i === 'fulfilled')) {
          dispatch(clearRequests());
        }
        return response;
      },
      (error) => {
        if (error instanceof AxiosError) {
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

          switch (error.response?.status) {
            case 404:
              navigate('/error');
              break;
            case 401:
              refreshToken()
                .then(() => {
                  window.location.reload();
                })
                .catch(() => {
                  localStorage.clear();
                  navigate('/login');
                });
              break;
            default:
              break;
          }
          throw error;
        }
      }
    );
  }, []);

  return (
    <>
      {Object.values(currentRequests).includes('pending') && (
        <div className="loading">
          <Oval
            visible
            height="60"
            width="60"
            color="#fff"
            secondaryColor="#fff"
            strokeWidth={4}
            ariaLabel="oval-loading"
            wrapperStyle={{}}
            wrapperClass=""
          />
        </div>
      )}
      <Outlet />
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
