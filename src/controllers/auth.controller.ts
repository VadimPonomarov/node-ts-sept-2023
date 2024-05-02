import { NextFunction, Request, Response } from "express";

import { ApiError } from "../common/errors/api.error";
import { jwtService } from "../services/jwt.service";

export class AuthController {
  public async login(
    req: Request,
    res: Response,
    next: NextFunction,
  ): Promise<any> {
    try {
      const jwtPair = await jwtService.logIn(req.body);
      if (!jwtPair) throw new ApiError("Something wrong !!!", 400);
      return res.status(200).json(jwtPair);
    } catch (e) {
      next(e);
    }
  }

  public async refreshJwtPair(
    req: Request,
    res: Response,
    next: NextFunction,
  ): Promise<any> {
    try {
      const jwtPair = await jwtService.refreshJwtPair(
        req.query["refresh"] as string,
      );
      if (!jwtPair) throw new ApiError("Something wrong !!!", 400);
      return res.status(200).json(jwtPair);
    } catch (e) {
      next(e);
    }
  }
}

export const authController = new AuthController();
