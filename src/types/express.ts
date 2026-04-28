import { UserRole } from "../database/entities/user.js";

export interface JwtUserPayload {
  userId: number;
  email?: string;
  role: UserRole;
  type: "access" | "refresh";
  iat?: number;
  exp?: number;
}

declare global {
  // eslint-disable-next-line @typescript-eslint/no-namespace
  namespace Express {
    interface Request {
      user?: JwtUserPayload;
    }
  }
}
