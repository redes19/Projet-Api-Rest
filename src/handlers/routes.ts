import { Request, Response } from "express";

export const initHandlers = (app: any) => {
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
  // app.get("/users", ListUsers);
  // app.get("/users/:id", GetUser);
  // app.post("/users/", CreateUser);
  // app.delete("/users/:id", DeleteUser);
  // app.patch("/users/:id", UpdateUser);

  // app.post("/auth/login", Login);
};
