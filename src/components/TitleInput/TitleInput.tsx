import { ReactElement, useState } from 'react';
import { onSubmit } from '../../common/constants/submitHandler';
import { Input } from '../Input/Input';
import { ITitleInput } from '../../common/interfaces/Props';
import './TitleInput.scss';

export function TitleInput({ title, editTitle, hideInput, adaptive = false }: ITitleInput): ReactElement {
  const [value, setValue] = useState(title);

  return (
    <>
      {adaptive && (
        <div className="resize-container">
          <span className="resize-text">{value}</span>
          <Input
            name="titleInput"
            className="title_input"
            onSubmit={onSubmit(value, editTitle, hideInput)}
            submitOnBlur
            escapeFunction={hideInput}
            {...{ value, setValue }}
          />
        </div>
      )}
      {!adaptive && (
        <Input
          name="titleInput"
          className="title_input"
          onSubmit={onSubmit(value, editTitle, hideInput)}
          submitOnBlur
          escapeFunction={hideInput}
          {...{ value, setValue }}
        />
      )}
    </>
  );
}
