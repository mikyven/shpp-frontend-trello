import { ReactElement } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import './Card.scss';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faFileLines } from '@fortawesome/free-solid-svg-icons';
import { useAppDispatch } from '../../../../store/hooks';
import { changeCardData, changeModalVisibility } from '../../../../store/slices/cardModalSlice';
import { TCard } from '../../../../common/types/types';

type Props = {
  data: TCard & { list: { id: number; title: string } };
  onDragStart: (e: React.DragEvent) => void;
};

export function Card({ data, onDragStart }: Props): ReactElement {
  const dispatch = useAppDispatch();
  const { boardId } = useParams();
  const navigate = useNavigate();

  function onClick(): void {
    dispatch(changeCardData(data));
    dispatch(changeModalVisibility(true));
    navigate(`/board/${boardId}/card/${data.id}`);
  }

  return (
    <li className="card" draggable onDragStart={onDragStart} onClick={onClick}>
      {data.title}
      {data.description && <FontAwesomeIcon className="icon" icon={faFileLines} />}
    </li>
  );
}
