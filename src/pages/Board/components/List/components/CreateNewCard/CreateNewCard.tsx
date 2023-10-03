import React, { ReactElement, useState, useRef } from 'react';

export function CreateNewCard(props: {
  listId: number;
  onInputSubmit: (title: string, type: string, hideFunc: () => void, list_id: number) => void;
}): ReactElement {
  const [isCardsInputVisible, setIsCardsInputVisible] = useState(false);
  const [cardsInputValue, setCardsInputValue] = useState('');
  const [isMouseOverCardForm, setIsMouseOverCardForm] = useState(false);
  const cardsInputRef = useRef<HTMLInputElement | null>(null);

  const { onInputSubmit, listId } = props;

  return (
    <>
      {!isCardsInputVisible && (
        <button
          id="addCardBtn"
          onClick={(): void => {
            setIsCardsInputVisible(true);
            setTimeout(() => cardsInputRef.current?.focus());
          }}
        >
          + додати картку
        </button>
      )}
      {isCardsInputVisible && (
        <form
          className="addCardForm"
          onSubmit={(e: React.FormEvent): void => {
            e.preventDefault();

            onInputSubmit(cardsInputValue, 'card', () => setIsCardsInputVisible(false), listId);
          }}
          onMouseEnter={(): void => setIsMouseOverCardForm(true)}
          onMouseLeave={(): void => setIsMouseOverCardForm(false)}
          onBlur={(): void => {
            if (!isMouseOverCardForm) setIsCardsInputVisible(false);
          }}
        >
          <input
            ref={cardsInputRef}
            onChange={(e: React.ChangeEvent<HTMLInputElement>): void => {
              setCardsInputValue(e.target.value);
            }}
            type="text"
            placeholder="вкажіть ім'я картки"
          />
          <input type="submit" value="додати картку" />
        </form>
      )}
    </>
  );
}
