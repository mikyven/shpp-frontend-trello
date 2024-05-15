import { ReactElement, useState, useRef, FormEvent, useEffect } from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faXmark } from '@fortawesome/free-solid-svg-icons';
import './CreateBoardModal.scss';

export function CreateBoardModal(props: {
  postNewBoard: (title: string) => Promise<void>;
  closeModal: () => void;
}): ReactElement {
  const { postNewBoard, closeModal } = props;
  const [isInputEmpty, setIsInputEmpty] = useState(true);
  const inputRef = useRef<HTMLInputElement | null>(null);
  const [value, setValue] = useState<string>('');

  useEffect((): void => {
    if (!value) {
      inputRef.current?.classList.add('empty');
      setIsInputEmpty(true);
      return;
    }
    inputRef.current?.classList.remove('empty');
    setIsInputEmpty(false);
  }, [value]);

  function onBoardCreated(e: FormEvent): void {
    e.preventDefault();
    if (/^[А-ЯҐЄІЇ\w ._-]+$/gi.test(value)) {
      postNewBoard(value);
    }
    closeModal();
  }

  return (
    <form className="create-board_modal" onSubmit={onBoardCreated}>
      <div className="head">
        <h2 className="heading">Створити дошку</h2>
        <button className="close_btn" onClick={closeModal}>
          {' '}
          <FontAwesomeIcon icon={faXmark} />
        </button>
      </div>

      <div className="body">
        <label className="name_label" htmlFor="name_input">
          Назва дошки<span className="required-star">*</span>
        </label>
        <input
          type="text"
          id="name_input"
          className="name_input"
          placeholder="Введіть ім'я дошки..."
          autoComplete="off"
          value={value}
          ref={(input) => {
            input?.focus();
            inputRef.current = input;
          }}
          onChange={(e) => setValue(e.target.value)}
          onKeyDown={(e) => e.key === 'Enter' && onBoardCreated(e)}
        />
        <button type="submit" className="submit_btn" disabled={isInputEmpty}>
          Створити
        </button>
      </div>
    </form>
  );
}
