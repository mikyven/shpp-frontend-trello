import { ReactElement, useState, useRef, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import { useAppDispatch, useAppSelector } from '../../../../../../store/hooks';
import { Input } from '../../../../../../components/Input/Input';
import './ActionModal.scss';
import { getBoardData } from '../../../../../../store/slices/boardSlice';
import { validationRegEx } from '../../../../../../common/constants/validation';
import { changeCardData, moveCard } from '../../../../../../store/slices/cardModalSlice';
import { TBoard, TCard, TList, MoveRequestCard } from '../../../../../../common/types/types';
import { createNewCard } from '../../../../../../store/slices/listSlice';
import useClickOutside from '../../../../../../hooks/useClickOutside';

type Props = {
  type: string;
  name: string;
  left: string;
  top: string;
  closeModal: () => void;
};

export function ActionModal({ type, left, top, closeModal, name }: Props): ReactElement {
  const { boardId, cardId } = useParams();
  const dispatch = useAppDispatch();
  const { boards } = useAppSelector((state) => state.board);
  const { data } = useAppSelector((state) => state.cardModal);

  const [value, setValue] = useState(data?.title || '');
  const [board, setBoard] = useState<TBoard | null>(null);
  const [list, setList] = useState<TList | null>(null);
  const [position, setPosition] = useState<number | null>(null);
  const [cardsToBeUpdated, setCardsToBeUpdated] = useState<MoveRequestCard[]>([]);
  const [initialCards, setInitialCards] = useState<TCard[] | null>(null);

  const modalRef = useRef<HTMLDivElement | null>(null);

  const positions = list?.cards.map((_i, index) => index + 1) || [];

  if (data?.list.id !== list?.id || type === 'copy') {
    positions.push((list?.cards.length || 0) + 1);
  }
  if (!positions.length) positions[0] = 1;

  useClickOutside(modalRef, closeModal);

  const liftCardsAfterRemovedCard = (arr: TCard[], pos: number, list_id: number): void =>
    setCardsToBeUpdated(
      arr.filter((i) => i.position > pos).map((i) => ({ id: +i.id, position: i.position - 1, list_id }))
    );

  const updatePositionsInSameList = (arr: TCard[], oldPos: number, newPos: number, list_id: number): void =>
    setCardsToBeUpdated(
      arr
        .filter((i) => (i.position > oldPos && i.position <= newPos) || (i.position >= newPos && i.position < oldPos))
        .map((i) => ({ id: +i.id, position: i.position + (newPos > oldPos ? -1 : 1), list_id }))
    );

  function updateSelectedBoard(id: string): void {
    if (data) {
      dispatch(getBoardData(id)).then((response) => {
        const newBoard = response.payload as TBoard;
        setBoard({ ...newBoard, id: +id });

        const originalList = newBoard.lists.find((i) => i.id === data.list.id);
        const newList = originalList || newBoard.lists[0];

        if (originalList) {
          setPosition(data.position);
          setInitialCards(originalList.cards);
        } else {
          setPosition(1);

          if (initialCards) {
            liftCardsAfterRemovedCard(initialCards, data.position, data.list.id);
          }
        }

        setList(newList);
      });
    }
  }

  useEffect(() => {
    updateSelectedBoard(boardId || '');
  }, []);

  const updateList = (id: string): void => {
    if (board) {
      const newList = board.lists.find((i) => i.id === +id);
      if (newList) {
        setList(newList);
        setPosition(1);
      }
      if (data && initialCards) {
        liftCardsAfterRemovedCard(initialCards, data.position, data.list.id);
      }
    }
  };

  const updatePosition = (newPosition: number): void => {
    setPosition(newPosition);

    if (data && list && list.id === data.list.id) {
      updatePositionsInSameList(list.cards, data.position, newPosition, list.id);
    }
  };

  async function onCopyBtnClick(): Promise<void> {
    if (data && board && list && position && boardId && validationRegEx.test(value)) {
      await dispatch(
        createNewCard({
          boardId,
          card: { title: value, position, list_id: list.id, description: data.description },
        })
      );
      closeModal();
    }
  }

  async function onMoveBtnClick(): Promise<void> {
    if (boardId && cardId && data?.list && board && list && position) {
      const newCards = cardsToBeUpdated.concat(
        list.cards
          .filter((i) => i.position >= position)
          .map((i) => ({ id: +i.id, position: i.position + 1, list_id: list.id }))
      );

      const boardIds = [...new Set([boardId, `${board.id}`])];

      await dispatch(
        moveCard({
          boardIds,
          cardId,
          listId: `${list.id}`,
          position,
          cards: list.id === data.list.id ? cardsToBeUpdated : newCards,
          card: data,
        })
      );
      if (boardIds.length === 1)
        dispatch(changeCardData({ ...data, position, list: { id: list.id, title: list.title } }));
      closeModal();
    }
  }

  function onSubmit(): void | null {
    if (type === 'copy') onCopyBtnClick();
    else onMoveBtnClick();
  }

  return (
    <div className={`${type}-card_modal action_modal`} ref={modalRef} style={{ left, top }}>
      <p className="title">{name} картку</p>
      {type === 'copy' && (
        <label className="title-input_label">
          Назва
          <Input name={`${type}-title-input`} onSubmit={() => false} {...{ value, setValue }} />
        </label>
      )}
      <div className="select-container">
        <label>
          Дошка{' '}
          <select value={board?.id} onChange={(e) => updateSelectedBoard(e.target.value)}>
            {boards.map((i) => (
              <option key={i.id} value={i.id}>
                {i.title}
              </option>
            ))}
          </select>
        </label>
        <label>
          Список{' '}
          <select value={list?.id} onChange={(e) => updateList(e.target.value)}>
            {board &&
              board.lists.map((i) => (
                <option key={i.id} value={i.id}>
                  {i.title}
                </option>
              ))}
          </select>
        </label>
        <label>
          Позиція{' '}
          <select value={position || 1} onChange={(e) => updatePosition(+e.target.value)}>
            {positions?.map((i) => (
              <option key={i} value={i}>
                {i}
              </option>
            ))}
          </select>
        </label>
      </div>
      <button className="submit-action_btn" onClick={onSubmit}>
        {name}
      </button>
    </div>
  );
}
