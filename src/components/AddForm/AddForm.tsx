import { ReactElement, useState } from 'react';
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
  submitOnBlur = false,
}: IAddForm): ReactElement {
  const [isShowingForm, setIsShowingForm] = useState(false);
  const [value, setValue] = useState('');

  const hideForm = (): void => {
    setValue('');
    setIsShowingForm(false);
  };

  const submitFunc = onSubmit(value, handleSubmit, hideForm);

  return (
    <div className={`add_modal ${parentClassName}`}>
      {!isShowingForm && (
        <button className="add_btn" onClick={() => setIsShowingForm(true)}>
          + {btnContent}
        </button>
      )}
      {isShowingForm && (
        <form onSubmit={submitFunc} onBlur={submitOnBlur ? submitFunc : (): null => null}>
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
