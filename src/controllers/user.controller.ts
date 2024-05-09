import { NextFunction, Request, Response } from "express";

import { Logger } from "../common/configs";
import { statusCodes } from "../common/constants";
import { JwtTypes } from "../common/enums";
import { ApiError } from "../common/errors";
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
      if (!resetPasswordDto)
        throw new ApiError(
          "Reset password data should be provided",
          statusCodes.BAD_REQUEST,
        );
      await userService.forgetPasswordEmailRequest(userId, resetPasswordDto);
      res
        .json({
          message: "!!! Email for confirmation was sent on User's address",
        })
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
      const { type } = (await jwtService.isJwtValid(token)) as IJwtPayload;
      if (type !== JwtTypes.FORGET_PASSWORD)
        throw new ApiError("Wrong jwt type", statusCodes.BAD_REQUEST);
      const user = await userService.updateUserPassword(token);
      if (!user)
        res
          .json({
            message: "!!! Failure",
          })
          .status(statusCodes.BAD_REQUEST);
      res
        .json({
          message: "!!! Success",
        })
        .status(statusCodes.OK);
    } catch (e) {
      Logger.error(e);
      next(e);
    }
  }
}

export const userController = new UserController();
