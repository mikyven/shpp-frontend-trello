import { ReactElement } from 'react';
import './Card.scss';
import { ICardProps } from '../../../../common/interfaces/Props';

export function Card({ title, onDragStart }: ICardProps): ReactElement {
  return (
    <li className="card" draggable onDragStart={onDragStart}>
      {title}
    </li>
  );
}
