import { Custom, TCard } from './types';

export type AddFormProps = {
  parentClassName: string;
  inputName: string;
  inputPlaceholder: string;
  btnContent: string;
  handleSubmit: (arg0: string) => Promise<void>;
};

export type InputProps = {
  name: string;
  value: string;
  setValue: (value: string) => void;
  onSubmit: () => void;
  className?: string | undefined;
  placeholder?: string | undefined;
  submitOnBlur?: boolean;
  selectContent?: boolean;
  escapeFunction?: () => void | undefined;
};

export type TitleInputProps = {
  title: string;
  editTitle: (newTitle: string) => Promise<void>;
  hideInput: () => void;
  adaptive?: boolean;
};

export type AddListProps = {
  postNewList: (listTitle: string) => Promise<void>;
};

export type BoardMenuProps = {
  deleteBoard: () => Promise<void>;
  changeBackground: (newBg: string) => Promise<void>;
};

export type CardProps = {
  data: TCard & { list: { id: number; title: string } };
  onDragStart: (e: React.DragEvent) => void;
};

export type AddCardProps = {
  postNewCard: (cardTitle: string) => Promise<void>;
};

export type ListProps = {
  id: number;
  title: string;
  position: number;
  cards: TCard[];
};

export type HomeBoardProps = {
  title: string;
  custom: Custom;
};

export type CreateBoardModalProps = {
  postNewBoard: (...args: string[]) => Promise<void>;
  closeModal: () => void;
};

export type ActionModalProps = {
  type: string;
  name: string;
  left: string;
  top: string;
  closeModal: () => void;
};
