import { ReactElement, useState } from 'react';
import { onSubmit } from '../../common/constants/submitHandler';
import { Input } from '../Input/Input';
import { ITitleInput } from '../../common/interfaces/Props';
import './TitleInput.scss';

export function TitleInput({ title, editTitle, hideInput }: ITitleInput): ReactElement {
  const [value, setValue] = useState(title);

  return (
    <Input
      name="titleInput"
      className="title_input"
      onSubmit={onSubmit(value, editTitle, hideInput)}
      submitOnBlur
      {...{ value, setValue }}
    />
  );
}
