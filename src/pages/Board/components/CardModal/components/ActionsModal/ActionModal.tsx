import { ReactElement, useState, useRef, useEffect } from 'react';
import { Input } from '../../../../../../components/Input/Input';
import { useAppSelector } from '../../../../../../store/hooks';
import { Selects } from '../Selects/Selects';
import './ActionModal.scss';

type Props = {
  type: string;
  name: string;
  left: string;
  top: string;
  closeModal: () => void;
  onSubmit: () => Promise<void>;
};

export function ActionModal({ type, left, top, closeModal, onSubmit, name }: Props): ReactElement {
  const { data } = useAppSelector((state) => state.cardModal);
  const [value, setValue] = useState(data?.title || '');
  const modalRef = useRef<HTMLDivElement | null>(null);

  useEffect(() => {
    const onClick = (e: MouseEvent): void => {
      if (
        !modalRef.current?.contains(e.target as HTMLElement) &&
        !(e.target as HTMLElement).classList.contains(`${type}-card-element`)
      )
        closeModal();
    };
    document.addEventListener('click', onClick);

    return (): void => {
      document.removeEventListener('click', onClick);
    };
  });

  return (
    <div className={`${type}-card_modal modal`} ref={modalRef} style={{ left, top }}>
      <p className="title">{name} картку</p>
      {type === 'copy' && (
        <label className="title-input_label">
          Назва
          <Input name={`${type}-title-input`} onSubmit={() => false} {...{ value, setValue }} />
        </label>
      )}
      <div className="select-container">
        <Selects />
      </div>
      <button className={`${type}-card_btn`} onClick={onSubmit}>
        {name}
      </button>
    </div>
  );
}
