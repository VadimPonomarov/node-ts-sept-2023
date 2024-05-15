import { IUser } from "../common/interfaces";
import { User } from "../models";

class UserRepository {
  public async getList(): Promise<IUser[]> {
    return await User.find({}).select("-password");
  }

  public async create(dto: Partial<IUser>): Promise<IUser> {
    const resp = await User.create(dto);
    const { password, ...user } = resp["_doc"];
    return user;
  }

  public async getById(userId: string): Promise<IUser> {
    return await User.findById(userId).select("-password");
  }

  public async getByEmail(userEmail: string): Promise<IUser> {
    return await User.findOne({ email: userEmail }).select("-password");
  }

  public async updateById(userId: string, dto: Partial<IUser>): Promise<IUser> {
    await User.findByIdAndUpdate(userId, dto).select("-password");
    return await this.getById(userId);
  }

  public async deleteById(userId: string): Promise<void> {
    await User.deleteOne({ _id: userId });
  }
}

export const userRepository = new UserRepository();
