import { ReactElement, useEffect } from 'react';
import { ToastContainer, toast, Bounce } from 'react-toastify';
import { Oval } from 'react-loader-spinner';
import api from '../../api/request';
import 'react-toastify/dist/ReactToastify.css';
import './Interceptors.scss';
import { useAppDispatch, useAppSelector } from '../../store/hooks';
import { setIsLoading } from '../../store/slices/boardSlice';

export function Interceptors(): ReactElement {
  const dispatch = useAppDispatch();
  const { isLoading } = useAppSelector((state) => state.board);

  useEffect(() => {
    api.interceptors.response.use(
      (response) => {
        dispatch(setIsLoading(false));
        return response;
      },
      (error) => {
        if (error instanceof Error) {
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
  }, []);

  return (
    <>
      {isLoading && (
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
