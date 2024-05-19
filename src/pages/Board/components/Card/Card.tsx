import { ReactElement } from 'react';
import './Card.scss';
import { ICardProps } from '../../../../common/interfaces/Props';

export function Card({ title }: ICardProps): ReactElement {
  return (
    <li className="card">
      <p className="card_title">{title}</p>
    </li>
  );
}
