import { NextFunction, Request, Response } from "express";

import { Logger } from "../common/configs";
import { JwtTypes } from "../common/enums";
import { ApiError } from "../common/errors";
import { IJwtPayload } from "../common/interfaces";
import { tokenRepository } from "../repositories";
import { jwtService } from "../services";

class AuthMiddleware {
  public async isAuth(req: Request, res: Response, next: NextFunction) {
    try {
      const isAuthorization = await req.headers.authorization;
      if (!isAuthorization) throw new ApiError("Not authorised", 401);
      const [bearer, token] = await isAuthorization.split(/\s+/);
      if (bearer.toLowerCase() !== "bearer" || !token) {
        throw new ApiError(
          "You are supposed to provide JWT as header 'authorization: Bearer ...JWT'",
          401,
        );
      }
      const isRegistered = await tokenRepository.getOne(token);
      if (!isRegistered) throw new ApiError("Token is not registered yet", 401);
      const payload = jwtService.isJwtValid(token) as IJwtPayload;
      if (payload.type !== JwtTypes.ACCESS)
        throw new ApiError("Wrong JWT type", 401);
      req["userId"] = payload._id;
      next();
    } catch (e) {
      Logger.error(e);
      next(e.message);
    }
  }
}

export const authMiddleware = new AuthMiddleware();
