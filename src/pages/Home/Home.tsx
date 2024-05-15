import { ReactElement, useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { Board } from './components/Board/Board';
import { CreateBoardModal } from './components/CreateBoardModal/CreateBoardModal';
import api from '../../api/request';
import './Home.scss';

interface IBoard {
  id: number;
  title: string;
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  custom?: any;
}

export function Home(): ReactElement {
  const [isAddingBoard, setIsAddingBoard] = useState(false);
  const [boardsList, setBoardsList] = useState<IBoard[]>([]);

  useEffect(() => {
    const fetchBoards = async (): Promise<void> => {
      const { boards }: { boards: IBoard[] } = await api.get('/board/');
      setBoardsList(boards);
    };

    fetchBoards();
  }, []);

  async function postNewBoard(title: string): Promise<void> {
    const { id }: { id: number } = await api.post('/board', { title });

    const { boards }: { boards: IBoard[] } = await api.get('/board');
    setBoardsList(boards);
    window.location.href = `/board/${id}`;
  }

  return (
    <div className="home">
      <section className="head">
        <h1>Мої дошки</h1>
      </section>
      <section className="boards">
        {boardsList.map((i) => (
          <Link to={`board/${i.id}`} key={i.id} draggable={false}>
            <Board title={i.title} custom={i.custom || {}} />
          </Link>
        ))}
        <button className="create-board_btn" onClick={() => setIsAddingBoard(!isAddingBoard)}>
          + Створити дошку
        </button>
        {isAddingBoard && <CreateBoardModal postNewBoard={postNewBoard} closeModal={() => setIsAddingBoard(false)} />}
      </section>
    </div>
  );
}
