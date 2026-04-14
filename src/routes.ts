import { Request, Response, Application } from "express";
import {
  CreateUser,
  DeleteUser,
  GetUser,
  ListUsers,
  UpdateUser,
} from "./modules/user/user-handler.js";
import { AuthMiddleware } from "./middleware/auth.middleware.js";

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
  app.get("/users", ListUsers);
  app.get("/users/:id", GetUser);
  app.post("/users/", CreateUser);
  app.delete("/users/:id", AuthMiddleware, DeleteUser);
  app.patch("/users/:id", AuthMiddleware, UpdateUser);

  // app.post("/auth/login", Login);
};
