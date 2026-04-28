import { Repository } from "typeorm";
import { User, UserRole } from "../../database/entities/user.js";
import { Token } from "../../database/entities/token.js";
import { compare, hash } from "bcrypt";
import jwt from "jsonwebtoken";
import { LoginRequest, RegisterRequest } from "../user/user-request.js";

const JWT_SECRET = process.env.JWT_SECRET ?? "default";
const ACCESS_TOKEN_TTL_MS = 15 * 60 * 1000; // 15 minutes
const REFRESH_TOKEN_TTL_MS = 7 * 24 * 60 * 60 * 1000; // 7 jours

export interface AuthTokens {
  accessToken: string;
  refreshToken: string;
}

export class AuthUsecase {
  constructor(
    private userRepository: Repository<User>,
    private tokenRepository: Repository<Token>
  ) {}

  async register(data: RegisterRequest): Promise<AuthTokens | null> {
    const existing = await this.userRepository.findOneBy({ email: data.email });
    if (existing) return null;

    const hashedPassword = await hash(data.password, 10);
    const user = this.userRepository.create({
      email: data.email,
      password: hashedPassword,
      role: UserRole.CLIENT,
      balance: 0,
      first_name: data.firstName ?? null,
    });
    const savedUser = await this.userRepository.save(user);

    return this.createToken(savedUser);
  }

  async login({ email, password }: LoginRequest): Promise<AuthTokens | null> {
    const user = await this.userRepository.findOneBy({ email });
    if (!user) return null;

    const isValid = await compare(password, user.password);
    if (!isValid) return null;

    return this.createToken(user);
  }

  async refresh(refreshToken: string): Promise<AuthTokens | null> {
    let payload: jwt.JwtPayload;
    try {
      payload = jwt.verify(refreshToken, JWT_SECRET) as jwt.JwtPayload;
    } catch {
      return null;
    }
    if (payload.type !== "refresh") return null;

    const stored = await this.tokenRepository.findOne({
      where: { token: refreshToken },
      relations: ["user"],
    });
    if (!stored || stored.revoked_at !== null) return null;
    if (stored.expires_at.getTime() < Date.now()) return null;

    stored.revoked_at = new Date();
    await this.tokenRepository.save(stored);

    return this.createToken(stored.user);
  }

  private async createToken(user: User): Promise<AuthTokens> {
    const accessToken = jwt.sign(
      { userId: user.id, email: user.email, role: user.role, type: "access" },
      JWT_SECRET,
      { expiresIn: "15m" }
    );

    const refreshToken = jwt.sign(
      { userId: user.id, type: "refresh" },
      JWT_SECRET,
      { expiresIn: "7d" }
    );

    const now = Date.now();
    await this.tokenRepository.save([
      this.tokenRepository.create({
        token: accessToken,
        user,
        expires_at: new Date(now + ACCESS_TOKEN_TTL_MS),
        revoked_at: null,
      }),
      this.tokenRepository.create({
        token: refreshToken,
        user,
        expires_at: new Date(now + REFRESH_TOKEN_TTL_MS),
        revoked_at: null,
      }),
    ]);

    return { accessToken, refreshToken };
  }
}
