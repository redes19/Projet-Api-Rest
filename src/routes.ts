import { Request, Response, Application } from "express";
import {
  CreateUser,
  DeleteUser,
  GetUser,
  ListUsers,
  UpdateUser,
} from "./modules/user/user-handler.js";
import { AuthMiddleware } from "./middleware/auth.middleware.js";
import { Login, Register, Refresh } from "./modules/auth/auth-handler.js";

export const initHandlers = (app: Application) => {
  app.get("/", (req: Request, res: Response) => {
    res.status(200);
    return res.send({
      message: "API Cinéma",
      status: "ONLINE",
    });
  });

  // ======================================
  //                  USER
  // ======================================
  app.get("/users", AuthMiddleware, ListUsers);
  app.get("/users/:id", GetUser);
  app.post("/users/", CreateUser);
  app.delete("/users/:id", AuthMiddleware, DeleteUser);
  app.patch("/users/:id", AuthMiddleware, UpdateUser);

  // ======================================
  //                  AUTH
  // ======================================
  app.post("/auth/register", Register);
  app.post("/auth/login", Login);
  app.post("/auth/refresh", Refresh);
};
