import {RoleEnum} from "../constants";

export interface IUser {
    _id: string;
    name: string;
    email: string;
    phone: string;
    password: string;
    age: number;
    role: RoleEnum;
    isDeleted: boolean;
    isVerified: boolean;
}