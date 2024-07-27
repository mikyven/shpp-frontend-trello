import { ReactElement, useEffect, useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faHouse } from '@fortawesome/free-solid-svg-icons';
import { List } from './components/List/List';
import './Board.scss';
import { BoardMenu } from './components/BoardMenu/BoardMenu';
import { CardModal } from './components/CardModal/CardModal';
import { updateBoard, getBoards, editBoardData, deleteBoard } from '../../store/slices/boardSlice';
import { useAppDispatch, useAppSelector } from '../../store/hooks';
import { changeCardData, changeModalVisibility } from '../../store/slices/cardModalSlice';
import { AddForm } from '../../components/AddForm/AddForm';
import { onSubmit } from '../../common/constants/submitHandler';
import { createNewList } from '../../store/slices/listSlice';
import { TBoard, TCard } from '../../common/types/types';
import { ResizableInput } from '../../components/ResizableInput/ResizableInput';

export function Board(): ReactElement {
  const { boardId, cardId } = useParams() as Record<string, string>;
  const navigate = useNavigate();
  const dispatch = useAppDispatch();
  const { board } = useAppSelector((state) => state.board);
  const { isModalOpen } = useAppSelector((state) => state.cardModal);

  const lists = board ? board.lists : [];
  const background = board?.custom ? board?.custom.background : '';
  document.title = `${board?.title || 'Дошка'} | Trello`;

  const [titleValue, setTitleValue] = useState(board ? board.title : '');
  const [isChangingTitle, setIsChangingTitle] = useState(false);

  useEffect(() => {
    (async (): Promise<void> => {
      const currentBoard = (await dispatch(updateBoard(boardId || ''))).payload as TBoard;
      dispatch(getBoards());

      if (cardId) {
        dispatch(changeModalVisibility(true));

        let card: TCard | null = null;
        const list =
          currentBoard &&
          currentBoard.lists.find((i) => {
            card = i.cards.find((j) => j.id === +cardId) as TCard;
            return card;
          });

        if (card && list) {
          dispatch(changeCardData({ ...(card as TCard), list: { ...list } }));
        }
      }
    })();
  }, []);

  useEffect(() => setTitleValue(board ? board.title : ''), [board]);

  const editTitle = async (title: string): Promise<void> => {
    if (title !== board?.title) {
      dispatch(editBoardData({ boardId, obj: { title } }));
    }
  };

  const hideTitleInput = (): void => {
    setIsChangingTitle(false);
    setTitleValue(board ? board.title : '');
  };

  return (
    <div className="board" style={{ background }}>
      <div className="head">
        <button className="home_link-btn head-btn">
          <a className="home_link" href="/" draggable={false}>
            {' '}
            <FontAwesomeIcon icon={faHouse} />
          </a>
        </button>

        <div className="title_container">
          {!isChangingTitle && (
            <h1 className="board_title" onClick={() => setTimeout(() => setIsChangingTitle(true))}>
              {board?.title}
            </h1>
          )}
          {isChangingTitle && (
            <ResizableInput
              name="title_input"
              className="title_input"
              onSubmit={onSubmit(titleValue, editTitle, hideTitleInput)}
              submitOnBlur
              selectContent
              escapeFunction={hideTitleInput}
              value={titleValue}
              setValue={setTitleValue}
            />
          )}
        </div>

        <BoardMenu
          deleteBoard={async () => {
            await dispatch(deleteBoard(boardId || ''));
            navigate('/');
          }}
          changeBackground={async (newBackground: string) => {
            await dispatch(editBoardData({ boardId, obj: { custom: { background: newBackground } } }));
          }}
        />
      </div>
      <div className="list_parent">
        {lists.map((i) => (
          <List key={i.id} id={i.id} title={i.title} position={i.position} cards={i.cards} />
        ))}
        <AddForm
          parentClassName="add-list"
          inputName="addListInput"
          inputPlaceholder="Введіть ім'я списку..."
          buttonContent="Додати список"
          handleSubmit={async (title: string): Promise<void> => {
            await dispatch(createNewList({ boardId, title, position: lists.length + 1 }));
          }}
        />
      </div>
      {isModalOpen && <CardModal />}
    </div>
  );
}
