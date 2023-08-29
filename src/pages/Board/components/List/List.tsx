import React, { ReactElement } from 'react';
import { LCard } from '../../../../common/interfaces/lCard';
import { Card } from '../Card/Card';
import './list.scss';

export function List(props: { title: string; cards: LCard[] }): ReactElement {
  const { title, cards } = props;
  return (
    <div className="list">
      <p>{title}</p>
      <ul>
        {cards.map((i) => (
          <Card title={i.title} key={i.id} />
        ))}
      </ul>
      <button id="addCardBtn">+ додати картку</button>
    </div>
  );
}
