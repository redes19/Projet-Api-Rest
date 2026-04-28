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
import {
  CreateScreening,
  DeleteScreening,
  GetScreening,
  ListScreenings,
  UpdateScreening,
} from "./modules/screening/screening-handler.js";
import {
  CreateTicket,
  DeleteTicket,
  GetTicket,
  ListTicketUsages,
  ListTickets,
  UpdateTicket,
  UseTicket,
} from "./modules/ticket/ticket-handler.js";
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

  // ======================================
  //              SCREENING
  // ======================================
  app.get("/screenings", ListScreenings);
  app.get("/screenings/:id", GetScreening);
  app.post("/screenings/", CreateScreening);
  app.delete("/screenings/:id", AuthMiddleware, DeleteScreening);
  app.patch("/screenings/:id", AuthMiddleware, UpdateScreening);

  // ======================================
  //                TICKET
  // ======================================
  app.get("/tickets", ListTickets);
  app.get("/tickets/:id", GetTicket);
  app.post("/tickets/", CreateTicket);
  app.patch("/tickets/:id", AuthMiddleware, UpdateTicket);
  app.delete("/tickets/:id", AuthMiddleware, DeleteTicket);
  app.post("/tickets/:id/use", AuthMiddleware, UseTicket);
  app.get("/tickets/:id/usages", AuthMiddleware, ListTicketUsages);
};
