import { NextFunction, Request, Response } from "express";

import { ApiError } from "../common/errors/api.error";
import { IUser } from "../common/interfaces/user.interface";
import { userService } from "../services/user.service";
import { userValidator } from "../validations/user.validator";

class UserController {
  public async getList(req: Request, res: Response, next: NextFunction) {
    try {
      const users = await userService.getList();
      res.json(users);
    } catch (e) {
      next(e);
    }
  }

  public async create(req: Request, res: Response, next: NextFunction) {
    try {
      const { error } = userValidator(req.body);
      if (error) {
        throw new ApiError(error.message, 403);
      }
      const dto = req.body as Partial<IUser>;
      const newUser = await userService.create(dto);
      res.status(201).json(newUser);
    } catch (e) {
      next(e);
    }
  }

  public async getById(req: Request, res: Response, next: NextFunction) {
    try {
      const userId = req.params.userId;
      const user = await userService.getById(userId);
      res.json(user);
    } catch (e) {
      next(e);
    }
  }

  public async updateById(req: Request, res: Response, next: NextFunction) {
    try {
      const userId = req.params.userId;
      const dto = req.body as Partial<IUser>;

      const user = await userService.updateById(userId, dto);
      res.status(201).json(user);
    } catch (e) {
      next(e);
    }
  }

  public async deleteById(req: Request, res: Response, next: NextFunction) {
    try {
      const userId = req.params.userId;
      await userService.deleteById(userId);
      res.sendStatus(204);
    } catch (e) {
      next(e);
    }
  }
}

export const userController = new UserController();
