import { NextFunction, Request, Response } from "express";

import { Logger } from "../common/configs";
import { statusCodes } from "../common/constants";
import { IJwtPayload, IResetPasswordDto, IUser } from "../common/interfaces";
import { jwtService, userService } from "../services";

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
      res.json(users);
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
      const bearerToken: string = req.headers.authorization
        .trim()
        .split(/\s+/)[1];
      const { _id: userId } = (await jwtService.isJwtValid(
        bearerToken,
      )) as IJwtPayload;
      const resetPasswordDto = req.body as IResetPasswordDto;

      await userService.forgetPasswordEmailRequest(userId, resetPasswordDto);
      res
        .send("!!! Email for confirmation was sent on User's address")
        .status(statusCodes.OK);
    } catch (e) {
      Logger.error(e.message);
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
      Logger.error(e);
      next(e);
    }
  }
}

export const userController = new UserController();
