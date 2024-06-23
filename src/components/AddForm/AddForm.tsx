import { ReactElement, useEffect, useRef, useState } from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faXmark } from '@fortawesome/free-solid-svg-icons';
import { onSubmit } from '../../common/constants/submitHandler';
import { Input } from '../Input/Input';
import { IAddForm } from '../../common/interfaces/Props';
import './AddForm.scss';

export function AddForm({
  parentClassName,
  inputName,
  inputPlaceholder,
  btnContent,
  handleSubmit,
}: IAddForm): ReactElement {
  const [isShowingForm, setIsShowingForm] = useState(false);
  const [value, setValue] = useState('');
  const modalRef = useRef<HTMLDivElement | null>(null);
  const hideForm = (): void => {
    setValue('');
    setIsShowingForm(false);
  };

  const submitFunc = onSubmit(value, handleSubmit, hideForm);

  useEffect(() => {
    const clickListener = (e: MouseEvent): void => {
      const element = e.target as HTMLElement;
      if (!modalRef.current?.contains(element) && !element.classList.contains(`${parentClassName}_btn`)) submitFunc();
    };

    document.addEventListener('click', clickListener);
    return (): void => document.removeEventListener('click', clickListener);
  });

  return (
    <div className={`add_modal ${parentClassName}`} ref={modalRef}>
      {!isShowingForm && (
        <button className={`add_btn ${parentClassName}_btn`} onClick={() => setIsShowingForm(true)}>
          + {btnContent}
        </button>
      )}
      {isShowingForm && (
        <form onSubmit={submitFunc}>
          <Input name={inputName} placeholder={inputPlaceholder} onSubmit={submitFunc} {...{ value, setValue }} />
          <div className="btn_container">
            <button type="submit" className="submit_btn">
              {btnContent}
            </button>
            <button type="button" className="close_btn" onClick={hideForm}>
              {' '}
              <FontAwesomeIcon icon={faXmark} />
            </button>
          </div>
        </form>
      )}
    </div>
  );
}
