import { NextFunction, Request, Response } from "express";
import { isObjectIdOrHexString } from "mongoose";

import { ApiError } from "../common/errors/api.error";
import { userValidator } from "../validations/user.validator";

class CommonMiddleware {
  public isIdValid(req: Request, res: Response, next: NextFunction) {
    try {
      const id = req.params.userId;
      if (!isObjectIdOrHexString(id)) {
        throw new ApiError("Invalid id", 400);
      }
      next();
    } catch (e) {
      next(e);
    }
  }

  public isUserDtoValid(req: Request, res: Response, next: NextFunction) {
    try {
      const { error } = userValidator(req.body);
      if (error) {
        throw new ApiError(error.message, 403);
      }
      next();
    } catch (e) {
      next(e);
    }
  }
}

export const commonMiddleware = new CommonMiddleware();
