import { ReactElement } from 'react';
import './AddCard.scss';
import { AddForm } from '../../../../../components/AddForm/AddForm';
import { IAddCard } from '../../../../../common/interfaces/Props';

export function AddCard({ postNewCard }: IAddCard): ReactElement {
  return (
    <AddForm
      parentClassName="add-card"
      inputName="addCardInput"
      inputPlaceholder="Введіть ім'я картки"
      btnContent="Додати картку"
      handleSubmit={postNewCard}
      submitOnBlur
    />
  );
}
