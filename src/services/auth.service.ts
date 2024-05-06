import { compareSync, hashSync } from "bcryptjs";

import { Logger } from "../common/configs";
import { ApiError } from "../common/errors/api.error";
import { ILoginDto } from "../common/interfaces/auth.interface";
import { IJwtPayload, JwtPairType } from "../common/interfaces/jwt.interface";
import { tokenRepository } from "../repositories/token.repository";
import { userRepository } from "../repositories/user.repository";
import { jwtService } from "./jwt.service";
import { userService } from "./user.service";

class AuthService {
  public getHashed(data: string): string {
    return hashSync(data, 10);
  }

  public async logIn(credentials: ILoginDto): Promise<JwtPairType> {
    try {
      const user = await userRepository.getByEmail(credentials.email);
      if (!user.isVerified) throw new ApiError("Not verified yet", 401);
      if (!user.password || !compareSync(credentials.password, user.password))
        throw new ApiError("Failure!!! Wrong credentials", 401);
      const jwtPayload: Partial<IJwtPayload> = {
        _id: user._id,
        role: user.role,
      };
      return await jwtService.getJwtPair(jwtPayload);
    } catch (e) {
      Logger.error(e.stack);
      throw e;
    }
  }

  public async refresh(refreshToken: string): Promise<JwtPairType> {
    try {
      const payload = (await jwtService.isJwtValid(
        refreshToken,
      )) as IJwtPayload;
      const isRegistered = await tokenRepository.getOne(refreshToken);
      if (payload.type !== "refresh" || !isRegistered)
        throw new ApiError("Wrong jwt", 401);
      return await jwtService.getJwtPair({
        _id: payload._id,
        role: payload.role,
      });
    } catch (e) {
      Logger.error(e.stack);
    }
  }

  public async confirm(actionToken: string): Promise<void> {
    try {
      const payload = (await jwtService.isJwtValid(actionToken)) as IJwtPayload;
      if (payload.type !== "confirm") throw new ApiError("Wrong jwt", 401);
      await userService.updateById(payload._id, { isVerified: true });
    } catch (e) {
      Logger.error(e.stack);
      throw e;
    }
  }
}

const authService = new AuthService();
export { authService };
