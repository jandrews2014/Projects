export interface User {
  id?: string;
  role?: number;
  email?: string;
  username?: string;
  token?: string;
}

export interface Account {
  user?: User;
  password?: string;
}

export interface UserJSON {
  user?: User;
  status?: string;
}
