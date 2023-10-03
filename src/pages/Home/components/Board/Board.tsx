import React, { ReactElement } from 'react';
import './board.scss';

export function Board(props: { title: string | undefined; background: string }): ReactElement {
  const { title, background } = props;
  return (
    <div
      className="homeBoardDiv"
      style={
        // eslint-disable-next-line no-nested-ternary
        background
          ? background.includes('base64')
            ? { backgroundImage: background, backgroundSize: 'cover' }
            : { backgroundColor: background }
          : { backgroundColor: '#e0e0e0' }
      }
    >
      <p
        className="homeBoardName"
        style={background && !/^#[a-z]/g.test(background) ? { color: 'white' } : { color: 'black' }}
      >
        {title}
      </p>
    </div>
  );
}
