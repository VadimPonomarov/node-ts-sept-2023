export enum RoleEnum {
  ADMIN = "admin",
  USER = "user",
}

export enum JwtTypes {
  ACCESS = "access",
  REFRESH = "refresh",
  CONFIRM = "confirm",
}

export const regexConstant = {
  EMAIL: /^[^\s@]+@([^\s@.,]+\.)+[^\s@.,]{2,}$/,
  PASSWORD: /^(?=.*[A-Za-z])(?=.*\d)(?=.*[@$!%_*#?&])[A-Za-z\d@$_!%*#?&]{9,}$/,
  PHONE:
    /\(?\+[0-9]{1,3}\)? ?-?[0-9]{1,3} ?-?[0-9]{3,5} ?-?[0-9]{4}( ?-?[0-9]{3})? ?(\w{1,10}\s?\d{1,6})?/,
};

export enum EmailTypeEnum {
  CONFIRM_EMAIL = "confirmEmail",
  RESET_PASSWORD = "resetPassword",
  DELETE_ACCOUNT = "deleteAccount",
  LOGOUT = "logout",
}

export enum SmsTypeEnum {
  WELCOME = "welcome",
  DELETE_ACCOUNT = "deleteAccount",
}

export const emailTemplateConstant = {
  [EmailTypeEnum.CONFIRM_EMAIL]: {
    templateId: "d-bcbd644355dd4d90ad4c41332e0c70af",
  },
  [EmailTypeEnum.RESET_PASSWORD]: {
    templateId: "d-85371f1cedd346f59e60ad65014f4ade",
  },
  [EmailTypeEnum.DELETE_ACCOUNT]: {
    templateId: "d-425c89d67efb4f63b80524e934967b89",
  },
  [EmailTypeEnum.LOGOUT]: {
    templateId: "d-790ccdeffa164188afd65ecc563fc35d",
  },
};

export const smsTemplateConstant = {
  [SmsTypeEnum.WELCOME]: (name: string) => `Hey ${name}! Welcome to our app`,
  [SmsTypeEnum.DELETE_ACCOUNT]: (name: string) =>
    `Hey ${name}! Your account was deleted`,
};

export const statusCodes = {
  UNAUTHORIZED: 401,
  BAD_REQUEST: 400,
  NOT_FOUND: 404,
  CONFLICT: 409,
  INTERNAL_SERVER_ERROR: 500,
};
