import { UploadedFile } from "express-fileupload";

import { Logger } from "../common/configs";
import { EmailTypeEnum, FileItemTypeEnum, JwtTypes } from "../common/enums";
import { ApiError } from "../common/errors";
import { createLinkHelper, getHashedHelper } from "../common/helpers";
import { IJwtPayload, IResetPasswordDto, IUser } from "../common/interfaces";
import { userRepository } from "../repositories";
import { jwtService } from "./jwt.service";
import { s3Service } from "./s3s.service";
import { sendGridService } from "./sendGrid.service";
import { smsService } from "./sms.service";

class UserService {
  public async getList(): Promise<IUser[]> {
    return await userRepository.getList();
  }

  public async create(dto: Partial<IUser>): Promise<IUser> {
    try {
      const hashed = getHashedHelper(dto.password);
      const user = await userRepository.create({ ...dto, password: hashed });
      const { token } = await jwtService.createJwt(JwtTypes.CONFIRM, {
        _id: user._id,
        type: JwtTypes.CONFIRM,
      });
      await sendGridService.sendByType(
        user.email,
        EmailTypeEnum.CONFIRM_EMAIL,
        {
          link: createLinkHelper({
            url: "/auth/confirm?actionToken=",
            token,
          }),
        },
      );
      await smsService.testSms("Test message");
      return user;
    } catch (e) {
      Logger.error(e.message);
    }
  }

  public async getById(userId: string): Promise<IUser> {
    return await userRepository.getById(userId);
  }

  public async getByEmail(userEmail: string): Promise<IUser> {
    return await userRepository.getByEmail(userEmail);
  }

  public async updateById(userId: string, dto: Partial<IUser>): Promise<IUser> {
    return await userRepository.updateById(userId, dto);
  }

  public async deleteById(userId: any): Promise<void> {
    return await userRepository.deleteById(userId);
  }

  public async forgetPasswordEmailRequest(
    userId,
    dto: IResetPasswordDto,
  ): Promise<void> {
    try {
      const hash = getHashedHelper(dto.password);
      const payload: IJwtPayload = {
        _id: userId,
        hash,
        type: JwtTypes.FORGET_PASSWORD,
      };
      const { token } = await jwtService.createJwt(
        JwtTypes.FORGET_PASSWORD,
        payload,
      );
      const { email } = (await userRepository.getById(userId)) as IUser;
      const link: string = createLinkHelper({
        url: "/users/reset_password?actionToken=",
        token,
      });
      await sendGridService.sendByType(email, EmailTypeEnum.RESET_PASSWORD, {
        link,
      });
    } catch (e) {
      throw e;
    }
  }

  public async updateUserPassword(actionToken: string): Promise<IUser> {
    try {
      const { _id, type, hash } = (await jwtService.isJwtValid(
        actionToken,
      )) as IJwtPayload;
      if (type !== JwtTypes.FORGET_PASSWORD)
        throw new ApiError("Wrong jwt", 401);
      return await userService.updateById(_id, { password: hash });
    } catch (e) {
      throw e;
    }
  }

  public async uploadAvatar(
    userId: string,
    avatar: UploadedFile,
  ): Promise<IUser> {
    const user = await this.getById(userId);
    const filePath = await s3Service.uploadFile(
      avatar,
      FileItemTypeEnum.USER,
      userId,
    );
    if (user.avatar) {
      await s3Service.deleteFile(user.avatar);
    }
    return await userRepository.updateById(userId, { avatar: filePath });
  }
}

export const userService = new UserService();
