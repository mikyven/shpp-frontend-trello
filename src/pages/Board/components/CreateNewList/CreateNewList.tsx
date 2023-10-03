import React, { ReactElement, useState, useRef } from 'react';
import './createnewlist.scss';

export function CreateNewList(props: {
  onInputSubmit: (title: string, type: string, hideFunc: () => void) => void;
}): ReactElement {
  const [isMouseOverListForm, setIsMouseOverListForm] = useState(false);
  const [isListsInputVisible, setIsListsInputVisible] = useState(false);
  const [listsInputValue, setListsInputValue] = useState('');
  const listsInputRef = useRef<HTMLInputElement | null>(null);
  const { onInputSubmit } = props;

  return (
    <>
      {!isListsInputVisible && (
        <button
          className="addListBtn"
          onClick={(): void => {
            setIsListsInputVisible(true);
            setTimeout(() => listsInputRef.current?.focus());
          }}
        >
          + додати список
        </button>
      )}
      {isListsInputVisible && (
        <form
          className="addListForm"
          onSubmit={(e: React.FormEvent): void => {
            e.preventDefault();

            onInputSubmit(listsInputValue, 'list', () => setIsListsInputVisible(false));
          }}
          onMouseEnter={(): void => setIsMouseOverListForm(true)}
          onMouseLeave={(): void => setIsMouseOverListForm(false)}
          onBlur={(): void => {
            if (!isMouseOverListForm) setIsListsInputVisible(false);
          }}
        >
          <input
            ref={listsInputRef}
            onChange={(e: React.ChangeEvent<HTMLInputElement>): void => {
              setListsInputValue(e.target.value);
            }}
            type="text"
            placeholder="вкажіть ім'я списку"
          />
          <input type="submit" value="додати список" />
        </form>
      )}
    </>
  );
}
