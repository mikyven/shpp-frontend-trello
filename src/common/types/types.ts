type User = {
  id: number;
  email: string;
  username: string;
};

export type Custom = {
  background: string;
};

export type TBoard = {
  id: number;
  title: string;
  custom: Custom;
  lists: TList[];
};

export type HomeBoard = {
  id: number;
  title: string;
  custom: Custom;
};

export type TCard = {
  id: number | string;
  title: string;
  position: number;
  description?: string;
  users?: User[];
};

type RequestCard = {
  position: number;
  list_id: number;
};

export type MoveRequestCard = {
  id: number;
} & RequestCard;

export type PostRequestCard = {
  title: string;
  description?: string;
  users?: User[];
} & RequestCard;

export type TList = {
  id: number;
  title: string;
  position: number;
  cards: TCard[];
};
