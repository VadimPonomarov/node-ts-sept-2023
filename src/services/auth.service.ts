import { hashSync } from "bcryptjs";

class AuthService {
  public getHashed(data: string): string {
    return hashSync(data, 10);
  }
}

const authService = new AuthService();
export { authService };
