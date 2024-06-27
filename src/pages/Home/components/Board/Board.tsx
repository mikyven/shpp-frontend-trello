import { ReactElement } from 'react';
import './Board.scss';
import { HomeBoardProps } from '../../../../common/types/props';

export function Board({ title, custom }: HomeBoardProps): ReactElement {
  return (
    <button className="home_board">
      <p className="board_title">{title}</p>
      <div className="board_bg" style={custom?.background ? { background: custom.background } : {}} />
    </button>
  );
}
