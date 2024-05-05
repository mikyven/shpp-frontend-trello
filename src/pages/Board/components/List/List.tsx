import { ReactElement } from 'react';
import { ICard } from '../../../../common/interfaces/ICard';
import { Card } from '../Card/Card';
import './List.scss';

export function List(props: { title: string; cards: ICard[] }): ReactElement {
  const { title, cards } = props;

  return (
    <div className="list">
      <p className="list_title">{title}</p>
      <ul className="cards_parent">
        {cards.map((i) => (
          <Card title={i.title} key={i.id} />
        ))}
      </ul>
      <button className="add-card_btn">+ Додати картку</button>
    </div>
  );
}
