import { ReactElement, useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faHouse } from '@fortawesome/free-solid-svg-icons';
import { ConnectedProps, connect } from 'react-redux';
import { ThunkDispatch } from '@reduxjs/toolkit';
import { List } from './components/List/List';
import api from '../../api/request';
import './Board.scss';
import { TitleInput } from '../../components/TitleInput/TitleInput';
import { Interceptors } from '../../components/Interceptors/Interceptors';
import { BoardMenu } from './components/BoardMenu/BoardMenu';
import { ICard } from '../../common/interfaces/ICard';
import CardModal from './components/CardModal/CardModal';
import { RootState } from '../../store/store';
import { IBoard, getBoard, getBoards } from '../../store/slices/boardSlice';
import { IList } from '../../common/interfaces/IList';
import { useAppDispatch } from '../../store/hooks';
import { changeCardData, changeVisibility } from '../../store/slices/cardModalSlice';
import { AddForm } from '../../components/AddForm/AddForm';

const mapState = (state: RootState): { board: IBoard | null; lists: IList[]; isModalMounted: boolean } => {
  const { board, lists } = state.board;
  const { isMounted } = state.cardModal;
  return { board, lists, isModalMounted: isMounted };
};

interface ActionType {
  type: string;
}

interface IGetBoard {
  getCurBoard: (id: string) => void;
}

const mapDispatch = (dispatch: ThunkDispatch<RootState, never, ActionType>): IGetBoard => ({
  getCurBoard: (id: string) => dispatch(getBoard({ id })),
});

const connector = connect(mapState, mapDispatch);

type Props = ConnectedProps<typeof connector>;

function Board({ board, lists, isModalMounted, getCurBoard }: Props): ReactElement {
  const dispatch = useAppDispatch();
  const { boardId, cardId } = useParams();
  const background = board?.custom ? board?.custom.background : '';
  document.title = `${board?.title || 'Дошка'} | Trello`;

  const [isEditingTitle, setIsEditingTitle] = useState(false);
  const [didMakeRequest, setDidMakeRequest] = useState(false);

  const fetchBoard = async (): Promise<void> => getCurBoard(boardId || '');

  useEffect(() => {
    dispatch(getBoards());
  }, []);

  useEffect(() => {
    setDidMakeRequest(false);
    fetchBoard();
  }, [didMakeRequest]);

  useEffect(() => {
    (async (): Promise<void> => {
      if (cardId) {
        await fetchBoard().then((response) => {
          const curBoard = (response as unknown as { payload: IBoard }).payload;
          dispatch(changeVisibility(true));
          let card: ICard | null = null;
          const list =
            curBoard &&
            curBoard.lists.find((i) => {
              card = i.cards.find((j) => j.id === +cardId) as ICard;
              return card;
            });
          if (card && list) dispatch(changeCardData({ ...(card as ICard), list: { ...list } }));
        });
      }
    })();
  }, [cardId]);

  async function editTitle(newTitle: string): Promise<void> {
    if (newTitle !== board?.title) {
      await api.put(`/board/${boardId}`, { title: newTitle });
      setDidMakeRequest(true);
    }
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
              <h1 className="board_title" onClick={() => setTimeout(() => setIsEditingTitle(true))}>
                {board?.title}
              </h1>
            )}
            {isEditingTitle && (
              <TitleInput
                title={board?.title || ''}
                editTitle={editTitle}
                hideInput={() => setIsEditingTitle(false)}
                adaptive
              />
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
              position={i.position}
              cards={i.cards}
              onRequestMade={() => setDidMakeRequest(true)}
            />
          ))}
          <AddForm
            parentClassName="add-list"
            inputName="addListInput"
            inputPlaceholder="Введіть ім'я списку..."
            btnContent="Додати список"
            handleSubmit={postNewList}
          />
        </section>
        {isModalMounted && <CardModal />}
      </div>
    </>
  );
}

export default connector(Board);
