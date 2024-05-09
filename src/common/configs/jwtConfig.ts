import { JwtTypes } from "../enums";
import { JwtConfigType } from "../types";

export const JwtConfig: JwtConfigType = {
  [JwtTypes.ACCESS]: {
    expiresIn: "15m",
  },
  [JwtTypes.REFRESH]: {
    expiresIn: "20d",
  },
  [JwtTypes.CONFIRM]: {
    expiresIn: "48h",
  },
  [JwtTypes.FORGET_PASSWORD]: {
    expiresIn: "48h",
  },
};
