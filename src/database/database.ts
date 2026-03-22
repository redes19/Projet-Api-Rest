import { DataSource } from "typeorm";
import "dotenv/config";
import { User } from "./entities/user.js";
import { Token } from "./entities/token.js";
import { Movie } from "./entities/movie.js";
import { Room } from "./entities/room.js";
import { Screening } from "./entities/screening.js";
import { Ticket, TicketUsage } from "./entities/ticket.js";

export const AppdDataSource = new DataSource({
  type: "postgres",
  host: process.env.DB_HOST ?? "localhost",
  port: process.env.DB_PORT ? parseInt(process.env.DB_PORT) : 5432,
  username: process.env.DB_USER ?? "user",
  password: process.env.DB_PASSWORD ?? "pass",
  database: process.env.DB_NAME ?? "database",
  synchronize: true,
  logging: true,
  entities: [User, Token, Movie, Room, Screening, Ticket, TicketUsage],
});
