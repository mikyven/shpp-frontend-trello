import React, { ReactElement, useState, useEffect, useRef, ChangeEvent } from 'react';
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.min.css';
import { useParams } from 'react-router-dom';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faXmark, faAngleLeft, faHouse } from '@fortawesome/free-solid-svg-icons';
import { IList } from '../../common/interfaces/IList';
import { List } from './components/List/List';
import { BoardTitle } from './components/BoardTitle/BoardTitle';
import { CreateNewList } from './components/CreateNewList/CreateNewList';
import { imagesArr } from '../../common/images';
import api from '../../api/request';
import './board.scss';

export function Board(): ReactElement {
  const { boardId } = useParams();

  const [title, setTitle] = useState('');
  const [lists, setLists] = useState<IList[] | null>(null);
  const [isMenuVisible, setIsMenuVisible] = useState(false);
  const [isBgChangeMenuVisible, setIsBgChangeMenuVisible] = useState(false);

  const boardRef = useRef<HTMLDivElement | null>(null);
  const [backgroundColorValue, setBackgroundColorValue] = useState('#ffffff');
  const [bgColor, setBgColor] = useState('#ffffff');

  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    const foo = async (): Promise<void> => {
      try {
        const board: {
          title: string;
          lists: IList[];
          custom?: { background: string };
        } = await api.get(`board/${boardId}`);

        setTitle(board.title);
        setLists(board.lists);

        if (board.custom?.background && boardRef.current) {
          if (board.custom.background.includes('base64')) {
            boardRef.current.style.background = board.custom.background;
          } else {
            boardRef.current.style.backgroundColor = board.custom.background;
            setBackgroundColorValue(board.custom.background);
            setBgColor(board.custom.background);
          }
        }
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
      } catch (e: any) {
        toast.error(e.response.data.error, { position: toast.POSITION.BOTTOM_LEFT });
      }
    };

    api.interceptors.request.use((config) => {
      setIsLoading(true);
      return config;
    });

    api.interceptors.response.use((config) => {
      setIsLoading(false);
      return config;
    });

    foo();
  }, []);

  // board, list and card title
  const setNewTitle = async (
    newTitle: string,
    type: string,
    hideFunc: () => void,
    id?: number,
    list_id?: number
  ): Promise<void> => {
    try {
      switch (type) {
        case 'board':
          await api.put(`board/${boardId}`, { title: newTitle });
          break;
        case 'list':
          await api.put(`board/${boardId}/list/${id}`, { title: newTitle });
          break;
        case 'card':
          await api.put(`board/${boardId}/card/${id}`, { title: newTitle, list_id });
          break;
        default:
      }

      const fetchedData: { title: string; lists: IList[] } = await api.get(`board/${boardId}`);

      if (type === 'board') setTitle(fetchedData.title);
      if (type === 'list' || type === 'card') setLists(fetchedData.lists);
      hideFunc();
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
    } catch (e: any) {
      toast.error(e.response.data.error, { position: toast.POSITION.BOTTOM_LEFT });
    }
  };

  // lists and cards delete
  const onDeleteBtnClick = async (id: number, type: string): Promise<void> => {
    try {
      await api.delete(`board/${boardId}/${type}/${id}`);
      const fetchedData: { lists: IList[] } = await api.get(`board/${boardId}`);

      setLists(fetchedData.lists);
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
    } catch (e: any) {
      toast.error(e.response.data.error, { position: toast.POSITION.BOTTOM_LEFT });
    }
  };

  // lists and cards create
  const onInputSubmit = async (
    newTitle: string,
    type: string,
    hideFunc: () => void,
    list_id?: number
  ): Promise<void> => {
    try {
      if (newTitle !== '' && newTitle.match(/[1-9a-zA-Z-._ ]/g)?.length === newTitle.length) {
        if (type === 'list') {
          await api.post(`board/${boardId}/list`, { title: newTitle, position: lists?.length ? lists.length + 1 : 1 });
        } else {
          await api.post(`board/${boardId}/card`, {
            title: newTitle,
            list_id,
            position:
              lists &&
              (lists[lists.findIndex((i) => i.id === list_id)]
                ? lists[lists.findIndex((i) => i.id === list_id)].cards.length + 1
                : 1),
            description: '',
            custom: {},
          });
        }

        const fetchedData: { lists: IList[] } = await api.get(`board/${boardId}`);

        setLists(fetchedData.lists);
        hideFunc();
      }
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
    } catch (e: any) {
      toast.error(e.response.data.error, { position: toast.POSITION.BOTTOM_LEFT });
    }
  };

  return (
    <div className="board" ref={boardRef}>
      <div className="head">
        <a href="/" className="homeAnchor">
          <FontAwesomeIcon icon={faHouse} size="2x" />
        </a>

        <BoardTitle title={title} setNewTitle={setNewTitle} bgColor={bgColor} />
        {isLoading && <img className="loading-gif" src="https://i.gifer.com/ZKZg.gif" alt="Loading GIF" />}

        {!isMenuVisible && (
          <button className="changeBgBtn" onClick={(): void => setIsMenuVisible(true)}>
            <div className="circle" />
            <div className="circle" />
            <div className="circle" />
          </button>
        )}
        {isMenuVisible && (
          <div
            className="boardMenu"
            style={{
              height: isBgChangeMenuVisible ? '675px' : '175px',
              width: isBgChangeMenuVisible ? '250px' : '200px',
            }}
          >
            <div className="menuWrapper">
              {!isBgChangeMenuVisible && <h2>Меню</h2>}
              {isBgChangeMenuVisible && (
                <>
                  <button className="backMenuBtn" onClick={(): void => setIsBgChangeMenuVisible(false)}>
                    <FontAwesomeIcon icon={faAngleLeft} size="xl" />
                  </button>
                  <h2>Фон</h2>
                </>
              )}
              <button
                className="closeMenuBtn"
                onClick={(): void => {
                  setIsMenuVisible(false);
                  setIsBgChangeMenuVisible(false);
                }}
              >
                <FontAwesomeIcon icon={faXmark} size="xl" />
              </button>
            </div>
            <hr />
            {isBgChangeMenuVisible && (
              <div className="bgChangeDiv">
                <input
                  id="bgChangeInput"
                  type="color"
                  value={backgroundColorValue}
                  onChange={(e: ChangeEvent): void => setBackgroundColorValue((e.target as HTMLInputElement).value)}
                  onBlur={async (): Promise<void> => {
                    if (boardRef.current) {
                      boardRef.current.style.background = 'none';
                      boardRef.current.style.backgroundColor = backgroundColorValue;
                      setBgColor(backgroundColorValue);
                    }
                    await api.put(`/board/${boardId}`, { title, custom: { background: backgroundColorValue } });
                  }}
                />
                <label className="bgChangeLabel" htmlFor="bgChangeInput">
                  Обрати колір
                </label>
              </div>
            )}
            {!isBgChangeMenuVisible && (
              <button className="bgChangeBtn" onClick={(): void => setIsBgChangeMenuVisible(true)}>
                Змінити фон
              </button>
            )}
            <hr />
            {!isBgChangeMenuVisible && (
              <button
                className="deleteBoardBtn"
                onClick={async (): Promise<void> => {
                  await api.delete(`/board/${boardId}`);
                  window.location.replace('/');
                }}
              >
                Видалити дошку
              </button>
            )}
            {isBgChangeMenuVisible && (
              <div className="bgImagesDiv">
                {imagesArr.map((i) => (
                  <img
                    key={i.id}
                    className="bgImg"
                    src={i.img}
                    alt="Background to choose"
                    onClick={async (): Promise<void> => {
                      if (boardRef.current) {
                        boardRef.current.style.backgroundColor = 'none';
                        boardRef.current.style.background = `url(${i.img})`;
                        setBackgroundColorValue('#ffffff');
                      }
                      await api.put(`/board/${boardId}`, { title, custom: { background: `url(${i.img})` } });
                    }}
                  />
                ))}
              </div>
            )}
          </div>
        )}
      </div>

      <div className="lists">
        {lists &&
          lists.map((i) => (
            <List
              key={i.id}
              id={i.id}
              title={i.title}
              cards={i.cards}
              onDeleteBtnClick={onDeleteBtnClick}
              onTitleInputSubmit={setNewTitle}
              onCardCreateInputSubmit={onInputSubmit}
            />
          ))}
        <CreateNewList onInputSubmit={onInputSubmit} />
      </div>

      <script src="https://kit.fontawesome.com/5c1413da0e.js" crossOrigin="anonymous" />
      <ToastContainer />
    </div>
  );
}
