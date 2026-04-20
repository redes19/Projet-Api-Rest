import { Request, Response, Application } from "express";
import {
  CreateUser,
  DeleteUser,
  GetUser,
  ListUsers,
  UpdateUser,
} from "./modules/user/user-handler.js";
import {
  CreateRoom,
  DeleteRoom,
  GetRoom,
  ListRooms,
  UpdateRoom,
} from "./modules/room/room-handler.js";
import {
  CreateMovie,
  DeleteMovie,
  GetMovie,
  ListMovies,
  UpdateMovie,
} from "./modules/movie/movie-handler.js";
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

  // ======================================
  //                 ROOM
  // ======================================
  app.get("/rooms", ListRooms);
  app.get("/rooms/:id", GetRoom);
  app.post("/rooms/", CreateRoom);
  app.delete("/rooms/:id", AuthMiddleware, DeleteRoom);
  app.patch("/rooms/:id", AuthMiddleware, UpdateRoom);

  // ======================================
  //                MOVIE
  // ======================================
  app.get("/movies", ListMovies);
  app.get("/movies/:id", GetMovie);
  app.post("/movies/", CreateMovie);
  app.delete("/movies/:id", AuthMiddleware, DeleteMovie);
  app.patch("/movies/:id", AuthMiddleware, UpdateMovie);
};
