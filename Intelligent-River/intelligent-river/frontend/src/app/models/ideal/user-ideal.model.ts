// nothing to change really

export interface PostSignInRequest {
  username?: User;
  password?: string;  // hashed with sha1 32-bit
}

export interface PostSignInResponse {
  user?: User;
  status?: string;
}

export interface PostSignOutRequest {
  username?: User;
  token?: string;
}

export interface PostSignOutResponse {
  message?: string;
  status?: string;
}

export interface User {
  id?: string;
  role?: number;
  email?: string;
  username?: string;
  token?: string;
}

