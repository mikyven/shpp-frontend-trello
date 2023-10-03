import React, { ReactElement, useState, useRef } from 'react';
import './cardtitle.scss';

export function CardTitle(props: {
  id: number;
  listId: number;
  title: string;
  onInputSubmit: (newTitle: string, type: string, hideFunc: () => void, id: number, listId: number) => Promise<void>;
}): ReactElement {
  const [isInputVisible, setIsInputVisible] = useState(false);
  const [inputValue, setInputValue] = useState('');
  const inputRef = useRef<HTMLInputElement | null>(null);
  const { id, listId, title, onInputSubmit } = props;

  const changeCardTitle = (): void => {
    setIsInputVisible(true);
    setInputValue(title);
    setTimeout(() => inputRef.current?.focus());
  };

  return (
    <>
      {!isInputVisible && (
        <p className="cardTitle" onClick={(): void => changeCardTitle()}>
          {title}
        </p>
      )}
      {isInputVisible && (
        <input
          className="cardTitleInput"
          ref={inputRef}
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
                'card',
                (): void => {
                  setIsInputVisible(false);
                },
                id,
                listId
              );
            }
          }}
          onBlur={(): void => {
            if (inputValue !== '' && inputValue.match(/[1-9a-zA-Z-._ ]/g)?.length === inputValue.length) {
              onInputSubmit(
                inputValue,
                'card',
                (): void => {
                  setIsInputVisible(false);
                },
                id,
                listId
              );
            }
          }}
        />
      )}
    </>
  );
}
