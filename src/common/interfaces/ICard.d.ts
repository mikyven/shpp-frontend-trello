interface User {
  id: number;
  email: string;
  username: string;
}

export interface ICard {
  id: number | string;
  title: string;
  position: number;
  description?: string;
  users?: User[];
}

export interface RequestCard {
  id: number;
  position: number;
  list_id: number;
}
