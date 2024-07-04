import { ReactElement } from 'react';
import './Board.scss';
import { Custom } from '../../../../common/types/types';

type Props = {
  title: string;
  custom: Custom;
};

export function Board({ title, custom }: Props): ReactElement {
  return (
    <button className="home_board">
      <p className="board_title">{title}</p>
      <div className="board_bg" style={custom?.background ? { background: custom.background } : {}} />
    </button>
  );
}
