// | Colonne    | Type      | NOT NULL | Contrainte / note                  |
// | ---------- | --------- | -------- | ---------------------------------- |
// | id         | SERIAL    | ●        | PK                                 |
// | movie_id   | INT       | ●        | FK → movies.id, ON DELETE RESTRICT |
// | room_id    | INT       | ●        | FK → rooms.id, ON DELETE RESTRICT  |
// | start_time | TIMESTAMP | ●        |                                    |
// | end_time   | TIMESTAMP | ●        | CHECK > start_time                 |
// | created_at | TIMESTAMP | ●        | DEFAULT NOW()                      |
// | updated_at | TIMESTAMP | ●        | DEFAULT NOW()                      |

import {
  Column,
  CreateDateColumn,
  Entity,
  JoinColumn,
  ManyToOne,
  PrimaryGeneratedColumn,
  UpdateDateColumn,
} from "typeorm";
import { Movie } from "./movie.js";
import { Room } from "./room.js";

@Entity()
export class Screening {
  @PrimaryGeneratedColumn()
  id: number;

  @ManyToOne(() => Movie, { nullable: false, onDelete: "RESTRICT" })
  @JoinColumn({ name: "movie_id" })
  movie: Movie;

  @ManyToOne(() => Room, { nullable: false, onDelete: "RESTRICT" })
  @JoinColumn({ name: "room_id" })
  room: Room;

  @Column({ type: "timestamp", nullable: false })
  start_time: Date;

  @Column({ type: "timestamp", nullable: false })
  end_time: Date;

  @CreateDateColumn()
  created_at: Date;

  @UpdateDateColumn()
  updated_at: Date;

  constructor(
    id: number,
    movie: Movie,
    room: Room,
    start_time: Date,
    end_time: Date,
    created_at: Date,
    updated_at: Date
  ) {
    this.id = id;
    this.movie = movie;
    this.room = room;
    this.start_time = start_time;
    this.end_time = end_time;
    this.created_at = created_at;
    this.updated_at = updated_at;
  }
}
