export interface IResponse {
  status: boolean;
  message: string;
  error: boolean;
}

export interface IDataUsers {
  username: string;
  firstName: string;
  lastName: string;
  password: string;
  image?: string;
  imagenView?: string;
}
