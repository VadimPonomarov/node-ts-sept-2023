import { compareSync } from "bcryptjs";
import * as jwt from "jsonwebtoken";
import { JwtPayload } from "jsonwebtoken";
import { Types } from "mongoose";

import { config, Logger } from "../common/configs";
import { jwtAccessConfig } from "../common/configs/jwt";
import { JwtTypes } from "../common/constants";
import { ApiError } from "../common/errors/api.error";
import { ILoginDto } from "../common/interfaces/auth.interface";
import {
  IJwt,
  IJwtPayload,
  JwtPairType,
} from "../common/interfaces/jwt.interface";
import { tokenRepository } from "../repositories/token.repository";
import { userRepository } from "../repositories/user.repository";

export class JwtService {
  public async logIn(credentials: ILoginDto): Promise<JwtPairType> {
    try {
      const { _id, role, password } = await userRepository.getByEmail(
        credentials.email,
      );
      if (!password || !credentials.password)
        throw new ApiError("Failure!!! Wrong credentials", 401);
      const isPasswordValid = compareSync(credentials.password, password);
      if (!isPasswordValid)
        throw new ApiError("Failure!!! Wrong credentials", 401);
      const _jwtPayload: Partial<IJwtPayload> = { _id, role };
      return await this.getJwtPair(_jwtPayload);
    } catch (e) {
      Logger.error(e.stack);
    }
  }

  public async getJwtPair(
    _jwtPayload: Partial<IJwtPayload>,
  ): Promise<JwtPairType> {
    try {
      await tokenRepository.deleteAllByUserId(_jwtPayload._id);
      return [
        await this.createJwt(JwtTypes.ACCESS, {
          ..._jwtPayload,
          type: JwtTypes.ACCESS,
        } as IJwtPayload),
        await this.createJwt(JwtTypes.REFRESH, {
          ..._jwtPayload,
          type: JwtTypes.REFRESH,
        } as IJwtPayload),
      ] as JwtPairType;
    } catch (e) {
      Logger.error(e.stack);
    }
  }

  public async createJwt(type: JwtTypes, payload: IJwtPayload): Promise<IJwt> {
    const token = await jwt.sign(payload, config.JWT_SECRET, jwtAccessConfig);
    if (type === JwtTypes.ACCESS) {
      const data = {
        type: JwtTypes.ACCESS,
        token,
        _userId: new Types.ObjectId(payload._id),
      };
      return await tokenRepository.create(data);
    } else if (type === JwtTypes.REFRESH) {
      const data = {
        type: JwtTypes.REFRESH,
        token,
        _userId: new Types.ObjectId(payload._id),
      };
      return await tokenRepository.create(data);
    }
  }

  public isJwtValid(token: string): JwtPayload | unknown {
    return jwt.verify(token, config.JWT_SECRET);
  }

  public async refreshJwtPair(refreshToken: string): Promise<JwtPairType> {
    try {
      const _payload = (await jwtService.isJwtValid(
        refreshToken,
      )) as IJwtPayload;
      const isRegistered = await tokenRepository.getOne(refreshToken);
      if (_payload.type !== "refresh" || !isRegistered)
        throw new ApiError("Wrong jwt", 401);
      const {} = _payload;
      return await this.getJwtPair({ _id: _payload._id, role: _payload.role });
    } catch (e) {
      Logger.error(e.stack);
    }
  }
}

export const jwtService = new JwtService();
