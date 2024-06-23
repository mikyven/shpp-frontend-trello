import { ReactElement, useEffect, useRef, useState } from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faArrowRight, faBan, faPlus, faXmark } from '@fortawesome/free-solid-svg-icons';
import { faCopy } from '@fortawesome/free-regular-svg-icons';
import { ConnectedProps, connect } from 'react-redux';
import { useNavigate, useParams } from 'react-router-dom';
import { ThunkDispatch } from '@reduxjs/toolkit';
import Markdown from 'react-markdown';
import remarkGfm from 'remark-gfm';
import { useAppDispatch } from '../../../../store/hooks';
import {
  changeCardData,
  changeVisibility,
  changeCardTitle,
  changeCardDescription,
  deleteCard,
  moveCard,
} from '../../../../store/slices/cardModalSlice';
import './CardModal.scss';
import { RootState } from '../../../../store/store';
import { ICard, RequestCard } from '../../../../common/interfaces/ICard';
import { Input } from '../../../../components/Input/Input';
import { onSubmit } from '../../../../common/constants/submitHandler';
import { IBoard, getBoard } from '../../../../store/slices/boardSlice';
import api from '../../../../api/request';
import { validationRegEx } from '../../../../common/constants/validation';
import { ActionModal } from './components/ActionsModal/ActionModal';
import { SelectState, resetSelectedData } from '../../../../store/slices/selectSlice';

interface State {
  data: (ICard & { list: { id: number; title: string } }) | null;
  board: IBoard | null;
  selectedData: SelectState;
}

interface ActionType {
  type: 'string';
}

const mapState = (state: RootState): State => {
  const { data } = state.cardModal;
  const { board } = state.board;
  const selectedData = state.select;
  return { data, board, selectedData };
};

interface ChangeTitleData {
  title: string;
  boardId: string;
  cardId: number;
  listId: number;
}

interface ChangeDescriptionData {
  description: string;
  boardId: string;
  cardId: number;
  listId: number;
}

interface DispatchProps {
  sendNewTitle: (data: ChangeTitleData) => Promise<void>;
  sendNewDescription: (data: ChangeDescriptionData) => Promise<void>;
  sendDeletion: (data: { boardId: string; cardId: number; cards: RequestCard[] }) => Promise<void>;
}

const mapDispatch = (dispatch: ThunkDispatch<RootState, never, ActionType>): DispatchProps => ({
  sendNewTitle: async (data: ChangeTitleData): Promise<void> => {
    await dispatch(changeCardTitle(data));
    await dispatch(getBoard({ id: data.boardId }));
  },
  sendNewDescription: async (data: ChangeDescriptionData): Promise<void> => {
    await dispatch(changeCardDescription(data));
    await dispatch(getBoard({ id: data.boardId }));
  },
  sendDeletion: async (data: { boardId: string; cardId: number; cards: RequestCard[] }): Promise<void> => {
    await dispatch(deleteCard(data));
    await api.put(`/board/${data.boardId}/card`, data.cards);
    await dispatch(getBoard({ id: data.boardId }));
  },
});

const connector = connect(mapState, mapDispatch);

type Props = ConnectedProps<typeof connector>;

