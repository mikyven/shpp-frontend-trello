import { ReactElement } from 'react';
import { ICard } from '../../../../common/interfaces/ICard';
import './List.scss';

// eslint-disable-next-line react/no-unused-prop-types
export function List(props: { title: string; cards: ICard[] }): ReactElement {
  const { title } = props;

  return (
    <div className="list">
      <p className="list_title">{title}</p>
    </div>
  );
}
