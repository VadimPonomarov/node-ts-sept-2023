import { Types } from "mongoose";

import { JwtTypes, RoleEnum } from "../constants";

export interface IJwt {
  type: JwtTypes;
  token: string;
}

export type JwtPairType = IJwt[];

export interface IJwtPayload {
  _id?: string;
  type?: JwtTypes;
  role?: RoleEnum;
}

export interface IToken extends IJwt {
  _id?: Types.ObjectId;
  _userId?: Types.ObjectId;
}
