import React, { ReactElement, useState, useRef } from 'react';
import './listtitle.scss';

export function ListTitle(props: {
  id: number;
  title: string;
  onInputSubmit: (newTitle: string, type: string, hideFunc: () => void, id: number) => void;
}): ReactElement {
  const [isInputVisible, setIsInputVisible] = useState(false);
  const [inputValue, setInputValue] = useState('');
  const inputRef = useRef<HTMLInputElement | null>(null);
  const { id, title, onInputSubmit } = props;

  const changeListTitle = (): void => {
    setIsInputVisible(true);
    setInputValue(title);
    setTimeout(() => inputRef.current?.focus());
  };

  return (
    <>
      {!isInputVisible && (
        <p className="listTitle" onClick={(): void => changeListTitle()}>
          {title}
        </p>
      )}
      {isInputVisible && (
        <input
          ref={inputRef}
          className="listTitleInput"
          type="text"
          value={inputValue}
          onChange={(e: React.ChangeEvent<HTMLInputElement>): void => {
            setInputValue(e.target.value);
          }}
          onKeyDown={(e: React.KeyboardEvent): false | void => {
            if (
              e.key === 'Enter' &&
              inputValue !== '' &&
              inputValue.match(/[1-9a-zA-Z-._ ]/g)?.length === inputValue.length
            ) {
              onInputSubmit(
                inputValue,
                'list',
                (): void => {
                  setIsInputVisible(false);
                },
                id
              );
            }
          }}
          onBlur={(): void => {
            if (inputValue !== '' && inputValue.match(/[1-9a-zA-Z-._ ]/g)?.length === inputValue.length) {
              onInputSubmit(
                inputValue,
                'list',
                (): void => {
                  setIsInputVisible(false);
                },
                id
              );
            }
          }}
        />
      )}
    </>
  );
}
