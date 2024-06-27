import { ReactElement, useState, useEffect, useRef } from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faCheck, faXmark } from '@fortawesome/free-solid-svg-icons';
import './CreateBoardModal.scss';
import { onSubmit } from '../../../../common/constants/submitHandler';
import { Input } from '../../../../components/Input/Input';
import { CreateBoardModalProps } from '../../../../common/types/props';
import { images } from '../../../../assets/images';
import { colors } from '../../../../assets/colors';

export function CreateBoardModal({ postNewBoard, closeModal }: CreateBoardModalProps): ReactElement {
  const [isInputEmpty, setIsInputEmpty] = useState(true);
  const [value, setValue] = useState('');
  const [background, setBackground] = useState<string>('');
  const formRef = useRef<HTMLFormElement | null>(null);

  useEffect(() => setIsInputEmpty(!value), [value]);

  useEffect(() => {
    const onMouseDown = (e: MouseEvent): void => {
      if (
        formRef.current?.contains(e.target as HTMLElement) ||
        (e.target as HTMLElement).className === 'create-board_btn'
      )
        return;
      closeModal();
    };

    document.addEventListener('mousedown', onMouseDown);

    return (): void => {
      document.removeEventListener('mousedown', onMouseDown);
    };
  });

  return (
    <form className="create-board_modal" ref={formRef} onSubmit={onSubmit(value, postNewBoard, closeModal)}>
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
