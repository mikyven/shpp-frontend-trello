import { ReactElement } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import './Card.scss';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faFileLines } from '@fortawesome/free-solid-svg-icons';
import { ICardProps } from '../../../../common/interfaces/Props';

export function Card({ data, onDragStart, onDragOver }: ICardProps): ReactElement {
  const { boardId } = useParams();
  const navigate = useNavigate();

  function onClick(): void {
    navigate(`/board/${boardId}/card/${data.id}`);
  }

  return (
    <li className="card" draggable onDragStart={onDragStart} onDragOver={onDragOver} onClick={onClick}>
      {data.title}
      {data.description && <FontAwesomeIcon className="icon" icon={faFileLines} />}
    </li>
  );
}
