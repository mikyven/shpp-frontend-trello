import { ReactElement } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import './Card.scss';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faFileLines } from '@fortawesome/free-solid-svg-icons';
import { CardProps } from '../../../../common/types/props';
import { useAppDispatch } from '../../../../store/hooks';
import { changeCardData, changeVisibility } from '../../../../store/slices/cardModalSlice';

export function Card({ data, onDragStart }: CardProps): ReactElement {
  const dispatch = useAppDispatch();
  const { boardId } = useParams();
  const navigate = useNavigate();

  function onClick(): void {
    dispatch(changeCardData(data));
    dispatch(changeVisibility(true));
    navigate(`/board/${boardId}/card/${data.id}`);
  }

  return (
    <li className="card" draggable onDragStart={onDragStart} onClick={onClick}>
      {data.title}
      <br />
      {data.description && <FontAwesomeIcon className="icon" icon={faFileLines} />}
    </li>
  );
}
