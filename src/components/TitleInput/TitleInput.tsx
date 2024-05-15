import { ReactElement, useRef } from 'react';
import './TitleInput.scss';

export function TitleInput(props: { title: string; onTitleEdited: (newTitle: string) => Promise<void> }): ReactElement {
  const { title, onTitleEdited } = props;
  const inputRef = useRef<HTMLInputElement | null>(null);

  function checkNewTitle(): void {
    const value = inputRef.current?.value || '';

    if (value && /^[А-ЯҐЄІЇ\w ._-]+$/gi.test(value)) {
      onTitleEdited(value);
    }
  }

  return (
    <input
      className="title_input"
      autoComplete="off"
      defaultValue={title}
      ref={(input) => {
        input?.focus();
        input?.select();
        inputRef.current = input;
      }}
      onKeyDown={(e) => (e.key === 'Enter' ? checkNewTitle() : null)}
      onBlur={checkNewTitle}
    />
  );
}
