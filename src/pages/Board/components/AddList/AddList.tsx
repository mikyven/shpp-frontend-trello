import { ReactElement } from 'react';
import './AddList.scss';
import { AddForm } from '../../../../components/AddForm/AddForm';
import { IAddList } from '../../../../common/interfaces/Props';

export function AddList({ postNewList }: IAddList): ReactElement {
  return (
    <AddForm
      parentClassName="add-list"
      inputName="addListInput"
      inputPlaceholder="Введіть ім'я списку..."
      btnContent="Додати список"
      handleSubmit={postNewList}
    />
  );
}
