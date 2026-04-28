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
  namespace Express {
    interface Request {
      user?: JwtUserPayload;
    }
  }
}
