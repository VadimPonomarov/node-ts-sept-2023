import { ApiError } from "../common/errors/api.error";
import { IUser } from "../common/interfaces/user.interface";
import { userRepository } from "../repositories/user.repository";
import { authService } from "./auth.service";

class UserService {
  public async getList(): Promise<IUser[]> {
    return await userRepository.getList();
  }

  public async create(dto: Partial<IUser>): Promise<IUser> {
    const hashed = authService.getHashed(dto.password);
    return await userRepository.create({ ...dto, password: hashed });
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
