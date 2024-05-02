import { SignOptions } from "jsonwebtoken";

export const jwtAccessConfig: Partial<SignOptions> = {
  expiresIn: "15m",
};
export const jwtRefreshConfig: Partial<SignOptions> = {
  expiresIn: "20d",
};