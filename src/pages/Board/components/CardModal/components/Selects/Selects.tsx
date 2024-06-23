import { ReactElement, useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import { useAppDispatch, useAppSelector } from '../../../../../../store/hooks';
import { IBoard, getBoardData } from '../../../../../../store/slices/boardSlice';
import './Selects.scss';
import {
  changeCardsToBeUpdated,
  changeCurBoard,
  changeCurList,
  changeCurPosition,
} from '../../../../../../store/slices/selectSlice';
import { ICard } from '../../../../../../common/interfaces/ICard';

export function Selects(): ReactElement {
  const dispatch = useAppDispatch();
  const { boards } = useAppSelector((state) => state.board);
  const { data } = useAppSelector((state) => state.cardModal);
  const { boardId } = useParams();
  const { board, list, position } = useAppSelector((state) => state.select);
  const [initialCards, setInitialCards] = useState<ICard[] | null>(null);
  const positions = list?.cards.map((_i, index) => index + 1) || [];
  if (data?.list.id !== list?.id) positions.push((list?.cards.length || 0) + 1);
  if (!positions.length) positions[0] = 1;

  const liftCardsAfterRemovedCard = (arr: ICard[], pos: number, list_id: number): void => {
    dispatch(
      changeCardsToBeUpdated(
        arr.filter((i) => i.position > pos).map((i) => ({ id: +i.id, position: i.position - 1, list_id }))
      )
    );
  };

  const updatePositionsInSameList = (arr: ICard[], oldPos: number, newPos: number, list_id: number): void => {
    dispatch(
      changeCardsToBeUpdated(
        arr
          .filter((i) => (i.position > oldPos && i.position <= newPos) || (i.position >= newPos && i.position < oldPos))
          .map((i) => ({ id: +i.id, position: i.position + (newPos > oldPos ? -1 : 1), list_id }))
      )
    );
  };

  function updateBoard(id: string): void {
    if (id && data) {
      dispatch(getBoardData({ id })).then((response) => {
        const newBoard = response.payload as IBoard;
        dispatch(changeCurBoard({ ...newBoard, id: +id }));

        const originalList = newBoard.lists.find((i) => i.id === data.list.id);
        const newList = originalList || newBoard.lists[0];

        if (originalList) {
          dispatch(changeCurPosition(data.position));
          setInitialCards(originalList.cards);
        } else {
          dispatch(changeCurPosition(1));
          if (initialCards) {
            liftCardsAfterRemovedCard(initialCards, data.position, data.list.id);
          }
        }

        dispatch(changeCurList(newList));
      });
    }
  }

  const updateList = (id: string): void => {
    if (board) {
      const newList = board.lists.find((i) => i.id === +id);
      if (newList) {
        dispatch(changeCurList(newList));
        dispatch(changeCurPosition(1));
      }

      if (data && initialCards) {
        liftCardsAfterRemovedCard(initialCards, data.position, data.list.id);
      }
    }
  };

  const updatePosition = (newPosition: number): void => {
    dispatch(changeCurPosition(newPosition));

    if (data && list && list.id === data.list.id) {
      updatePositionsInSameList(list.cards, data.position, newPosition, list.id);
    }
  };

  useEffect(() => {
    updateBoard(boardId || '');
  }, []);

  return (
    <>
      <label>
        Дошка{' '}
        <select value={board?.id} onChange={(e) => updateBoard(e.target.value)}>
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
    </>
  );
}
