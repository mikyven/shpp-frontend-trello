import { ReactElement, useRef, useState } from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faXmark } from '@fortawesome/free-solid-svg-icons';
import { onSubmit } from '../../common/constants/submitHandler';
import { Input } from '../Input/Input';
import './AddForm.scss';
import useClickOutside from '../../hooks/useClickOutside';

type Props = {
  parentClassName: string;
  inputName: string;
  inputPlaceholder: string;
  btnContent: string;
  handleSubmit: (value: string) => Promise<void>;
};

export function AddForm({
  parentClassName,
  inputName,
  inputPlaceholder,
  btnContent,
  handleSubmit,
}: Props): ReactElement {
  const [isShowingForm, setIsShowingForm] = useState(false);
  const [value, setValue] = useState('');
  const modalRef = useRef<HTMLDivElement | null>(null);
  const hideForm = (): void => {
    setValue('');
    setIsShowingForm(false);
  };

  const submitFunc = onSubmit(value, handleSubmit, hideForm);

  useClickOutside(modalRef, submitFunc);

  return (
    <div className={`add_modal ${parentClassName}`} ref={modalRef}>
      {!isShowingForm && (
        <button className={`add_btn ${parentClassName}_btn`} onClick={() => setIsShowingForm(true)}>
          + {btnContent}
        </button>
      )}
      {isShowingForm && (
        <form onSubmit={submitFunc}>
          <Input name={inputName} placeholder={inputPlaceholder} {...{ value, setValue }} />
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
