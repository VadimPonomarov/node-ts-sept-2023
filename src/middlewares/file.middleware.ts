import { NextFunction, Request, Response } from "express";
import { UploadedFile } from "express-fileupload";

import { avatarConfig } from "../common/configs";
import { statusCodes } from "../common/constants";
import { ApiError } from "../common/errors";

class FileMiddleware {
  public isAvatarValid(req: Request, res: Response, next: NextFunction) {
    try {
      const avatar = req.files?.avatar as UploadedFile;
      if (!avatar) {
        throw new ApiError("Empty file", statusCodes.BAD_REQUEST);
      }
      if (Array.isArray(avatar)) {
        throw new ApiError("Must be not array", statusCodes.BAD_REQUEST);
      }
      if (!avatarConfig.MIMETYPE.includes(avatar.mimetype)) {
        throw new ApiError("Invalid file format", statusCodes.BAD_REQUEST);
      }
      if (avatar.size > avatarConfig.MAX_SIZE) {
        throw new ApiError("File is too large", statusCodes.BAD_REQUEST);
      }
      next();
    } catch (e) {
      next(e);
    }
  }
}

export const fileMiddleware = new FileMiddleware();
