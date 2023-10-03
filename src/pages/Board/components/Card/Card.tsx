import React, { ReactElement } from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faTrash } from '@fortawesome/free-solid-svg-icons';
import { CardTitle } from './components/CardTitle';
import './card.scss';

export function Card(props: {
  id: number;
  listId: number;
  title: string;
  onDeleteBtnClick: (id: number, type: string) => void;
  onCardsTitleInputSubmit: (
    newTitle: string,
    type: string,
    hideFunc: () => void,
    id: number,
    listId: number
  ) => Promise<void>;
}): ReactElement {
  const { id, listId, title, onDeleteBtnClick, onCardsTitleInputSubmit } = props;
  return (
    <li>
      <CardTitle id={id} listId={listId} title={title} onInputSubmit={onCardsTitleInputSubmit} />
      <button className="deleteBtn" onClick={(): void => onDeleteBtnClick(id, 'card')}>
        <FontAwesomeIcon icon={faTrash} size="2x" />
      </button>
    </li>
  );
}
