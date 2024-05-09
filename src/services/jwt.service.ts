import * as jwt from "jsonwebtoken";
import { JwtPayload } from "jsonwebtoken";
import { Types } from "mongoose";

import { config, JwtConfig, Logger } from "../common/configs";
import { JwtTypes } from "../common/enums";
import { IJwt, IJwtPayload, JwtPairType } from "../common/interfaces";
import { tokenRepository } from "../repositories";

export class JwtService {
  public async createJwt(type: JwtTypes, payload: IJwtPayload): Promise<IJwt> {
    try {
      const token = jwt.sign(
        payload,
        config.JWT_SECRET,
        Object(JwtConfig)[type],
      );
      const data = {
        type,
        token,
        _userId: new Types.ObjectId(payload._id),
      } as IJwt;
      return await this.registerJwt(data);
    } catch (e) {
      Logger.error(e);
      throw e;
    }
  }

  public async registerJwt(data: IJwt): Promise<IJwt> {
    try {
      return await tokenRepository.create(data);
    } catch (e) {
      Logger.error(e);
      throw e;
    }
  }

  public async getJwtPair(jwtPayload: IJwtPayload): Promise<JwtPairType> {
    try {
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

  public isJwtValid(token: string): JwtPayload | unknown {
    return jwt.verify(token, config.JWT_SECRET);
  }
}

export const jwtService = new JwtService();
