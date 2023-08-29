import React, { ReactElement, useState, Fragment } from 'react';
import { List } from './components/List/List';
import './board.scss';

export function Board(): ReactElement {
  const [title] = useState('Моя тестова дошка');
  const [lists] = useState([
    {
      id: 1,
      title: 'Плани',
      cards: [
        { id: 2, title: 'приготувати суп' },
        { id: 3, title: 'сходити в магазин' },
      ],
    },
    {
      id: 2,
      title: 'В процесі',
      cards: [{ id: 4, title: 'подивитися серіал' }],
    },
    {
      id: 3,
      title: 'Зроблено',
      cards: [
        { id: 5, title: 'зробити домашку' },
        { id: 6, title: 'погуляти з собакой' },
      ],
    },
  ]);

  return (
    <>
      <h1>{title}</h1>
      <div className="lists">
        {lists.map((i) => (
          <List key={i.id} title={i.title} cards={i.cards} />
        ))}
        <button id="addListBtn">+ додати список</button>
      </div>
    </>
  );
}
