import { NextFunction, Request, Response } from "express";
import { AppDataSource } from "../database/database.js";
import jwt from "jsonwebtoken";
import { Token } from "../database/entities/token.js";
import { JwtUserPayload } from "../types/express.js";

const JWT_SECRET = process.env.JWT_SECRET ?? "default";

export const AuthMiddleware = async (req: Request, res: Response, next: NextFunction) => {
  const authHeader = req.headers["authorization"];
  const token = authHeader?.split(" ")[1];
  if (!token) {
    return res.status(401).json({ error: "Unauthorized" });
  }

  const stored = await AppDataSource.getRepository(Token).findOne({
    where: { token },
  });
  if (!stored || stored.revoked_at !== null) {
    return res.status(401).json({ error: "Unauthorized" });
  }

  try {
    const payload = jwt.verify(token, JWT_SECRET) as jwt.JwtPayload;
    if (payload.type !== "access") {
      return res.status(401).json({ error: "Unauthorized" });
    }
    req.user = payload as JwtUserPayload;
    return next();
  } catch {
    return res.status(401).json({ error: "Unauthorized" });
  }
};
