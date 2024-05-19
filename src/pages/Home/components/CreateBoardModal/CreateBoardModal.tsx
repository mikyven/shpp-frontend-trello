import { ReactElement, useState, useEffect } from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faXmark } from '@fortawesome/free-solid-svg-icons';
import './CreateBoardModal.scss';
import { onSubmit } from '../../../../common/constants/submitHandler';
import { Input } from '../../../../components/Input/Input';
import { ICreateBoardModal } from '../../../../common/interfaces/Props';

export function CreateBoardModal({ postNewBoard, closeModal }: ICreateBoardModal): ReactElement {
  const [isInputEmpty, setIsInputEmpty] = useState(true);
  const [value, setValue] = useState('');

  const checkIsEmpty = (str: string): void => setIsInputEmpty(!str);

  useEffect(() => checkIsEmpty(value), [value]);

  return (
    <form className="create-board_modal" onSubmit={onSubmit(value, postNewBoard, closeModal)}>
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
        <Input
          name="name_input"
          className={`name_input ${isInputEmpty ? 'empty' : ''}`}
          placeholder="Введіть ім'я дошки..."
          onSubmit={onSubmit(value, postNewBoard, closeModal)}
          {...{ value, setValue }}
        />
        <button type="submit" className="submit_btn" disabled={isInputEmpty}>
          Створити
        </button>
      </div>
    </form>
  );
}
