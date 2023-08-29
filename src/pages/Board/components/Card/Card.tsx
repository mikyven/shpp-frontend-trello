import React, { ReactElement } from 'react';
import './card.scss';

export function Card(props: { title: string }): ReactElement {
  const { title } = props;
  return <li>{title}</li>;
}
