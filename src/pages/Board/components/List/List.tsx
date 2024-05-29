import { ReactElement, useState, useRef, DragEvent, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faTrash } from '@fortawesome/free-solid-svg-icons';
import { Card } from '../Card/Card';
import './List.scss';
import { TitleInput } from '../../../../components/TitleInput/TitleInput';
import api from '../../../../api/request';
import { AddCard } from './AddCard/AddCard';
import { IListProps } from '../../../../common/interfaces/Props';
import { ICard } from '../../../../common/interfaces/ICard';

export function List({ id, title, cards, onRequestMade, oldCards, setOldCards }: IListProps): ReactElement {
  const { boardId } = useParams();
  const [isEditingTitle, setIsEditingTitle] = useState(false);
  const [canRemoveSlot, setCanRemoveSlot] = useState(false);
  const [curCards, setCurCards] = useState<ICard[]>(cards);
  const slotRef = useRef<HTMLLIElement | null>(null);

  useEffect(() => setCurCards(cards), [cards]);

  async function editTitle(newTitle: string): Promise<void> {
    await api.put(`/board/${boardId}/list/${id}`, { title: newTitle });
    onRequestMade();
  }

  async function deleteList(): Promise<void> {
    await api.delete(`/board/${boardId}/list/${id}`);
    onRequestMade();
  }

  async function postNewCard(cardTitle: string): Promise<void> {
    await api.post(`/board/${boardId}/card`, { title: cardTitle, list_id: id, position: cards.length + 1 });
    onRequestMade();
  }

  async function moveCard(data: ICard[]): Promise<void> {
    await api.put(`/board/${boardId}/card`, data);
    onRequestMade();
  }
  function onDragStart(e: DragEvent): void {
    const element = e.target as HTMLLIElement;
    const newCards = [...curCards];
    const card = curCards.find((i) => i.title === element.innerText);
    if (card) {
      const slot = { id: 'slot', title: '', position: card.position };
      newCards.splice(cards.indexOf(card), 1);
      newCards.push(slot);
      element.addEventListener('dragend', () => setCurCards(newCards.map((i) => (i === slot ? card : i))));
      element.style.transform = 'rotate(5deg)';
      e.dataTransfer.setDragImage(element, 100, 10);
      e.dataTransfer.setData('text/json', JSON.stringify({ id: card.id, title: card.title }));
      setTimeout(() => {
        setCurCards(newCards);
      });
    }
  }

  function onDragLeave(): void {
    if (slotRef.current && canRemoveSlot) {
      const slotPos = curCards.findIndex((i) => i.id === 'slot');
      const newCards = curCards
        .map((i) => (i.position > slotPos ? { id: i.id, title: i.title, position: i.position - 1 } : i))
        .filter((i) => i.id !== 'slot');
      const newOldCards = newCards.map((i) => Object({ ...i, list_id: id }));
      setTimeout(() => {
        setCurCards(newCards);
        setOldCards(newOldCards);
      });
      setCanRemoveSlot(false);
    }
  }

  function onDragEnter(e: DragEvent): void {
    const element = e.target as HTMLElement;

    setTimeout(() => {
      setCanRemoveSlot(true);
      let newCards = [...curCards];
      const mousePos = e.clientY - element.getClientRects()[0].top;
      if (!curCards.find((i) => i.id === 'slot')) {
        const card = element.innerText ? curCards.find((i) => i.title === element.innerText) : undefined;
        if (element.classList.contains('card') && card && mousePos < 50) {
          newCards.push({ id: 'slot', title: '', position: card.position });
          newCards = newCards.map((i) =>
            i.position >= card.position && i.id !== 'slot' ? { id: i.id, title: i.title, position: i.position + 1 } : i
          );
        }
        if (element.classList.contains('add_btn')) {
          newCards.push({ id: 'slot', title: '', position: newCards.length + 1 });
        }
        setCurCards(newCards);
        setCanRemoveSlot(false);
      }
    });
  }

  function onDrop(e: DragEvent): void {
    const slot = curCards.find((i) => i.id === 'slot');
    if (slot) {
      const card = { ...JSON.parse(e.dataTransfer.getData('text/json')), position: slot.position };
      const newCards = [...curCards];
      newCards.push(card);
      newCards.splice(slot.position - 1, 1);
      setCurCards(newCards);
      if (oldCards) moveCard(oldCards.concat(newCards.map((i) => Object({ ...i, list_id: id }))));
    }
  }

  return (
    <div className="list" onDragLeave={onDragLeave} onDragEnter={onDragEnter}>
      <div className="list_head">
        <div className="title_container">
          {!isEditingTitle && (
            <h2 className="list_title" onClick={() => setIsEditingTitle(true)}>
              {title}
            </h2>
          )}
          {isEditingTitle && (
            <TitleInput title={title} editTitle={editTitle} hideInput={() => setIsEditingTitle(false)} />
          )}
        </div>
        <button className="delete-list_btn" onClick={deleteList}>
          {' '}
          <FontAwesomeIcon icon={faTrash} />
        </button>
      </div>
      <ul className="cards_parent">
        {curCards
          .sort((a, b) => a.position - b.position)
          .map((i) => {
            if (i.id !== 'slot') return <Card title={i.title} onDragStart={onDragStart} key={i.id} />;
            return (
              <li
                key={`${i.id}-${i.position}`}
                className="card-slot"
                ref={slotRef}
                onDragOver={(e) => e.preventDefault()}
                onDrop={onDrop}
              />
            );
          })}
      </ul>
      <AddCard postNewCard={postNewCard} />
    </div>
  );
}
