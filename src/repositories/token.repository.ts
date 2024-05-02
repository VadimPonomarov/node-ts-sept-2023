import { IToken } from "../common/interfaces/jwt.interface";
import { Token } from "../models/token.model";

class TokenRepository {
  public async create(dto: IToken): Promise<IToken> {
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
}

export const tokenRepository = new TokenRepository();
