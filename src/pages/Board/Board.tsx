import { ReactElement, useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faHouse } from '@fortawesome/free-solid-svg-icons';
import { List } from './components/List/List';
import './Board.scss';
import { Interceptors } from '../../components/Interceptors/Interceptors';
import { BoardMenu } from './components/BoardMenu/BoardMenu';
import { CardModal } from './components/CardModal/CardModal';
import { updateBoard, getBoards, editBoardData, deleteBoard } from '../../store/slices/boardSlice';
import { useAppDispatch, useAppSelector } from '../../store/hooks';
import { changeCardData, changeVisibility } from '../../store/slices/cardModalSlice';
import { AddForm } from '../../components/AddForm/AddForm';
import { Input } from '../../components/Input/Input';
import { onSubmit } from '../../common/constants/submitHandler';
import { createNewList } from '../../store/slices/listSlice';
import { TBoard, TCard } from '../../common/types/types';

export function Board(): ReactElement {
  const dispatch = useAppDispatch();
  const { board } = useAppSelector((state) => state.board);
  const lists = board ? board.lists : [];
  const { isMounted: isModalMounted } = useAppSelector((state) => state.cardModal);
  const { boardId, cardId } = useParams();
  const background = board?.custom ? board?.custom.background : '';
  document.title = `${board?.title || 'Дошка'} | Trello`;

  const [value, setValue] = useState('');
  const [isEditingTitle, setIsEditingTitle] = useState(false);

  useEffect(() => {
    dispatch(updateBoard(boardId || ''));
    dispatch(getBoards());
  }, []);

  useEffect(() => setValue(board ? board.title : ''), [board]);

  useEffect(() => {
    (async (): Promise<void> => {
      if (!board && cardId) {
        await dispatch(updateBoard(boardId || '')).then((response) => {
          const curBoard = (response as unknown as { payload: TBoard }).payload;
          dispatch(changeVisibility(true));
          let card: TCard | null = null;
          const list =
            curBoard &&
            curBoard.lists.find((i) => {
              card = i.cards.find((j) => j.id === +cardId) as TCard;
              return card;
            });
          if (card && list) dispatch(changeCardData({ ...(card as TCard), list: { ...list } }));
        });
      }
    })();
  }, [cardId]);

  const editTitle = async (title: string): Promise<void> => {
    if (title !== board?.title && boardId) dispatch(editBoardData({ id: boardId, obj: { title } }));
  };

  const changeBackground = async (newBg: string): Promise<void> => {
    if (boardId) dispatch(editBoardData({ id: boardId, obj: { custom: { background: newBg } } }));
  };

  async function deleteCurBoard(): Promise<void> {
    await dispatch(deleteBoard(boardId || ''));
    window.location.href = '/';
  }

  async function postNewList(title: string): Promise<void> {
    if (boardId) dispatch(createNewList({ id: boardId, title, position: lists.length + 1 }));
  }

  const hideTitleInput = (): void => setIsEditingTitle(false);

  return (
    <>
      <Interceptors />
      <div className="board" style={{ background }}>
        <div className="head">
          <button className="home_link-btn head-btn">
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
              <div className="resize-container">
                <span className="resize-text">{value}</span>
                <Input
                  name="title_input"
                  className="title_input"
                  onSubmit={onSubmit(value, editTitle, hideTitleInput)}
                  submitOnBlur
                  selectContent
                  escapeFunction={hideTitleInput}
                  {...{ value, setValue }}
                />
              </div>
            )}
          </div>

          <BoardMenu deleteBoard={deleteCurBoard} changeBackground={changeBackground} />
        </div>
        <div className="list_parent">
          {lists.map((i) => (
            <List key={i.id} id={i.id} title={i.title} position={i.position} cards={i.cards} />
          ))}
          <AddForm
            parentClassName="add-list"
            inputName="addListInput"
            inputPlaceholder="Введіть ім'я списку..."
            btnContent="Додати список"
            handleSubmit={postNewList}
          />
        </div>
        {isModalMounted && <CardModal />}
      </div>
    </>
  );
}
