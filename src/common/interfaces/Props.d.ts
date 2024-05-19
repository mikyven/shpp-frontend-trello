import { ICard } from './ICard';

export interface IAddForm {
  parentClassName: string;
  inputName: string;
  inputPlaceholder: string;
  btnContent: string;
  handleSubmit: (arg0: string) => Promise<void>;
  submitOnBlur?: boolean;
}

interface IInput {
  name: string;
  value: string;
  setValue: (value: string) => void;
  className?: string | undefined;
  placeholder?: string | undefined;
  onSubmit: () => void;
  submitOnBlur?: boolean;
}

interface ITitleInput {
  title: string;
  editTitle: (newTitle: string) => Promise<void>;
  hideInput: () => void;
}

interface IAddList {
  postNewList: (listTitle: string) => Promise<void>;
}

interface IBoardMenu {
  deleteBoard: () => Promise<void>;
  changeBackground: (newBg: string) => Promise<void>;
}

interface ICardProps {
  title: string;
}

interface IAddCard {
  postNewCard: (cardTitle: string) => Promise<void>;
}

interface IListProps {
  id: number;
  title: string;
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
