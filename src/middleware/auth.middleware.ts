import { NextFunction, Request, Response } from "express";
import { AppDataSource } from "../database/database.js";
import jwt from "jsonwebtoken";
import { Token } from "../database/entities/token.js";

export const AuthMiddleware = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  console.log("Authentification en cours");

  const authHeader = req.headers["authorization"];
  if (!authHeader) {
    return res.status(401).json({ error: "Unauthorized" });
  }

  console.log("authHeader ", authHeader);

  const token = authHeader.split(" ")[1];
  if (!token) {
    return res.status(401).json({ error: "Unauthorized" });
  }

  console.log("token ", token);

  const tokenRepo = AppDataSource.getRepository(Token);
  const tokenFound = await tokenRepo.findOne({ where: { token } }); // Remplacez 'value' par le nom réel de la propriété dans votre entité Token
  if (!tokenFound) {
    return res.status(401).json({ error: "Access Forbidden" });
  }

  const secret = process.env.JWT_SECRET ?? "default";
  jwt.verify(token, secret, (err, user) => {
    if (err) return res.status(403).json({ error: "Access Forbidden" });
    (req as any).user = user;
    next();
  });
};
