import { ReactElement, useState, useEffect, useRef } from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faCheck, faXmark } from '@fortawesome/free-solid-svg-icons';
import './CreateBoardModal.scss';
import { Input } from '../../../../components/Input/Input';
import { images } from '../../../../assets/images';
import { colors } from '../../../../assets/colors';
import { validationRegEx } from '../../../../common/constants/regex';
import useClickOutside from '../../../../hooks/useClickOutside';

type Props = {
  postNewBoard: (...args: string[]) => Promise<void>;
  closeModal: () => void;
};

export function CreateBoardModal({ postNewBoard, closeModal }: Props): ReactElement {
  const [isInputEmpty, setIsInputEmpty] = useState(true);
  const [titleInputValue, setTitleInputValue] = useState('');
  const [background, setBackground] = useState<string>('');
  const formRef = useRef<HTMLFormElement | null>(null);

  useEffect(() => setIsInputEmpty(!validationRegEx.test(titleInputValue)), [titleInputValue]);

  useClickOutside(formRef, closeModal);

  return (
    <form
      className="create-board_modal"
      ref={formRef}
      onSubmit={(e) => {
        e.preventDefault();
        postNewBoard(titleInputValue, background || '');
      }}
    >
      <div className="head">
        <h2 className="heading">Створити дошку</h2>
        <button className="close_btn" onClick={closeModal}>
          {' '}
          <FontAwesomeIcon icon={faXmark} />
        </button>
      </div>
      <div className="body">
        <div className="background">
          <label>Фон</label>
          <div className="images-container">
            {images.slice(0, 3).map((i) => (
              <button
                key={`image-${i.id}`}
                type="button"
                className={`background_btn image_btn${i.img === background ? ' current' : ''}`}
                style={{ background: `url(${i.img}) top/cover` }}
                onClick={() => setBackground(`url(${i.img}) top/cover`)}
              >
                {background?.includes(i.img) && <FontAwesomeIcon icon={faCheck} />}
              </button>
            ))}
          </div>
          <div className="colors-container">
            {colors.slice(0, 5).map((i) => (
              <button
                key={`${i}-color`}
                type="button"
                className={`background_btn color_btn${i === background ? ' current' : ''}`}
                style={{ background: i }}
                onClick={() => setBackground(i)}
              >
                {i === background && <FontAwesomeIcon icon={faCheck} />}
              </button>
            ))}
          </div>
        </div>
        <label className="name_label" htmlFor="name_input">
          Назва дошки<span className="required-star">*</span>
        </label>
        <Input
          name="name_input"
          className={`name_input ${isInputEmpty ? 'empty' : ''}`}
          placeholder="Введіть ім'я дошки..."
          value={titleInputValue}
          setValue={setTitleInputValue}
        />
        <button type="submit" className="submit_btn" disabled={isInputEmpty}>
          Створити
        </button>
      </div>
    </form>
  );
}
