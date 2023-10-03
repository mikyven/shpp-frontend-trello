import React, { ReactElement } from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faTrash } from '@fortawesome/free-solid-svg-icons';
import { ICard } from '../../../../common/interfaces/ICard';
import { Card } from '../Card/Card';
import { ListTitle } from './components/ListTitle/ListTitle';
import { CreateNewCard } from './components/CreateNewCard/CreateNewCard';
import './list.scss';

export function List(props: {
  id: number;
  title: string;
  cards: ICard[];
  onDeleteBtnClick: (id: number, type: string) => void;
  onTitleInputSubmit: (
    newTitle: string,
    type: string,
    hideFunc: () => void,
    id: number,
    list_id?: number
  ) => Promise<void>;
  onCardCreateInputSubmit: (cardTitle: string, type: string, hideFunc: () => void, list_id: number) => Promise<void>;
}): ReactElement {
  const { id, title, cards, onDeleteBtnClick, onTitleInputSubmit, onCardCreateInputSubmit } = props;

  return (
    <div className="list">
      <div>
        <ListTitle id={id} title={title} onInputSubmit={onTitleInputSubmit} />
        <button className="deleteBtn" onClick={(): void => onDeleteBtnClick(id, 'list')}>
          <FontAwesomeIcon icon={faTrash} size="2x" />
        </button>
      </div>
      <ul>
        {cards.map((i) => (
          <Card
            key={i.id}
            listId={id}
            id={i.id}
            title={i.title}
            onDeleteBtnClick={onDeleteBtnClick}
            onCardsTitleInputSubmit={onTitleInputSubmit}
          />
        ))}
      </ul>
      <CreateNewCard listId={id} onInputSubmit={onCardCreateInputSubmit} />
    </div>
  );
}
