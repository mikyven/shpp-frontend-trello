import { ReactElement } from 'react';
import './Card.scss';

export function Card(props: { title: string }): ReactElement {
  const { title } = props;

  return (
    <li className="card">
      <p className="card_title">{title}</p>
    </li>
  );
}
