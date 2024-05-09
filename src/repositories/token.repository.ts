import { JwtTypes } from "../common/enums";
import { IToken } from "../common/interfaces";
import { Token } from "../models";

class TokenRepository {
  public async create(dto: IToken): Promise<IToken> {
    await this.deleteTypeByUserId(dto._userId.toString(), dto.type);
    return await Token.create(dto);
  }

  public async getOne(token: string): Promise<IToken> {
    return await Token.findOne({ token });
  }

  public async delete(token: string): Promise<void> {
    await Token.deleteOne({ token });
  }

  public async deleteAllByUserId(userId: string): Promise<void> {
    await Token.deleteMany({ _userId: userId });
  }

  public async deleteTypeByUserId(
    userId: string,
    type: JwtTypes,
  ): Promise<void> {
    await Token.deleteMany({ _userId: userId, type });
  }
}

export const tokenRepository = new TokenRepository();
