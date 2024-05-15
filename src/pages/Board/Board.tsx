import { FormEvent, ReactElement, useEffect, useRef, useState } from 'react';
import { useParams } from 'react-router-dom';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faHouse, faXmark, faEllipsis, faMinus, faPalette, faChevronLeft } from '@fortawesome/free-solid-svg-icons';
import { List } from './components/List/List';
import { IList } from '../../common/interfaces/IList';
import api from '../../api/request';
import './Board.scss';
import { TitleInput } from '../../components/TitleInput/TitleInput';
import { Interceptors } from '../../components/ProgressBar/Interceptors';
import { images } from '../../assets/images';

interface IBoard {
  title: string;
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  custom: any;
  lists: IList[];
}

export function Board(): ReactElement {
  const [title, setTitle] = useState('');
  const [lists, setLists] = useState<IList[]>([]);
  const [background, setBackground] = useState('');
  const [isEditingTitle, setIsEditingTitle] = useState(false);
  const [isAddingList, setIsAddingList] = useState(false);
  const titleInputRef = useRef<HTMLInputElement | null>(null);
  const { boardId } = useParams();
  const [didMakeRequest, setDidMakeRequest] = useState(false);
  const [showOptions, setShowOptions] = useState(false);
  const [isChangingBg, setIsChangingBg] = useState(false);
  const colors = ['#242424', '#b30000', '#0059b3', '#009933', '#ff9933', '#884dff', '#66b3ff', '#ff80d5'];

  const fetchBoard = async (): Promise<void> => {
    const board: IBoard = await api.get(`/board/${boardId}`);
    setTitle(board.title);
    document.title = `${board.title} | Trello`;
    setLists(board.lists);
    if (board.custom && board.custom.background) {
      setBackground(board.custom.background);
    }
  };

  useEffect(() => {
    setDidMakeRequest(false);
    fetchBoard();
  }, [didMakeRequest]);

  async function putNewBoardTitle(newTitle: string): Promise<void> {
    setIsEditingTitle(false);
    if (newTitle && /^[А-ЯҐЄІЇ\w ._-]+$/gi.test(newTitle)) {
      await api.put(`/board/${boardId}`, { title: newTitle });
      setDidMakeRequest(true);
    }
  }

  async function postNewList(listTitle: string): Promise<void> {
    await api.post(`/board/${boardId}/list`, { title: listTitle, position: lists.length + 1 });
    setDidMakeRequest(true);
  }

  function onListCreated(e: FormEvent): void {
    e.preventDefault();
    const value = titleInputRef.current?.value || '';

    if (value && /^[А-ЯҐЄІЇ\w ._-]+$/gi.test(value)) {
      postNewList(value);
    }

    setIsAddingList(false);
  }

  async function deleteBoard(): Promise<void> {
    await api.delete(`/board/${boardId}`);
    window.location.href = '/';
  }

  async function changeBoardBackground(newBg: string): Promise<void> {
    await api.put(`/board/${boardId}`, { custom: { background: newBg } });
    setDidMakeRequest(true);
  }

  return (
    <>
      <Interceptors />
      <div className="board" style={{ background }}>
        <section className="head">
          <a className="home_link" href="/" draggable={false}>
            {' '}
            <FontAwesomeIcon icon={faHouse} />
          </a>
          {!isEditingTitle && (
            <h1
              className="board_title"
              onClick={() => {
                setIsEditingTitle(true);
                setIsAddingList(false);
              }}
            >
              {title}
            </h1>
          )}
          {isEditingTitle && <TitleInput title={title} onTitleEdited={putNewBoardTitle} />}
          {!showOptions && (
            <button className="show-board-menu_btn" onClick={() => setShowOptions(true)}>
              {' '}
              <FontAwesomeIcon icon={faEllipsis} />
            </button>
          )}
          {showOptions && (
            <div className={`board-menu ${isChangingBg ? 'bg' : ''}`}>
              <div className="menu-head">
                {isChangingBg && (
                  <button className="return-btn" onClick={() => setIsChangingBg(false)}>
                    {' '}
                    <FontAwesomeIcon icon={faChevronLeft} />
                  </button>
                )}
                <h2>{isChangingBg ? 'Змінити фон' : 'Меню'} </h2>
                <button
                  className="close-btn"
                  onClick={() => {
                    setShowOptions(false);
                    setIsChangingBg(false);
                  }}
                >
                  {' '}
                  <FontAwesomeIcon icon={faXmark} />
                </button>
              </div>
              <hr />
              {!isChangingBg && (
                <div className="btn_container">
                  <button className="change-board-bg_btn" onClick={() => setIsChangingBg(true)}>
                    <FontAwesomeIcon className="icon" icon={faPalette} />
                    Змінити фон
                  </button>
                  <button className="delete-board_btn" onClick={deleteBoard}>
                    <FontAwesomeIcon className="icon" icon={faMinus} />
                    Видалити дошку
                  </button>
                </div>
              )}
              {isChangingBg && (
                <>
                  <p>Кольори</p>
                  <div className="colors_container">
                    {colors.map((i) => (
                      <button
                        key={`${i}-color`}
                        className="color_btn"
                        style={{ backgroundColor: i }}
                        onClick={() => changeBoardBackground(i)}
                      >
                        {' '}
                      </button>
                    ))}
                  </div>
                  <hr />
                  <p>Зображення</p>
                  <div className="images_container">
                    {images.map((i) => (
                      <button
                        key={`image-${i.id}`}
                        className="image_btn"
                        style={{ background: `url(${i.img}) top/cover` }}
                        onClick={() => changeBoardBackground(`url(${i.img}) top/cover`)}
                      >
                        {' '}
                      </button>
                    ))}
                  </div>
                </>
              )}
            </div>
          )}
        </section>
        <section className="list_parent">
          {lists.map((i) => (
            <List key={i.id} id={i.id} title={i.title} cards={i.cards} onRequestMade={() => setDidMakeRequest(true)} />
          ))}
          <div>
            {!isAddingList && (
              <button
                className="add-list_btn"
                onClick={() => {
                  setIsAddingList(true);
                }}
              >
                + Додати список
              </button>
            )}
            {isAddingList && (
              <form className="add-list_form" onSubmit={onListCreated}>
                <input
                  placeholder="Введіть ім'я списку..."
                  ref={(input) => {
                    input?.focus();
                    titleInputRef.current = input;
                  }}
                />
                <div className="btn_container">
                  <button className="submit-btn" type="submit">
                    Додати список
                  </button>
                  <button className="close-btn" type="button" onClick={() => setIsAddingList(false)}>
                    {' '}
                    <FontAwesomeIcon icon={faXmark} />
                  </button>
                </div>
              </form>
            )}
          </div>
        </section>
      </div>
    </>
  );
}
