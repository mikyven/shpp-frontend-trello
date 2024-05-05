import { ReactElement, useState } from 'react';
import { Link } from 'react-router-dom';
import { Board } from './components/Board/Board';
import './Home.scss';

export function Home(): ReactElement {
  const [boards] = useState([
    { id: 1, title: 'покупки', custom: { background: 'red' } },
    { id: 2, title: 'підготовка до весілля', custom: { background: 'green' } },
    { id: 3, title: 'розробка інтернет-магазину', custom: { background: 'blue' } },
    { id: 4, title: 'курс по просуванню у соцмережах', custom: { background: 'grey' } },
  ]);

  return (
    <div className="home">
      <section className="home_head">
        <h1>Мої дошки</h1>
      </section>
      <section className="home_boards">
        {boards.map((i) => (
          <Link to={`board/${i.id}`} key={i.id} draggable={false}>
            <Board title={i.title} custom={i.custom} />
          </Link>
        ))}
        <button className="add-board_btn">+ Створити дошку</button>
      </section>
    </div>
  );
}
