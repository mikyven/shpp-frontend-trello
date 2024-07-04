import { ReactElement, useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Board } from './components/Board/Board';
import { CreateBoardModal } from './components/CreateBoardModal/CreateBoardModal';
import './Home.scss';
import { createNewBoard, getBoards, setIsLoading } from '../../store/slices/boardSlice';
import { useAppDispatch, useAppSelector } from '../../store/hooks';

export function Home(): ReactElement {
  const navigate = useNavigate();
  const dispatch = useAppDispatch();
  const { boards } = useAppSelector((state) => state.board);

  const [isAddingBoard, setIsAddingBoard] = useState(false);

  useEffect(() => {
    dispatch(getBoards());
    dispatch(setIsLoading(true));
  }, []);

  async function postNewBoard(title: string, background: string): Promise<void> {
    const id = await dispatch(createNewBoard({ title, background })).then(
      (response) => response && response.payload && (response.payload as unknown as { id: number }).id
    );
    if (id) {
      navigate(`/board/${id}`);
    }
  }

  document.title = 'Мої дошки | Trello';

  return (
    <div className="home">
      <section className="head">
        <h1>Мої дошки</h1>
        <button
          className="log-out_btn"
          onClick={() => {
            localStorage.clear();
            navigate('/login');
          }}
        >
          Вийти
        </button>
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
  );
}
