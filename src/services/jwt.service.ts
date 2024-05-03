import * as jwt from "jsonwebtoken";
import { JwtPayload } from "jsonwebtoken";
import { Types } from "mongoose";

import { config, Logger } from "../common/configs";
import { jwtAccessConfig } from "../common/configs/jwt";
import { JwtTypes } from "../common/constants";
import { ApiError } from "../common/errors/api.error";
import {
  IJwt,
  IJwtPayload,
  JwtPairType,
} from "../common/interfaces/jwt.interface";
import { tokenRepository } from "../repositories/token.repository";

export class JwtService {
  public async createJwt(type: JwtTypes, payload: IJwtPayload): Promise<IJwt> {
    const token = await jwt.sign(payload, config.JWT_SECRET, jwtAccessConfig);
    const data = {
      type,
      token,
      _userId: new Types.ObjectId(payload._id),
    };
    return await tokenRepository.create(data);
  }

  public async getJwtPair(jwtPayload: IJwtPayload): Promise<JwtPairType> {
    try {
      await tokenRepository.deleteAllByUserId(jwtPayload._id);
      const access = await this.createJwt(JwtTypes.ACCESS, {
        ...jwtPayload,
        type: JwtTypes.ACCESS,
      });
      const refresh = await this.createJwt(JwtTypes.REFRESH, {
        ...jwtPayload,
        type: JwtTypes.REFRESH,
      });
      return [access, refresh];
    } catch (e) {
      Logger.error(e.stack);
    }
  }

  public async refreshJwtPair(refreshToken: string): Promise<JwtPairType> {
    try {
      const payload = (await jwtService.isJwtValid(
        refreshToken,
      )) as IJwtPayload;
      const isRegistered = await tokenRepository.getOne(refreshToken);
      if (payload.type !== "refresh" || !isRegistered)
        throw new ApiError("Wrong jwt", 401);
      return await this.getJwtPair({ _id: payload._id, role: payload.role });
    } catch (e) {
      Logger.error(e.stack);
    }
  }

  public isJwtValid(token: string): JwtPayload | unknown {
    return jwt.verify(token, config.JWT_SECRET);
  }
}

export const jwtService = new JwtService();
