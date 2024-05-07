import joi from "joi";

import { regexConstant } from "../common/constants";
import { IUser } from "../common/interfaces";

const userValidator = (data: Partial<IUser>) => {
  const schema = joi.object<Partial<IUser>>().keys({
    name: joi.string().min(3).max(50).trim().messages({
      "string.empty": "{{#label}} not be empty",
      "string.max":
        "{{#label}} length must be less than or equal to {{#limit}} characters long2",
      "string.min":
        "{{#label}} length must be at least {{#limit}} characters long2",
    }),
    phone: joi.string().regex(regexConstant.PHONE).trim(),
    age: joi.number().min(18).max(100),
    email: joi
      .string()
      .regex(regexConstant.EMAIL)
      .lowercase()
      .trim()
      .label("Email")
      .messages({
        "string.pattern.base": "{{#label}} does not match ...",
      }),
    password: joi.string().regex(regexConstant.PASSWORD).trim().messages({
      "string.pattern.base":
        "{{#label}} does not match (min 8 [letters, special symbols, digits])",
    }),
  });
  return schema.validate(data);
};

export { userValidator };
