import { DragEvent } from 'react';
import { ICard } from './ICard';

export interface IAddForm {
  parentClassName: string;
  inputName: string;
  inputPlaceholder: string;
  btnContent: string;
  handleSubmit: (arg0: string) => Promise<void>;
}

interface IInput {
  name: string;
  value: string;
  setValue: (value: string) => void;
  onSubmit: () => void;
  className?: string | undefined;
  placeholder?: string | undefined;
  submitOnBlur?: boolean;
  escapeFunction?: () => void | undefined;
}

interface ITitleInput {
  title: string;
  editTitle: (newTitle: string) => Promise<void>;
  hideInput: () => void;
  adaptive?: boolean;
}

interface IAddList {
  postNewList: (listTitle: string) => Promise<void>;
}

interface IBoardMenu {
  deleteBoard: () => Promise<void>;
  changeBackground: (newBg: string) => Promise<void>;
}

interface ICardProps {
  data: ICard & { list: { id: number; title: string } };
  onDragStart: (e: DragEvent) => void;
  onDragOver: (e: DragEvent) => void;
}

interface IAddCard {
  postNewCard: (cardTitle: string) => Promise<void>;
}

interface IListProps {
  id: number;
  title: string;
  position: number;
  cards: ICard[];
  onRequestMade: () => void;
}

interface ICreateBoardModal {
  postNewBoard: (title: string) => Promise<void>;
  closeModal: () => void;
}

interface IHomeBoard {
  title: string;
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  custom: Record<string, any>;
}
