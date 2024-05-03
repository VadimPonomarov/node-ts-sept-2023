import { NextFunction, Request, Response } from "express";

import { ApiError } from "../common/errors/api.error";
import { IJwtPayload } from "../common/interfaces/jwt.interface";
import { tokenRepository } from "../repositories/token.repository";
import { jwtService } from "../services/jwt.service";

class AuthMiddleware {
  public async isAuth(req: Request, res: Response, next: NextFunction) {
    try {
      if (!req.headers.authorization) throw new ApiError("Not authorised", 401);
      const [bearer, token] = req.headers.authorization.trim().split(/\s+/);
      if (bearer.toLowerCase() !== "bearer" || !token) {
        throw new ApiError(
          "You are supposed to provide JWT as header 'authorization: Bearer ...JWT'",
          401,
        );
      }
      const isRegistered = await tokenRepository.getOne(token);
      if (!isRegistered) throw new ApiError("Token is not registered yet", 401);
      const { type }: Partial<IJwtPayload> = jwtService.isJwtValid(token);
      if (type !== "access") throw new ApiError("Wrong JWT type", 401);
      next();
    } catch (e) {
      next(e);
    }
  }
}

export const authMiddleware = new AuthMiddleware();
