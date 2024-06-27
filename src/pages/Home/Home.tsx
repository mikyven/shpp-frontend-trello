import { ReactElement, useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { Board } from './components/Board/Board';
import { CreateBoardModal } from './components/CreateBoardModal/CreateBoardModal';
import './Home.scss';
import { Interceptors } from '../../components/Interceptors/Interceptors';
import { createNewBoard, getBoards } from '../../store/slices/boardSlice';
import { useAppDispatch, useAppSelector } from '../../store/hooks';

export function Home(): ReactElement {
  const dispatch = useAppDispatch();
  const { boards } = useAppSelector((state) => state.board);
  const [isAddingBoard, setIsAddingBoard] = useState(false);

  useEffect(() => {
    dispatch(getBoards());
  }, []);

  async function postNewBoard(title: string, background: string): Promise<void> {
    const { id } = (await dispatch(createNewBoard({ title, background }))).payload as unknown as {
      id: number;
    };
    window.location.href = `/board/${id}`;
  }

  document.title = 'Мої дошки | Trello';

  return (
    <>
      <Interceptors />
      <div className="home">
        <section className="head">
          <h1>Мої дошки</h1>
        </section>
        <section className="boards">
          {boards.map((i) => (
            <Link to={`board/${i.id}`} key={i.id} draggable={false}>
              <Board title={i.title} custom={i.custom} />
            </Link>
          ))}
          <button className="create-board_btn" onClick={() => setIsAddingBoard(!isAddingBoard)}>
            + Створити дошку
          </button>
          {isAddingBoard && <CreateBoardModal postNewBoard={postNewBoard} closeModal={() => setIsAddingBoard(false)} />}
        </section>
      </div>
    </>
  );
}
