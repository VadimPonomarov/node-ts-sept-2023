import { Logger } from "../common/configs";
import { EmailTypeEnum, JwtTypes } from "../common/enums";
import { ApiError } from "../common/errors";
import { IUser } from "../common/interfaces";
import { userRepository } from "../repositories";
import { authService } from "./auth.service";
import { jwtService } from "./jwt.service";
import { sendGridService } from "./sendGrid.service";
import { smsService } from "./sms.service";

class UserService {
  public async getList(): Promise<IUser[]> {
    return await userRepository.getList();
  }

  public async create(dto: Partial<IUser>): Promise<IUser> {
    try {
      const hashed = authService.getHashed(dto.password);
      const user = await userRepository.create({ ...dto, password: hashed });
      const { token } = await jwtService.createJwt(JwtTypes.CONFIRM, {
        _id: user._id,
        type: JwtTypes.CONFIRM,
      });
      await sendGridService.sendByType(
        user.email,
        EmailTypeEnum.CONFIRM_EMAIL,
        {
          link:
            "http://localhost:3000/auth/confirm?actionToken=" +
            token.toString(),
        },
      );
      smsService.testSms("Test message");
      return user;
    } catch (e) {
      Logger.error(e.message);
    }
  }

  public async getById(userId: string): Promise<IUser> {
    const user = await userRepository.getById(userId);
    if (!user) {
      throw new ApiError("user not found", 404);
    }
    return user;
  }

  public async getByEmail(userEmail: string): Promise<IUser> {
    const user = await userRepository.getById(userEmail);
    if (!user) {
      throw new ApiError("user not found", 404);
    }
    return user;
  }

  public async updateById(userId: string, dto: Partial<IUser>): Promise<IUser> {
    const user = await userRepository.getById(userId);
    if (!user) {
      throw new ApiError("user not found", 404);
    }
    return await userRepository.updateById(userId, dto);
  }

  public async deleteById(userId: string): Promise<void> {
    const user = await userRepository.getById(userId);
    if (!user) {
      throw new ApiError("user not found", 404);
    }
    return await userRepository.deleteById(userId);
  }
}

export const userService = new UserService();
