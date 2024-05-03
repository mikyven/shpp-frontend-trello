import { ReactElement, useState } from 'react';
import { List } from './components/List/List';
import './Board.scss';

export function Board(): ReactElement {
  const [title] = useState('Моя тестова дошка');
  const [lists] = useState([
    {
      id: 1,
      title: 'Плани',
      cards: [
        { id: 1, title: 'помити кота' },
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
    {
      id: 4,
      title: 'Плани',
      cards: [],
    },
    {
      id: 5,
      title: 'Плани',
      cards: [],
    },
    {
      id: 6,
      title: 'Плани',
      cards: [],
    },
  ]);

  return (
    <div className="board">
      <header className="board_header">
        <h1 className="board_title">{title}</h1>
      </header>
      <section className="list_parent">
        {lists.map((i) => (
          <List key={i.id} title={i.title} cards={i.cards} />
        ))}
        <button className="add-list_btn">+ Додати список</button>
      </section>
    </div>
  );
}
