import { hashSync } from "bcryptjs";

export const getHashedHelper: (data: string) => string = (data) => {
  return hashSync(data, 10);
};
