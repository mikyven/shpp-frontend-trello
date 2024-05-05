import { ReactElement } from 'react';

// eslint-disable-next-line @typescript-eslint/no-explicit-any
export function Board(props: { title: string; custom: Record<string, any> }): ReactElement {
  const { title, custom } = props;

  return (
    // eslint-disable-next-line @typescript-eslint/no-unsafe-assignment
    <div className="home_board">
      <p className="home_board_title">{title}</p>
      <div
        className="home_board_bg"
        style={
          // eslint-disable-next-line @typescript-eslint/no-unsafe-assignment
          { backgroundColor: custom.background || 'hsl(0, 0%, 30%)' }
        }
      />
    </div>
  );
}
