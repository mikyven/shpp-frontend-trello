import { ReactElement, useState, useRef, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faTrash } from '@fortawesome/free-solid-svg-icons';
import { Card } from '../Card/Card';
import './List.scss';
import { useAppDispatch, useAppSelector } from '../../../../store/hooks';
import { AddForm } from '../../../../components/AddForm/AddForm';
import { onSubmit } from '../../../../common/constants/submitHandler';
import { Input } from '../../../../components/Input/Input';
import {
  createNewCard,
  deleteList,
  editList,
  DnDMoveCard,
  resetData,
  setCurCard,
  setIsDropped,
  setOriginalCards,
} from '../../../../store/slices/listSlice';
import { TCard } from '../../../../common/types/types';

type Props = {
  id: number;
  title: string;
  position: number;
  cards: TCard[];
};

export function List({ id, title, position, cards }: Props): ReactElement {
  const dispatch = useAppDispatch();
  const { board } = useAppSelector((state) => state.board);
  const { curCard, originalCards, isDropped } = useAppSelector((state) => state.list);
  const { boardId } = useParams() as Record<string, string>;

  const [isChangingTitle, setIsChangingTitle] = useState(false);
  const [curCards, setCurCards] = useState<TCard[]>(cards);
  const [isDragEnded, setIsDragEnded] = useState(false);
  const [titleValue, setTitleValue] = useState(title);
  const containerRef = useRef<HTMLDivElement | null>(null);
  const listRef = useRef<HTMLDivElement | null>(null);

  useEffect(() => setCurCards(cards), [cards]);

  useEffect(() => {
    if (isDragEnded && !isDropped) setCurCards(cards);
    setIsDragEnded(false);
    dispatch(resetData());
    listRef.current?.classList.remove('current');
  }, [isDragEnded]);

  async function editTitle(newTitle: string): Promise<void> {
    if (newTitle !== title) {
      await dispatch(editList({ boardId, listId: id, obj: { title: newTitle } }));
    }
  }

  async function handleDeletion(): Promise<void> {
    const movedLists = board?.lists
      .filter((i) => i.position > position)
      .map((i) => ({ id: i.id, position: i.position - 1 }));

    if (movedLists) {
      dispatch(deleteList({ boardId, listId: id, movedLists }));
    }
  }

  function onDragStart(e: React.DragEvent): void {
    const element = e.target as HTMLLIElement;
    const newCards = [...curCards];
    const card = curCards[Array.from(element.parentElement?.children || []).indexOf(element)];
    if (card) {
      element.style.outline = 'none';
      element.style.transform = 'rotate(5deg)';
      listRef.current?.classList.add('current');

      element.addEventListener('dragend', () => setTimeout(() => setIsDragEnded(true)));

      dispatch(setCurCard(card));
      newCards[card.position - 1] = { id: 'slot', title: '', position: card.position };

      setTimeout(() => {
        setCurCards(newCards);
      });
    }
  }

  function onDragOver(e: React.DragEvent): void {
    const element = e.target as HTMLElement;
    const slot = curCards.find((i) => i.id === 'slot');
    const card =
      element.className === 'card' && curCards[Array.from(element.parentElement?.children || []).indexOf(element)];
    let newCards = [...curCards];

    if (card && slot) {
      if (card.position > slot.position) {
        newCards = newCards.map((i) =>
          i.position > slot.position && i.position <= card.position ? { ...i, position: i.position - 1 } : i
        );
      } else {
        newCards = newCards.map((i) =>
          i.position >= card.position && i.position < slot.position ? { ...i, position: i.position + 1 } : i
        );
      }

      newCards[slot.position - 1] = { ...slot, position: card.position };
      setCurCards(newCards.sort((a, b) => a.position - b.position));
    }
  }

  function onDragEnter(e: React.DragEvent): void {
    const slot = curCards.find((i) => i.id === 'slot');
    if (!slot && containerRef.current?.contains(e.target as HTMLElement)) {
      listRef.current?.classList.add('current');
      setCurCards(curCards.concat({ id: 'slot', title: '', position: curCards.length + 1 }));
    }
  }

  function onDragLeave(e: React.DragEvent): void {
    const leftElement = e.target as HTMLElement;
    const enteredElement = e.relatedTarget as HTMLElement;
    if (
      leftElement &&
      ((leftElement.className === 'list_container' && !listRef.current?.contains(enteredElement)) ||
        enteredElement.className === 'board' ||
        enteredElement instanceof HTMLHtmlElement)
    ) {
      listRef.current?.classList.remove('current');
      const slot = curCards.find((i) => i.id === 'slot');
      let newCards = [...curCards];
      if (slot) {
        newCards.splice(slot.position - 1, 1);
        newCards = newCards.map((i) => (i.position >= slot.position ? { ...i, position: i.position - 1 } : i));
        setCurCards(newCards);
        dispatch(setOriginalCards(newCards.map((i) => ({ id: +i.id, position: i.position, list_id: id }))));
      }
    }
  }

  function onDrop(): void {
    const slot = curCards.find((i) => i.id === 'slot');
    if (slot && curCard && originalCards) {
      const newCards = [...curCards];
      newCards.push({ ...curCard, position: slot.position });
      newCards.splice(slot.position - 1, 1);
      setCurCards(newCards.sort((a, b) => a.position - b.position));
      dispatch(setIsDropped(true));
      listRef.current?.classList.remove('current');
      dispatch(
        DnDMoveCard({
          boardId,
          cards: [
            ...new Set(
              originalCards?.concat(newCards.map((i) => Object({ id: i.id, position: i.position, list_id: id })))
            ),
          ],
        })
      );
    }
  }

  const hideTitleInput = (): void => {
    setIsChangingTitle(false);
  };

  return (
    <div
      className="list_container"
      ref={containerRef}
      onDragOver={(e) => e.preventDefault()}
      onDrop={onDrop}
      onDragEnter={onDragEnter}
      onDragLeave={onDragLeave}
    >
      <div className="list" onDragOver={onDragOver} ref={listRef}>
        <div className="list_head">
          <div className="title_container">
            {!isChangingTitle && (
              <h2 className="list_title" onClick={() => setTimeout(() => setIsChangingTitle(true))}>
                {title}
              </h2>
            )}
            {isChangingTitle && (
              <Input
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
          <button className="delete-list_btn" onClick={handleDeletion}>
            {' '}
            <FontAwesomeIcon icon={faTrash} />
          </button>
        </div>
        <ul className="cards_parent">
          {curCards.map((i) => {
            if (i.id === 'slot') {
              return <li key={`${i.id}-${i.position}`} className="card-slot" />;
            }
            return <Card key={i.id} data={{ ...i, list: { id, title } }} onDragStart={onDragStart} />;
          })}
        </ul>
        <AddForm
          parentClassName="add-card"
          inputName="addCardInput"
          inputPlaceholder="Введіть ім'я картки"
          btnContent="Додати картку"
          handleSubmit={async (cardTitle: string) => {
            dispatch(
              createNewCard({
                boardId,
                card: { title: cardTitle, position: cards.length + 1, list_id: id },
              })
            );
          }}
        />
      </div>
    </div>
  );
}
