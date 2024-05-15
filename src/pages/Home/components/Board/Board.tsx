import { ReactElement } from 'react';
import './Board.scss';

// eslint-disable-next-line @typescript-eslint/no-explicit-any
export function Board(props: { title: string; custom: Record<string, any> }): ReactElement {
  const { title, custom } = props;

  return (
    /* maybe i should turn this to button for styles */
    <div className="home_board">
      <p className="board_title">{title}</p>
      <div className="board_bg" style={custom?.background ? { background: custom.background } : {}} />
    </div>
  );
}
