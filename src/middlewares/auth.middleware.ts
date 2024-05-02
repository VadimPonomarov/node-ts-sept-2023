import { NextFunction, Request, Response } from "express";

import { ApiError } from "../common/errors/api.error";
import { IJwtPayload } from "../common/interfaces/jwt.interface";
import { tokenRepository } from "../repositories/token.repository";
import { jwtService } from "../services/jwt.service";

class AuthMiddleware {
  public isAuth(req: Request, res: Response, next: NextFunction) {
    try {
      if (!req.headers.authorization) throw new ApiError("Not authorised", 401);
      const [bearer, token] = req.headers.authorization
        .valueOf()
        .trim()
        .split(/\s+/);
      if (bearer.toLowerCase() !== "bearer" || !token) {
        throw new ApiError("Not authorised", 401);
      }
      if (!tokenRepository.getOne(token))
        throw new ApiError("Wrong token type", 401);
      const { type } = jwtService.isJwtValid(token) as IJwtPayload;
      if (type !== "access") throw new ApiError("Wrong jwt type", 401);
      next();
    } catch (e) {
      next(e);
    }
  }
}

export const authMiddleware = new AuthMiddleware();
