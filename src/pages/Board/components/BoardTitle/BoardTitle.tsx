import React, { useState, useRef, ReactElement } from 'react';
import './boardtitle.scss';

export function BoardTitle(props: {
  title: string;
  setNewTitle: (newTitle: string, type: string, hideFunc: () => void) => Promise<void>;
  bgColor: string;
}): ReactElement {
  const [isTitleInputVisible, setIsTitleInputVisible] = useState(false);
  const [titleInputValue, setTitleInputValue] = useState('');
  const titleInputRef = useRef<HTMLInputElement | null>(null);

  const { title, setNewTitle, bgColor } = props;

  const changeTitle = (): void => {
    setIsTitleInputVisible(true);
    setTitleInputValue(title);
    setTimeout(() => titleInputRef.current?.focus());
  };

  const onTitleInputSubmit = async (): Promise<void> => {
    setNewTitle(titleInputValue, 'board', () => setIsTitleInputVisible(false));
  };

  return (
    <>
      {!isTitleInputVisible && (
        <h1
          className="boardTitle"
          style={{ color: /^#[a-z]/g.test(bgColor) ? 'black' : 'white' }}
          onClick={changeTitle}
        >
          {title}
        </h1>
      )}
      {isTitleInputVisible && (
        <input
          ref={titleInputRef}
          className="boardTitleInput"
          type="text"
          value={titleInputValue}
          onChange={(e: React.ChangeEvent<HTMLInputElement>): void => {
            setTitleInputValue(e.target.value);
          }}
          onKeyDown={(e: React.KeyboardEvent): false | void => {
            if (
              e.key === 'Enter' &&
              titleInputValue !== '' &&
              titleInputValue.match(/[1-9a-zA-Z-._ ]/g)?.length === titleInputValue.length
            )
              onTitleInputSubmit();
          }}
          onBlur={(): void => {
            if (titleInputValue !== '' && titleInputValue.match(/[1-9a-zA-Z-._ ]/g)?.length === titleInputValue.length)
              onTitleInputSubmit();
          }}
        />
      )}
    </>
  );
}
