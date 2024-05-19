import { ReactElement, useState } from 'react';
import { useParams } from 'react-router-dom';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faTrash } from '@fortawesome/free-solid-svg-icons';
import { Card } from '../Card/Card';
import './List.scss';
import { TitleInput } from '../../../../components/TitleInput/TitleInput';
import api from '../../../../api/request';
import { AddCard } from './AddCard/AddCard';
import { IListProps } from '../../../../common/interfaces/Props';

export function List({ id, title, cards, onRequestMade }: IListProps): ReactElement {
  const { boardId } = useParams();
  const [isEditingTitle, setIsEditingTitle] = useState(false);

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

  return (
    <div className="list">
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
        {cards.map((i) => (
          <Card title={i.title} key={i.id} />
        ))}
        <AddCard postNewCard={postNewCard} />
      </ul>
    </div>
  );
}
