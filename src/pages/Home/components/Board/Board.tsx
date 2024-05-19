import { ReactElement } from 'react';
import './Board.scss';
import { IHomeBoard } from '../../../../common/interfaces/Props';

export function Board({ title, custom }: IHomeBoard): ReactElement {
  return (
    <button className="home_board">
      <p className="board_title">{title}</p>
      <div className="board_bg" style={custom?.background ? { background: custom.background } : {}} />
    </button>
  );
}
