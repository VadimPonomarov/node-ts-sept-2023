import { compareSync, hashSync } from "bcryptjs";

import { Logger } from "../common/configs";
import { ApiError } from "../common/errors/api.error";
import { ILoginDto } from "../common/interfaces/auth.interface";
import { IJwtPayload, JwtPairType } from "../common/interfaces/jwt.interface";
import { userRepository } from "../repositories/user.repository";
import { jwtService } from "./jwt.service";

class AuthService {
  public getHashed(data: string): string {
    return hashSync(data, 10);
  }

  public async logIn(credentials: ILoginDto): Promise<JwtPairType> {
    try {
      const user = await userRepository.getByEmail(credentials.email);
      if (!user.password || !compareSync(credentials.password, user.password))
        throw new ApiError("Failure!!! Wrong credentials", 401);
      const jwtPayload: Partial<IJwtPayload> = {
        _id: user._id,
        role: user.role,
      };
      return await jwtService.getJwtPair(jwtPayload);
    } catch (e) {
      Logger.error(e.stack);
    }
  }
}

const authService = new AuthService();
export { authService };
