import { compareSync } from "bcryptjs";

import { Logger } from "../common/configs";
import { JwtTypes } from "../common/enums";
import { ApiError } from "../common/errors";
import { IJwtPayload, ILoginDto, JwtPairType } from "../common/interfaces";
import { User } from "../models";
import { tokenRepository } from "../repositories";
import { jwtService } from "./jwt.service";
import { userService } from "./user.service";

class AuthService {
  public async logIn(credentials: ILoginDto): Promise<JwtPairType> {
    try {
      const { _id, role, isVerified, password } = await User.findOne({
        email: credentials.email,
      });
      if (!isVerified) throw new ApiError("Not verified yet", 401);
      if (!password || !compareSync(credentials.password, password))
        throw new ApiError("Failure!!! Wrong credentials", 401);
      return await jwtService.getJwtPair({ _id, role });
    } catch (e) {
      Logger.error(e.stack);
      throw e;
    }
  }

  public async refresh(token: string): Promise<JwtPairType> {
    try {
      const { _id, role, type } = (await jwtService.isJwtValid(
        token,
      )) as IJwtPayload;
      const isRegistered = await tokenRepository.getOne(token);
      if (type !== JwtTypes.REFRESH || !isRegistered)
        throw new ApiError("Wrong jwt", 401);
      return await jwtService.getJwtPair({ _id, role });
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
