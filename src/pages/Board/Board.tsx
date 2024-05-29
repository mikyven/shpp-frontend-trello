import { ReactElement, useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faHouse } from '@fortawesome/free-solid-svg-icons';
import { List } from './components/List/List';
import { IList } from '../../common/interfaces/IList';
import api from '../../api/request';
import './Board.scss';
import { TitleInput } from '../../components/TitleInput/TitleInput';
import { Interceptors } from '../../components/Interceptors/Interceptors';
import { BoardMenu } from './components/BoardMenu/BoardMenu';
import { AddList } from './components/AddList/AddList';
import { ICard } from '../../common/interfaces/ICard';

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
  const { boardId } = useParams();
  const [didMakeRequest, setDidMakeRequest] = useState(false);
  const [oldCards, setOldCards] = useState<ICard[] | null>(null);

  const fetchBoard = async (): Promise<void> => {
    const board: IBoard = await api.get(`/board/${boardId}`);
    setTitle(board.title);
    document.title = `${board.title} | Trello`;
    setLists(board.lists.sort((a, b) => a.position - b.position));
    if (board.custom && board.custom.background) {
      setBackground(board.custom.background);
    }
  };

  useEffect(() => {
    setDidMakeRequest(false);
    fetchBoard();
  }, [didMakeRequest]);

  async function editTitle(newTitle: string): Promise<void> {
    await api.put(`/board/${boardId}`, { title: newTitle });
    setDidMakeRequest(true);
  }

  async function postNewList(listTitle: string): Promise<void> {
    await api.post(`/board/${boardId}/list`, { title: listTitle, position: lists.length + 1 });
    setDidMakeRequest(true);
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
          <button className="home_link-btn">
            <a className="home_link" href="/" draggable={false}>
              {' '}
              <FontAwesomeIcon icon={faHouse} />
            </a>
          </button>

          <div className="title_container">
            {!isEditingTitle && (
              <h1
                className="board_title"
                onClick={() => {
                  setIsEditingTitle(true);
                }}
              >
                {title}
              </h1>
            )}
            {isEditingTitle && (
              <TitleInput title={title} editTitle={editTitle} hideInput={() => setIsEditingTitle(false)} />
            )}
          </div>

          <BoardMenu deleteBoard={deleteBoard} changeBackground={changeBoardBackground} />
        </section>
        <section className="list_parent">
          {lists.map((i) => (
            <List
              key={i.id}
              id={i.id}
              title={i.title}
              cards={i.cards}
              onRequestMade={() => setDidMakeRequest(true)}
              oldCards={oldCards}
              setOldCards={(cards) => setOldCards(cards)}
            />
          ))}
          <AddList postNewList={postNewList} />
        </section>
      </div>
    </>
  );
}
