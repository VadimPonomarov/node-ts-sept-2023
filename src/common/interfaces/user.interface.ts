import { RoleEnum } from "../enums";

export interface IUser {
  _id: string;
  name: string;
  email: string;
  phone: string;
  password?: string;
  age: number;
  role: RoleEnum;
  avatar?: string;
  isDeleted: boolean;
  isVerified: boolean;
}
