/* eslint-disable no-console */
import React, { ReactElement, useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { ToastContainer, toast } from 'react-toastify';
import api from '../../api/request';
import { Board } from './components/Board/Board';
import { CreateNewBoard } from './components/CreateNewBoard/CreateNewBoard';
import './home.scss';

export function Home(): ReactElement {
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const [items, setItems] = useState<{ id: number; title: string; custom?: any }[] | undefined>([]);
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    const foo = async (): Promise<void> => {
      try {
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        const { boards }: { boards: { id: number; title: string; custom?: any }[] } = await api.get('/board');
        setItems(boards);
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
      } catch (e: any) {
        toast.error(e.response.data.error, { position: toast.POSITION.BOTTOM_LEFT });
      }
    };

    foo();

    api.interceptors.request.use((config) => {
      setIsLoading(true);
      return config;
    });

    api.interceptors.response.use((config) => {
      setIsLoading(false);
      return config;
    });
  }, []);

  const postNewBoard = async (title: string): Promise<void> => {
    try {
      await api.post('/board', { title, custom: {} }).catch((e) => {
        toast.error(e.response.data.error, { position: toast.POSITION.BOTTOM_LEFT });
      });

      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      const fetchedData: { boards: { id: number; title: string; custom?: any }[] } | undefined =
        await api.get('/board');
      setItems(fetchedData?.boards);
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
    } catch (e: any) {
      toast.error(e.response.data.error, { position: toast.POSITION.BOTTOM_LEFT });
    }
  };

  return (
    <div className="mainHome">
      <h1 className="homeHeader">Мої дошки</h1>
      {isLoading && <img className="loading-gif" src="https://i.gifer.com/ZKZg.gif" alt="Loading GIF" />}
      <div className="home">
        {!items ||
          items.map((i) => (
            <Link key={i?.id} to={`/board/${i?.id}`}>
              <Board key={i?.id} title={i?.title} background={i?.custom?.background} />
            </Link>
          ))}
        <CreateNewBoard onBoardCreated={postNewBoard} />
      </div>
      <ToastContainer />
    </div>
  );
}
