import { FormEvent, ReactElement, useState } from 'react';
import { useParams } from 'react-router-dom';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faTrash, faXmark } from '@fortawesome/free-solid-svg-icons';
import { ICard } from '../../../../common/interfaces/ICard';
import { Card } from '../Card/Card';
import './List.scss';
import { TitleInput } from '../../../../components/TitleInput/TitleInput';
import api from '../../../../api/request';

export function List(props: { id: number; title: string; cards: ICard[]; onRequestMade: () => void }): ReactElement {
  const { id, title, cards, onRequestMade } = props;
  const { boardId } = useParams();
  const [isEditingTitle, setIsEditingTitle] = useState(false);
  const [isAddingCard, setIsAddingCard] = useState(false);
  const [cardInputValue, setCardInputValue] = useState<string>('');

  async function onTitleEdited(newTitle: string): Promise<void> {
    setIsEditingTitle(false);
    if (newTitle && /^[А-ЯҐЄІЇ\w ._-]+$/gi.test(newTitle)) {
      await api.put(`/board/${boardId}/list/${id}`, { title: newTitle });
      onRequestMade();
    }
  }

  async function onListDeleted(): Promise<void> {
    await api.delete(`/board/${boardId}/list/${id}`);
    onRequestMade();
  }

  async function postNewCard(cardTitle: string): Promise<void> {
    await api.post(`/board/${boardId}/card`, { title: cardTitle, list_id: id, position: cards.length + 1 });
    onRequestMade();
  }

  function onCardCreated(e: FormEvent): void {
    e.preventDefault();
    if (cardInputValue && /^[А-ЯҐЄІЇ\w ._-]+$/gi.test(cardInputValue)) {
      postNewCard(cardInputValue);
    }
    setCardInputValue('');
    setIsAddingCard(false);
  }

  return (
    <div className="list">
      <div className="list_head">
        {!isEditingTitle && (
          <h2 className="list_title" onClick={() => setIsEditingTitle(true)}>
            {title}
          </h2>
        )}
        {isEditingTitle && <TitleInput title={title} onTitleEdited={onTitleEdited} />}
        <button className="delete-list_btn" onClick={onListDeleted}>
          {' '}
          <FontAwesomeIcon icon={faTrash} />
        </button>
      </div>
      <ul className="cards_parent">
        {cards.map((i) => (
          <Card title={i.title} key={i.id} />
        ))}
      </ul>
      {!isAddingCard && (
        <button className="add-card_btn" onClick={() => setIsAddingCard(true)}>
          + Додати картку
        </button>
      )}
      {isAddingCard && (
        <form className="add-card_modal" onSubmit={onCardCreated}>
          <input
            placeholder="Введіть ім'я картки..."
            ref={(input) => input?.focus()}
            value={cardInputValue}
            onChange={(e) => setCardInputValue(e.target.value)}
            onKeyDown={(e) => e.key === 'Enter' && onCardCreated}
          />
          <div className="btn-container">
            <button className="submit_btn" type="submit">
              Додати картку
            </button>
            <button className="close_btn" type="button" onClick={() => setIsAddingCard(false)}>
              {' '}
              <FontAwesomeIcon icon={faXmark} />
            </button>
          </div>
        </form>
      )}
    </div>
  );
}