function CardModal({ data, board, selectedData, sendNewTitle, sendNewDescription, sendDeletion }: Props): ReactElement {
  const { boardId, cardId } = useParams();
  const navigate = useNavigate();
  const dispatch = useAppDispatch();
  const [isChangingTitle, setIsChangingTitle] = useState(false);
  const [isEditingDescription, setIsEditingDescription] = useState(false);
  const [value, setValue] = useState(data?.title || '');
  const [descriptionValue, setDescriptionValue] = useState(data?.description || '');
  const cardModalRef = useRef<HTMLDivElement | null>(null);
  const bgRef = useRef<HTMLDivElement | null>(null);

  const users = [
    { id: 1, username: 'A' },
    { id: 2, username: 'B' },
    { id: 3, username: 'C' },
  ];

  useEffect(() => {
    if (cardModalRef.current && bgRef.current)
      bgRef.current.style.height = `${cardModalRef.current.clientHeight + 200}px`;
  });

  const [actionModalInset, setActionModalInset] = useState<{ left: string; top: string } | null>(null);
  const [currentActionModal, setCurrentActionModal] = useState<string | null>(null);

  const closeModal = (): void => {
    navigate(`/board/${boardId}`);
    dispatch(changeVisibility(false));
    dispatch(changeCardData(null));
    dispatch(resetSelectedData());
  };

  const changeTitle = async (title: string): Promise<void> => {
    if (data && boardId && title !== data.title)
      sendNewTitle({ title, boardId, cardId: +data.id, listId: data.list.id });
  };

  const editDescription = async (description: string): Promise<void> => {
    if (data && boardId && description !== data.description) {
      sendNewDescription({ description, boardId, cardId: +data.id, listId: data.list.id });
    }
  };

  useEffect(() => {
    const checkEscape = (e: KeyboardEvent): void => {
      if (e.key === 'Escape') {
        if (isChangingTitle) {
          setIsChangingTitle(false);
          setValue(data?.title || '');
          return;
        }
        closeModal();
      }
    };

    document.addEventListener('keydown', checkEscape);
    return (): void => document.removeEventListener('keydown', checkEscape);
  });

  async function onCardDelete(): Promise<void> {
    if (data && boardId && board) {
      const list = board.lists.find((i) => i.id === data.list.id);
      if (list) {
        const movedCards = list.cards
          .filter((i) => i.position > data.position)
          .map((i) => ({ id: i.id, position: i.position - 1, list_id: list.id }));

        await sendDeletion({ boardId, cardId: +data.id, cards: movedCards });
      }
      closeModal();
    }
  }

  function openModal(type: string): (e: React.MouseEvent) => void {
    return (e) => {
      const rects = (e.target as HTMLElement).getClientRects()[0];
      setActionModalInset({ left: `${rects.left + rects.width + 10}px`, top: `${rects.top}px` });
      setCurrentActionModal(type);
    };
  }

  async function onCopyBtnClick(): Promise<void> {
    const { list, position } = selectedData;
    if (data && board && list && position && validationRegEx.test(value)) {
      await api
        .post(`/board/${board.id}/card`, {
          title: value,
          position,
          list_id: list.id,
          description: data.description,
        })
        .then(() => {
          if (boardId) dispatch(getBoard({ id: boardId }));
          closeModal();
        });
    }
  }

  async function onMoveCardBtnClick(): Promise<void> {
    const { board: selectedBoard, list, position, cardsToBeUpdated } = selectedData;
    if (boardId && cardId && data?.list && selectedBoard && list && position) {
      const newCards = cardsToBeUpdated.concat(
        list.cards
          .filter((i) => i.position >= position)
          .map((i) => ({ id: i.id, position: i.position + 1, list_id: list.id }))
      );

      dispatch(
        moveCard({
          boardId: [...new Set([boardId, `${selectedBoard.id}`])],
          cardId,
          listId: `${list.id}`,
          position,
          cards: list.id === data.list.id ? cardsToBeUpdated : newCards,
          card: data,
        })
      ).then(() => {
        dispatch(changeCardData({ ...data, position, list: { id: list.id, title: list.title } }));
        closeModal();
      });
    }
  }

  return (
    <div className="container">
      <div className="card-modal" ref={cardModalRef}>
        <div className="modal-head">
          <div className="modal-title">
            {!isChangingTitle && (
              <p className="card-name" onClick={() => setIsChangingTitle(true)}>
                {data?.title}
              </p>
            )}
            {isChangingTitle && (
              <Input
                name="card-name"
                onSubmit={onSubmit(value, changeTitle, () => setIsChangingTitle(false))}
                submitOnBlur
                {...{ value, setValue }}
              />
            )}
          </div>

          <p className="list-name">
            в списку{' '}
            <a
              className="move-card_link move-card-element"
              onClick={(e) => {
                e.preventDefault();
                openModal('move')(e);
              }}
              href="#"
            >
              {data?.list.title}
            </a>
          </p>
        </div>
        <button className="close-btn" onClick={closeModal}>
          {' '}
          <FontAwesomeIcon icon={faXmark} />
        </button>
        <div className="content-container">
          <div className="users">
            <div className="users-head h">Учасники</div>
            <div className="users-list">
              {users.map((i) => (
                <div key={i.id}>{i.username[0].toUpperCase()}</div>
              ))}
              <button className="add-btn">
                {' '}
                <FontAwesomeIcon icon={faPlus} />
              </button>
            </div>
          </div>
          <div className="description">
            <div className="description-head">
              Опис{' '}
              <button className="change-description_btn" onClick={() => setIsEditingDescription(!isEditingDescription)}>
                Змінити
              </button>
            </div>
            {!isEditingDescription && (
              <div className="content">
                <Markdown remarkPlugins={[remarkGfm]}>{descriptionValue}</Markdown>
              </div>
            )}
            {isEditingDescription && (
              <textarea
                className="description-textarea"
                value={descriptionValue}
                ref={(e) => e?.focus()}
                onChange={(e) => setDescriptionValue(e.target.value)}
                onBlur={onSubmit(descriptionValue, editDescription, () =>
                  setIsEditingDescription(!isEditingDescription)
                )}
                style={{ height: `${descriptionValue.split('\n').length * 24 + 14}px` }}
              />
            )}
          </div>
          <div className="actions">
            <div className="actions-head h">Дії</div>
            <div className="button-container">
              <button className="copy-card_btn copy-card-element" onClick={openModal('copy')}>
                <FontAwesomeIcon className="icon" icon={faCopy} />
                Копіювати
              </button>
              <button className="move-card_btn move-card-element" onClick={openModal('move')}>
                <FontAwesomeIcon className="icon" icon={faArrowRight} />
                Перемістити
              </button>
              <button className="delete_btn" onClick={onCardDelete}>
                <FontAwesomeIcon className="icon" icon={faBan} />
                Видалити
              </button>
            </div>
          </div>
        </div>
      </div>
      {currentActionModal && actionModalInset && (
        <ActionModal
          type={currentActionModal}
          name={currentActionModal === 'copy' ? 'Копіювати' : 'Перемістити'}
          closeModal={() => setCurrentActionModal(null)}
          onSubmit={currentActionModal === 'copy' ? onCopyBtnClick : onMoveCardBtnClick}
          {...actionModalInset}
        />
      )}
      <div className="dark-background" ref={bgRef} onClick={closeModal} />
    </div>
  );
}

export default connector(CardModal);
