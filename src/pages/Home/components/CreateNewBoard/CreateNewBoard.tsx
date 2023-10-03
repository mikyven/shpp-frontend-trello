import React, { ReactElement, useState, useRef } from 'react';
import './createnewboard.scss';

export function CreateNewBoard(props: { onBoardCreated: (title: string) => Promise<void> }): ReactElement {
  const [inputValue, setInputValue] = useState('');
  const [isFormVisible, setIsFormVisible] = useState(false);
  const [isMouseOverForm, setIsMouseOverForm] = useState(false);

  const inputRef = useRef<HTMLInputElement | null>(null);

  const { onBoardCreated } = props;

  const addBoardFunc = (): void => {
    setIsFormVisible(true);
    setInputValue('');

    setTimeout(() => inputRef.current?.focus());
  };

  const submitFunc = (e: React.FormEvent): void => {
    e.preventDefault();

    if (inputValue !== '' && inputValue.match(/[1-9a-zA-Z-._ ]/g)?.length === inputValue.length) {
      onBoardCreated(inputValue);
    }

    setInputValue('');
    setIsFormVisible(false);
  };

  return (
    <>
      {!isFormVisible && (
        <button className="addBoardBtn" onClick={(): void => addBoardFunc()}>
          + створити дошку
        </button>
      )}
      {isFormVisible && (
        <form
          className="createNewBoardForm"
          onSubmit={submitFunc}
          onMouseEnter={(): void => setIsMouseOverForm(true)}
          onMouseLeave={(): void => setIsMouseOverForm(false)}
          onBlur={(): false | void => !isMouseOverForm && setIsFormVisible(false)}
        >
          <label>
            Назва дошки:
            <input
              ref={inputRef}
              value={inputValue}
              onChange={(e: React.ChangeEvent<HTMLInputElement>): void => {
                setInputValue(e.target.value);
              }}
              type="text"
            />
          </label>
          <input type="submit" value="Створити" />
        </form>
      )}
    </>
  );
}
