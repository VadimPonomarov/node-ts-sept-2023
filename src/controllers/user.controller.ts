import { NextFunction, Request, Response } from "express";
import { UploadedFile } from "express-fileupload";

import { statusCodes } from "../common/constants";
import { IResetPasswordDto, IUser } from "../common/interfaces";
import { userService } from "../services";
import { s3Service } from "../services/s3s.service";

class UserController {
  public async create(req: Request, res: Response, next: NextFunction) {
    try {
      const dto = req.body as Partial<IUser>;
      const newUser = await userService.create(dto);
      res.status(201).json(newUser);
    } catch (e) {
      next(e);
    }
  }

  public async getList(req: Request, res: Response, next: NextFunction) {
    try {
      const users = await userService.getList();
      res.status(statusCodes.OK).json(users);
    } catch (e) {
      next(e);
    }
  }

  public async emailResetPassword(
    req: Request,
    res: Response,
    next: NextFunction,
  ): Promise<void> {
    try {
      const resetPasswordDto = req.body as IResetPasswordDto;

      await userService.forgetPasswordEmailRequest(
        req["userId"],
        resetPasswordDto,
      );
      res
        .send("!!! Email for confirmation was sent on User's address")
        .status(statusCodes.OK);
    } catch (e) {
      next(e);
    }
  }

  public async updateUserPassword(
    req: Request,
    res: Response,
    next: NextFunction,
  ) {
    try {
      const token = req.query["actionToken"] as string;
      await userService.updateUserPassword(token);
      res.status(statusCodes.OK).send("Done");
    } catch (e) {
      next(e);
    }
  }

  public async getMe(req: Request, res: Response, next: NextFunction) {
    try {
      const response = await userService.getById(req["userId"]);
      const user = await response["_doc"];
      res.json(user);
    } catch (e) {
      next(e);
    }
  }

  public async updateMe(req: Request, res: Response, next: NextFunction) {
    try {
      const response = await userService.updateById(req["userId"], req.body);
      const user = await response["_doc"];
      await res.status(statusCodes.OK).json(user);
    } catch (e) {
      next(e);
    }
  }

  public async deleteMe(req: Request, res: Response, next: NextFunction) {
    try {
      await userService.deleteById(req["userId"]);
      res.sendStatus(statusCodes.NO_CONTENT);
    } catch (e) {
      next(e);
    }
  }

  public async uploadAvatar(req: Request, res: Response, next: NextFunction) {
    try {
      const avatar = req.files?.avatar as UploadedFile;
      const user = await userService.uploadAvatar(req["userId"], avatar);
      res.status(201).json(user);
    } catch (e) {
      next(e);
    }
  }
  public async deleteAvatar(req: Request, res: Response, next: NextFunction) {
    try {
      const { avatar } = await userService.getById(req["userId"]);
      if (avatar) await s3Service.deleteFile(avatar);
      await userService.updateById(req["userId"], { avatar: undefined });
      res.status(statusCodes.OK).json("Deleted");
    } catch (e) {
      next(e);
    }
  }
}

export const userController = new UserController();
