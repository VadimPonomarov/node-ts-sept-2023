import { NextFunction, Request, Response } from "express";

import { ApiError } from "../common/errors/api.error";
import { authService } from "../services/auth.service";

export class AuthController {
  public async login(
    req: Request,
    res: Response,
    next: NextFunction,
  ): Promise<any> {
    try {
      const jwtPair = await authService.logIn(req.body);
      if (!jwtPair) throw new ApiError("Something wrong !!!", 400);
      return res.status(200).json(jwtPair);
    } catch (e) {
      next(e);
    }
  }

  public async refresh(
    req: Request,
    res: Response,
    next: NextFunction,
  ): Promise<any> {
    try {
      const jwtPair = await authService.refresh(req.query["refresh"] as string);
      if (!jwtPair) throw new ApiError("Something wrong !!!", 400);
      return res.status(200).json(jwtPair);
    } catch (e) {
      next(e);
    }
  }

  public async confirm(req: Request, res: Response): Promise<any> {
    try {
      if (!req.query["actionToken"])
        throw new ApiError("Token should be provided", 400);
      await authService.confirm(req.query["actionToken"] as string);
      return res.status(200).send("Success!");
    } catch (e) {
      res.status(400).send(e.message);
    }
  }
}

export const authController = new AuthController();
