import { NextFunction, Request, Response } from "express";
import { UserRole } from "../database/entities/user.js";

export const RequireRole = (...allowedRole: UserRole[]) => {
  return (req: Request, res: Response, next: NextFunction) => {
    const user = (req as any).user;

    if (!user || !user.role) {
      return res.status(401).json({ error: "Unautorized" });
    }

    if (!allowedRole.includes(user.role)) {
      return res.status(403).json({ error: "Role invalid" });
    }

    return next();
  };
};
