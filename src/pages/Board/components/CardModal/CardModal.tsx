import { ReactElement, useEffect, useRef, useState } from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faArrowRight, faBan, faPlus, faXmark } from '@fortawesome/free-solid-svg-icons';
import { faCopy } from '@fortawesome/free-regular-svg-icons';
import { useNavigate, useParams } from 'react-router-dom';
import Markdown from 'react-markdown';
import remarkGfm from 'remark-gfm';
import { useAppDispatch, useAppSelector } from '../../../../store/hooks';
import {
  changeCardData,
  changeModalVisibility,
  deleteCard,
  changeCardValues,
} from '../../../../store/slices/cardModalSlice';
import './CardModal.scss';
import { Input } from '../../../../components/Input/Input';
import { onSubmit } from '../../../../common/constants/submitHandler';
import { ActionModal } from './components/ActionsModal/ActionModal';

export function CardModal(): ReactElement {
  const { boardId } = useParams();
  const navigate = useNavigate();
  const dispatch = useAppDispatch();
  const { data } = useAppSelector((state) => state.cardModal);
  const { board } = useAppSelector((state) => state.board);

  const [isChangingTitle, setIsChangingTitle] = useState(false);
  const [isChangingDescription, setIsChangingDescription] = useState(false);
  const [titleValue, setTitleValue] = useState(data?.title || '');
  const [descriptionValue, setDescriptionValue] = useState(data?.description || '');
  const cardModalRef = useRef<HTMLDivElement | null>(null);
  const bgRef = useRef<HTMLDivElement | null>(null);

  const users = [
    { id: 1, username: 'A' },
    { id: 2, username: 'B' },
    { id: 3, username: 'C' },
  ];

  useEffect(() => {
    if (cardModalRef.current && bgRef.current) {
      bgRef.current.style.height = `${cardModalRef.current.clientHeight + 200}px`;
    }
  });

  const [actionModalInset, setActionModalInset] = useState<{ left: string; top: string } | null>(null);
  const [currentActionModal, setCurrentActionModal] = useState<string | null>(null);

  const closeModal = (): void => {
    navigate(`/board/${boardId}`);
    dispatch(changeModalVisibility(false));
    dispatch(changeCardData(null));
  };

  const changeTitle = async (title: string): Promise<void> => {
    if (data && boardId && title !== data.title) {
      dispatch(changeCardValues({ boardId, cardId: +data.id, listId: data.list.id, changedValue: { title } }));
    }
  };

  const changeDescription = async (description: string): Promise<void> => {
    if (data && boardId && description !== data.description) {
      dispatch(changeCardValues({ boardId, cardId: +data.id, listId: data.list.id, changedValue: { description } }));
    }
  };

  useEffect(() => {
    const checkEscape = (e: KeyboardEvent): void => {
      if (e.key === 'Escape') {
        if (isChangingTitle || isChangingDescription) {
          setIsChangingTitle(false);
          setIsChangingDescription(false);
          setTitleValue(data?.title || '');
          setDescriptionValue(data?.description || '');
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
          .map((i) => ({ id: +i.id, position: i.position - 1, list_id: list.id }));

        await dispatch(deleteCard({ boardId, cardId: +data.id, movedCards }));
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
                onSubmit={onSubmit(titleValue, changeTitle, () => setIsChangingTitle(false))}
                submitOnBlur
                selectContent
                value={titleValue}
                setValue={setTitleValue}
              />
            )}
          </div>

          <p className="list-name">
            в списку{' '}
            <a
              className="move-card_link"
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
        <div className="modal-content">
          <div className="users">
            <p className="users-head small-head">Учасники</p>
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
              <button
                className="change-description_btn"
                onClick={() => setIsChangingDescription(!isChangingDescription)}
              >
                Змінити
              </button>
            </div>
            {!isChangingDescription && (
              <div className="content">
                <Markdown remarkPlugins={[remarkGfm]}>{descriptionValue}</Markdown>
              </div>
            )}
            {isChangingDescription && (
              <textarea
                className="description-textarea"
                value={descriptionValue}
                ref={(e) => e?.focus()}
                onChange={(e) => setDescriptionValue(e.target.value)}
                onBlur={onSubmit(descriptionValue, changeDescription, () => setIsChangingDescription(false))}
                style={{ height: `${descriptionValue.split('\n').length * 24 + 14}px` }}
              />
            )}
          </div>
          <div className="actions">
            <div className="actions-head small-head">Дії</div>
            <div className="button-container">
              <button className="copy-card_btn" onClick={openModal('copy')}>
                <FontAwesomeIcon className="icon" icon={faCopy} />
                Копіювати
              </button>
              <button className="move-card_btn" onClick={openModal('move')}>
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
          {...actionModalInset}
        />
      )}
      <div className="dark-background" ref={bgRef} onClick={closeModal} />
    </div>
  );
}
