import { Request } from 'express';
import { IUser } from '../models/User';

export interface IUserRequest extends Request {
  user?: IUser;
}

export interface ILoginRequest {
  email: string;
  password: string;
}

export interface IRegisterRequest extends ILoginRequest {
  name: string;
}

export interface IAuthResponse {
  token: string;
  user: {
    id: string;
    name: string;
    email: string;
  };
}
